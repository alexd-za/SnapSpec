# Design system — one living canvas

SpecSnap is a single continuous surface: a white-paper canvas in living light — soft tinted light pockets drifting like sun through leaves, rising leaf particles, film grain, a vine growing down the margin with scroll, and a lazy-loaded three.js paper-and-leaf scene behind the hero. Nothing is boxed off — no section borders, hairlines, bands, or torn edges. Sections separate by light, scale, and air; panels are translucent breaths of light (`.float-panel`), never outlined.

## Palettes (five moods of the same forest)

| Theme | bg | surface | text | muted | accent | glow | Reads as |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Forest** (default) | `#fbfaf6` | `#ffffff` | `#202c23` | `#6e7d6e` | `#3e7c4f` | `#dde9d6` | white paper, fern ink |
| Mist | `#f9fafb` | `#ffffff` | `#233038` | `#71818b` | `#38749b` | `#dbe7ee` | cool white, river-blue ink |
| Sunlit | `#fdfaf2` | `#ffffff` | `#3a3122` | `#93846a` | `#a8730e` | `#f1e4c4` | warm white, honey ink |
| River | `#f7fafa` | `#ffffff` | `#1e2e34` | `#698590` | `#1e7c8c` | `#d4e8ea` | glacial white, deep teal ink |
| Bloom | `#fcf9f8` | `#ffffff` | `#322327` | `#92797e` | `#b04f63` | `#f2dcdf` | blossom white, wild-rose ink (deliberately no AI violet) |

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

