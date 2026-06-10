# Testing

## Suites

| Suite                | Where                             | Count | Runs with           |
| -------------------- | --------------------------------- | ----- | ------------------- |
| Parser unit          | `src/lib/parser/parser.test.ts`   | 20    | `pnpm test`         |
| Export unit          | `src/lib/exports/exports.test.ts` | 8     | `pnpm test`         |
| Asset unit           | `src/lib/assets/assets.test.ts`   | 5     | `pnpm test`         |
| Store unit           | `src/lib/storage/store.test.ts`   | 6     | `pnpm test`         |
| UI (Testing Library) | `src/test/ui.test.tsx`            | 18    | `pnpm test`         |
| E2E (Playwright)     | `e2e/flow.spec.ts`                | 2     | `pnpm test:e2e`     |
| Asset validation     | `scripts/check-assets.ts`         | —     | `pnpm assets:check` |

57 Vitest tests + 2 E2E specs, all green in this environment.

## What's covered

Unit: title/template/summary extraction, formulas, quotes, definitions, timelines, comparisons, flashcard/quiz generation, Markdown/HTML/JSON/SVG exports with escaping, SVGZ round-trip, manifest, store CRUD + persistence + backup import.

UI: intro skip + persistence, skeleton a11y labels, home hero/CTA, template picker + empty-input validation, snap creation, editor block editing via inspector, accent switching, gallery empty/filled, exports page, settings (reduced motion, default template).

E2E golden path: open → skip intro → create Study Notes Snap → paste → generate → edit block → switch accent to River → export Markdown (real download asserted) → Gallery shows Snap → Exports lists the record. Second spec: settings + reduced-motion attribute + asset manifest panel.

## Running

```bash
pnpm test                                  # Vitest (jsdom)
pnpm exec playwright install chromium      # once
pnpm build && pnpm test:e2e                # E2E serves the production build on :4173
pnpm assets:check
```

## Conventions

- Query by role + accessible name; scope nav-link clicks to the "Main navigation" landmark (gallery card titles can collide).
- Fixtures come from `SAMPLE_INPUTS` in `src/lib/model/examples.ts`.
- jsdom shims (matchMedia) live in `src/test/setup.ts`.
- After a state change that remounts a Reveal wrapper, re-query elements — stale nodes swallow events.
