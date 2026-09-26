# 设计走查报告 · mingos.cn 落地页（移动端优先）

**走查目标**：`YuemingHub/MingOS-web` 已上线落地页 · https://mingos.cn
**走查时间**：2026-09-12
**走查模式**：Mode A 自动走查（读源码，非截图）
**产物**：Next.js 静态导出、单页滚动、手写 CSS（`app/globals.css`）、0 JS、暗色「夜→黎明」主题
**用户输入**：手机浏览后反馈"问题很多"
**未读到 Brief / Stories / Journey 上下文** → 跳过「与 Brief 一致性」类别

---

## 总览

| 严重度 | 数量 |
| --- | --- |
| 🔴 Blocker | 0 |
| 🟠 Major | 3 |
| 🟡 Minor | 9 |

**通过（未列 finding）的类别**：链路通畅性、异常态覆盖（静态页 N/A）、内容文案、无障碍基础（对比度与语义均达标）。

---

## 🟠 Major

### 1. 【响应式】SVG 线条宽度没有算 viewBox 缩放 —— 这才是"圆看不见"的真正原因

- **位置**：`app/globals.css` `.vc` / `.vc-flow`（约 300–400 行、1330–1360 行）
- **事实**：
  - `.venn__svg` 的 `viewBox="0 0 640 450"`。**SVG 的 `stroke-width` 是用户单位，会随 viewBox 缩放**，不是 CSS 像素。
  - 桌面：渲染宽 560px → 缩放 0.875 → `.vc` 写 1.2 → **实际只有 1.05px**
  - 移动端：渲染宽 340px → 缩放 0.531 → 写 1.6 → **实际只有 0.85px**
  - 320px 小屏：渲染宽 276px → 缩放 0.431 → **实际 0.69px**
  - `.vc-flow` 移动端写 3.2 → **实际 1.70px**
  - 旁证：同一文件里 `.venn__human` 在移动端被单独补成 26px —— 作者已经知道 SVG 会缩放，**但只补了文字，没有补线条**。
- **影响**：移动端（用户明确说这是主要入口）三个交叠圆的线几乎不可见，整屏的核心信息失效。之前把 `stroke-width` 从 1.2 提到 1.6 的做法**建立在一个错误假设上**，所以用户第二次仍然说"不清楚"。
- **修复建议**：按缩放比补偿用户单位数值，并在注释里写清算式：
  - `.vc`：桌面 1.2 → **1.5**（实际 1.31px）；移动端 1.6 → **2.8**（实际 1.49px）
  - `.vc-flow`：桌面 2.6 → **3.0**；移动端 3.2 → **5.6**（实际约 3.0px）
  - `.venn__dot` 的 `r=3.2` 同理：移动端实际半径仅 1.7px，建议加大到 4.5
  - ⚠️ 不要用 `vector-effect: non-scaling-stroke` 解决：`.vc` 与 `.vc-flow` 都依赖 `stroke-dasharray` 做"画出来"和"绕圆走"的效果，该属性会让虚线的长度基准一起改变，动画会坏。

### 2. 【响应式】14 处无限循环动效在移动端没有任何降级

- **位置**：`app/globals.css`（`turn`×2、`fall`、`venn-drift-a/b/c`、`venn-flow`×2、`venn-glow-breathe`、`lamp`、`horizon-breathe`、`tide`）
- **事实**：整页常驻 **14 个 `infinite` 动画**，其中 6 个是 SVG 元素的 `transform` 动画（3 个旋转虚线圆 + 3 个漂移图层）。移动端**唯一**的降级是 `prefers-reduced-motion`，没有针对低端机的轻量化。
- **影响**：低端 Android 上持续重绘，可能掉帧、发热、耗电；用户群体的主要入口恰恰是手机。
- **修复建议**：在 `@media (max-width: 767px)` 里关掉漂移（`venn-drift-*`，它是三者里最不易察觉的），保留旋转微光；或给漂移图层加 `will-change: transform` 让浏览器提前分层。

### 3. 【响应式】结尾那层 1100×1100 的模糊光斑，移动端开销大

- **位置**：`app/globals.css` `.end::before`（`width/height: 1100px` + `filter: blur(14px)`）
- **事实**：一个 1100×1100 的元素做大半径高斯模糊，虽然父级 `overflow: hidden`，但模糊本身仍要参与合成。
- **影响**：移动端滚动到结尾时可能明显掉帧。
- **修复建议**：移动端把尺寸降到约 620px、`blur(10px)`；或改用 `radial-gradient` 直接画（不需要 `filter`，成本低得多）。

---

## 🟡 Minor

### 4. 【响应式】底栏没有处理 iPhone 底部安全区
- **位置**：`.end__in { padding-bottom: 46px }`
- **事实**：顶部有 `env(safe-area-inset-top)`（`.top`），**底部没有** `env(safe-area-inset-bottom)`。
- **建议**：改成 `padding-bottom: calc(46px + env(safe-area-inset-bottom))`。

### 5. 【响应式】iOS 点击时会闪一块灰
- **位置**：全局，未设 `-webkit-tap-highlight-color`。
- **建议**：`html { -webkit-tap-highlight-color: transparent; }`，配合已有的 `:active` 态。

### 6. 【响应式】`text-rendering: optimizeLegibility`
- **位置**：`body`
- **事实**：这个声明在移动端被普遍认为会拖慢文字渲染，收益很小。
- **建议**：移动端覆盖为 `auto`（或整体移除）。

### 7. 【反馈与交互】两个链接的触摸热区低于 44px
- **位置**：`.end__meta a`（备案号，13px 字号 ≈ 25px 行高）；`.why__triad a`（≈38px）
- **建议**：给这两处加 `padding-block` 把可点高度撑到 ≥44px。

