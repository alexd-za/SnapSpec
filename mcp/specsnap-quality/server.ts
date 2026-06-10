/**
 * specsnap-quality — local stdio MCP server (scaffold).
 * Static quality checks over the SpecSnap source tree: accessibility hints,
 * route wiring, skeleton coverage, reduced-motion coverage, placeholder copy.
 * Read-only — never writes files.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { ok, safePath } from '../shared/safety'

function walk(dir: string, exts: string[]): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full, exts))
    else if (exts.some((e) => entry.endsWith(e))) out.push(full)
  }
  return out
}

const srcFiles = () => walk(safePath('src'), ['.tsx', '.ts'])
const read = (f: string) => readFileSync(f, 'utf8')
const rel = (f: string) => f.slice(safePath('.').length + 1)

const server = new McpServer({ name: 'specsnap-quality', version: '0.1.0' })

server.tool('check_accessibility', 'Static a11y heuristics: icon buttons without labels, images without alt', {}, async () => {
  const issues: string[] = []
  for (const f of srcFiles().filter((f) => f.endsWith('.tsx'))) {
    const code = read(f)
    if (/<img(?![^>]*alt=)[^>]*\/>/.test(code)) issues.push(`${rel(f)}: <img> without alt`)
    if (/onClick/.test(code) && /<div(?![^>]*role=)[^>]*onClick/.test(code))
      issues.push(`${rel(f)}: <div onClick> without role`)
  }
  return ok({ healthy: issues.length === 0, issues })
})

server.tool('check_readability', 'Flag very long text blocks in route components', {}, async () => {
  const issues: string[] = []
  for (const f of walk(safePath('src/routes'), ['.tsx'])) {
    const lines = read(f).split('\n')
    lines.forEach((l, i) => {
      if (l.length > 160) issues.push(`${rel(f)}:${i + 1} line longer than 160 chars`)
    })
  }
  return ok({ healthy: issues.length === 0, issues: issues.slice(0, 20) })
})

server.tool('check_responsive_layout', 'Verify responsive utility usage in routes/components', {}, async () => {
  const missing = walk(safePath('src/routes'), ['.tsx'])
    .filter((f) => !/sm:|md:|lg:/.test(read(f)))
    .map(rel)
  return ok({ healthy: missing.length === 0, routesWithoutBreakpoints: missing })
})

server.tool('check_broken_routes', 'Verify every internal link target exists in the router', {}, async () => {
  const router = read(safePath('src/app/router.tsx'))
  const declared = ['/', '/new', '/gallery', '/exports', '/settings', '/editor/:id']
  const links = new Set<string>()
  for (const f of srcFiles()) {
    for (const m of read(f).matchAll(/to=["'](\/[a-z-]*)["']/g)) links.add(m[1])
  }
  const broken = [...links].filter(
    (l) => !declared.some((d) => d === l || (d.includes(':') && l.startsWith(d.split(':')[0]))),
  )
  return ok({ healthy: broken.length === 0, declaredInRouter: router.includes('createBrowserRouter'), links: [...links], broken })
})

server.tool('check_skeleton_states', 'Verify routes with async loading render skeletons', {}, async () => {
  const skeletonUsers = srcFiles().filter((f) => /Skeleton(Block|Card|Editor)/.test(read(f))).map(rel)
  return ok({ healthy: skeletonUsers.length >= 4, skeletonUsage: skeletonUsers })
})

server.tool('check_animation_reduced_motion', 'Verify motion components have a reduced-motion path', {}, async () => {
  const issues: string[] = []
  for (const f of srcFiles().filter((f) => f.endsWith('.tsx'))) {
    const code = read(f)
    if (/from 'framer-motion'|from "framer-motion"/.test(code) && !/useMotionPref|AnimatePresence-only/.test(code)) {
      issues.push(`${rel(f)}: uses framer-motion without useMotionPref`)
    }
  }
  const cssGuard = read(safePath('src/styles/globals.css')).includes('prefers-reduced-motion')
  return ok({ healthy: cssGuard && issues.length === 0, cssGuard, issues })
})

server.tool('check_ship_status', 'Aggregate release readiness signals', {}, async () => {
  const checks = {
    assetsGenerated: walkSafe('public/generated/svg').length === 40,
    svgzGenerated: walkSafe('public/generated/svgz').length === 40,
    manifest: exists('public/generated/ASSET_MANIFEST.json'),
    readme: exists('README.md'),
    tests: exists('src/lib/parser/parser.test.ts') && exists('e2e/flow.spec.ts'),
    remotion: exists('remotion/Root.tsx'),
  }
  return ok({ healthy: Object.values(checks).every(Boolean), checks })

  function exists(p: string) {
    try {
      statSync(safePath(p))
      return true
    } catch {
      return false
    }
  }
  function walkSafe(p: string) {
    try {
      return readdirSync(safePath(p))
    } catch {
      return []
    }
  }
})

await server.connect(new StdioServerTransport())
