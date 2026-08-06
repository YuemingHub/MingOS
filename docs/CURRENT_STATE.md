# 当前状态

- 日期：2026-08-06
- 阶段：M0 bootstrap
- 状态：协议与验证骨架候选
- 真实用户：无
- 生产环境：无
- 数据迁移：无

## 当前目标

建立一个可以被机器验证、可以支撑跨 Agent 交接、且不混入家庭业务的 MingOS 最小内核。

## 已确定边界

- `YuemingHub/mingos-foundation` 是最高原则层；
- `YuemingHub/MingOS` 是跨空间操作底座；
- `YuemingHub/Family-Space` 是家庭领域产品；
- 当前不从 Family-Space 搬代码，只提炼经现实验证的公共协议；
- 当前不宣称可用于真实生命、高风险或生产决策。

## 下一验证

1. Schema 与示例全部通过 CI；
2. 用 `examples/team-space/mingos-project` 记录下一轮真实开发；
3. 完成一次 Agent A → Agent B 无聊天历史交接实验；
4. 再决定 M1 CLI 的最小实现。
