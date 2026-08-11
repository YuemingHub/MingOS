# MingOS 三仓协调契约

> 状态：Proposed coordination contract  
> 日期：2026-08-11  
> 维护位置：`YuemingHub/MingOS`  
> 适用范围：`mingos-foundation`、`MingOS`、`Family-Space`

本文件是三仓协作的导航、边界和**当前协调事实入口**。它不替代各仓自己的 canonical fact source，也不把 Draft、开放 PR、产品字段、内部验收、一次真实使用或 AI 判断自动提升为 Accepted / Stable / generalized evidence。

本次快照以 Family-Space `production@2d6d0aeb948b96e178668fa12496d41b6c1a2935` 为当前产品基线。当前重点不是继续增加模型，而是持续做 **authority subtraction**：先确认来源和当前 authority，再删除旧分类器、旧路由、知识默认项和兼容字段对当前回复的隐藏决策权。

## 1. 三层关系

| 层级 | 仓库 | 负责什么 | 不负责什么 |
|---|---|---|---|
| 原则与治理层 | `YuemingHub/mingos-foundation` | 生命宪章、MingOS 宪章、伦理边界、治理流程、标准与合规判定 | 家庭业务代码、家长档案、生产运行与产品界面 |
| 通用内核与协议层 | `YuemingHub/MingOS` | Space、Actor、Context、Intent、Authorization、Task、Evidence、Handoff、Continuity Bundle 等跨空间协议、Schema 与验证器 | 家庭画像、家长回复、家庭阶段、Family Navigation 坐标等垂直字段 |
| 家庭垂直产品层 | `YuemingHub/Family-Space` | 家庭真实生活、理解与转译、家长回复、安全门、可拒绝行动、生活反馈、家庭回望、可修正记忆与数据权利 | MingOS 通用对象和 Foundation 原则的自动定义权 |

正向约束：Foundation 已接受原则 → MingOS 可验证协议 → Family-Space 产品实现。

反向学习：Family-Space 的真实使用、合成回归、失败、反例与未知 → MingOS 协议候选 → Foundation 复核。**产品有效不等于自动升级。**

当前总调度仍以 Family-Space 为唯一施工主线：MingOS 只在产品已经证明存在跨空间通用缺口时补充；Foundation 继续作为最高校准层，不为了体系完整性主动扩建。

## 2. 当前远程事实

### Foundation

- 仓库：`YuemingHub/mingos-foundation`；默认分支：`main`；
- 本次核验主干仍为 `7eb33ffc806db1da2fde488a617860ca34b76c0e`；
- Accepted / Stable 权威仍按仓库 canonical state 判定；主干中的 Draft 不因 merge 自动成为稳定标准；
- `GOV-0009-family-os-implementation-mapping.md` 是 Accepted 的**历史审计记录**，明确基于 2026-07-09 Family OS 快照，不能被误读成 2026-08-11 当前产品结论；
- Foundation Issue #17 已建立当前 Family-Space 重新审计入口；新的产品事实作为 evidence input 进入，不直接改写 GOV-0009，也不自动生成 Charter / Kernel 新规则。

### MingOS

- 仓库：`YuemingHub/MingOS`；默认分支：`main`；
- 本次 #31 变更前 `main`：`0707c39ef63357e279b01fc0f406f62124deb1ad`；
- PR #27 已合入 snapshot CRLF 可复现性修复；
- PR #29 已合入上一版三仓协调契约与共享能力审计；
- Issue #30 / Draft PR #31 正在纠正一个由 Family 失败审查证明为过宽的旧假设：legacy 分类器不能因为输出被叫作“guard”或“保守保护”就重新获得运行时 authority；
- 当前仍没有证据要求新增 MingOS Core primitive；继续 **reuse-before-build**。

### Family-Space

当前 canonical fact source 为 `CURRENT_PROJECT_STATUS.md`。截至本次核验：

- 当前产品基线：`production@2d6d0aeb948b96e178668fa12496d41b6c1a2935`；
- **真实家长：有。产品所有者当前作为首位真实家长使用；其他家长数量不作推断；**
- **生产环境：有。已由仓库所有者于 2026-08-11 明确授权并完成运行核验；**
- **对外正式服务：有。当前以产品所有者真实使用、边用边改为主，尚未扩大邀请；**
- 当前阶段：生产真实使用、产品闭环收敛、合成回归与持续小步优化；
- 自动测试仍只能使用合成数据或明确的内部测试数据；未经单独授权不得读取、导出、迁移真实家庭内容；
- 一次真实使用只能证明“当前产品有人真实使用”，不能自动证明普遍有效、已完成、可规模化或 Foundation conformance。

