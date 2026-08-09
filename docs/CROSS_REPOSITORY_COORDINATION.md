# MingOS 三仓协调契约

> 状态：Proposed coordination contract  
> 日期：2026-08-08  
> 维护位置：`YuemingHub/MingOS`  
> 适用范围：`mingos-foundation`、`MingOS`、`Family-Space`

本文件是三仓协作的导航、边界和执行状态入口。它不替代各仓事实源，也不把 Draft、开放 PR、产品字段、对话结论或 AI 判断自动提升为 Accepted 事实。

本次协调快照建立在 Family-Space PR #165 合并后。它记录的是本次核验时的远程事实，不授权部署、真实用户启动或 Foundation / MingOS 自动扩张。

## 1. 三层关系

| 层级 | 仓库 | 负责什么 | 不负责什么 |
|---|---|---|---|
| 原则与治理层 | `YuemingHub/mingos-foundation` | 生命宪章、MingOS 宪章、伦理边界、治理流程、标准与合规判定 | 家庭业务代码、家长档案、生产运行与产品界面 |
| 通用内核与协议层 | `YuemingHub/MingOS` | Space、Actor、Context、Intent、Authorization、Task、Evidence、Handoff、Continuity Bundle 等跨空间协议、Schema 与验证器 | 家庭画像、家长回复、家庭阶段等垂直字段 |
| 家庭垂直产品层 | `YuemingHub/Family-Space` | 家庭真实生活、理解与转译、家长回复、安全门、可拒绝行动、生活反馈、家庭回望、可修正记忆与数据权利 | MingOS 通用对象和 Foundation 原则的自动定义权 |

正向约束：Foundation 已接受的原则与标准 → MingOS 可验证协议 → Family-Space 产品闭环。

反向学习：Family-Space 的验证、失败、反例与未知 → MingOS 协议候选 → Foundation 复核。反向材料只能成为证据或提案，不因产品有效而自动升级。

## 2. 当前远程事实

### Foundation

- 仓库：`YuemingHub/mingos-foundation`；默认分支：`main`；
- 本次核验主干：`7eb33ffc806db1da2fde488a617860ca34b76c0e`；
- Accepted/Stable 权威仍按仓库 canonical state 判定；主干中的 Draft 不因 merge 自动成为稳定标准；
- 当前原则线继续支持：生命优先、主体性、解释可修正、证据/纠正/权利优先于系统确定性；
- 本次核验时开放 PR：0（verified GitHub state）。

### MingOS

- 仓库：`YuemingHub/MingOS`；默认分支：`main`；
- 本次核验基线：`7f73f9fb6061f438384ece5a7c8394120f939dc9`（PR #26 merge commit）；PR #25 仍基于 PR #24，当前为不可合并的 Draft；
- 已有跨空间核心对象仍是 Space / Actor / Context / Intent / Authorization / Task / Evidence / Handoff / Continuity Bundle；
- MingOS 不拥有 Family-Space 的产品合并权，也不把 Family-specific profile、memory revision UI、clarification gate、Family rights editor 或家庭阶段字段变成通用协议；
- 当前无真实用户、无生产环境、无数据迁移；
- 本次核验时开放 MingOS PR：#25（OPEN / DRAFT / NOT ACCEPTED；Codex B active audit）与 #27（OPEN / DRAFT / NOT ACCEPTED；focused CRLF snapshot infrastructure fix，不是 coordination/Core semantic candidate）；PR #26 已 CLOSED / MERGED（overlapping coordination refresh；外部合并，不等同于 Core semantic acceptance）；

### Family-Space

