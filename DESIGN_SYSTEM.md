# Design system — one living canvas

SpecSnap is a single continuous surface: a deep botanical gradient canvas behind the whole app, with drifting light pockets like sun through a canopy, slow-rising leaves, and film grain. Nothing is boxed off — no section borders, hairlines, bands, or torn edges. Sections separate by light, scale, and air; panels are translucent breaths of light (`.float-panel`), never outlined.

## Palettes (five moods of the same forest)

| Theme | bg | surface | text | muted | accent | glow | Reads as |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Forest** (default) | `#0d1a12` | `#18281d` | `#edf3e8` | `#9db3a0` | `#6cc287` | `#2e5c3c` | deep canopy, luminous fern |
| Mist | `#10171c` | `#1a2730` | `#ecf1f4` | `#9fb2bd` | `#7cc1e4` | `#2c4d63` | dusk fog, river-blue light |
| Sunlit | `#1a1409` | `#2c2212` | `#f5efe2` | `#bcab8d` | `#e3b04f` | `#6b5220` | late-evening amber woods |
| River | `#0b151d` | `#152532` | `#e9f1f5` | `#92a9b6` | `#5fd0e0` | `#1f4a59` | deep water, glacial cyan |
| Bloom | `#160f16` | `#281b29` | `#f4edf2` | `#b3a0b0` | `#cd9aea` | `#553059` | midnight garden, wildflower violet |

Tokens `bg/surface/ink/mist/accent` map from `--sn-*` vars (plus `--sn-bg-2`, `--sn-glow` for the canvas); mirrored in `src/lib/model/palettes.ts` for exports/Remotion — keep in sync.

## Typography

Fraunces Variable display (light weights, `SOFT` for italics) · Public Sans body · IBM Plex Mono for code/metadata · `.annotation` = lowercase italic serif margin notes. Self-hosted via @fontsource.

## Canvas & cohesion rules

- `.canvas-base` + `.light-pocket` (drifting blurred accent orbs) + `.canvas-grain` + `.leaf-drift` live ONLY in `NatureBackground` — one backdrop for every page, fixed.
- **No borders as separators.** Surfaces are `.float-panel` (translucent fill, inner top-light, deep soft shadow). Hover = `.float-lift`. Row hovers use `.row-glow` (radial light, slight shift), selection states use accent glow shadows.
- Nav melts into the canvas via a masked blur veil; the active link wears a luminous `.nav-dot`. Footer just fades out.
- Buttons are `.btn-organic` (pill, accent fill, soft luminous depth) and `.btn-ghost`; the messy-note scrap is `.field-note` (accent-tinted glass) hung from a `.pin`.
- Scroll continuity: hero desk and frond parallax at different rates (`useScroll`); sections rise into view; fronds `.sway`; the ticker fades into the canvas at both ends.
- Reduced motion: OS preference + in-app toggle kill all of it (CSS guards + `useMotionPref`).

