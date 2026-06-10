# Roadmap

## Now (shipped)

Everything in README — six templates, parser, editor, five palettes, exports (MD/HTML/JSON/SVG/SVGZ/PNG/revision pack), 40+40 asset pipeline, five Remotion compositions, 13 MCPs, 12 skills, 12 agents, 5 hooks, 59 tests.

## Next (high value, bounded)

1. **Zip the revision pack** in-browser (fflate) so it downloads as one archive instead of flat files.
2. **PDF text import** via pdf.js (local, no upload) — the UI already routes PDFs to a friendly error.
3. **Drag-to-reorder blocks** in the editor (buttons exist today; pointer DnD with keyboard fallback).
4. **Render videos from real Snaps** — wire `storyboard.ts` into the Exports page so "video" exports enqueue an actual composition render command with project props.
5. **IndexedDB (Dexie) storage adapter** behind the same store API, lifting the localStorage size bound.

## Later

- Preview route (`/preview/:id`) for share-mode rendering without editor chrome.
- Block-level undo history.
- Print stylesheet tuning for one-page cheat sheets (base print CSS exists).
- More maths families (logs, sequences, stats) in `KNOWN_FORMULAS`.
- Optional OCR for screenshots (fully local, e.g. tesseract-wasm) — only if it can stay offline.

## Non-goals (by design)

Accounts, cloud sync, telemetry, paid AI APIs, collaborative editing.
