# MingOS Living Design System · 母文件 v0.1

依据《设计MingOS网站体系.md》最终版信息架构（2026-08-28 02:19 那一轮）整理。
这份文件是**四个站共享的骨骼**。以后 ymai.love / ymai.fun / ymai.me 只换"生命色 + 时间感 + 画面材质"，不换尺度、字体分层、动效物理、无障碍规则。

---

## 0. 一句话定位

> **Living Quietness · 活着的安静**：有呼吸的留白 + 真实时间 + 微弱变化 + 未闭合的形。
> 技术退后半步，生命走到画面中央。

四个站 = 一个世界里的四扇门，不是四个品牌：

| 站点 | 回答的问题 | 生命色 | 时间感 |
|---|---|---|---|
| mingos.cn | 我们在建设什么未来 | 晨光金 `#C9A96E` / 天光 `#E8C79A` | **慢**（像读一篇长文） |
| ymai.love | 一个家庭可以拥有怎样的空间 | 家里那盏灯 `#D9A26A` | **日常**（今天/昨天/这一年） |
| ymai.fun | 迷茫时怎样重新听见自己 | 新芽 `#8FBFA3` | **现在**（此刻发生了什么） |
| ymai.me | 这一切从哪里长出来 | 不设品牌色，纸+墨 | **过去 → 今天** |

---

## 1. Tokens（已内嵌在 index.html 的 `:root`）

### 1.1 颜色

```
Core（共享）      --paper #F2EFE7   --ink #20201E   --mist #D8D8D2   --quiet #8A918C
MingOS 底         --bg #0B1012  --bg-1 #0D1417  --bg-2 #111A1D      （墨色，不是纯黑，偏青绿 = 天光将出）
文字             --text #E9E5DA (15.2:1)  --text-2 #A9B2AD (8.8:1)  --text-3 #828B85 (5.5:1)
发丝线           --hair rgba(226,222,210,.13)   --hair-2 rgba(226,222,210,.07)
生命色           --gold 晨光   --dawn 天光   --amber 家   --jade 归   --blue #6FA8B6 雾蓝(链接)
```

规则：
- **深色底 + 极少量亮色**。任何生命色在单屏里的面积不超过 8%，它只在"该亮的时候亮"。
- 不用纯黑 `#000`、不用纯白 `#fff`。
- 禁止：蓝紫渐变、霓虹发光、玻璃拟态卡片、粒子宇宙。

### 1.2 字体分层（这是整个体系最重要的一条）

```
理性信息 → --sans   (PingFang SC / Microsoft YaHei / system-ui)
生命表达 → --serif  (内嵌 "MingOS Serif" = Noto Serif SC 子集，361 字 / 60KB)
结构标记 → --mono   (状态、编号、域名、英文小标签)
```

- 大标题、命题句、诗句、人生叙事 → **serif**，字重 400，字距 `.05em`，行高 `1.55–2.05`。
- 说明、按钮、正文 → **sans**，行高 `1.85–2.1`。
- 中文衬线靠**内嵌子集**保证，不再依赖设备上装了什么；字体栈仍保留系统候选名作回退。
- 除这一个内联字体外不加载任何 webfont，外部请求仍为 0。

### 1.3 尺度与动效物理

```
--max 1180px   --gut clamp(20px,5vw,64px)   --beat-gap clamp(96px,16vh,190px)
--ease cubic-bezier(.22,.61,.36,1)   --t-1 .45s  --t-2 1.2s  --t-3 2.4s
```

- 环境动画一律 **9–200 秒一个循环**（潮、灯、呼吸、环行）。人眼几乎察觉不到它在动，但能感觉到"它是活的"。
  代码里任何 `animation` 时长不得低于 9s（v0.2 已把 7.5s / 6s 两处提到 10s / 11s）。
- 入场动画 2.4s，逐行延迟 0.28s 递增。
- `prefers-reduced-motion: reduce` → 全部动画与 SMIL 停止，内容直接呈现最终状态。

---

## 2. 三条硬规则（审查时直接挡掉不通过的）

1. **Visual 70% / Text 30%**：画面必须承担信息，不是装饰。
   实测当前首页 Beat 01–03 视觉占比 80% / 74% / 70%。
