#!/usr/bin/env node
/**
 * PreToolUse hook (Bash): blocks destructive or secret-leaking commands.
 * Exit 2 = deny the tool call and tell Claude why.
 */
import { readFileSync } from 'node:fs'

const PATTERNS = [
  [/\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r)[a-z]*\s+(\/|~)(\s|$)/i, 'recursive delete of / or ~'],
  [/\brm\s+-rf?\s+\/(?!tmp\b|home\/user)/i, 'recursive delete near filesystem root'],
  [/\bsudo\s+rm\b/i, 'sudo rm'],
  [/\b(curl|wget)\b[^|;&]*\|\s*(ba|z|da)?sh\b/i, 'piping a download into a shell'],
  [/\bcat\s+[^\s]*\.env\b/i, 'reading .env secrets'],
  [/^\s*printenv\b|\|\s*printenv\b|&&\s*printenv\b/i, 'dumping the environment'],
  [/^\s*env\s*$/i, 'dumping the environment'],
  [/\bgit\s+reset\s+--hard\b/i, 'git reset --hard (destroys local changes)'],
  [/\bgit\s+clean\s+-[a-z]*f/i, 'git clean -f (deletes untracked files)'],
  [/>\s*\/(etc|usr|bin|sbin|lib|root|boot)\//i, 'writing outside the repo'],
]

try {
  const input = JSON.parse(readFileSync(0, 'utf8'))
  const command = input?.tool_input?.command ?? ''
  for (const [pattern, reason] of PATTERNS) {
    if (pattern.test(command)) {
      console.error(`Blocked dangerous command (${reason}). Use a safer, scoped alternative.`)
      process.exit(2)
    }
  }
} catch {
  // Unparseable input: allow rather than break the session.
}
process.exit(0)
