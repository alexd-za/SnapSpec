import { useEffect, useState } from 'react'
import { useSnapStore } from '../storage/store'

/**
 * Single source of truth for "should we animate?".
 * Respects both the OS prefers-reduced-motion setting and the in-app toggle.
 */
export function useMotionPref(): boolean {
  const reducedSetting = useSnapStore((s) => s.settings.reducedMotion)
  const [osReduced, setOsReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setOsReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const reduced = reducedSetting || osReduced

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedSetting)
  }, [reducedSetting])

  return !reduced
}