2. **文字预算**：首屏可见正文 ≤46 中文字（不计画面题字与读屏文本）；每个核心区默认可见 ≤60–80 字；整页默认可见正文 ≤400–500 字。
   实测当前首页：默认可见 **386 字**，含折叠层共 481 字；首屏可见 46 字。
   > 备注：原始文档给的首屏文案清单（主句 20 + 极短 19 + 两个入口 8）本身就等于 47 字，
   > 所以下限只能定在 46 左右。要真降到 45 以内，必须砍掉副题或入口文案，不建议。
3. **三层信息分层**：
   - 第一层 默认可见：人 / 家 / 孩子 / 未来 / 两个空间
   - 第二层 点击才出现：为什么从家庭开始、它是什么、状态说明、我们不会做什么（Drawer / Tab）
   - 第三层 独立页面：`/mingos` `/foundation` `/building` `/evidence`
   > 不许让第三层污染首页。技术实力全部放第二层。

---

## 3. 组件

### 3.1 Open Form（未闭合的形）—— 品牌母题

不是月亮 logo，是 **开放 · 可修订 · 活着**。落地方式：
- Logo 符号：`○` 但带缺口（`stroke-dasharray:34 12`，46s 缓慢自转）。
- 线永远两端淡出，不封顶；环留一个缺口；关系图允许开放。
- 文字不总是框在卡片里；卡片只在真正需要边界时出现。

### 3.2 Reality Marker（MingOS 独有的诚实组件）

```
EXISTS      已经存在，可以用        --jade
TESTING     正在真实环境里验证      --dawn
EXPERIMENT  还在试验，结论未定      --blue
DIRECTION   只有方向，还没有做      --text-3
UNKNOWN     我们还不知道
```

mono 10.5px / 字距 .16em / 胶囊描边。**任何未来能力必须挂一个状态。**
品牌资产不是"未来感"，而是**不假装未来已经发生**。

### 3.3 Drawer（第二层的容器）

- 右侧滑入 470px，`role="dialog"` + `aria-modal`，ESC 关闭，焦点回到触发按钮，焦点不逃出面板。
- 关闭按钮文案是 **"合上"**，不是 `×`。这是行为识别：界面语言要像人话。

### 3.4 Tabs

`role="tablist"`，支持 `← → Home End`，非激活项 `tabindex=-1`，面板用 `hidden` 真隐藏。

### 3.5 Constellation（你现在在哪里）

四站共用的位置图，不是导航菜单：MingOS 在上，Family Space / 归 在两侧，月明在下，当前站点亮。

---

## 4. 行为识别（Interface Constitution 摘要）

界面回应人的方式必须保留人的主体性：

- 说"我先把这里留住"，不说"已完成"。
- 说"这是我目前看到的一种可能"，不说"分析结果如下"。
- 允许"没有进度"是合法状态：禁止 `Progress 75%` `✓ Completed` `🔥12天连续` `Level 6`。
- 每一屏只允许**一个主动作**。
- 允许不解释：可以有一屏只有一句话、一个画面、一块什么都没有的空间。
- 内部讲"生命逻辑"，外部讲"具体生活"。用户不生活在"生命"里，用户生活在"孩子今天不愿意去学校"里。

---

## 5. 影像规则

**人没有在表演产品。** 禁止：母子笑着做作业、一家人沙发聊天、青年站山顶、创始人抱电脑。
要：饭后没收拾的桌子、门口一双小鞋、凌晨一点亮着的厨房、车后座的书包、写一半的作业、公交车窗、空教室、划掉又写的纸。

当前 `index.html` 用克制 SVG 承担叙事——画面即终稿（2026-08-29 用户定：不再等真实照片）。
**不要用 AI 生成的漂亮家庭图。**

---

## 6. mingos.cn 首页 · 6 个 Beat（已实现）

```
01 首屏    满幅生命场（家→人→世界，贴底一条风景）+ 居中 46 字命题 + 两个入口 + 右上"为什么从家庭开始？"
02 两个空间 Family Space（饭桌三个杯子）/ 归（声音退去，一个人走）· 各带折叠追问
03 生命闭环 未闭合的环，暖→绿，一个点 52s 走一圈 + 三句话
04 MingOS  一句定位 + 记忆/边界/主体性 三 Tab（默认只开一个）+ 了解 MingOS →
05 Foundation 只有一句："有些东西，不因为技术做得到，就应该做。" + 一条地平线
06 现在    "我们还很早。" + Reality Marker 账本 + 看看我们做到哪里 →
```

