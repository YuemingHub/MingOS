import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { analyzeSnapshot, scaffoldSnapshot } from '../packages/cli/src/snapshot.mjs';

const config = 'fixtures/family-space-snapshot-input/snapshot.config.json';
const unifiedConfig = 'fixtures/mingos-unified-snapshot-input/snapshot.config.json';

test('snapshot analyze quantifies deterministic work and semantic loss', async () => {
  const report = await analyzeSnapshot(config);
  assert.equal(report.cost.source_files, 3);
  assert.equal(report.cost.generated_artifacts, 9);
  assert.equal(report.cost.mechanical_artifacts, 6);
  assert.equal(report.cost.semantic_artifacts, 3);
  assert.equal(report.semantic_coverage.extracted_markdown_claims, 39);
  assert.equal(report.semantic_coverage.mapped_claims, 6);
  assert.equal(report.semantic_coverage.unmapped_claims, 33);
  assert.equal(report.semantic_coverage.annotated_claims, 3);
  assert.equal(report.manifest_fidelity.source_mode, 'source-manifest');
  assert.equal(report.manifest_fidelity.source_fields, 15);
  assert.deepEqual(report.manifest_fidelity.overridden_fields, ['member_actor_ids']);
  assert.deepEqual(report.manifest_fidelity.unsupported_fields, ['mingos_repository']);
  assert.deepEqual(report.authority_report.current_fact_sources['production-status'], ['CURRENT_PROJECT_STATUS.md']);
  assert.deepEqual(report.authority_report.review_due_files, []);
  assert.equal(report.conflict_report.candidate_count, 0);
  assert.equal(report.conflict_report.automatic_resolution, false);
  assert.equal(report.decision.automate_deterministic_snapshot, true);
  assert.equal(report.decision.automate_semantic_interpretation, false);
  assert.equal(report.decision.automatic_conflict_resolution, false);
  assert.equal(report.decision.manual_review_required, true);
});

