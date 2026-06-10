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

export const PALETTES: Record<AccentTheme, Palette> = {
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Deep charcoal green, warm ivory, fern accent.',
    dark: true,
    bg: '#141b16',
    surface: '#1c2620',
    text: '#f2eee3',
    muted: '#93a596',
    accent: '#5dbb6e',
  },
  mist: {
    id: 'mist',
    name: 'Mist',
    description: 'Off-white mist, deep slate, river-blue accent.',
    dark: false,
    bg: '#f2f4f2',
    surface: '#ffffff',
    text: '#26333b',
    muted: '#7d8a8d',
    accent: '#3a7ca5',
  },
  sunlit: {
    id: 'sunlit',
    name: 'Sunlit',
    description: 'Warm parchment, bark brown, honey amber accent.',
    dark: false,
    bg: '#f6efdf',
    surface: '#fdf8ec',
    text: '#4a3826',
    muted: '#a39272',
    accent: '#b97d12',
  },
  river: {
    id: 'river',
    name: 'River',
    description: 'Deep blue slate, pale mist, glacial cyan accent.',
    dark: true,
    bg: '#131c24',
    surface: '#18242f',
    text: '#e8eef2',
    muted: '#8298a6',
    accent: '#4ecbd9',
  },
  bloom: {
    id: 'bloom',
    name: 'Bloom',
    description: 'Dark plum-brown, muted clay, wildflower violet accent.',
    dark: true,
    bg: '#211a20',
    surface: '#2c2329',
    text: '#f3ece9',
    muted: '#a18d96',
    accent: '#b07fd9',
  },
}

export const ACCENT_THEMES = Object.keys(PALETTES) as AccentTheme[]
export const DEFAULT_ACCENT: AccentTheme = 'forest'
