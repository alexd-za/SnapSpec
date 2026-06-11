import type { AccentTheme } from './types'

export type Palette = {
  id: AccentTheme
  name: string
  description: string
  dark: boolean
  bg: string
  surface: string
  text: string
  muted: string
  accent: string
}

/* Keep in sync with the data-accent blocks in src/styles/globals.css. */
export const PALETTES: Record<AccentTheme, Palette> = {
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'White paper, fern ink.',
    dark: false,
    bg: '#fbfaf6',
    surface: '#ffffff',
    text: '#202c23',
    muted: '#6e7d6e',
    accent: '#3e7c4f',
  },
  mist: {
    id: 'mist',
    name: 'Mist',
    description: 'Cool white, river-blue ink.',
    dark: false,
    bg: '#f9fafb',
    surface: '#ffffff',
    text: '#233038',
    muted: '#71818b',
    accent: '#38749b',
  },
  sunlit: {
    id: 'sunlit',
    name: 'Sunlit',
    description: 'Warm white, honey ink.',
    dark: false,
    bg: '#fdfaf2',
    surface: '#ffffff',
    text: '#3a3122',
    muted: '#93846a',
    accent: '#a8730e',
  },
  river: {
    id: 'river',
    name: 'River',
    description: 'Glacial white, deep teal ink.',
    dark: false,
    bg: '#f7fafa',
    surface: '#ffffff',
    text: '#1e2e34',
    muted: '#698590',
    accent: '#1e7c8c',
  },
  bloom: {
    id: 'bloom',
    name: 'Bloom',
    description: 'Blossom white, wild-rose ink.',
    dark: false,
    bg: '#fcf9f8',
    surface: '#ffffff',
    text: '#322327',
    muted: '#92797e',
    accent: '#b04f63',
  },
}

export const ACCENT_THEMES = Object.keys(PALETTES) as AccentTheme[]
export const DEFAULT_ACCENT: AccentTheme = 'forest'
