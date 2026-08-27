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
index.html   narrative structure and semantic content
styles.css  visual system, responsive behavior, reduced-motion path
app.js      world switcher, restrained reveal motion, header state
```

## Run locally

No build step is required.

From the repository root:

```bash
python -m http.server 8080 --directory web/prototype-v1
```

Then open:

```text
http://localhost:8080/
```

A static file server is preferred over opening `index.html` directly so link and browser behavior matches a real HTTP surface more closely.

## V1 acceptance checks

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
- Current-state copy in the prototype is intentionally conservative.
- **Before any production release, every present-tense claim must be re-verified against current repositories, deployment state, and accepted evidence.**

### Craft

- semantic HTML;
- skip link;
- keyboard-operable world navigation;
- visible focus state;
- responsive layout;
- no external font or JavaScript dependency;
- `prefers-reduced-motion` support;
- content remains readable if JavaScript is unavailable.

## Known limitations / UNKNOWN

- No production domain/deployment wiring is defined here.
- No final font family has been licensed or selected.
- The open-circle mark is a prototype device, not an approved logo.
- No authentic photography set exists yet; the prototype intentionally prefers typography to fake authenticity.
- Cross-site navigation currently points to the existing domain roots, not redesigned downstream sites.
- Accessibility has been designed into the source but has not yet completed an independent browser/screen-reader audit.
- Performance has no production Lighthouse evidence yet.
- The current visual direction has not yet been tested with real external visitors.

## Next gate

Do not move directly from this prototype to production.

First:

1. run browser-level desktop/mobile verification;
2. inspect narrative rhythm in a real browser;
3. verify all status/evidence copy against current facts;
4. perform accessibility/performance checks;
5. review whether it still feels like a generic AI startup site;
6. only then decide the production stack and deployment path for `mingos.cn`.