**没有**：注册、登录、Book a demo、联系我们、Get Started、右下角 AI 头像、弹窗、订阅框。

---

## 7. 无障碍与性能底线

- 所有正文对比度 ≥ 4.5:1（实测最低 5.45:1）。
- skip link、landmark、`:focus-visible` 1px 金色描边。
- 无 JS 时：内容全部可见，抽屉触发按钮自动隐藏（`.js-only`）。
- 单文件、零外部请求、零统计脚本。实测 `scrollWidth == clientWidth`，四种宽度无横向溢出。
- **CSP 已锁死**：`default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'`。
  即：不连网络、不发请求、不提交表单。“这一页不追踪你”是技术事实，不是口号。
- `referrer: no-referrer`：跳去 ymai.love / ymai.fun / GitHub 不泄露来源。
- favicon 用内联 data URI（未闭合的圆），不增加请求。

---

## 7b. 移动端规则（主场景，不是降级分支）

用户大多数时间在手机上。以下都是**实测值**（390×844 / 360×780 / 430×932）：

| 项 | 规则 | 实测 |
|---|---|---|
| 正文 | 手机 ≥16.5px，行高 1.85 | 16.7px |
| 首屏主句 | ≥30px，必须整句在一屏内 | 30px ✓ |
| 触控区 | 所有可点元素 ≥44×44（用不可见扩展层，不改视觉排版） | 全部 hit44 OK |
| 画面题字 | SVG 里的字换算到屏上 ≥14px | 14–21px |
| Beat 间距 | 手机收窄到 64–110px（否则变成空滚） | ✓ |
| 安全区 | 顶栏 `env(safe-area-inset-top)`、抽屉底 `env(safe-area-inset-bottom)` | ✓ |
| 毛玻璃 | 手机端关掉 `backdrop-filter`（每帧重采样会掉帧） | ✓ |
| 视差 | 手机端（`pointer:coarse`）关掉 | ✓ |
| 斜体 | `em,i{font-style:normal}` 全局禁止合成伪斜体 | ✓ |

本地看手机效果：双击 `预览-手机.html`（可切 360 / 390 / 430 / 768）。

---

## 7c. 中文衬线：已解决（v0.4）

**问题**：纯 Windows 环境通常一个中文衬线字体都没有。实测本机
`Songti SC / Source Han Serif SC / Noto Serif SC / STZhongsong / STSong` 全部未安装，
标题实际落到 **SimSun 宋体**（细、弱、小字号发虚）。

**做法**：内嵌子集化的 Noto Serif SC（思源宋体，SIL OFL 1.1）。

| 项 | 值 |
|---|---|
| 打包字符数 | 361（含 ，。·——→↗ 等中文标点与箭头） |
| 字形数 | 362 |
| woff2 体积 | **60,496 B** |
| base64 内联后 | +80,664 字符，整页 152KB |
| 外部请求 | **仍为 0**（data: URI） |
| CSP | `font-src data:`，其余全部 none |
| 授权 | OFL 1.1，全文随包在 `FONT-LICENSE.txt` |
| 字体内部名 | `MingOS Serif` Regular 400 |

**已用像素比对验证它真的在渲染**（不是"注册了却回退"）：同一个「家」字，
MingOS Serif 墨点 2455 vs 宋体 2073——比 SimSun 更厚更稳，正是大标题需要的。
单靠宽度测不出来，因为中日韩字体都是全角 1em，必须比像素。

**改了文案必须重跑**（否则新出现的字会掉回系统字体，句子里一两个字不一样）：

```bash
pip install fonttools brotli     # 只需一次
python tools/build-font.py       # 约 1–2 分钟，需联网
```

脚本从四个页面各自抽字（v0.5 起）→ 只下载覆盖到这些字的分片 → 裁切合并 → 按页裁出各自子集 →
分别回写 base64（首页保持最小，新页面互不增重）。

