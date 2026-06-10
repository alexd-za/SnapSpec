import { describe, expect, it } from 'vitest'
import { gzipSync, gunzipSync } from 'node:zlib'
import { buildAllAssets } from './svgFactory'
import { buildManifest } from './manifest'

describe('svgFactory', () => {
  const assets = buildAllAssets()

  it('generates exactly 40 assets', () => {
    expect(assets).toHaveLength(40)
  })

  it('gives every asset a unique numbered file name', () => {
    const files = assets.map((a) => a.file)
    expect(new Set(files).size).toBe(40)
    expect(files[0]).toBe('01-specsnap-logo.svg')
    expect(files[39]).toBe('40-loading-seed.svg')
  })

  it('includes title, desc, and viewBox in every SVG', () => {
    for (const asset of assets) {
      expect(asset.svg, asset.file).toContain('<title')
      expect(asset.svg, asset.file).toContain('<desc')
      expect(asset.svg, asset.file).toContain('viewBox=')
      expect(asset.svg, asset.file).not.toContain('<image')
    }
  })
})

describe('SVGZ compression (zlib)', () => {
  it('round-trips an SVG through gzip', () => {
    const svg = buildAllAssets()[0].svg
    const compressed = gzipSync(svg, { level: 9 })
    expect(compressed.length).toBeLessThan(Buffer.byteLength(svg))
    expect(gunzipSync(compressed).toString('utf8')).toBe(svg)
  })
})

describe('buildManifest', () => {
  it('records count and entries', () => {
    const manifest = buildManifest([
      {
        file: 'a.svg',
        title: 'A',
        desc: 'd',
        svgPath: 'svg/a.svg',
        svgzPath: 'svgz/a.svgz',
        svgBytes: 10,
        svgzBytes: 5,
      },
    ])
    expect(manifest.app).toBe('specsnap')
    expect(manifest.count).toBe(1)
    expect(manifest.assets[0].svgzPath).toBe('svgz/a.svgz')
  })
})
