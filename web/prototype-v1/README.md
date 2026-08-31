# MingOS Living Interface V1

> Status: **PROTOTYPE**  
> Intended surface: future `mingos.cn` homepage direction  
> This directory is an isolated experience prototype. It is not MingOS Core, not a production deployment, and not evidence that any displayed direction has shipped.

## Purpose

This prototype tests whether the MingOS idea can be experienced before it is explained as architecture.

It deliberately avoids:

- framework dependency;
- stock photography;
- analytics;
- forms or lead capture;
- chatbot UI;
- AI visual spectacle;
- generic feature-card marketing;
- claims that directions are already delivered.

The first question is not “is this visually polished?” but:

> **Does this make another relationship between human and intelligence feel real enough to continue building?**

## Files

```text
index.html         narrative structure and semantic content
styles.css        base visual system and responsive behavior
refinements.css   evidence-driven visual refinements from browser review
app.js            world switcher, restrained reveal motion, header state
visual-audit.mjs  Chromium desktop/mobile/reduced-motion acceptance audit
```

The browser audit is run by `.github/workflows/experience-prototype.yml` and uploads screenshots plus `audit.json` as workflow evidence.

## Run locally

No product build step is required.

From the repository root:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/web/prototype-v1/
```

Serving from the repository root keeps prototype-relative links to repository documents valid while still exercising the page through HTTP rather than `file://`.

## What has been verified

### Repository engineering gate

The existing MingOS validation workflow still passes on Ubuntu and Windows:

```text
npm ci
npm run check
```

No existing Core source, schema, protocol, validator, CLI or runtime consumer is modified by this prototype.

### Real browser gate

The Living Interface workflow launches real Chromium and verifies:

- desktop viewport: `1440 × 1000`;
- mobile viewport: `390 × 844`;
- `prefers-reduced-motion: reduce`;
- no horizontal viewport overflow;
- one semantic `h1` and one `main`;
- skip-link presence;
- all reveal sections actually become visible;
- world navigation opens from the keyboard-operable control;
- focus enters the opened navigation;
- `Escape` closes it and restores focus;
- no browser console or page errors;
- clean hero and full-page screenshots are produced as review evidence.

These checks prove browser behavior for the tested prototype revision. They do **not** prove production readiness, broad accessibility, user value or future-domain deployment health.

## V1 experience checks

### Story

- The opening is a question, not a product boast.
- Real-life fragments appear before architecture.
- Family Space and Return to Oneself are shown as places, not product tiers.
- MingOS is introduced as an underlying order only after those places are felt.
- Foundation is introduced as boundaries, not bureaucracy.
- The page ends without a conversion trap.

### Human position

- No AI avatar dominates the page.
- No fear or urgency is used as persuasion.
- No growth/engagement metric is used.
- `no action`, uncertainty, correction, and human authority remain legitimate.

### Evidence

- Reality markers distinguish `EXISTS`, `TESTING`, `DIRECTION`, and `UNKNOWN`.
- Statuses are presented as a fact ledger rather than a feature-card grid.
- Current-state copy in the prototype is intentionally conservative.
- **Before any production release, every present-tense claim must be re-verified against current repositories, deployment state, and accepted evidence.**

### Craft

- semantic HTML;
- skip link;
- keyboard-operable world navigation;
- visible focus state;
- responsive layout;
- no external font dependency;
- no production analytics or tracking;
- `prefers-reduced-motion` support;
- content remains readable if JavaScript is unavailable.

## Known limitations / UNKNOWN

- No production domain/deployment wiring is defined here.
- No final font family has been licensed or selected.
- The open-circle mark is a prototype device, not an approved logo.
- No authentic photography set exists yet; the prototype intentionally prefers typography to fake authenticity.
- Cross-site navigation currently points to the existing domain roots, not redesigned downstream sites.
- Browser keyboard/focus behavior has been audited, but an independent screen-reader audit has not yet been completed.
- Performance has no production Lighthouse evidence yet.
- The current visual direction has not yet been tested with real external visitors.
- Current browser screenshots are CI evidence, not proof that the future `mingos.cn` deployment renders identically.

## Next gate

Do not move directly from this prototype to production.

Next:

1. independently audit screen-reader/accessibility behavior;
2. produce Lighthouse/performance evidence against the intended deployment stack;
3. re-verify every current-state claim immediately before release;
4. determine the real `mingos.cn` deployment path and rollback mechanism;
5. review the prototype with actual people who have not participated in its design;
6. only then decide whether this revision should become the production homepage.
