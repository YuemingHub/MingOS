---
title: MingOS Adoption Authority Contract
status: Proposed
version: 0.1.0
owner: MingOS Architecture
updated: 2026-08-17
related:
  - MingOS Issue #33
  - Foundation Issue #14
  - Foundation ADR-0029
  - Foundation AUTHORITY_MANIFEST.json
  - Foundation REF-0052
---

# MingOS Adoption Authority Contract

> 状态：MingOS 侧 Proposed adoption contract。它不提升、修改或替代 `YuemingHub/mingos-foundation` 中的任何文件，也不声称 Foundation conformance、certification 或 production authorization。

## 1. Canonical bridge rule

```text
Foundation defines what must never be violated.
MingOS defines how authority, evidence, context, memory, correction and action semantics travel across spaces.
Products decide how to help within those boundaries.
```

MingOS 采用 Foundation 边界时表达的是“我采用了什么、以什么状态采用”，不是复制 Foundation 的 truth source，也不制造第二套权威。

## 2. Authority classes

每个跨空间语义项必须属于且只属于一个 authority class：

| Class | Owner | Binding | 典型内容 |
|---|---|---|---|
| `hard_invariant` | Foundation | 仅当其 trigger / evidence 出现时生效 | 生命安全、隐私、同意、强迫、第三方权利、纠正权、可逆性、证据完整性、人类最终主体性、无类别处方 |
| `adaptive_default` | MingOS | 指导但不规定产品结果；普通互动的合法结果允许 `no action` | understanding before advice、FACT/REPORT/…分离、新证据修正旧理解、optional/rejectable action、pacing 跟随当前 evidence+intent |
| `product_owned_choice` | 下游产品 | 产品在边界内自由决定 | 回复语言、长短、UI、对话节奏、Prompt、Agent topology、Provider、Family profile、Navigation |

一个 `hard_invariant` 只有在独立证据 trigger 存在时才生效。普通产品偏好不得被包装成 hard invariant。

## 3. Adoption status 的区分

不要把以下概念混为一谈：

- **Accepted Foundation authority**：Foundation `main` 中已被正式接受的边界；
- **Proposed Foundation adoption surface**：Foundation 中仍为 Proposed 的 ADR / manifest / guide，可被选择性消费但不可当 Accepted law；
- **MingOS provisional/selective adoption**：本契约以 `provisional` 或 `selective` 状态消费某些语义项；
- **product-owned freedom**：产品在其边界内自由决定如何表达支持；
- **semantic compatibility**：跨仓兼容是语义/版本/权威声明，不是共享 SHA；
- **audit SHA / provenance**：精确 SHA 是审计证据，不是长期语义身份；
- **conformance / certification / production authorization**：本契约不主张任何这类资格。

### 当前采用的 Foundation 源

| 项 | 当前状态 |
|---|---|
| Foundation ADR-0029（三类权威模型与 canonical bridge） | **Proposed** |
| Foundation AUTHORITY_MANIFEST.json | **Proposed operational registry** |
| Foundation REF-0052（adoption bridge guide） | **Proposed** |
| Foundation main 审计基线 | `4d50b9faeabe1e17c3bfc94e50f1c161375616f7`（audit evidence only） |

由于源均为 Proposed，本契约对所有语义项使用：

```text
adoption_status = provisional
foundation_conformance = false
```

Foundation SHA 只作为 audit/provenance 证据，不构成语义兼容性身份。

## 4. Machine-readable consumption contract

机器可读契约位于：

```text
examples/adoption-authority/adoption-authority.json
```

配套 Schema：

```text
schemas/adoption-authority.schema.json
```

每个被消费的语义项至少声明：

```text
semantic_key
source_reference
source_status
source_revision / provenance（可选）
authority_class
authority_owner
applicability
trigger / evidence expectation
permitted_downstream_effect
forbidden_authority_upgrade
validation_expectation
adoption_status
foundation_conformance
```

## 5. MingOS 确定性回答

基于本契约与现有 schema/invariants，MingOS 可以确定性回答：

1. 这个语义属于什么 authority class？
2. authority owner 是谁？
3. 什么 evidence / trigger 让它生效？
4. 它允许什么 downstream effect？
5. 什么 authority upgrade 被明确禁止？
6. 什么仍属于产品和人的自由？
7. ordinary interaction 是否允许 `no action`？（允许）
8. proposed action 是 optional / rejectable，还是确有独立 Safety authority？
9. 新证据如何 correction / supersede 旧理解？
10. 产品实现如何保持 product-owned，而不偷偷升级成 Core？

## 6. 边界自证：不得夺权

以下行为在任何情况下不得发生：

- 内部 optional candidate 渲染成 mandatory command；
- 未经人的明确选择，把 ordinary candidate 写入 reviewable action memory；
- legacy stage / layer / category 的分类或 confidence 单独激活保护、处方或禁令；
- REPORT / INTERPRETATION / INFERENCE / UNKNOWN 静默升级为 FACT；
- model confidence 变成 FACT 或 authority；
- 用产品 convenience 绕过 consent / privacy / coercion 边界；
- 把 Family 特定 UI / profile / navigation 提升为 MingOS Core primitive；
- 在 handoff / Agent 更换后把旧 inference 当作新 fact。

## 7. 语义压力测试

见 `tests/adoption-authority.test.mjs`。该套件至少覆盖：

1. ordinary conversation → `no action` 合法；
2. 用户明确请求方法 → optional / rejectable action；
3. 内部 optional candidate 不得被渲染成 mandatory command；
4. 人明确选择后 candidate 才可进入 reviewable action semantics；
5. direct Safety evidence → minimum necessary protective action；
6. Safety + ordinary action conflict；
7. UNKNOWN 必须保留；
8. CORRECTION 可以修改旧理解；
9. third-party REPORT 不能变成本人的 FACT；
10. model confidence 不能变成 FACT；
11. legacy stage/category 试图开处方 → 拒绝；
12. legacy stage/category 试图下禁令 → 拒绝；
13. navigation/knowledge 只能组织 evidence / hypothesis；
14. privacy / consent / coercion boundary 不能被产品 convenience 绕过；
15. Family-specific UI/profile/navigation 不得成为 Core primitive；
16. 长期 continuity 中新事实出现后旧 interpretation 被降权或 supersede；
17. handoff 时来源、UNKNOWN、未完成事项不能丢失；
18. Agent 更换后不能把过去 inference 当成新的 fact。

场景 A / B / C（重大挫败、长期反复痛苦、专业现实支持 + 关系连续性）作为验证场景：验证现有 evidence integrity、human authority、no-action、uncertainty、handoff、continuity 是否已足以表达边界；若足够，不新增 primitive。

## 8. Non-claims

本契约不声称：

- Foundation conformance；
- certification / production authorization；
- Draft Kernel 文档是 Accepted / Stable；
- 任意列出的测试规格已由真实家庭执行；
- 产品字段 / UI / 实现拓扑已经升级为 MingOS Core primitive；
- 历史 PR / SHA 仍拥有当前语义 authority。
