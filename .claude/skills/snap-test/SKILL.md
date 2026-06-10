---
name: snap-test
description: Run SpecSnap's full validation suite — lint, unit/UI tests, build, E2E, asset checks — and triage failures.
allowed-tools: Read, Grep, Edit, Bash(pnpm lint:*), Bash(pnpm test:*), Bash(pnpm build:*), Bash(pnpm test:e2e:*), Bash(pnpm assets:check:*), Bash(pnpm exec playwright:*)
---

# /snap-test

Trigger: validation runs, CI-style checks, regression triage.

## Procedure

Run in this order (fail fast, report all):

1. `pnpm lint`
2. `pnpm test` (Vitest unit + UI)
3. `pnpm build` (tsc + vite)
4. `pnpm test:e2e` (Playwright; needs `pnpm exec playwright install chromium` once)
5. `pnpm assets:check`

For failures: quote the first failing assertion/error verbatim, name the file:line, fix root cause, re-run only the failed stage, then the full chain once.

## Checklist

- [ ] All five stages exit 0, or each failure is documented with cause
- [ ] No test skipped/x-ed without a comment
- [ ] Flaky E2E? Re-run once before declaring failure

## Output format

Stage table (pass/fail + duration), failures with first error line, fixes applied.
