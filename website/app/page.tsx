const YEAR = new Date().getFullYear();

/* 三个空间唯一的对外地址，改域名只改这里 */
const SPACES = [
  {
    key: "self",
    en: "SELF SPACE",
    name: "我与自己",
    verb: "我选择。",
    desc: "我是谁。我感受到什么。什么是我真正想要的。",
    url: "https://ymai.me",
    domain: "ymai.me",
  },
  {
    key: "family",
    en: "FAMILY SPACE",
    name: "我与家庭",
    verb: "我关系。",
    desc: "我不是一个孤立的人。我爱谁，被谁影响，又怎样影响别人。",
    url: "https://ymai.love",
    domain: "ymai.love",
  },
  {
    key: "world",
    en: "WORLD SPACE",
    name: "我与世界",
    verb: "我行动。",
    desc: "我最终还要走出去。工作、创造、解决问题、承担结果。",
    url: "https://ymai.fun",
    domain: "ymai.fun",
  },
] as const;

/* 入口标记。整行都是链接，这里只做视觉提示。 */
function Go({ domain }: { domain: string }) {
  return (
    <span className="space__go">
      <span className="space__go-domain">{domain}</span>
      <span className="space__go-arrow" aria-hidden="true">
        ↗
      </span>
    </span>
  );
}

/* 每个方向一枚自己的线条：旋、灯、路。气质可以不同，骨骼必须相同。 */
function Mark({ which }: { which: string }) {
  if (which === "self")
    return (
      <svg className="mark mark--self" viewBox="0 0 200 200" aria-hidden="true">
        <path
          className="mark__stroke"
          d="M 170 100 A 70 70 0 0 0 30 100 A 50 50 0 0 0 130 100 A 30 30 0 0 0 70 100 A 15 15 0 0 0 100 100"
        />
        <circle className="mark__dot" cx="100" cy="100" r="2.6" />
      </svg>
    );
  if (which === "family")
    return (
      <svg className="mark mark--family" viewBox="0 0 220 120" aria-hidden="true">
        <path className="mark__warm" d="M 14 80 Q 110 12 206 80" />
        <circle className="mark__warmd mark__warmd--1" cx="72" cy="94" r="3.4" />
        <circle className="mark__warmd mark__warmd--2" cx="110" cy="102" r="3.4" />
        <circle className="mark__warmd mark__warmd--3" cx="148" cy="94" r="3.4" />
      </svg>
    );
  return (
    <svg className="mark mark--world" viewBox="0 0 460 120" aria-hidden="true">
      <line className="mark__line" x1="0" y1="88" x2="460" y2="88" />
      <circle className="mark__dot2" cx="34" cy="88" r="3" />
      <path
        className="mark__trail"
        d="M 34 88 C 110 88 150 62 220 58 C 300 54 340 52 448 50"
      />
      <circle className="mark__ring" cx="424" cy="52" r="13" />
    </svg>
  );
}

/* 天亮段的色值。与 globals.css :root 的 --dawn-* 同源，
   但 SVG 渐变的 stop-color 吃不了 CSS var，只能在这里再写一份。
   ⚠️ 改天亮配色必须两处一起改（2026-09-19 走查登记的隐患）。 */
const DAWN = {
  glowMid: "#fff3da",
  glowEdge: "#ffeecb",
  line: "#5c4b39",
  /* 日轮往米黄靠，不用近白：最初中心是 #fffef9（几乎纯白），
     实拍反馈"太耀眼"→ 先压到 #fdf2d4，再看片仍偏白，中心再落到 #f5e3b8。
     三档同步走，保持由内向外的收亮顺序。 */
  sunCore: "#f5e3b8",
  sunMid: "#eedaa8",
  sunEdge: "#e3cb92",
} as const;

/* 顶部：只有名字与一枚未闭合的圆。
   总纲：首屏不要产品卡片、不要按钮矩阵、不要三个域名。先把问题立住。 */
function Top() {
  return (
    <header className="head" id="head">
      <div className="wrap">
        <p className="brand">
          <svg className="open-mark" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="10" cy="10" r="8" />
          </svg>
          MingOS
        </p>
      </div>
    </header>
  );
}

