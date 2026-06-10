/**
 * Generates the full SVG asset set into public/generated/svg, optimizes with
 * SVGO, and writes the asset manifest (JSON + Markdown).
 * Run: pnpm assets:generate
 */
import { mkdirSync, writeFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { optimize } from 'svgo'
import { buildAllAssets } from '../src/lib/assets/svgFactory'
import { buildManifest, type AssetManifestEntry } from '../src/lib/assets/manifest'

const ROOT = process.cwd()
const SVG_DIR = join(ROOT, 'public/generated/svg')
const SVGZ_DIR = join(ROOT, 'public/generated/svgz')

mkdirSync(SVG_DIR, { recursive: true })
mkdirSync(SVGZ_DIR, { recursive: true })

const assets = buildAllAssets()
const entries: AssetManifestEntry[] = []

for (const asset of assets) {
  const optimized = optimize(asset.svg, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // Keep accessibility metadata and viewBox — required by the spec.
            removeTitle: false,
            removeDesc: false,
            removeViewBox: false,
            removeUnknownsAndDefaults: { keepRoleAttr: true },
          },
        },
      },
    ],
  }).data

  const svgPath = join(SVG_DIR, asset.file)
  writeFileSync(svgPath, optimized)

  const svgzFile = asset.file.replace(/\.svg$/, '.svgz')
  const svgzPath = join(SVGZ_DIR, svgzFile)
  writeFileSync(svgzPath, gzipSync(optimized, { level: 9 }))

  entries.push({
    file: asset.file,
    title: asset.title,
    desc: asset.desc,
    svgPath: `public/generated/svg/${asset.file}`,
    svgzPath: `public/generated/svgz/${svgzFile}`,
    svgBytes: statSync(svgPath).size,
    svgzBytes: statSync(svgzPath).size,
  })
}

const manifest = buildManifest(entries)
writeFileSync(
  join(ROOT, 'public/generated/ASSET_MANIFEST.json'),
  JSON.stringify(manifest, null, 2),
)

const md = [
  '# SpecSnap Asset Manifest',
  '',
  `Generated: ${manifest.generatedAt}`,
  `Assets: ${manifest.count} SVG + ${manifest.count} SVGZ`,
  '',
  'Every asset has `<title>`, `<desc>`, and `viewBox`, is SVGO-optimized, and is gzip-compressed to `.svgz`.',
  '',
  '| # | File | Title | SVG bytes | SVGZ bytes |',
  '| --- | --- | --- | --- | --- |',
  ...entries.map(
    (e, i) => `| ${i + 1} | \`${e.file}\` | ${e.title} | ${e.svgBytes} | ${e.svgzBytes} |`,
  ),
  '',
  'Regenerate with `pnpm assets:generate`, validate with `pnpm assets:check`.',
  '',
].join('\n')
writeFileSync(join(ROOT, 'ASSET_MANIFEST.md'), md)

if (!existsSync(join(ROOT, 'public/generated/posters'))) {
  mkdirSync(join(ROOT, 'public/generated/posters'), { recursive: true })
}

console.log(`Generated ${entries.length} SVG + ${entries.length} SVGZ assets.`)
console.log('Manifest: public/generated/ASSET_MANIFEST.json and ASSET_MANIFEST.md')
