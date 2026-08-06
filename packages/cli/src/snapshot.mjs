import { createHash } from 'node:crypto';
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CONTROL_PLANE_FILES = new Set([
  'SOURCE_LOCK.md',
  'authorization.json',
  'task.json',
  'evidence.json',
  'handoff.json',
  'continuity-bundle.json'
]);

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

function resolveInside(root, value) {
  const base = path.resolve(root);
  const resolved = path.resolve(base, value);
  if (resolved !== base && !resolved.startsWith(`${base}${path.sep}`)) {
    throw new Error(`path escapes allowed root: ${value}`);
  }
  return resolved;
}

function gitBlobSha(buffer) {
  const header = Buffer.from(`blob ${buffer.length}\0`, 'utf8');
  return createHash('sha1').update(header).update(buffer).digest('hex');
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

function extractMarkdownClaims(content, sourcePath) {
  const claims = [];
  let heading = '';
  let inCode = false;
  for (const [index, raw] of content.split(/\r?\n/).entries()) {
    const lineNumber = index + 1;
    const line = raw.trim();
    if (line.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode || !line) continue;
    if (line.startsWith('#')) {
      heading = line.replace(/^#+\s*/, '').trim();
      continue;
    }

    const quote = line.match(/^>\s*(.+)$/);
    const list = line.match(/^(?:[-*]|\d+\.)\s+(.+)$/);
    const text = quote?.[1] ?? list?.[1];
    if (!text) continue;
    const normalized = text.replace(/[*_`]/g, '').replace(/[；。]\s*$/, '').trim();
    claims.push({
      claim_id: `${sourcePath}:L${lineNumber}`,
      source_path: sourcePath,
      line: lineNumber,
      heading,
      text: normalized,
      status: 'unreviewed'
    });
  }
  return claims;
}

async function loadConfig(configFile, root) {
  const repositoryRoot = path.resolve(root);
  const configPath = resolveInside(repositoryRoot, configFile);
  const config = await readJson(configPath);
  const configDir = path.dirname(configPath);
  if (!config.snapshot_id || !config.source?.repository || !config.source?.revision) {
    throw new Error('snapshot config requires snapshot_id, source.repository and source.revision');
  }
  if (!Array.isArray(config.source.files) || config.source.files.length === 0) {
    throw new Error('snapshot config requires at least one source file');
  }
  if (config.space_seed !== undefined && (config.space_seed === null || typeof config.space_seed !== 'object' || Array.isArray(config.space_seed))) {
    throw new Error('space_seed must be an object when provided');
  }
  return { repositoryRoot, configPath, configDir, config };
}

async function verifySources(config, configDir) {
  const files = [];
  const claims = [];
  let manifest = null;

  for (const source of config.source.files) {
    if (!source.path || !source.local_path || !source.blob_sha || !source.role) {
      throw new Error('each source file requires path, local_path, blob_sha and role');
    }
    const localFile = resolveInside(configDir, source.local_path);
    const content = await readFile(localFile);
    const actualBlobSha = gitBlobSha(content);
    if (actualBlobSha !== source.blob_sha) {
      throw new Error(`${source.path}: blob SHA mismatch; expected ${source.blob_sha}, got ${actualBlobSha}`);
    }
    files.push({
      path: source.path,
      local_path: path.relative(configDir, localFile).replaceAll(path.sep, '/'),
      role: source.role,
      blob_sha: actualBlobSha,
      bytes: content.length
    });

    if (source.role === 'space-manifest') {
      if (manifest) throw new Error('snapshot config may contain only one space-manifest source');
      manifest = JSON.parse(content.toString('utf8'));
    } else if (source.path.endsWith('.md')) {
      claims.push(...extractMarkdownClaims(content.toString('utf8'), source.path));
    }
  }

  if (!manifest && !config.space_seed) {
    throw new Error('snapshot config requires either role=space-manifest or an explicit space_seed');
  }
  if (manifest && config.space_seed) {
    throw new Error('snapshot config must not provide both space-manifest and space_seed');
  }
  return { files, claims, manifest };
}

async function buildSpace(sourceSpace, config, repositoryRoot, sourceMode) {
  const schema = await readJson(path.join(repositoryRoot, 'schemas', 'space.schema.json'));
  const allowed = new Set(Object.keys(schema.properties ?? {}));
  const required = new Set(schema.required ?? []);
  const space = {};
  const preservedFields = [];
  const unsupportedFields = [];
  const overriddenFields = [];

  for (const [key, value] of Object.entries(sourceSpace)) {
    if (!allowed.has(key)) {
      unsupportedFields.push(key);
      continue;
    }
    space[key] = value;
    preservedFields.push(key);
  }

  for (const [key, value] of Object.entries(config.space_overrides ?? {})) {
    if (!allowed.has(key)) throw new Error(`space override is not allowed by schema: ${key}`);
    if (Object.hasOwn(space, key) && JSON.stringify(space[key]) !== JSON.stringify(value)) {
      overriddenFields.push(key);
      const index = preservedFields.indexOf(key);
      if (index >= 0) preservedFields.splice(index, 1);
    }
    space[key] = value;
  }

  const missingRequiredFields = [...required].filter((key) => !Object.hasOwn(space, key));
  if (missingRequiredFields.length > 0) {
    throw new Error(`${sourceMode} space is missing required fields: ${missingRequiredFields.join(', ')}`);
  }

  return { space, preservedFields, unsupportedFields, overriddenFields, missingRequiredFields, sourceMode };
}

async function countExistingPilot(config, repositoryRoot) {
  if (!config.existing_pilot_dir) {
    return { generated_artifacts: 0, mechanical_artifacts: 0, semantic_artifacts: 0, revision_occurrences: 0 };
  }
  const pilotDir = resolveInside(repositoryRoot, config.existing_pilot_dir);
  const files = await walk(pilotDir);
  let mechanical = 0;
  let revisionOccurrences = 0;
  for (const file of files) {
    const name = path.basename(file);
    if (CONTROL_PLANE_FILES.has(name)) mechanical += 1;
    const content = await readFile(file, 'utf8');
    revisionOccurrences += content.split(config.source.revision).length - 1;
  }
  return {
    generated_artifacts: files.length,
    mechanical_artifacts: mechanical,
    semantic_artifacts: files.length - mechanical,
    revision_occurrences: revisionOccurrences
  };
}

export async function analyzeSnapshot(configFile, { root = process.cwd() } = {}) {
  const { repositoryRoot, configDir, config } = await loadConfig(configFile, root);
  const verified = await verifySources(config, configDir);
  const sourceMode = verified.manifest ? 'source-manifest' : 'explicit-seed';
  const sourceSpace = verified.manifest ?? config.space_seed;
  const spaceResult = await buildSpace(sourceSpace, config, repositoryRoot, sourceMode);
  const pilot = await countExistingPilot(config, repositoryRoot);
  const mapped = new Set(config.mapped_claim_ids ?? []);
  const unknownMappings = [...mapped].filter((id) => !verified.claims.some((claim) => claim.claim_id === id));
  if (unknownMappings.length > 0) throw new Error(`mapped claim IDs not found: ${unknownMappings.join(', ')}`);
  const unmappedClaims = verified.claims.filter((claim) => !mapped.has(claim.claim_id));

  return {
    snapshot_id: config.snapshot_id,
    source: {
      repository: config.source.repository,
      branch: config.source.branch ?? null,
      revision: config.source.revision,
      files: verified.files
    },
    cost: {
      source_files: verified.files.length,
      generated_artifacts: pilot.generated_artifacts,
      mechanical_artifacts: pilot.mechanical_artifacts,
      semantic_artifacts: pilot.semantic_artifacts,
      repeated_revision_occurrences: pilot.revision_occurrences
    },
    manifest_fidelity: {
      source_mode: sourceMode,
      source_fields: Object.keys(sourceSpace).length,
      exact_preserved_fields: spaceResult.preservedFields,
      overridden_fields: spaceResult.overriddenFields,
      unsupported_fields: spaceResult.unsupportedFields,
      missing_required_fields: spaceResult.missingRequiredFields
    },
    semantic_coverage: {
      extracted_markdown_claims: verified.claims.length,
      mapped_claims: mapped.size,
      unmapped_claims: unmappedClaims.length,
      coverage_ratio: verified.claims.length === 0 ? 1 : mapped.size / verified.claims.length
    },
    decision: {
      automate_deterministic_snapshot: pilot.mechanical_artifacts >= 4 || pilot.revision_occurrences >= 3,
      automate_semantic_interpretation: false,
      manual_review_required: sourceMode === 'explicit-seed' || unmappedClaims.length > 0 || spaceResult.unsupportedFields.length > 0
    },
    claims: verified.claims,
    space: spaceResult.space
  };
}

function renderReview(report) {
  const percent = (report.semantic_coverage.coverage_ratio * 100).toFixed(1);
  return `# Snapshot review required

- Snapshot: \`${report.snapshot_id}\`
- Source: \`${report.source.repository}@${report.source.revision}\`
- Space source mode: ${report.manifest_fidelity.source_mode}
- Verified source files: ${report.cost.source_files}
- Existing generated artifacts: ${report.cost.generated_artifacts}
- Mechanical artifacts: ${report.cost.mechanical_artifacts}
- Extracted markdown claims: ${report.semantic_coverage.extracted_markdown_claims}
- Explicitly mapped claims: ${report.semantic_coverage.mapped_claims}
- Coverage: ${percent}%
- Unsupported source fields: ${report.manifest_fidelity.unsupported_fields.join(', ') || 'none'}

## Human decisions still required

1. Confirm that an explicit seed accurately identifies the space when the source has no manifest.
2. Confirm which extracted claims should become Context Ledger facts, decisions, constraints or historical notes.
3. Decide the next Intent, Authorization and Task; the scaffold never grants authority automatically.
4. Review unsupported or overridden source fields.
5. Only after review, create Evidence, Handoff and Continuity Bundle.

The scaffold verifies deterministic provenance. It does not claim semantic completeness.
`;
}

export async function scaffoldSnapshot(configFile, outputDir, { root = process.cwd(), force = false } = {}) {
  if (!outputDir) throw new Error('snapshot scaffold requires --out <directory>');
  const report = await analyzeSnapshot(configFile, { root });
  const repositoryRoot = path.resolve(root);
  const target = resolveInside(repositoryRoot, outputDir);
  await mkdir(target, { recursive: true });

  const outputs = {
    'source-snapshot.json': {
      schema_version: '0.1.0',
      kind: 'source-snapshot',
      snapshot_id: report.snapshot_id,
      repository: report.source.repository,
      branch: report.source.branch,
      revision: report.source.revision,
      space_source_mode: report.manifest_fidelity.source_mode,
      files: report.source.files
    },
    'space.json': report.space,
    'claims.json': {
      schema_version: '0.1.0',
      kind: 'source-claims',
      snapshot_id: report.snapshot_id,
      claims: report.claims
    },
    'coverage-report.json': {
      snapshot_id: report.snapshot_id,
      cost: report.cost,
      manifest_fidelity: report.manifest_fidelity,
      semantic_coverage: report.semantic_coverage,
      decision: report.decision
    },
    'REVIEW_REQUIRED.md': renderReview(report)
  };

  for (const [name, content] of Object.entries(outputs)) {
    const file = path.join(target, name);
    try {
      await access(file);
      if (!force) throw new Error(`refusing to overwrite existing file: ${path.relative(repositoryRoot, file)}`);
    } catch (error) {
      if (error.code !== 'ENOENT' && !String(error.message).startsWith('refusing')) throw error;
      if (String(error.message).startsWith('refusing')) throw error;
    }
    const body = typeof content === 'string' ? content : `${JSON.stringify(content, null, 2)}\n`;
    await writeFile(file, body, 'utf8');
  }

  return { report, outputDir: path.relative(repositoryRoot, target).replaceAll(path.sep, '/'), files: Object.keys(outputs) };
}
