import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const coordinationPath = new URL('../docs/CROSS_REPOSITORY_COORDINATION.md', import.meta.url);
const coordination = await readFile(coordinationPath, 'utf8');

test('coordination snapshot pins the reviewed three-repository baselines', () => {
  assert.match(coordination, /7eb33ffc806db1da2fde488a617860ca34b76c0e/);
  assert.match(coordination, /7f73f9fb6061f438384ece5a7c8394120f939dc9/);
  assert.match(coordination, /09a8dfad65f52d49169ec8a4034c1d0b60c5317e/);
  assert.match(coordination, /PR #166 已合入/);
  assert.match(coordination, /PR #169 已关闭/);
  assert.match(coordination, /PR #178/);
  assert.match(coordination, /PR #171/);
  assert.doesNotMatch(coordination, /PR #166：Draft/);
  assert.doesNotMatch(coordination, /PR #169：Draft/);
  assert.doesNotMatch(coordination, /1e70c5933675db1591edb7dc3f3c63159e6240c5`（PR #165）/);
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
  assert.match(coordination, /不会因为存在或通过测试就自动成为 MingOS 对象或 Foundation 原则/);
  assert.match(coordination, /Foundation 仅复核真正上升到原则、权利、安全或治理层的问题/);
});

test('coordination snapshot rejects a second confirmation state machine', () => {
  assert.match(coordination, /不需要为了“澄清之后怎么办”再造 pending clarification 表、第二套 memory API 或自动确认状态机/);
  assert.match(coordination, /“我的 → 系统记下的内容”负责家长主动修正/);
  assert.match(coordination, /只有真实阻力出现时才补导航/);

  const prohibitedSection = coordination.match(/### 当前禁止[\s\S]*?### 当前顺序/)?.[0] || '';
  assert.match(prohibitedSection, /让 AI 在没有家长确认的情况下自动合并、覆盖、失效或判定互相冲突的家庭理解/);
  assert.match(prohibitedSection, /再造第二套 memory API、pending clarification 表或自动确认状态机/);
  assert.match(prohibitedSection, /把当前 synthetic journey 测试表述为真实家庭验证/);
});

test('coordination snapshot makes Family-Space the only active implementation mainline', () => {
  assert.match(coordination, /Family-Space 是唯一施工主线/);
  assert.match(coordination, /MingOS 仅在产品已证明跨空间通用缺口时补充/);
  assert.match(coordination, /Foundation 作为最高校准层，不为了体系完整性主动扩建/);
});

test('coordination snapshot enforces one merge-authoritative candidate per semantic boundary', () => {
  assert.match(coordination, /同一产品语义边界只允许一个当前 merge-authoritative candidate/);
  assert.match(coordination, /#168 \/ #175 \/ #177.*HOLD/);
  assert.match(coordination, /Lane A 当前集成候选：PR #178/);
  assert.match(coordination, /旧 PR 若已被较新 production 基线上的候选重建或覆盖，应标记 HOLD \/ SUPERSEDED/);

  const prohibitedSection = coordination.match(/### 当前禁止[\s\S]*?### 当前顺序/)?.[0] || '';
  assert.match(prohibitedSection, /同一父母可见语义边界同时合并两个或更多互相覆盖的 Draft PR/);
});

test('coordination snapshot treats legacy family classifiers as authority debt, not new core', () => {
  assert.match(coordination, /authority subtraction/);
  assert.match(coordination, /#181 \/ #182 \/ #184 \/ #186 \/ #187/);
  assert.match(coordination, /收回 legacy stage\/layer\/V2\/loop\/escalation 的隐藏正向权威/);
  assert.match(coordination, /不得演化成另一套分类器或状态机/);
  assert.match(coordination, /用旧 stage\/layer\/V2\/loop\/escalation 的默认分类恢复“家庭是什么”或“家长该做什么”的正向权威/);
});

test('coordination snapshot keeps the accepted Foundation mapping historical and requests a current re-audit', () => {
  assert.match(coordination, /GOV-0009-family-os-implementation-mapping\.md/);
  assert.match(coordination, /基于 2026-07-09 的 Family OS 文档快照/);
  assert.match(coordination, /Foundation Issue #17/);
  assert.match(coordination, /不能被误读成 2026-08-10 的当前实现结论/);
  assert.match(coordination, /不修改 GOV-0009 的历史权威含义/);
});
