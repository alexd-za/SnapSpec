# SpecSnap

Turn messy notes into beautiful living explainers.

SpecSnap is a **local-first** website: paste messy notes, a poem, maths working, or a product idea — it parses the content on your device into a polished, editable, exportable explainer page. No accounts, no cloud, no AI API, no telemetry.

![SpecSnap logo](public/generated/svg/01-specsnap-logo.svg)

## Quick start

```bash
pnpm install
pnpm assets:generate   # builds the 40 SVG/SVGZ assets + manifest
pnpm dev               # http://localhost:5173
```

npm equivalents work (`npm install`, `npm run dev`).

## The flow

1. **Home** — animated leaf-vein intro (skippable, shown once), hero, live demo preview.
2. **Create Snap** (`/new`) — pick one of six templates, paste text or import `.txt`/`.md`, or load a sample.
3. **Generate** — the deterministic local parser extracts title, summary, key points, definitions, formulas, quotes, timelines, comparisons, a concept map, flashcards, and a quiz.
4. **Editor** (`/editor/:id`) — three panes: block list (reorder/duplicate/delete), live preview, inspector (structured editing per block type). Switch the accent palette live; everything saves to localStorage instantly.
5. **Export** — HTML (standalone, inline CSS), Markdown, JSON, SVG poster + concept map, SVGZ, PNG poster, revision pack, video storyboard.
6. **Gallery** (`/gallery`) — every saved Snap. **Exports** (`/exports`) — export history, the 40-asset manifest, and the five Remotion compositions.

## Templates

Study Notes · Poetry Analysis · Maths Explainer · Product Brief · Project Showcase · Revision Cheat Sheet. The parser auto-suggests a template from your text; you can override it.

## Palettes

Forest (default) · Mist · Sunlit · River · Bloom — see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

## Commands

| Command                                   | What it does                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| `pnpm dev`                                | dev server on 0.0.0.0:5173                                                |
| `pnpm build`                              | typecheck + production build                                              |
| `pnpm preview`                            | serve the build (E2E target)                                              |
| `pnpm lint` / `pnpm format`               | ESLint / Prettier                                                         |
| `pnpm test`                               | Vitest unit + UI tests (57 tests)                                         |
| `pnpm test:e2e`                           | Playwright golden-path E2E (`pnpm exec playwright install chromium` once) |
| `pnpm assets:generate`                    | generate 40 SVGs, optimize (SVGO), gzip to SVGZ, write manifest           |
| `pnpm assets:compress`                    | re-gzip all SVGs to `.svgz` (zlib level 9)                                |
| `pnpm assets:check`                       | validate 40+40 files, manifest parity, `<title>`/`<desc>`/`viewBox`       |
| `pnpm video:render`                       | render a preview frame per Remotion composition                           |
| `pnpm video:render -- --full SnapSummary` | render a full 30s MP4                                                     |
| `pnpm mcp:build`                          | bundle the five local MCP servers                                         |
| `pnpm ship`                               | lint + test + build + assets pipeline                                     |

## Asset pipeline (SVG/SVGZ)

40 SVGs are generated from code (`src/lib/assets/svgFactory.ts`) — logo, 5 theme previews, 6 template icons, 13 block icons, 7 export badges, and 8 illustrations. Every file has `<title>`, `<desc>`, and `viewBox`, is SVGO-optimized, and ships with a gzip `.svgz` twin (~59% smaller). Manifest: `public/generated/ASSET_MANIFEST.json` + [ASSET_MANIFEST.md](ASSET_MANIFEST.md).

## Video (Remotion)

Five 30-second compositions in `remotion/compositions/`: SnapSummary, PoetryAnalysisReel, MathsFormulaReel, ProductBriefTeaser, ConceptMapBloom. Preview frames for all five and a full SnapSummary MP4 render in this environment. See [VIDEO_MANIFEST.md](VIDEO_MANIFEST.md).

## MCP setup

Core servers (filesystem, memory, sequential-thinking, time, fetch, git, playwright, context7) plus five local project servers (`specsnap-parser`, `specsnap-assets`, `specsnap-export`, `specsnap-video`, `specsnap-quality`). Registration commands and tool lists: [MCP.md](MCP.md).

## Claude Code skills & agents

12 skills in `.claude/skills/` (`/snap-nature-design`, `/snap-motion`, `/snap-parser`, `/snap-poetry`, `/snap-maths`, `/snap-product`, `/snap-svgz`, `/snap-export`, `/snap-video`, `/snap-a11y`, `/snap-test`, `/snap-ship`) and 12 agents in `.claude/agents/`. See [SKILLS.md](SKILLS.md) and [AGENTS.md](AGENTS.md). Hooks (format-on-edit, dangerous-command blocker, asset validation, reduced-motion guard, placeholder guard) are wired in `.claude/settings.json`.

## Tests

57 Vitest tests (parser, exports, assets, store, UI) + 2 Playwright E2E specs covering the full create → edit → export → gallery flow. See [TESTING.md](TESTING.md).

## Known limitations

- **PDF import is not supported** — the import UI accepts `.txt`/`.md` and tells you to paste PDF text instead.
- **Revision pack downloads as individual files** (no zip); folder structure is preserved in file names and documented in the pack's README.txt. The export MCP writes the real folder structure under `exports/`.
- **Persistence uses localStorage** (via Zustand persist), not Dexie/IndexedDB — simpler and robust, but bounded to ~5 MB. A JSON backup/import lives in Settings.
- **Full video rendering needs Chromium**; preview frames are the documented fallback (`pnpm video:render`).
- **PNG export rasterises the poster SVG via canvas** — system-font metrics may differ slightly across platforms.
- The parser is deterministic/heuristic, not semantic — it structures what it can detect and everything stays editable.

## Roadmap

See [ROADMAP.md](ROADMAP.md).
