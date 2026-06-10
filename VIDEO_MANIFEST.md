# Video manifest

Five Remotion compositions, all 30 seconds @ 30 fps, registered in `remotion/Root.tsx`.

| Composition          | Size      | Shows                                                               | Preview frame                                | Full render                                          |
| -------------------- | --------- | ------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| `SnapSummary`        | 1920×1080 | title, summary, 3 key ideas, takeaway                               | ✅ `public/generated/frames/SnapSummary.png` | ✅ `public/generated/video/SnapSummary.mp4` (2.1 MB) |
| `PoetryAnalysisReel` | 1080×1080 | poem title, theme, tone, structure, 3 techniques, thesis            | ✅ rendered                                  | command below                                        |
| `MathsFormulaReel`   | 1080×1080 | formula, triangle diagram, worked example, common mistake           | ✅ rendered                                  | command below                                        |
| `ProductBriefTeaser` | 1920×1080 | problem, solution, user, features, launch line                      | ✅ rendered                                  | command below                                        |
| `ConceptMapBloom`    | 1920×1080 | nodes growing like branches, edges drawing like veins, closing line | ✅ rendered                                  | command below                                        |

Render state in this environment: all five compositions compile, all five preview frames rendered, and one full MP4 (`SnapSummary`) rendered end-to-end to prove the pipeline. The remaining four MP4s are a command away (≈1–2 min each):

```bash
pnpm video:render                                   # preview frames, all compositions
pnpm video:render -- --full PoetryAnalysisReel      # one full MP4
pnpm video:render -- --full                         # all five MP4s

# raw Remotion equivalents
pnpm exec remotion still  remotion/index.ts SnapSummary out.png --frame=45
pnpm exec remotion render remotion/index.ts SnapSummary out.mp4
```

Requirements: Remotion downloads a headless Chromium on first render. If that download is blocked, compositions still compile under `tsc -b`; report the limitation instead of claiming a render.

Props plumbing: `src/lib/video/storyboard.ts` maps a `SnapProject` to `SnapSummary` props; the other compositions ship demo-quality default props. Render results are recorded in `public/generated/video/manifest.json`.
