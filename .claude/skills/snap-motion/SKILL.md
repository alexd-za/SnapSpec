---
name: snap-motion
description: Create or review SpecSnap animations and loading states — intro, route transitions, skeletons, block cascade, flips, blooms, reduced motion.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(pnpm test:*)
---

# /snap-motion

Trigger: animation or loading-state work.

Purpose: tasteful motion with a guaranteed reduced-motion fallback.

## Procedure

1. All Framer Motion components must consult `useMotionPref()` (src/lib/hooks/useMotionPref.ts) and render a static variant when it returns false.
2. CSS animations rely on the global guards in `globals.css` (`prefers-reduced-motion` + `[data-reduced-motion='true']`) — keep both intact.
3. Durations: micro 150–300ms, reveals 400–500ms, intro ≤ 4s and skippable.
4. Skeletons use `.skeleton` shimmer inside moss panels; every async view (boot, gallery, editor, generation, exports, manifest, video preview) shows one.
5. Easing: `[0.21, 0.65, 0.36, 1]` for reveals; springs for blooms and drawers.

## Checklist

- [ ] Reduced-motion path exists for every new animation
- [ ] Intro skippable; seen-state persisted
- [ ] Skeletons match nature style (moss panel, flowing shimmer)
- [ ] Block cascade staggers ≤ 0.8s total
- [ ] No particle spam; one accent animation per view
- [ ] `pnpm test` passes (reduced-motion UI tests)

## Output format

List each animation touched, its reduced-motion fallback, and duration/easing.
