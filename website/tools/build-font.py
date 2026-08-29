#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
MingOS · 中文衬线子集重建工具（多页面版）

用途：标题字用的是内嵌的 "MingOS Serif"（Noto Serif SC 子集）。
      如果你改了文案、出现了新的汉字，那几个字会掉回系统字体（宋体），
      看起来就是"一句话里有一两个字不一样"。这时重跑一次本脚本即可。

覆盖范围：index.html + mingos/ + foundation/ + building/ 四个页面。
每个页面内联【自己的】子集（首页保持最小，新页面各自独立，互不增重）。
仓库根目录的 MingOS-Serif.woff2 是四页并集，供四站复用与重建。

用法（在项目根目录 mingos-cn/ 下）：
    pip install fonttools brotli      # 只需一次
    python tools/build-font.py        # 需要联网，约 1-2 分钟

它做五件事：
  1. 从四个页面各抽出非 ASCII 字符（页面真正会显示的字）
  2. 向 Google Fonts 取 Noto Serif SC 的分片清单，只下载覆盖到并集的那几片
  3. 裁到只剩这些字 → 合并成一个并集字体
  4. 并集字体存回 MingOS-Serif.woff2；再按页裁出各自的子集
  5. 各页子集 base64 内联回各自 HTML 的 @font-face

字体许可：SIL Open Font License 1.1（可商用、可内嵌、可子集化）。
         授权全文见 FONT-LICENSE.txt，随字体一起分发是 OFL 的要求。
