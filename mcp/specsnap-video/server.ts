/**
 * specsnap-video — local stdio MCP server (scaffold).
 * Lists Remotion compositions, renders preview frames / videos by shelling
 * out to the whitelisted render script, and reads the video manifest.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { ok, safePath, PROJECT_ROOT } from '../shared/safety'

const COMPOSITIONS = [
  { id: 'SnapSummary', width: 1920, height: 1080, durationSeconds: 30 },
  { id: 'PoetryAnalysisReel', width: 1080, height: 1080, durationSeconds: 30 },
  { id: 'MathsFormulaReel', width: 1080, height: 1080, durationSeconds: 30 },
  { id: 'ProductBriefTeaser', width: 1920, height: 1080, durationSeconds: 30 },
  { id: 'ConceptMapBloom', width: 1920, height: 1080, durationSeconds: 30 },
]

const compositionId = z.enum(['SnapSummary', 'PoetryAnalysisReel', 'MathsFormulaReel', 'ProductBriefTeaser', 'ConceptMapBloom'])

// Only the project's own render script is ever executed — no arbitrary shell.
function runRenderScript(args: string[]): string {
  return execFileSync('pnpm', ['exec', 'tsx', 'scripts/render-video.ts', ...args], {
    cwd: PROJECT_ROOT,
    timeout: 600_000,
    encoding: 'utf8',
  })
}

const server = new McpServer({ name: 'specsnap-video', version: '0.1.0' })

server.tool('list_compositions', 'List the Remotion compositions', {}, async () => ok(COMPOSITIONS))

server.tool(
  'render_preview_frame',
  'Render a single preview frame PNG for a composition',
  { composition: compositionId },
  async ({ composition }) => {
    const output = runRenderScript([composition])
    return ok({ frame: `public/generated/frames/${composition}.png`, log: output.slice(-800) })
  },
)

server.tool(
  'render_video',
  'Render the full 30s MP4 for a composition (requires Chromium)',
  { composition: compositionId },
  async ({ composition }) => {
    const output = runRenderScript(['--full', composition])
    return ok({ video: `public/generated/video/${composition}.mp4`, log: output.slice(-800) })
  },
)

server.tool('generate_video_manifest', 'Write VIDEO state to public/generated/video/manifest.json', {}, async () => {
  const path = safePath('public/generated/video/manifest.json')
  const entries = COMPOSITIONS.map((c) => ({
    ...c,
    frame: existsSync(safePath(`public/generated/frames/${c.id}.png`)),
    video: existsSync(safePath(`public/generated/video/${c.id}.mp4`)),
  }))
  writeFileSync(path, JSON.stringify({ generatedAt: new Date().toISOString(), compositions: entries }, null, 2))
  return ok({ written: 'public/generated/video/manifest.json', compositions: entries })
})

server.tool('video_health_report', 'Check rendered frames/videos on disk', {}, async () => {
  const frames = COMPOSITIONS.filter((c) => existsSync(safePath(`public/generated/frames/${c.id}.png`)))
  const videos = COMPOSITIONS.filter((c) => existsSync(safePath(`public/generated/video/${c.id}.mp4`)))
  const manifest = safePath('public/generated/video/manifest.json')
  return ok({
    frames: frames.map((c) => c.id),
    videos: videos.map((c) => c.id),
    manifest: existsSync(manifest) ? JSON.parse(readFileSync(manifest, 'utf8')) : null,
    note: 'Full renders need Chromium; preview frames are the fallback. See VIDEO_MANIFEST.md.',
  })
})

await server.connect(new StdioServerTransport())
