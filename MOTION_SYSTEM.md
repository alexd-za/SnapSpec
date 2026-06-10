# Motion system

Quiet, organic, purposeful. Motion explains hierarchy and progress; it never decorates for its own sake.

## Intro (first load)

`IntroSequence`: the leaf-vein logo draws stroke-by-stroke (circle 1.2s, four veins staggered 0.25s), while three phrases fade through — "Messy notes." → "Clear structure." → "Beautiful explainer." (1.1s each). Total ≤ 4s. Always skippable ("Skip intro →"); seen-state persists in the store so it plays once. Replayable from Settings. Under reduced motion it self-dismisses immediately.

## Route transitions

`AppShell` wraps the outlet in `AnimatePresence mode="wait"`: 0.28s fade + 10px rise on enter, 6px fall on exit, easeOut.

## Reveals & cascade

- `Reveal`: 0.5s fade + 14px rise, ease `[0.21, 0.65, 0.36, 1]`, optional delay — used for page sections.
- `CascadeItem`: generated blocks stagger in at 80ms intervals, capped at 0.8s total — the "page grows" moment after parsing.

## Skeletons

`.skeleton` panels: moss-toned base (`muted` 14% over `surface`) with a 1.8s flowing accent shimmer. Variants: `SkeletonBlock` (text), `SkeletonCard` (gallery), `SkeletonEditor` (three-pane). Shown for: app boot demo, gallery load, editor load, parser generation ("Growing your explainer…"), exports history, asset manifest fetch, video previews. All have `role="status"` + sr-only "Loading…".

## Micro-interactions

- Template cards: 3° hover tilt + 3px lift (`transformPerspective` 700), 0.98 tap scale.
- Gallery cards: 4px hover lift, staggered 60ms entrance.
- Flashcards: 0.5s 3D flip (CSS `rotateY`, preserve-3d).
- Quiz answers: 0.25s height+opacity expand.
- Diagram edges: stroke-dash draw-in, 1.4s, 150ms stagger.
- Export success: `ExportSuccessBloom` — spring pill + six accent petals radiating out over 0.9s, `aria-live="polite"`.
- Export drawer: 300-stiffness spring slide-in.
- Theme switch: 500ms background-color transition on `<html>`.

## Choreography (v4)

- **Hero sequence**: headline words rise from a baseline mask (70ms stagger) → ink underline draws (0.7s) → the messy field note drops and settles at −6° (spring, 0.55s delay) → the hand arrow inks itself (dash pathLength, 1.15s delay) → caption fades (2.1s). Hovering the note straightens it slightly.
- **Scroll reveals**: `RevealInView` (whileInView, once, −60px margin) staggers the manifesto, method rows, index rows, inks, and closing pocket.
- **Letterpress ticker**: 36s CSS marquee with masked edges; pauses on hover; freezes on the first copy under reduced motion (duplicate copy is aria-hidden).
- **Index rows**: hover shifts the row 8px, inks the numeral, and slides an arrow in from the right edge.
- **Diagram nodes**: `.node-pop` grows each node from the core outward (120ms stagger) while edges draw.
- **Nav**: active link carries a hand-drawn squiggle underline (masked SVG); the leaf mark springs −10° on hover.

## Reduced motion (two layers, both mandatory)

1. **CSS**: `@media (prefers-reduced-motion: reduce)` and `[data-reduced-motion='true']` (in-app toggle) zero out all animation/transition durations globally.
2. **JS**: `useMotionPref()` merges the OS query with the store setting; every Framer Motion component renders a static variant when it returns `false`.

The `check-reduced-motion` hook warns on any component importing framer-motion without consulting `useMotionPref`. Settings → "Reduced motion" toggles the attribute; the UI test and E2E spec both assert it.
