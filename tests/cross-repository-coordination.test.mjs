import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const coordinationPath = new URL('../docs/CROSS_REPOSITORY_COORDINATION.md', import.meta.url);
const auditPath = new URL('../docs/SHARED_CAPABILITY_AUDIT_2026-08-10.md', import.meta.url);
const coordination = await readFile(coordinationPath, 'utf8');
const audit = (await readFile(auditPath, 'utf8')).replace(/\r\n/g, '\n');

test('current coordination pins the reviewed repository baselines', () => {
  assert.match(coordination, /4d50b9faeabe1e17c3bfc94e50f1c161375616f7/);
  assert.match(coordination, /d4582ebfe84fc47a0559b941780d0393fd327f08/);
  assert.match(coordination, /23734f3d45f188cd841a90aed82d8481658379c8/);
  assert.match(coordination, /PR #27 已合入/);
  assert.match(coordination, /PR #29 已合入/);
  assert.match(coordination, /#205 Family Navigation authority contract/);
});

test('current coordination records real owner use without overclaiming evidence', () => {
  assert.match(coordination, /真实家长：有。产品所有者当前作为首位真实家长使用/);
  assert.match(coordination, /生产环境：有/);
  assert.match(coordination, /对外正式服务：有/);
  assert.match(coordination, /尚未扩大邀请/);
  assert.match(coordination, /一次真实使用只能证明“当前产品有人真实使用”，不能自动证明普遍有效、已完成、可规模化或 Foundation conformance/);
  assert.match(coordination, /自动测试仍只能使用合成数据或明确的内部测试数据/);
  assert.match(coordination, /未经单独授权不得读取、导出、迁移真实家庭内容/);
  assert.doesNotMatch(coordination, /当前无真实家长、无正式生产环境、无正式对外服务/);
});

test('current coordination preserves the family life loop and epistemic distinctions', () => {
  assert.match(coordination, /FACT \/ REPORT \/ FEELING \/ INTERPRETATION \/ INFERENCE \/ UNKNOWN \/ CORRECTION/);
  assert.match(coordination, /形成暂时、可修正的理解/);
  assert.match(coordination, /回到真实生活/);
  assert.match(coordination, /共同回望并修正理解/);
});

test('current coordination keeps repository responsibility boundaries', () => {
  assert.match(coordination, /Family-Space 为唯一施工主线/);
  assert.match(coordination, /MingOS 只在产品已经证明存在跨空间通用缺口时补充/);
  assert.match(coordination, /Foundation 继续作为最高校准层/);
  assert.match(coordination, /产品实现不得自动升级为 MingOS Core primitive/);
  assert.match(coordination, /家庭产品字段、prompt、profile、页面、revision facade、clarification gate、rights editor、Navigation 坐标和一次有效实现/);
});

test('current coordination enforces one merge-authoritative candidate per semantic boundary', () => {
  assert.match(coordination, /同一产品语义边界只允许一个当前 \*\*merge-authoritative candidate\*\*/);
  assert.match(coordination, /#205 Family Navigation authority contract.*替代已关闭 #194/);
  assert.match(coordination, /旧 PR 被较新 production 基线重建或吸收后，应关闭或标记 superseded/);
  assert.match(coordination, /同一父母可见语义边界同时合并多个互相覆盖的 Draft PR/);
});

test('current coordination treats legacy positive and negative authority as the same debt class', () => {
  assert.match(coordination, /authority subtraction/);
  assert.match(coordination, /分类本身既不能开处方，也不能下禁令/);
  assert.match(coordination, /自己的 category \/ confidence \/ output 不能成为 guard trigger/);
  assert.match(coordination, /旧模型是在\*\*做决定之前被切断\*\*，还是做完决定后只擦掉标签/);
  assert.match(coordination, /producer 把对象降成 `candidate \/ unknown \/ shadow` 后，consumer 有没有再次升级/);
  assert.match(coordination, /真实 consumer chain 和执行时序才是/);
});

test('current coordination keeps Safety source provenance distinct', () => {
  assert.match(coordination, /#204 Safety source boundary/);
  assert.match(coordination, /先有直接自杀阳性报告、后又否认/);
  assert.match(coordination, /直接阳性报告、后续否认、纯否认、家长推测/);
  assert.match(coordination, /lexical regex/);
});

test('accepted Foundation mapping remains historical and re-audit stays separate', () => {
  assert.match(coordination, /GOV-0009-family-os-implementation-mapping\.md/);
  assert.match(coordination, /2026-07-09 Family OS 快照/);
  assert.match(coordination, /Foundation Issue #17/);
  assert.match(coordination, /不直接改写 GOV-0009/);
});

test('dated 2026-08-10 shared audit remains provenance rather than current coordination authority', () => {
  assert.match(audit, /^# Shared Capability Audit — 2026-08-10/m);
  assert.match(audit, /Status: Draft evidence checkpoint/);
  assert.match(audit, /Family-Space `production`: `09a8dfad65f52d49169ec8a4034c1d0b60c5317e`/);
  assert.match(audit, /Accepted new Core candidates\n\nNone/);
  assert.match(audit, /authority subtraction before abstraction/);
  assert.match(audit, /`FamilyStage`, `FamilyLayer`, or generalized readiness classifier: rejected/);
  assert.match(audit, /`AuthorityDebt` as a runtime primitive: rejected/);

  assert.match(coordination, /本文件是三仓协作的导航、边界和\*\*当前协调事实入口\*\*/);
  assert.match(coordination, /只有当前独立证据 authority 可以激活保护/);
});
