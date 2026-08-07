---
title: MingOS Foundation Dependency Baseline
status: Proposed
updated: 2026-08-06
owner: MingOS Architecture
---

# MingOS Foundation Dependency Baseline

> This is a downstream adoption record. It does not modify, promote, or replace any document in `YuemingHub/mingos-foundation`.

## 1. Purpose

This record prevents MingOS agents and contributors from mixing four different things:

1. accepted Foundation documents on the Foundation default branch;
2. a human-confirmed repository identity that is not yet merged into Foundation `main`;
3. open Foundation Draft PRs;
4. implementation evidence coming back from Family-Space.

Only the first category is a current normative dependency. The other categories remain explicitly labelled as coordination facts, proposals, or evidence.

## 2. Observed baseline

| Item | Current value | Authority / status |
|---|---|---|
| Foundation repository | `YuemingHub/mingos-foundation` | Human-confirmed coordination value on 2026-08-06; the identity transition remains unmerged |
| Foundation default branch | `main` | Repository metadata |
| Foundation main baseline | `280a68705d13bbb5beed3a64713575fad7cba189` | Current Foundation main at observation time |
| Foundation version | `1.0.0-alpha.18` | Foundation main README / GOV-0001 |
| Foundation stage | Foundation 1.0 / Day 18 — Restricted Role Nomination and CP2 Pre-Authorization | Foundation main GOV-0001 |
| Observation date | `2026-08-06` | Coordination record |
| MingOS dependency status | Proposed downstream record | This document |

If Foundation `main` advances, this baseline is stale and MUST be regenerated before it is used for a new cross-repository claim.

## 3. Current normative dependency

MingOS may depend on the following commitments as they are represented by Accepted or Stable documents on Foundation `main`:

- life before system;
- understanding before advice;
- relationship before method;
- growth is not reducible to optimization;
- interpretations remain revisable;
- human agency cannot be delegated away;
- evidence, confidence, consent, correction and auditability are first-class concerns;
- AI is a replaceable component rather than the architectural center;
- observation precedes advice;
- channels must not become incompatible sources of truth.

These are constraints on system design and evidence handling. They do not prescribe Family-Space's domain language, response templates, family-stage fields or professional workflow.

## 4. Candidate material not yet normative

| Source | Exact observed head | Status | MingOS handling |
|---|---|---|---|
| Foundation PR #15 — canonical repository identity | `bc13ebb8dd7aa49b6b8fd9a394a6b073ef61f38a` | Draft; not merged | Use only to explain the accepted coordination decision and historical provenance. Do not say the change is already in Foundation main. |
| Foundation PR #12 — Kernel conformance and test specification collection | `bc45a870ea2f3c85320b47cd7b5b42a50436d103` | Open proposal; Kernel documents remain Draft | Do not claim Kernel conformance, certification, assessment, badge or executed tests. |
| Family-Space product evidence | Current product repository and its own status source | External evidence | Use for bounded validation or a new proposal; never silently promote product fields into the Kernel or Foundation. |

The current Foundation Kernel boundary remains:

`NoCurrentKernelConformanceClaim`

The existence of a passing repository validator is structural evidence only. It is not product safety evidence, human-use evidence or conformance.

## 5. Adoption flexibility

MingOS and downstream products may need different language, pacing, mode selection and domain interpretation. A useful flexibility clarification exists in Foundation PR #12, but that clarification is still a proposal until the relevant Foundation change is merged and accepted.

Therefore:

- implementation experiments may record selective Draft adoption with exact source and version;
- Draft adoption MUST NOT be presented as a stable Foundation requirement;
- product-specific interpretation remains in the product repository;
- foreseeable life-safety, violence, abuse, privacy, rights and professional-authority risks require explicit safety, human-accountability and evidence gates appropriate to the product context;
- a product's successful behavior is evidence for review, not automatic authority over Foundation.

## 6. Update and stop rules

Before using this dependency record for a new release, protocol or cross-repository claim:

1. re-read Foundation `main` and record its exact commit;
2. check whether PR #15 or PR #12 was merged, closed, superseded or changed;
3. update the corresponding source status and commit here;
4. rerun MingOS tests and example validation;
5. stop and request human review if the Foundation status, authority or boundary is ambiguous.

A change in Family-Space can create evidence or a protocol proposal. It cannot directly update this dependency record's normative section.

## 7. Explicit non-claims

This record does not claim:

- that Foundation PR #15 or #12 has been merged;
- that the Foundation repository identity transition is already in Foundation `main`;
- that MingOS or Family-Space conforms to the Draft Kernel;
- that any person has been recruited, reviewed or activated;
- that a product is ready for real users or production;
- that a downstream implementation may bypass consent, privacy, safety, human accountability or correction.

The record is intentionally Proposed and must remain easy to revise.
