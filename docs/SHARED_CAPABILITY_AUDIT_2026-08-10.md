# Shared Capability Audit — 2026-08-10

Status: Draft evidence checkpoint. This is a reuse-before-build and authority-subtraction review. It does not promote Family-Space behavior into MingOS Core and does not authorize product merge, deployment, real-family use, or Foundation conformance.

## 1. Reviewed baselines

- Foundation `main`: `7eb33ffc806db1da2fde488a617860ca34b76c0e`.
- MingOS `main`: `8897cf4758bf93a61f1a936625a78b1f2e8f3886` (PR #27 merged).
- Family-Space `production`: `09a8dfad65f52d49169ec8a4034c1d0b60c5317e`.
- Family-Space PR #166 is merged and is therefore current product evidence for the action-optional final-output boundary.
- Family-Space PR #169 is closed as superseded by the later-current-production rebuild #171.
- MingOS PR #25 is closed as superseded by the current coordination rebuild; its useful reuse-before-build conclusion remains evidence/provenance rather than a competing coordination authority.
- MingOS PR #27 is merged as a focused snapshot reproducibility fix. It changes no Core semantic primitive, protocol, schema, Foundation rule, or Family-Space product behavior.
- Foundation Issue #17 tracks a current re-audit of Family-Space against the historical Accepted `GOV-0009`; the old mapping remains provenance and is not silently rewritten.

## 2. Current shared-capability map

| Product evidence / problem | Existing MingOS capability | Current decision |
|---|---|---|
| Evidence-first family understanding and provenance-backed memory (#156/#157) | Context Ledger, source references, Evidence, authority/freshness, source review | Reuse existing composition; no Family memory object promoted |
| Correction and revision chain (#158/#160) | ledger correction/revocation, status, `supersedes`, `derived_from`, Continuity Bundle | Existing semantics are sufficient; no new `RevisionEvent` primitive |
| Clarification with zero automatic write (#159/#160) | Authorization + Evidence boundaries; Family owns the conversational behavior | Product behavior, not Core protocol |
| Action optionality at final output (#166) | Intent + Authorization + safety boundary composition | Product policy with reusable boundary semantics; not a shared response framework |
| First-entry / continuity / retry UI candidates (#171/#173/#174) | No missing Core capability demonstrated | Family product implementation only |
| Evidence / journey checkpoints (#172/#179) | Evidence and review provenance | Evaluation infrastructure; no product or Core authority |
| Legacy stage/layer/V2/loop/escalation authority debt (#181/#182/#184/#186/#187) | Existing Context / Evidence / Intent / Authorization already provide the needed shared semantics | Prefer authority subtraction in Family-Space; do not add a new Core classifier/state/router |
| Multiple overlapping PRs for the same semantic boundary | Coordination / source-review discipline | One merge-authoritative successor per product semantic boundary; this is coordination process, not a Core runtime object |
| Snapshot verification differing by CRLF checkout (#27) | Repository validation infrastructure | Fixed as infrastructure; no semantic candidate created |

## 3. Upstream candidate decisions

### Accepted new Core candidates

None.

No new primitive currently satisfies all of the following:

1. the problem is genuinely cross-space rather than Family-specific;
2. the existing MingOS objects cannot express it by composition;
3. a new object would reduce rather than duplicate authority;
4. evidence exists beyond one Life Space;
5. migration and compatibility cost are justified.

### Held / rejected candidates

- `RevisionEvent`: held. Existing correction/revocation + `supersedes` + continuity semantics remain sufficient.
- `ClaimStatus` / `EvidenceProvenance`: not new primitives; current status/source/evidence/authority/freshness semantics cover the shared need.
- `ParentCorrectionRecord` / `FamilyFactTable`: rejected as Family-domain data models.
- second memory API / pending clarification state machine: rejected; current Family correction rights path and revision chain already cover the responsibility split.
- `FamilyStage`, `FamilyLayer`, or generalized readiness classifier: rejected as an upstream answer to current Family authority debt. Current work is to remove hidden positive authority from old classifiers, not universalize them.
- `SupportExpansionState` / generalized escalation state: held/rejected as a Core candidate. Current Family work must first separate safety-required escalation, optional support expansion, and assistant-conversation repair without turning them into another universal state machine.
- `AuthorityDebt` as a runtime primitive: rejected. Duplicate authority is an architecture/review smell and coordination concept; it does not need to become a user/runtime object.

## 4. Current Family-Space guidance from MingOS

The highest-value guidance is **reuse before build, and authority subtraction before abstraction**.

For current Family-Space work:

1. Keep `production` as the only implementation baseline.
2. For one parent-visible semantic boundary, designate one merge-authoritative successor; predecessor PRs remain evidence or are superseded.
3. When a legacy module can still decide “what the family is” or “what the parent should do” without current evidence/intent/authorization, remove or narrow that authority first.
4. Preserve useful negative guards when evidence-backed, but do not let a guard become a hidden positive prescription.
5. Do not infer a new Core gap from a failure caused by duplicate routers, default states, stale classifiers, or overlapping PRs.
6. Only raise an upstream proposal after a concrete Family failure remains once duplicate authority has been removed and existing MingOS composition has been tried.

## 5. Foundation boundary

Foundation remains the principle/rights/safety/governance authority. It should not absorb the current Family implementation as standards merely because product tests pass.

The current Foundation gap is evidentiary: `GOV-0009` is an Accepted historical mapping based on a 2026-07-09 snapshot. Issue #17 requests a current re-audit while preserving that history. The re-audit should distinguish:

- current product improvement;
- still-open rights/safety/privacy gaps;
- product-level resolution that is not Foundation conformance;
- unknowns requiring direct audit;
- truly cross-space principle or governance implications.

## 6. Evidence still missing before new Core promotion

- a second independent non-family Life Space showing the same semantic need;
- evidence that existing Context / Evidence / Intent / Authorization / Handoff / Continuity composition is insufficient;
- a migration case where a new primitive measurably reduces complexity or authority ambiguity;
- current Foundation re-audit evidence for Family-Space rights/safety/privacy implications;
- real-family evidence, if and only if separately authorized by Foundation/human-use gates.

Synthetic, internal, model-run, and deterministic journey evidence remains development evidence only.

## 7. Checkpoint

- New Core primitives: **none**.
- Family migration required by MingOS: **none**.
- Foundation standard promotion: **none**.
- Current MingOS action: keep the coordination contract current, prevent duplicate semantic merge authority, and review downstream evidence for genuine cross-space gaps.
- Current Family action: converge the real parent journey and subtract legacy/duplicate authority before adding architecture.
- Current Foundation action: execute the Issue #17 re-audit through existing governance/ID-reservation procedures without rewriting GOV-0009 history.

FINAL STATUS: READY_FOR_ARCHITECTURE_GATE
