import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { analyzeSnapshot, scaffoldSnapshot } from '../packages/cli/src/snapshot.mjs';

const config = 'fixtures/family-space-snapshot-input/snapshot.config.json';

test('snapshot analyze quantifies deterministic work and semantic loss', async () => {
  const report = await analyzeSnapshot(config);
  assert.equal(report.cost.source_files, 3);
  assert.equal(report.cost.generated_artifacts, 9);
  assert.equal(report.cost.mechanical_artifacts, 6);
  assert.equal(report.cost.semantic_artifacts, 3);
  assert.equal(report.semantic_coverage.extracted_markdown_claims, 39);
  assert.equal(report.semantic_coverage.mapped_claims, 6);
  assert.equal(report.semantic_coverage.unmapped_claims, 33);
  assert.equal(report.manifest_fidelity.source_fields, 15);
  assert.deepEqual(report.manifest_fidelity.overridden_fields, ['member_actor_ids']);
  assert.deepEqual(report.manifest_fidelity.unsupported_fields, ['mingos_repository']);
  assert.equal(report.decision.automate_deterministic_snapshot, true);
  assert.equal(report.decision.automate_semantic_interpretation, false);
  assert.equal(report.decision.manual_review_required, true);
});

test('snapshot scaffold creates provenance and review assets without granting authority', async () => {
  const temp = await mkdtemp(path.join(process.cwd(), '.tmp-output-'));
  const relative = path.relative(process.cwd(), temp);
  try {
    const result = await scaffoldSnapshot(config, relative);
    assert.deepEqual(result.files.sort(), [
      'REVIEW_REQUIRED.md',
      'claims.json',
      'coverage-report.json',
      'source-snapshot.json',
      'space.json'
    ]);
    const space = JSON.parse(await readFile(path.join(temp, 'space.json'), 'utf8'));
    assert.equal(space.space_id, 'family-space');
    assert.deepEqual(space.member_actor_ids, ['agent-continuity']);
    assert.equal(Object.hasOwn(space, 'mingos_repository'), false);
    const review = await readFile(path.join(temp, 'REVIEW_REQUIRED.md'), 'utf8');
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
    await import('node:fs/promises').then(({ mkdir }) => mkdir(sources, { recursive: true }));
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
