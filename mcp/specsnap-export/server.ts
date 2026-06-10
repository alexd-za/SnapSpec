/**
 * specsnap-export — local stdio MCP server.
 * Exports SnapProject JSON to every supported format. Writes only inside
 * the repo's exports/ folder.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { dirname } from 'node:path'
import type { SnapProject } from '../../src/lib/model/types'
import { exportMarkdown } from '../../src/lib/exports/markdown'
import { exportHtml } from '../../src/lib/exports/html'
import { exportJson } from '../../src/lib/exports/json'
import { projectToPosterSvg } from '../../src/lib/exports/svg'
import { buildRevisionPack } from '../../src/lib/exports/revisionPack'
import { ok, safePath } from '../shared/safety'

const projectArg = { project: z.string().describe('SnapProject as JSON') }

function parseProject(json: string): SnapProject {
  const parsed = JSON.parse(json)
  // Accept either the bare project or the { app, project } export envelope.
  return (parsed.project ?? parsed) as SnapProject
}

function write(relative: string, content: string | Buffer): string {
  const full = safePath(relative)
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, content)
  return relative
}

const server = new McpServer({ name: 'specsnap-export', version: '1.0.0' })

server.tool('export_markdown', 'Export a project to exports/<slug>.md', projectArg, async ({ project }) => {
  const p = parseProject(project)
  return ok({ written: write(`exports/${p.slug}.md`, exportMarkdown(p)) })
})

server.tool('export_html', 'Export a standalone HTML page to exports/<slug>.html', projectArg, async ({ project }) => {
  const p = parseProject(project)
  return ok({ written: write(`exports/${p.slug}.html`, exportHtml(p)) })
})

server.tool('export_json', 'Export project JSON to exports/<slug>.json', projectArg, async ({ project }) => {
  const p = parseProject(project)
  return ok({ written: write(`exports/${p.slug}.json`, exportJson(p)) })
})

server.tool('export_svg', 'Export the poster SVG to exports/<slug>-poster.svg', projectArg, async ({ project }) => {
  const p = parseProject(project)
  return ok({ written: write(`exports/${p.slug}-poster.svg`, projectToPosterSvg(p)) })
})

server.tool('export_svgz', 'Export the gzipped poster to exports/<slug>-poster.svgz', projectArg, async ({ project }) => {
  const p = parseProject(project)
  return ok({ written: write(`exports/${p.slug}-poster.svgz`, gzipSync(projectToPosterSvg(p), { level: 9 })) })
})

server.tool(
  'export_revision_pack',
  'Export the full revision pack folder (page.html, page.md, project.json, assets/)',
  projectArg,
  async ({ project }) => {
    const p = parseProject(project)
    const files = buildRevisionPack(p).map((f) => write(`exports/${f.path}`, f.content))
    return ok({ written: files })
  },
)

server.tool(
  'export_static_site',
  'Export a self-contained static site folder for a project (index.html + assets)',
  projectArg,
  async ({ project }) => {
    const p = parseProject(project)
    const root = `exports/site-${p.slug}`
    const files = [
      write(`${root}/index.html`, exportHtml(p)),
      write(`${root}/assets/poster.svg`, projectToPosterSvg(p)),
      write(`${root}/project.json`, exportJson(p)),
    ]
    return ok({ written: files, open: `${root}/index.html` })
  },
)

server.tool('export_health_report', 'List exports/ contents and verify writability', {}, async () => {
  const dir = safePath('exports')
  mkdirSync(dir, { recursive: true })
  const probe = safePath('exports/.health-probe')
  writeFileSync(probe, 'ok')
  const files = readdirSync(dir).filter((f) => !f.startsWith('.'))
  return ok({ healthy: existsSync(probe), exportCount: files.length, files })
})

await server.connect(new StdioServerTransport())
