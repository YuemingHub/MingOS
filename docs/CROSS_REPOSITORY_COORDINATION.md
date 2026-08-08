# MingOS 三仓协调契约

> 状态：Proposed coordination contract  
> 日期：2026-08-08  
> 维护位置：`YuemingHub/MingOS`  
> 适用范围：`mingos-foundation`、`MingOS`、`Family-Space`

本文件是三仓协作的导航、边界和执行状态入口。它不替代各仓事实源，也不把 Draft、开放 PR、产品字段、对话结论或 AI 判断自动提升为 Accepted 事实。

本次协调快照建立在 Family-Space PR #158 合并后。它记录的是本次核验时的远程事实，不授权部署、真实用户启动或 Foundation / MingOS 自动扩张。

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
- 当前 Accepted/Stable 权威仍按仓库 canonical state 判定；主干中的 Draft 不因 merge 自动成为稳定标准；
- 当前原则线继续支持：生命优先、主体性、解释可修正、证据/纠正/权利优先于系统确定性；
- 本次核验时开放 PR：0。

### MingOS

- 仓库：`YuemingHub/MingOS`；默认分支：`main`；
- 本次核验基线：`82e34718a111f71fd9cd793115624780e2bac0b9`；
- 已有跨空间核心对象仍是 Space / Actor / Context / Intent / Authorization / Task / Evidence / Handoff / Continuity Bundle；
- MingOS 不拥有 Family-Space 的产品合并权，也不把 Family-specific profile、memory revision UI 或家庭阶段字段变成通用协议；
- 当前无真实用户、无生产环境、无数据迁移；
- 本次核验时开放 PR：0。

### Family-Space

