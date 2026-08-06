# MingOS 三仓协调契约

> 状态：Proposed coordination contract  
> 日期：2026-08-06  
> 维护位置：`YuemingHub/MingOS`  
> 适用范围：`mingos-foundation`、`MingOS`、`Family-Space`

本文件是三仓协作的导航、边界和执行状态入口。它不是新的最高原则，不替代任何仓库的事实源，也不把 Draft、Proposed、开放 PR、对话结论或 AI 判断自动提升为 Accepted 事实。

## 1. 三层关系

| 层级 | 仓库 | 负责什么 | 不负责什么 |
|---|---|---|---|
| 原则与治理层 | `YuemingHub/mingos-foundation` | 生命宪章、MingOS 宪章、伦理边界、治理流程、规范与合规判定标准 | 不承载家庭业务代码、家长档案、生产运行或产品界面 |
| 通用内核与协议层 | `YuemingHub/MingOS` | Space、Actor、Context、Intent、Authorization、Task、Evidence、Handoff、Continuity Bundle 等跨空间协议、Schema、验证器与参考运行方式 | 不吸收家庭画像、家长回复、家庭阶段或其他垂直业务字段 |
| 家庭垂直产品层 | `YuemingHub/Family-Space` | 家庭事件、家庭理解、家长回复、安全门、行动反馈、家庭档案与专业协作 | 不把家庭领域对象上升为 MingOS 通用对象，不代表 MingOS 总系统 |

正向约束关系：

```text
Foundation 中已接受的原则与标准
        ↓
MingOS 中可验证的跨空间协议与内核
        ↓
Family-Space 中真实的家庭产品闭环
```

反向学习关系：

```text
Family-Space 的合成验证、失败、反例与真实证据
        ↓
MingOS 的协议修正候选
        ↓
Foundation 的原则与标准复核
```

反向材料只能成为证据或提案，不能自动修改上层标准。

## 2. 当前远程事实（2026-08-06）

### Foundation

