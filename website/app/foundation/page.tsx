import type { Metadata } from "next";

/* 这一页收的是从首页挪走的"解释"。
   首页的职责是让人进来，不是读懂架构；ymai.love 上两处链接
   （「完整的底线写在 mingos.cn」/ footer「底线 · 我们不做什么」）一直指向这里，
   而它此前并不存在（404）。 */

/* 本站是零运行时 JS 的静态导出（见 README：postbuild 会删掉全部 React chunk），
   因此站内跳转只能走普通 <a>，不能用 next/link。这条规则在此文件整体关闭。 */
/* eslint-disable @next/next/no-html-link-for-pages */

export const metadata: Metadata = {
  title: "底线与架构 — MingOS",
  description:
    "Ming 承担哪些复杂性，以及明确不做什么：脉络、事实、边界、上下文、修正、主体性。",
  alternates: { canonical: "/foundation" },
};

const YEAR = new Date().getFullYear();

const LOOP_STEPS: Array<[number, number, string, "l" | "r"]> = [
  [340, 70, "发生", "r"],
  [200, 170, "看见", "l"],
  [340, 270, "理解", "r"],
  [200, 370, "选择", "l"],
  [340, 470, "行动", "r"],
  [200, 570, "现实反馈", "l"],
  [340, 670, "留下新的脉络", "r"],
];

const CORE_ROWS: Array<[string, string, string]> = [
  ["记住脉络", "重要的东西不会因为关掉一个窗口就消失。", "CONTINUITY"],
  [
    "分清事实",
    "哪些真正发生过，哪些只是感受，哪些是猜测，哪些还不知道。",
    "FACT",
  ],
  [
    "守住边界",
    "什么属于谁、谁能看到、能不能改——不由某一次回答临时决定。",
    "BOUNDARY",
  ],
  ["连接上下文", "三个空间之间是连续的：是一个人，不是三份数据。", "CONTEXT"],
  [
    "可以修正",
    "过去的理解可以被推翻，新的现实优先于旧的结论。",
    "CORRECTION",
  ],
  ["不替人决定", "AI 可以很聪明，但不能替人成为权威。", "AGENCY"],
];

const NOT_DOING: string[] = [
  "不替任何人判断哪个人生选择是对的。",
  "不给孩子、家人或自己打分、贴标签、排连续天数。",
  "不把一次对话的结论固化成永久事实。",
  "不在人没有允许的时候，把话带到别的地方去。",
  "不伪造用户数、不伪造能力、不伪造三个空间之间已经存在的统一。",
];

