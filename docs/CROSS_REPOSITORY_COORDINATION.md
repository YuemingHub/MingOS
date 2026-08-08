# MingOS 三仓协调契约

> 状态：Proposed coordination contract  
> 日期：2026-08-08  
> 维护位置：`YuemingHub/MingOS`  
> 适用范围：`mingos-foundation`、`MingOS`、`Family-Space`

本文件是三仓协作的导航、边界和执行状态入口。它不替代各仓事实源，也不把 Draft、开放 PR、产品字段、对话结论或 AI 判断自动提升为 Accepted 事实。

本次协调快照建立在 Family-Space PR #156 合并后。它记录的是本次核验时的远程事实，不授权部署、真实用户启动或 Foundation / MingOS 自动扩张。

## 1. 三层关系

| 层级 | 仓库 | 负责什么 | 不负责什么 |
|---|---|---|---|
| 原则与治理层 | `YuemingHub/mingos-foundation` | 生命宪章、MingOS 宪章、伦理边界、治理流程、标准与合规判定 | 家庭业务代码、家长档案、生产运行与产品界面 |
| 通用内核与协议层 | `YuemingHub/MingOS` | Space、Actor、Context、Intent、Authorization、Task、Evidence、Handoff、Continuity Bundle 等跨空间协议、Schema 与验证器 | 家庭画像、家长回复、家庭阶段等垂直字段 |
| 家庭垂直产品层 | `YuemingHub/Family-Space` | 家庭真实生活、理解与转译、家长回复、安全门、可拒绝行动、生活反馈、家庭回望与数据权利 | MingOS 通用对象和 Foundation 原则的自动定义权 |

正向约束：Foundation 已接受的原则与标准 → MingOS 可验证协议 → Family-Space 产品闭环。

反向学习：Family-Space 的验证、失败、反例与未知 → MingOS 协议候选 → Foundation 复核。反向材料只能成为证据或提案，不因产品有效而自动升级。

## 2. 当前远程事实

### Foundation

- 仓库：`YuemingHub/mingos-foundation`；默认分支：`main`；
- 本次核验主干：`7eb33ffc806db1da2fde488a617860ca34b76c0e`；
- 当前 Accepted/Stable 权威仍按仓库 canonical state 判定；主干中的 Draft 不因 merge 自动成为稳定标准；
- 当前原则线继续支持：生命优先、主体性、解释可修正、证据/纠正/权利优先于系统确定性；
- 本次核验时开放 PR：0。

### MingOS

- 仓库：`YuemingHub/MingOS`；默认分支：`main`；
- 本次核验基线：`bc09d38426ef5c8632552a87b7fa848ac45f0155`；
- 已有跨空间核心对象仍是 Space / Actor / Context / Intent / Authorization / Task / Evidence / Handoff / Continuity Bundle；
- MingOS 不拥有 Family-Space 的产品合并权，也不把 Family-specific profile 字段变成通用协议；
- 当前无真实用户、无生产环境、无数据迁移；
- 本次核验时开放 PR：0。

### Family-Space

- 仓库：`YuemingHub/Family-Space`；默认分支：`production`；
- 本次核验主干：`2558af58fb9fe44fcf66b50973e15768b77d4629`（PR #156）；
- `CURRENT_PROJECT_STATUS.md` 仍是运行事实源：真实家长无、生产环境无、对外正式服务无；
- 当前已经形成合成数据支持的可见产品闭环：Today 直接开口 → Dialogue → action candidate 可选择/拒绝 → 第二次回来 → 我家 → 回望 → 我的；
- synthetic seeder、MVP pipeline、parent-real-journey 已存在，但这些只证明开发/合成验证，不等于真实家庭验收；
- Conversation V4 的认识论 shadow、前三轮关系质量门和 action-optional 约束仍在；普通路径不把行动当默认终点；
- PR #156 进一步完成 evidence-first 家庭理解纠偏：家长可见家庭片段只从 scoped life record 或 confirmed private memory 投影；raw inference 与 legacy profile label 不自动成为家庭事实；只有家长明确选择过的 action 才能进入待复盘与反馈型投影；
- PR #156 最新 head 的 Prelaunch Safety run `31243182227` 全绿；
- 当前开放 Draft PR #153 / #154 均基于旧基线，已明显落后当前 `production`，不得把它们直接当作下一执行队列；
- 历史发布、服务器与 NO-GO 记录不能被解释为当前生产事实。

## 3. 当前一致性判断

三仓当前仍是一条线：

```text
Foundation
生命优先 / 主体性 / 可修正 / 证据与权利
        ↓
MingOS
Context / Evidence / Authorization / Handoff / Continuity
        ↓
Family-Space
真实生活进入 → 区分事实/解释/未知 → 形成可修正理解
→ 用户自己选择/拒绝 → 回到生活 → 带回结果 → 修正理解
```