- 仓库：`YuemingHub/mingos-foundation`
- 默认分支：`main`
- 当前主干：[`280a687`](https://github.com/YuemingHub/mingos-foundation/commit/280a68705d13bbb5beed3a64713575fad7cba189)
- 当前仓库身份已由用户在三仓 source-review 中接受为 `YuemingHub/mingos-foundation`；`YuemingHub/Ming-Foundation` 只作为历史标识保留。
- 引用清理在 Draft [Foundation PR #15](https://github.com/YuemingHub/mingos-foundation/pull/15) 中，尚未合并。
- [Foundation PR #12](https://github.com/YuemingHub/mingos-foundation/pull/12) 仍开放；Kernel 文档保持 Draft，不产生当前 conformance claim。

因此，当前“用户已接受的仓库身份”与“Foundation main 已合入的文档状态”必须分开记录：前者是已确认的协调事实，后者仍等待 Draft PR 审查和合并。

### MingOS

- 仓库：`YuemingHub/MingOS`
- 默认分支：`main`
- 当前主干：[`979a0e3`](https://github.com/YuemingHub/MingOS/commit/979a0e32f1e4c760f7e339f4b503bba44edfbbb0)
- 当前主干状态是 M5 source-review protocol complete / human decision gate：3 份 source-review 仍为 `pending`，已提交决定为 0。
- [MingOS PR #17](https://github.com/YuemingHub/MingOS/pull/17) 从当前 `main` 记录了用户已提交的 3 份 `accept-value` 决定，目前仍为 Draft，尚未改变 `main`。
- [MingOS PR #16](https://github.com/YuemingHub/MingOS/pull/16) 基于旧的 `ec73647`，相对当前 `main` 落后 1 个提交；其协调契约正在当前基线上重建，不直接作为合并候选。
- 当前无真实用户、无生产环境、无数据迁移。
- 来源决定的提交不代表生产放行，也不自动批准联网导入器、通用 UI、模型网关、自动迁移或通用 Agent 平台。

### Family-Space

- 仓库：`YuemingHub/Family-Space`
- 默认分支：`production`
- 当前主干：[`4e77e24`](https://github.com/YuemingHub/Family-Space/commit/4e77e245bf4dfa49249e53a258e9ed575c428a41)
- [CURRENT_PROJECT_STATUS.md](https://github.com/YuemingHub/Family-Space/blob/production/CURRENT_PROJECT_STATUS.md) 是“当前是否存在真实用户与生产运行”的唯一事实源：真实家长无、生产环境无、对外正式服务无。
- [Family-Space PR #119](https://github.com/YuemingHub/Family-Space/pull/119) 固定了开放 Draft PR 基线审计，尚未合并。
- [Family-Space PR #120](https://github.com/YuemingHub/Family-Space/pull/120) 从当前 `production` 重建了登录会话兜底的最小修复，尚未合并。
- [Family-Space PR #116](https://github.com/YuemingHub/Family-Space/pull/116) 仍以较早基线承载大范围系统健康变更，不能直接合并或部署。
- 旧发布、服务器与 NO-GO 文档保留为历史证据，不能被解释为当前生产事实。

## 3. 权威顺序与冲突规则

1. Foundation 中已 Accepted/Stable 的文件决定原则、伦理与治理约束。
2. MingOS `main` 决定已经合入的跨空间协议、Schema、验证器与内核行为。
3. Family-Space `production` 与 `CURRENT_PROJECT_STATUS.md` 决定家庭产品的当前实现边界与项目运行事实。
4. Draft、Proposed、Candidate、开放 PR、Issue、旧发布记录和对话内容只能作为提案、证据或历史来源，不能冒充当前主干事实。
5. 跨仓冲突必须保留原始来源，并通过具名、可撤回的 source-review 处理；不能用“继续开发授权”代替具体事实选择。

## 4. 三个硬边界

### Foundation → MingOS

Foundation 规定“为什么必须这样做”和“如何判定合规”；MingOS 把已接受的要求转化为可验证协议。MingOS 不得把尚未接受的 Foundation 草案写成稳定标准。

### MingOS → Family-Space

MingOS 提供跨空间能力和协议，不规定家庭领域的具体回应方式。Family-Space 可以按家庭场景保留灵活的理解、转译、行动和人工协作逻辑，但必须遵守已接受的安全、主体性、隐私、可撤回和证据边界。

### Family-Space → 上层

家庭产品中的字段、提示词、流程或一次有效的产品做法，不会因为已经存在就成为 MingOS 通用对象，更不会自动成为 Foundation 原则。只有经过跨仓审查、抽象和相应治理流程，才可形成上层提案。

## 5. 已确认但尚未全部入主干的三项事实决定

2026-08-06，用户对三个 source-review 分别明确接受：

| 议题 | 当前接受值 | 历史保留 | 仓库落地状态 |
|---|---|---|---|
| Family-Space 产品仓 | `YuemingHub/Family-Space` | `YuemingHub/Ming-os` | MingOS PR #17 Draft |
| Foundation 仓库 | `YuemingHub/mingos-foundation` | `YuemingHub/Ming-Foundation` | MingOS PR #17 Draft；Foundation PR #15 Draft |
| MingOS 规范入口仓 | `YuemingHub/MingOS` | `YuemingHub/mingos-unified` | MingOS PR #17 Draft |

三项决定均可撤回；原始冲突报告、候选值和历史来源继续保留。它们只更新事实基线，不代表生产放行、真实用户启动或平台扩建自动获批。

在 [MingOS PR #17](https://github.com/YuemingHub/MingOS/pull/17) 合并前，MingOS `main` 中的 source-review 示例仍应按“3 pending / 0 submitted”理解；任何 Agent 不得因为 Draft 分支内容存在，就把它说成已合入主干。

## 6. 当前执行队列

### 可继续执行

- 继续验证 Foundation #15、MingOS #17、当前协调契约 Draft 和 Family-Space #119、#120 的 CI 与文档一致性；
- 以各仓库最新默认分支逐个重审旧 Draft PR，先处理重复、过期和基线漂移；
- 在 Family-Space 当前基线上重建仍有证据支持的最小修复；
- 将家庭空间中的合成反例、失败和未知整理为 MingOS 可审阅输入，而不自动提升为通用内核。

### 不可自动执行

- 直接合并 Foundation #12、Foundation #15、MingOS #16/#17、Family-Space #116/#119/#120；
- 把旧发布记录恢复为当前生产事实；
- 触碰服务器、PM2、Nginx、cron、环境变量、密钥、真实数据或 `ymai.me`；
- 因为某个家庭字段、提示词或产品做法有效，就把它提升为通用内核或最高原则。

### 顺序

1. 让四个当前 Draft（Foundation #15、MingOS #17、当前协调契约、Family-Space #119/#120）完成远程验证；
2. 复核 Foundation #15 与 MingOS source-review 决定记录之间的引用一致性；
3. 继续处理 Family-Space 旧 Draft：登录缺口已重建为 #120；随后重跑依赖安全审计并检查运行产物是否仍被当前基线跟踪；
4. 对大范围 #116 和过期 #107 保留证据，不直接合入；
5. 在产品闭环、自动验证与人工安全门均闭合前，不讨论真实用户或生产放行。

## 7. 每个跨仓变更必须回答

- 改动属于原则、通用协议还是家庭产品？
- 依据哪个已接受文件或当前事实源？
- 是否改变另一仓库的边界或采用版本？
- 原始来源、commit、测试和人工门在哪里？
- 这是事实、推断、提案、历史记录还是未解决冲突？
- 是否会让用户失去主体性、撤回权、数据权利或现实中的安全支持？

如果这些问题不能被回答，变更只能停留在 Draft 或 pending，不得伪装成完成。
