# 当前状态

- 日期：2026-08-17
- 阶段：M0–M5 可验证内核与协议里程碑已完成；当前为 **Adoption Bridge V1**（MingOS Issue #33）与持续 authority subtraction
- 状态：可验证内核、连续性 CLI、两种外部来源模式、权威/时效/冲突报告、具名复核协议均已合并；新增 Foundation Proposed 源的三类权威 provisional 消费契约（人类可读契约 + machine-readable 契约 + 可执行语义压力场景）
- MingOS 自身（协议仓库）：不面向真实用户、无生产运行、无数据迁移
- Family-Space（第一个垂直实例）：真实家长=有（产品所有者），生产环境=有（2026-08-11 授权核验），阶段 S0 第二家庭准备
- 待人复核：0
- 已提交复核决定：3

## 当前能力

下一执行者无需读取原聊天，可以先运行：

```bash
npm run ming -- bundle validate examples/team-space/mingos-project/continuity-bundle.json
npm run ming -- bundle inspect examples/team-space/mingos-project/continuity-bundle.json --json
npm run ming -- snapshot analyze fixtures/family-space-snapshot-input/snapshot.config.json --json
npm run ming -- snapshot analyze fixtures/mingos-unified-snapshot-input/snapshot.config.json --json
```

生成只读快照与 pending 复核请求：

```bash
npm run ming -- source-review scaffold \
  fixtures/mingos-unified-snapshot-input/snapshot.config.json \
  --out .tmp/source-review \
  --space mingos-project \
  --created-by agent-continuity \
  --reviewer human-yueming \
  --created-at 2026-08-06T14:50:00Z
```

命令生成一份正式冲突报告和三份 pending 请求，不生成任何决定。

## 已完成

- MingOS M0 可验证内核已合并；
- 两轮跨 Agent 连续性实验及协议修复已合并；
- `bundle validate` 与 `bundle inspect` 已进入主干；
- Family-Space Manifest 模式和 mingos-unified 显式 Seed 模式均已验证；
- Snapshot CLI 可验证来源 Blob、字段保真、权威、时效、绝对日期和显式冲突候选；
- Family-Space 保持 39 条主张、6 条映射和 0 个冲突候选；
- mingos-unified 稳定产生 3 个冲突候选；
- `source-conflict-report` 与 `source-review` Schema 已进入主干；
- pending / submitted / revoked 状态和四类人类决定已建立机器不变量；
- CLI 可创建稳定冲突 ID、候选值 ID 和 pending 请求；
- 真实三个候选只生成 pending 请求，决定字段全部为空；
- active human 的合成决定通过，AI 冒充 reviewer 被拒绝；
- PR #14 已合并，提交为 `ec73647f55055676deb2fb2367ec15c97782d17e`；
- GitHub Actions run `31113972604` 的 29 项测试和全仓库示例验证全部通过。
- human-yueming 已对三个来源冲突分别提交 accept-value 决定；决定保持可撤回，原始候选与历史来源继续保留；
- Foundation #15/#12/#16 与 MingOS #17/#18 已通过最终 Review 并合入各自主干；Round 09 Kernel 仍全部为 Draft。
- Foundation main 已前进至 `4d50b9fa`（`1.0.0-alpha.19`，2026-08 reality rebase 后），MingOS 依赖基线已刷新；
- **Adoption Bridge V1（MingOS Issue #33）**：新建 `adoption-authority` schema、14 项三类权威 provisional 消费契约、kernel 纯函数语义判定与 29 个可执行场景测试，全部以 `foundation_conformance=false` 表达；旧协调 SHA/PR 事实已降为历史 provenance。

## 当前结论

MingOS 已证明：

1. Agent 可以创建“请谁复核什么”的请求，但不能伪造“这个人已经决定”；
2. 一般工程执行授权不能被转译为具体事实选择；
3. submitted 或 revoked 来源复核必须由 active human Actor 具名；
4. 接受候选值必须选择稳定 value ID 并引用支持来源；
5. 未决与补证请求是合法结果，不决定也是人的权利；
6. 撤回不删除旧决定，新的复核可以显式 supersede 旧记录；
7. 原始来源、历史表述和冲突报告始终保留；
8. 当前协议已抵达真实的人类决定门，后续自动扩建不能替代该门。
9. 三份具体 source-review 已由具名 human-yueming 提交，Foundation 与 MingOS 的跨仓引用、依赖基线和协调契约已进入主干。

## 当前边界

- Foundation、MingOS、Family-Space 保持分层；
- 当前不面向真实用户或生产决策；
- 来源仓库只读，不联网、不写入；
- 冲突只基于显式 topic/value，不使用模型相似度推断；
- `automatic_resolution` 固定为 false；
- source-review 始终 `revocable: true`；
- pending 请求不得携带决定、理由、选择值、证据或决定时间；
- 系统不得自动提交、撤回或 supersede 人类复核；
- 未经有效 Authorization，Agent 不得执行新任务；
- 没有 passed/accepted Evidence，不得标记 Task completed。

## 已提交的人类决定

- `SOURCE-REVIEW-mingos-unified-archive-2026-08-06-1`：`accept-value` → `VALUE-family-space-product-repository-1`；
- `SOURCE-REVIEW-mingos-unified-archive-2026-08-06-2`：`accept-value` → `VALUE-foundation-repository-2`；
- `SOURCE-REVIEW-mingos-unified-archive-2026-08-06-3`：`accept-value` → `VALUE-mingos-canonical-entrypoint-2`。

三份决定均由 `human-yueming` 提交，均保持 `revocable: true`。本次决定只确定当前事实基线，不代表生产放行、真实用户启动或后续平台能力自动获批。

## 当前推进条件

- Foundation 与 MingOS 的当前引用、依赖基线和协调入口已完成；Foundation 再次前进时必须重新生成依赖快照；
- Family-Space 继续由月明独立推进；总协调只接收 production 与 CURRENT_PROJECT_STATUS.md 的已验证事实；
- MingOS 保持无真实用户、无生产环境、无数据迁移与不自动部署边界；真实使用证据只存在于 Family-Space 产品层；
- 不因治理基线完成，就自动建设联网导入器、通用 UI、模型网关或通用 Agent 平台；
- Adoption Bridge 消费项保持 provisional：ADR-0029 与 AUTHORITY_MANIFEST 升为 Accepted/Stable 之前，任何 MingOS 运行时不得宣称 Foundation conformance 或 certification；
- 新增 authority 语义必须先通过 `tests/adoption-authority.test.mjs` 的可执行场景，再进入 schema 与契约，禁止以文档措辞替代可执行判定。
