import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const coordinationPath = new URL('../docs/CROSS_REPOSITORY_COORDINATION.md', import.meta.url);
const coordination = await readFile(coordinationPath, 'utf8');

test('coordination snapshot pins the reviewed three-repository baselines', () => {
  assert.match(coordination, /7eb33ffc806db1da2fde488a617860ca34b76c0e/);
  assert.match(coordination, /6253fbd8ffe4bf9f47a2cd3075f808347561e4be/);
  assert.match(coordination, /f62341a8a0d35750be901cf96f04626692f2b6fc/);
  assert.match(coordination, /PR #158/);
  assert.match(coordination, /PR #159/);
  assert.match(coordination, /PR #160/);
  assert.match(coordination, /31262209996/);
});

test('coordination snapshot records the proven family-controlled revision journey without promotion', () => {
  assert.match(coordination, /PR #159：Family-only memory clarification gate/);
  assert.match(coordination, /PR #160 将 #158 与 #159 串成跨模块回归/);
  assert.match(coordination, /clarification 零写入/);
  assert.match(coordination, /旧版本退出 AI context/);
  assert.match(coordination, /下一轮 AI 只看到家长修正后的当前版本/);
  assert.match(coordination, /这仍然是 Family-Space 产品实现和验证结果，不是 MingOS 新通用对象/);
});

test('coordination snapshot preserves repository responsibility boundaries', () => {
  assert.match(coordination, /MingOS 不拥有 Family-Space 的产品合并权/);
  assert.match(coordination, /不把 Family-specific profile、memory revision UI、clarification gate、Family rights editor 或家庭阶段字段变成通用协议/);
  assert.match(coordination, /revision facade、clarification gate、rights editor 和一次有效做法不会因为存在或通过测试就自动成为 MingOS 对象或 Foundation 原则/);
  assert.match(coordination, /Foundation 仅复核真正上升到原则、权利、安全或治理层的问题/);
});

test('coordination snapshot rejects a second confirmation state machine', () => {
  assert.match(coordination, /不需要为了“澄清之后怎么办”再造 pending clarification 表、第二套 memory API 或自动确认状态机/);
  assert.match(coordination, /“我的 → 系统记下的内容”负责家长主动修正/);
  assert.match(coordination, /若真实家长使用证明从对话到“我的”存在明显寻找成本/);
  assert.match(coordination, /只能导航到既有权利入口/);

  const prohibitedSection = coordination.match(/### 当前禁止[\s\S]*?### 当前顺序/)?.[0] || '';
  assert.match(prohibitedSection, /让 AI 在没有家长确认的情况下自动合并、覆盖、失效或判定互相冲突的家庭理解/);
  assert.match(prohibitedSection, /再造第二套 memory API、pending clarification 表或自动确认状态机/);
  assert.match(prohibitedSection, /把当前 synthetic journey 测试表述为真实家庭验证/);
});

test('coordination snapshot returns Family execution to the real parent journey', () => {
  assert.match(coordination, /Family 下一产品优先级回到“第一次进入 → 第一句话 → 前三轮 → 第二次回来”/);
  assert.match(coordination, /评估“我想纠正系统理解”是否能自然走到“我的 → 系统记下的内容”/);
  assert.doesNotMatch(coordination, /下一产品步优先补齐“澄清后的显式确认桥”/);
  assert.doesNotMatch(coordination, /在最新 `production` 上设计最小显式确认桥/);
});