Family-Space 本轮发现的主要偏移不是 Foundation 或 MingOS 原则错误，而是旧 `FamilyProfile` 混合来源字符串重新进入家长可见 read model，可能把系统生成内容说成家庭事实。PR #156 已在 Family 层先纠正这个实现泄漏。

该产品结构尚不是 MingOS 通用协议或 Foundation 标准。Family-Space 的 evidence-first 做法只有在跨场景重复成立、能够抽象为非家庭专属能力时，才可形成 MingOS 候选。

## 4. 权威顺序与冲突规则

1. Foundation `main` 中 Accepted/Stable 文件决定原则、伦理与治理约束；主干中的 Draft 仍只是 Draft。
2. MingOS `main` 决定已经合入的跨空间协议、Schema、验证器与连续性事实。
3. Family-Space `production` 与 `CURRENT_PROJECT_STATUS.md` 决定家庭产品实现边界与运行事实。
4. Draft、Proposed、Candidate、开放 PR、Issue、旧发布记录和对话只能作为提案、证据或历史来源。
5. 跨仓冲突必须保留原始来源，并通过具名、可撤回的 source-review 处理。
6. 产品中有效的 V4、evidence-first projection 或 action lifecycle 只能作为上层学习证据，不能因为已经进入 `production` 就自动成为 MingOS Kernel 或 Foundation 规范。

## 5. 三个硬边界

### Foundation → MingOS

Foundation 规定原则和判定边界；MingOS 将已接受要求转为协议。MingOS 可以精确引用 Draft Kernel 概念，但不得把它们写成稳定标准或 conformance。

### MingOS → Family-Space

MingOS 提供跨空间能力，不规定家庭领域的固定回应方式、家庭画像字段、家庭阶段或页面信息架构。Family-Space 可保留家庭情境解释与表达灵活性，但生命安全、隐私、授权、证据来源、纠正/撤回和主体性不得被软化。

### Family-Space → 上层

家庭产品字段、提示词、profile、页面和一次有效做法不会因为存在或通过测试就自动成为 MingOS 对象或 Foundation 原则。必须先证明它是跨空间问题，再通过证据、抽象和治理复核。

## 6. 当前执行与最终门

### 当前可执行

- 继续围绕 Family-Space 的真实产品主循环做合成验证和内部体验，而不是增加与主循环无关的功能；
- 优先让家庭理解具备来源、证据、未知、纠正与现实反馈，而不是增加更完整的永久画像；
- 重新评估 #153 / #154 的独有价值；若仍有价值，应基于最新 Family `production` 重做小 PR，而不是直接合并旧分支；
- 将 Family-Space 中反复出现、且明显跨空间的 evidence / revision / authorization 问题整理为 MingOS 候选；
- Foundation 主干变化时重新核对 `FOUNDATION_DEPENDENCY.md`。

### 当前禁止

- 未经 Review、基线同步和成功 CI 就合并任何候选；
- 触碰服务器、PM2、Nginx、cron、环境变量、密钥、真实数据或 `ymai.me`；
- 把 legacy FamilyProfile、Family-specific 字段或一次有效做法表述为通用合规结论；
- 为了页面“有内容”而用没有 provenance / confirmation / contestability 的系统字符串填补家庭事实；
- 把当前 synthetic journey 测试表述为真实家庭验证；
- 因当前方向一致就自行解释为“产品已完成”或“可以进入生产”。

### 当前顺序

1. 保持 Family-Space 当前可见闭环与 evidence-first 边界稳定；
2. 用真实产品问题裁决下一步，不以内部模块数量作为进度；
3. 对 #153 / #154 做当前基线下的去重审查，只重做仍未解决的语义缺口；
4. Family-Space 中跨场景重复成立的证据问题，再形成 MingOS 协议提案；
5. Foundation 仅复核真正上升到原则、权利、安全或治理层的问题；
6. 在真实家庭重新进入之前，重新建立独立的安全、隐私、同意、发布和人工验收门。

## 7. 每个跨仓变更必须回答

- 改动属于原则、通用协议还是家庭产品？
- 它直接服务哪一段真实生命/产品循环？
- 依据哪个 Accepted/Stable 文件、MingOS 协议或当前产品事实源？
- 这是事实、报告、推断、提案、未知还是已被修正的理解？
- provenance、evidence、authorization、correction / withdrawal 在哪里？
- 是否把“已合入主干”误写成“已成为稳定权威”？
- 是否会让使用者失去主体性、拒绝权、暂停权、纠正权、数据权利或现实中的安全支持？

如果这些问题不能回答，变更只能停留在 Draft 或 pending。