/* 01 · HERO
   这一屏只完成一件事：让第一次来的人意识到，这是一个值得想很久的问题。 */
function Hero() {
  return (
    <section className="beat hero" aria-labelledby="hero-h">
      <div className="wrap hero__in">
        <p className="hero-kicker rv">
          <b>MingOS</b>
          <span className="label" lang="en">
            the whole house
          </span>
        </p>
        <p className="hero__q rv" data-d="1">
          人工智能（AI）会越来越聪明。
        </p>
        <h1 className="hero-h rv" id="hero-h" data-d="1">
          但我们真正关心的是：
          {/* 冒号后必断。原来是「桌面断、手机不断」，手机就断成了末字孤行。
              这里改成任何宽度都在冒号后断。 */}
          <br aria-hidden="true" />
          人要怎样越来越<span className="nw">成为人。</span>
        </h1>
        <p className="hero__sub rv" data-d="2">
          从自己，到关系，再到真实世界。
        </p>
      </div>
      <div className="scrollcue" aria-hidden="true">
        <span className="scrollcue__line" />
      </div>
    </section>
  );
}

/* 02 · 三种基本关系 + 三个方向入口。
   上一版同一组三句话在首页说了四遍（关系图、定义列表、三张卡、结尾三联），
   密度过高的根因就在这里。这一版只说两遍：关系一次，入口一次。 */
function Relationships() {
  return (
    <section className="beat rel" aria-labelledby="rel-t">
      <div className="wrap">
        <p className="beat-no rv">
          <i></i>
          <span className="label">02 · Three relationships</span>
        </p>
        <h2 className="h2life rv" id="rel-t">
          一个人的一生，无论多复杂，
          <br className="br-lg" aria-hidden="true" />
          总会回到几种最基本的关系里。
        </h2>

        <figure className="venn rv">
          <div className="venn__figure">
            <p className="venn__label venn__label--self">
              <span className="venn__dir">我与自己</span>
              <span className="venn__verb">我选择。</span>
              <span className="venn__en">SELF</span>
            </p>
            <svg
              className="venn__svg"
              viewBox="0 0 640 450"
              role="img"
              aria-label="示意图：我与自己、我与家庭、我与世界三个圆相互交叠、持续流动，交叠之处，是一个人的生活。"
            >
              <defs>
                <radialGradient id="venn-glow">
                  <stop offset="0%" stopColor="currentColor" stopOpacity={0.14} />
                  <stop offset="52%" stopColor="currentColor" stopOpacity={0.05} />
                  <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                </radialGradient>
              </defs>

              {/* 交叠处：生活所在的那一点，光是活的 */}
              <circle className="venn__glow" cx="320" cy="248" r="86" />

              {/* 每个圆连同它那点微光一起漂移；圆自己还另外沿圆周绕行 */}
              <g className="vn vn--1">
                <circle className="vc vc--1" cx="320" cy="155" r="155" />
                <circle className="vc-flow vc-flow--1" cx="320" cy="155" r="155" />
              </g>
              <g className="vn vn--2">
                <circle className="vc vc--2" cx="243" cy="295" r="155" />
                <circle className="vc-flow vc-flow--2" cx="243" cy="295" r="155" />
              </g>
              <g className="vn vn--3">
                <circle className="vc vc--3" cx="397" cy="295" r="155" />
                <circle className="vc-flow vc-flow--3" cx="397" cy="295" r="155" />
              </g>

              <circle className="venn__dot" cx="320" cy="248" r="4.6" />
              <text className="venn__human" x="331" y="253">
                人
              </text>
            </svg>
            <p className="venn__label venn__label--family">
              <span className="venn__dir">我与家庭</span>
              <span className="venn__verb">我关系。</span>
              <span className="venn__en">FAMILY</span>
            </p>
            <p className="venn__label venn__label--world">
              <span className="venn__dir">我与世界</span>
              <span className="venn__verb">我行动。</span>
              <span className="venn__en">WORLD</span>
            </p>
          </div>
          <figcaption className="venn__cap">
            它们相互渗透——本来就是同一个人的生活。
          </figcaption>
        </figure>

        <h3 className="h2life spaces__h2 rv">给这三种关系，各留一个空间。</h3>

        {SPACES.map((sp) => (
          <a key={sp.key} className={`space space--${sp.key} rv`} href={sp.url}>
            <div className="space__meta">
              <p className="label label--sp">{sp.en}</p>
              <p className="space__cn">{sp.name}</p>
            </div>
            <div className="space__body">
              <p className="space__core">{sp.verb}</p>
              <p className="space__desc">{sp.desc}</p>
              <Go domain={sp.domain} />
            </div>
            <div className="space__mark">
              <Mark which={sp.key} />
            </div>
          </a>
        ))}

        <p className="spaces__close rv">
          它们不是三个产品，也不是三个功能模块。
          <br className="br-lg" aria-hidden="true" />
          是一个人存在于世界上的三个基本方向。
        </p>
      </div>
    </section>
  );
}

