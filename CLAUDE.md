# CLAUDE.md — working on SpecSnap

## What this is

Local-first React app that parses messy notes into editable explainer pages. No AI APIs, no network for user data, no accounts. Keep it that way.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm lint` · `pnpm test` · `pnpm test:e2e` (install chromium once: `pnpm exec playwright install chromium`)
- `pnpm assets:generate && pnpm assets:compress && pnpm assets:check`
- `pnpm video:render` (frames) · `pnpm mcp:build` (bundle MCP servers)
- Full gate: `pnpm ship`

## Hard rules

1. Parser/exporters/asset factory stay **pure** (no React, no network) — shared with scripts and MCP servers.
2. Components use **palette tokens only** (`bg/surface/ink/mist/accent`); never hard-code hex.
3. Every animation needs a **reduced-motion path** (`useMotionPref()` for Framer, CSS guards already global). A hook will warn you if you forget.
4. New block types must be handled in: types.ts, BlockRenderer, BlockInspector, markdown.ts, html.ts — and tested.
5. Generated files in `public/generated/` are build artefacts — edit `svgFactory.ts` and regenerate, never hand-edit.
6. All file writes in MCP/scripts go through project-root-safe paths.

## Where things live

Parser `src/lib/parser/` · store `src/lib/storage/store.ts` · exporters `src/lib/exports/` · design tokens `src/styles/globals.css` · samples `src/lib/model/examples.ts` · E2E `e2e/flow.spec.ts`.

## Skills & agents

Use `/snap-parser`, `/snap-nature-design`, `/snap-motion`, `/snap-svgz`, `/snap-export`, `/snap-video`, `/snap-a11y`, `/snap-test`, `/snap-ship` etc. (`.claude/skills/`). Specialist agents in `.claude/agents/` — delegate domain work instead of doing everything in one context.

## Hooks active in this repo

PreToolUse blocks dangerous bash; PostToolUse formats edited files with Prettier, warns on framer-motion-without-fallback and placeholder copy, and validates assets after generation runs.
