# MING_VISUAL_LANGUAGE · 四站共享设计骨骼 v1.0

**唯一真源**：https://ymai.love 的当前生产页面。
本文件不是凭空设计的规范，而是从线上实现**反向提取**的结果。

## 0. 基线来源与取证方式

| 项 | 值 |
|---|---|
| 线上文件 | `https://ymai.love/` |
| 源码位置 | `YuemingHub/Family-Space` 仓库 `website/index.html`（`production` 分支） |
| 取证时间 | 2026-09-19 |
| 一致性 | **SHA256 逐字节相同**：`2b94e65638cc217ed94e4826acddbd33583f3871bb9aa34f7cecef6bfa7bafdd` |

取证命令（可复现）：

```bash
curl -sL https://ymai.love -o home.html
sha256sum home.html website/index.html   # 两个哈希相同
```

因此本文件里所有数值都可以定位到 `website/index.html:行号`，不是推测。
下文 `FS:` = `Family-Space/website/index.html`。

技术形态基线：**单文件 HTML、内联 CSS、内联字体子集、零外部请求、零构建依赖**。

---

## 1. 共享骨骼（四站必须一致）

### 1.1 度量

| token | 值 | 出处 | 说明 |
|---|---|---|---|
| `--max` | `1180px` | FS:63 | 页面容器最大宽度 |
| `--gut` | `clamp(20px,5vw,64px)` | FS:63 | 左右安全边距 |
| `--beat-gap` | `clamp(96px,16vh,190px)` | FS:63 | **section 纵向节奏**，一屏一件事 |
| `--ease` | `cubic-bezier(.22,.61,.36,1)` | FS:64 | 全站唯一缓动 |
| `--t-1 / --t-2 / --t-3` | `.45s / 1.2s / 2.4s` | FS:64 | 微交互 / 环境 / 浮现 |

窄屏：`@media (max-width:900px){ --beat-gap: clamp(64px,11vh,110px); --gut: clamp(20px,5.6vw,34px) }`（FS:66）

**留白比例是家族特征，不是装饰。** `--beat-gap` 上下限不许任何站收紧。

### 1.2 字体分层

```
--serif  "MingOS Serif","Songti SC","Source Han Serif SC","Noto Serif SC",
         "STSong","SimSun",Georgia,serif            FS:59
--sans   -apple-system,BlinkMacSystemFont,"PingFang SC",
         "Hiragino Sans GB","Microsoft YaHei",system-ui,sans-serif   FS:60
--mono   ui-monospace,"SFMono-Regular","JetBrains Mono",Consolas,monospace  FS:61
```

- **衬线体承载"人的话"**（`.life` / `.lead` / `.h2life` / `.hero-h`），无衬线承载界面与说明，等宽承载**元信息**（eyebrow、时间戳、状态、域名）。
- 中文衬线字体是 **Noto Serif SC 的子集**（SIL OFL 1.1，保留名 "MingOS Serif"，不得改名）。
  **改文案必须重新子集化字体**，否则缺字静默回退到系统宋体。

| 角色 | 类 | 规格 | 出处 |
|---|---|---|---|
| 正文 body | `body` | `clamp(16.5px,.35vw + 15.4px,17.5px)` / `lh 1.85` / `ls .012em` | FS:71-73 |
| **命题** `.lead` | H2 级最长陈述 | `clamp(26px,4vw,40px)` / `lh 1.85` / `ls .05em` | FS:175-176 |
| **人话标题** `.h2life` | H2 级短标题 | `clamp(21px,2.6vw,28px)` / `lh 1.8` / `ls .06em` | FS:178-179 |
| **首屏** `.hero-h` | H1 | `clamp(30px,5.6vw,45px)` / `lh 1.6` / `ls .05em` | FS:138-139 |
| eyebrow `.label` | 编号/元信息 | `--mono`，`clamp(11.5px,.3vw + 11px,12.5px)` / `ls .18em` / `uppercase` | FS:89-90 |
| 补充说明 `.note` | 二级正文 | `16.5px` / `lh 2.05` / `max-width 30em` / `--text-2` | FS:180-181 |

**强调规则**：不用 `<b>` 加粗、不用颜色底块。用 `.lead em` / `.hero-h em` → 生命色，`font-style:normal`（FS:74, 140, 177）。
**防孤字**：`.nw{white-space:nowrap}` 包住不可拆的短语（FS:88, 436, 452）。