四站共用：ymai.love / ymai.fun / ymai.me 复制同一个 `@font-face` 块与同一份
`MingOS-Serif.woff2`，各自重跑一次 build-font（每站用字不同，子集也不同）。

**换字体后必须重跑全视口验证**：新字体字面更宽，首屏题字因此又出现了 2px 压字，
已调整竖幅「世界」的位置。几何关系会随字体变化，这是 v0.4 学到的。

---

## 8. 文件与下一步

```
mingos-cn/
  index.html          自包含首页（双击即可看；零外部请求）
  mingos/index.html   第二层 · MingOS 是什么（v0.5）
  foundation/index.html 第二层 · 底线与七条原则（v0.5，内容来自 mingos-foundation 仓库）
  building/index.html 第二层 · 建设账本与判断错记录（v0.5）
  预览-手机.html      手机宽度预览器（360/390/430/768 可切）
  DESIGN-SPEC.md      本文件
  FONT-LICENSE.txt    内嵌字体的 OFL 1.1 授权（随字体分发，必须保留）
  MingOS-Serif.woff2  四页并集字体源文件（按页子集已各自内联；此份供重建与四站复用）
  tools/
    build-font.py     改了文案之后重跑：一次覆盖四个页面，按页裁切、按页内联
    verify.sh         多视口回归验证（字体渲染/裁切/触控/居中，目前只覆盖首页）
    verify.js         └─ 生成测试页
    verify-report.js  └─ 输出人话报告
  shots/              首页桌面/手机 + 三个第二层页面的实测截图
```

本地看第二层页面（链接是绝对路径 `/mingos` 等，file:// 下打不开）：

```bash
cd mingos-cn && python -m http.server 8613
# 打开 http://127.0.0.1:8613/
```

跑验证（在项目根目录或 tools/ 里都行）：

```bash
bash tools/verify.sh                       # 默认 10 档视口
bash tools/verify.sh 1440,900 390,844      # 指定
```

### 首屏构图规则（v0.3 定稿）

```text
桌面 / 平板横屏（宽高比 > 1）    手机 / 平板竖屏（宽高比 ≤ 1）
┌───────────────────────┐   ┌─────┐
│      文字居中            │   │ 世界  │
│   （中间带不得有画面）    │   │  ○月  │
│                        │   │ 文字  │
│ 家 · 人        世界/月   │   │ 居中  │
└───────────────────────┘   │家灯│
     底部一条风景               └─────┘
   preserveAspectRatio="xMidYMax meet"   同一规则，竖幅构图
```
两套画布各管各的比例，**不用同一张图硬撑两种形状**。

### v0.4 修订记录（2026-08-28 内嵌中文衬线）

- 内嵌 `MingOS Serif`（Noto Serif SC 子集 361 字 / 60.5KB woff2 / base64 内联），
  `--serif` 栈排第一；CSP 改 `font-src data:`；授权全文随包 `FONT-LICENSE.txt`。
- 新增 `tools/build-font.py`（已实测跑通）、`tools/verify.sh` 回归套件。
- 换字体后首屏题字又出现 2px 压字（新字体字面更宽）→ 调整竖幅「世界」位置。
  **教训：换字体会改变所有几何关系，换完必须重跑全视口验证。**
- 10 档视口（320/360/375/390/414/430/768/1024/1280/1440）全项通过：
  字体真在渲染、首屏一屏内、零裁切、零压字、触控全 ≥44px、零横向溢出、
  零悬空 aria、零外部资源、零运行时错误、零 CSP 违规。

### v0.5 修订记录（2026-08-28 晚 · 第二层三页 + 实测修复）

**新增三个第二层页面**（首页三个 404 链接全部接通）：

```
foundation/index.html   底线：命题 + 不做什么（core distinction 逐条）+ 七条工作原则（中英对照）
                        + 宪章 EXPERIMENT 标记 → mingos-foundation 仓库原文
mingos/index.html       定位 + EXISTS 标记 + 三件事展开（记忆/边界/主体性）+ 分层图（Open Form）
                        + GitHub 检查入口
building/index.html     账本展开（六行 Reality Marker，含 ymai.me 与 /evidence 两个 DIRECTION）
                        + 「我们也判断错」三条真实返工记录（来自 v0.2–v0.4 的修订史）
```