- 仓库：`YuemingHub/Family-Space`；默认分支：`production`；
- 本次核验主干：`081016ec672a3d2df7253f346393666cca72b234`（PR #158）；
- `CURRENT_PROJECT_STATUS.md` 仍是运行事实源：真实家长无、生产环境无、对外正式服务无；
- 当前已经形成合成数据支持的可见产品闭环：Today 直接开口 → Dialogue → action candidate 可选择/拒绝 → 第二次回来 → 我家 → 回望 → 我的；
- synthetic seeder、MVP pipeline、parent-real-journey 已存在，但这些只证明开发/合成验证，不等于真实家庭验收；
- Conversation V4 的认识论 shadow、前三轮关系质量门和 action-optional 约束仍在；普通路径不把行动当默认终点；
- PR #156 完成 evidence-first 家庭理解纠偏：家长可见家庭片段只从 scoped life record 或 confirmed private memory 投影；raw inference 与 legacy profile label 不自动成为家庭事实；
- PR #157 将 private memory 写入进一步收紧为 evidence-backed / provenance-backed：缺失或不可归一化来源时 fail-closed，结构化 provenance 在持久化前后保持可追溯；
- PR #158 将“家长修正系统记忆”从原地覆盖升级为真实 revision chain：新修正成为当前版本，旧版本变 `stale` 且 `ai_usable=0`；旧版本仍可追溯但不再参与当前 AI 理解；否认当前或旧版本 ID 时整条关联修订链都清除，并保留 `narrative_denied` 审计；
- 家长修正仍被记录为 report/correction evidence，不因家长改写就静默升级为 universal fact；
- PR #158 最新 head `ab17445a631ade7acee32f487d5ce10e92bc5d58` 的 Prelaunch Safety run `31259768376` 全绿；
- 本次核验时 Family-Space 开放 PR：0；旧 #153 / #154 已关闭，不再作为执行队列；
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
真实生活进入 → 区分事实/解释/未知 → 形成有来源的暂时理解
→ 用户自己选择/拒绝 → 回到生活 → 带回结果
→ 新证据可修正旧理解 → 旧理解退出当前 AI 上下文但保留历史
```

此前发现的主要偏移是旧 `FamilyProfile` 混合来源字符串重新进入家长可见 read model，可能把系统生成内容说成家庭事实；PR #156 已先收住可见层。PR #157 与 #158 继续把这一原则推进到底座：没有可归一化 evidence 的 private memory 不能进入受治理记忆；家长修正不会抹掉历史，而会形成可追溯的新版本并让旧理解退出当前 AI 使用。

这仍然是 Family-Space 的产品实现，不是 MingOS 新通用对象，也不是 Foundation 新标准。只有当“证据来源 + 人类修正权 + 版本替代 + 当前上下文失效”在多个非家庭空间重复成为同类问题时，才值得形成 MingOS 候选协议。

## 4. 权威顺序与冲突规则

1. Foundation `main` 中 Accepted/Stable 文件决定原则、伦理与治理约束；主干中的 Draft 仍只是 Draft。
2. MingOS `main` 决定已经合入的跨空间协议、Schema、验证器与连续性事实。
3. Family-Space `production` 与 `CURRENT_PROJECT_STATUS.md` 决定家庭产品实现边界与运行事实。
4. Draft、Proposed、Candidate、开放 PR、Issue、旧发布记录和对话只能作为提案、证据或历史来源。
5. 跨仓冲突必须保留原始来源，并通过具名、可撤回的 source-review 处理。
6. 产品中有效的 V4、evidence-first projection、memory revision chain 或 action lifecycle 只能作为上层学习证据，不能因为已经进入 `production` 就自动成为 MingOS Kernel 或 Foundation 规范。

## 5. 三个硬边界

### Foundation → MingOS

Foundation 规定原则和判定边界；MingOS 将已接受要求转为协议。MingOS 可以精确引用 Draft Kernel 概念，但不得把它们写成稳定标准或 conformance。

### MingOS → Family-Space

MingOS 提供跨空间能力，不规定家庭领域的固定回应方式、家庭画像字段、家庭阶段、页面信息架构或具体记忆版本 UI。Family-Space 可保留家庭情境解释与表达灵活性，但生命安全、隐私、授权、证据来源、纠正/撤回和主体性不得被软化。

### Family-Space → 上层

家庭产品字段、提示词、profile、页面、revision facade 和一次有效做法不会因为存在或通过测试就自动成为 MingOS 对象或 Foundation 原则。必须先证明它是跨空间问题，再通过证据、抽象和治理复核。

## 6. 当前执行与最终门

### 当前可执行

- 保持当前可见闭环、evidence-first 和 revision-chain 边界稳定，不为“页面更满”重新引入无来源画像；
- 下一产品步优先验证“现实新信息与当前理解冲突时，系统能发现冲突并邀请家长澄清/修正”，而不是让 AI 自动判断旧理解错误；
- 冲突检测只能提出可解释的“这里似乎和之前不一样”，必须允许家长回答“没有矛盾 / 你理解错了 / 情况变了 / 我不想处理”；
- 继续用 synthetic / internal 场景验证，不把这些结果包装成真实家庭成效；
- 将 Family-Space 中反复出现、且明显跨空间的 evidence / revision / authorization 问题整理为 MingOS 候选；
- Foundation 主干变化时重新核对 `FOUNDATION_DEPENDENCY.md`。

### 当前禁止

- 未经 Review、基线同步和成功 CI 就合并任何候选；
- 触碰服务器、PM2、Nginx、cron、环境变量、密钥、真实数据或 `ymai.me`；
- 把 legacy FamilyProfile、Family-specific 字段、revision facade 或一次有效做法表述为通用合规结论；
- 为了页面“有内容”而用没有 provenance / confirmation / contestability 的系统字符串填补家庭事实；
- 让 AI 在没有家长确认的情况下自动合并、覆盖或判定互相冲突的家庭理解；
- 把当前 synthetic journey 测试表述为真实家庭验证；
- 因当前方向一致就自行解释为“产品已完成”或“可以进入生产”。

### 当前顺序

1. 保持 Family-Space 当前可见闭环、evidence-backed memory 与 revision-chain 单一事实稳定；
2. 在最新 `production` 上做最小 conflict-detection / clarification 候选，只负责发现与邀请修正，不负责自动裁决；
3. 证明冲突提示不会把普通变化、不同语境或家长不同表述误判成“系统纠错任务”；
4. Family-Space 中跨场景重复成立的证据与修正问题，再形成 MingOS 协议提案；
5. Foundation 仅复核真正上升到原则、权利、安全或治理层的问题；
6. 在真实家庭重新进入之前，重新建立独立的安全、隐私、同意、发布和人工验收门。

## 7. 每个跨仓变更必须回答

- 改动属于原则、通用协议还是家庭产品？
- 它直接服务哪一段真实生命/产品循环？
- 依据哪个 Accepted/Stable 文件、MingOS 协议或当前产品事实源？
- 这是事实、报告、推断、提案、未知还是已被修正的理解？
- provenance、evidence、authorization、correction / withdrawal 在哪里？
- 旧理解被新证据替代后，是否真的退出当前 AI 上下文，同时仍保留必要的历史可追溯性？
- 是否把“已合入主干”误写成“已成为稳定权威”？
- 是否会让使用者失去主体性、拒绝权、暂停权、纠正权、数据权利或现实中的安全支持？

如果这些问题不能回答，变更只能停留在 Draft 或 pending。