- 仓库：`YuemingHub/Family-Space`；默认分支：`production`；
- 本次核验主干：`1e70c5933675db1591edb7dc3f3c63159e6240c5`（PR #165）；
- `CURRENT_PROJECT_STATUS.md` 仍是运行事实源：真实家长无、生产环境无、对外正式服务无；
- Conversation V4 已存在；当前是守住 Context Ledger / Life Translator / Response Posture / action-optional 边界，不再把“建立 V4”当未来任务；
- PR #156：家长可见家庭理解 evidence-first，raw inference 与 legacy profile label 不自动成为家庭事实；
- PR #157：private memory 必须 evidence-backed / provenance-backed，缺失或不可归一化来源时 fail-closed；
- PR #158：家长修正形成 revision chain；新版本成为当前版本，旧版本 `stale` 且 `ai_usable=0`，否认可清除关联修订链；
- PR #159：Family-only memory clarification gate 保守识别明确纠正/变化；普通好转、普通对比、家庭成员意见不同不会被包装成系统冲突；`situation_changed` 不等于“之前理解错了”；澄清本身 read-only，安全门优先，澄清前不继续沿旧理解给 action/method；
- PR #160 将 #158 与 #159 串成跨模块回归：clarification 零写入 → 家长主动走既有数据权利入口 correction → revision chain 生成新版本 → 旧版本退出 AI context → 下一轮 AI 只看到家长修正后的当前版本；
- PR #164：建立前三轮 runtime 验证的 development/synthetic/internal evidence；不代表真实 LLM 质量、真实家庭或生产放行；
- PR #165：补充 real-model journey harness 与 synthetic transcripts；仍属于 development/synthetic/internal evidence，不把产品行为提升为 MingOS 新协议；
- PR #160 同时把 `CURRENT_STATE.md` / `CURRENT_PROJECT_STATUS.md` 从“V4/修正链仍待建设”的旧执行语义更新到当前事实；
- PR #160 最新 head `49aabad4f5c3fe732659e51f3dac3c4283396b39` 的 Prelaunch Safety run `31262209996` 全绿；
- 本次核验时开放 Family candidates：#166（OPEN / DRAFT / NOT ACCEPTED）、#168（OPEN / CANDIDATE / NOT ACCEPTED）、#169（OPEN / DRAFT / NOT ACCEPTED）；均为 Family product candidates，不是 MingOS Core evidence；
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
真实生活进入 → 区分事实/解释/未知 → 有来源的暂时理解
→ 新现实可能挑战旧理解 → 系统先澄清，不自动判真、不自动写
→ 家长如果愿意修正，只走现有数据权利入口
→ revision chain 产生新的当前版本
→ 旧版本退出当前 AI 上下文但保留必要历史
→ 下一轮只使用新的当前版本
```

PR #160 证明了一个重要产品判断：**不需要为了“澄清之后怎么办”再造 pending clarification 表、第二套 memory API 或自动确认状态机。** Family-Space 已经有两条职责清晰的能力：对话层负责承认不确定并邀请澄清；“我的 → 系统记下的内容”负责家长主动修正；revision chain 负责版本替代。

因此“显式确认桥”不再被定义为一个必须新增的系统对象。若真实家长使用证明从对话到“我的”存在明显寻找成本，Family-Space 可以补一个轻量导航 affordance；但它仍只能导航到既有权利入口，不能把自由文本或按钮选择自动翻译成记忆改写。

这仍然是 Family-Space 产品实现和验证结果，不是 MingOS 新通用对象，也不是 Foundation 新标准。只有当“证据来源 + 人类修正权 + 澄清优先 + 版本替代 + 当前上下文失效”在多个非家庭空间重复成为同类问题时，才值得形成 MingOS 候选协议。

## 4. 权威顺序与冲突规则

1. Foundation `main` 中 Accepted/Stable 文件决定原则、伦理与治理约束；主干中的 Draft 仍只是 Draft。
2. MingOS `main` 决定已经合入的跨空间协议、Schema、验证器与连续性事实。
3. Family-Space `production`、`CURRENT_PROJECT_STATUS.md` 与 Family 产品合同决定家庭产品实现边界与运行事实。
4. Draft、Proposed、Candidate、开放 PR、Issue、旧发布记录和对话只能作为提案、证据或历史来源。
5. 跨仓冲突必须保留原始来源，并通过具名、可撤回的 source-review 处理。
6. 产品中有效的 V4、evidence-first projection、memory revision chain、clarification gate、rights editor 或 action lifecycle 只能作为上层学习证据，不能因为已经进入 `production` 就自动成为 MingOS Kernel 或 Foundation 规范。

## 5. 三个硬边界

### Foundation → MingOS

Foundation 规定原则和判定边界；MingOS 将已接受要求转为协议。MingOS 可以精确引用 Draft Kernel 概念，但不得把它们写成稳定标准或 conformance。

### MingOS → Family-Space

MingOS 提供跨空间能力，不规定家庭领域的固定回应方式、家庭画像字段、家庭阶段、页面信息架构、具体记忆版本 UI 或澄清文案。Family-Space 可保留家庭情境解释与表达灵活性，但生命安全、隐私、授权、证据来源、纠正/撤回和主体性不得被软化。

### Family-Space → 上层

家庭产品字段、提示词、profile、页面、revision facade、clarification gate、rights editor 和一次有效做法不会因为存在或通过测试就自动成为 MingOS 对象或 Foundation 原则。必须先证明它是跨空间问题，再通过证据、抽象和治理复核。

## 6. 当前执行与最终门

### 当前可执行

- 保持 Family-Space 当前可见闭环、evidence-first、revision-chain 与 clarification-first 边界稳定；
- Family 下一产品优先级回到“第一次进入 → 第一句话 → 前三轮 → 第二次回来”，并验证家长想纠正系统理解时能否自然找到现有权利入口；
- 如果真实使用证明纠正入口寻找成本高，只补轻量导航，不新增 pending clarification 状态、不新增 memory write API、不让 AI 代替家长决定哪一种解释；
- 继续用 synthetic / internal 场景验证，不把这些结果包装成真实家庭成效；
- 将 Family-Space 中跨场景重复成立、且明显跨空间的 evidence / revision / authorization 问题整理为 MingOS 候选；
- Foundation 主干变化时重新核对依赖。

### 当前禁止

- 未经 Review、基线同步和成功 CI 就合并任何候选；
- 触碰服务器、PM2、Nginx、cron、环境变量、密钥、真实数据或 `ymai.me`；
- 把 legacy FamilyProfile、Family-specific 字段、revision facade、clarification gate、rights editor 或一次有效做法表述为通用合规结论；
- 为了页面“有内容”而用没有 provenance / confirmation / contestability 的系统字符串填补家庭事实；
- 让 AI 在没有家长确认的情况下自动合并、覆盖、失效或判定互相冲突的家庭理解；
- 把“情况变了”自动重写成“之前谁理解错了”；
- 再造第二套 memory API、pending clarification 表或自动确认状态机来替代现有数据权利入口；
- 把当前 synthetic journey 测试表述为真实家庭验证；
- 因当前方向一致就自行解释为“产品已完成”或“可以进入生产”。

### 当前顺序

1. 保持 Family-Space 当前可修正理解闭环为单一事实，不重新拆成多套状态机；
2. 回到第一次进入、前三轮、第二次回来做真实家长体验收敛；
3. 评估“我想纠正系统理解”是否能自然走到“我的 → 系统记下的内容”；只有真实阻力出现时才补导航；
4. 继续证明“先不处理”“两个都成立”“情况后来变了”不会触发隐式失效或覆盖；
5. Family-Space 中跨场景重复成立的证据与修正问题，再形成 MingOS 协议提案；
6. Foundation 仅复核真正上升到原则、权利、安全或治理层的问题；
7. 在真实家庭重新进入之前，重新建立独立的安全、隐私、同意、发布和人工验收门。

## 7. 每个跨仓变更必须回答

- 改动属于原则、通用协议还是家庭产品？
- 它直接服务哪一段真实生命/产品循环？
- 依据哪个 Accepted/Stable 文件、MingOS 协议或当前产品事实源？
- 这是事实、报告、推断、提案、未知还是已被修正的理解？
- provenance、evidence、authorization、correction / withdrawal 在哪里？
- 系统发现“可能不一致”时，是在邀请人澄清，还是已经越权替人判真？
- 家长不采取任何修正动作时，系统是否保持零自动写入？
- 旧理解被新证据替代后，是否真的退出当前 AI 上下文，同时仍保留必要的历史可追溯性？
- 是否把“已合入主干”误写成“已成为稳定权威”？
- 是否会让使用者失去主体性、拒绝权、暂停权、纠正权、数据权利或现实中的安全支持？

如果这些问题不能回答，变更只能停留在 Draft 或 pending。