这一变化纠正了更早快照中的“无真实家长 / 无正式生产环境 / 无正式服务”结论。旧快照仍是历史 provenance，但不再是当前事实。

## 3. 当前产品主线与候选边界

Family-Space 的核心循环仍是：

```text
带着真实生活来到这里
→ 先被看见和理解
→ FACT / REPORT / FEELING / INTERPRETATION / INFERENCE / UNKNOWN / CORRECTION 分开
→ 形成暂时、可修正的理解
→ 继续说 / 看清一点 / 尝试一步 / 暂时停下
→ 回到真实生活
→ 带着发生过的结果回来
→ 共同回望并修正理解
→ 继续展开
```

当前协调审查关注的是旧 authority 是否通过不同 consumer 重新进入这条主循环，而不是继续增加新的 stage / layer / state machine。

截至本次审查，主要候选状态如下：

- **#205 Family Navigation authority contract**：current successor，替代已关闭 #194；仍 HOLD，直到实际 authority 文件删除 legacy 自行激活 `Guard-only / 负向越界保护` 的后门；
- **#198 五阶段**：静态消费链通过；prompt authority 已退出，当前残留 stage context 未被 kernel guard 消费；等待可执行 CI 与最终 current-production diff；
- **#197 V2**：静态消费链通过；runtime-facing 分类与正/负操作已中性化，历史判断只保留在无人消费的 shadow；等待可执行 CI；
- **#200 九层**：HOLD；已证明 L1-L9 可在 layer label 被擦除之前生成 `behaviorProtects / currentPriority / avoidAction / step3 candidate`，且 `request.previousLayer` 仍有 Writer prompt 旁路；
- **#192 Development stuck point**：HOLD；producer 已降为 `evidence_backed_inquiry_candidate`，但 parent-visible consumer 仍可能升级成“你家的卡点”；
- **#195 loop detector**：静态边界通过；只负责识别 assistant-conversation repetition，不拥有后续处理策略；
- **#196 support/router**：HOLD；router 已区分 Safety、绿色支持询问与 conversation repair，但 legacy framework 仍有 referral / loop shortcut consumer；
- **#193 epistemic boundary**：保留为 parent-visible 最后一道 epistemic defense，但不能替上游错误分类和错误消费兜底；
- **#204 Safety source boundary**：HOLD；必须修复“先有直接自杀阳性报告、后又否认”被 denial regex 擦成非红色的 false-negative；
- **#173 dialogue continuity**：旧 branch 已被当前 production 明显超越；若缺口仍存在，应从最新 production 重建最小 delta；
- **#201 AAOP consumer hardening**：与 Navigation authority/profile 有重叠，排在 #205 后从最新 production 合成，避免 whole-file 覆盖。

同一产品语义边界只允许一个当前 **merge-authoritative candidate**。旧 PR 被较新 production 基线重建或吸收后，应关闭或标记 superseded，而不是继续并行等待合并。

## 4. 当前最重要的 authority 修正

以前的协调表述只强调“撤掉 legacy 的正向分类/处方权，保留有证据的负向保护”。Family-Space 的失败导向审查已经证明，这还不够。

如果 historical stage / layer / V2 / problem map / navigation coordinate 的 category、confidence 或 derived output 仍能激活：

- quality gate；
- 禁止项；
- retrieval selector；
- professional referral；
- action candidate；
- Writer prompt / deterministic response；

它仍然拥有 runtime authority，只是从“正向建议”换成了“负向禁止”。

因此三仓采用以下 canonical rule：

> **导航可以组织证据；旧模型可以提供假设；只有当前独立证据 authority 可以激活保护。分类本身既不能开处方，也不能下禁令。**

可以激活保护的 current authority 必须能指出来源，例如：

- Hard Safety；
- 当前直接 FACT / REPORT 及 provenance；
- action consent / coercion boundary；
- 其他明确声明、可复核的当前 evidence owner。

legacy stage/layer/V2/navigation output 可以保留 history、shadow、知识、问题或 hypothesis candidate；**它自己的 category / confidence / output 不能成为 guard trigger。**

## 5. Consumer-chain Merge Gate

今后任何“撤权 PR”都必须回答：

1. 旧模型是在**做决定之前被切断**，还是做完决定后只擦掉标签？
2. producer 把对象降成 `candidate / unknown / shadow` 后，consumer 有没有再次升级成事实、机制、行动、禁令或固定文案？
3. final filter 是否只是在擦输出，而上游早已选过知识、解释、动作或 referral？
4. guard 的触发证据来自当前独立 authority，还是来自 legacy classifier 自己的 category/confidence？
5. 一个真实家长提出“想了解专业支持”时，系统是在回应 intent，还是偷偷把它翻译成 severity？
6. Safety 中“直接阳性报告、后续否认、纯否认、家长推测”是否保留各自 provenance，而不是被一个 lexical regex 合并？