### 1.3 颜色骨架

四站共享 **`--bg` 系列 / `--hairline-rgb` / text / hair 的透明度结构**，只换生命色（见 §1.4）。

```
--text    #E9E5DA      一级文字      FS:48
--text-2  #A9B2AD      二级文字      FS:49
--text-3  #828B85      三级/元信息    FS:50
--hair    rgba(235,220,196,.13)   实线  FS:45
--hair-2  rgba(235,220,196,.07)   浅线  FS:46
--paper   #F2EFE7      亮侧/反相底色  FS:38
```

强调色家族（共享，非任选）：`--amber #D9A26A` / `--dawn #E8C79A` / `--gold #C9A96E` / `--jade #8FBFA3` / `--blue #6FA8B6`（FS:53-57）。

**禁止**：蓝紫渐变、发光体、玻璃拟态背景、纯黑 `#000`、纯白 `#FFF`、饱和度高于家族的纯色。

### 1.4 每站可独立（空间气质）

**房间底色不逐站独立。** 四站是同一间屋子，墙一律是 ymai.love 的暖墨；
逐站另调一种黑，四个站就不是一家人了（2026-09-20 修正：先前各站自配 `--bg`，
把三个站做成了冷蓝/冷绿黑，与基准 rgb(18,16,12) 不符）。

| token | 四站共用（= ymai.love 基准） |
|---|---|
| `--bg` | `#12100C` |
| `--bg-1` | `#15120D` |
| `--bg-2` | `#191510` |
| `--bg-deep` | `#0E0C09` |
| `--hairline-rgb` | `235,220,196`（`--hair` = α .13，`--hair-2` = α .07） |
| `theme-color` | `#12100C` |

**每站只允许换生命色和画面内容：**

| 站 | 空间 | 生命色 | 母题 |
|---|---|---|---|
| mingos.cn | 门厅 / 地基 | `--gold #C9A96E` 晨光 | 天光与海面（页面向 dawn 缓慢抬升，仍在暖墨一族内） |
| ymai.me Self | 一个人的房间 | `--moon #B7C2C0` 月白 | 一扇可以关上的门 |
| ymai.love Family | 客厅与灯 | `--amber #D9A26A` 灯 | 亮着的灯 |
| ymai.fun World | 工作台 / 门外 / 路 | `--day #9DB8A5` 门外天光 | 一条走出去的路 |

窗外 / 门外的光（夜空的冷、天光的绿）属于画面内容，可以冷；**墙不行**。

**判据（两问必须同时成立）**：
1. 隐藏 Logo 后，仍认得出是同一个人做的四个空间 → 靠 §1.1–1.4 的骨骼与同一面墙。
2. 隐藏 Logo 后，仍能分清这是面对自己 / 家庭 / 世界 / 解释整个体系 → 靠生命色 + 母题画面 + §2 的叙事分工。

### 1.5 组件词汇（跨站同名同构）

| 组件 | 类 | 规格 | 出处 |
|---|---|---|---|
| 顶栏 | `.head` | `fixed`，高 ≈ 12+字高，`border-bottom` 透明；滚动 >24px 加 `.is-stuck` | FS:94-101 |
| 品牌标 | `.brand` | `--serif 18px / ls .16em` + 开口圆 `.open-mark` | FS:102-113 |
| 进度线 | `.progress` | 顶部 `1px`，生命色渐变，`scaleX` | FS:114-116 |
| **主按钮** | `.entry` | `padding 14px 22px`，`1px solid var(--hair)`，`15.5px / ls .06em`，hover → 生命色边框 + `rgba(生命色,.08)` 底，**直角、非圆角** | FS:143-147 |
| 次按钮 | `.entry--quiet` | 无边框块，仅 `border-bottom:1px solid var(--hair)` | FS:148-150 |
| 箭头 | `.entry i` | `--mono 11.5px`，hover `translateX(5px)` | FS:151-153 |
| section 编号 | `.beat-no` | 一条 `clamp(28px,6vw,64px)×1px` 细线 + `.label` | FS:165-166 |
| 时间账 | `.day` | `border-left:1px`，节点 6px 圆点，末条生命色实心 | FS:184-196 |
| 行式列表 | `.rooms` | 上边框 + 行间 `--hair-2`，**不是卡片** | FS:199-204 |
| 不做清单 | `.notlist` | 破折号式 6px 短线前缀 | FS:226-230 |
| 现实标记 | `.mrow` + `.marker` | 状态用等宽小圆点 + `uppercase`，`--exists` 玉色 / `--testing` 曙光色 | FS:206-217 |
| 抽屉 | `.drawer` | 右滑 `min(94vw,470px)`，`translateX(101%)→none` `.62s`，**关闭态必须 `display:none`** | FS:251-281 |
| footer | `.foot` | 上边框 + 双列网格（星图 / 链接），860px 以下单列 | FS:232-249 |

