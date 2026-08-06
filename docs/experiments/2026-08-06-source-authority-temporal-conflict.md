# 来源权威、时效与冲突提示实验

- 日期：2026-08-06
- 阶段：M4 candidate
- 来源写入：0
- 自动语义裁决：否
- 自动冲突消解：否

## 问题

前两轮外部空间试点已经证明 MingOS 可以固定仓库提交、文件 Blob、Space 身份和 Markdown 主张。但只知道“这段内容来自哪里”仍然不够。

`mingos-unified@250a59dff30b13a57d826ede7b396a4102ea03a4` 中存在明确的历史状态描述，例如：

- 把 `mingos-unified` 称为唯一总入口；
- 把家庭产品实现仓写为 `YuemingHub/Ming-os`；
- 把最高标准仓写为 `YuemingHub/Ming-Foundation`；
- 在 `2026-08-03` 的整理记录中说明仓库改名和归档仍待执行。

而 2026-08-06 的当前仓库事实已经变化：

- 通用系统仓为 `YuemingHub/MingOS`；
- 家庭产品仓为 `YuemingHub/Family-Space`；
- 最高标准仓为 `YuemingHub/mingos-foundation`。

历史资料本身没有错，但不能在缺少时间与权威上下文时被当成当前事实。

## 决定

本轮不引入模型判断“哪句话是真的”。改为增加三类显式、可验证元数据。

### 1. 来源权威

每个来源文件可以声明：

- `authority`：`current-fact-source`、`governance`、`reference`、`historical` 或 `unknown`；
- `valid_as_of`：该文件被确认有效的绝对日期；
- `review_after`：最晚复核日期；
- `current_fact_source_for`：只有当前事实源可以声明的议题列表。

### 2. 主张标注

工具继续完整提取 Markdown 引用、列表、编号项，并新增表格数据行提取。只有人工在配置中显式提供 `claim_annotations` 后，主张才获得：

- `topic`；
- `asserted_value`；
- `temporal_status`；
- `valid_as_of` / `valid_until`。

没有显式标注的文本只保持 `unreviewed`，不参与冲突判断。

### 3. 带来源的当前参考断言

配置可以提供 `reference_assertions`，但每一项必须包含：

- 唯一 ID；
- 议题和值；
- `source_ref`；
- 权威角色；
- 有效日期。

这不是让配置作者直接覆盖历史，而是让历史值与当前参考值在报告中并列。

## 确定性输出

Snapshot scaffold 新增：

```text
authority-report.json
temporal-report.json
conflict-report.json
```

### Authority Report

报告：

- 文件权威角色；
- 当前事实源覆盖议题；
- 未声明权威；
- 缺少有效日期；
- 到期或逾期复核；
- 同一议题多个当前事实源；
- 已过期参考断言。

### Temporal Report

报告：

- 来源中出现的 `YYYY-MM-DD` 与中文绝对日期；
- 日期相对快照日是过去、当天还是未来；
- 到期复核文件；
- 超过 `valid_until` 的主张和参考断言。

它不把“过去日期”自动解释为“错误”。

### Conflict Report

只在同一显式 `topic` 出现不同 `asserted_value` 时形成候选。每个值保留：

- 主张或参考断言 ID；
- 来源；
- 权威；
- 时间状态；
- 有效日期。

`automatic_resolution` 固定为 `false`。

## 隔离验证结果

在固定的 `mingos-unified` 两个来源文件上：

- 提取 Markdown 主张：36 条；
- 显式标注：5 条；
- 当前参考断言：3 条；
- 绝对日期：1 个，即 `2026-08-03`；
- 到期复核文件：2 个；
- 冲突候选：3 个；
- 自动冲突消解：关闭。

三个候选议题为：

1. MingOS 规范入口仓；
2. 家庭空间产品仓；
3. Foundation 仓库名称。

这些结果只说明“历史值与当前参考值不同”，不自动删除、改写或宣布历史记录错误。

## Family-Space 对照

Family-Space 配置声明：

- `space-manifest.json` 是空间身份当前事实源；
- `CURRENT_PROJECT_STATUS.md` 是真实用户、生产和对外服务状态的当前事实源；
- `MINGOS_RELATIONSHIP.md` 是治理边界来源。

该样本没有显式值冲突，冲突候选为 0；但因 Manifest 中仍有不被当前 Space Schema 接受的字段，人工复核仍然保留。

## 不做什么

- 不联网搜索“最新版”；
- 不按文件修改时间自动选择赢家；
- 不用模型相似度判断冲突；
- 不静默覆盖历史；
- 不自动创建 Context Ledger 事实；
- 不自动修改 Intent、Authorization、Task、Evidence 或 Handoff；
- 不修改任何来源仓库。

## 通过条件

- Family-Space 现有 39 条主张统计保持不变；
- Manifest 与 Seed 两种模式继续通过；
- 当前事实源议题可以确定性列出；
- 历史来源到期复核得到提示；
- 三个显式冲突候选可稳定复现；
- 没有显式 topic/value 时不生成语义冲突；
- 全部现有 Bundle、Kernel 和 Snapshot 回归通过。

GitHub Actions 通过前，本实验仍处于候选状态，不计入已完成能力。
