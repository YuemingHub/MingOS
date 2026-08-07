# MingOS 三仓协调契约

> 状态：Proposed coordination contract  
> 日期：2026-08-06  
> 维护位置：`YuemingHub/MingOS`  
> 适用范围：`mingos-foundation`、`MingOS`、`Family-Space`

本文件是三仓协作的导航、边界和执行状态入口。它不替代各仓事实源，也不把 Draft、开放 PR、产品字段、对话结论或 AI 判断自动提升为 Accepted 事实。

## 1. 三层关系

| 层级 | 仓库 | 负责什么 | 不负责什么 |
|---|---|---|---|
| 原则与治理层 | `YuemingHub/mingos-foundation` | 生命宪章、MingOS 宪章、伦理边界、治理流程、标准与合规判定 | 家庭业务代码、家长档案、生产运行与产品界面 |
| 通用内核与协议层 | `YuemingHub/MingOS` | Space、Actor、Context、Intent、Authorization、Task、Evidence、Handoff、Continuity Bundle 等跨空间协议、Schema 与验证器 | 家庭画像、家长回复、家庭阶段等垂直字段 |
| 家庭垂直产品层 | `YuemingHub/Family-Space` | 家庭事件、理解与转译、家长回复、安全门、行动反馈、家庭档案与专业协作 | MingOS 通用对象和 Foundation 原则的自动定义权 |

正向约束：Foundation 已接受的原则与标准 → MingOS 可验证协议 → Family-Space 产品闭环。

反向学习：Family-Space 的验证、失败、反例与未知 → MingOS 协议候选 → Foundation 复核。反向材料只能成为证据或提案。

## 2. 当前远程事实

### Foundation

- 仓库：`YuemingHub/mingos-foundation`；默认分支：`main`；
- 当前主干：`7eb33ffc806db1da2fde488a617860ca34b76c0e`；
- PR #15 已合并：当前仓库身份为 `YuemingHub/mingos-foundation`，旧路径只作 provenance；
- PR #12 已合并：KERNEL-0004、KERNEL-0005、REF-0045–REF-0051 进入主干，但全部仍为 Draft；
- PR #16 已合并：Round 09 的 9 个 ID 已完成 reservation integration；
- 当前仍是 `NoCurrentKernelConformanceClaim`，0 executed tests、0 assessments、0 claims、0 badges。

### MingOS

- 仓库：`YuemingHub/MingOS`；默认分支：`main`；
- 当前主干：`356887e83d3685641226d98851c152d0e73a7482`；
- PR #17 已合并：三份 source-review 均为具名、可撤回的 `submitted / accept-value`；
- 当前唯一协调候选是 PR #18；它必须锁定已合并的 Foundation 主干，同时保留 Draft/Accepted 权威差异；
- 当前无真实用户、无生产环境、无数据迁移；来源决定不代表生产放行或平台扩建授权。

### Family-Space

- 仓库：`YuemingHub/Family-Space`；默认分支：`production`；
- 当前主干：`4e77e245bf4dfa49249e53a258e9ed575c428a41`；
- `CURRENT_PROJECT_STATUS.md` 仍是运行事实源：真实家长无、生产环境无、对外正式服务无；
- PR #118–#123 均仍为未合并 Draft；#123 是 Parent V1 产品候选；
- Family-Space 当前由月明独立推进；MingOS 总协调只读取已验证产品事实，不替代产品侧合并决定；
- 历史发布、服务器与 NO-GO 记录不能被解释为当前生产事实。

## 3. 权威顺序与冲突规则

1. Foundation `main` 中 Accepted/Stable 文件决定原则、伦理与治理约束；主干中的 Draft 仍只是 Draft。
2. MingOS `main` 决定已经合入的跨空间协议、Schema、验证器与连续性事实。
3. Family-Space `production` 与 `CURRENT_PROJECT_STATUS.md` 决定家庭产品实现边界与运行事实。
4. Draft、Proposed、Candidate、开放 PR、Issue、旧发布记录和对话只能作为提案、证据或历史来源。
5. 跨仓冲突必须保留原始来源，并通过具名、可撤回的 source-review 处理。

## 4. 三个硬边界

### Foundation → MingOS

Foundation 规定原则和判定边界；MingOS 将已接受要求转为协议。MingOS 可以精确引用 Draft Kernel 概念，但不得把它们写成稳定标准或 conformance。

### MingOS → Family-Space

MingOS 提供跨空间能力，不规定家庭领域的固定回应方式。Family-Space 可保留语言、节奏、模式和家庭情境解释的灵活性；生命安全、暴力、虐待、隐私、权利与专业权限风险必须进入相应硬门。

### Family-Space → 上层

家庭产品字段、提示词和流程不会因为有效或已存在就自动成为 MingOS 对象或 Foundation 原则；只有经过证据、抽象和治理复核才可成为上层提案。

## 5. 已落入主干的三项事实决定

| 议题 | 当前值 | 历史保留 | 当前落地 |
|---|---|---|---|
| Family-Space 产品仓 | `YuemingHub/Family-Space` | `YuemingHub/Ming-os` | MingOS main（PR #17） |
| Foundation 仓库 | `YuemingHub/mingos-foundation` | `YuemingHub/Ming-Foundation` | Foundation main（PR #15）与 MingOS main（PR #17） |
| MingOS 规范入口 | `YuemingHub/MingOS` | `YuemingHub/mingos-unified` | MingOS main（PR #17） |

三项决定均保持可撤回；它们更新事实基线，但不授权部署、真实用户启动或通用平台扩建。

## 6. 当前执行与最终门

### 当前可执行

- 审查并同步 MingOS PR #18 到 Foundation `main@7eb33ffc` 与 MingOS `main@356887e8`；
- 运行 MingOS 契约测试，确认 Draft Kernel 未被提升为稳定依赖；
- 只读接收 Family-Space 已验证事实，留待最后三仓统一核验；
- 把产品失败、反例和未知整理为上层可审阅证据，而不是自动标准。

### 当前禁止

- 未经 Review、基线同步和成功 CI 就合并任何候选；
- 代替月明处理 Family-Space 的产品合并门；
- 触碰服务器、PM2、Nginx、cron、环境变量、密钥、真实数据或 `ymai.me`；
- 把 Draft Kernel、产品字段或一次有效做法表述为通用合规结论。

### 当前顺序

1. 完成 MingOS #18 的 Foundation 依赖重写与契约测试；
2. 通过最终 Review 后合并 #18；
3. 对 Foundation main、MingOS main 与 Family-Space 当前事实源做只读统一核验；
4. 在产品闭环、安全门和人工验收完成前，不讨论真实用户或生产放行。

## 7. 每个跨仓变更必须回答

- 改动属于原则、通用协议还是家庭产品？
- 依据哪个已接受文件或当前事实源？
- 是否混淆了“已合入主干”与“已成为稳定权威”？
- 原始来源、commit、测试和人工门在哪里？
- 这是事实、推断、提案、历史记录还是未解决冲突？
- 是否会让使用者失去主体性、撤回权、数据权利或现实中的安全支持？

如果这些问题不能回答，变更只能停留在 Draft 或 pending。
