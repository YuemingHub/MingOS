import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const bundle = 'examples/team-space/mingos-project/continuity-bundle.json';

test('bundle validate passes for self-hosting space', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['packages/cli/bin/ming.mjs', 'bundle', 'validate', bundle]);
  assert.match(stdout, /MingOS bundle validation passed: BUNDLE-0001/);
});

test('bundle inspect recovers intent, authorization and next action', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['packages/cli/bin/ming.mjs', 'bundle', 'inspect', bundle, '--json']);
  const result = JSON.parse(stdout);
  assert.equal(result.space.id, 'mingos-project');
  assert.equal(result.intent.id, 'INTENT-0001');
  assert.equal(result.next_actor_id, 'agent-continuity');
  assert.equal(result.authorization.status, 'active');
  assert.ok(result.intent.next_action.includes('Family-Space'));
  assert.deepEqual(result.blockers, []);
  assert.ok(result.next_actions.length > 0);
});
