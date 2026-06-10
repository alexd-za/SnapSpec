# Design system — botanical field journal

Ink on paper. SpecSnap is styled as a naturalist's field journal: ruled paper, hairline ink rules, mono specimen labels, stamp-pressed buttons, characterful serif display. Deliberately not the generic AI look (no centered glow-hero, no pill badges, no purple gradients, no uniform rounded cards).

## Palettes

Three papers and two night plates, switched via `data-accent` on `<html>`. Components consume tokens only.

| Theme                | bg        | surface   | text      | muted     | accent    | Reads as                      |
| -------------------- | --------- | --------- | --------- | --------- | --------- | ----------------------------- |
| **Forest** (default) | `#eee9da` | `#f7f4e9` | `#243024` | `#6e7a68` | `#3c7a47` | deep green ink on warm paper  |
| Mist                 | `#eef0ef` | `#fafbfa` | `#26333b` | `#74838a` | `#34688c` | slate ink on cool fog paper   |
| Sunlit               | `#f3e9d2` | `#faf4e3` | `#46351f` | `#97865f` | `#a86c0c` | bark ink on amber parchment   |
| River                | `#15202a` | `#1b2934` | `#e8eef2` | `#8298a6` | `#56c8d5` | night plate, glacial cyan ink |
| Bloom                | `#231b22` | `#2e242b` | `#f3ece9` | `#a18d96` | `#c08fe2` | night plate, wildflower ink   |

Tailwind tokens: `bg`, `surface`, `ink` (text), `mist` (muted), `accent` — mapped from `--sn-*` CSS variables in `globals.css` and mirrored in `src/lib/model/palettes.ts` (exports/posters/Remotion read from there — keep both in sync). **Never hard-code hex in components.**

## Typography (self-hosted via @fontsource — no CDN)

- **Display: Fraunces Variable** (`font-serif`) with `opsz 72, SOFT 30` — headlines, block headings, summaries, quotes. The hero's accent word goes _italic_ with extra SOFT.
- **UI body: Public Sans Variable** (`font-sans`) — controls, descriptions, block body text.
- **Labels: IBM Plex Mono** (`font-mono`) — overlines, nav, specimen labels, metadata, format lists. Always uppercase with `tracking-[0.12em–0.22em]` at 9–11px.

## Spatial language

- **Asymmetry over centering.** The hero is a 7/5 editorial grid: headline left, live "specimen" demo card offset right with a slight 0.6° rotation and a pinned `specimen-label`.
- **Rows over card grids** where content is sequential — "The method" is numbered full-width rows (ghost serif numerals `01 02 03`) divided by hairlines.
- **Hairlines, not shadows-and-glow.** Sections separate with `.ink-rule` (1px ink line + a short accent tick). Cards are `rounded-md` with `border-ink/15`.
- 4px grid; page gutter `px-4`; app width `max-w-6xl`.

## Atmosphere

- `.ruled-paper` — faint 32px notebook rules behind everything, plus a single accent margin line on the left (the journal's red line).
- `.paper-grain` — 5% noise on `MossPanel` surfaces.
- Topographic contours remain in generated assets and diagrams; branch-curve edges in `DiagramCanvas`/ConceptMapBloom.

## Components

- **Buttons** are stamps: `.stamp` = square-ish corners, 1px ink border, hard `3px 3px 0` offset shadow; hover lifts to 4px, press flattens to 1px. Primary = accent fill with `text-surface`; outline = paper fill. No glows.
- **Specimen labels** (`.specimen-label`): bordered mono micro-tags pinned to card corners ("Specimen 001", "Plate 04", "suggested").
- Surfaces are `MossPanel`; section headings use the mono overline + accent tick (`SectionTitle` in BlockRenderer).
- Nav is masthead-style: serif wordmark + mono small-caps links, active link underlined in accent — no pill backgrounds.
- Icon-only controls require `aria-label`; decorative SVGs `aria-hidden`; every list view has a designed empty state.
- Body contrast ≥ 4.5:1 in all five palettes (accents were darkened on the papers for this).
