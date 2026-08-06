# 当前状态

- 日期：2026-08-06
- 阶段：M3 second external space validation complete
- 状态：可验证内核、连续性 CLI、两种外部来源模式与证据驱动 Snapshot CLI 均已合并
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

生成只包含确定性来源资产的脚手架：

```bash
npm run ming -- snapshot scaffold \
  fixtures/family-space-snapshot-input/snapshot.config.json \
  --out .tmp/family-space-snapshot

npm run ming -- snapshot scaffold \
  fixtures/mingos-unified-snapshot-input/snapshot.config.json \
  --out .tmp/unified-archive-snapshot
```

## 已完成

- MingOS M0 可验证内核已合并；
- 两轮跨 Agent 连续性实验及协议修复已合并；
- 零依赖 `bundle validate` 与 `bundle inspect` CLI 已进入主干；
- Family-Space Manifest 模式的只读外部空间试点已合并；
- Family-Space 快照成本实验已完成：3 个来源文件、9 个试点资产、6 个机械控制面资产；
- `snapshot analyze` 与 `snapshot scaffold` 已进入主干；
- `mingos-unified` 作为第二个 custom knowledge/archive space 完成验证；
- 无 Manifest 来源现在可通过显式 `space_seed` 接入；
- Manifest 与 Seed 互斥，Seed 模式强制人工复核；
- PR #10 已合并，提交为 `35bdf061acfbac85a7c731f344d77631b4bcf450`；
- GitHub Actions run `31108962365` 全部通过。

## 当前结论

MingOS 已证明：

1. 外部来源的提交、文件与 Git Blob 可以被固定并验证；
2. 有 Manifest 的领域仓库可以按来源字段保真生成 Space；
3. 无 Manifest 的历史知识仓可以由显式、可审阅 Seed 建立 Space 身份；
4. 工具不需要、也不应修改来源仓库才能接入；
5. Markdown 主张可以被列出并显示未映射范围；
6. Bundle 闭包与 Seed 合法都不等于来源语义当前有效；
7. 事实确认、意图、授权、任务和完成证据不能由快照工具静默生成。

## 当前边界

- Foundation、MingOS、Family-Space 保持分层；
- 当前不面向真实用户或生产决策；
- Snapshot CLI 只处理仓库内固定来源，不联网、不写入来源仓库；
- Manifest 与 Seed 不可同时提供；
- Seed 不是模型推断，必须由配置显式声明并人工复核；
- 原始来源夹具位于 `fixtures/`，不得混入 `examples/` 运行对象；
- 未经有效 Authorization，Agent 不得执行新任务；
- 没有 passed/accepted Evidence，不得标记 Task completed。

## 下一验证

为来源文件和抽取主张建立权威性、时效性与冲突提示：记录来源角色、快照时间、是否为当前事实源、可能过期的绝对日期和跨来源矛盾。系统只生成报告，不自动选择“哪一个是真的”，也不静默覆盖历史。该报告通过真实历史知识仓验证前，不建设联网导入器、通用 UI、模型网关或 Agent 平台。
