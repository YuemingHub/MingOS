# MingOS · Current Product Lines

> Current coordination fact: 2026-08-29
>
> This file maps current product/repository roles. It does **not** promote product implementation into MingOS Core.

## 1. Current map

```text
mingos-foundation
  └─ principle / calibration
       technology stands with life; safety, agency, epistemic boundaries

MingOS
  └─ proven cross-space primitives only
       do not pre-design product-specific life flows

Family-Space
  └─ 我和我家
       family reality, relationship, parenting, family continuity, family return

Return-to-oneself
  └─ 我和自己
       self-understanding, reality loop, correction, embodied learning when earned

Gui
  └─ formal frontend for Return-to-oneself
       presentation and interaction, not a second product brain

Ming / external agents / Ming-Workbench / AAOP / other runtimes
  └─ optional reality-execution capabilities
       used only when a person has a sufficiently confirmed intention to make something real
```

## 2. Two product construction fronts

The previous coordination snapshot treated Family-Space as the only product construction line. That is now incomplete.

There are currently two distinct real-product learning fronts:

### A. Family-Space — 我和我家

Its product truth comes from real family use and family-life returns.

The system must learn how to understand:

- family facts and reports;
- relationships and conflicting viewpoints;
- parenting situations;
- safety and professional boundaries;
- corrections over time;
- what actually happened after the family returned to life.

### B. Return-to-oneself — 我和自己

Its product truth comes from a person's real-life loop:

```text
带着真实生活进入
→ 看见 / 区分 / 暂时理解
→ 回到现实
→ 现实发生
→ 带着新经验回来
→ 修正理解
```

Its existing modules (`看见自己`, `练习落地`, `方向到成果`) are internal capability sources, not universal stages.

The Embodied Learning Loop remains a product capability when the user is genuinely forming an ability:

```text
实践 → 感受 → 反馈 → 理论 → 复盘 → 再实践 → 稳定 → 迁移 → 保持
```

It is not a default body-scan interaction.

## 3. What MingOS does with these products

MingOS does **not** make either product conform to a fixed MingOS workflow.

Instead:

```text
Family-Space real evidence ─┐
                           ├─> repeated cross-space need? ─> MingOS candidate
Return real evidence ──────┘
```

A capability should move upward only when:

1. the need appears in more than one genuinely different space;
2. the same semantic responsibility is being solved repeatedly;
3. the existing MingOS primitives cannot already express it cleanly;
4. product-specific language can be removed without losing the responsibility;
5. adopting it as a shared primitive reduces duplication rather than adding governance weight.

Until then, the capability remains product-owned.

## 4. Shared signals that are candidates, not automatic Core

Family-Space and Return already show similar concerns around:

- epistemic authority: reality/user statement > AI hypothesis;
- correction invalidating prior interpretation;
- continuity without identity lock-in;
- reality return changing understanding;
- user-owned exit and refusal;
- bounded memory authority;
- safe handoff of minimum necessary context.

These similarities are useful observation points. They are **not** evidence that MingOS must immediately add a new subsystem.

First reuse the current `Context / Evidence / Intent / Authorization / Continuity` vocabulary where possible.

## 5. Gui boundary

`YuemingHub/Gui` is a presentation/application frontend for Return-to-oneself.

Target relationship:

```text
Gui
  ↓ stable API
Return-to-oneself
  ↓
conversation / memory / safety / learning / reality loop
```

Do not put a second copy of long-term memory semantics, safety authority, product routing or life interpretation rules in the frontend.

## 6. Reality execution boundary

When a person has confirmed an intention such as:

> “对，这就是我想做的，我想把它真的做出来。”

Family-Space or Return may need external capabilities. The default rule is:

> **Find/reuse the best available capability before building a platform.**

Ming-Workbench, AAOP, Harness, an existing coding agent, a browser agent, a human service, or a future tool are all replaceable implementations.

MingOS does not require a fixed execution chassis for the life products to exist.

## 7. Work priority

Current priority order:

1. make Family-Space useful to real families;
2. make Return-to-oneself useful in real self-space Life Loops;
3. improve `Gui` only as needed to express Return cleanly;
4. use existing external execution capabilities when reality requires outcomes;
5. extract MingOS shared capability only after repeated cross-space evidence;
6. change Foundation only when a true principle-level issue is demonstrated.

The number of schemas, routers, agents, RFCs, PRs or modules is not product progress.

## 8. Anti-drift rule

Before adding infrastructure, ask:

```text
Which real user failure requires this?
Which product owns the failure today?
Can an existing capability solve it?
Does this need exist across spaces, or only in one product?
What evidence will show the change improved reality?
```

If those questions cannot be answered, do not promote the work into MingOS Core.
