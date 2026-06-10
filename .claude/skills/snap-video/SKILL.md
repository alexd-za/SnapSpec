---
name: snap-video
description: Create or render Remotion video explainers — summary video, study/poetry/maths reels, product teaser, concept-map flythrough.
allowed-tools: Read, Grep, Edit, Write, Bash(pnpm video:*), Bash(pnpm exec remotion:*), mcp__specsnap-video__*
---

# /snap-video

Trigger: Remotion composition or rendering work.

Purpose: 30-second explainer videos from Snap data.

## Procedure

1. Compositions: `remotion/compositions/{SnapSummary,PoetryAnalysisReel,MathsFormulaReel,ProductBriefTeaser,ConceptMapBloom}.tsx`, registered in `remotion/Root.tsx`, fed by `src/lib/video/storyboard.ts`.
2. All are 30s @ 30fps. SnapSummary/ProductBriefTeaser/ConceptMapBloom 1920×1080; the reels 1080×1080.
3. Use Remotion primitives (`spring`, `interpolate`, `Sequence`) — not framer-motion — and palette tokens from `remotion/theme.ts`.
4. Render: `pnpm video:render` (preview frames) / `pnpm video:render -- --full <Id>` (mp4). Outputs land in `public/generated/{frames,video}` with a manifest.
5. If rendering fails (no Chromium): compositions must still compile (`tsc -b`), export preview frames where possible, and document the exact commands in VIDEO_MANIFEST.md — report honestly.

## Checklist

- [ ] Composition registered with correct fps/size/duration
- [ ] Default props demo well without external data
- [ ] Preview frame rendered or failure documented
- [ ] `tsc -b` green

## Output format

Compositions touched, render results (frames/mp4 paths), failures with exact commands.
