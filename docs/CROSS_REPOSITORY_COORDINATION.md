# MingOS 三仓协调契约

> 状态：Proposed coordination contract  
> 日期：2026-08-10  
> 维护位置：`YuemingHub/MingOS`  
> 适用范围：`mingos-foundation`、`MingOS`、`Family-Space`

本文件是三仓协作的导航、边界和执行状态入口。它不替代各仓事实源，也不把 Draft、开放 PR、产品字段、对话结论或 AI 判断自动提升为 Accepted 事实。

本次协调快照建立在 Family-Space `production@09a8dfad65f52d49169ec8a4034c1d0b60c5317e`。PR #166 已进入该主线；PR #169 已因被 #171 重建替代而关闭。当前重点不再是并行增加更多模型，而是收敛同一语义边界的重复候选、减少隐藏权威，并让 Family-Space 保持唯一施工主线。

## 1. 三层关系

| 层级 | 仓库 | 负责什么 | 不负责什么 |
|---|---|---|---|
| 原则与治理层 | `YuemingHub/mingos-foundation` | 生命宪章、MingOS 宪章、伦理边界、治理流程、标准与合规判定 | 家庭业务代码、家长档案、生产运行与产品界面 |
| 通用内核与协议层 | `YuemingHub/MingOS` | Space、Actor、Context、Intent、Authorization、Task、Evidence、Handoff、Continuity Bundle 等跨空间协议、Schema 与验证器 | 家庭画像、家长回复、家庭阶段等垂直字段 |
| 家庭垂直产品层 | `YuemingHub/Family-Space` | 家庭真实生活、理解与转译、家长回复、安全门、可拒绝行动、生活反馈、家庭回望、可修正记忆与数据权利 | MingOS 通用对象和 Foundation 原则的自动定义权 |

正向约束：Foundation 已接受的原则与标准 → MingOS 可验证协议 → Family-Space 产品闭环。

反向学习：Family-Space 的验证、失败、反例与未知 → MingOS 协议候选 → Foundation 复核。反向材料只能成为证据或提案，不因产品有效而自动升级。

当前总调度优先级与 Family-Space `CURRENT_PROJECT_STATUS.md` 一致：**Family-Space 是唯一施工主线；MingOS 仅在产品已证明跨空间通用缺口时补充；Foundation 作为最高校准层，不为了体系完整性主动扩建。**

## 2. 当前远程事实

### Foundation

- 仓库：`YuemingHub/mingos-foundation`；默认分支：`main`；
- 本次核验主干：`7eb33ffc806db1da2fde488a617860ca34b76c0e`；
- Accepted/Stable 权威仍按仓库 canonical state 判定；主干中的 Draft 不因 merge 自动成为稳定标准；
- 当前原则线继续支持：生命优先、主体性、解释可修正、证据/纠正/权利优先于系统确定性；
- `GOV-0009-family-os-implementation-mapping.md` 是 Accepted 的历史审计记录，但它明确基于 2026-07-09 的 Family OS 文档快照，不能被误读成 2026-08-10 的当前实现结论；
- Foundation Issue #17 已建立当前 Family-Space 实现重审任务：保留 GOV-0009 的历史含义，通过既有治理/ID 预留流程补当前证据，不直接把产品机制升级为 Charter / Kernel 要求；
- 本次核验时开放 PR：0。

### MingOS

- 仓库：`YuemingHub/MingOS`；默认分支：`main`；
- 本次核验基线：`8897cf4758bf93a61f1a936625a78b1f2e8f3886`（PR #27）；
- 已有跨空间核心对象仍是 Space / Actor / Context / Intent / Authorization / Task / Evidence / Handoff / Continuity Bundle；
- MingOS 不拥有 Family-Space 的产品合并权，也不把 Family-specific profile、memory revision UI、clarification gate、Family rights editor 或家庭阶段字段变成通用协议；
- 当前无真实用户、无生产环境、无数据迁移；
- PR #25 已关闭并由当前协调重建替代；其“reuse-before-build、当前不新增 Core primitive”的有效结论被保留为新审计的历史来源；
- PR #27 已合入：Windows CRLF checkout 下的 snapshot blob SHA 验证现在只对已知 UTF-8 文本做 CRLF→LF canonicalization，未知扩展名、二进制/非法 UTF-8 保持原样；这是可复现性基础设施修复，不是新 Core 语义。

