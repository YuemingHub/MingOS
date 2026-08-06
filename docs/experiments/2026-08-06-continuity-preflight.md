# 第一次跨 Agent 连续性实验

## 实验约束

实验判断阶段不读取原聊天内容，只使用 Issue #2 指定的仓库资产：当前状态、空间、意图、上下文、授权、任务、证据与 handoff。

## 能够恢复的内容

- MingOS 的目标是建立跨空间、可验证、可交接的公共内核；
- Foundation 是最高原则层，MingOS 是跨空间底座，Family-Space 是家庭领域产品；
- M0 已建立 Schema、验证内核、测试、示例与 CI；
- 无真实用户、无生产、无数据迁移。

## 发现的失败

1. **状态过时**：`CURRENT_STATE.md`、Intent 与 Handoff 仍称 PR 待合并，实际 PR 已合并。
2. **责任主体缺失**：Issue 允许的读取清单不含 Actor 文件，`human-yueming` 与 `agent-bootstrap` 无法从输入中解析。
3. **授权不可连续**：`AUTH-0001` 只覆盖旧分支 `agent/m0-bootstrap-v0.1`，不能授权下一 Agent 执行新任务。
4. **证据不可复核**：`EVIDENCE-0001` 使用“CI 将复验”的未来时态，URI 只指向 workflow 文件，不指向实际成功运行。

因此，第一次实验没有被判定为“无损成功”。Agent 能理解方向，但不能在不越权、不猜测的前提下继续执行。

## 协议修复

- 新增 `continuity-bundle` Schema，显式列出状态、空间、Actor、Authorization、Intent、Context、Task、Evidence 与 Handoff；
- Bundle 必须记录源 revision 和下一执行主体；
- Handoff 必须记录 actor、authorization、task 引用以及状态快照时间；
- 内核检查 Bundle 是否包含完整种类、引用是否可解析、下一主体是否拥有 active Authorization；
- 更新状态、意图、上下文、证据与 handoff，消除已知陈旧信息。

## 结论

MingOS 的第一项真实价值不是“保存更多聊天”，而是检测出：一个项目看似有文档，但实际无法合法、可信地继续。下一次实验应从单一 Continuity Bundle 进入，禁止人工补充背景。
