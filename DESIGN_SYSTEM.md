# Design system

A calm forest notebook crossed with a premium web app. Modern, clean, useful — never childish or fantasy-themed.

## Palettes

Switched via `data-accent` on `<html>`; components consume tokens only.

| Theme                | bg        | surface   | text      | muted     | accent    | Notes                                                                           |
| -------------------- | --------- | --------- | --------- | --------- | --------- | ------------------------------------------------------------------------------- |
| **Forest** (default) | `#141b16` | `#1c2620` | `#f2eee3` | `#93a596` | `#5dbb6e` | deep charcoal green / warm ivory / fern                                         |
| Mist                 | `#f2f4f2` | `#ffffff` | `#26333b` | `#7d8a8d` | `#3a7ca5` | off-white mist / deep slate / river blue                                        |
| Sunlit               | `#f6efdf` | `#fdf8ec` | `#4a3826` | `#a39272` | `#b97d12` | parchment / bark brown / honey amber (accent darkened for contrast on light bg) |
| River                | `#131c24` | `#18242f` | `#e8eef2` | `#8298a6` | `#4ecbd9` | blue slate / pale mist / glacial cyan                                           |
| Bloom                | `#211a20` | `#2c2329` | `#f3ece9` | `#a18d96` | `#b07fd9` | plum-brown / clay / wildflower violet                                           |

Tailwind tokens: `bg`, `surface`, `ink` (text), `mist` (muted), `accent` — mapped from `--sn-*` CSS variables in `globals.css`. **Never hard-code hex in components.**

## Typography

- Display/serif: Iowan Old Style → Palatino → Georgia stack (`font-serif`). Used for h1/h2 display, summaries, quotes, theses.
- UI/sans: system-ui stack (`font-sans`). Used for navigation, labels, metadata, buttons.
- Mono: system monospace for formulas, file names, format badges.
- Scale: hero `text-4xl–6xl`, page titles `text-3xl`, section labels `text-xs uppercase tracking-[0.14em]` in accent.

## Spacing & shape

4px grid. Panels `rounded-2xl`, inputs/cards `rounded-xl`, chips `rounded-full`. Page gutter `px-4`, max width `max-w-6xl` (app) / `max-w-2xl–4xl` (content pages). Section rhythm `py-10`.

## Motifs (one per view, restrained)

- **Topographic contours + faint grid** — `TopographicGrid`, fixed app backdrop.
- **Leaf-vein divider** — `LeafVeinDivider` between homepage sections.
- **Paper grain** — `.paper-grain` overlay on `MossPanel` surfaces (3.5% opacity noise).
- **Soft light gradients** — two radial accent washes in `NatureBackground`.
- **Branch connectors** — curved quadratic edges in `DiagramCanvas` and ConceptMapBloom.
- **Glassy panels** — `MossPanel glass` (blur + translucency) for sticky chrome.

Forbidden: purple AI gradients, particle spam, childish clipart, organic blobs without restraint, low-contrast text.

## Component rules

- Surfaces are `MossPanel`; never raw divs with ad-hoc borders.
- Buttons via `Button` (primary/ghost/outline/danger × sm/md/lg); every interactive element has hover, `:focus-visible` ring (global, accent-colored), and disabled states.
- Icon-only controls require `aria-label`. Decorative SVGs are `aria-hidden`.
- Every list view has a designed empty state (seedling illustration, one CTA).
- Body text contrast ≥ 4.5:1 in all five palettes; check Sunlit first — it's the tightest.