"""
import os, re, sys, json, shutil, subprocess, tempfile, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PAGES = ['index.html', 'mingos/index.html', 'foundation/index.html', 'building/index.html']
OUTFONT = os.path.join(ROOT, 'MingOS-Serif.woff2')
# 可选：传入另一个站点根目录（如 ../ymai-love），自动发现根目录 *.html 与 */index.html
if len(sys.argv) > 1:
    ROOT = os.path.abspath(sys.argv[1])
    import glob
    PAGES = sorted(
        os.path.relpath(p, ROOT).replace('\\', '/')
        for p in glob.glob(os.path.join(ROOT, '*.html'))
        + glob.glob(os.path.join(ROOT, '*', 'index.html')))
OUTFONT = os.path.join(ROOT, 'MingOS-Serif.woff2')
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
CSS_URL = 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400&display=swap'


def get(url, binary=False, tries=4):
    """先用 curl（本环境里 Python 的 urllib 跟 Google 的 TLS 握手会失败），再退到 urllib。"""
    last = None
    for n in range(tries):
        try:
            if shutil.which('curl'):
                p = subprocess.run(['curl', '-s', '-m', '150', '-L', '-A', UA, url],
                                   capture_output=True, timeout=200)
                if p.returncode == 0 and p.stdout:
                    return p.stdout if binary else p.stdout.decode('utf-8')
                last = 'curl rc=%s' % p.returncode
            else:
                req = urllib.request.Request(url, headers={'User-Agent': UA})
                with urllib.request.urlopen(req, timeout=120) as r:
                    data = r.read()
                return data if binary else data.decode('utf-8')
        except Exception as e:
            last = str(e)[:80]
        import time; time.sleep(2 * (n + 1))
    raise RuntimeError('下载失败 %s（%s）' % (url[:70], last))


def page_chars(rel):
    html = open(os.path.join(ROOT, rel), encoding='utf-8').read()
    body = html.split('<body>')[1]
    body = re.sub(r'<script[\s\S]*?</script>', '', body)
    body = re.sub(r'<style[\s\S]*?</style>', '', body)
    txt = re.sub(r'<[^>]+>', '', body)
    return sorted({c for c in txt if ord(c) > 127})


def parse_range(ur):
    cps = set()
    for p in ur.split(','):
        p = p.strip().replace('U+', '').replace('u+', '')
        if '-' in p:
            a, b = p.split('-')
            cps.update(range(int(a, 16), int(b, 16) + 1))
        elif p:
            cps.add(int(p, 16))
    return cps


def rename_mingos(path):
    """改名：合并会让 name 表留下残留，浏览器字体面板里会误导。"""
    from fontTools.ttLib import TTFont
    f = TTFont(path)
    n = f['name']
    n.names = [r for r in n.names if r.platformID != 1]
    for nid, val in [(1, 'MingOS Serif'), (2, 'Regular'), (3, 'MingOSSerif-Regular'),
                     (4, 'MingOS Serif'), (6, 'MingOSSerif-Regular')]:
        n.setName(val, nid, 3, 1, 0x409)
        n.setName(val, nid, 1, 0, 0)
    f['OS/2'].usWeightClass = 400
    f.flavor = 'woff2'
    f.save(path)


def subset_to(src, text, dst):
    subprocess.run([sys.executable, '-m', 'fontTools.subset', src,
                    '--text=' + text, '--flavor=woff2', '--output-file=' + dst,
                    '--layout-features=', '--no-hinting', '--desubroutinize',
                    '--drop-tables+=DSIG,BASE,GDEF,GPOS,GSUB', '--name-IDs=1,2,3,4,6',
                    '--notdef-outline'], check=True, capture_output=True)


def inline(page_rel, b64):
    path = os.path.join(ROOT, page_rel)
    html = open(path, encoding='utf-8').read()
    pat = r'src:url\(data:font/woff2;base64,[A-Za-z0-9+/=]+\) format\("woff2"\);'
    if re.search(pat, html):
        html = re.sub(pat, 'src:url(data:font/woff2;base64,' + b64 + ') format("woff2");', html)
    else:
        print('  注意：%s 里没找到 @font-face 的 src，请手动插入一次（之后脚本会自动替换）' % page_rel)
        return
    open(path, 'w', encoding='utf-8').write(html)
    print('  已内联 %s（base64 %d 字符）' % (page_rel, len(b64)))


def main():
    page_map = {rel: page_chars(rel) for rel in PAGES}
    for rel, chars in page_map.items():
        print('%-24s %d 个非 ASCII 字符' % (rel, len(chars)))
    union = sorted({c for chars in page_map.values() for c in chars})
    need = {ord(c) for c in union}
    print('并集 %d 个字符' % len(union))

    css = get(CSS_URL)
    slices = []
    for b in re.findall(r'@font-face\s*\{(.*?)\}', css, re.S):
        u = re.search(r'src:\s*url\((.*?)\)', b)
        r = re.search(r'unicode-range:\s*(.*?);', b)
        if u and r:
            slices.append((u.group(1), r.group(1).strip()))
    picked = [i for i, (_, r) in enumerate(slices) if parse_range(r) & need]
    print('共 %d 个分片，需要其中 %d 个' % (len(slices), len(picked)))

    tmp = tempfile.mkdtemp(prefix='mingos-font-')
    parts, covered = [], set()
    for i in picked:
        url = slices[i][0]
        raw = os.path.join(tmp, 'raw%d.woff2' % i)
        open(raw, 'wb').write(get(url, binary=True))
        mine = sorted(parse_range(slices[i][1]) & need)
        covered.update(mine)
        txtf = os.path.join(tmp, 't%d.txt' % i)
        open(txtf, 'w', encoding='utf-8').write(''.join(chr(c) for c in mine))
        dst = os.path.join(tmp, 's%03d.woff2' % i)
        subprocess.run([sys.executable, '-m', 'fontTools.subset', raw,
                        '--text-file=' + txtf, '--flavor=woff2', '--output-file=' + dst,
                        '--layout-features=', '--no-hinting', '--desubroutinize',
                        '--drop-tables+=DSIG,BASE,GDEF,GPOS,GSUB', '--name-IDs=1,2,3,4,6',
                        '--notdef-outline'], check=True, capture_output=True)
        parts.append(dst)
        print('  分片 %-3d %d 字 → %d B' % (i, len(mine), os.path.getsize(dst)))

    miss = sorted(need - covered)
    if miss:
        print('  注意：这些字符不在该字体里，会继续走 sans/mono（通常是有意的）：')
        print('   ', ' '.join('U+%04X' % m for m in miss))

    merged = os.path.join(tmp, 'merged.ttf')
    subprocess.run([sys.executable, '-m', 'fontTools.merge'] + parts +
                   ['--output-file=' + merged], check=True, capture_output=True)

    # 并集字体：存回仓库根目录，供四站复用与以后重建
    union_font = os.path.join(tmp, 'union.woff2')
    allchars = os.path.join(tmp, 'all.txt')
    open(allchars, 'w', encoding='utf-8').write(''.join(union))
    subprocess.run([sys.executable, '-m', 'fontTools.subset', merged,
                    '--text-file=' + allchars, '--flavor=woff2', '--output-file=' + union_font,
                    '--layout-features=', '--no-hinting', '--desubroutinize',
                    '--name-IDs=1,2,3,4,6', '--notdef-outline'], check=True, capture_output=True)
    rename_mingos(union_font)
    shutil.copyfile(union_font, OUTFONT)
    from fontTools.ttLib import TTFont
    print('并集字体: MingOS-Serif.woff2  %d B  字形 %d' %
          (os.path.getsize(OUTFONT), TTFont(OUTFONT)['maxp'].numGlyphs))

    # 每个页面裁出自己的子集并内联
    for rel, chars in page_map.items():
        page_font = os.path.join(tmp, 'page.woff2')
        subset_to(merged, ''.join(chars), page_font)
        rename_mingos(page_font)
        size = os.path.getsize(page_font)
        import base64
        b64 = base64.b64encode(open(page_font, 'rb').read()).decode()
        print('%-24s 子集 %d B  字形 %d' % (rel, size, TTFont(page_font)['maxp'].numGlyphs))
        inline(rel, b64)

    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    main()