**PR 描述、变量名、`shadow-only`、`guard-only` 或 `runtimeAuthority=none` 标签都不是撤权证明。真实 consumer chain 和执行时序才是。**

## 6. 生产真实使用后的证据边界

Family-Space 已进入产品所有者真实使用，这改变了“是否存在真实使用”的事实，但没有改变证据纪律：

- 自动回归、红队、journey test 仍属于 synthetic/internal evidence；
- 产品所有者真实使用属于 real-use evidence，但不能自动推广到“其他家庭有效”；
- 未经单独授权，不把真实家庭内容拿去做测试 fixture、数据迁移、批量分析或 Foundation/MingOS 示例；
- 每次 production 写入仍必须有明确授权、可回滚版本与变更后健康核验；
- “已经部署过”不等于当前 revision、进程、证书、回滚点仍健康；
- 扩大到其他家长之前，必须重新确认 Safety、privacy、consent、data rights、rollback 与人工验收门。

## 7. 三个硬边界

### Foundation → MingOS

Foundation 规定原则和治理边界；MingOS 将 Accepted 要求转成可验证协议。MingOS 不把 Foundation Draft 当 Stable，也不因 Family 产品通过测试或真实使用就宣称 Foundation conformance。

### MingOS → Family-Space

MingOS 提供跨空间能力，不规定家庭固定回复方式、家庭画像字段、家庭阶段、Navigation 坐标、具体 memory UI 或澄清文案。已有 Context / Evidence / Intent / Authorization / Continuity 能表达的问题，优先通过组合和 authority subtraction 解决，不新建第二套 truth/state/router。

### Family-Space → 上层

家庭产品字段、prompt、profile、页面、revision facade、clarification gate、rights editor、Navigation 坐标和一次有效实现，不会因为进入 `production` 或真实使用就自动成为 MingOS object / Foundation principle。只有跨多个非家庭空间重复出现、现有 MingOS 语义确实表达不了的缺口，才形成 upstream candidate。

**产品实现不得自动升级为 MingOS Core primitive。**

## 8. 当前执行门

### 可执行

- 继续以 Family-Space `production` 为唯一施工基线；
- 继续收敛第一次进入、第一句回应、前三轮、第二次回来和理解修正的真实体验；
- 对 #204 先修 Safety false-negative，再讨论合并；
- 对 #205 先修真实 authority 文件，不以 PR 描述代替合同内容；
- 对 #200 / #196 / #192 继续沿 consumer chain 删除旧 authority；
- #197 / #198 / #195 保持静态通过状态，等待 executable CI 与最终 diff；
- #193 作为最后 epistemic defense，不承担上游分类器的决策责任；
- Foundation #17 继续接收当前事实证据，但通过既有治理流程决定是否需要任何上层变化。

### 禁止

- 未经 Review、基线同步和成功 CI 就合并 runtime 候选；
- 为了绿灯删除、弱化或绕过失败回归；
- 同一父母可见语义边界同时合并多个互相覆盖的 Draft PR；
- 把 legacy category/confidence 当成正向处方或负向 guard trigger；
- producer 降权后允许 consumer 再次升级 authority；
- 未经单独授权读取、导出、迁移真实家庭内容用于自动测试或上游样例；
- 把产品所有者一次或持续真实使用写成普遍疗效、规模化验证或 Foundation conformance；
- 再造第二套 memory API、pending clarification 表、Family Navigation state machine 或自动确认状态机。

## 9. 每个跨仓变更必须回答

- 改动属于原则、通用协议还是家庭产品？
- 它服务真实生命/产品循环的哪一环？
- 依据哪个 Accepted / Stable 文件、MingOS 协议或当前产品事实源？
- 这是 FACT、REPORT、INTERPRETATION、INFERENCE、UNKNOWN、CORRECTION 还是提案？
- provenance、authorization、correction / withdrawal 在哪里？
- 是否存在另一个 legacy module / open PR 正在决定同一语义边界？
- producer 降低 authority 后，consumer 有没有再次升级？
- guard 的触发证据来自当前独立 authority，还是 legacy classifier 自己？
- 旧模型是在做决定前被切断，还是做完决定后才擦标签？
- 这次是在减少隐藏 authority，还是又增加 classifier / state machine / router？
- 是否把“进入 production / 有真实使用”误写成“已成为通用权威 / 已证明普遍有效”？
- 是否会让使用者失去主体性、拒绝权、暂停权、纠正权、数据权利或现实中的安全支持？

答不清这些问题，变更只能停留在 Draft / pending。