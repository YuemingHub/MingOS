# MingOS 三仓协调契约

> 状态：Proposed coordination contract  
> 日期：2026-08-11  
> 维护位置：`YuemingHub/MingOS`  
> 适用范围：`mingos-foundation`、`MingOS`、`Family-Space`

本文件是三仓协作的导航、边界和执行状态入口。它不替代各仓事实源，也不把 Draft、开放 PR、产品字段、对话结论、内部部署验证或 AI 判断自动提升为 Accepted / Stable / production-ready 事实。

本次协调快照建立在 Family-Space `production@57cdcedd5d0803347d24ca4d44773721d9751997`。当前重点不是增加更多模型，而是持续做 **authority subtraction**：先确认信息来源和当前 authority，再删除旧分类器、旧路由、知识默认项和兼容字段对当前回复的隐藏决策权。

## 1. 三层关系

| 层级 | 仓库 | 负责什么 | 不负责什么 |
|---|---|---|---|
| 原则与治理层 | `YuemingHub/mingos-foundation` | 生命宪章、MingOS 宪章、伦理边界、治理流程、标准与合规判定 | 家庭业务代码、家长档案、生产运行与产品界面 |
| 通用内核与协议层 | `YuemingHub/MingOS` | Space、Actor、Context、Intent、Authorization、Task、Evidence、Handoff、Continuity Bundle 等跨空间协议、Schema 与验证器 | 家庭画像、家长回复、家庭阶段、Family Navigation 坐标等垂直字段 |
| 家庭垂直产品层 | `YuemingHub/Family-Space` | 家庭真实生活、理解与转译、家长回复、安全门、可拒绝行动、生活反馈、家庭回望、可修正记忆与数据权利 | MingOS 通用对象和 Foundation 原则的自动定义权 |

正向约束：Foundation 已接受的原则与标准 → MingOS 可验证协议 → Family-Space 产品闭环。

反向学习：Family-Space 的验证、失败、反例与未知 → MingOS 协议候选 → Foundation 复核。反向材料只能成为证据或提案，不因产品有效而自动升级。

当前总调度优先级与 Family-Space `CURRENT_PROJECT_STATUS.md` 一致：**Family-Space 是唯一施工主线；MingOS 仅在产品已证明跨空间通用缺口时补充；Foundation 作为最高校准层，不为了体系完整性主动扩建。**

## 2. 当前远程事实

### Foundation

- 仓库：`YuemingHub/mingos-foundation`；默认分支：`main`；
- 本次核验主干仍为 `7eb33ffc806db1da2fde488a617860ca34b76c0e`；
- Accepted / Stable 权威仍按仓库 canonical state 判定；主干中的 Draft 不因 merge 自动成为稳定标准；
- `GOV-0009-family-os-implementation-mapping.md` 是 Accepted 的历史审计记录，但明确基于 2026-07-09 的 Family OS 文档快照，不能被误读成 2026-08-11 当前实现结论；
- Foundation Issue #17 已建立当前 Family-Space 实现重审任务；2026-08-11 已补入新的实现证据 checkpoint，包括 source/provenance、legacy authority、Safety source boundary 与 real-family evidence 边界；
- 该重审必须保留 GOV-0009 的历史含义，通过既有治理/ID 预留流程补当前证据，不直接把产品机制升级为 Charter / Kernel 要求。

### MingOS

- 仓库：`YuemingHub/MingOS`；默认分支：`main`；
- 当前 `main`：`0707c39ef63357e279b01fc0f406f62124deb1ad`；
- 已有跨空间核心对象仍是 Space / Actor / Context / Intent / Authorization / Task / Evidence / Handoff / Continuity Bundle；
- MingOS 不拥有 Family-Space 的产品合并权，也不把 Family-specific profile、memory revision UI、clarification gate、Family Navigation、家庭阶段或九层字段变成通用协议；
- 当前无真实用户、无生产环境、无数据迁移；
- PR #27 已合入：修复 Windows CRLF checkout 下的 snapshot blob SHA 可复现性问题；这是基础设施修复，不是新 Core 语义；
- PR #29 已合入：三仓协调契约、共享能力审计和协调测试进入 `main`；
- Issue #30 / Draft PR #31 用当前 Family 失败证据纠正一个过时协调假设：**legacy 分类器不能因为“保守”或“负向”就重新获得运行时 authority**；
- 当前结论仍是 **reuse-before-build**：没有新的跨空间缺口证明需要新增 Core primitive。

### Family-Space

