#!/usr/bin/env node
/**
 * PostToolUse hook (Edit|Write): flags placeholder copy in app code.
 * App code (src/, remotion/) gets a visible warning; docs are left alone.
 * Never blocks.
 */
import { existsSync, readFileSync } from 'node:fs'

const FLAGS = [/lorem ipsum/i, /\bTODO\b/, /coming soon/i, /\bplaceholder\b/i, /fake button/i]
// Legitimate uses: input placeholder attributes and placeholder: Tailwind variants.
const ALLOWED_CONTEXT = /placeholder[=:]|placeholder:|setPlaceholder|aria-placeholder/i

try {
  const input = JSON.parse(readFileSync(0, 'utf8'))
  const filePath = input?.tool_input?.file_path
  if (!filePath || !existsSync(filePath)) process.exit(0)
  const isAppCode = /\/(src|remotion)\//.test(filePath) && /\.(ts|tsx)$/.test(filePath)
  if (!isAppCode) process.exit(0)

  const lines = readFileSync(filePath, 'utf8').split('\n')
  const hits = []
  lines.forEach((line, i) => {
    for (const flag of FLAGS) {
      if (flag.test(line) && !(flag.source.includes('placeholder') && ALLOWED_CONTEXT.test(line))) {
        hits.push(`  ${filePath}:${i + 1} → ${line.trim().slice(0, 90)}`)
      }
    }
  })

  if (hits.length > 0) {
    console.error(`Placeholder copy found in app code (replace with real content):\n${hits.join('\n')}`)
    process.exit(2)
  }
} catch {
  // Soft fail.
}
process.exit(0)
