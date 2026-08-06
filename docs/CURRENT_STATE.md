# 当前状态

- 日期：2026-08-06
- 阶段：M4 source authority and conflict reporting complete
- 状态：可验证内核、连续性 CLI、两种外部来源模式、来源权威/时效/冲突报告均已合并
- 真实用户：无
- 生产环境：无
- 数据迁移：无

## 当前能力

下一执行者无需读取原聊天，可以先运行：

```bash
npm run ming -- bundle validate examples/team-space/mingos-project/continuity-bundle.json
npm run ming -- bundle inspect examples/team-space/mingos-project/continuity-bundle.json --json
npm run ming -- snapshot analyze fixtures/family-space-snapshot-input/snapshot.config.json --json
npm run ming -- snapshot analyze fixtures/mingos-unified-snapshot-input/snapshot.config.json --json
```

生成确定性只读脚手架：

```bash
npm run ming -- snapshot scaffold \
  fixtures/family-space-snapshot-input/snapshot.config.json \
  --out .tmp/family-space-snapshot

npm run ming -- snapshot scaffold \
  fixtures/mingos-unified-snapshot-input/snapshot.config.json \
  --out .tmp/unified-archive-snapshot
```

脚手架现在包括：

```text
source-snapshot.json
space.json
claims.json
coverage-report.json
authority-report.json
temporal-report.json
conflict-report.json
REVIEW_REQUIRED.md
```

## 已完成

- MingOS M0 可验证内核已合并；
- 两轮跨 Agent 连续性实验及协议修复已合并；
- 零依赖 `bundle validate` 与 `bundle inspect` CLI 已进入主干；
- Family-Space Manifest 模式的只读外部空间试点已合并；
- Family-Space 快照成本实验已完成：3 个来源文件、9 个试点资产、6 个机械控制面资产；
- `snapshot analyze` 与 `snapshot scaffold` 已进入主干；
- `mingos-unified` 作为第二个 custom knowledge/archive space 完成显式 Seed 验证；
- 无 Manifest 来源可通过显式 `space_seed` 接入；
- 来源文件现在可声明权威角色、有效日期、复核日期和当前事实源议题；
- Snapshot CLI 可抽取绝对日期、提示到期复核，并输出显式冲突候选；
- Family-Space 保持 39 条主张、6 条映射、3 条当前状态标注和 0 个冲突候选；
- mingos-unified 固定样本提取 36 条主张、5 条显式标注、3 条当前参考断言、1 个绝对日期、2 个到期复核文件和 3 个冲突候选；
- PR #12 已合并，提交为 `8944c8b145c96a5e5af11855cd41c4b626c661f0`；
- GitHub Actions run `31111797977` 全部通过。

## 当前结论

MingOS 已证明：

1. 来源可追溯不等于来源对当前议题具有权威；
2. 历史资料与当前事实值不同，不等于历史资料应被删除；
3. 当前事实源、治理来源、参考资料和历史资料必须显式区分；
4. 日期出现、到期复核与有效期限可以确定性报告；
5. 只有人工显式声明同一议题和值，系统才可形成冲突候选；
6. 冲突候选不是冲突裁决，`automatic_resolution` 永远为 `false`；
7. 事实确认、意图、授权、任务、复核决定和完成证据不能由快照工具静默生成。

## 当前边界

- Foundation、MingOS、Family-Space 保持分层；
- 当前不面向真实用户或生产决策；
- Snapshot CLI 只处理仓库内固定来源，不联网、不写入来源仓库；
- Manifest 与 Seed 不可同时提供；
- Seed 不是模型推断，必须由配置显式声明并人工复核；
- 只有 `current-fact-source` 可声明 `current_fact_source_for`；
- 冲突只基于显式 topic/value，不使用模型相似度推断；
- 系统不得自动选择冲突赢家、覆盖历史或创建当前事实；
- 原始来源夹具位于 `fixtures/`，不得混入 `examples/` 运行对象；
- 未经有效 Authorization，Agent 不得执行新任务；
- 没有 passed/accepted Evidence，不得标记 Task completed。

## 下一验证

基于已经稳定复现的 3 个冲突候选，设计最小、机器可验证的 `source-review` 资产，用于记录具名 Actor 对候选所做的决定：接受某个当前值、保留为历史、标记无法判断或要求补充证据。复核资产必须保留时间、理由、来源与可撤回性，不得修改原始来源，也不得由系统代替人作出决定。该闭环通过前，不建设联网导入器、通用 UI、模型网关或 Agent 平台。
