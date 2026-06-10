/**
 * Renders Remotion compositions to public/generated/video, and a preview
 * frame per composition to public/generated/frames.
 *
 * Usage:
 *   pnpm video:render                 # preview frames for all compositions
 *   pnpm video:render -- --full       # full 30s mp4 renders (needs Chromium + ffmpeg)
 *   pnpm video:render -- SnapSummary  # restrict to one composition
 *
 * Equivalent manual commands:
 *   pnpm exec remotion still remotion/index.ts SnapSummary out.png --frame=45
 *   pnpm exec remotion render remotion/index.ts SnapSummary out.mp4
 */
import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const COMPOSITIONS = [
  'SnapSummary',
  'PoetryAnalysisReel',
  'MathsFormulaReel',
  'ProductBriefTeaser',
  'ConceptMapBloom',
]

const args = process.argv.slice(2).filter((a) => a !== '--')
const full = args.includes('--full')
const only = args.filter((a) => !a.startsWith('--'))
const targets = only.length > 0 ? only : COMPOSITIONS

const ROOT = process.cwd()
const FRAMES = join(ROOT, 'public/generated/frames')
const VIDEO = join(ROOT, 'public/generated/video')
mkdirSync(FRAMES, { recursive: true })
mkdirSync(VIDEO, { recursive: true })

const results: { id: string; kind: string; ok: boolean; output: string; error?: string }[] = []

for (const id of targets) {
  if (full) {
    const out = join(VIDEO, `${id}.mp4`)
    try {
      execSync(`pnpm exec remotion render remotion/index.ts ${id} "${out}"`, {
        stdio: 'inherit',
        timeout: 600_000,
      })
      results.push({ id, kind: 'video', ok: true, output: out })
    } catch (e) {
      results.push({ id, kind: 'video', ok: false, output: out, error: String(e) })
    }
  }
  const frame = join(FRAMES, `${id}.png`)
  try {
    execSync(`pnpm exec remotion still remotion/index.ts ${id} "${frame}" --frame=45`, {
      stdio: 'inherit',
      timeout: 300_000,
    })
    results.push({ id, kind: 'frame', ok: true, output: frame })
  } catch (e) {
    results.push({ id, kind: 'frame', ok: false, output: frame, error: String(e) })
  }
}

writeFileSync(
  join(ROOT, 'public/generated/video/manifest.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2),
)

const failed = results.filter((r) => !r.ok)
console.log(`\nRendered ${results.length - failed.length}/${results.length} outputs.`)
if (failed.length > 0) {
  console.error('Failed:', failed.map((f) => `${f.id} (${f.kind})`).join(', '))
  console.error('If Chromium download is blocked, see VIDEO_MANIFEST.md for manual commands.')
  process.exit(1)
}
