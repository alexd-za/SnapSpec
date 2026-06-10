---
name: snap-product
description: Create or improve product-brief and project-showcase Snaps — problem, users, solution, value prop, features, user flow, roadmap, risks, launch teaser.
allowed-tools: Read, Grep, Edit, Write, Bash(pnpm test:*), mcp__specsnap-parser__*
---

# /snap-product

Trigger: product-brief or project-showcase template work.

Purpose: turn a raw idea dump into a crisp one-pager.

## Procedure

1. Detection: `PRODUCT_KEYWORDS` / `SHOWCASE_KEYWORDS` in `detectTemplate.ts` (≥2 hits each; showcase wins ties).
2. Brief structure: problem, target user, current alternatives, solution, features, value proposition, user flow, roadmap (timeline block from `Q1:`/`Week 1:` lines), risks, launch teaser (callout tone `idea`).
3. Showcase structure: overview, goal, process steps, features, tech stack, timeline, result.
4. Lead with the problem; the launch teaser is one quotable sentence.
5. Fixtures: `SAMPLE_INPUTS['product-brief']` (PlantPal), `SAMPLE_INPUTS['project-showcase']` (TrailMapper).

## Checklist

- [ ] Both fixtures detect their own template
- [ ] Roadmap lines become timeline events
- [ ] Feature lists become key points, capped sensibly
- [ ] Tests green

## Output format

Blocks produced per fixture and any keyword-list changes.
