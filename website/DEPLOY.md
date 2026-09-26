# mingos.cn 部署手册（全新 Linux VPS · 从零到 HTTPS）

V0 是纯静态站：**不部署 Node runtime**。任何一台全新 Ubuntu/Debian VPS，按本文
从头到尾顺序执行即可完成首次上线。所有命令默认以 root（或 sudo）执行。

```text
GitHub main → npm ci && npm run build → out/
    → rsync 到 /var/www/mingos.cn
    → Stage A: HTTP bootstrap（无证书可运行）
    → certbot webroot 签发证书
    → Stage B: HTTPS final 配置
    → 验收
```

两个 nginx 配置文件：

| 文件 | 用途 | 何时启用 |
| --- | --- | --- |
| `deploy/nginx.bootstrap.conf` | 只监听 80，不引用任何证书 | **全新服务器第一次** |
| `deploy/nginx.mingos.cn.conf` | HTTPS 最终配置 | 证书签发成功之后 |

---

## 0. 事实检查（每个新环境先跑一遍）

```bash
cat /etc/os-release          # 确认发行版
nginx -v                     # 若已装；记录版本
```

**HTTP/2 决策表**（决定 Stage B 是否开启 HTTP/2，见 nginx.mingos.cn.conf 头部注释）：

| nginx 版本 | 做法 |
| --- | --- |
| >= 1.25.1 | 在两个 443 server 块各加一行 `http2 on;` |
| 1.9.5 – 1.25.0 | 把 `listen 443 ssl;` 改为 `listen 443 ssl http2;` |
| < 1.9.5 | 什么都不改，HTTP/1.1 完全可用 |

> 本站仅 ~108KB，HTTP/2 不是上线前提。**可部署 > HTTP/2。**

## 1. 安装 nginx + certbot

Ubuntu/Debian：

```bash
apt update
apt install -y nginx certbot python3-certbot-nginx curl
nginx -v && nginx -V   # 记录版本与编译参数（部署前事实检查）
```

## 2. 创建目录

```bash
mkdir -p /var/www/mingos.cn     # 静态产物
mkdir -p /var/www/certbot       # ACME webroot 验证
```

## 3. 上传静态产物

本地构建（你的电脑上，不是服务器）：

```bash
npm ci --include=dev
npm run build          # 产物在 out/
```

> 注意：若终端 `NODE_ENV` 被全局设为 `production`，先清掉它，否则
> devDependencies 会被跳过、构建可能异常（详见 README）。

上传（本地执行，把 `user@server` 换成真实地址）：

```bash
rsync -avz --delete out/ user@server:/var/www/mingos.cn/
```

## 4. 启用 HTTP Bootstrap（Stage A）

服务器上：

```bash
# 备份并清掉默认站点，避免冲突
rm -f /etc/nginx/sites-enabled/default

cp deploy/nginx.bootstrap.conf /etc/nginx/conf.d/mingos.conf
# （若系统 nginx 使用 sites-enabled 结构：cp 到 /etc/nginx/sites-available/mingos.conf
#   并 ln -s 到 sites-enabled/）

nginx -t        # 必须通过：此配置不引用任何证书
systemctl reload nginx
```

## 5. DNS / HTTP Preflight

确认域名 A 记录已指向本服务器 IP：

```bash
dig +short mingos.cn
curl -I http://mingos.cn/          # 期望 200（bootstrap 直接提供静态站）
curl -I http://mingos.cn/.well-known/acme-challenge/test   # 期望 404（目录已生效）
```

若 `dig` 结果不是服务器 IP：先去 DNS 服务商改记录，等生效再继续。

## 6. 获取证书（Stage B 前提）

```bash
certbot certonly --webroot -w /var/www/certbot -d mingos.cn -d www.mingos.cn
```

成功标志：`Successfully received certificate`，证书落在
`/etc/letsencrypt/live/mingos.cn/`。

> 失败排查：90% 是 DNS 未生效或 80 端口未放行（云服务商安全组也要放行 80/443）。

## 7. 切换 HTTPS Final 配置

```bash
cp deploy/nginx.mingos.cn.conf /etc/nginx/conf.d/mingos.conf
# （sites-enabled 结构的系统同样对应替换）

# 按第 0 步的版本决策表决定是否加 HTTP/2（默认不加也能上线）
nginx -t        # 必须通过
systemctl reload nginx
```

## 8. HTTPS Smoke Test

```bash
curl -I https://mingos.cn/                    # 200
curl -I http://mingos.cn/                     # 301 → https
curl -I https://www.mingos.cn/                # 301 → https://mingos.cn
curl -sI https://mingos.cn/ | grep -iE "strict-transport|x-content-type|referrer|cache-control"
```

## 9. 续期自检

```bash
certbot renew --dry-run
systemctl list-timers | grep certbot   # 确认自动续期 timer 存在
```

## 10. Headers 逐项验证

```bash
curl -I https://mingos.cn/
curl -I https://mingos.cn/MingOS-Serif.woff2
curl -I https://mingos.cn/icon.svg
```

预期（每个响应都应有）：

| Header | 预期值 |
| --- | --- |
| Strict-Transport-Security | max-age=31536000 |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Cache-Control（HTML/字体） | no-cache, must-revalidate |
| Cache-Control（icon.svg） | public, max-age=604800 |

> 注意 add_header 继承语义：location 内只要有任何 add_header，server 级的整组
> 就不继承——所以配置里每个 location 都显式重复了安全头。改配置时保持这个写法。

## 11. 资源验证

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://mingos.cn/robots.txt     # 200
curl -s -o /dev/null -w "%{http_code}\n" https://mingos.cn/sitemap.xml    # 200
curl -s -o /dev/null -w "%{http_code}\n" https://mingos.cn/icon.svg       # 200
curl -s -o /dev/null -w "%{http_code}\n" https://mingos.cn/404-page.html  # 404
curl -I https://mingos.cn/favicon.ico   # 301 → /icon.svg
```

最后用真实浏览器过一遍手机 + 桌面、无 JS、reduced-motion。
