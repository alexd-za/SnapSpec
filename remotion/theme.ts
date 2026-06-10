import { PALETTES } from '../src/lib/model/palettes'
import type { AccentTheme } from '../src/lib/model/types'

export function videoTheme(accent: AccentTheme = 'forest') {
  return PALETTES[accent]
}

export const SERIF = "Georgia, 'Times New Roman', serif"
export const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif"

export const FPS = 30
export const THIRTY_SECONDS = 30 * FPS
