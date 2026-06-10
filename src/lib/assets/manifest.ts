export type AssetManifestEntry = {
  file: string
  title: string
  desc: string
  svgPath: string
  svgzPath: string
  svgBytes: number
  svgzBytes: number
}

export type AssetManifest = {
  app: 'specsnap'
  generatedAt: string
  count: number
  assets: AssetManifestEntry[]
}

export function buildManifest(entries: AssetManifestEntry[]): AssetManifest {
  return {
    app: 'specsnap',
    generatedAt: new Date().toISOString(),
    count: entries.length,
    assets: entries,
  }
}
