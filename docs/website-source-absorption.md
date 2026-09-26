# website/ 来源吸收记录

> 阶段：Issue #43 Phase C（source consolidation only，**不切换生产**）
> 吸收日期：2026-09-26
> 授权分支：`agent/mingos-web-source-absorption-20260926`

## 1. 来源

| 项 | 值 |
|---|---|
| 来源仓库 | `YuemingHub/MingOS-web` |
| 来源 commit | `9f31914`（`字体子集重跑：补上新放回的那 4 句话用到的字`，2026-09-20 14:20:57 +0800） |
| 来源分支 | `design/minimal-facade-20260920`（**当时未推送到 origin**） |
| 目标路径 | `MingOS/website/` |

`website/` 下的 29 个文件与来源 commit **逐字节一致**（`git rev-parse 9f31914:<path>` 与 `git hash-object website/<path>` 全部相等），文件集无增无缺。

## 2. 为什么不是 `MingOS-web@main`

Phase C 指令写的是「唯一源真值：`YuemingHub/MingOS-web@main`」。**该前提经核实不成立。**

线上 mingos.cn **不是**从 `MingOS-web@main` 构建的。证据（构建产物与线上逐字节比对）：

| 产物 | `9f31914` 构建 | 线上 | 结果 |
|---|---|---|---|
| `/foundation/index.html` | 11695 | 11695 | **IDENTICAL** |
| `MingOS-Serif.woff2` | 54580 | 54580 | **IDENTICAL** |
| `og.png` | 97456 | 97456 | **IDENTICAL** |
| `icon.svg` | 287 | 287 | **IDENTICAL** |
| `robots.txt` | 63 | 63 | **IDENTICAL** |
| `/index.html` | 13049 | 13045 | 仅 2 处 CRLF/LF 空白，归一化后 identical |
| `sitemap.xml` | 407 | 407 | 仅 `<lastmod>` 构建时间戳 |

而 `origin/main` @ `18f70f7`（main 最新内容提交为 `630661b`，2026-09-12）构建结果与线上**差异巨大**：

| 产物 | main 构建 | 线上 | 影响 |
|---|---|---|---|
| `/index.html` | 17651 | 13045 | 首页换回 7 屏旧版 |
| `/foundation/` | **不存在** | 11695 | 线上有该页 → cutover 后 404 断链 |
| `sitemap.xml` | 252 | 407 | 丢失 `/foundation` 条目 |
| `MingOS-Serif.woff2` | 41444 | 54580 | 字体子集缺字 |

因此若按字面吸收 `main` 再 cutover，会造成**显著的视觉、文案与信息架构倒退**，直接违反 Phase C 的「不得 redesign」「visual/copy delta 必须为零」「保留当前线上站为 baseline」。

**实际采取**：吸收与线上一致的 `9f31914`，visual/copy delta = 0。

## 3. 由此产生的 authority 问题（需 Commander 裁决）

- `9f31914` 及其上游 15 个提交**只存在于本机 MingOS-web 工作副本**，从未推送到 `origin`。本分支把它们**第一次**送进远端仓库（GitHub），消除了「线上源码仅存于单机」的风险。
- 但 `MingOS-web@main` 仍停留在 2026-09-12。**Phase D 退役 MingOS-web 之前必须先处理这个分叉**，否则会出现「MingOS 持有真实线上源码、MingOS-web main 持有过期源码」的双真源。
- 本记录不自行决定如何处置 MingOS-web main，也不 archive 该仓。

## 4. 被替换的旧 prototype

Phase C 授权「replace/absorb the old MingOS website prototype」。原 `website/` 下 22 个文件为已关闭的 PR #37 时代原型（5 个静态 HTML 页、8 张走查截图、4 个 verify 工具、DESIGN-SPEC 等），**已被 live source 取代**（原型的 `/about`、`/building`、`/mingos` 线上均为 404，从未上线）。

这些文件**未被删除出历史**，可在 `8f0d5a4` 完整取回。PR #37 与 git 历史即其 provenance。

## 5. monorepo 路径适配

`website/` 是**独立的嵌套 npm 包**，MingOS 根 `package.json` **未声明 workspaces**。

- 根 `npm ci` / `npm test` / `npm run check` 不安装也不触碰 `website/`，两者互不影响。
- 构建需进入子目录：

```bash
cd website
npm ci --include=dev
npm run lint
npm run typecheck
npm run build     # 静态产物在 website/out/
```

- `website/.gitignore` 自带 `/node_modules`、`/.next/`、`/out/`，构建产物不会进入版本库。
- 应用源码**无任何 `../` 路径逃逸**，无需为迁入改写一行代码。**源文件零改动。**

## 6. 唯一新增文件

`docs/website-source-absorption.md`（本文件）。`website/` 目录本身**保持为来源 commit 的精确镜像**，provenance 放在仓库文档区而非污染镜像。

## 7. 明确未做

未部署 mingos.cn；未动 nginx / DNS / certbot；未 rsync 生产；未 redesign；未加 backend / analytics / account / CTA；未 archive MingOS-web；未 merge main。
