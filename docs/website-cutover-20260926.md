# mingos.cn 生产真源切换记录（2026-09-26）

任务源：GitHub Issue #48（Phase D: no-change mingos.cn cutover from MingOS/website）。
执行分支：`deploy/mingos-no-change-cutover-20260926`。
目标：把 mingos.cn 的生产源码权威从 `YuemingHub/MingOS-web` 切换到 `YuemingHub/MingOS/website`，对外零意图变化。

结论先行：**CUTOVER = PASS**（2026-09-26T06:05Z 切换，公网逐项复验通过）。
`MingOS-web` 状态：**ARCHIVE_SAFE 候选**（待 Commander 裁决归档；本任务未动该仓）。

## Phase 0 事实（全部为服务器/公网实测，非文档转述）

- 生产机：Aliyun ECS `39.107.228.76`（mingos.cn 与 www A 记录均指向它；SSH 经 WireGuard `family-space`）。
- nginx 1.18.0（Ubuntu），`sites-enabled/mingos.cn` → `sites-available/mingos.cn`（HTTPS Stage B 配置）。
  - 主站 server block：`root /var/www/mingos.cn`，`try_files $uri $uri/ $uri/index.html =404`，
    `error_page 404 /404.html`，`/favicon.ico` 301 → `/icon.svg`，按路径分级缓存头。
  - HTTP 80 只做 ACME webroot + 301 → HTTPS；www 301 → apex。未启用 HTTP/2（nginx < 1.25.1，按配置注释决策）。
- docroot 是真实目录（非 symlink），切换前属主 `197608:197121`（本机 Windows Git Bash 上传痕迹）。
- 部署机制：静态文件整体替换；`/var/www/` 下历次备份 `.mingos.cn.prev*`、`.mingos.cn.bak-20260912-*`、
  `mingos.cn.old-20260920T*` 证明既有惯例即「旧目录改名留存 + 新产物拷入」。
- 磁盘：`/dev/vda3` 40G，已用 7.4G，余 30G。权限：root 可写。
- 切换前公网基线（2026-09-26T05:5xZ 抓取，`/` 与 docroot 文件大小逐一吻合，无 CDN 夹层）：
  `/` 13045B · `/foundation/` 11695B · robots 63B · sitemap 407B · icon.svg 287B ·
  og.png 97456B · 字体 54580B · 404 页 4009B · favicon 301。

## Phase 1 等价验证

从 `origin/main`（`f1bb110`）clean install + build（`npm ci` + `npm run build`，Next 16.3.4 静态导出，
postbuild `strip-runtime.mjs` 剥除全部 runtime JS）。

第一轮构建发现两处字节差异，均非文案/视觉变化，根因是换行符：

1. `index.html` 13049 vs 13045（+4B）：`horizon__person` SVG path 的 `d` 属性内含 `\r\n\n`。
   本机 `core.autocrlf=true` 把工作区检成 CRLF，而线上构建时 `page.tsx` 工作区是 LF。
2. `<link rel="icon" href="/icon.svg?icon.<hash>">` 的 hash 变化（`2c_nh6nsjpq3` vs 线上 `3t-9imdfo3sbz`），
   且服务端 icon.svg 变 283B（线上 287B）。根因：`app/icon.svg` 的资源 hash 与**原始字节**敏感
   （CSS 经 PostCSS 重序列化所以 hash 稳定；SVG 资产原样参与 hash）。
   线上构建消费的是 MingOS-web 工作区的 CRLF 版 icon.svg（287B）；吸收进 MingOS 时被 autocrlf
   归一化成 LF（283B），丢失了生产真实输入字节。

修复（commit `cecca5b`）：

- `website/app/icon.svg` 恢复为生产真实字节（287B/CRLF；与 MingOS-web 工作区文件、
  与公网所服务文件三方 `Buffer.compare` 相等）；
- 新增 `website/.gitattributes`（`* -text`），保证任何平台干净检出都是精确字节。

终版验证（clean rebuild 后）：

