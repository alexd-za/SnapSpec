import { resolve, sep } from 'node:path'

/**
 * All SpecSnap MCP servers may only touch files inside the project root.
 * The root is the cwd the server was launched from (the repo).
 */
export const PROJECT_ROOT = process.cwd()

export function safePath(relative: string): string {
  const full = resolve(PROJECT_ROOT, relative)
  if (full !== PROJECT_ROOT && !full.startsWith(PROJECT_ROOT + sep)) {
    throw new Error(`Refusing to access path outside project root: ${relative}`)
  }
  return full
}

export function ok(payload: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2),
      },
    ],
  }
}
