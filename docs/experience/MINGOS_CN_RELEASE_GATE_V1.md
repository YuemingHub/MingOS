# mingos.cn Release Gate V1

> Status: **PROPOSED / PRE-PRODUCTION GATE**  
> Scope: future release of the MingOS Living Interface to `mingos.cn`  
> This document does not authorize a deployment and does not assert that any historical server topology is still current.

## 1. Why this gate exists

The Living Interface prototype now has reviewable browser evidence, but a green prototype is not the same thing as a safe production release.

Before `mingos.cn` changes, three different truths must be kept separate:

1. **prototype truth** — what the branch renders and what CI has verified;
2. **repository truth** — what revision is accepted and reviewable in GitHub;
3. **production truth** — what DNS, TLS, web server and active files are actually serving the public domain at release time.

No older deployment note, remembered directory, previous Vercel experiment, PR description or successful local browser run may substitute for a fresh production read.

## 2. Current release authority

Until a fresh production inspection is recorded:

```text
production topology      UNKNOWN
active release directory UNKNOWN
current source provenance UNKNOWN
rollback target          UNKNOWN
DNS/TLS health           UNKNOWN
```

This is deliberate. Unknown infrastructure state is not a reason to guess.

The current public site should remain untouched while these fields are unknown.

## 3. Mandatory preflight

Before any production write, record evidence for all of the following.

### Domain and transport

- `mingos.cn` resolves to the expected production endpoint;
- HTTPS certificate is valid for the domain actually being released;
- HTTP → HTTPS behavior is known;
- whether `www.mingos.cn` exists is recorded rather than assumed.

### Web-server truth

Read the live web-server configuration and record:

- server block that owns `mingos.cn`;
- document root or reverse-proxy target;
- active release path;
- cache headers that could affect rollback;
- error-page / `try_files` behavior;
- config syntax check result before reload.

Do not infer the current configuration from an old deployment report.

### Current artifact provenance

For the files serving the public site, record:

- current release identifier or directory;
- checksum or reproducible file manifest where practical;
- known source repository / revision if it can be proven;
- otherwise mark source provenance `UNKNOWN` instead of inventing it.

### Rollback

Before replacing anything, prove that a previous healthy release can be restored without rebuilding it.

A valid rollback path must specify:

- the immutable previous release;
- the exact switch required to restore it;
- the web-server validation/reload step if applicable;
- the public health check used after rollback.

## 4. Candidate release artifact

The production artifact must be generated from one reviewed Git revision.

For Living Interface V1, the candidate should contain only the intended static web surface and required assets. It must not silently package MingOS Core runtime, Family Space runtime, secrets, test fixtures or repository-private evidence.

The artifact should be immutable after verification. If any file changes, it becomes a new candidate.

## 5. Experience release gates

A candidate is not releasable merely because it renders.

### G1 — Story

- the page begins from the human question rather than an AI capability claim;
- real life appears before architecture;
- Family Space / Return to Oneself are presented as places, not sales tiers;
- the ending contains no conversion trap or fear-driven urgency.

### G2 — Human position

- AI is not the visual protagonist;
- no engagement mechanic pressures continued use;
- no unsupported authority, diagnosis or certainty is introduced by marketing copy.

### G3 — Evidence

- every present-tense `EXISTS` / `TESTING` statement is re-verified immediately before release;
- `DIRECTION` is not written as delivered capability;
- unresolved claims remain `UNKNOWN`.

### G4 — Browser craft

The candidate must preserve the browser evidence already established by the prototype audit:

- desktop and mobile layout without horizontal overflow;
- all intended content visible;
- keyboard-operable world navigation;
- focus restoration;
- reduced-motion path;
- no console/page errors.

### G5 — Accessibility

Before production approval:

- perform an independent screen-reader pass on the release candidate;
- verify meaningful heading/link/navigation order;
- verify contrast and focus visibility against the actual production CSS/fonts;
- ensure content and navigation remain usable with motion reduction.

Automated checks are supporting evidence, not a substitute for this pass.

### G6 — Performance

Run performance evidence against the actual candidate delivery path, not only a local static server.

At minimum record:

- Lighthouse or equivalent production-like measurements;
- transferred bytes for first load;
- blocking third-party dependencies, if any;
- whether fonts/images delay meaningful content.

## 6. Deployment shape

Prefer a release operation that keeps the previous site intact until the candidate has been uploaded and inspected.

Conceptually:

```text
current release  ───────────────┐
                                │ stays untouched
new immutable release → inspect │
                                ↓
                           atomic switch
                                ↓
                         public health check
                                ↓
                    accept OR immediate rollback
```

The exact mechanism — document-root change, symlink switch, deployment platform promotion or another method — is **product infrastructure truth** and must be chosen only after the current topology is read.

## 7. Post-release verification

After the switch, verify from the public domain:

- HTTP status and HTTPS certificate;
- homepage title and a revision-specific content marker;
- CSS and JavaScript load successfully;
- desktop and mobile smoke path;
- world navigation open/close behavior;
- all four outbound site links point to the intended domains;
- no unexpected redirect to Family Space or another runtime;
- previous release remains available for rollback until acceptance closes.

## 8. Stop conditions

Do **not** release if any of these is true:

- current production topology is still inferred rather than observed;
- rollback has not been proven;
- the candidate revision is ambiguous;
- present-tense product claims have not been re-verified;
- browser/accessibility evidence materially regressed;
- the release requires touching Family Space production data or runtime without a separate explicit authorization;
- deployment would overwrite the only known-good copy.

## 9. Acceptance state

The lifecycle is:

```text
PROTOTYPE
  ↓ browser evidence
RELEASE CANDIDATE
  ↓ production preflight + accessibility/performance evidence
STAGED / INSPECTED
  ↓ explicit production release decision
REAL
  ↓ real external use + correction
PROVEN (only for the claims actually supported by evidence)
```

A production deployment proves that the page is live. It does not prove that the MingOS story is understood, useful or broadly valid.
