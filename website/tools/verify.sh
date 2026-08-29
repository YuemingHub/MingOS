#!/bin/bash
# 回归验证：把 index.html 在多种视口下跑一遍，检查
#   内嵌字体是否真在渲染 / 首屏是否一屏内 / 文字是否居中 /
#   SVG 字是否被画布裁掉 / 画面题字是否压住文案 /
#   触控区是否 ≥44px / 横向溢出 / 悬空 aria / 外部资源数
#
# 用法（在项目根目录或 tools/ 里都行）：
#   bash tools/verify.sh 1440,900 390,844
#   bash tools/verify.sh                      # 用默认这一组宽度
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
[ -x "$CHROME" ] || CHROME="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
[ -x "$CHROME" ] || { echo "找不到 Chrome，改一下脚本里的 CHROME 路径"; exit 1; }

if [ "$#" -gt 0 ]; then SIZES="$*"; else SIZES="1440,900 1374,677 1280,800 1024,768 900,600 768,1024 320,700 360,780 390,844 430,932"; fi

node tools/verify.js || { echo "verify.js 失败"; exit 1; }
URL_ROOT="file://$(pwd -W 2>/dev/null || pwd)"

run() { # $1=url $2=window-size
  "$CHROME" --headless=new --disable-gpu --allow-file-access-from-files \
    --virtual-time-budget=22000 --window-size="$2" --dump-dom "$1" 2>/dev/null \
  | tr -d '\n' | grep -o '<pre id="AUD">[^<]*' | sed 's/<pre id="AUD">//'
}

for W in $SIZES; do
  w=${W%,*}; h=${W##*,}
  printf "\n──── %s ────\n" "$W"
  if [ "$w" -le 500 ] 2>/dev/null; then
    # Chrome 无头有 500px 最小窗口宽度，窄视口只能用同源 iframe 强制
    printf '<!DOCTYPE html><meta charset=utf-8><body style=margin:0><iframe id=f src=_verify.html style="width:%spx;height:%spx;border:0"></iframe><script>f.addEventListener("load",function(){setTimeout(function(){var a=f.contentWindow.document.getElementById("AUD");var p=document.createElement("pre");p.id="AUD";p.textContent=a?a.textContent:JSON.stringify({err:"iframe 没拿到结果"});document.body.appendChild(p)},4200)})</script>' "$w" "$h" > _frame.html
    run "$URL_ROOT/_frame.html" "1600,1200"
  else
    run "$URL_ROOT/_verify.html" "$W"
  fi | node tools/verify-report.js
done
rm -f _frame.html _verify.html
