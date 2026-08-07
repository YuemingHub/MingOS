import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const coordinationPath = new URL('../docs/CROSS_REPOSITORY_COORDINATION.md', import.meta.url);
const coordination = await readFile(coordinationPath, 'utf8');

test('coordination snapshot pins the reviewed three-repository baselines', () => {
  assert.match(coordination, /7eb33ffc806db1da2fde488a617860ca34b76c0e/);
  assert.match(coordination, /9f64bca9b0926bd169bb6914043e756d23cdf902/);
  assert.match(coordination, /5b51a4c1507d87dede97961518786aed50f1a65e/);
  assert.match(coordination, /PR #152/);
  assert.match(coordination, /31179493804/);
  assert.match(coordination, /307a7933e6d50c3d7c46924524f8482300021e9d/);
});

test('coordination snapshot does not revive superseded execution queues', () => {
  assert.doesNotMatch(coordination, /当前唯一协调候选是 PR #18/);
  assert.doesNotMatch(coordination, /PR #118–#123 均仍为未合并 Draft/);
  assert.doesNotMatch(coordination, /当前主干：`4e77e245bf4dfa49249e53a258e9ed575c428a41`/);
});

test('Family-Space product evidence remains downstream evidence, not universal authority', () => {
  assert.match(coordination, /该产品结构尚不是 MingOS 通用协议或 Foundation 标准/);
  assert.match(coordination, /不能因为已经进入 `production` 就自动成为 MingOS Kernel 或 Foundation 规范/);
  assert.match(coordination, /不自行解释为“产品已完成”或“可以进入生产”/);
});
