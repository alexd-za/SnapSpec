---
name: snap-export
description: Build and validate SpecSnap export formats — Markdown, standalone HTML, JSON, SVG, SVGZ, revision pack, static site.
allowed-tools: Read, Grep, Edit, Write, Bash(pnpm test:*), mcp__specsnap-export__*
---

# /snap-export

Trigger: export format work.

Purpose: every export readable, standalone, and faithful to the page.

## Procedure

1. Exporters are pure functions in `src/lib/exports/` (markdown, html, json, svg, revisionPack) shared by the browser (`runExport.ts` + ExportDrawer) and the export MCP server.
2. HTML export: inline CSS only, project palette via CSS vars, no scripts, mobile-readable, must escape all user content (`esc()`).
3. Markdown export: title, template, every block, generated timestamp footer.
4. JSON export: `{ app, version, exportedAt, project }` envelope, re-importable from Settings.
5. Revision pack folder: `<slug>/page.html`, `page.md`, `project.json`, `assets/`, `README.txt`.
6. Validate by reading the output: open the HTML, render the Markdown, re-import the JSON. Tests live in `src/lib/exports/exports.test.ts`.

## Checklist

- [ ] New block types handled in BOTH markdown.ts and html.ts
- [ ] HTML still script-free and escaped
- [ ] JSON round-trips
- [ ] Tests green

## Output format

Formats touched, sample output snippet, test results.
