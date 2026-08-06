# 第二外部空间：MingOS Unified Archive Seed 试点

日期：2026-08-06  
来源：`YuemingHub/mingos-unified@250a59dff30b13a57d826ede7b396a4102ea03a4`

## 为什么选择它

`mingos-unified` 不承担产品运行。其 README 将仓库定义为“入口、知识、决策与历史档案”，并明确产品代码和运行基线在其他仓库。它因此可以作为一个 custom knowledge/archive space，而不是第二个家庭产品。

该仓库与 Family-Space 有两个关键差异：

1. 来源没有 `space-manifest.json`；
2. 来源文档包含历史命名、旧阶段判断和待执行仓库计划，不能直接当作当前 MingOS 事实。

## 发现的泛化缺口

Snapshot CLI v0 只接受 `role=space-manifest`，这隐含要求所有外部仓库先适配 MingOS。该要求不现实，也会诱导系统为了接入而修改来源仓库。

## 修复

新增显式 `space_seed`：

- 外部仓库无 Manifest 时，由配置提供完整 Space 对象；
- Seed 必须满足 Space Schema；
- Manifest 与 Seed 不能同时存在；
- Seed 模式永远标记为 `explicit-seed` 并要求人工复核；
- 工具不从 README 或仓库地图自行推断身份。

## 固定来源

- `README.md`，Blob `6bb359c29eff896c5de7f2cd1c6186fc7e3d4b04`
- `REPOSITORY-MAP.md`，Blob `1df3015fac1e0b2846c98710dccf5b13d9b2ba2a`

来源仓库保持零写入。

## Seed 边界

试点 Seed 将该空间描述为历史知识与仓库导航档案，并明确：

- 不代表当前 MingOS 状态；
- 旧主张不自动升级为当前事实；
- 不把家庭产品逻辑提升为通用内核；
- 所有来源主张保持未确认，等待后续人工分类。

## 验收

- 无 Manifest 来源可以通过 Snapshot analyze/scaffold；
- 输出记录 `space_source_mode=explicit-seed`；
- 来源 Blob 校验仍然生效；
- 抽取主张数量大于零且映射数量为零；
- `manual_review_required=true`；
- `automate_semantic_interpretation=false`；
- Family-Space Manifest 模式回归不受影响。

## 不做

- 不修订 `mingos-unified` 的历史内容；
- 不判断哪些旧文档应删除；
- 不把仓库重新设为当前总控；
- 不自动建立 Context、Intent、Authorization、Task、Evidence 或 Bundle。