export default function Foundation() {
  return (
    <>
      <a className="skip" href="#content">
        跳到主要内容
      </a>
      <header className="head" id="head">
        <div className="wrap">
          <a className="brand" href="/">
            <svg className="open-mark" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="8" />
            </svg>
            MingOS
          </a>
        </div>
      </header>

      <main id="content" tabIndex={-1}>
        <section className="beat hero" aria-labelledby="fnd-h">
          <div className="wrap hero__in">
            <h1 className="hero-h rv" id="fnd-h">
              Ming 承担的那一部分，
              <br aria-hidden="true" />
              写在这里。
            </h1>
            <p className="hero__sub rv" data-d="2">
              首页不讲架构，是因为你不需要学习它。这一页留给要审它的人。
            </p>
          </div>
        </section>

        <section className="beat why" aria-labelledby="why-t">
          <div className="wrap">
            <p className="beat-no rv">
              <i></i>
              <span className="label">02 · Why</span>
            </p>
            <h2 className="h2life rv" id="why-t">
              为什么做 MingOS。
            </h2>
            {/* 中文段落必须写成一行。JSX 里换行会被渲染成一个半角空格，
                中文里就会在「、」「，」后出现多余空隙。 */}
            <p className="note rv" data-d="1">我一直在想一件事。</p>
            <p className="note rv" data-d="1">
              AI 会越来越聪明。这件事大概已经不会改变。但人呢？它越来越聪明以后，我们要把人的什么交给它，又有什么不能交给它？
            </p>
            <p className="note rv" data-d="1">
              能力增加，不等于人自然会更知道自己是谁、更会爱一个人、更能面对冲突、更知道什么值得做、更愿意承担自己的选择。这些不会因为工具变强而自动发生。它们只能在一个人的真实生活里，一次次被看见、被修正。
            </p>
            <p className="lead rv" data-d="2">
              未来也许不缺聪明。
              <br className="br-lg" aria-hidden="true" />
              真正不能丢掉的，是
              <span className="nw">
                <em>人的主体、关系和现实。</em>
              </span>
            </p>
            <p className="note rv" data-d="3">
              正因为 AI 会越来越强，所以更需要知道，哪些事情不应该被拿走。
            </p>
            {/* 下面三段是上一轮从首页挪走时丢了落点的原句，2026-09-20 按 Founder 的意思放回这里。
                连接处只复用了首页已经发布的句子，没有新写说法。 */}
            <p className="note rv" data-d="4">
              我们试着做的一件事：Ming 承担那些人不该自己承担的复杂性；现实和选择，留给人。
            </p>
            <p className="note rv" data-d="4">于是有了：</p>
            <p className="lead rv" data-d="4">
              我与自己，我选择。
              <br className="br-lg" aria-hidden="true" />
              我与家庭，我关系。
              <br className="br-lg" aria-hidden="true" />
              <span className="nw">
                <em>我与世界，我行动。</em>
              </span>
            </p>
            <p className="note rv" data-d="4">
              它们不是人生的三个模块。它们本来就是生活本身。
            </p>
          </div>
        </section>

        <section className="beat core" aria-labelledby="core-t">
          <div className="wrap">
            <p className="beat-no rv">
              <i></i>
              <span className="label">03 · What Ming carries</span>
            </p>
            <h2 className="h2life rv" id="core-t">
              复杂性留给 Ming。
              <br className="br-lg" aria-hidden="true" />
              现实和选择留给人。
            </h2>
            <ul className="rows rv" data-d="1">
              {CORE_ROWS.map(([term, desc, en]) => (
                <li key={term}>
                  <span className="nm">{term}</span>
                  <span className="ds">{desc}</span>
                  <span className="en" aria-hidden="true">
                    {en}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="beat loop" aria-labelledby="loop-t">
          <div className="wrap">
            <p className="beat-no rv">
              <i></i>
              <span className="label">04 · The loop</span>
            </p>
            <h2 className="h2life rv" id="loop-t">
              生活不是一次问答。
            </h2>

            <div className="loop__fig rv">
              {/* 桌面：纵向蜿蜒的路径，滚动时缓缓画出，最后一条虚线弧回到起点 */}
              <svg
                className="loop__svg"
                viewBox="0 0 560 800"
                aria-hidden="true"
                focusable="false"
              >
                <defs>
                  <marker
                    id="loop-arrow"
                    markerUnits="userSpaceOnUse"
                    markerWidth="12"
                    markerHeight="12"
                    refX="8"
                    refY="6"
                    orient="auto"
                  >
                    <path
                      d="M 2 2 L 10 6 L 2 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </marker>
                </defs>
                <path
                  className="loop__path"
                  pathLength={1}
                  d="M 340 70 C 340 120 200 120 200 170 C 200 220 340 220 340 270 C 340 320 200 320 200 370 C 200 420 340 420 340 470 C 340 520 200 520 200 570 C 200 620 340 620 340 670"
                />
                <path
                  className="loop__ret"
                  d="M 340 670 C 545 645 555 95 340 70"
                  markerEnd="url(#loop-arrow)"
                />
                <text className="loop__again" x="466" y="386" textAnchor="start">
                  再回来
                </text>
                {LOOP_STEPS.map(([x, y, t, side]) => (
                  <g className="loop__node" key={`${x}-${y}`}>
                    <circle className="loop__ring" cx={x} cy={y} r="10.5" />
                    <circle className="loop__core" cx={x} cy={y} r="3" />
                    {side === "r" ? (
                      <text className="loop__t" x={x + 26} y={y + 5.5}>
                        {t}
                      </text>
                    ) : (
                      <text className="loop__t" x={x - 26} y={y + 5.5} textAnchor="end">
                        {t}
                      </text>
                    )}
                  </g>
                ))}
              </svg>

              {/* 移动端 / 读屏：同一组步骤，直接可读 */}
              <ol className="loop__list">
                {["发生", "看见", "理解", "选择", "行动", "现实反馈", "留下新的脉络"].map(
                  (t) => (
                    <li key={t}>{t}</li>
                  ),
                )}
                <li className="loop__ret-li">
                  <svg
                    className="loop__ret-ico"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M 13.5 8 A 5.5 5.5 0 1 1 8 2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 8 0.6 L 11 2.5 L 8 4.6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  回到「发生」
                </li>
              </ol>
            </div>

            <p className="loop__close rv">
              一个人不是靠一次答案改变的。
              <br className="br-lg" aria-hidden="true" />
              理解要回到现实里走一遍——现实推翻的，以现实为准。
            </p>
          </div>
        </section>

        <section className="beat" aria-labelledby="not-t">
          <div className="wrap">
            <p className="beat-no rv">
              <i></i>
              <span className="label">05 · What we do not do</span>
            </p>
            <h2 className="h2life rv" id="not-t">
              明确不做的事。
            </h2>
            <p className="note rv" data-d="1">
              这一节比上一节重要。能力可以慢慢长，边界一旦让出去就很难拿回来。
            </p>
            <ul className="notlist rv" data-d="2">
              {NOT_DOING.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="stamp rv" data-d="3">
              当前状态：三个 Space 都还在很早的阶段，各自服务于真实的个人或家庭，未对外开放。
            </p>
          </div>
        </section>
      </main>

      <footer className="end" aria-label="结语">
        <div className="wrap end__in">
          <p className="end__t2">现实和选择，留给人。</p>

          <nav className="sibs" aria-label="同一个体系里的另外三个空间">
            <a href="https://ymai.me" rel="noopener">
              <b>我与自己</b>
              ymai.me
            </a>
            <a href="https://ymai.love" rel="noopener">
              <b>我与家庭</b>
              ymai.love
            </a>
            <a href="https://ymai.fun" rel="noopener">
              <b>我与世界</b>
              ymai.fun
            </a>
          </nav>

          <div className="end__bar">
            <p className="end__brand">
              <a className="hit" href="/">MingOS</a>
            </p>
            <p className="end__meta">
              <span>© {YEAR} MingOS</span>
              {/* ICP 尾号按域名区分，本站 mingos.cn = -3，别改错。 */}
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
    </>
  );
}
