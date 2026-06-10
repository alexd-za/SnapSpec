import type { SnapProject } from '../model/types'

export function exportJson(project: SnapProject): string {
  return JSON.stringify(
    { app: 'specsnap', version: 1, exportedAt: new Date().toISOString(), project },
    null,
    2,
  )
}
