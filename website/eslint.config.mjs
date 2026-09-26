import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 兄弟 git worktree 里的构建产物。上面四条是相对本目录的，
    // 盖不到 .worktrees/<name>/.next/** —— 别的会话在这里开了 worktree 之后，
    // npm run lint 会去扫人家 .next 生成的 validator.ts，报出几十个 any。
    // 只忽略，不删：那些目录属于别的分支。
    ".worktrees/**",
  ]),
]);

export default eslintConfig;
