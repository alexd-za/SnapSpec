---
name: snap-nature-design
description: Create and review SpecSnap's nature-inspired premium UI. Use when designing or auditing visual components, palettes, layout, or polish.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(pnpm dev:*), Bash(pnpm build:*)
---

# /snap-nature-design

Trigger: any task touching SpecSnap's visual system — new components, palette work, layout, hover/focus states, empty states, export previews.

Purpose: keep the UI calm, sharp, premium, organic, readable.

## Procedure

1. Read `DESIGN_SYSTEM.md` and `src/styles/globals.css` before changing visuals.
2. Use only the five palette tokens: `bg`, `surface`, `ink`, `mist`, `accent` (CSS vars `--sn-*`). Never hard-code hex in components.
3. Surfaces are `MossPanel` (rounded-2xl, border-mist/20, paper-grain). Headings serif, UI sans.
4. Motifs allowed: topographic contours, leaf-vein dividers, branch connectors, paper grain, glassy panels. Restrained — one motif per view.
5. Every interactive element needs hover + focus-visible states and a cursor-pointer.
6. Check mobile (single column, `sm:`/`lg:` breakpoints) and empty states for each view touched.

## Checklist

- [ ] Palette tokens only, all five themes still readable (contrast ≥ 4.5:1 body text)
- [ ] Typography: serif display / sans UI, no new font families
- [ ] Spacing on the 4px grid; panels rounded-2xl
- [ ] Hover, focus-visible, and disabled states present
- [ ] Mobile layout verified
- [ ] Empty state designed, not blank
- [ ] No purple-gradient AI clichés, no childish nature clipart, no dead buttons, no lorem ipsum

## Output format

Report: files changed, palette tokens used, states covered (hover/focus/empty/mobile), and any contrast risks per theme.