**触控区硬规则**：所有可点元素用 `::before{inset}` 撑到 **≥44×44px**（FS:104-105, 146, 242-243, 267-268）。

### 1.6 动效物理

- 逐行浮现：`.rv` → `.rv.in`，`opacity + translateY(14px)`，`--t-3`，阶梯 `data-d="1|2|3"` = `.28s/.56s/.84s`（FS:167-172）
- 环境类动画（旋转、呼吸）**周期 ≥9s**，禁止快速律动（FS:112 `markTurn 46s`）
- `IntersectionObserver`：`rootMargin '0px 0px -12% 0px'`，`threshold .15`，**1600ms 兜底**把首屏内未触发的元素直接显出（FS:681-696）
- **`.js` 门控**：`<script>` 首行给 `<html>` 加 `.js` 类，浮现初始态只写在 `.js` 下 → **无 JS 时全部内容完整可见**（FS:5, 168-172）
- `prefers-reduced-motion` 全量归零（FS:283-287）
- 无障碍：`.skip` 跳转链接、`.sr` 视觉隐藏、`:focus-visible` 用共享 `--gold` 描边（FS:80-87）

### 1.7 响应式断点

统一使用：`900px`（骨骼收紧）、`860px`（footer 单列）、`640px`（mrow 折行）、`max-aspect-ratio:27/20`（首屏画面换幅）、`max-height:760px`（首屏压缩）。
验收宽度：**375 / 390 / 768 / 1440**。

### 1.7.1 反相（亮色）段的文字规则 ⚠️ 走查实测得出

骨骼默认服务暗色页。**任何把共享件（`.sibs` / `.foot-links` / `.label` …）放进亮色段的做法，
都必须为该段重选墨色**，否则会掉到 1–2.7:1。

mingos.cn 的"天亮"段是 `--dawn-1 #7c6041 → --dawn-6 #f7ecdb` 的**纵向渐变**，
同一段里顶部还是深棕、底部已是米白。实测各墨色在该渐变上的对比度：

| 墨色 | 顶部 rgb(169,132,90) | 中段 rgb(200,165,120) | 下部 rgb(240,222,196) | 判定 |
| --- | --- | --- | --- | --- |
| `--dawn-ink #241c14` | **4.90** | 7.28 | 12.75 | ✅ 全段唯一可用 |
| `--dawn-sub #5c4b39` | 2.43 | 3.61 | 6.33 | ❌ 上半段不达标 |
| `--dawn-1 #7c6041` | 1.70 | 2.53 | 4.42 | ❌ 只能在最底 |

**规则：亮色段内文字一律 `--dawn-ink`；"次要"靠字号与字距表达，不靠把墨变浅。**
hover 也没有更浅的颜色可用，改用下划线（`text-decoration` + `text-underline-offset`）。

基线 ymai.love 没踩到这个坑，因为它的页脚不在亮色段里。

### 1.7.2 骨骼缺件登记

`.skip` 跳转链接在 `MING_SKELETON.css` 里有定义，但 mingos.cn 移植时漏了（2026-09-19 走查发现，已补）。
**移植骨骼时 `.skip` + `<main tabIndex={-1}>` 必须成对带上**，否则键盘用户要 Tab 过整页。

### 1.8 本轮实测发现的两个骨骼缺陷（已修，四站同修）

**① `.js-only` 被同权重的组件规则压掉。**
骨骼原写 `.js-only{display:none}` + `.js .js-only{display:inline-flex}`。
`.js-only` 与 `.entry` / `.row-btn` / `.copy-btn` 权重都是 (0,1,0)，组件规则写在后面就赢
→ **关掉 JS 后，"点了没反应"的抽屉按钮仍然可见**。
修法：把类名逐个点名，不靠顺序。

```css
.js-only,button.js-only,.row-btn.js-only,.copy-btn.js-only{display:none}
.js .js-only,.js button.js-only,.js .row-btn.js-only,.js .copy-btn.js-only{display:inline-flex}
```

