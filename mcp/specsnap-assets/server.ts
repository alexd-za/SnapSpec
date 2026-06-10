/**
 * specsnap-assets — local stdio MCP server.
 * Generates, compresses, validates, and manifests SVG/SVGZ assets.
 * File writes are restricted to the project root.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { gzipSync, gunzipSync } from 'node:zlib'
import { dirname } from 'node:path'
import { buildAllAssets } from '../../src/lib/assets/svgFactory'
import { generateConceptMap } from '../../src/lib/parser/buildBlocks'
import { diagramToSvg, projectToPosterSvg } from '../../src/lib/exports/svg'
import { buildManifest, type AssetManifestEntry } from '../../src/lib/assets/manifest'
import type { SnapProject } from '../../src/lib/model/types'
import { ok, safePath } from '../shared/safety'

const ACCENTS = ['forest', 'mist', 'sunlit', 'river', 'bloom'] as const

const server = new McpServer({ name: 'specsnap-assets', version: '1.0.0' })

function validate(svg: string): { valid: boolean; problems: string[] } {
  const problems: string[] = []
  if (!/<svg[\s>]/.test(svg)) problems.push('not an <svg> document')
  if (!/<title[\s>]/.test(svg)) problems.push('missing <title>')
  if (!/<desc[\s>]/.test(svg)) problems.push('missing <desc>')
  if (!/viewBox=/.test(svg)) problems.push('missing viewBox')
  if (/<image[\s>]/.test(svg)) problems.push('contains external <image>')
  if (/<script[\s>]/.test(svg)) problems.push('contains <script>')
  return { valid: problems.length === 0, problems }
}

server.tool(
  'generate_svg',
  'Generate one of the 40 named SpecSnap assets (or all). Optionally write to public/generated/svg.',
  { file: z.string().optional().describe('e.g. 01-specsnap-logo.svg; omit for the full list'), write: z.boolean().default(false) },
  async ({ file, write }) => {
    const assets = buildAllAssets()
    if (!file) return ok({ count: assets.length, files: assets.map((a) => a.file) })
    const asset = assets.find((a) => a.file === file)
    if (!asset) return ok({ error: `Unknown asset ${file}` })
    if (write) {
      const path = safePath(`public/generated/svg/${asset.file}`)
      mkdirSync(dirname(path), { recursive: true })
      writeFileSync(path, asset.svg)
    }
    return ok({ file: asset.file, title: asset.title, written: write, svg: asset.svg })
  },
)

server.tool(
  'generate_concept_map_svg',
  'Build a concept-map SVG from a title and terms',
  { title: z.string(), terms: z.array(z.string()).min(1).max(8), accent: z.enum(ACCENTS).default('forest') },
  async ({ title, terms, accent }) => ok(diagramToSvg(generateConceptMap(title, terms), accent)),
)

server.tool(
  'generate_poster_svg',
  'Build a poster SVG for a SnapProject (pass the full project JSON)',
  { project: z.string().describe('SnapProject as JSON') },
  async ({ project }) => ok(projectToPosterSvg(JSON.parse(project) as SnapProject)),
)

server.tool(
  'compress_svgz',
  'Gzip an SVG file inside the repo to .svgz',
  { svgPath: z.string().describe('repo-relative path to an .svg file') },
  async ({ svgPath }) => {
    const input = safePath(svgPath)
    const output = safePath(svgPath.replace(/\.svg$/, '.svgz').replace('/svg/', '/svgz/'))
    mkdirSync(dirname(output), { recursive: true })
    const svg = readFileSync(input)
    const gz = gzipSync(svg, { level: 9 })
    writeFileSync(output, gz)
    return ok({ input: svgPath, output: output.slice(safePath('.').length + 1), bytes: svg.length, gzBytes: gz.length })
  },
)

server.tool(
  'validate_svg',
  'Validate SVG content or a repo file for a11y metadata and safety',
  { svg: z.string().optional(), path: z.string().optional() },
  async ({ svg, path }) => {
    const content = svg ?? (path ? readFileSync(safePath(path), 'utf8') : '')
    if (!content) return ok({ error: 'Provide svg content or a path' })
    return ok(validate(content))
  },
)

server.tool('generate_asset_manifest', 'Rebuild ASSET_MANIFEST.json from generated files', {}, async () => {
  const svgDir = safePath('public/generated/svg')
  if (!existsSync(svgDir)) return ok({ error: 'Run generate_svg with write:true (or pnpm assets:generate) first' })
  const assets = buildAllAssets()
  const entries: AssetManifestEntry[] = readdirSync(svgDir)
    .filter((f) => f.endsWith('.svg'))
    .map((f) => {
      const meta = assets.find((a) => a.file === f)
      const svgBytes = readFileSync(safePath(`public/generated/svg/${f}`)).length
      const svgzFile = `public/generated/svgz/${f.replace(/\.svg$/, '.svgz')}`
      const svgzBytes = existsSync(safePath(svgzFile)) ? readFileSync(safePath(svgzFile)).length : 0
      return {
        file: f,
        title: meta?.title ?? f,
        desc: meta?.desc ?? '',
        svgPath: `public/generated/svg/${f}`,
        svgzPath: svgzFile,
        svgBytes,
        svgzBytes,
      }
    })
  const manifest = buildManifest(entries)
  writeFileSync(safePath('public/generated/ASSET_MANIFEST.json'), JSON.stringify(manifest, null, 2))
  return ok({ written: 'public/generated/ASSET_MANIFEST.json', count: manifest.count })
})

server.tool('asset_health_report', 'Validate the whole generated asset set', {}, async () => {
  const problems: string[] = []
  const svgDir = safePath('public/generated/svg')
  const svgzDir = safePath('public/generated/svgz')
  const svgs = existsSync(svgDir) ? readdirSync(svgDir).filter((f) => f.endsWith('.svg')) : []
  const svgzs = existsSync(svgzDir) ? readdirSync(svgzDir).filter((f) => f.endsWith('.svgz')) : []
  if (svgs.length !== 40) problems.push(`expected 40 SVGs, found ${svgs.length}`)
  if (svgzs.length !== 40) problems.push(`expected 40 SVGZs, found ${svgzs.length}`)
  for (const f of svgs) {
    const v = validate(readFileSync(safePath(`public/generated/svg/${f}`), 'utf8'))
    if (!v.valid) problems.push(`${f}: ${v.problems.join(', ')}`)
  }
  for (const f of svgzs) {
    try {
      gunzipSync(readFileSync(safePath(`public/generated/svgz/${f}`)))
    } catch {
      problems.push(`${f}: invalid gzip`)
    }
  }
  const manifestOk = existsSync(safePath('public/generated/ASSET_MANIFEST.json'))
  if (!manifestOk) problems.push('ASSET_MANIFEST.json missing')
  return ok({ healthy: problems.length === 0, svgCount: svgs.length, svgzCount: svgzs.length, problems })
})

await server.connect(new StdioServerTransport())
