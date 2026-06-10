# Architecture

## Stack

React 18 + TypeScript + Vite 6 · Tailwind CSS 4 (CSS-variable palettes) · Zustand (persisted to localStorage) · React Router 6 · Framer Motion · Lucide icons · SVGO + zlib for assets · Remotion 4 · Vitest 3 + Testing Library + Playwright · ESLint 9 + Prettier · tsx for scripts.

## Layers

```
src/
  app/         App + router (routes: / /new /editor/:id /gallery /exports /settings)
  routes/      One file per page
  components/  layout/ ui/ motion/ nature/ editor/ blocks/ gallery/ exports/
  lib/
    model/     types.ts (SnapProject/SnapBlock union), palettes, templates, examples
    parser/    deterministic extractors + buildBlocks + parseSource
    storage/   Zustand store (persist: 'specsnap-store') + persistence helpers
    exports/   pure exporters: markdown, html, json, svg, revisionPack, runExport
    assets/    svgFactory (40 assets), svgz (browser gzip), manifest
    video/     storyboard mapping SnapProject → composition props
    hooks/     useMotionPref, useAccent
    utils/     ids, slug, dates
scripts/       asset pipeline, video render, MCP bundler, claude-hooks/
mcp/           five stdio MCP servers + shared/safety.ts
remotion/      Root + five compositions + theme
public/generated/  svg/ svgz/ frames/ video/ posters/ + ASSET_MANIFEST.json
```

## Key decisions

- **Pure core, thin UI.** Parser, exporters, asset factory, and storyboard are pure TypeScript with no React/DOM imports, so the browser app, Node scripts, and MCP servers share one implementation.
- **Palette = CSS variables.** `data-accent` on `<html>` swaps `--sn-*` vars; Tailwind maps them to tokens (`bg`, `surface`, `ink`, `mist`, `accent`) via `@theme inline`. The editor temporarily applies the Snap's own palette and restores the default on leave.
- **Reduced motion is two-layered.** CSS guards (`prefers-reduced-motion` media query + `[data-reduced-motion='true']` attribute) kill CSS animation; `useMotionPref()` gates Framer Motion components to static variants.
- **localStorage over Dexie.** Zustand's persist middleware writes the whole store to one key. Simpler, synchronous, test-friendly; bounded size is documented and mitigated with JSON backup/import.
- **Exports are downloads.** The browser can't write folders, so the revision pack downloads flat files with path-encoded names; the export MCP server writes the real folder under `exports/`.
- **MCP safety.** Every server path goes through `safePath()` (project-root jail); video is the only server allowed to execute anything, and only the whitelisted render script via `execFileSync`.

## Data model

`SnapProject { id, title, slug, template, accent, source, blocks[], exports[], createdAt, updatedAt }` with a 14-variant `SnapBlock` union (heading, summary, key-points, definitions, formulas, quotes, comparison, timeline, diagram, flashcards, quiz, essay-outline, callout, export-card). Full definitions: `src/lib/model/types.ts`.
