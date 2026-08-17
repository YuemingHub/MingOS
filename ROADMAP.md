# Roadmap

## M0 — 可验证协议骨架（已完成）

- JSON Schema：Space、Actor、Context Record、Intent Contract、Task、Evidence、Handoff；
- 示例：MingOS 自举空间、Family-Space 接入声明；
- 本地验证器、单元测试、CI；
- 仓库边界与 Agent 工作契约。

## M1 — 文件型参考运行时（已完成）

- 创建和更新项目空间；
- 状态迁移与不变量校验；
- 任务、证据、handoff 的引用完整性；
- CLI：`ming init / validate / status / handoff`。

## M2 — 双 Agent 连续性实验（已完成）

- Agent A 中断后，Agent B 仅依赖空间资产继续；
- 统计重复解释率、恢复成功率、证据完成率；
- Family-Space 作为第一个外部接入空间，不改家庭业务链路。

## M3 — 授权与能力适配（已完成）

- 模型、Agent、MCP、Skill 与人类专业者统一为 Capability Adapter；
- 可撤销授权、审批点、预算和不可逆操作门；
- 运行轨迹与恢复点。

## M4 — Source Review 与人工决定门（已完成）

- `source-conflict-report` 与 `source-review` Schema、pending/submitted/revoked 状态机；
- 具名 human reviewer、可撤回决定、supersede 语义；
- 三份具体来源复核由 human-yueming 提交并保持 revocable。

## M5 — Adoption Bridge（当前）

- Foundation Proposed 源的三类权威 provisional 消费契约（`adoption-authority` schema + 契约 + 人类可读契约）；
- kernel 纯函数语义判定与 ≥18 个可执行语义压力场景（当前 29 个测试）；
- authority subtraction：旧协调 SHA/PR 事实降为 provenance，协调文档只保留当前基线；
- 全部以 `foundation_conformance=false` 表达，源升为 Accepted/Stable 前不宣称 conformance。

## 暂不进入路线

- 大而全的 Agent 平台；
- Skill/MCP 应用商店；
- 多租户企业后台；
- 以向量数据库等具体实现冒充“记忆协议”；
- 同时开发所有空间产品。
