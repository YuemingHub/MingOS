# Roadmap

## M0 — 可验证协议骨架（当前）

- JSON Schema：Space、Actor、Context Record、Intent Contract、Task、Evidence、Handoff；
- 示例：MingOS 自举空间、Family-Space 接入声明；
- 本地验证器、单元测试、CI；
- 仓库边界与 Agent 工作契约。

## M1 — 文件型参考运行时

- 创建和更新项目空间；
- 状态迁移与不变量校验；
- 任务、证据、handoff 的引用完整性；
- CLI：`ming init / validate / status / handoff`。

## M2 — 双 Agent 连续性实验

- Agent A 中断后，Agent B 仅依赖空间资产继续；
- 统计重复解释率、恢复成功率、证据完成率；
- Family-Space 作为第一个外部接入空间，不改家庭业务链路。

## M3 — 授权与能力适配

- 模型、Agent、MCP、Skill 与人类专业者统一为 Capability Adapter；
- 可撤销授权、审批点、预算和不可逆操作门；
- 运行轨迹与恢复点。

## 暂不进入路线

- 大而全的 Agent 平台；
- Skill/MCP 应用商店；
- 多租户企业后台；
- 以向量数据库等具体实现冒充“记忆协议”；
- 同时开发所有空间产品。
