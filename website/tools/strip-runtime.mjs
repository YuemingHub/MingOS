/**
 * mingos.cn V0 · 构建后精简（postbuild）
 *
 * V0 全站没有任何客户端交互组件，Next.js 仍会注入 React 运行时做无效果的水合
 * （约 460KB / 190KB 无用 JS，阻塞主线程）。本脚本把构建产物里未被使用的
 * 运行时脚本剥掉，线上只剩：HTML + CSS + 一段内联引导脚本。
 *
 * - 删除 <script src="/_next/..."> 与 RSC payload 内联脚本（__next_f）
 * - 删除对运行时 chunk 的 preload/modulepreload
 * - 删除 out/*.txt（RSC payload）与 out/_next 下的 .js（CSS 保留）
 * - 保留页面内联引导脚本（滚动显现），无 JS 访问依然完整可读
 *
 * 注意：将来 V1 若引入真正的客户端交互组件，删除 package.json 里的
 * postbuild 步骤即可恢复完整运行时。
 */
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "out");

function walk(dir, fn) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, fn);
    else fn(p);
  }
}

let touched = 0;
walk(OUT, (p) => {
  if (p.endsWith(".html")) {
    let html = readFileSync(p, "utf8");
    const before = html.length;
    html = html
      // 运行时脚本标签
      .replace(/<script\b[^>]*\bsrc="\/_next\/[^"]*"[^>]*><\/script>/g, "")
      // RSC payload 内联脚本（内容含 self.__next_f 的一律删除，引导脚本不含此标记所以安全）
      .replace(/<script>([\s\S]*?)<\/script>/g, (m, body) => (body.includes("self.__next_f") ? "" : m))
      // 运行时 chunk 预加载
      .replace(/<link\b[^>]*rel="(?:preload|modulepreload)"[^>]*href="\/_next\/[^"]*\.js"[^>]*>/g, "");
    if (html.length !== before) {
      writeFileSync(p, html);
      touched++;
      console.log("stripped", p.replace(OUT, ""), `${(before / 1024) | 0}KB → ${(html.length / 1024) | 0}KB`);
    }
  }
});

// RSC payload 文本文件
walk(OUT, (p) => {
  if (p.endsWith(".txt") && (p.includes("__next") || p.endsWith("index.txt"))) {
    rmSync(p);
    console.log("removed", p.replace(OUT, ""));
  }
});

// 未被引用的运行时 JS chunk（CSS 保留）
const nextDir = join(OUT, "_next");
try {
  walk(nextDir, (p) => {
    if (p.endsWith(".js")) rmSync(p);
  });
  console.log("removed runtime js under out/_next");
} catch {
  /* 无 _next 目录 */
}

console.log(`postbuild done: ${touched} html file(s) stripped`);
