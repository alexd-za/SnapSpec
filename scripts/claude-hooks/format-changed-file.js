#!/usr/bin/env node
/**
 * PostToolUse hook (Edit|Write): formats the changed file with Prettier.
 * Fails softly — formatting problems never block the session.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const SUPPORTED = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css']

try {
  const input = JSON.parse(readFileSync(0, 'utf8'))
  const filePath = input?.tool_input?.file_path
  if (!filePath) process.exit(0)
  if (!SUPPORTED.some((ext) => filePath.endsWith(ext))) process.exit(0)
  if (filePath.includes('node_modules') || filePath.includes('/dist/')) process.exit(0)

  execFileSync('pnpm', ['exec', 'prettier', '--write', '--log-level', 'silent', filePath], {
    cwd: process.env.CLAUDE_PROJECT_DIR ?? process.cwd(),
    timeout: 20_000,
    stdio: 'ignore',
  })
} catch {
  // Soft fail by design.
}
process.exit(0)
