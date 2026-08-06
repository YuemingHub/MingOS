# MingOS 三仓协调契约

> 状态：Proposed coordination contract  
> 日期：2026-08-06  
> 维护位置：`YuemingHub/MingOS`  
> 适用范围：`mingos-foundation`、`MingOS`、`Family-Space`

本文件是三仓协作的导航与边界文件，不是新的最高原则，也不替代任何仓库的事实源。它不能把 Draft、Proposed、开放 PR、对话结论或 AI 判断提升为 Accepted 事实。

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
- 当前主干提交：[`280a687`](https://github.com/YuemingHub/mingos-foundation/commit/280a68705d13bbb5beed3a64713575fad7cba189)
- 可见性：public
- 当前接受状态文件 [GOV-0001](https://github.com/YuemingHub/mingos-foundation/blob/main/governance/status/GOV-0001-current-canonical-state.md) 与 README 仍将旧路径 `YuemingHub/Ming-Foundation` 写作 canonical public repository。
- 开放 Draft PR：[\#12](https://github.com/YuemingHub/mingos-foundation/pull/12)。其 Kernel 文档仍为 Draft，不产生当前 conformance claim。

因此，“当前操作仓库名称”和“Foundation 已接受文件中的 canonical 名称”存在冲突。该冲突已进入 MingOS source-review，不在本文件中预先裁决。

### MingOS

- 仓库：`YuemingHub/MingOS`
- 默认分支：`main`
- 当前主干提交：[`ec73647`](https://github.com/YuemingHub/MingOS/commit/ec73647f55055676deb2fb2367ec15c97782d17e)
- 当前主干已合并 source authority / freshness / conflict reporting；真实 source-review 协议正在 [PR \#15](https://github.com/YuemingHub/MingOS/pull/15) 中等待人类决定门。
- 当前无真实用户、无生产环境、无数据迁移。
- 当前不建设联网导入器、通用 UI、模型网关、自动迁移或通用 Agent 平台，直到 pending source-review 完成具名复核。

### Family-Space

- 仓库：`YuemingHub/Family-Space`
- 默认分支：`production`
- 当前主干提交：[`4e77e24`](https://github.com/YuemingHub/Family-Space/commit/4e77e245bf4dfa49249e53a258e9ed575c428a41)
- 私有仓库。
- [CURRENT_PROJECT_STATUS.md](https://github.com/YuemingHub/Family-Space/blob/production/CURRENT_PROJECT_STATUS.md) 是“当前是否存在真实用户与生产运行”的唯一事实源：真实家长无、生产环境无、对外正式服务无。
- 旧发布、服务器与 NO-GO 文档保留为历史证据，不能被解释为当前生产事实。
- [PR \#116](https://github.com/YuemingHub/Family-Space/pull/116) 仍为 Draft，且以较早的 `7fe67ff` 为 base；它不能在未重新对齐当前 `production` 与当前状态文件前直接合并或部署。
- 其他旧 Draft PR 必须逐个判断是否仍适用，禁止批量合并。

## 3. 权威顺序与冲突规则

1. Foundation 的 Accepted/Stable 文件决定原则、伦理与治理约束。
2. MingOS `main` 决定已合并的跨空间协议、Schema、验证器与内核行为。
3. Family-Space `production` 与 `CURRENT_PROJECT_STATUS.md` 决定家庭产品的当前实现边界与项目运行事实。
4. Draft、Proposed、Candidate、开放 PR、Issue、旧发布记录和对话内容只能作为提案、证据或历史来源。
5. 任何跨仓冲突必须保留原始来源，并通过具名、可撤回的 source-review 处理；不能由 Agent 以“继续开发授权”代替事实选择。

## 4. 三个硬边界

### Foundation → MingOS

Foundation 规定“为什么必须这样做”和“如何判定合规”；MingOS 把已接受的要求转化为可验证协议。MingOS 不得把尚未接受的 Foundation 草案写成稳定标准。

### MingOS → Family-Space

MingOS 提供跨空间能力和协议，不规定家庭领域的具体回应方式。Family-Space 可以按家庭场景保留灵活的理解、转译、行动和人工协作逻辑，但必须遵守已接受的安全、主体性、隐私、可撤回和证据边界。

### Family-Space → 上层

家庭产品中的字段、提示词、流程或一次有效的产品做法，不会因为已经存在就成为 MingOS 通用对象，更不会自动成为 Foundation 原则。只有经过跨仓审查、抽象和相应治理流程，才可形成上层提案。

## 5. 当前人类决定门

MingOS [PR \#15](https://github.com/YuemingHub/MingOS/pull/15) 中保留以下三个 pending 请求：

1. Family-Space 产品仓的当前事实；
2. Foundation 仓库名称；
3. MingOS 规范入口仓。

每份请求只能由具名 active human 选择：

- `accept-value`
- `preserve-history`
- `unresolved`
- `request-evidence`

在决定提交前，`decision`、`selected_value_ref`、`rationale`、`decided_at` 必须保持为空。一般工程推进授权不等于已经作出上述任何事实选择。

## 6. 执行队列

### 当前可以继续做

- 维护本协调契约和去身份化状态入口；
- 对三个仓库进行只读核验、差异分析、测试设计和 Draft PR 准备；
- 在不改变事实选择的前提下修复明显的引用、结构和验证问题；
- 将 Family-Space 的合成反例与失败证据整理为 MingOS 可审阅的输入。

### 当前不能自动做

- 替月明提交三份 source-review 决定；
- 直接合并 PR \#12、PR \#15 或 PR \#116；
- 把旧发布记录恢复为当前生产事实；
- 触碰服务器、PM2、Nginx、cron、环境变量、密钥、真实数据或 `ymai.me`；
- 因为某个家庭字段或提示词有效，就把它提升为通用内核或最高原则。

### 下一轮顺序

1. 完成人类 source-review 决定，或明确选择保持 unresolved/request-evidence；
2. 依据决定分别更新 Foundation、MingOS 和 Family-Space 的引用与状态入口；
3. 以当前各自默认分支为基线逐个重审开放 Draft PR，先处理重复、过期和基线漂移；
4. 只有在产品闭环、自动验证与人工安全门均闭合后，才讨论真实用户或生产放行。

## 7. 每个跨仓变更必须回答

- 改动属于原则、通用协议还是家庭产品？
- 依据哪个已接受文件或当前事实源？
- 是否改变另一仓库的边界或采用版本？
- 原始来源、commit、测试和人工门在哪里？
- 这是事实、推断、提案、历史记录还是未解决冲突？
- 是否会让用户失去主体性、撤回权、数据权利或现实中的安全支持？

如果这些问题不能被回答，变更只能停留在 Draft 或 pending，不得伪装成完成。
