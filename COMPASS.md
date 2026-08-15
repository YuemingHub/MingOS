# MingOS Compass

> Shared contract: `THREE_REPO_COMPASS_V1`  
> Status: operational compass for maintainers and AI agents.  
> Scope: MingOS Core direction, cross-space authority, abstraction criteria, and anti-drift rules.  
> This file does not replace Foundation authority or product-specific contracts.

## 1. North Star

MingOS is not trying to become the smartest agent platform, the most complete life model, or a universal product that knows how every person should live.

Its job is narrower and more important:

> **Turn life-supporting constraints into reusable runtime semantics while preserving human agency, evidence, correction, and product freedom.**

The long-term test is:

```text
system capability ↑
should imply
human understanding / agency / revisability ↑

not
hidden system authority / dependency / control ↑
```

MingOS succeeds when stronger system capability makes people more able to judge, correct, refuse, choose, act, and eventually need less hidden system authority.

## 2. Three-repository constitutional map

```text
mingos-foundation
    ↓ defines non-negotiable boundaries

MingOS
    ↓ defines reusable cross-space runtime semantics

Family-Space
    ↓ applies them in one real vertical life space

real life
    ↓ produces evidence, failure, counterexample, correction, and unknowns

Family-Space / future Life Spaces
    ↑ repeated evidence may create a MingOS candidate

MingOS
    ↑ only long-lived, genuinely non-negotiable findings may become Foundation candidates
```

MingOS is the middle layer. It must resist pressure from both directions:

- do not pull product implementation upward into Core merely because it works;
- do not push Foundation governance downward into ordinary runtime behavior unless a real hard boundary requires it.

## 3. Authority classes

Before adding a protocol, object, guard, validator, or runtime rule, classify it.

### 3.1 `hard_invariant` — owned by Foundation

MingOS adopts applicable Foundation hard boundaries but does not invent new constitutional authority merely for convenience.

Typical examples include, subject to their formal Foundation status:

- life-safety, violence, abuse, and serious-harm boundaries;
- consent, privacy, coercion, and third-party rights;
- correction, contestability, refusal, exit, and reversibility;
- no fabricated certainty, diagnosis, or unsupported causal claim;
- evidence/provenance/uncertainty must not be silently upgraded;
- AI and automation may not silently take final human authority;
- legacy/model/category output cannot by itself prescribe or prohibit;
- protective guards require an appropriate current independent evidence owner.

MingOS should make these boundaries executable and inspectable where appropriate, without turning them into a product script.

### 3.2 `adaptive_default` — owned by MingOS

This is MingOS's primary authority surface.

Examples:

- understanding before advice;
- observation/evidence before interpretation;
- distinguish FACT / REPORT / FEELING / INTERPRETATION / INFERENCE / UNKNOWN / CORRECTION;
- preserve source, confidence, time, uncertainty, and revision where materially relevant;
- new evidence/correction may retire older understanding;
- ordinary interaction may legitimately end with **no action**;
- optional action remains rejectable unless an independent Safety authority owns the requirement;
- authority must be explicit: a classifier, model, stage, layer, or profile label does not gain runtime power merely because it exists;
- pacing and response depth follow current evidence and expressed intent, not inherited hidden categories.

Adaptive defaults are reusable semantics, not universal wording or UI requirements.

### 3.3 `product_owned_choice` — owned downstream

MingOS must leave products room to decide:

- exact wording, tone, length, rhythm, and interface;
- whether to reflect, ask, explain, pause, or offer action in an ordinary interaction;
- product-specific navigation and read models;
- prompt / agent / router / orchestration topology;
- model/provider choice;
- domain-specific profile fields and learning surfaces.

Family-Space implementation fields do not become MingOS Core objects merely because they exist in production.

## 4. What MingOS Core should own

MingOS may define cross-space primitives and protocols when they are genuinely reusable, such as:

- Space;
- Actor;
- Context;
- Intent;
- Authorization;
- Task;
- Evidence;
- Handoff;
- Continuity;
- provenance / revision / correction semantics;
- bounded Safety and authority semantics.

The exact object list is revisable. The key test is not whether an abstraction is elegant; it is whether multiple life spaces need the same semantic boundary and existing primitives cannot express it cleanly.

## 5. What MingOS must not become

MingOS is not:

- Family-Space generalized by renaming fields;
- a universal family stage / layer / navigation classifier;
- a second product truth system beside product-owned reality;
- a universal response script;
- a mandatory “always give one next step” engine;
- a model/provider contract;
- an agent topology that every product must copy;
- a place to preserve historical product logic merely because deleting it feels risky;
- a certification claim just because schemas and validators pass.

## 6. Promotion rule: evidence must move upward slowly

A product behavior becomes a MingOS candidate only when there is evidence that the underlying semantic problem is **cross-space**, not merely repeated inside one product.

Preferred path:

```text
real product failure / real value
        ↓
product proves the mechanism useful and revisable
        ↓
other Life Space or clearly cross-space use case reveals the same semantic need
        ↓
existing MingOS primitives are insufficient
        ↓
small cross-space candidate
        ↓
validation + counterexample review
        ↓
MingOS adoption
```

Do not start from:

```text
Family-Space has field X
→ therefore MingOS needs object X
```

A product concept may remain product-specific forever. That is a valid outcome.

## 7. Reuse-before-build and authority subtraction

When a real product failure appears, first ask:

1. Can existing Context / Evidence / Intent / Authorization / Task / Continuity semantics express the problem?
2. Is the failure caused by a missing capability, or by an old subsystem retaining hidden authority?
3. Can a stale classifier/router/gate be removed or demoted instead of adding another abstraction?
4. Is the proposed new primitive cross-space, or merely a convenient product wrapper?

Prefer:

- reuse before new primitive;
- subtraction before parallel authority;
- explicit UNKNOWN before fake certainty;
- one authority owner before multiple competing state machines.

## 8. Consumer-chain rule

Authority is determined by actual downstream effects, not variable names.

A component still has runtime authority if its output can directly or indirectly select:

- a prohibition;
- an action;
- a referral;
- a fixed response;
- knowledge retrieval;
- a quality gate;
- a memory write;
- a user-visible identity or diagnosis;
- a Safety transition.

Labels such as `shadow`, `guard-only`, `candidate`, or `runtimeAuthority=none` are not proof by themselves.

Inspect the real consumer chain.

A legacy classifier cannot regain authority merely by being renamed a guard.

## 9. No-action and optional-action semantics

Ordinary life-supporting interaction does **not** require action.

Valid outcomes include:

- continue speaking;
- clarify what is known;
- reflect;
- explain;
- remain uncertain;
- pause;
- do nothing yet;
- offer a rejectable action candidate when the person asks for help/action or explicitly chooses that direction.

Only a current independent authority, such as a valid Safety trigger, may require a protective action that overrides ordinary optionality.

This boundary is cross-space. Exact product wording is not.

## 10. Anti-drift rules

### A. Do not synchronize by stale PR numbers

Moving Family-Space PRs, branch names, UI fields, and temporary stages may be recorded as point-in-time evidence, but must not become permanent MingOS runtime dependencies.

### B. Separate compatibility from freshness

MingOS should maintain two different questions:

1. **Semantic compatibility:** does the product still respect current Foundation/MingOS authority boundaries?
2. **Current product state:** what is the product actually doing today?

Do not make a validator green by preserving yesterday's construction plan.

### C. Current-state documents must admit staleness

If a current-state surface contains moving downstream facts, it must be refreshed or explicitly marked stale when those facts change materially.

A stale current-state file must not overrule a newer verified product fact source.

### D. Product evidence is not conformance

Synthetic tests, E1 pressure tests, a successful real interaction, a deployment, or a passing validator do not automatically prove Foundation conformance, universal safety, or stable cross-space semantics.

## 11. Semantic compatibility contract

Long-term cross-repository coordination should prefer semantic version/authority declarations over constant copying of downstream SHAs.

Conceptually:

```text
Foundation:
  hard_invariant_version

MingOS:
  adopted_foundation_version
  runtime_semantics_version

Product:
  compatible_foundation_version
  compatible_mingos_semantics
  product_policy_version
```

Exact SHAs remain important evidence for audits and releases. They are not the primary long-term meaning of compatibility.

## 12. Complexity budget

Before adding another Core object, schema family, Gate, Router, State, Agent layer, classifier, or orchestration system, answer:

> **What current cross-space semantic problem cannot be represented safely with the existing Core?**

If there is no demonstrated answer, prefer:

- no new primitive;
- composition of existing semantics;
- authority subtraction;
- narrower scope;
- product-owned implementation;
- an explicit experiment;
- UNKNOWN.

MingOS quality is not measured by abstraction count.

## 13. Decision checks

Before a MingOS change, ask:

1. Which Foundation hard invariant, if any, owns this boundary?
2. Is this truly cross-space, or is it a Family-Space implementation detail?
3. What current evidence demonstrates the need?
4. Can existing MingOS primitives express it?
5. Does this add capability, or merely add authority?
6. Can the person/product still refuse, correct, pause, and choose?
7. Does ordinary interaction still allow no action?
8. What downstream consumer actually uses this output?
9. What counterexample would invalidate this abstraction?
10. Would deleting this abstraction make the system simpler without losing a proven semantic capability?

If the cross-space need is not clear, do not promote it into Core.

## 14. Relationship to the end state

MingOS's long-term direction remains:

```text
Ming Foundation
    ↓
MingOS Core
    ↓
Life Intelligence
    ↓
Life Space
        └→ Family Space as the first vertical instance
```

Life Intelligence is an emergent capability surface built from governed runtime semantics and real-life feedback. It is not permission to create a universal hidden model of a person's life.

The durable aim is:

> **understand more, while taking less of the person's life away from them.**

## 15. Shared compass change protocol

`THREE_REPO_COMPASS_V1` identifies the shared semantic contract, not identical file contents.

The shared semantics are:

- the North Star direction;
- the three-repository constitutional map;
- the three authority classes and their owners;
- the Foundation → MingOS → Product bridge;
- no silent authority upgrade;
- evidence is not automatic conformance;
- reality may challenge every layer.

A material change to these shared semantics MUST NOT be silently made in one repository as though the other two already agree.

When a shared semantic change is needed, either:

1. create/update companion changes in the affected repositories; or
2. explicitly record a `temporary_divergence` with the reason, affected semantics, evidence, responsible owner, and the condition for convergence.

Moving facts — current product stage, PR number, deployment SHA, provider status, or a local implementation detail — remain owned by their source repository and do **not** require synchronized Compass edits.

`THREE_REPO_COMPASS_V1` should change only when all three repositories have adopted a materially new compatible shared contract.

## 16. One-line compass

> **MingOS carries authority and evidence safely across life spaces; it does not decide how every product must help, nor how every person must live.**