- 内容纪律：/foundation 全部取自 `YuemingHub/mingos-foundation` 的真实 README（Working principles、
  core distinction、Candidate 状态），没有编造原则；/building 的"判断错"三条全部是本仓库修订史里
  真实发生过的返工。第二层/第三层页允许比首页说得多，但仍守一屏一事。
- 每页仍是**自包含单文件**：同一份 CSP（`default-src 'none'`）、no-referrer、内联 favicon、
  skip link、`:focus-visible`、`prefers-reduced-motion`。行为层只留浮现 + 顶栏进度，无抽屉无 Tab。
- 页头右侧用 mono 面包屑标位置（`MINGOS.CN / FOUNDATION`），页脚复用同一张星座图。
- **字体改为按页子集**：build-font.py 一次跑四个页面，每页内联各自的子集
  （首页 60,756 B 不变；mingos 34,680 B；foundation 31,616 B；building 37,752 B），
  仓库根 `MingOS-Serif.woff2` 变为四页并集（80,720 B），供四站复用。
  改任何一页文案后重跑 `python tools/build-font.py` 即可，脚本自动只补差异。

**实测修掉的四个真 bug**（浏览器逐视口走查发现的）：

1. 手机首屏主句把「自己」拆成「自/己」两行（v0.3 重新居中后暴露）。修：`来处。`/`自己。`
   整块包 `.nw{white-space:nowrap}`，断行只允许落在逗号后。修完 390 宽下
   「一个人，最终走向 / 自己。」两行都是完整的词组。
2. **关闭态抽屉一直暴露在无障碍树里**：CSS `.drawer{display:flex}` 盖掉了 `hidden` 属性，
   占位标题「标题」会被读屏读到。修：`.drawer[hidden]{display:none}`；连带发现 display:none
   出场会跳过滑入过渡，在 openDrawer 里补一次 `void drawer.offsetWidth` 强制布局。
   实测开→合全周期：关闭态 display:none ✓，打开后标题填充 ✓，收起后回归隐藏 ✓。
3. 观察器保险：IO 迟迟不派发时（隐藏标签页、部分内嵌内核），首屏内容会一直是 opacity 0 空屏。
   四页统一加 1600ms 兜底——首屏内未亮的 `.rv` 直接点亮（正常浏览器里这是无感的 no-op）。
4. 触控区两处缺口：`.brand`（四页都有）和首页 `.more` 链接实际只有 33–34px 高。
   统一补 44×44 不可见扩展层，与站点自己的 hit44 纪律对齐。

**实测记录**（1440×900 与 390×844）：四页零横向溢出、SVG 题字零裁切、字体逐页真渲染
（`document.fonts.check`）、手机正文 16.8px ≥16.5px、三个新页 H1 都整块落在首屏内、
触控区全 ≥44px。截图见 `shots/03–08`。
**教训（v0.4 同款）**：改了 display 或动过 JS 生命周期，必须在可见窗格里实测开合全程，
隐藏/后台标签页会给你"动画卡住、定时器迟滞"的假象，别把节流当 bug。

### v0.3 修订记录（2026-08-28 用户实看后）

用户提了两个问题，都指向真 bug：

**① 首屏文字改成居中。**
重排为：画面满幅做背景（`meet` 永不裁切 + 贴底锚定），文字浮在上方天空里，
画面内容全部让到四角与底部带。构图纪律：**中间 x 430–1010 / y 180–640 是文字区，画面不得侵入。**

**② Beat 03 的「世界」看不见。**
原因：环的 SVG 画布只有 620 宽，而「世界」从 x=580 开始写——第二个字直接写到画布外（「生活」也被裁了一半）。
修：画布扩到 `viewBox="-40 0 720 570"`，四个题字全部装得下。

顺手挖出两个更深的坑（都是实测才发现的）：

1. **CSS 动画会覆盖 SVG 属性 transform。** `.ring` 同时写了 `transform="rotate(-124 …)"` 和 CSS 旋转动画，
   CSS 赢 → 圆绕着视口中心**公转**而不是自转，bbox 飞到 2700px 外。
   规则：**旋转动画元素不得再带属性 transform**；初始角度用 `stroke-dashoffset` 表达，
   自转用 `transform-box:fill-box; transform-origin:center`。
