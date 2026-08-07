---
title: MingOS Foundation Dependency Baseline
status: Proposed
updated: 2026-08-06
owner: MingOS Architecture
---

# MingOS Foundation Dependency Baseline

> This is a downstream adoption record. It does not modify, promote, or replace any document in `YuemingHub/mingos-foundation`.

## 1. Purpose

This record separates:

1. Accepted or Stable Foundation documents on `main`;
2. Draft Foundation material that is present on `main` but is not normative;
3. human-confirmed coordination facts;
4. external implementation evidence from Family-Space.

Only Accepted or Stable Foundation documents are current normative dependencies. A Draft document does not become binding merely because its pull request has merged.

## 2. Observed baseline

| Item | Current value | Authority / status |
|---|---|---|
| Foundation repository | `YuemingHub/mingos-foundation` | Accepted current repository identity; historical `YuemingHub/Ming-Foundation` retained as provenance |
| Foundation default branch | `main` | Repository metadata |
| Foundation main baseline | `7eb33ffc806db1da2fde488a617860ca34b76c0e` | Observed after PR #15, #12 and #16 merged |
| Foundation version | `1.0.0-alpha.18` | Foundation main README / GOV-0001 |
| Observation date | `2026-08-06` | Coordination record |
| MingOS dependency status | Proposed downstream record | This document |

If Foundation `main` advances, this baseline is stale and MUST be regenerated before a new cross-repository claim is made.

## 3. Current normative dependency

MingOS may depend on commitments represented by Accepted or Stable Foundation documents, including:

- life before system;
- understanding before advice;
- relationship before method;
- growth is not reducible to optimization;
- interpretations remain revisable;
- human agency cannot be delegated away;
- evidence, confidence, consent, correction and auditability are first-class concerns;
- AI is replaceable rather than the architectural center;
- observation precedes advice;
- channels must not become incompatible sources of truth.

These constraints do not prescribe Family-Space response templates, family-stage fields, domain language or professional workflow.

## 4. Draft material now present on Foundation main

| Source | Integration status | Document authority | MingOS handling |
|---|---|---|---|
| Foundation PR #15 | Merged | Accepted repository-identity facts and governance records | Use `YuemingHub/mingos-foundation` as current; preserve the old path as history |
| Foundation PR #12 | Merged | KERNEL-0004, KERNEL-0005 and REF-0045–REF-0051 remain `Draft` | Selective, evidence-labelled use is allowed; no conformance, certification or completeness claim |
| Foundation PR #16 | Merged | Operational reservation finalization | Nine Round 09 IDs are integrated; this does not promote their document status |
| Family-Space product evidence | External evidence | Product repository and its own status source | Use for bounded review or proposals; never silently promote product fields into Kernel or Foundation |

The current Foundation Kernel boundary remains:

`NoCurrentKernelConformanceClaim`

Repository validation is structural evidence only. It is not product-safety evidence, human-use evidence or conformance.

## 5. Adoption flexibility

Draft Kernel concepts may be adopted selectively and in proportion to foreseeable effect:

- ordinary MingOS and Family-Space interaction design may retain flexibility in language, pacing, mode selection and family-context interpretation;
- selective use must name the exact Draft concept, version, scope and limitations;
- product-specific interpretation remains in the product repository;
- successful product behavior is evidence for review, not automatic authority;
- foreseeable life-safety, violence, abuse, privacy, rights or professional-authority risks require hard safety, consent, contestability, handoff and accountability controls.

Formal Profile assessment and public conformance claims remain unavailable.

## 6. Update and stop rules

Before using this record for a release, protocol or cross-repository claim:

1. re-read Foundation `main` and record its exact commit;
2. distinguish document integration status from document authority status;
3. verify `NoCurrentKernelConformanceClaim` and the Draft status of KERNEL-0000 through KERNEL-0005;
4. rerun MingOS tests and example validation;
5. stop for human review if status, authority or product risk is ambiguous.

Family-Space evidence can create a proposal. It cannot directly rewrite this dependency record's normative section.

## 7. Explicit non-claims

This record does not claim:

- that Draft Kernel documents are Accepted or Stable;
- that MingOS or Family-Space conforms to the Kernel;
- that any listed test specification has been executed;
- that any person has been recruited, reviewed or activated;
- that a product is ready for real users or production;
- that a downstream implementation may bypass consent, privacy, safety, human accountability or correction.

The record remains Proposed and easy to revise.