### Family-Space

- 仓库：`YuemingHub/Family-Space`；默认分支：`production`；
- 本次核验主干：`09a8dfad65f52d49169ec8a4034c1d0b60c5317e`；
- `CURRENT_PROJECT_STATUS.md` 仍是运行事实源，并已明确 Family-Space 是当前唯一施工主线；
- Conversation V4 已存在；当前任务是减少隐藏路由/判断权威、守住 Context Ledger / Life Translator / Response Posture / action-optional / epistemic 边界，而不是再建一套对话系统；
- PR #156：家长可见家庭理解 evidence-first，raw inference 与 legacy profile label 不自动成为家庭事实；
- PR #157：private memory 必须 evidence-backed / provenance-backed，缺失或不可归一化来源时 fail-closed；
- PR #158：家长修正形成 revision chain；新版本成为当前版本，旧版本 `stale` 且 `ai_usable=0`，否认可清除关联修订链；
- PR #159：Family-only memory clarification gate 保守识别明确纠正/变化；普通好转、普通对比、家庭成员意见不同不会被包装成系统冲突；`situation_changed` 不等于“之前理解错了”；澄清本身 read-only，安全门优先，澄清前不继续沿旧理解给 action/method；
- PR #160 将 #158 与 #159 串成跨模块回归：clarification 零写入 → 家长主动走既有数据权利入口 correction → revision chain 生成新版本 → 旧版本退出 AI context → 下一轮 AI 只看到家长修正后的当前版本；
- PR #164：Layer A runtime evidence 已合入，证明主链执行、跨轮历史传递与 intake 边界，但不证明真实模型质量或真实家庭体验；
- PR #165：Layer B real-model journey evidence 已合入，记录开发期 VERIFIED_FAILURE / AMBIGUOUS / PROVIDER_ERROR；这些是开发证据，不是生产放行；
- PR #166 已合入：final parent output 的 action-optional boundary 成为当前 production 事实；无明确方法授权时不应新增行动分配，明确方法授权时最多一个有边界、可拒绝、可逆的建议，安全例外仍优先；
- PR #169 已关闭：同一 First Entry 意图由基于较新 production 的 PR #171 重建，旧候选不再保持并行合并权威；
- Issue #170 当前总调度板已记录新的候选收敛规则：同一父母可见语义边界只能保留一个 merge-authoritative candidate，旧实验可以留作证据，但不得继续作为并行合并候选；
- 当前 Family 候选按职责分组：
  - Lane A 当前集成候选：PR #178；#168 / #175 / #177 在完成与 #178 的当前 production 语义/文件差异证明前保持 HOLD，不独立合并；
  - Lane C 独立小候选：#171 First Entry、#173 对话历史 loading/continuity、#174 失败重试去重；
  - Evidence / checkpoint：#172 / #179，只提供证据与发布判断材料，不拥有产品语义；
  - Architecture-containment cohort：#181 / #182 / #184 / #186 / #187，目标应是收回 legacy stage/layer/V2/loop/escalation 的隐藏正向权威，不得演化成另一套分类器或状态机；
