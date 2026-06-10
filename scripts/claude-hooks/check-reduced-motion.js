#!/usr/bin/env node
/**
 * PostToolUse hook (Edit|Write): warns when a motion-heavy component lacks a
 * reduced-motion path. Heuristic: imports framer-motion but never consults
 * useMotionPref(). Warning only — surfaces to Claude, never blocks edits.
 */
import { existsSync, readFileSync } from 'node:fs'

try {
  const input = JSON.parse(readFileSync(0, 'utf8'))
  const filePath = input?.tool_input?.file_path
  if (!filePath || !filePath.endsWith('.tsx') || !filePath.includes('/src/')) process.exit(0)
  if (!existsSync(filePath)) process.exit(0)

  const code = readFileSync(filePath, 'utf8')
  const usesFramer = /from ['"]framer-motion['"]/.test(code)
  const hasFallback = /useMotionPref|prefers-reduced-motion/.test(code)

  if (usesFramer && !hasFallback) {
    console.error(
      `${filePath}: uses framer-motion without a reduced-motion path. ` +
        `Consult useMotionPref() and render a static variant when it returns false ` +
        `(see src/components/motion/Reveal.tsx).`,
    )
    process.exit(2)
  }
} catch {
  // Soft fail.
}
process.exit(0)
