import { useEffect } from 'react'
import type { AccentTheme } from '../model/types'

/** Applies an accent palette to the document root. */
export function useAccent(accent: AccentTheme) {
  useEffect(() => {
    document.documentElement.dataset.accent = accent
  }, [accent])
}
