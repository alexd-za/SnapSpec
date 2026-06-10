---
name: snap-ship
description: Final release checklist for SpecSnap — verify every acceptance criterion before declaring done.
allowed-tools: Read, Grep, Glob, Bash(pnpm:*), mcp__specsnap-quality__*
---

# /snap-ship

Trigger: release readiness review.

## Procedure

1. Run `/snap-test` stages (lint, test, build, e2e, assets:check).
2. Run quality MCP `check_ship_status`.
3. Manually verify the golden path in a served build: intro shows and skips → Home → Create Snap → template → paste/sample → generate → edit block → reorder/duplicate/delete → switch accent → export MD/HTML/JSON → Gallery shows Snap → Exports shows record.
4. Verify persistence: reload, Snap still there (localStorage `specsnap-store`).
5. Verify assets: 40 SVG + 40 SVGZ + manifest; Exports page renders them.
6. Verify video: compositions compile; preview frames exist or commands documented.
7. Verify docs: README complete (install/run/flows/exports/assets/video/tests/MCP/skills/agents/limitations), known limitations honest.

## Checklist

- [ ] App runs (`pnpm dev` / `pnpm preview`)
- [ ] Intro skippable, skeletons present, no dead buttons
- [ ] Parser, editor, storage, exports all exercised
- [ ] Tests pass or failures documented
- [ ] README + limitations complete

## Output format

The SpecSnap build report format from the project brief: Status, MCPs, skills, agents, hooks, design, features, exports, assets, tests, how to run, known limitations, next improvements.
