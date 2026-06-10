import { useSnapStore } from './store'

/**
 * Local-first persistence helpers. All data lives in localStorage under
 * the `specsnap-store` key — no cloud, no accounts, no telemetry.
 */

export function exportStorageAsJson(): string {
  const { projects, settings } = useSnapStore.getState()
  return JSON.stringify({ app: 'specsnap', version: 1, projects, settings }, null, 2)
}

export function downloadStorageBackup() {
  downloadFile('specsnap-backup.json', exportStorageAsJson(), 'application/json')
}

export function downloadFile(name: string, content: string | Blob, mime = 'text/plain') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
