# MingOS Agent 工作契约

所有 AI Agent、自动化工具和人类开发者进入本仓库后，按以下顺序工作。

## 开始前

1. 读取 `COMPASS.md`，先确认本仓库的北极星、三仓边界、authority class 与 anti-drift 规则；
2. 读取 `docs/CURRENT_STATE.md`，并检查其中的移动事实是否已经过期；
3. 若任务涉及终局、三仓关系或抽象边界，再读 `docs/END_STATE.md`、`docs/CROSS_REPOSITORY_COORDINATION.md` 与 `docs/FOUNDATION_DEPENDENCY.md`；
4. 读取对应任务的 Intent Contract / Issue / PR 与直接相关代码；
5. 明确允许修改的文件、禁止触碰的边界和完成证据；
6. 不从 Family-Space 复制领域逻辑来填充 MingOS 内核。

`COMPASS.md` 是运行方向和防漂移入口，不替代 Foundation 的正式权威，也不自动把任何 Draft / Proposed / Candidate 提升为 Accepted / Stable。

## 每轮执行

```text
读取事实
→ 分类 hard_invariant / adaptive_default / product_owned_choice
→ 核对意图与边界
→ 判断是缺能力还是旧 authority 未退出
→ 选择最小工作单元
→ 执行
→ 检查真实 consumer chain
→ 验证
→ 保存证据
→ 更新状态
→ 写明 UNKNOWN / 下一步
```

## 硬约束

- 不把推断写成事实；
- 不把生成物写成已交付；
- 不用“看起来正确”替代自动验证或人工确认；
- 不静默扩大 Agent 权限；
- 不把特定模型、MCP 或数据库实现固化为内核语义；
- 不在跨空间协议中加入 Family、Personal、Professional 或 Team 的专属业务字段；
- 不因为 Family-Space 中某个字段、页面、Prompt、Router、Stage、Layer、Profile 或一次成功实现存在，就把它升级为 MingOS Core primitive；
- 不把 Foundation 的普通建议误写成 hard invariant；
- ordinary interaction 必须保留 `no action` 的合法性，除非当前独立 Safety authority 明确拥有保护性动作要求；
- legacy/model/category output 不能仅凭自身分类结果开处方或下禁令；
- `shadow`、`guard-only`、`candidate` 等名称不能替代真实 consumer-chain 审计；
- 移动中的 Family-Space PR / branch / 临时阶段可以作为某次审计 evidence，不得被当成长期 runtime authority；
- 不直接修改 `main`，除非是空仓初始化或仓库维护者明确批准；
- 任何完成状态必须引用 Evidence 对象。

## 新抽象进入 Core 的门槛

新增 Core object / schema family / Gate / Router / Agent layer / classifier / state machine 前，必须回答：

1. 这是一个真正的跨空间语义问题，还是 Family-Space 的产品实现？
2. 当前已有 MingOS primitive 是否真的无法表达？
3. 哪个可复现 evidence 证明它需要被上提？
4. 新结构是在增加能力，还是仅增加系统 authority？
5. 什么 counterexample 会证明这个抽象不成立？

不能回答时，默认：reuse-before-build、authority subtraction、product-owned choice 或 UNKNOWN。

## 三仓关系

```text
mingos-foundation
    ↓ hard boundaries

MingOS
    ↓ reusable cross-space semantics

Family-Space / future Life Spaces
    ↓ product-owned implementation

real life
    ↑ evidence / failure / correction / counterexample / unknown
```

产品证据可以形成 MingOS candidate，但不能自动升级。

MingOS candidate 只有在跨空间需求被证明且现有 primitive 不足时才进入 Core。

## 交付格式

每次结束至少留下：

- 修改清单；
- 本次 authority 分类；
- 当前 evidence 与来源；
- 验证命令与结果；
- 真实 consumer-chain 影响；
- 是否新增了 Core primitive，以及为什么不可用已有能力替代；
- 未完成项、UNKNOWN 和阻断；
- 可供下一个 Agent 继续的 handoff。
