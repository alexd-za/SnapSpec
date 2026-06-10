/**
 * Validates the generated asset set:
 *  - 40 SVGs and 40 SVGZs exist
 *  - manifest exists and its count matches the files on disk
 *  - every SVG has <title>, <desc>, and viewBox
 *  - every SVGZ is valid gzip that decompresses to SVG
 * Run: pnpm assets:check
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gunzipSync } from 'node:zlib'

const ROOT = process.cwd()
const SVG_DIR = join(ROOT, 'public/generated/svg')
const SVGZ_DIR = join(ROOT, 'public/generated/svgz')
const MANIFEST = join(ROOT, 'public/generated/ASSET_MANIFEST.json')
const EXPECTED = 40

const errors: string[] = []

if (!existsSync(SVG_DIR)) errors.push('Missing public/generated/svg — run pnpm assets:generate')
if (!existsSync(SVGZ_DIR)) errors.push('Missing public/generated/svgz')
if (!existsSync(MANIFEST)) errors.push('Missing ASSET_MANIFEST.json')

if (errors.length === 0) {
  const svgs = readdirSync(SVG_DIR).filter((f) => f.endsWith('.svg'))
  const svgzs = readdirSync(SVGZ_DIR).filter((f) => f.endsWith('.svgz'))

  if (svgs.length !== EXPECTED) errors.push(`Expected ${EXPECTED} SVGs, found ${svgs.length}`)
  if (svgzs.length !== EXPECTED) errors.push(`Expected ${EXPECTED} SVGZs, found ${svgzs.length}`)

  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
  if (manifest.count !== svgs.length) {
    errors.push(`Manifest count ${manifest.count} does not match ${svgs.length} SVG files`)
  }

  for (const file of svgs) {
    const content = readFileSync(join(SVG_DIR, file), 'utf8')
    if (!/<title[\s>]/.test(content)) errors.push(`${file}: missing <title>`)
    if (!/<desc[\s>]/.test(content)) errors.push(`${file}: missing <desc>`)
    if (!/viewBox=/.test(content)) errors.push(`${file}: missing viewBox`)
    if (/<image[\s>]/.test(content)) errors.push(`${file}: contains external image`)
  }

  for (const file of svgzs) {
    try {
      const decompressed = gunzipSync(readFileSync(join(SVGZ_DIR, file))).toString('utf8')
      if (!decompressed.includes('<svg')) errors.push(`${file}: gunzip output is not SVG`)
    } catch {
      errors.push(`${file}: not valid gzip`)
    }
  }
}

if (errors.length > 0) {
  console.error('Asset check FAILED:')
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}

console.log(`Asset check passed: ${EXPECTED} SVG + ${EXPECTED} SVGZ, manifest consistent, a11y metadata present.`)