- 仓库：`YuemingHub/Family-Space`；默认分支：`production`；
- 本次核验主干：`57cdcedd5d0803347d24ca4d44773721d9751997`；
- `CURRENT_PROJECT_STATUS.md` 仍是项目存在性与运行事实源：当前无真实家长、无正式生产环境、无正式对外服务；
- `CURRENT_STATE.md` 记录的 owner-authorized admin deployment verification 属于内部运行/验收证据，不得升级成真实家庭或正式家长服务事实；
- Conversation V4、evidence-first governed memory、revision chain、clarification-first 和 action-optional final-output boundary 已有当前实现证据；
- 当前任务不是再建一套对话系统，而是继续清除旧 stage / layer / V2 / problem map / loop / referral shortcut 对当前理解、Writer、知识检索、quality gate 与行动选择的隐藏 authority；
- Issue #199 是当前 Family Navigation / legacy-authority convergence 的 Merge Gate；
- PR #205 是 current-production Family Navigation authority contract 候选，已替代关闭的 #194；当前仍因实际 authority 文件保留 legacy `Guard-only / 负向越界保护` 后门而 HOLD；
- PR #198 五阶段：静态消费链复核通过。`buildStageContextPrompt()` 退出运行时，`stageDiagnosis` 只剩当前未消费的兼容/shadow 数据；仍需可执行 CI；
- PR #197 V2：静态消费链复核通过。runtime-facing 分类与正/负操作已中性化，历史判断只在无人消费的 `shadow` 字段；仍需可执行 CI；
- PR #200 九层：HOLD。已证明 layer 在被 facade 擦除之前会生成 `behaviorProtects / currentPriority / avoidAction / step3 candidate`，且 `ai-engine` 仍可直接把 `request.previousLayer` 注入 Writer；“擦掉 layerLevel”不等于撤掉决策权；
- PR #192 development stuck point：HOLD。producer 已把默认/主题与机制证据分开，但 parent-visible consumer 仍会把 `inquiry_candidate` 升级成“你家的卡点初判”；
- PR #195 loop detector：静态边界通过。家庭生活反复与 AI 对话反复已分开；它不拥有下游处理策略；
- PR #196 router/support：HOLD。router 已把绿色专业支持询问留在 ordinary support，并把重复对话降为 repair context，但 legacy framework 仍存在 `professional_referral_response` 与 `loop_saturated` 两条确定性快捷消费路径；
- PR #193 epistemic boundary：当前 production 从其 base 继续前进的提交未再修改其 life-logic runtime surface，仍可保留为最终 parent-visible epistemic 候选；
- PR #204 Safety source boundary：HOLD。已证明候选 denial regex 可把“先直接说想死、后又否认”错误擦成非红色；分支已加入 mixed-source false-negative 回归，必须先修实现；
- PR #173 对话 history-loading / send race 仍是真实 parent continuity gap，但旧分支已明显落后当前 production，应从最新主线重建最小 delta；
- PR #171 已关闭：原 First Entry “不知道这里能做什么”缺口已被当前 production 的 first-visit 三步 guide 以新的产品实现吸收；
- PR #201 AAOP consumer hardening 与 Navigation profile 有文件重叠，应排在 #205 之后从最新 production 重建/合成，而不是 whole-file 覆盖；
- Evidence / checkpoint PR（如 #172 / #179）只提供历史开发证据，不拥有当前产品语义或 merge authority；
- 上述 Draft 均不自动成为 MingOS primitive、Foundation principle 或 release authorization。

## 3. 当前一致性判断

三仓仍然是一条线：

```text
Foundation
生命优先 / 主体性 / 可修正 / 证据与权利
        ↓
MingOS
Context / Evidence / Authorization / Handoff / Continuity
        ↓
Family-Space
真实生活进入
→ 区分 FACT / REPORT / FEELING / INTERPRETATION / INFERENCE / UNKNOWN / CORRECTION
→ 只依据有来源的当前证据形成暂时理解
→ Navigation 只组织证据，不制造事实
→ 新现实可能挑战旧理解
→ 系统先澄清，不自动判真、不自动写
→ 家长若愿意修正，只走既有数据权利入口
→ revision chain 产生新的当前版本
→ 旧版本退出当前 AI 上下文但保留必要历史
→ Response Posture / action consent 决定本轮是否需要建议
→ 下一轮继续依据可修正的当前事实展开
```

当前最重要的协调修正是：**“撤掉正向分类权”还不够。** 如果 historical stage / layer / V2 / problem map 的 category、confidence 或 derived output 还能激活负向 quality gate、禁止项、知识选择、转介、行动候选或 Writer 指令，它仍然拥有 runtime authority。

