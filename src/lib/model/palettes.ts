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
    description: 'Deep green ink on warm paper.',
    dark: false,
    bg: '#ece5d3',
    surface: '#f6f2e6',
    text: '#1e2a1f',
    muted: '#66725f',
    accent: '#366f41',
  },
  mist: {
    id: 'mist',
    name: 'Mist',
    description: 'Slate ink on cool fog paper.',
    dark: false,
    bg: '#eef0ef',
    surface: '#fafbfa',
    text: '#26333b',
    muted: '#74838a',
    accent: '#34688c',
  },
  sunlit: {
    id: 'sunlit',
    name: 'Sunlit',
    description: 'Bark ink on amber parchment.',
    dark: false,
    bg: '#f3e9d2',
    surface: '#faf4e3',
    text: '#46351f',
    muted: '#97865f',
    accent: '#a86c0c',
  },
  river: {
    id: 'river',
    name: 'River',
    description: 'Pale mist ink on deep blue slate.',
    dark: true,
    bg: '#15202a',
    surface: '#1b2934',
    text: '#e8eef2',
    muted: '#8298a6',
    accent: '#56c8d5',
  },
  bloom: {
    id: 'bloom',
    name: 'Bloom',
    description: 'Ivory ink on dark plum.',
    dark: true,
    bg: '#231b22',
    surface: '#2e242b',
    text: '#f3ece9',
    muted: '#a18d96',
    accent: '#c08fe2',
  },
}

export const ACCENT_THEMES = Object.keys(PALETTES) as AccentTheme[]
export const DEFAULT_ACCENT: AccentTheme = 'forest'
