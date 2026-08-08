import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const coordinationPath = new URL('../docs/CROSS_REPOSITORY_COORDINATION.md', import.meta.url);
const coordination = await readFile(coordinationPath, 'utf8');

test('coordination snapshot pins the reviewed three-repository baselines', () => {
  assert.match(coordination, /7eb33ffc806db1da2fde488a617860ca34b76c0e/);
  assert.match(coordination, /1201281c910790f26695bbca806421f39dd65d4f/);
  assert.match(coordination, /679c060a2bfa9e28ce7e0ea18be78d540a7efacf/);
  assert.match(coordination, /PR #157/);
  assert.match(coordination, /PR #158/);
  assert.match(coordination, /PR #159/);
  assert.match(coordination, /31261178839/);
});

test('coordination snapshot records revisable memory plus clarification-first behavior without promotion', () => {
  assert.match(coordination, /缺失或不可归一化来源时 fail-closed/);
  assert.match(coordination, /新修正成为当前版本，旧版本变 `stale` 且 `ai_usable=0`/);
  assert.match(coordination, /PR #159 增加 Family-only memory clarification gate/);
  assert.match(coordination, /普通好转、普通对比、家庭成员意见不同不会被包装成系统冲突/);
  assert.match(coordination, /`situation_changed` 与“之前理解错了”保持不同语义/);
  assert.match(coordination, /澄清检测是 read-only/);
  assert.match(coordination, /这仍然是 Family-Space 的产品实现，不是 MingOS 新通用对象/);
});

test('coordination snapshot preserves repository responsibility boundaries', () => {
  assert.match(coordination, /MingOS 不拥有 Family-Space 的产品合并权/);
  assert.match(coordination, /不把 Family-specific profile、memory revision UI、clarification gate 或家庭阶段字段变成通用协议/);
  assert.match(coordination, /revision facade、clarification gate 和一次有效做法不会因为存在或通过测试就自动成为 MingOS 对象或 Foundation 原则/);
  assert.match(coordination, /Foundation 仅复核真正上升到原则、权利、安全或治理层的问题/);
});

test('coordination snapshot keeps human clarification and correction authority explicit', () => {
  assert.match(coordination, /系统先承认不确定并请求澄清，而不是自己决定哪个版本才是真相/);
  assert.match(coordination, /情况后来变了 \/ 之前理解不准确 \/ 两个都成立 \/ 先不处理/);
  assert.match(coordination, /显式确认桥不得把自由文本自动翻译成记忆改写/);

  const prohibitedSection = coordination.match(/### 当前禁止[\s\S]*?### 当前顺序/)?.[0] || '';
  assert.match(prohibitedSection, /让 AI 在没有家长确认的情况下自动合并、覆盖、失效或判定互相冲突的家庭理解/);
  assert.match(prohibitedSection, /把“情况变了”自动重写成“之前谁理解错了”/);
  assert.match(prohibitedSection, /把当前 synthetic journey 测试表述为真实家庭验证/);
});

test('coordination snapshot does not revive stale execution assumptions', () => {
  assert.doesNotMatch(coordination, /#153 \/ #154 均基于旧基线/);
  assert.match(coordination, /旧 #153 \/ #154 已关闭，不再作为执行队列/);
  assert.doesNotMatch(coordination, /本次核验主干：`081016ec672a3d2df7253f346393666cca72b234`（PR #158）/);
});