因此三仓采用以下 canonical rule：

> **导航可以组织证据；旧模型可以提供假设；只有当前独立证据 authority 可以激活保护。分类本身既不能开处方，也不能下禁令。**

允许激活保护的 current authority 必须可指出来源，例如：

- Hard Safety；
- 当前直接 FACT / REPORT 及 provenance；
- action consent / coercion boundary；
- 其他明确声明并接受审查的当前 evidence owner。

legacy stage/layer/V2/navigation coordinate 可以提供 history、shadow、知识、问题或候选假设，但**它自己的 category/confidence/output 不得成为 guard trigger**。legacy output 最多帮助提出“是否需要保护”的候选问题，真正的 guard 由独立当前证据重新证明。

这仍然是 Family-Space 产品实现和失败验证产生的协调证据，不是 MingOS 新通用对象，也不是 Foundation 新标准。**产品实现不得自动升级为 MingOS Core primitive。** 只有当同类 authority / evidence / revision / authorization 问题在多个非家庭空间重复出现，且现有 MingOS 对象无法表达时，才形成 upstream candidate。

## 4. 权威顺序与冲突规则

1. Foundation `main` 中 Accepted / Stable 文件决定原则、伦理与治理约束；Draft 仍只是 Draft。
2. MingOS `main` 决定已经合入的跨空间协议、Schema、验证器与连续性事实。
3. Family-Space `production`、`CURRENT_PROJECT_STATUS.md`、产品合同与当前 Merge Gate 决定家庭产品实现事实和候选顺序。
4. Draft、Proposed、Candidate、开放 PR、Issue、旧发布记录和对话只能作为提案、证据或历史来源。
5. **同一产品语义边界只允许一个当前 merge-authoritative candidate。** 旧 PR 被较新 production 基线重建或覆盖后应关闭/标记 superseded，而不是继续并行等待合并。
6. 跨仓冲突必须保留原始来源，并通过具名、可撤回的 source-review 处理。
7. 产品中有效的 V4、evidence-first projection、memory revision chain、clarification gate、rights editor、Navigation 或 action lifecycle 只能作为上层学习证据，不能因为进入 `production` 就自动成为 MingOS Kernel 或 Foundation 规范。
8. PR 描述、变量名或“guard-only / shadow-only”标签不是 authority 证明；必须审**真实 consumer chain 和执行时序**。

## 5. 三个硬边界

### Foundation → MingOS

Foundation 规定原则和判定边界；MingOS 将已接受要求转为协议。MingOS 可以精确引用 Draft Kernel 概念，但不得把它们写成稳定标准或 conformance。

Foundation 对 Family-Space 的当前校准必须区分“历史 Accepted 审计记录”和“当前实现证据”。GOV-0009 这类基于旧快照的 Accepted 文件保留其历史含义；新的实现变化通过新一轮证据审查进入治理流程，而不是直接改写过去结论。

### MingOS → Family-Space

MingOS 提供跨空间能力，不规定家庭领域固定回应方式、家庭画像字段、家庭阶段、Family Navigation 坐标、页面信息架构、具体记忆版本 UI 或澄清文案。Family-Space 可保留家庭情境解释与表达灵活性，但生命安全、隐私、授权、证据来源、纠正/撤回和主体性不得被软化。

MingOS 对 Family-Space 当前最重要的指导不是增加协议，而是帮助识别 duplicate / hidden authority：如果已有 Context / Evidence / Intent / Authorization / Continuity 能表达问题，就优先删除重复决策权，而不是新建第二套 truth/state/router。

### Family-Space → 上层

家庭产品字段、提示词、profile、页面、revision facade、clarification gate、rights editor、Navigation 坐标和一次有效做法不会因为存在或通过测试就自动成为 MingOS 对象或 Foundation 原则。必须先证明它是跨空间问题，再通过证据、抽象和治理复核。

Family-Space 的失败同样不会自动证明需要新 Core primitive。优先问：失败是否由产品内部多个并行 authority、旧状态机残留、错误默认值、消费者忽略 provenance 或未经授权的正/负向建议造成；只有现有通用语义确实表达不了，才进入上游候选。

## 6. 当前执行与最终门

### 当前可执行

