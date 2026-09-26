#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
MingOS · 分享卡片生成工具

生成 public/og.png（1200×630），用于社交平台分享时的预览图
（layout.tsx 里 metadata.openGraph.images 引用的就是这个文件）。

用法：
    python tools/build-og.py

字体：优先取 Noto Serif SC 的官方 TTF（与网站标题同款，SIL OFL 1.1，
见 FONT-LICENSE.txt），取不到就回退系统宋体，不会报错。
文案改动后重跑即可；下载的字体缓存在 tools/.cache（已 gitignore）。
"""
import os
import subprocess

from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "public", "og.png")
CACHE = os.path.join(HERE, ".cache")

W, H = 1200, 630

# 卡面文案（改这里即可）
BRAND = "MingOS"
LINE1 = "AI 越来越强之后，"
LINE2 = "人怎样越来越成为人。"
SUB = "从自己，到关系，再到真实世界。"
SITE = "mingos.cn"

INK = (232, 228, 218)
SUB_C = (138, 133, 124)
WARM = (217, 168, 119)

# 官方 TTF/OTF 源，按顺序试。
# 注意：不要用 Google Fonts CSS + 老 UA 的老办法——那会返回 EOT，Pillow 读不了。
SERIF_SOURCES = [
    ("NotoSerifSC.ttf",
     "https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf"),
    ("NotoSerifSC-Regular.otf",
     "https://raw.githubusercontent.com/notofonts/noto-cjk/main/Serif/SubsetOTF/SC/NotoSerifSC-Regular.otf"),
]


def curl(url, out_path):
    p = subprocess.run(
        ["curl", "-s", "-L", "-m", "300", "-o", out_path, url],
        capture_output=True,
    )
    return p.returncode == 0 and os.path.exists(out_path) and os.path.getsize(out_path) > 500_000


def fetch_serif():
    """返回可用的字体路径；失败返回 None。"""
    os.makedirs(CACHE, exist_ok=True)
    for name, url in SERIF_SOURCES:
        path = os.path.join(CACHE, name)
        if os.path.exists(path) and os.path.getsize(path) > 500_000:
            if usable(path):
                return path
        if curl(url, path) and usable(path):
            return path
        if os.path.exists(path):
            os.remove(path)
    return None


def usable(path):
    """Pillow 真的能加载才算数——避免 EOT 之类假 TTF。"""
    try:
        ImageFont.truetype(path, 40)
        return True
    except Exception:
        return False


def pick_font(size, kind="serif"):
    if kind == "serif":
        p = fetch_serif()
        if p:
            try:
                return ImageFont.truetype(p, size), os.path.basename(p)
            except Exception:
                pass
        for cand in (r"C:\Windows\Fonts\simsun.ttc", r"C:\Windows\Fonts\simsunb.ttf"):
            if os.path.exists(cand):
                try:
                    return ImageFont.truetype(cand, size), "SimSun(回退)"
                except Exception:
                    continue
    for cand in (r"C:\Windows\Fonts\msyh.ttc", r"C:\Windows\Fonts\simhei.ttf"):
        if os.path.exists(cand):
            try:
                return ImageFont.truetype(cand, size), "Microsoft YaHei"
            except Exception:
                continue
    return ImageFont.load_default(), "默认(回退)"


def spread(draw, xy, text, font, fill, spacing=0.0):
    """PIL 没有字距，逐字画。spacing 为额外字距(px)。"""
    x, y = xy
    if spacing <= 0:
        draw.text((x, y), text, font=font, fill=fill)
        return
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + spacing


def venn_layer():
    """三个交叠的圆，很淡，靠右出血——与站内那屏呼应。"""
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy, r = 985, 315, 175
    dy = int(r * 0.577)
    soft = INK + (36,)
    for ox, oy in ((0, -dy), (-r // 2, dy - dy // 2 - 12), (r // 2, dy - dy // 2 - 12)):
        d.ellipse([cx + ox - r, cy + oy - r, cx + ox + r, cy + oy + r], outline=soft, width=2)
    d.ellipse([cx - 4, cy + dy - 26, cx + 4, cy + dy - 18], fill=INK + (90,))
    return layer


def build():
    # 1) 底色：夜，向下极缓地抬一点
    bg = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(bg)
    stops = [(0.0, (8, 13, 18)), (0.55, (13, 19, 26)), (1.0, (23, 28, 34))]
    for y in range(H):
        t = y / (H - 1)
        col = stops[-1][1]
        for i in range(len(stops) - 1):
            t0, c0 = stops[i]
            t1, c1 = stops[i + 1]
            if t0 <= t <= t1:
                k = (t - t0) / (t1 - t0)
                col = tuple(int(c0[j] + (c1[j] - c0[j]) * k) for j in range(3))
                break
        d.line([(0, y), (W, y)], fill=col)

    # 2) 地平线下的暖光：只露一点点黎明
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse(
        [W / 2 - 600, H - 260, W / 2 + 600, H + 420], fill=WARM + (58,)
    )
    glow = glow.filter(ImageFilter.GaussianBlur(130))
    bg = Image.alpha_composite(bg.convert("RGBA"), glow).convert("RGB")

    # 3) 交叠的圆
    bg = Image.alpha_composite(bg.convert("RGBA"), venn_layer()).convert("RGB")

    # 4) 文案
    d = ImageDraw.Draw(bg)
    f_brand, n1 = pick_font(27, "sans")
    f_h, n2 = pick_font(74, "serif")
    f_sub, n3 = pick_font(30, "sans")
    f_site, n4 = pick_font(25, "sans")
    print("字体：品牌=%s  标题=%s  副句=%s  域名=%s" % (n1, n2, n3, n4))

    spread(d, (96, 86), BRAND, f_brand, INK, spacing=7)
    d.text((96, 236), LINE1, font=f_h, fill=INK)
    d.text((96, 336), LINE2, font=f_h, fill=INK)
    d.line([(96, 472), (196, 472)], fill=INK + (70,), width=2)
    d.text((96, 502), SUB, font=f_sub, fill=SUB_C)
    w = d.textlength(SITE, font=f_site)
    d.text((W - 96 - w, H - 76), SITE, font=f_site, fill=SUB_C)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    bg.save(OUT, "PNG", optimize=True)
    print("已生成 %s  (%d×%d, %.1f KB)" % (OUT, W, H, os.path.getsize(OUT) / 1024))


if __name__ == "__main__":
    build()
