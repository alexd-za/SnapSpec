import { useEffect, useState } from 'react'
import type { AssetManifest } from '../../lib/assets/manifest'
import { SkeletonBlock } from '../ui/Skeletons'
import { MossPanel } from '../nature/MossPanel'

/** Reads the generated asset manifest and shows the SVG/SVGZ pipeline status. */
export function AssetManifestPanel() {
  const [manifest, setManifest] = useState<AssetManifest | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading')

  useEffect(() => {
    fetch('/generated/ASSET_MANIFEST.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('missing'))))
      .then((m: AssetManifest) => {
        setManifest(m)
        setStatus('ready')
      })
      .catch(() => setStatus('missing'))
  }, [])

  if (status === 'loading') return <SkeletonBlock lines={4} />

  if (status === 'missing' || !manifest) {
    return (
      <MossPanel className="p-5 text-sm text-mist">
        Asset manifest not found. Run <code className="text-accent">pnpm assets:generate</code> to
        build the 40 SVG/SVGZ assets.
      </MossPanel>
    )
  }

  const svgTotal = manifest.assets.reduce((n, a) => n + a.svgBytes, 0)
  const svgzTotal = manifest.assets.reduce((n, a) => n + a.svgzBytes, 0)

  return (
    <MossPanel className="p-5">
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        <span>
          <strong className="text-accent">{manifest.count}</strong> SVG +{' '}
          <strong className="text-accent">{manifest.count}</strong> SVGZ
        </span>
        <span className="text-mist">
          {(svgTotal / 1024).toFixed(1)} KB → {(svgzTotal / 1024).toFixed(1)} KB gzipped
        </span>
        <span className="text-xs text-mist">
          generated {new Date(manifest.generatedAt).toLocaleString()}
        </span>
      </div>
      <div className="grid max-h-72 grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 md:grid-cols-8">
        {manifest.assets.map((asset) => (
          <a
            key={asset.file}
            href={`/generated/svg/${asset.file}`}
            target="_blank"
            rel="noreferrer"
            title={`${asset.title} — ${asset.desc}`}
            className="group rounded-xl border border-mist/15 bg-bg/40 p-1.5 transition-colors hover:border-accent/50"
          >
            <img
              src={`/generated/svg/${asset.file}`}
              alt={asset.title}
              loading="lazy"
              className="aspect-square w-full rounded-lg"
            />
          </a>
        ))}
      </div>
    </MossPanel>
  )
}