**② 嵌在别人块里的小链接拿不到 ≥44px 命中区。**
`.brand::before` 那套撑法只在 `.brand` 自身是链接时有效；
`<p class="brand"><a>…</a></p>` 这种写法里，撑的是 `<p>`，`<a>` 实测只有 87×33。
修法：链接自己带 `.brand`，或加通用工具类 `.hit`（同样的 `::before` 撑法）。

两条都由 Self-Space 实施时实测发现，回填到骨骼。**基线 ymai.love 生产页目前仍带着缺陷 ①**
（375–1440 四个宽度各 2 个死控件），本轮不改 Family Space，见 §5。

---

## 2. 叙事分工（不是视觉分工）

四站像同一栋楼里的不同空间，靠**回答的问题**区分，不靠换配色区分。

| 站 | 回答 | 叙事骨架 | 主动作 |
|---|---|---|---|
| mingos.cn | 为什么有这栋房子 | 命题 → 三种关系 → 收束 | **无 CTA**（不商业） |
| ymai.me | 我和自己 | 门 → 缺失 → 一天 → 这里发生什么 → AI 的位置 → 门 | 回到我的空间 |
| ymai.love | 我和家庭 | 门 → 缺失 → 一天 → 房间 → AI 的位置 → 状态 → 进入 | 进入我的家 |
| ymai.fun | 我和世界 | 门 → 缺失 → 一件事 → 入口 → 工具的位置 → 出门 | 选一件事，开始 |

**核心手法（基线最重要的一条，也是最容易被写丢的一条）**：
产品能力靠**一个普通人的真实时间线**展示，不靠功能卡。见 FS:463-496——五个时间点 + "三个月以后"，就是全部产品展示。
禁止 Feature Grid、三列功能卡、Dashboard 截图、icon 墙。

### 2.1 兄弟站点关系的位置

导航里不做产品矩阵。**只出现在 footer 星图与页面结束区**。
星图见 FS:590-619：四节点，当前站点实心放大 + `YOU ARE HERE` 等宽标记。

---

## 3. 反模式（从基线反向推导，四站通用禁令）

蓝紫渐变 · 发光 AI 球 · 机器人头像 · 神经网络装饰 · 玻璃拟态 · 功能卡墙 · 三列 feature ·
大图标阵列 · "重新定义/赋能/革命性/一站式/Next Generation" · 伪造用户数 · 伪造能力 ·
伪造技术统一 · 用圆角胶囊按钮替代 `.entry` 直角细线按钮 · 把 `--beat-gap` 收紧来"多放点内容"

---

## 4. 工程纪律

- **不建跨仓库 npm design-system 包。** 本轮统一的是"规范 + 实现结果"，不是构建耦合。骨骼 CSS 以**受控副本**形式存在于各仓库，改动顺序：先改本文件 → 再逐站同步。
- 每站主题只允许覆盖 `:root` 的生命色（`--life` 三行），**不得覆盖 `--bg` 系列、`--hairline-rgb`、度量、字体分层、动效时长**。
- MingOS-web 是 Next.js 静态导出 + `postbuild` 剥离全部运行时 JS（零运行时硬约束）；
  Self-Space 的 `gui/` 是 Next.js + Tailwind v4，公开门面层必须**零 API 调用、零 localStorage 读取**（e2e 断言 `seen.api.length===0`）；
  World-Space 是单文件 HTML 零构建。
- 三站各自的实现差异不影响本骨骼：Tailwind / CSS Modules / 内联 `<style>` 都可以，**token 值和类名词汇必须一致**。

## 5. 本版覆盖状态

| 站 | 骨骼对齐 | 备注 |
|---|---|---|
| ymai.love | 基准，未改 | 仅作基线。两处待处理：① footer 星图把 ymai.fun 标为「归」、ymai.me 标为「月明」，与当前体系不符；② 生产页带 §1.8 缺陷 ①，375–1440 每档 2 个无 JS 死控件；③ 页脚 ICP 链接命中区实测 153×17px，低于它自己 DESIGN-SPEC 声明的 ≥44px |
| mingos.cn | v1.0 已对齐 | 走查后补：亮色段墨色契约、`.skip`、兄弟导航反相 |
| ymai.me | v1.0 已对齐 | |
| ymai.fun | v1.0 已对齐 | |