### 8. 【视觉层级】长句对齐不一致
- **位置**：`.venn__cap`（"它们相互渗透——本来就是同一个人的生活。"）
- **事实**：`.venn__not` 与 `.spaces__close` 已在移动端改为左对齐，**`.venn__cap` 仍居中**。
- **建议**：一并在移动端改左对齐，保持同一屏内一致。

### 9. 【视觉层级】分区标签偏小、字距偏大
- **位置**：`.label { font-size: 12.5px; letter-spacing: 0.24em }`
- **事实**：小屏上 12.5px + 0.24em 字距，字小而散。
- **建议**：移动端字号提到 13px、字距收到 0.18em。

### 10. 【组件使用】结尾的色值仍是裸 hex，没进 token
- **位置**：`.end` 的渐变 6 个色停、`.horizon__line/road`
- **事实**：项目已完成 token 化（`--stroke-*` / `--faint`），但结尾这一段仍是写死的 `#7c6041`/`#f7ecdb`/`rgba(92,75,57,…)`。
- **建议**：抽成 `--dawn-1…--dawn-6` 与 `--dawn-line`，否则以后调结尾要翻代码找。

### 11. 【反馈与交互】`.end__meta a` 缺 active 态
- **位置**：`.end__meta a` 只有 `:hover` / `:focus-visible`
- **建议**：补 `:active`（项目里 `.space__go` / `.why__triad a` 都有）。

### 12. 【信息架构】单页很长，移动端没有"回到顶部"
- **事实**：7 屏长滚动，滚到底想回看只能一路滑回去。总纲明确"首屏不要导航"，所以这是**取舍而非缺陷**；但可以考虑一个极轻的"回到顶部"（如页脚一行小字），移动端收益明显。
- **建议**：**等用户决定**，不主动加。

---

## 未覆盖 / 明确跳过

- **异常态（类别 5）**：静态营销页无表单、无列表、无数据请求 → 本类别 N/A。
- **与 Brief 一致性（类别 10）**：本仓库无 `spark-output/context/brief.json` → 跳过。
- **完整 WCAG 审计**：本 Skill 只做可达性抽样，合规审计请走 Access。
- **⚠️ 首屏高度无法静态判定**：`.hero { min-height: 100svh }` 本身写法正确（用了 `svh` 而非 `vh`），但 `.hero__in { padding-top: 16vh }` + `.hero { padding-top: 40px }` 叠加 flex 居中，内容可能被推得偏低。**这一条必须真机看**，静态读代码判不了，故未记为 finding。

---

## 修复优先级建议

| 顺序 | 项 | 理由 |
| --- | --- | --- |
| 1 | Finding 1（SVG 线宽补偿） | 用户已两次反馈，是移动端核心信息失效的直接原因 |
| 2 | Finding 3（结尾光斑） + Finding 2（动效降级） | 移动端流畅度，改动小、收益直接 |
| 3 | Finding 4/5/7/8/9 | 移动端手感与一致性，都是一两行的事 |
| 4 | Finding 10/11/12 | 可维护性与取舍项，可延后 |

---

## 附录 · 实拍复核（2026-09-12 同日，第二轮）

写完本报告后，用**无头 Chrome + 390×844 真实视口 iframe** 逐屏实拍复核了一遍
（静态读代码查不出的问题只能靠看）。复核结论：

**已修项全部实拍确认通过**：三个叠圆在手机上清晰可见（`.vc` 实际 1.44px、
`.vc-flow` 实际 2.88px）；结尾天亮渐变、地平线、页脚备案号排版均正常；各屏无横向溢出。

**实拍又发现 4 处（已全部修复并复核）**：

| # | 类别 | 问题 | 修法 |
| --- | --- | --- | --- |
| 13 | copy | **中文排版 bug**：JSX 源码里的换行会被渲染成一个半角空格，导致「、」「，」后出现多余空隙（Why 两段最明显） | 中文段落一律收成一行，源码里写明原因 |
| 14 | visual-hierarchy | **标题孤字**：手机上「给这三种关系，各留一个空／间。」的「间。」掉到第二行 | `.h2` / `.hero__t` / `.loop__close` 加 `text-wrap: balance` |
| 15 | visual-hierarchy | `.loop__close` 在手机上仍是居中长句，末行「准。」孤字 | 窄屏改左对齐（与其他长句一致）+ balance |
| 16 | visual-hierarchy | 结尾「路」的透视线太短，读起来像倒 V／箭头而不是路 | viewBox 由 `320×100` 拉到 `320×200`，路从画面脚下收拢到地平线 |

**一处无法在这个流程里验证**：触屏专属的链接下划线（`@media (hover: none)`）。
无头 Chrome 报告的是 `hover: hover`，所以截图里看不到那条下划线——**它只在真机上出现**，
需真机确认。

**可复用的实拍流程（本仓库专用）**：
`D:\服务器\preview\` 下放一份 `out/` 的副本 + `__mobile-preview.html` 外壳
（同源 iframe 390×844），`python -m http.server 4174` 起服务，再用
`chrome --headless=new --window-size=390,844 --force-device-scale-factor=2
--user-data-dir=<ASCII临时目录> --virtual-time-budget=4000
--screenshot=... "…/__mobile-preview.html?bare=1&y=<滚动位置>"` 逐屏截。
⚠️ 两个坑：① 站点 `html` 上是 `scroll-behavior: smooth`，程序化滚动会变动画走不完，
外壳里要临时改成 `auto`；② 滚动显现靠 IntersectionObserver，无头下不派发，
外壳里要先把 `.rv/.venn/.space/.loop` 全部加上 `is-in`，否则截到的是 opacity:0 的空屏。
