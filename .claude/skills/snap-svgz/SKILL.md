---
name: snap-svgz
description: Generate and validate SVG/SVGZ exports and the 40-asset pipeline.
allowed-tools: Read, Grep, Edit, Write, Bash(pnpm assets:*), mcp__specsnap-assets__*
---

# /snap-svgz

Trigger: SVG/SVGZ asset or export work.

Purpose: every vector asset valid, accessible, optimized, and gzip-compressed.

## Procedure

1. Assets are generated from code: `src/lib/assets/svgFactory.ts` → `scripts/generate-assets.ts` (SVGO optimize, zlib gzip) → `public/generated/{svg,svgz}` + `ASSET_MANIFEST.json` + `ASSET_MANIFEST.md`.
2. Hard requirements per SVG: `<title>`, `<desc>`, `viewBox`, no external `<image>`, no `<script>`. SVGO must keep title/desc/viewBox (see plugin overrides in the script).
3. SVGZ = gzip level 9. Browser-side compression uses CompressionStream (`src/lib/assets/svgz.ts`); Node uses zlib.
4. After any change run: `pnpm assets:generate && pnpm assets:compress && pnpm assets:check` — the check enforces 40+40 + manifest parity + a11y metadata.
5. The `validate-assets-after-generation` hook re-runs the same validation automatically.

## Checklist

- [ ] 40 SVG + 40 SVGZ on disk
- [ ] Manifest count matches files; MD table regenerated
- [ ] Title/desc/viewBox in every file
- [ ] `pnpm assets:check` exit 0

## Output format

Counts, total bytes before/after gzip, validation result.
