/* verify.sh 的报告端：把 _verify.html 吐出的 JSON 变成人话 */
let s = '';
process.stdin.on('data', d => s += d).on('end', () => {
  if (!s) { console.log('  无输出（Chrome 没跑起来？）'); return; }
  let o;
  try { o = JSON.parse(s); } catch (e) { console.log('  解析失败:', s.slice(0, 120)); return; }
  if (o.err) { console.log('  ERR', o.err); return; }
  const ok = b => b ? '✓' : '✗';

  console.log('  视口', o.vw + 'x' + o.vh, '| 字体', o.fonts.join(', '));
  const f = o.fx;
  console.log('  内嵌字体真在渲染:',
    ok(f.mingosJia !== f.simsunJia && f.mingosLu !== f.simsunLu),
    '(「家」墨点 ' + f.mingosJia.split('/')[1] + ' vs 宋体 ' + f.simsunJia.split('/')[1] + ')');
  console.log('  首屏一屏内:', o.fold.every(x => x.includes('OK')) ? '✓ ' + o.fold.length + ' 项' : '✗ ' + o.fold.join(','));
  console.log('  文字居中:', o.center);
  console.log('  SVG 字被裁:', o.clip.length ? '✗ ' + o.clip.join(',') : '✓ 无',
    '| 题字压文案:', o.hitText.length ? '✗ ' + o.hitText.join(',') : '✓ 无');
  console.log('  触控<44px:', o.tiny.length ? '✗ ' + o.tiny.join(',') : '✓ 无',
    '| 横向溢出:', o.docOverflow ? '✗ ' + o.docOverflow : '✓ 无');
  console.log('  悬空 aria:', o.dangling, '| 无 type 按钮:', o.btnNoType,
    '| lang=en:', o.langs, '| 外部资源:', o.extRes);
});
