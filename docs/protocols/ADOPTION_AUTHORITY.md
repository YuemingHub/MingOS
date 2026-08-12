# Adoption Authority Contract

> Status: Proposed cross-space adoption contract  
> Owner: MingOS  
> Foundation source: `YuemingHub/mingos-foundation` Issue #14 and currently accepted/stated governance boundaries  
> Product evidence source: downstream repositories; current Family-Space evidence is an example, not a universal product model

## Purpose

This contract answers one question:

> When a product selectively adopts Foundation principles, **who owns the authority to decide what happens next?**

It does not create a new classifier, family stage, reply mode, Safety taxonomy, memory system or product workflow. It describes how existing evidence and authority may travel across spaces without being silently upgraded.

Selective adoption of Foundation or Draft Kernel concepts is **not** conformance, certification, merge approval or production authorization.

## Three classes

### `hard_invariant`

Foundation-owned non-negotiable boundary. It activates only when a current trigger/evidence owner is present.

Examples:

- direct life-safety / violence / abuse evidence;
- consent, privacy and coercion boundaries;
- correction / contestability / reversibility;
- professional-authority limits;
- source/provenance integrity;
- prohibition on fabricated certainty or diagnosis.

A historical stage, layer, score, knowledge card, navigation coordinate or classifier category is **not** a trigger owner merely because it once correlated with risk.

Canonical rule:

> **导航可以组织证据；旧模型可以提供假设；只有当前独立证据 authority 可以激活保护。分类本身既不能开处方，也不能下禁令。**

### `adaptive_default`

MingOS-owned cross-space semantic default. It guides ordinary interpretation but does not prescribe a product action.

Defaults include:

- receive the person before trying to solve the situation;
- keep `FACT / REPORT / FEELING / INTERPRETATION / INFERENCE / UNKNOWN / CORRECTION` distinct;
- prefer source-backed evidence over knowledge defaults;
- keep hypotheses transparent and revisable;
- allow new evidence/correction to retire an older understanding;
- ask one concrete clarification when it is genuinely needed;
- allow an ordinary exchange to end with **no action**.

`adaptive_default` is not a hidden mode selector. A product may answer with reflection, explanation, exploration, a question, a pause, or — when authorized — an optional action.

### `product_owned_choice`

Downstream product discretion inside the hard boundaries.

Examples:

- wording, tone and pacing;
- UI and interaction rhythm;
- model/provider/prompt/agent topology;
- domain-specific read models and scenario packs;
- whether the ordinary response reflects, explains, explores, asks, pauses or offers an action;
- exact action wording, timing and review UI.

Product freedom does not include permission to violate a hard invariant or silently upgrade lower-authority evidence.

## Ordinary action authority

Ordinary action is **not** a default MingOS requirement.

```text
no explicit action/help intent
→ no ordinary action is required
→ no-action is valid

explicit action/help intent
→ product may offer at most its own bounded optional candidate
→ parent/person-visible wording must preserve choice and rejectability
→ only explicit human choice may promote that ordinary candidate into reviewable action memory

current Safety-owned trigger
→ minimum necessary protective action may be required independently
```

An internal field such as `policy=optional` does not preserve agency if the visible sentence says `you must`. Producer authority and parent-visible consumer authority must agree.

## Evidence and correction

MingOS adoption requires these distinctions to survive downstream consumers:

- `REPORT` does not become `FACT` because a Writer repeats it confidently;
- `INTERPRETATION` / `INFERENCE` do not become family/person identity;
- `UNKNOWN` may remain unknown;
- a third-party recommendation is not automatically user-owned intent;
- knowledge priority/default is not current evidence;
- an old model's category/confidence/output cannot activate prescription or prohibition;
- new evidence / correction may invalidate a prior interpretation;
- persisted learning/navigation output does not become canonical truth merely because it was stored.

## Consumer-chain rule

Authority subtraction must happen **before consumer use**, not after a decision has already been made.

Review every adoption at these seams:

```text
producer
→ retrieval / routing
→ Writer
→ post-processing
→ parent-visible metadata/navigation
→ persistence / memory / learning
→ later-turn reuse
```

If a producer emits `unknown`, `candidate`, `shadow`, `report_only` or another lower-authority object, every later consumer must preserve that authority unless a new independent evidence owner explicitly upgrades it.

## What MingOS does not standardize

MingOS does not turn downstream implementation names into universal primitives merely because they work in one product. In particular, a product-specific family layer, stage, stuck point, Life Board, judgment card, profile field, prompt variable or UI receipt is not automatically a Core object.

Promote a new Core primitive only when multiple spaces demonstrate the same semantic gap and existing `Context / Evidence / Intent / Authorization / Continuity` objects cannot express it cleanly.

## Validation expectation

An adoption implementation should be able to answer, with current evidence:

1. Which hard boundary is active, if any?
2. What current evidence/source owns that boundary?
3. Which information remains report / hypothesis / unknown?
4. Is an action actually authorized?
5. If ordinary action is offered, is it visibly rejectable and human-chosen before durable promotion?
6. Can new evidence/correction retire the current interpretation?
7. Is any product-specific derived object being mistaken for universal MingOS authority?

If those questions cannot be answered, the adoption is not ready to claim that it preserves MingOS authority semantics.