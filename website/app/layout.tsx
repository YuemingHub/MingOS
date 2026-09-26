import type { Metadata, Viewport } from "next";
import "./globals.css";

/* 内联脚本：首帧前加 .js（避免闪烁）；DOM 就绪后启动滚动显现。
   无 JS 时页面完整呈现，核心内容不依赖 JS；reduced-motion 时直接呈现最终状态。 */
const BOOT = `document.documentElement.classList.add("js");
(function(){
  function init(){
    var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var targets=[].slice.call(document.querySelectorAll(".rv,.venn,.space,.loop"));
    var show=function(el){el.classList.add("is-in")};
    if(reduce||!("IntersectionObserver" in window)){targets.forEach(show);return}
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target)}})
    },{threshold:0.15,rootMargin:"0px 0px -7% 0px"});
    targets.forEach(function(el){io.observe(el)});
    /* 首屏保险：观察器没来得及触发时，视口内的内容不能一直透明 */
    setTimeout(function(){
      var vh=window.innerHeight;
      targets.forEach(function(el){
        if(!el.classList.contains("is-in")&&el.getBoundingClientRect().top<vh)show(el)
      })
    },1600);
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init)}else{init()}
})();`;

/* 标题与描述同时用于：浏览器标签、搜索结果、分享卡片。三处共用一处定义。 */
const TITLE = "MingOS — 当 AI 越来越强，人在哪里";
const DESC =
  "AI 智能会越来越强，那，人在哪里？MingOS 从我与自己、我与家庭、我与世界三个方向，试着回答这个问题。";

/* 分享卡片图。⚠️ 末尾的 ?v= 是给微信看的：微信会缓存首次抓取的结果，
   换一个 URL（哪怕只改版本号）才会重新抓。改了 og.png 的内容就把它 +1。 */
const OG_IMAGE = "/og.png?v=2";

export const metadata: Metadata = {
  metadataBase: new URL("https://mingos.cn"),
  title: TITLE,
  description: DESC,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/",
    siteName: "MingOS",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "MingOS — AI 越来越强之后，人怎样越来越成为人。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#12100c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          rel="preload"
          href="/MingOS-Serif.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