/* 03 · Ming 承担的。首页只留四条：上一版在这里铺了六条架构、一张循环图和一篇
   长文，读起来像系统说明书。完整的那份收在 /foundation。 */
const CARRIED: Array<[string, string, string]> = [
  ["脉络", "重要的东西，不会轻易消失。", "CONTINUITY"],
  ["事实", "事实和理解，尽量分开。", "FACT"],
  ["边界", "属于人的边界，被守住。", "BOUNDARY"],
  ["修正", "过去的理解，允许被现实推翻。", "CORRECTION"],
];

function Carried() {
  return (
    <section className="beat core" aria-labelledby="core-t">
      <div className="wrap">
        <p className="beat-no rv">
          <i></i>
          <span className="label">03 · What Ming carries</span>
        </p>
        <h2 className="lead rv" id="core-t">
          三个 Space 下面，
          <br className="br-lg" aria-hidden="true" />
          Ming 承担一些人不该
          <span className="nw">
            <em>自己承担的复杂性。</em>
          </span>
        </h2>
        <ul className="rows rv" data-d="1">
          {CARRIED.map(([term, desc, en]) => (
            <li key={term}>
              <span className="nm">{term}</span>
              <span className="ds">{desc}</span>
              <span className="en" aria-hidden="true">
                {en}
              </span>
            </li>
          ))}
        </ul>
        <div className="creed rv" data-d="2">
          <p className="creed__t">
            你不用学习这个系统。
            <br />
            系统负责理解复杂性，你负责生活。
          </p>
          <p className="creed__s">
            Ming 不替人决定。它只是尽可能不让重要的东西丢掉。
          </p>
        </div>
        <a className="more rv" data-d="3" href="/foundation">
          完整的技术架构与底线 <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

/* 04 · END：夜晚收束，天亮。不做商业 CTA。 */
function End() {
  return (
    <footer className="end" aria-label="结语">
      <div className="wrap end__in">
        <svg
          className="end__o"
          viewBox="0 0 120 120"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            cx="60"
            cy="60"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="242 34"
            transform="rotate(-30 60 60)"
          />
        </svg>
        <p className="end__t">我们还在很早的地方。</p>
        <p className="end__s">但方向已经很清楚。</p>
        <p className="end__t2">技术继续向前。人，也继续成为人。</p>

        {/* 总纲：结尾用地平线／路／微光，不用「小苗长成大树」。
            没有建筑，没有未来城市，没有机器人，只有很轻的一点光。
            路的透视线要够长才像路——短了会读成倒 V / 箭头（已实测修过一版）。 */}
        <svg
          className="horizon"
          viewBox="0 0 1200 300"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {/* 太阳本身：中心最亮、往外收进暖色 */}
            <radialGradient id="sun-core">
              <stop offset="0%" stopColor={DAWN.sunCore} stopOpacity={0.86} />
              <stop offset="55%" stopColor={DAWN.sunMid} stopOpacity={0.62} />
              <stop offset="100%" stopColor={DAWN.sunEdge} stopOpacity={0.3} />
            </radialGradient>
            {/* 太阳周围那圈漫开的光，压扁成贴地的形状 */}
            <radialGradient id="sun-halo">
              <stop offset="0%" stopColor={DAWN.glowMid} stopOpacity={0.34} />
              <stop offset="55%" stopColor={DAWN.glowEdge} stopOpacity={0.11} />
              <stop offset="100%" stopColor={DAWN.glowEdge} stopOpacity={0} />
            </radialGradient>
            {/* 地面：用椭圆而不是矩形——矩形渐变会露出左右边界，
                在天亮段里读成一个方块（2026-09-19 实测踩过）。 */}
            <radialGradient id="ground-soft">
              <stop offset="0%" stopColor={DAWN.line} stopOpacity={0.16} />
              <stop offset="60%" stopColor={DAWN.line} stopOpacity={0.07} />
              <stop offset="100%" stopColor={DAWN.line} stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* 一圈贴地的漫光 */}
          <ellipse className="horizon__halo" cx="600" cy="88" rx="206" ry="42" />

          {/* 刚升起来的太阳：下半截被地面的雾挡住，所以是"初起"不是"正午" */}
          <circle className="horizon__sun" cx="600" cy="84" r="33" fill="url(#sun-core)" />

          {/* 地面 */}
          <ellipse className="horizon__ground" cx="600" cy="200" rx="690" ry="84"
                   fill="url(#ground-soft)" />

          {/* 一个人，站在太阳底下。它与日轮之间刻意留 82 个单位的空
              （上一版只有 32，实拍反馈"离得太近"）；
              人也刻意画得小：这一屏要说的是天光很大，人在那里。 */}
          <g className="horizon__person" transform="translate(600 205)">
            <circle cx="0" cy="0" r="5.4" />
            <path d="M -6.6 7.4 C -7.8 14 -7.2 21.5 -5.6 27.5 L -4.6 47 L -1.3 47 L -0.4 31
                     L 0.4 31 L 1.3 47 L 4.6 47 L 5.6 27.5 C 7.2 21.5 7.8 14 6.6 7.4
                     C 4 4.6 -4 4.6 -6.6 7.4 Z" />
          </g>
        </svg>

        <div className="end__tide" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="end__ming">
          <p className="end__ming-name">Ming</p>
          <p className="end__ming-verb">承担复杂性。</p>
          <p className="end__ming-close">现实和选择，留给人。</p>
        </div>

        {/* 兄弟站点关系只放在结束区，不做产品矩阵导航（见 MING_VISUAL_LANGUAGE §2.1）。
            这一段是反相的亮色底，所以图上只用墨色阶，不套用四个站的生命色——
            浅底上那几种浅色描边过不了对比度。 */}
        {/* 兄弟站点关系只放在结束区，不做产品矩阵导航（见 MING_VISUAL_LANGUAGE §2.1）。
            本站不放那张「一个人 + 四个方向」图：结束区开头已经有一个
            Founder 点名要画的日出小人（.end__o），同一屏出现两次同一个剪影。
            图放在三个空间站：ymai.me / ymai.love / ymai.fun。 */}
        <nav className="sibs" aria-label="同一个体系里的另外三个空间">
          <a href="https://ymai.me" rel="noopener">
            <b>我和自己</b>
            ymai.me
          </a>
          <a href="https://ymai.love" rel="noopener">
            <b>我和我家</b>
            ymai.love
          </a>
          <a href="https://ymai.fun" rel="noopener">
            <b>我和世界</b>
            ymai.fun
          </a>
        </nav>

        <div className="end__bar">
          <p className="end__brand">MingOS</p>
          <p className="end__meta">
            <span>© {YEAR} MingOS</span>
            {/* ICP 备案号。⚠️ 同一主体下四个站尾号不同，本站 mingos.cn = -3：
                ymai.love=-1 / ymai.me=-2 / mingos.cn=-3 / ymai.fun=-4，别改错。
                按规范链到工信部备案系统。 */}
            <span className="end__sep" aria-hidden="true">
              ·
            </span>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
            >
              陕ICP备2026014869号-3
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip" href="#content">
        跳到主要内容
      </a>
      <Top />
      <main id="content" tabIndex={-1}>
        <Hero />
        <Relationships />
        <Carried />
      </main>
      <End />
    </>
  );
}
