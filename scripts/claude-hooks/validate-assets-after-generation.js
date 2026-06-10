#!/usr/bin/env node
/**
 * PostToolUse hook (Bash): after asset generation commands, validates the
 * generated SVG/SVGZ set and manifest. Exit 2 surfaces problems to Claude.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()

let command = ''
try {
  command = JSON.parse(readFileSync(0, 'utf8'))?.tool_input?.command ?? ''
} catch {
  process.exit(0)
}
if (!/assets:(generate|compress)|generate-assets|compress-svgz/.test(command)) process.exit(0)

const svgDir = join(ROOT, 'public/generated/svg')
const svgzDir = join(ROOT, 'public/generated/svgz')
const manifestPath = join(ROOT, 'public/generated/ASSET_MANIFEST.json')
const problems = []

if (!existsSync(svgDir)) problems.push('public/generated/svg missing')
if (!existsSync(svgzDir)) problems.push('public/generated/svgz missing')
if (!existsSync(manifestPath)) problems.push('ASSET_MANIFEST.json missing')

if (problems.length === 0) {
  const svgs = readdirSync(svgDir).filter((f) => f.endsWith('.svg'))
  const svgzs = readdirSync(svgzDir).filter((f) => f.endsWith('.svgz'))
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (svgs.length !== svgzs.length) problems.push(`SVG count ${svgs.length} != SVGZ count ${svgzs.length}`)
  if (manifest.count !== svgs.length) problems.push(`manifest count ${manifest.count} != ${svgs.length} files`)
  for (const f of svgs) {
    const c = readFileSync(join(svgDir, f), 'utf8')
    if (!/<title[\s>]/.test(c)) problems.push(`${f}: missing <title>`)
    if (!/<desc[\s>]/.test(c)) problems.push(`${f}: missing <desc>`)
    if (!/viewBox=/.test(c)) problems.push(`${f}: missing viewBox`)
  }
}

if (problems.length > 0) {
  console.error(`Asset validation failed:\n${problems.map((p) => `  - ${p}`).join('\n')}`)
  process.exit(2)
}
process.exit(0)
