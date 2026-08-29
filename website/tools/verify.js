/* 回归验证（被 tools/verify.sh 调用）：字体是否真在渲染 + 首屏 + 裁切 + 触控 + 溢出 + a11y
   用法：node verify.js  然后按提示跑 chrome（本脚本生成 _verify.html） */
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/../index.html', 'utf8');

const probe = `
<script>
window.addEventListener('load', function(){
  setTimeout(function(){
    var d = document, o = {};
    try {
      o.fonts = []; d.fonts.forEach(function(f){ o.fonts.push(f.family+'/'+f.weight+'/'+f.status); });
      function hash(ff, ch){
        var c = d.createElement('canvas'); c.width=120; c.height=120;
        var x = c.getContext('2d'); x.fillStyle='#fff'; x.font='96px '+ff; x.textBaseline='top';
        x.fillText(ch, 4, 4);
        var p = x.getImageData(0,0,120,120).data, s=0, ink=0;
        for (var i=3;i<p.length;i+=4){ s=(s*31+p[i])%2147483647; if(p[i]>40) ink++; }
        return s+'/'+ink;
      }
      o.fx = { mingosJia: hash('"MingOS Serif"','家'), simsunJia: hash('SimSun','家'),
               mingosLu: hash('"MingOS Serif"','路'), simsunLu: hash('SimSun','路') };

      var VH = window.innerHeight, VW = window.innerWidth;
      o.vw = VW; o.vh = VH;
      o.fold = ['.hero-kicker','.hero-h','.hero-sub','.hero-entries']
        .map(function(s){ var r=d.querySelector(s).getBoundingClientRect();
          return s.replace('.','')+(r.bottom<=VH?'OK':'CUT'); });
      var c = d.querySelector('.hero-copy').getBoundingClientRect();
      o.center = 'L'+Math.round(c.left)+' R'+Math.round(VW-c.right)+' align='+
                 getComputedStyle(d.querySelector('.hero-copy')).textAlign;

      o.clip = [];
      [].slice.call(d.querySelectorAll('svg')).forEach(function(sv, si){
        var vb = sv.viewBox.baseVal, sr = sv.getBoundingClientRect();
        if (!vb || !sr.width) return;
        [].slice.call(sv.querySelectorAll('text')).forEach(function(t){
          var r = t.getBoundingClientRect();
          if (!r.width) return;   /* 被媒体查询隐藏的标签不算裁切 */
          if (r.left<sr.left-1||r.right>sr.right+1||r.top<sr.top-1||r.bottom>sr.bottom+1)
            o.clip.push((t.textContent||'').slice(0,6)+'@'+si);
        });
      });

      /* 画面题字不能压在文案上 */
      o.hitText = [];
      var art = [].slice.call(d.querySelectorAll('.hero-art svg')).filter(function(s){
        return s.getBoundingClientRect().width>0; })[0];
      if (art) [].slice.call(art.querySelectorAll('text')).forEach(function(t){
        var r=t.getBoundingClientRect();
        if (Math.min(r.right,c.right)-Math.max(r.left,c.left) > 0 &&
            Math.min(r.bottom,c.bottom)-Math.max(r.top,c.top) > 0) o.hitText.push(t.textContent);
      });

      o.tiny = [];
      [].slice.call(d.querySelectorAll('a,button')).forEach(function(e){
        var r=e.getBoundingClientRect(); if(!r.width) return;
        var cx=r.left+r.width/2, cy=r.top+r.height/2, ok=true;
        [[cx,cy-21],[cx,cy+21],[cx-21,cy],[cx+21,cy]].forEach(function(p){
          if(p[0]<0||p[1]<0||p[1]>VH||p[0]>VW) return;
          var el=d.elementFromPoint(p[0],p[1]);
          if(!el||!(el===e||e.contains(el)||el===e.parentNode)) ok=false;
        });
        if(!ok) o.tiny.push((e.className||e.tagName)+' '+Math.round(r.width)+'x'+Math.round(r.height));
      });

      o.docOverflow = d.documentElement.scrollWidth - d.documentElement.clientWidth;
      o.dangling = [].slice.call(d.querySelectorAll('[aria-labelledby]'))
        .filter(function(e){ return !d.getElementById(e.getAttribute('aria-labelledby')); }).length;
      o.langs = d.querySelectorAll('[lang=en]').length;
      o.btnNoType = [].slice.call(d.querySelectorAll('button')).filter(function(b){
        return b.type !== 'button'; }).length;
      o.extRes = d.querySelectorAll('script[src],link[rel=stylesheet],img[src]').length;
    } catch(e){ o.err = String(e && e.stack || e); }
    var p = d.createElement('pre'); p.id='AUD'; p.textContent = JSON.stringify(o);
    d.body.appendChild(p);
  }, 2600);
});
<\/script>`;

fs.writeFileSync(__dirname + '/../_verify.html', html.replace('</body>', probe + '\n</body>'));
