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

const AUTHORITY_ROLES = new Set([
  'current-fact-source',
  'governance',
  'reference',
  'historical',
  'unknown'
]);

const TEMPORAL_STATUSES = new Set(['current', 'historical', 'unknown']);
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

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

function normalizeDate(value, field) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) {
    throw new Error(`${field} must use YYYY-MM-DD`);
  }
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`${field} is not a valid calendar date: ${value}`);
  }
  return value;
}

function compareDates(left, right) {
  return left.localeCompare(right);
}

function validateStringArray(value, field) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.trim() === '')) {
    throw new Error(`${field} must be an array of non-empty strings`);
  }
  return [...new Set(value)];
}

function isScalar(value) {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
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
  const lines = content.split(/\r?\n/);
  let heading = '';
  let inCode = false;
  for (const [index, raw] of lines.entries()) {
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
    let text = quote?.[1] ?? list?.[1] ?? null;

    if (!text && /^\|.*\|$/.test(line)) {
      const next = lines[index + 1]?.trim() ?? '';
      const separator = /^\|(?:\s*:?-+:?\s*\|)+$/.test(line);
      const header = /^\|(?:\s*:?-+:?\s*\|)+$/.test(next);
      if (!separator && !header) {
        const cells = line.slice(1, -1).split('|').map((cell) => cell.trim());
        if (cells.every((cell) => cell.length > 0)) text = cells.join(' | ');
      }
    }

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

function extractAbsoluteDates(content, sourcePath, snapshotDate) {
  const mentions = [];
  const seen = new Set();
  for (const [index, raw] of content.split(/\r?\n/).entries()) {
    const patterns = [
      /\b(20\d{2}-\d{2}-\d{2})\b/g,
      /(20\d{2})年(\d{1,2})月(\d{1,2})日/g
    ];
    for (const pattern of patterns) {
      for (const match of raw.matchAll(pattern)) {
        const normalized = match.length === 2
          ? match[1]
          : `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
        let date;
        try {
          date = normalizeDate(normalized, `${sourcePath}:L${index + 1}`);
        } catch {
          continue;
        }
        const key = `${index + 1}:${date}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const comparison = compareDates(date, snapshotDate);
        mentions.push({
          source_path: sourcePath,
          line: index + 1,
          raw: match[0],
          date,
          relation_to_snapshot: comparison < 0 ? 'past' : comparison > 0 ? 'future' : 'same-day'
        });
      }
    }
  }
  return mentions;
}

async function loadConfig(configFile, root) {
  const repositoryRoot = path.resolve(root);
  const configPath = resolveInside(repositoryRoot, configFile);
  const config = await readJson(configPath);
  const configDir = path.dirname(configPath);
  if (!config.snapshot_id || !config.source?.repository || !config.source?.revision) {
    throw new Error('snapshot config requires snapshot_id, source.repository and source.revision');
  }
  config.snapshot_at = normalizeDate(config.snapshot_at, 'snapshot_at');
  if (!config.snapshot_at) throw new Error('snapshot config requires snapshot_at');
  if (!Array.isArray(config.source.files) || config.source.files.length === 0) {
    throw new Error('snapshot config requires at least one source file');
  }
  if (config.space_seed !== undefined && (config.space_seed === null || typeof config.space_seed !== 'object' || Array.isArray(config.space_seed))) {
    throw new Error('space_seed must be an object when provided');
  }
  if (config.claim_annotations !== undefined && (config.claim_annotations === null || typeof config.claim_annotations !== 'object' || Array.isArray(config.claim_annotations))) {
    throw new Error('claim_annotations must be an object when provided');
  }
  if (config.reference_assertions !== undefined && !Array.isArray(config.reference_assertions)) {
    throw new Error('reference_assertions must be an array when provided');
  }
  return { repositoryRoot, configPath, configDir, config };
}

function normalizeSourceMetadata(source, snapshotDate) {
  const authority = source.authority ?? 'unknown';
  if (!AUTHORITY_ROLES.has(authority)) {
    throw new Error(`${source.path}: unsupported authority role ${authority}`);
  }
  const validAsOf = normalizeDate(source.valid_as_of, `${source.path}.valid_as_of`);
  const reviewAfter = normalizeDate(source.review_after, `${source.path}.review_after`);
  const currentFactSourceFor = validateStringArray(source.current_fact_source_for, `${source.path}.current_fact_source_for`);
  if (currentFactSourceFor.length > 0 && authority !== 'current-fact-source') {
    throw new Error(`${source.path}: current_fact_source_for requires authority=current-fact-source`);
  }
  let reviewStatus = 'unscheduled';
  if (reviewAfter) {
    const comparison = compareDates(reviewAfter, snapshotDate);
    reviewStatus = comparison < 0 ? 'overdue' : comparison === 0 ? 'due' : 'scheduled';
  }
  return {
    authority,
    valid_as_of: validAsOf,
    review_after: reviewAfter,
    review_status: reviewStatus,
    current_fact_source_for: currentFactSourceFor
  };
}

async function verifySources(config, configDir) {
  const files = [];
  const claims = [];
  const dateMentions = [];
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
    const metadata = normalizeSourceMetadata(source, config.snapshot_at);
    files.push({
      path: source.path,
      local_path: path.relative(configDir, localFile).replaceAll(path.sep, '/'),
      role: source.role,
      blob_sha: actualBlobSha,
      bytes: content.length,
      ...metadata
    });
    dateMentions.push(...extractAbsoluteDates(content.toString('utf8'), source.path, config.snapshot_at));

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
  return { files, claims, dateMentions, manifest };
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

function normalizeClaimAnnotations(config, claims) {
  const annotations = config.claim_annotations ?? {};
  const claimById = new Map(claims.map((claim) => [claim.claim_id, claim]));
  for (const claimId of Object.keys(annotations)) {
    if (!claimById.has(claimId)) throw new Error(`claim annotation ID not found: ${claimId}`);
  }

  return claims.map((claim) => {
    const annotation = annotations[claim.claim_id];
    if (!annotation) return { ...claim, annotation: null };
    if (!annotation.topic || typeof annotation.topic !== 'string') {
      throw new Error(`${claim.claim_id}: annotation requires topic`);
    }
    if (!Object.hasOwn(annotation, 'asserted_value') || !isScalar(annotation.asserted_value)) {
      throw new Error(`${claim.claim_id}: annotation asserted_value must be a JSON scalar`);
    }
    const temporalStatus = annotation.temporal_status ?? 'unknown';
    if (!TEMPORAL_STATUSES.has(temporalStatus)) {
      throw new Error(`${claim.claim_id}: unsupported temporal_status ${temporalStatus}`);
    }
    const validAsOf = normalizeDate(annotation.valid_as_of, `${claim.claim_id}.valid_as_of`);
    const validUntil = normalizeDate(annotation.valid_until, `${claim.claim_id}.valid_until`);
    if (validAsOf && validUntil && compareDates(validAsOf, validUntil) > 0) {
      throw new Error(`${claim.claim_id}: valid_as_of must not be after valid_until`);
    }
    return {
      ...claim,
      annotation: {
        topic: annotation.topic,
        asserted_value: annotation.asserted_value,
        temporal_status: temporalStatus,
        valid_as_of: validAsOf,
        valid_until: validUntil,
        note: annotation.note ?? null
      }
    };
  });
}

function normalizeReferenceAssertions(config) {
  const seen = new Set();
  return (config.reference_assertions ?? []).map((assertion, index) => {
    const prefix = `reference_assertions[${index}]`;
    if (!assertion.assertion_id || typeof assertion.assertion_id !== 'string') throw new Error(`${prefix} requires assertion_id`);
    if (seen.has(assertion.assertion_id)) throw new Error(`duplicate reference assertion ID: ${assertion.assertion_id}`);
    seen.add(assertion.assertion_id);
    if (!assertion.topic || typeof assertion.topic !== 'string') throw new Error(`${prefix} requires topic`);
    if (!Object.hasOwn(assertion, 'asserted_value') || !isScalar(assertion.asserted_value)) {
      throw new Error(`${prefix}.asserted_value must be a JSON scalar`);
    }
    if (!assertion.source_ref || typeof assertion.source_ref !== 'string') throw new Error(`${prefix} requires source_ref`);
    const authority = assertion.authority ?? 'unknown';
    if (!AUTHORITY_ROLES.has(authority)) throw new Error(`${prefix}: unsupported authority role ${authority}`);
    const validAsOf = normalizeDate(assertion.valid_as_of, `${prefix}.valid_as_of`);
    const validUntil = normalizeDate(assertion.valid_until, `${prefix}.valid_until`);
    if (validAsOf && validUntil && compareDates(validAsOf, validUntil) > 0) {
      throw new Error(`${prefix}: valid_as_of must not be after valid_until`);
    }
    return {
      assertion_id: assertion.assertion_id,
      topic: assertion.topic,
      asserted_value: assertion.asserted_value,
      source_ref: assertion.source_ref,
      authority,
      valid_as_of: validAsOf,
      valid_until: validUntil,
      note: assertion.note ?? null
    };
  });
}

function buildAuthorityReport(files, referenceAssertions, snapshotDate) {
  const warnings = [];
  const currentFactSources = new Map();
  for (const file of files) {
    if (file.authority === 'unknown') {
      warnings.push({ code: 'unknown-authority', source_path: file.path, message: 'source authority is not declared' });
    }
    if (!file.valid_as_of) {
      warnings.push({ code: 'missing-valid-as-of', source_path: file.path, message: 'source has no explicit valid_as_of date' });
    }
    if (['due', 'overdue'].includes(file.review_status)) {
      warnings.push({ code: 'source-review-due', source_path: file.path, message: `source review is ${file.review_status}` });
    }
    for (const topic of file.current_fact_source_for) {
      const paths = currentFactSources.get(topic) ?? [];
      paths.push(file.path);
      currentFactSources.set(topic, paths);
    }
  }
  for (const [topic, paths] of currentFactSources.entries()) {
    if (paths.length > 1) {
      warnings.push({ code: 'multiple-current-fact-sources', topic, source_paths: paths, message: 'multiple files claim current-fact-source authority for the same topic' });
    }
  }
  for (const assertion of referenceAssertions) {
    if (assertion.valid_until && compareDates(assertion.valid_until, snapshotDate) < 0) {
      warnings.push({ code: 'expired-reference-assertion', assertion_id: assertion.assertion_id, message: 'reference assertion expired before snapshot_at' });
    }
  }
  return {
    snapshot_at: snapshotDate,
    files,
    current_fact_sources: Object.fromEntries([...currentFactSources.entries()].sort(([a], [b]) => a.localeCompare(b))),
    review_due_files: files.filter((file) => ['due', 'overdue'].includes(file.review_status)).map((file) => file.path),
    warnings
  };
}

function buildConflictReport(claims, files, referenceAssertions) {
  const fileByPath = new Map(files.map((file) => [file.path, file]));
  const records = [];
  for (const claim of claims) {
    if (!claim.annotation) continue;
    const source = fileByPath.get(claim.source_path);
    records.push({
      record_kind: 'claim',
      record_id: claim.claim_id,
      topic: claim.annotation.topic,
      asserted_value: claim.annotation.asserted_value,
      source_ref: claim.claim_id,
      authority: source?.authority ?? 'unknown',
      temporal_status: claim.annotation.temporal_status,
      valid_as_of: claim.annotation.valid_as_of ?? source?.valid_as_of ?? null,
      valid_until: claim.annotation.valid_until
    });
  }
  for (const assertion of referenceAssertions) {
    records.push({
      record_kind: 'reference-assertion',
      record_id: assertion.assertion_id,
      topic: assertion.topic,
      asserted_value: assertion.asserted_value,
      source_ref: assertion.source_ref,
      authority: assertion.authority,
      temporal_status: 'current',
      valid_as_of: assertion.valid_as_of,
      valid_until: assertion.valid_until
    });
  }

  const byTopic = new Map();
  for (const record of records) {
    const topicRecords = byTopic.get(record.topic) ?? [];
    topicRecords.push(record);
    byTopic.set(record.topic, topicRecords);
  }

  const candidates = [];
  for (const [topic, topicRecords] of byTopic.entries()) {
    const values = new Map();
    for (const record of topicRecords) {
      const key = JSON.stringify(record.asserted_value);
      const group = values.get(key) ?? { asserted_value: record.asserted_value, records: [] };
      group.records.push(record);
      values.set(key, group);
    }
    if (values.size > 1) candidates.push({ topic, values: [...values.values()] });
  }

  return {
    annotated_claims: claims.filter((claim) => claim.annotation).length,
    reference_assertions: referenceAssertions.length,
    candidate_count: candidates.length,
    candidates,
    automatic_resolution: false
  };
}

function buildTemporalReport(files, dateMentions, claims, referenceAssertions, snapshotDate) {
  const potentiallyStaleClaims = claims.filter((claim) => {
    const validUntil = claim.annotation?.valid_until;
    return validUntil && compareDates(validUntil, snapshotDate) < 0;
  }).map((claim) => claim.claim_id);
  const expiredReferenceAssertions = referenceAssertions.filter((assertion) =>
    assertion.valid_until && compareDates(assertion.valid_until, snapshotDate) < 0
  ).map((assertion) => assertion.assertion_id);
  return {
    snapshot_at: snapshotDate,
    date_mentions: dateMentions,
    past_mentions: dateMentions.filter((mention) => mention.relation_to_snapshot === 'past').length,
    same_day_mentions: dateMentions.filter((mention) => mention.relation_to_snapshot === 'same-day').length,
    future_mentions: dateMentions.filter((mention) => mention.relation_to_snapshot === 'future').length,
    review_due_files: files.filter((file) => ['due', 'overdue'].includes(file.review_status)).map((file) => file.path),
    potentially_stale_claims: potentiallyStaleClaims,
    expired_reference_assertions: expiredReferenceAssertions
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
  const claims = normalizeClaimAnnotations(config, verified.claims);
  const referenceAssertions = normalizeReferenceAssertions(config);
  const unmappedClaims = claims.filter((claim) => !mapped.has(claim.claim_id));
  const authorityReport = buildAuthorityReport(verified.files, referenceAssertions, config.snapshot_at);
  const conflictReport = buildConflictReport(claims, verified.files, referenceAssertions);
  const temporalReport = buildTemporalReport(verified.files, verified.dateMentions, claims, referenceAssertions, config.snapshot_at);

  return {
    snapshot_id: config.snapshot_id,
    snapshot_at: config.snapshot_at,
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
      extracted_markdown_claims: claims.length,
      mapped_claims: mapped.size,
      unmapped_claims: unmappedClaims.length,
      annotated_claims: conflictReport.annotated_claims,
      coverage_ratio: claims.length === 0 ? 1 : mapped.size / claims.length
    },
    authority_report: authorityReport,
    temporal_report: temporalReport,
    conflict_report: conflictReport,
    decision: {
      automate_deterministic_snapshot: pilot.mechanical_artifacts >= 4 || pilot.revision_occurrences >= 3,
      automate_semantic_interpretation: false,
      automatic_conflict_resolution: false,
      manual_review_required:
        sourceMode === 'explicit-seed' ||
        unmappedClaims.length > 0 ||
        spaceResult.unsupportedFields.length > 0 ||
        authorityReport.warnings.length > 0 ||
        conflictReport.candidate_count > 0
    },
    claims,
    reference_assertions: referenceAssertions,
    space: spaceResult.space
  };
}

function renderReview(report) {
  const percent = (report.semantic_coverage.coverage_ratio * 100).toFixed(1);
  return `# Snapshot review required

- Snapshot: \`${report.snapshot_id}\` at ${report.snapshot_at}
- Source: \`${report.source.repository}@${report.source.revision}\`
- Space source mode: ${report.manifest_fidelity.source_mode}
- Verified source files: ${report.cost.source_files}
- Existing generated artifacts: ${report.cost.generated_artifacts}
- Mechanical artifacts: ${report.cost.mechanical_artifacts}
- Extracted markdown claims: ${report.semantic_coverage.extracted_markdown_claims}
- Explicitly mapped claims: ${report.semantic_coverage.mapped_claims}
- Explicitly annotated claims: ${report.semantic_coverage.annotated_claims}
- Coverage: ${percent}%
- Authority warnings: ${report.authority_report.warnings.length}
- Review-due source files: ${report.temporal_report.review_due_files.length}
- Conflict candidates: ${report.conflict_report.candidate_count}
- Unsupported source fields: ${report.manifest_fidelity.unsupported_fields.join(', ') || 'none'}

## Human decisions still required

1. Confirm that an explicit seed accurately identifies the space when the source has no manifest.
2. Confirm each source authority role, valid-as-of date and review schedule.
3. Review conflict candidates; the report never chooses a winner or overwrites history.
4. Confirm which extracted claims should become Context Ledger facts, decisions, constraints or historical notes.
5. Decide the next Intent, Authorization and Task; the scaffold never grants authority automatically.
6. Only after review, create Evidence, Handoff and Continuity Bundle.

The scaffold verifies deterministic provenance and exposes temporal risk. It does not claim semantic completeness or resolve conflicts automatically.
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
      snapshot_at: report.snapshot_at,
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
      claims: report.claims,
      reference_assertions: report.reference_assertions
    },
    'coverage-report.json': {
      snapshot_id: report.snapshot_id,
      cost: report.cost,
      manifest_fidelity: report.manifest_fidelity,
      semantic_coverage: report.semantic_coverage,
      decision: report.decision
    },
    'authority-report.json': report.authority_report,
    'temporal-report.json': report.temporal_report,
    'conflict-report.json': report.conflict_report,
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
