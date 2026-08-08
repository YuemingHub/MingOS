import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const coordinationPath = new URL('../docs/CROSS_REPOSITORY_COORDINATION.md', import.meta.url);
const coordination = await readFile(coordinationPath, 'utf8');

test('coordination snapshot pins the reviewed three-repository baselines', () => {
  assert.match(coordination, /7eb33ffc806db1da2fde488a617860ca34b76c0e/);
  assert.match(coordination, /bc09d38426ef5c8632552a87b7fa848ac45f0155/);
  assert.match(coordination, /2558af58fb9fe44fcf66b50973e15768b77d4629/);
  assert.match(coordination, /PR #156/);
  assert.match(coordination, /31243182227/);
});

test('coordination snapshot records the current Family product reality without promoting it', () => {
  assert.match(coordination, /Today 直接开口 → Dialogue → action candidate 可选择\/拒绝 → 第二次回来 → 我家 → 回望 → 我的/);
  assert.match(coordination, /家长可见家庭片段只从 scoped life record 或 confirmed private memory 投影/);
  assert.match(coordination, /raw inference 与 legacy profile label 不自动成为家庭事实/);
  assert.match(coordination, /该产品结构尚不是 MingOS 通用协议或 Foundation 标准/);
  assert.match(coordination, /不能因为已经进入 `production` 就自动成为 MingOS Kernel 或 Foundation 规范/);
});

test('coordination snapshot preserves repository responsibility boundaries', () => {
  assert.match(coordination, /MingOS 不拥有 Family-Space 的产品合并权/);
  assert.match(coordination, /不把 Family-specific profile 字段变成通用协议/);
  assert.match(coordination, /Family-Space 的 evidence-first 做法只有在跨场景重复成立/);
  assert.match(coordination, /Foundation 仅复核真正上升到原则、权利、安全或治理层的问题/);
});

test('coordination snapshot does not revive stale or unsafe execution assumptions', () => {
  assert.doesNotMatch(coordination, /当前唯一协调候选是 PR #18/);
  assert.doesNotMatch(coordination, /PR #118–#123 均仍为未合并 Draft/);
  assert.doesNotMatch(coordination, /本次核验主干：`5b51a4c1507d87dede97961518786aed50f1a65e`/);
  assert.match(coordination, /#153 \/ #154 均基于旧基线/);
  assert.match(coordination, /不得把它们直接当作下一执行队列/);

  const prohibitedSection = coordination.match(/### 当前禁止[\s\S]*?### 当前顺序/)?.[0] || '';
  assert.match(prohibitedSection, /把当前 synthetic journey 测试表述为真实家庭验证/);
});
