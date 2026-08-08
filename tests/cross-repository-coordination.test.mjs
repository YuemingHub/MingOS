import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const coordinationPath = new URL('../docs/CROSS_REPOSITORY_COORDINATION.md', import.meta.url);
const coordination = await readFile(coordinationPath, 'utf8');

test('coordination snapshot pins the reviewed three-repository baselines', () => {
  assert.match(coordination, /7eb33ffc806db1da2fde488a617860ca34b76c0e/);
  assert.match(coordination, /82e34718a111f71fd9cd793115624780e2bac0b9/);
  assert.match(coordination, /081016ec672a3d2df7253f346393666cca72b234/);
  assert.match(coordination, /PR #157/);
  assert.match(coordination, /PR #158/);
  assert.match(coordination, /31259768376/);
});

test('coordination snapshot records the current Family revisable-understanding reality without promoting it', () => {
  assert.match(coordination, /缺失或不可归一化来源时 fail-closed/);
  assert.match(coordination, /新修正成为当前版本，旧版本变 `stale` 且 `ai_usable=0`/);
  assert.match(coordination, /旧版本仍可追溯但不再参与当前 AI 理解/);
  assert.match(coordination, /整条关联修订链都清除/);
  assert.match(coordination, /家长修正仍被记录为 report\/correction evidence/);
  assert.match(coordination, /这仍然是 Family-Space 的产品实现，不是 MingOS 新通用对象/);
});

test('coordination snapshot preserves repository responsibility boundaries', () => {
  assert.match(coordination, /MingOS 不拥有 Family-Space 的产品合并权/);
  assert.match(coordination, /不把 Family-specific profile、memory revision UI 或家庭阶段字段变成通用协议/);
  assert.match(coordination, /revision facade 和一次有效做法不会因为存在或通过测试就自动成为 MingOS 对象或 Foundation 原则/);
  assert.match(coordination, /Foundation 仅复核真正上升到原则、权利、安全或治理层的问题/);
});

test('coordination snapshot keeps human correction authority explicit', () => {
  assert.match(coordination, /系统能发现冲突并邀请家长澄清\/修正/);
  assert.match(coordination, /而不是让 AI 自动判断旧理解错误/);
  assert.match(coordination, /没有矛盾 \/ 你理解错了 \/ 情况变了 \/ 我不想处理/);

  const prohibitedSection = coordination.match(/### 当前禁止[\s\S]*?### 当前顺序/)?.[0] || '';
  assert.match(prohibitedSection, /让 AI 在没有家长确认的情况下自动合并、覆盖或判定互相冲突的家庭理解/);
  assert.match(prohibitedSection, /把当前 synthetic journey 测试表述为真实家庭验证/);
});

test('coordination snapshot does not revive stale execution assumptions', () => {
  assert.doesNotMatch(coordination, /#153 \/ #154 均基于旧基线/);
  assert.match(coordination, /旧 #153 \/ #154 已关闭，不再作为执行队列/);
  assert.doesNotMatch(coordination, /本次核验主干：`2558af58fb9fe44fcf66b50973e15768b77d4629`/);
});
