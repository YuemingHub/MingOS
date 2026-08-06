# Family-Space 快照成本与信息损失实验

日期：2026-08-06  
来源：`YuemingHub/Family-Space@4e77e245bf4dfa49249e53a258e9ed575c428a41`

## 实验问题

MingOS 已经能够验证一个手工建立的外部 Space Bundle。下一步不是立即开发通用导入器，而是先回答：

1. 手工快照中有多少重复、确定性工作；
2. 原始资料在转译为 Space / Context / Intent 等对象时损失了多少信息；
3. 哪些部分适合自动化，哪些部分必须保留人工判断。

## 输入与输出

固定读取 3 个来源文件：

- `space-manifest.json`
- `CURRENT_PROJECT_STATUS.md`
- `docs/architecture/MINGOS_RELATIONSHIP.md`

首个试点手工形成 9 个资产：

- `SOURCE_LOCK.md`
- `space.json`
- `context-ledger.json`
- `intent-contract.json`
- `authorization.json`
- `task.json`
- `evidence.json`
- `handoff.json`
- `continuity-bundle.json`

其中 6 个主要是来源锁、授权、任务、证据、交接与 Bundle 等控制面资产；3 个涉及空间、上下文和意图的语义判断。

## 量化结果

- 来源文件：3
- 来源 manifest 顶层字段：15
- 原样保留字段：13
- 主动覆盖字段：1（`member_actor_ids`）
- MingOS Space Schema 不接收字段：1（`mingos_repository`）
- 从两个 Markdown 文件抽取的列表/引用型原子主张：39
- 现有 Context Ledger 可明确对应的来源主张：6
- 明确映射覆盖率：15.4%
- 未逐条进入结构化上下文的主张：33

未覆盖内容主要包括：

- 历史部署记录应如何解释；
- 当前重构与追溯原则；
- 重新进入真实用户前的安全、隐私、同意与发布门；
- Family-Space 与 MingOS 的完整职责清单；
- 禁止耦合项；
- 分阶段接入顺序。

因此，“Bundle 验证通过”只能证明结构闭包与引用完整，不能证明来源语义已被完整理解。

## 决定

### 自动化

实现只读 `snapshot analyze` 与 `snapshot scaffold`：

- 校验本地固定来源的 Git Blob SHA；
- 自动生成来源快照；
- 按 Space Schema 保真复制确定性字段；
- 抽取 Markdown 中的引用、项目符号与编号主张；
- 输出覆盖率、未映射主张和字段损失报告；
- 生成必须人工复核的清单。

### 不自动化

工具不得自动：

- 把文本断言升级为已确认事实；
- 推断人的真实意图；
- 授予 Agent 权限；
- 生成可执行任务；
- 声称语义完整；
- 创建“已完成”证据；
- 对来源仓库写入。

## 判断标准

只有当来源校验、字段复制、主张清单等确定性步骤被自动完成后，人工才进入真正需要判断的部分：

- 哪些主张是事实、决定、约束、历史说明或待确认推断；
- 哪些内容需要进入 Context Ledger；
- 当前 Intent 是什么；
- 谁可以执行什么；
- 完成标准与 Evidence 是什么。

这使自动化减少重复劳动，同时不把理解权和授权权交给导入器。