| 产物 | vs 公网 |
| --- | --- |
| index.html | 逐字节一致 |
| foundation/index.html | 逐字节一致 |
| 404.html | 逐字节一致 |
| robots.txt | 逐字节一致 |
| icon.svg | 逐字节一致 |
| og.png | 逐字节一致 |
| MingOS-Serif.woff2 | 逐字节一致 |
| _next/static/chunks/0r65-9pfqt9oa.css | 逐字节一致 |
| sitemap.xml | 仅 lastmod 时间戳（2026-09-20 → 2026-09-26，构建期变化，Issue 允许） |

no-JS：产物 `_next/` 内无任何 .js（runtime 已剥除），正文全部内联于 HTML。
移动端：HTML+CSS 字节与原生产一致 ⇒ 渲染行为可证等价（访问日志亦见移动端 200/304）。

## Phase 2 备份 + 切换（2026-09-26T06:05:40Z）

机制：tar over SSH（与既有部署同性质的纯静态文件替换；零 nginx/DNS/证书/域名改动）。

1. 上传到 staging：`/var/www/.mingos.cn.staging-20260926T060540Z`；
2. 服务器端 `sha256sum` 清单 vs 本地构建清单：**12/12 一致**；
3. 两次 rename 切换：
   - `mv /var/www/mingos.cn /var/www/mingos.cn.pre-cutover-20260926T060540Z`（备份 = 原目录整体改名，字节原样）
   - `mv /var/www/.mingos.cn.staging-20260926T060540Z /var/www/mingos.cn`
4. nginx 未 reload、未重启（master 自 2026-09-16 运行）；属主 197608:197121、755/644，与历史一致。

**Rollback（一条命令即可回到切换前）：**

```bash
ssh family-space 'mv /var/www/mingos.cn /var/www/mingos.cn.cutover-20260926 && mv /var/www/mingos.cn.pre-cutover-20260926T060540Z /var/www/mingos.cn'
```

## Phase 3 公网复验（切换后）

- `/`、`/foundation/`、robots、icon、og、字体、404 页、CSS：与切换前基线**逐字节一致**（http 200/404/301 全对）；
- sitemap.xml：仅 lastmod 更新为本次构建时间（唯一生成性变化）；
- 安全头/缓存头逐项符合设计（HSTS、nosniff、referrer-policy、分级 Cache-Control）；
- nginx error.log 无新增错误（末尾条目均为切换前扫描器噪音）；
- 访问日志可见真实用户（含 Android/iPhone）200/304 正常。

## 可追溯性链条

```
main f1bb110 → deploy 分支 cecca5b（icon.svg 生产字节恢复 + .gitattributes，diff 仅 2 文件）
  → git archive cecca5b 纯净重建：11/12 与部署字节一致（sitemap 仅 lastmod 构建时间）
  → tar → 服务器 staging（12/12 sha256 一致）→ rename 切换 → 线上 docroot
  → 公网响应逐字节复验
```

线上 docroot 12 文件 sha256 与本地构建清单、pristine 重建清单三方核对通过：
11 文件完全一致，`sitemap.xml` 差异仅为 lastmod 构建时间戳（部署版 `47b58409…`，
pristine 版 `7db5d488…`，两者均 407B，其余字段相同）。原始清单留存于
`.tmp/cutover-20260926/`（本地未入库）与服务器 `/var/www/mingos.cn.pre-cutover-20260926T060540Z`。

## Authority 分类与边界

- 本次新增 Core primitive：**无**（纯部署事实收敛，不触及内核语义）。
- 未动 DNS / 证书 / 域名 / 文案 / UI / nginx 架构 / backend / 其他 Space。
- `MingOS-web` 未做任何改动（不自行归档，待 Commander 裁决）。

## UNKNOWN / 遗留

- sitemap lastmod 每次构建必然变化，属 Next 构建期生成物，无法也不应固化；
- `/foundation`（无尾斜杠）与 `/foundation/` 由 nginx `try_files` 统一服务，行为与切换前一致；
- deploy 分支尚未 merge 回 main——是否合并、是否归档 MingOS-web，均待 Commander 决定；
- 未来在 Windows 上重建请勿删除 `website/.gitattributes`，否则 icon hash 会再次漂移。
