#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
MingOS · 中文衬线子集构建工具

标题/核心句使用的 "MingOS Serif" 是 Noto Serif SC（SIL OFL 1.1 授权，见 FONT-LICENSE.txt）
的按需子集：包含 out/ 下所有已导出页面里真正出现的字符（全站并集）。

用法：
    pip install fonttools brotli        # 只需一次
    npm run build                       # 先产出 out/index.html
    python tools/build-font.py          # 联网拉取 Google Fonts 分片并生成 public/MingOS-Serif.woff2
    npm run build                       # 字体进入 public/ 后再构建一次

文案改动后重跑即可；缺字会掉到系统宋体栈（Songti SC / SimSun），不会报错。
"""
import os, re, io, sys, json, shutil, subprocess, tempfile, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUTDIR = os.path.join(ROOT, 'out')
OUTFONT = os.path.join(ROOT, 'public', 'MingOS-Serif.woff2')
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
CSS_URL = 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400&display=swap'


def get(url, binary=False, tries=4):
    """curl 优先（部分环境 Python urllib 与 Google TLS 握手会失败），失败退回 urllib。"""
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
        import time
        time.sleep(2 * (n + 1))
    raise RuntimeError('下载失败 %s（%s）' % (url[:70], last))


def page_chars():
    """全站并集：out/ 下每一个已导出的页面都要有字形覆盖。

    只扫 index.html 的话，二级页（如 /foundation）独有的用字会缺，
    而缺字是静默回退到系统宋体——肉眼很难发现，只有对比才看得出来。"""
    import html as h
    need = set()
    files = []
    for dirpath, _dirs, names in os.walk(OUTDIR):
        for n in names:
            if n.endswith('.html'):
                files.append(os.path.join(dirpath, n))
    for f in sorted(files):
        body = io.open(f, encoding='utf-8').read().split('<body')
        if len(body) < 2:
            continue
        body = body[1]
        body = re.sub(r'<script[\s\S]*?</script>', '', body)
        body = re.sub(r'<style[\s\S]*?</style>', '', body)
        txt = h.unescape(re.sub(r'<[^>]+>', '', body))
        need |= {c for c in txt if ord(c) > 127}
    print('扫描 %d 个页面' % len(files))
    return sorted(need)


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


def main():
    chars = page_chars()
    print('页面需要 %d 个非 ASCII 字符' % len(chars))
    need = {ord(c) for c in chars}

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
        print('  注意：以下字符不在 Noto Serif SC 里，将走系统字体栈：')
        print('   ', ' '.join('U+%04X(%s)' % (m, chr(m)) for m in miss))

    merged = os.path.join(tmp, 'merged.ttf')
    subprocess.run([sys.executable, '-m', 'fontTools.merge'] + parts +
                   ['--output-file=' + merged], check=True, capture_output=True)

    final = os.path.join(tmp, 'final.woff2')
    allchars = os.path.join(tmp, 'all.txt')
    open(allchars, 'w', encoding='utf-8').write(''.join(chars))
    subprocess.run([sys.executable, '-m', 'fontTools.subset', merged,
                    '--text-file=' + allchars, '--flavor=woff2', '--output-file=' + final,
                    '--layout-features=', '--no-hinting', '--desubroutinize',
                    '--name-IDs=1,2,3,4,6', '--notdef-outline'], check=True, capture_output=True)

    # 规整 name 表与字重，避免浏览器字体面板出现误导信息
    from fontTools.ttLib import TTFont
    f = TTFont(final)
    n = f['name']
    n.names = [r for r in n.names if r.platformID != 1]
    for nid, val in [(1, 'MingOS Serif'), (2, 'Regular'), (3, 'MingOSSerif-Regular'),
                     (4, 'MingOS Serif'), (6, 'MingOSSerif-Regular')]:
        n.setName(val, nid, 3, 1, 0x409)
        n.setName(val, nid, 1, 0, 0)
    f['OS/2'].usWeightClass = 400
    f.flavor = 'woff2'
    os.makedirs(os.path.dirname(OUTFONT), exist_ok=True)
    f.save(OUTFONT)
    size = os.path.getsize(OUTFONT)
    print('最终字体: %s  %d B  字形 %d' % (os.path.relpath(OUTFONT, ROOT), size,
                                          TTFont(OUTFONT)['maxp'].numGlyphs))
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    main()
