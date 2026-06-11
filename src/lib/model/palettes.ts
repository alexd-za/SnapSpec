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
    description: 'Deep canopy, luminous fern.',
    dark: true,
    bg: '#0d1a12',
    surface: '#18281d',
    text: '#edf3e8',
    muted: '#9db3a0',
    accent: '#6cc287',
  },
  mist: {
    id: 'mist',
    name: 'Mist',
    description: 'Dusk fog, river-blue light.',
    dark: true,
    bg: '#10171c',
    surface: '#1a2730',
    text: '#ecf1f4',
    muted: '#9fb2bd',
    accent: '#7cc1e4',
  },
  sunlit: {
    id: 'sunlit',
    name: 'Sunlit',
    description: 'Late-evening amber woods.',
    dark: true,
    bg: '#1a1409',
    surface: '#2c2212',
    text: '#f5efe2',
    muted: '#bcab8d',
    accent: '#e3b04f',
  },
  river: {
    id: 'river',
    name: 'River',
    description: 'Deep water, glacial cyan.',
    dark: true,
    bg: '#0b151d',
    surface: '#152532',
    text: '#e9f1f5',
    muted: '#92a9b6',
    accent: '#5fd0e0',
  },
  bloom: {
    id: 'bloom',
    name: 'Bloom',
    description: 'Midnight garden, wildflower violet.',
    dark: true,
    bg: '#160f16',
    surface: '#281b29',
    text: '#f4edf2',
    muted: '#b3a0b0',
    accent: '#cd9aea',
  },
}

export const ACCENT_THEMES = Object.keys(PALETTES) as AccentTheme[]
export const DEFAULT_ACCENT: AccentTheme = 'forest'
