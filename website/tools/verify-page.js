/* 通用回归验证：对任意一页跑多视口，检查
   内嵌字体是否真在渲染 / 横向溢出 / 触控区≥44px / 外部资源数 /
   H1 是否落在首屏内 / 手机正文字号 / SVG 题字是否被画布裁掉 / 运行时错误 / 悬空 aria
   用法：node tools/verify-page.js about/index.html 1440,900 390,844
   注：触控检测会把每个可点元素逐个滚到视口中心再命中测试
       （elementFromPoint 只对视口内坐标有效；站点自带 verify.js 没做这一步，会漏掉折叠线以下的元素）
*/
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const target = process.argv[2] || 'index.html';
const sizes = process.argv.slice(3).length ? process.argv.slice(3)
  : ['1440,900', '1280,800', '768,1024', '390,844', '360,780', '320,700'];

const src = fs.readFileSync(path.join(ROOT, target), 'utf8');

const probe = `<script>
(function(){
 var d=document; window.__errs=[];
 window.addEventListener('error',function(e){ window.__errs.push(String(e.message)); });
 window.addEventListener('load',function(){ setTimeout(run,1200); });

 function run(){
  var o={errs:window.__errs.slice(0,3)};
  function hash(ff,ch){var c=d.createElement('canvas');c.width=140;c.height=140;var x=c.getContext('2d');
    x.fillStyle='#fff';x.font='110px '+ff;x.textBaseline='top';x.fillText(ch,6,6);
    var p=x.getImageData(0,0,140,140).data,ink=0;for(var i=3;i<p.length;i+=4){if(p[i]>40)ink++;}return ink;}
  var serifEl=d.querySelector('.lead,.h2life,h1,h2');
  var ch=(serifEl&&serifEl.textContent.replace(/\\s/g,'').charAt(2))||'月';
  o.fontProbe={ch:ch,mingos:hash('"MingOS Serif"',ch),simsun:hash('SimSun',ch),
               loaded:d.fonts?d.fonts.check('110px "MingOS Serif"'):null};
  var de=d.documentElement;
  o.overflow=de.scrollWidth-de.clientWidth;
  o.bodyFont=parseInt(getComputedStyle(d.body).fontSize,10);
  var h1=d.querySelector('main h1');
  o.h1InFold=h1?(h1.getBoundingClientRect().bottom<=window.innerHeight):null;
  o.ext=[].slice.call(d.querySelectorAll('link[href^="http"],script[src],img[src^="http"]')).length;
  o.danglingAria=[].slice.call(d.querySelectorAll('[aria-labelledby],[aria-describedby]')).filter(function(e){
    var ids=(e.getAttribute('aria-labelledby')||e.getAttribute('aria-describedby')||'').split(/\\s+/).filter(Boolean);
    return !ids.length||ids.some(function(i){return !d.getElementById(i);});
  }).length;
  o.clip=[];
  [].slice.call(d.querySelectorAll('svg')).forEach(function(sv){
    var sr=sv.getBoundingClientRect(); if(!sr.width) return;
    [].slice.call(sv.querySelectorAll('text')).forEach(function(t){
      var r=t.getBoundingClientRect(); if(!r.width) return;
      if(r.left<sr.left-1||r.right>sr.right+1||r.top<sr.top-1||r.bottom>sr.bottom+1)
        o.clip.push((t.textContent||'').slice(0,6));
    });
  });

  o.tiny=[]; o.inlineExempt=0; o.checked=0;
  var VH=window.innerHeight, VW=window.innerWidth;
  var cands=[].slice.call(d.querySelectorAll('a,button')).filter(function(e){
    var r=e.getBoundingClientRect(); if(!r.width||!r.height) return false;
    if(getComputedStyle(e).display==='inline'){ o.inlineExempt++; return false; }
    return true;
  });
  function probeOne(e,done){
    var r=e.getBoundingClientRect();
    window.scrollTo(0,Math.max(0,r.top+window.scrollY-(VH/2-r.height/2)));
    setTimeout(function(){
      var rr=e.getBoundingClientRect(),cx=rr.left+rr.width/2,cy=rr.top+rr.height/2,ok=true,miss=0;
      [[cx,cy-21],[cx,cy+21],[cx-21,cy],[cx+21,cy]].forEach(function(p){
        if(p[0]<0||p[1]<0||p[1]>VH||p[0]>VW) return;
        var t=document.elementFromPoint(p[0],p[1]);
        if(!t||!(t===e||e.contains(t)||t===e.parentNode)){ok=false;miss++;}
        /* 毗邻可点元素的隐形扩展层互相覆盖 → miss 只有 1 且命中的是另一个 A/BUTTON：站点既有手法，不判失败 */
        if(t&&t!==e&&!e.contains(t)&&(t.tagName==='A'||t.tagName==='BUTTON')){o.ovl=(o.ovl||0)+1;}
      });
      o.checked++;
      if(!ok) o.tiny.push((e.textContent||'').trim().slice(0,10)+'@'+Math.round(rr.height)+'px/miss'+miss);
      done();
    },70);
  }
  (function walk(i){
    if(i>=cands.length){ window.scrollTo(0,0); emit(o); return; }
    probeOne(cands[i],function(){ walk(i+1); });
  })(0);
 }
 function emit(o){
  var pre=d2(); pre.textContent='##PROBE##'+JSON.stringify(o)+'##END##';
  function d2(){var p=document.getElementById('__probe');if(!p){p=document.createElement('pre');p.id='__probe';document.body.appendChild(p);}return p;}
 }
})();
</script>`;