- 保持 Family-Space 当前可见闭环、evidence-first、revision-chain、clarification-first 与 action-optional 边界稳定；
- Family 下一产品优先级仍围绕“第一次进入 → 第一句话 → 前三轮 → 可以继续或停下 → 第二次回来 → 修正理解 → 回到生活继续展开”；
- 先收敛同一语义边界上的重复 PR，再讨论新能力；
- 审任何“撤权 PR”时必须回答：**旧模型是在做决定之前被切断，还是做完决定后只擦掉标签？**
- producer 把对象降级成 candidate / unknown 后，必须继续检查 consumer 是否又把它升级为当前事实、家庭机制、行动或禁令；
- 继续用 synthetic / internal 场景验证，不把结果包装成真实家庭成效；
- Foundation 通过 Issue #17 重新审计当前实现证据，但不修改 GOV-0009 的历史权威含义，也不提前声称 Charter conformance；
- 将跨场景重复成立、且明显跨空间的 evidence / revision / authorization / authority 问题整理为 MingOS 候选。

### 当前禁止

- 未经 Review、基线同步和成功 CI 就合并 runtime 候选；
- 同一父母可见语义边界同时合并两个或更多互相覆盖的 Draft PR；
- 把 GitHub Actions `steps=null / logs=null` 的 pre-runner failure 当成产品代码失败，或为了绿灯削弱测试；
- 触碰真实家庭数据或把内部 admin deployment verification 描述成正式家长服务；
- 把 legacy FamilyProfile、Family-specific 字段、Navigation、revision facade、clarification gate、rights editor 或一次有效做法表述为通用合规结论；
- 为了页面“有内容”而用没有 provenance / confirmation / contestability 的系统字符串填补家庭事实；
- 让 AI 在没有家长确认的情况下自动合并、覆盖、失效或判定互相冲突的家庭理解；
- 再造第二套 memory API、pending clarification 表、Family Navigation state machine 或自动确认状态机；
- 用旧 stage/layer/V2/problem-map/loop/escalation 的默认分类恢复“家庭是什么”“家长该做什么”或“系统必须禁止什么”的 authority；
- 把 synthetic journey 测试表述为真实家庭验证；
- 因当前方向一致就自行解释为“产品已完成”或“可以进入生产”。

### 当前顺序

1. 以 Family-Space `production` 为唯一施工基线；合同候选以 #205 为 current successor，旧 #194 已退出 merge authority；
2. 修正 #205 的 legacy negative-guard authority 后，再推进 runtime containment；
3. 五阶段 #198、V2 #197 已静态通过，等待可执行 CI 与最终 current-production diff；
4. 九层 #200 先切掉 pre-consumption / previousLayer prompt authority，再谈通过；
5. development #192 让 `inquiry_candidate` 在 parent-visible consumer 中仍保持候选语义；
6. loop detector #195 保持 detector-only；router #196 收敛 legacy referral / loop shortcut consumer；
7. Safety #204 必须先解决 mixed positive-report + later denial false-negative，再进入任何合并讨论；
8. 最后让 #193 作为 parent-visible epistemic last defense，而不是让 final filter替上游错误推断兜底；
9. 独立重建 #173 current-production dialogue continuity delta；AAOP #201 排在 #205 后合成；
10. 在真实家庭重新进入之前，重新建立独立的安全、隐私、同意、发布和人工验收门。

## 7. 每个跨仓变更必须回答

- 改动属于原则、通用协议还是家庭产品？
- 它直接服务哪一段真实生命/产品循环？
- 依据哪个 Accepted / Stable 文件、MingOS 协议或当前产品事实源？
- 这是 FACT、REPORT、INTERPRETATION、INFERENCE、UNKNOWN、CORRECTION 还是提案？
- provenance、evidence、authorization、correction / withdrawal 在哪里？
- 系统发现“可能不一致”时，是邀请人澄清，还是已经越权替人判真？
- 家长不采取修正动作时，系统是否保持零自动写入？
- 旧理解被新证据替代后，是否真正退出当前 AI 上下文，同时保留必要历史可追溯性？
- 是否存在另一个开放 PR / legacy module 正在决定同一语义边界？谁是唯一 current successor？
- producer 降低 authority 后，consumer 有没有再次升级它？
- guard 的触发证据来自当前独立 authority，还是来自 legacy classifier 自己的 category/confidence？
- 旧模型是在做决定前被切断，还是做完决定后才擦掉标签？
- 这次改动是在减少隐藏 authority，还是又增加 classifier / state machine / router？
- 是否把“已合入主干”误写成“已成为稳定权威”？
- 是否会让使用者失去主体性、拒绝权、暂停权、纠正权、数据权利或现实中的安全支持？

如果这些问题不能回答，变更只能停留在 Draft / pending。