- 上述开放 PR 均不自动成为 MingOS primitive、Foundation principle 或 release authorization；
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
真实生活进入 → 区分事实/报告/解释/推断/未知 → 有来源的暂时理解
→ 新现实可能挑战旧理解 → 系统先澄清，不自动判真、不自动写
→ 家长如果愿意修正，只走现有数据权利入口
→ revision chain 产生新的当前版本
→ 旧版本退出当前 AI 上下文但保留必要历史
→ 回复层不把未知补成确定、不把理解自动变成任务
→ 方法请求出现时才允许有限建议，且安全边界优先
→ 下一轮继续依据可修正的当前事实展开
```

PR #160 证明了一个重要产品判断：**不需要为了“澄清之后怎么办”再造 pending clarification 表、第二套 memory API 或自动确认状态机。** Family-Space 已经有两条职责清晰的能力：对话层负责承认不确定并邀请澄清；“我的 → 系统记下的内容”负责家长主动修正；revision chain 负责版本替代。

PR #166 又证明了另一个当前产品事实：**“能给建议”不等于“每轮都应给建议”。** action optionality 应由家长当前意图与安全例外约束，而不是由旧阶段、旧分类器、固定回复模板或后台推断自动恢复正向行动权威。

因此当前更重要的工作不是增加新的模型，而是做 authority subtraction：凡是 historical stage / layer / V2 prescription / loop / escalation 仍能绕过当前事实、意图与 Response Posture 直接决定“家庭是什么 / 应该做什么”，都应优先收回其正向权威，只保留有证据的负向保护或兼容价值。

这仍然是 Family-Space 产品实现和验证结果，不是 MingOS 新通用对象，也不是 Foundation 新标准。只有当同类 authority / evidence / revision / authorization 问题在多个非家庭空间重复出现，且现有 MingOS 对象无法表达时，才形成 MingOS upstream candidate。

## 4. 权威顺序与冲突规则

1. Foundation `main` 中 Accepted/Stable 文件决定原则、伦理与治理约束；主干中的 Draft 仍只是 Draft。
2. MingOS `main` 决定已经合入的跨空间协议、Schema、验证器与连续性事实。
3. Family-Space `production`、`CURRENT_PROJECT_STATUS.md`、产品合同与当前协调板决定家庭产品实现事实和候选顺序。
4. Draft、Proposed、Candidate、开放 PR、Issue、旧发布记录和对话只能作为提案、证据或历史来源；Issue #170 的 merge-authoritative designation 是 Family 产品协调状态，不会反向成为 MingOS Core 权威。
5. **同一产品语义边界只允许一个当前 merge-authoritative candidate。** 旧 PR 若已被较新 production 基线上的候选重建或覆盖，应标记 HOLD / SUPERSEDED，而不是继续并行等待合并。
6. 跨仓冲突必须保留原始来源，并通过具名、可撤回的 source-review 处理。
7. 产品中有效的 V4、evidence-first projection、memory revision chain、clarification gate、rights editor 或 action lifecycle 只能作为上层学习证据，不能因为已经进入 `production` 就自动成为 MingOS Kernel 或 Foundation 规范。

## 5. 三个硬边界

### Foundation → MingOS

Foundation 规定原则和判定边界；MingOS 将已接受要求转为协议。MingOS 可以精确引用 Draft Kernel 概念，但不得把它们写成稳定标准或 conformance。

Foundation 对 Family-Space 的当前校准必须区分“历史 Accepted 审计记录”和“当前实现证据”。像 GOV-0009 这类基于旧快照的 Accepted 文件应保留其历史含义；新的实现变化通过新一轮证据审查进入治理流程，而不是直接改写过去的结论。

### MingOS → Family-Space

MingOS 提供跨空间能力，不规定家庭领域的固定回应方式、家庭画像字段、家庭阶段、页面信息架构、具体记忆版本 UI 或澄清文案。Family-Space 可保留家庭情境解释与表达灵活性，但生命安全、隐私、授权、证据来源、纠正/撤回和主体性不得被软化。

MingOS 对 Family-Space 当前最重要的指导不是增加协议，而是帮助识别 duplicate authority：如果已有 Context / Evidence / Intent / Authorization / Continuity 能表达问题，就优先在产品里删除/收回重复决策权，而不是新建第二套 truth/state/router。

### Family-Space → 上层

家庭产品字段、提示词、profile、页面、revision facade、clarification gate、rights editor 和一次有效做法不会因为存在或通过测试就自动成为 MingOS 对象或 Foundation 原则。必须先证明它是跨空间问题，再通过证据、抽象和治理复核。

Family-Space 的失败同样不会自动证明需要新 Core primitive。优先问：失败是否由产品内部存在多个并行权威、旧状态机残留、错误的默认值或不受授权的正向建议造成；只有现有通用语义确实表达不了，才进入上游候选。

## 6. 当前执行与最终门

### 当前可执行

- 保持 Family-Space 当前可见闭环、evidence-first、revision-chain、clarification-first 与 action-optional 边界稳定；
- Family 下一产品优先级仍围绕“第一次进入 → 第一句话 → 前三轮 → 可以继续或停下 → 第二次回来 → 修正理解 → 回到生活继续展开”；
- 先收敛同一语义边界上的重复 PR，再讨论新能力；旧候选可作为 evidence source，但不保持平行 merge authority；
- 对 #181 / #182 / #184 / #186 / #187 优先验证“删除或限制了什么旧权威”，而不是“新增了什么模型”；
- 如果真实使用证明纠正入口寻找成本高，只补轻量导航，不新增 pending clarification 状态、不新增 memory write API、不让 AI 代替家长决定哪一种解释；
- 继续用 synthetic / internal 场景验证，不把这些结果包装成真实家庭成效；
- 将 Family-Space 中跨场景重复成立、且明显跨空间的 evidence / revision / authorization / authority 问题整理为 MingOS 候选；
- Foundation 通过 Issue #17 重新审计当前实现证据，但不修改 GOV-0009 的历史权威含义，也不提前声称 Charter conformance。

### 当前禁止

- 未经 Review、基线同步和成功 CI 就合并任何候选；
- 同一父母可见语义边界同时合并两个或更多互相覆盖的 Draft PR；
- 触碰服务器、PM2、Nginx、cron、环境变量、密钥、真实数据或 `ymai.me`；
- 把 legacy FamilyProfile、Family-specific 字段、revision facade、clarification gate、rights editor 或一次有效做法表述为通用合规结论；
- 为了页面“有内容”而用没有 provenance / confirmation / contestability 的系统字符串填补家庭事实；
- 让 AI 在没有家长确认的情况下自动合并、覆盖、失效或判定互相冲突的家庭理解；
- 把“情况变了”自动重写成“之前谁理解错了”；
- 再造第二套 memory API、pending clarification 表或自动确认状态机来替代现有数据权利入口；
- 用旧 stage/layer/V2/loop/escalation 的默认分类恢复“家庭是什么”或“家长该做什么”的正向权威；
- 把当前 synthetic journey 测试表述为真实家庭验证；
- 因当前方向一致就自行解释为“产品已完成”或“可以进入生产”。

### 当前顺序

1. 以 Family-Space `production` 为唯一施工基线，保持当前可修正理解闭环为单一事实；
2. 收敛重复候选：同一语义边界只保留一个 merge-authoritative successor；
3. 先做 reply/runtime 与 legacy authority containment，再按独立小步验证 First Entry / continuity / retry 等家长可见体验；
4. 回到第一次进入、前三轮、第二次回来做真实家长体验收敛，并验证“继续 / 停下 / 纠正 / 换话题”都不会被系统强行变成任务；
5. 评估“我想纠正系统理解”是否能自然走到“我的 → 系统记下的内容”；只有真实阻力出现时才补导航；
6. 继续证明“先不处理”“两个都成立”“情况后来变了”不会触发隐式失效或覆盖；
7. Family-Space 中跨场景重复成立且现有 MingOS 对象无法表达的问题，再形成 MingOS 协议提案；
8. Foundation 仅复核真正上升到原则、权利、安全或治理层的问题，并通过当前实现重审更新证据面；
9. 在真实家庭重新进入之前，重新建立独立的安全、隐私、同意、发布和人工验收门。

## 7. 每个跨仓变更必须回答

- 改动属于原则、通用协议还是家庭产品？
- 它直接服务哪一段真实生命/产品循环？
- 依据哪个 Accepted/Stable 文件、MingOS 协议或当前产品事实源？
- 这是事实、报告、推断、提案、未知还是已被修正的理解？
- provenance、evidence、authorization、correction / withdrawal 在哪里？
- 系统发现“可能不一致”时，是在邀请人澄清，还是已经越权替人判真？
- 家长不采取任何修正动作时，系统是否保持零自动写入？
- 旧理解被新证据替代后，是否真的退出当前 AI 上下文，同时仍保留必要的历史可追溯性？
- 是否存在另一个开放 PR / legacy module 正在决定同一语义边界？如果存在，谁是唯一 merge-authoritative successor？
- 这次改动是在减少隐藏权威，还是又增加一个 classifier / state machine / router？
- 是否把“已合入主干”误写成“已成为稳定权威”？
- 是否会让使用者失去主体性、拒绝权、暂停权、纠正权、数据权利或现实中的安全支持？

如果这些问题不能回答，变更只能停留在 Draft 或 pending。
