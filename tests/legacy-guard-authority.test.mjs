import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const coordinationUrl = new URL('../docs/CROSS_REPOSITORY_COORDINATION.md', import.meta.url);

const CANONICAL = '导航可以组织证据；旧模型可以提供假设；只有当前独立证据 authority 可以激活保护。分类本身既不能开处方，也不能下禁令。';

test('legacy classifiers cannot regain authority by being renamed negative guards', async () => {
  const text = await readFile(coordinationUrl, 'utf8');

  assert.equal(
    text.includes('只保留有证据的负向保护或兼容价值'),
    false,
    'coordination contract must not grant negative runtime authority back to a legacy classifier',
  );

  assert.equal(
    text.includes(CANONICAL),
    true,
    'coordination contract must require independent current evidence authority before a protection can activate',
  );
});

test('coordination correction stays product-evidence scoped rather than creating a Core primitive', async () => {
  const text = await readFile(coordinationUrl, 'utf8');

  assert.match(text, /reuse-before-build|复用优先/i);
  assert.match(text, /不得.*(?:自动|直接).*(?:MingOS Core|Core primitive)|不.*(?:自动|直接).*(?:MingOS Core|Core primitive)/i);
});
