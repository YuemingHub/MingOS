import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const bundle = 'examples/team-space/mingos-project/continuity-bundle.json';
const familyBundle = 'examples/family-space-pilot/continuity-bundle.json';

test('bundle validate passes for self-hosting space', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['packages/cli/bin/ming.mjs', 'bundle', 'validate', bundle]);
  assert.match(stdout, /MingOS bundle validation passed: BUNDLE-0001/);
});

test('bundle inspect recovers accepted source decisions and explicit merge gate', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['packages/cli/bin/ming.mjs', 'bundle', 'inspect', bundle, '--json']);
  const result = JSON.parse(stdout);
  assert.equal(result.space.id, 'mingos-project');
  assert.equal(result.intent.id, 'INTENT-0001');
  assert.equal(result.next_actor_id, 'agent-continuity');
  assert.equal(result.authorization.status, 'active');
  assert.ok(typeof result.intent.next_action === 'string' && result.intent.next_action.length > 0);
  assert.equal(result.blockers.length, 1);
  assert.ok(result.blockers[0].includes('Draft PR'));
  assert.equal(result.source_reviews.length, 3);
  assert.ok(result.source_reviews.every((review) => review.status === 'submitted'));
  assert.ok(result.source_reviews.every((review) => review.decision === 'accept-value'));
  assert.ok(result.source_reviews.every((review) => typeof review.selected_value_ref === 'string'));
  assert.ok(result.next_actions.length > 0);
});

test('bundle validate passes for read-only Family-Space pilot', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['packages/cli/bin/ming.mjs', 'bundle', 'validate', familyBundle]);
  assert.match(stdout, /MingOS bundle validation passed: BUNDLE-FAMILY-PILOT-0001/);
});

test('Family-Space pilot preserves domain and non-production boundaries', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['packages/cli/bin/ming.mjs', 'bundle', 'inspect', familyBundle, '--json']);
  const result = JSON.parse(stdout);
  assert.equal(result.space.id, 'family-space');
  assert.equal(result.space.purpose, '让家庭在持续关系中被理解、被支持，并形成现实可行的下一步');
  assert.ok(result.space.boundaries.includes('家庭专业判断和生命回复逻辑保留在 Family-Space'));
  assert.ok(result.space.boundaries.includes('真实家长与生产运行存在于 Family-Space 产品层（CURRENT_PROJECT_STATUS.md 为准），本示例不含真实家庭数据'));
  assert.ok(result.authorization.resource_scope.some((scope) => scope.includes('read-only@4e77e245')));
  assert.deepEqual(result.blockers, []);
});

test('examples validation uses portable artifact paths', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['packages/kernel/src/validate.mjs', 'examples']);
  assert.match(stdout, /MingOS validation passed: \d+ documents/);
});
