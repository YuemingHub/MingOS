# Evidence and Continuity Protocol

## 完成证据

Task 只有在满足全部完成标准并引用至少一个有效 Evidence 时，才允许进入 `completed`。

Evidence 可以是：

- 自动测试结果；
- 构建产物；
- Git commit / PR；
- 结构化检查报告；
- 人工验收记录；
- 外部系统回执。

AI 自述“已经完成”不是证据。

## 连续性

Handoff 必须让另一个执行者在不读取原聊天历史的前提下回答：

- 为什么做；
- 已完成什么；
- 哪些事实可信；
- 哪些仍是假设；
- 当前阻断是什么；
- 下一步是什么；
- 应读取哪些证据。

## Continuity Bundle

跨 Agent 交接不得只给一段摘要。每次交接应生成一个 `continuity-bundle`，至少覆盖：

- Space；
- Actor；
- Active Authorization；
- Intent Contract；
- Context Ledger；
- Tasks；
- Evidence；
- Handoff。

Bundle 必须记录源 revision。若状态、授权或证据在该 revision 后发生变化，旧 Bundle 不得被默认为当前事实。
