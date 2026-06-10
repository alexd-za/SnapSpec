/**
 * Re-compresses every SVG in public/generated/svg to .svgz using Node zlib.
 * Run: pnpm assets:compress
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const ROOT = process.cwd()
const SVG_DIR = join(ROOT, 'public/generated/svg')
const SVGZ_DIR = join(ROOT, 'public/generated/svgz')

mkdirSync(SVGZ_DIR, { recursive: true })

const files = readdirSync(SVG_DIR).filter((f) => f.endsWith('.svg'))
let total = 0
let compressedTotal = 0

for (const file of files) {
  const svg = readFileSync(join(SVG_DIR, file))
  const gz = gzipSync(svg, { level: 9 })
  writeFileSync(join(SVGZ_DIR, file.replace(/\.svg$/, '.svgz')), gz)
  total += svg.length
  compressedTotal += gz.length
}

const ratio = total ? ((1 - compressedTotal / total) * 100).toFixed(1) : '0'
console.log(`Compressed ${files.length} SVGs → SVGZ (${total} → ${compressedTotal} bytes, ${ratio}% smaller).`)
