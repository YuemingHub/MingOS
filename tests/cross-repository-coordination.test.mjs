import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const coordinationPath = new URL('../docs/CROSS_REPOSITORY_COORDINATION.md', import.meta.url);
const auditPath = new URL('../docs/SHARED_CAPABILITY_AUDIT_2026-08-10.md', import.meta.url);
const coordination = await readFile(coordinationPath, 'utf8');
const audit = await readFile(auditPath, 'utf8');

test('current coordination snapshot pins the reviewed three-repository baselines', () => {
  assert.match(coordination, /7eb33ffc806db1da2fde488a617860ca34b76c0e/);
  assert.match(coordination, /0707c39ef63357e279b01fc0f406f62124deb1ad/);
  assert.match(coordination, /57cdcedd5d0803347d24ca4d44773721d9751997/);
  assert.match(coordination, /PR #27 已合入/);
  assert.match(coordination, /PR #29 已合入/);
  assert.match(coordination, /PR #171 已关闭/);
  assert.match(coordination, /PR #205/);
  assert.match(coordination, /旧 #194 已退出 merge authority/);
  assert.doesNotMatch(coordination, /Family-Space `production`: `09a8dfad65f52d49169ec8a4034c1d0b60c5317e`/);
});

test('current coordination preserves the family-controlled revision journey without promoting it', () => {
  assert.match(coordination, /区分 FACT \/ REPORT \/ FEELING \/ INTERPRETATION \/ INFERENCE \/ UNKNOWN \/ CORRECTION/);
  assert.match(coordination, /系统先澄清，不自动判真、不自动写/);
  assert.match(coordination, /revision chain 产生新的当前版本/);
  assert.match(coordination, /旧版本退出当前 AI 上下文但保留必要历史/);
  assert.match(coordination, /这仍然是 Family-Space 产品实现和失败验证产生的协调证据，不是 MingOS 新通用对象/);
});

test('current coordination preserves repository responsibility boundaries', () => {
  assert.match(coordination, /MingOS 不拥有 Family-Space 的产品合并权/);
  assert.match(coordination, /不把 Family-Space 的产品实现自动提升为 MingOS Core/);
  assert.match(coordination, /家庭产品字段、提示词、profile、页面、revision facade、clarification gate、rights editor、Navigation 坐标和一次有效做法不会因为存在或通过测试就自动成为 MingOS 对象或 Foundation 原则/);
  assert.match(coordination, /Foundation 规定原则和判定边界；MingOS 将已接受要求转为协议/);
});

test('current coordination rejects duplicate confirmation and navigation state machines', () => {
  const prohibitedSection = coordination.match(/### 当前禁止[\s\S]*?### 当前顺序/)?.[0] || '';
  assert.match(prohibitedSection, /让 AI 在没有家长确认的情况下自动合并、覆盖、失效或判定互相冲突的家庭理解/);
  assert.match(prohibitedSection, /再造第二套 memory API、pending clarification 表、Family Navigation state machine 或自动确认状态机/);
  assert.match(prohibitedSection, /synthetic journey.*真实家庭验证/);
});

test('current coordination makes Family-Space the only active implementation mainline', () => {
  assert.match(coordination, /Family-Space 是唯一施工主线/);
  assert.match(coordination, /MingOS 仅在产品已证明跨空间通用缺口时补充/);
  assert.match(coordination, /Foundation 作为最高校准层，不为了体系完整性主动扩建/);
});

test('current coordination enforces one merge-authoritative candidate per semantic boundary', () => {
  assert.match(coordination, /同一产品语义边界只允许一个当前 merge-authoritative candidate/);
  assert.match(coordination, /PR #205 是 current-production Family Navigation authority contract 候选，已替代关闭的 #194/);
  assert.match(coordination, /旧 PR 被较新 production 基线重建或覆盖后应关闭\/标记 superseded/);

  const prohibitedSection = coordination.match(/### 当前禁止[\s\S]*?### 当前顺序/)?.[0] || '';
  assert.match(prohibitedSection, /同一父母可见语义边界同时合并两个或更多互相覆盖的 Draft PR/);
});

test('current coordination treats legacy classifiers as authority debt, including negative authority', () => {
  assert.match(coordination, /authority subtraction/);
  assert.match(coordination, /stage \/ layer \/ V2 \/ problem map \/ loop \/ referral shortcut/);
  assert.match(coordination, /分类本身既不能开处方，也不能下禁令/);
  assert.match(coordination, /旧模型是在做决定之前被切断，还是做完决定以后只擦掉标签/);
  assert.match(coordination, /producer 降低 authority 后，consumer 有没有再次升级它/);
  assert.match(coordination, /guard 的触发证据来自当前独立 authority/);
});

test('current coordination keeps the accepted Foundation mapping historical and requests a current re-audit', () => {
  assert.match(coordination, /GOV-0009-family-os-implementation-mapping\.md/);
  assert.match(coordination, /基于 2026-07-09 的 Family OS 文档快照/);
  assert.match(coordination, /Foundation Issue #17/);
  assert.match(coordination, /不能被误读成 2026-08-11 当前实现结论/);
  assert.match(coordination, /不修改 GOV-0009 的历史权威含义/);
});

test('dated 2026-08-10 shared audit remains historical evidence rather than current coordination authority', () => {
  assert.match(audit, /^# Shared Capability Audit — 2026-08-10/m);
  assert.match(audit, /Status: Draft evidence checkpoint/);
  assert.match(audit, /Family-Space `production`: `09a8dfad65f52d49169ec8a4034c1d0b60c5317e`/);
  assert.match(audit, /Accepted new Core candidates\n\nNone/);
  assert.match(audit, /authority subtraction before abstraction/);
  assert.match(audit, /`FamilyStage`, `FamilyLayer`, or generalized readiness classifier: rejected/);
  assert.match(audit, /`AuthorityDebt` as a runtime primitive: rejected/);
  assert.match(audit, /a second independent non-family Life Space/);

  // The dated audit is provenance. The current contract is the authority for
  // later coordination corrections such as independent-evidence guard activation.
  assert.match(coordination, /本文件是三仓协作的导航、边界和执行状态入口/);
  assert.match(coordination, /只有当前独立证据 authority 可以激活保护/);
});