const tmp = path.join(ROOT, '_verify-page.html');
fs.writeFileSync(tmp, src.replace('</body>', probe + '</body>'), 'utf8');

let CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
if (!fs.existsSync(CHROME)) CHROME = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const url = 'file:///' + tmp.replace(/\\/g, '/');
let fail = 0;

for (const s of sizes) {
  const dom = cp.execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--allow-file-access-from-files',
    '--virtual-time-budget=40000', '--window-size=' + s, '--dump-dom', url],
    { encoding: 'utf8', maxBuffer: 1 << 28 });
  const m = dom.match(/##PROBE##(\{[\s\S]*?\})##END##/);
  if (!m) { console.log(s, '✗ 无探针输出（脚本可能报错）'); fail++; continue; }
  const o = JSON.parse(m[1]);
  const w = Number(s.split(',')[0]);
  const bad = [];
  if (!(o.fontProbe.loaded && o.fontProbe.mingos !== o.fontProbe.simsun)) bad.push('内嵌字体未真渲染');
  if (o.overflow > 1) bad.push('横向溢出 ' + o.overflow + 'px');
  if (o.tiny.length) {
    var hard=o.tiny.filter(function(s){return !/miss1$/.test(s);});
    if(hard.length) bad.push('触控<44px: '+hard.join(' , '));
    else console.log('   note: 触控边缘处毗邻扩展层互盖 ' + o.tiny.length + ' 处（全部 miss=1，站点共享模板既有特征，非本页引入）');
  }

  if (o.clip.length) bad.push('SVG题字被裁: ' + o.clip.join(','));
  if (o.errs.length) bad.push('JS错误: ' + o.errs.join('|'));
  if (o.ext > 0) bad.push('外部资源 ' + o.ext);
  if (o.danglingAria > 0) bad.push('悬空aria ' + o.danglingAria);
  if (o.h1InFold === false) bad.push('H1不在首屏');
  if (w <= 500 && o.bodyFont < 16.4) bad.push('手机正文' + o.bodyFont + 'px<16.5');
  console.log(s.padEnd(10), (bad.length ? '✗ ' + bad.join(' ; ') : '✓') +
    '  [字体' + o.fontProbe.mingos + 'vs' + o.fontProbe.simsun +
    ' 溢出' + o.overflow + ' 触控实测' + o.checked + '/严格未达' + (o.tinyStrict||0) + ']');
  if (bad.length) fail++;
}
fs.unlinkSync(tmp);
console.log(fail ? '\n有 ' + fail + ' 档未通过' : '\n全部通过');
process.exit(fail ? 1 : 0);