test('snapshot accepts canonical Git blob SHA from CRLF text worktrees', async () => {
  const original = JSON.parse(await readFile(config, 'utf8'));
  const temp = await mkdtemp(path.join(process.cwd(), '.tmp-crlf-snapshot-'));
  try {
    const sources = path.join(temp, 'sources');
    await mkdir(sources, { recursive: true });
    const originalRoot = path.dirname(path.resolve(config));
    for (const source of original.source.files) {
      const content = await readFile(path.join(originalRoot, source.local_path), 'utf8');
      const crlfContent = content.replace(/\r?\n/g, '\r\n');
      await writeFile(path.join(sources, path.basename(source.local_path)), crlfContent, 'utf8');
      source.local_path = `sources/${path.basename(source.local_path)}`;
    }
    delete original.existing_pilot_dir;
    const tempConfig = path.join(temp, 'snapshot.config.json');
    await writeFile(tempConfig, JSON.stringify(original));
    const relativeConfig = path.relative(process.cwd(), tempConfig);
    await assert.doesNotReject(() => analyzeSnapshot(relativeConfig));
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
test('snapshot scaffold creates provenance and review assets without granting authority', async () => {
  const temp = await mkdtemp(path.join(process.cwd(), '.tmp-output-'));
  const relative = path.relative(process.cwd(), temp);
  try {
    const result = await scaffoldSnapshot(config, relative);
    assert.deepEqual(result.files.sort(), [
      'REVIEW_REQUIRED.md',
      'authority-report.json',
      'claims.json',
      'conflict-report.json',
      'coverage-report.json',
      'source-snapshot.json',
      'space.json',
      'temporal-report.json'
    ]);
    const space = JSON.parse(await readFile(path.join(temp, 'space.json'), 'utf8'));
    assert.equal(space.space_id, 'family-space');
    assert.deepEqual(space.member_actor_ids, ['agent-continuity']);
    assert.equal(Object.hasOwn(space, 'mingos_repository'), false);
    const authority = JSON.parse(await readFile(path.join(temp, 'authority-report.json'), 'utf8'));
    assert.deepEqual(authority.current_fact_sources['real-user-status'], ['CURRENT_PROJECT_STATUS.md']);
    const conflict = JSON.parse(await readFile(path.join(temp, 'conflict-report.json'), 'utf8'));
    assert.equal(conflict.automatic_resolution, false);
    const review = await readFile(path.join(temp, 'REVIEW_REQUIRED.md'), 'utf8');
    assert.match(review, /never chooses a winner or overwrites history/);
    assert.match(review, /never grants authority automatically/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test('snapshot analyze rejects tampered source content', async () => {
  const configPath = path.resolve(config);
  const original = JSON.parse(await readFile(configPath, 'utf8'));
  const temp = await mkdtemp(path.join(process.cwd(), '.tmp-snapshot-'));
  try {
    const sources = path.join(temp, 'sources');
    await mkdir(sources, { recursive: true });
    const originalRoot = path.dirname(configPath);
    for (const source of original.source.files) {
      const content = await readFile(path.join(originalRoot, source.local_path));
      await writeFile(path.join(sources, path.basename(source.local_path)), content);
      source.local_path = `sources/${path.basename(source.local_path)}`;
    }
    await writeFile(path.join(sources, 'CURRENT_PROJECT_STATUS.md'), 'tampered');
    delete original.existing_pilot_dir;
    const tempConfig = path.join(temp, 'snapshot.config.json');
    await writeFile(tempConfig, JSON.stringify(original));
    const relativeConfig = path.relative(process.cwd(), tempConfig);
    await assert.rejects(() => analyzeSnapshot(relativeConfig), /blob SHA mismatch/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test('snapshot accepts an explicit reviewed seed when an external repository has no manifest', async () => {
  const report = await analyzeSnapshot(unifiedConfig);
  assert.equal(report.source.repository, 'YuemingHub/mingos-unified');
  assert.equal(report.manifest_fidelity.source_mode, 'explicit-seed');
  assert.equal(report.space.space_id, 'mingos-unified-archive');
  assert.equal(report.space.space_type, 'custom');
  assert.ok(report.semantic_coverage.extracted_markdown_claims > 30);
  assert.equal(report.semantic_coverage.mapped_claims, 0);
  assert.equal(report.semantic_coverage.annotated_claims, 5);
  assert.deepEqual(report.authority_report.review_due_files, ['README.md', 'REPOSITORY-MAP.md']);
  assert.equal(report.temporal_report.past_mentions, 1);
  assert.equal(report.conflict_report.candidate_count, 3);
  assert.equal(report.conflict_report.automatic_resolution, false);
  assert.equal(report.decision.automate_semantic_interpretation, false);
  assert.equal(report.decision.automatic_conflict_resolution, false);
  assert.equal(report.decision.manual_review_required, true);
});

test('explicit-seed scaffold records authority, temporal and conflict review requirements', async () => {
  const temp = await mkdtemp(path.join(process.cwd(), '.tmp-unified-output-'));
  const relative = path.relative(process.cwd(), temp);
  try {
    await scaffoldSnapshot(unifiedConfig, relative);
    const snapshot = JSON.parse(await readFile(path.join(temp, 'source-snapshot.json'), 'utf8'));
    assert.equal(snapshot.space_source_mode, 'explicit-seed');
    assert.equal(snapshot.snapshot_at, '2026-08-06');
    const authority = JSON.parse(await readFile(path.join(temp, 'authority-report.json'), 'utf8'));
    assert.equal(authority.warnings.filter((warning) => warning.code === 'source-review-due').length, 2);
    const temporal = JSON.parse(await readFile(path.join(temp, 'temporal-report.json'), 'utf8'));
    assert.equal(temporal.date_mentions[0].date, '2026-08-03');
    const conflict = JSON.parse(await readFile(path.join(temp, 'conflict-report.json'), 'utf8'));
    assert.equal(conflict.candidate_count, 3);
    assert.equal(conflict.automatic_resolution, false);
    const review = await readFile(path.join(temp, 'REVIEW_REQUIRED.md'), 'utf8');
    assert.match(review, /Confirm each source authority role/);
    assert.match(review, /does not claim semantic completeness or resolve conflicts automatically/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test('historical sources cannot claim current-fact-source topics', async () => {
  const configPath = path.resolve(unifiedConfig);
  const original = JSON.parse(await readFile(configPath, 'utf8'));
  const temp = await mkdtemp(path.join(process.cwd(), '.tmp-authority-'));
  try {
    const sources = path.join(temp, 'sources');
    await mkdir(sources, { recursive: true });
    const originalRoot = path.dirname(configPath);
    for (const source of original.source.files) {
      const content = await readFile(path.join(originalRoot, source.local_path));
      await writeFile(path.join(sources, path.basename(source.local_path)), content);
      source.local_path = `sources/${path.basename(source.local_path)}`;
    }
    original.source.files[0].current_fact_source_for = ['canonical-entrypoint'];
    const tempConfig = path.join(temp, 'snapshot.config.json');
    await writeFile(tempConfig, JSON.stringify(original));
    const relativeConfig = path.relative(process.cwd(), tempConfig);
    await assert.rejects(
      () => analyzeSnapshot(relativeConfig),
      /current_fact_source_for requires authority=current-fact-source/
    );
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
