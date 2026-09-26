# MingOS · mingos.cn V0

MingOS 的公开官网（未来站点）。

它回答一个问题：**AI 越来越聪明，人要怎样越来越成为人？**

MingOS 从一个真实的人的三种基本关系开始：

| 方向 | 主体性 |
| --- | --- |
| 我与自己 | 我选择。 |
| 我与家庭 | 我关系。 |
| 我与世界 | 我行动。 |

它们不是三个产品，而是同一个人的生活。三个 Space 之下是同一个系统内核——**Ming 承担复杂性**：把模型、记忆、知识、Agent、工具、权限与安全沉到下面，把现实与选择留给人。

## 页面结构（V0 仅 `/`）

| Section | 内容 |
| --- | --- |
| 01 Hero | 时代命题：AI 越来越聪明。人要怎样越来越成为人？ |
| 02 Three Relationships | 以「人」为中心的三个交叠圆（纯 SVG），每个方向带出「我选择 / 我关系 / 我行动」 |
| 03 Three Spaces | Self / Family / World 三个方向，各自节奏、同一系统 |
| 04 The Loop | 生活不是一次问答：发生 → 看见 → … → 留下新的脉络 → ↺ |
| 05 MingOS Core | 人在上面生活，Ming 在下面承担复杂性：连续 · 事实 · 主体性 · 边界 · 开放智能 |
| 06 Why | 为什么做 MingOS（第一人称） |
| 07 End | 夜色收束：Ming 承担复杂性 · 现实和选择，留给人。无商业 CTA |

## 技术栈

- **Next.js（App Router）+ TypeScript**，`output: "export"` 纯静态导出（产物在 `out/`）
- **纯 CSS**，无 UI 框架、无动画库、无 analytics
- **零客户端 React 组件**：交互仅一段内联脚本（滚动显现 + SVG 描线），JS 被禁用时内容完整呈现
- 动画全部尊重 `prefers-reduced-motion`
- 字体：系统字体栈；标题用 `MingOS Serif`（Noto Serif SC 按页面字符生成的子集，OFL 1.1，约几十 KB）

## 常用命令

```bash
npm install
npm run dev          # 本地开发
npm run lint         # ESLint
npm run typecheck    # TypeScript（会先跑 next typegen 生成路由类型，全新克隆可直接跑）
npm run build        # 产出静态站点到 out/（postbuild 自动剥离未使用的 React 运行时）
npx serve out        # 本地预览静态产物
```

> 环境注意：若终端里 `NODE_ENV` 被全局设为 `production`，`npm ci` 会跳过开发依赖、
> `next build` 可能异常。届时请先清掉它（Windows cmd：`set NODE_ENV=`；bash：`env -u NODE_ENV`）。
>
> 同类环境变量污染：若 shell 里残留 `__NEXT_PRIVATE_STANDALONE_CONFIG`（宿主应用是 Next standalone
> 构建时会导出它），`next build` 会去读宿主那份 JSON 配置，表现为 `TypeError: generate is not a function`。
> 这不是项目问题，构建前 unset 即可：`env -u NODE_ENV -u __NEXT_PRIVATE_STANDALONE_CONFIG npm run build`。

> 构建后 `tools/strip-runtime.mjs` 会删除无效果的 React 水合脚本（V0 无客户端组件），
> 产物从 ~820KB 降到 ~110KB。将来 V1 引入真正的交互组件时，删掉 package.json
> 里的 `postbuild` 步骤即可恢复完整运行时。
> **这条是硬约束：V0 的“零运行时 JS”依赖它，一旦有真实客户端交互必须先撤销。**

## 文案改动后重建字体

标题衬线字体只包含页面出现过的字符。改动文案后：

```bash
pip install fonttools brotli   # 只需一次
npm run build
python tools/build-font.py     # 重新生成 public/MingOS-Serif.woff2
npm run build                  # 字体进入构建产物
```

## 设计约束（改动前先读）

- 纸底 `#F5F3EE`、墨色 `#101010`，唯一的暖色留给 Family Space 的「灯」
- 禁止：蓝紫渐变、AI 发光球、玻璃拟态卡片、SaaS 功能卡、假数据假截图
- 每个 section 只允许一个核心动作；不做注册/价格/Get Started
- 移动端不是桌面缩小版：375px 优先验收

## 部署

`npm run build` 后将 `out/` 目录部署到任意静态服务器（Nginx / 对象存储 / CDN）。