2. **`slice`（裁切填满）在平板竖屏会把「家」和「世界」整个裁光。**
   改用 `meet` + 背景矩形向左右无限延伸（`x=-3000 width=7600`），既永不裁切、也不管超宽屏出现空带。
   构图变体按**宽高比**而不是宽度切换：`@media (max-aspect-ratio:1/1)` 用竖幅（手机/平板竖屏），否则横幅。

新增一条审查规则：**每个断点都要查 SVG 里的字有没有被画布裁掉**（用 getBoundingClientRect 对比 svg 自身 rect）。
以前只查了文档横向溢出，漏了这个。

实测（320/360/390/414/430/768/900/1024/1280/1440/2560）：
题字与文案零重叠、零裁切；首屏整块在一屏内；触控区全部 ≥44px；无横向溢出；无悬空 aria；CSP 零违规。

---

### v0.2 修订记录（2026-08-28 外部审查后）

修了 14 项 🟡：动画时长下限、删无效 token、硬编码色收进 token、SVG 字体栈统一为 `.life-svg`、
首屏文字降到 46、`100vh` 回退、`em` 伪斜体、`.js` 提到 head、视差改用 `translate` 且手机端关闭、
Beat 03 补 `id="s3"`、`aria-hidden` 套 `role="img"` 的死标签、移动端图标按钮补 `aria-label`、
英文部件补 `lang="en"`、`backdrop-filter` 降级。另加：CSP、no-referrer、内联 favicon、
`scrollbar-gutter:stable`、`type="button"`、进度条改 `transform`、全部 SVG 题字字号上调 40–60%。

未采纳的一条：审查说“视差与 `.rv` 的 transform 叠加会迟滞”——实际两者作用在不同元素上（父 `.hero-art` vs 子 svg），
不存在叠加；但“每帧写 transform”确实不理想，已按建议改成独立的 `translate` 属性并在手机端禁用。

### 待办

- [x] 第二层页面 `/mingos` `/foundation` `/building` —— 已完成（v0.5）；`/evidence` 仍未建（已在 building 账本里标 DIRECTION，不装）
- [ ] `ymai.fun` 尚无公开页，首屏"我的地方"入口暂时打不开（已标 DIRECTION，不装）
- [ ] 旧版 `mingos-current.html` 归档改名，避免与新体系混淆
- [x] ~~真实摄影替换 `[photo-slot]`~~ —— 已取消（2026-08-29 用户定）：SVG 画面即终稿，不再等照片
- [ ] 部署上线（~~零外部请求单文件，静态托管即可~~）—— 已完成（2026-08-28）：root@39.107.228.76，
      `/opt/mingos-web/releases/20260828_living-v05` + `current` 软链 + nginx root 指向 current。
      旧站 5 个版本已拉回本地存档（`../server-archive-20260828/`，含 MD5）后从服务器删除。
      以后发新版：上传新 release 目录 → `ln -sfn` 切 current → `nginx -t && systemctl reload nginx`，零停机可回滚。
- [x] 中文宋体子集内嵌 —— 已完成（v0.4，见 7c）；改文案后重跑 tools/build-font.py（v0.5 起一次覆盖四个页面，按页各自子集）

下一步顺序（一个 Beat 一个 Beat 打磨，不一次生成整站）：
1. 定稿 mingos.cn 首屏画面（可替换为真实摄影）
2. ~~补 `/mingos` `/foundation` `/building` 三个第二层页面~~ —— 已完成（v0.5）
3. 抽出 `packages/design-system`（tokens.css + 组件），四站共享
4. ymai.love → ymai.fun → ymai.me（同一骨骼，不同生命状态）
5. ~~部署上线~~ —— 已完成（2026-08-28，软链发布模式）；`/evidence` 证据页待建
6. ymai.love 门面页已上线（2026-08-29，`../ymai-love/`，替换根路径旧前端；
   /app 家长端、/admin→:3200 管理端保持接通；旧前端存档 ../server-archive-ymai-frontend-20260829/）

代码位置：本目录文件同步在 GitHub YuemingHub/MingOS 仓库 website/ 目录（main 分支）。
