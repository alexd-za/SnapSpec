import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSnapStore } from '../../lib/storage/store'
import { useMotionPref } from '../../lib/hooks/useMotionPref'

const PHRASES = ['Messy notes.', 'Clear structure.', 'Beautiful explainer.']

/**
 * First-load intro: the leaf-vein logo grows, three phrases fade through,
 * then the homepage appears. Skippable; seen-state stored locally.
 */
export function IntroSequence() {
  const introSeen = useSnapStore((s) => s.settings.introSeen)
  const setSettings = useSnapStore((s) => s.setSettings)
  const animate = useMotionPref()
  const [phrase, setPhrase] = useState(0)
  const [done, setDone] = useState(introSeen)

  useEffect(() => {
    if (done) return
    if (!animate) {
      finish()
      return
    }
    const interval = setInterval(() => {
      setPhrase((p) => {
        if (p >= PHRASES.length - 1) {
          clearInterval(interval)
          setTimeout(finish, 900)
          return p
        }
        return p + 1
      })
    }, 1100)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, animate])

  function finish() {
    setDone(true)
    setSettings({ introSeen: true })
  }

  if (done) return null

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-bg"
        exit={{ opacity: 0 }}
        role="dialog"
        aria-label="SpecSnap intro"
      >
        <svg width="96" height="96" viewBox="0 0 48 48" className="text-accent" aria-hidden="true">
          <motion.circle
            cx="24"
            cy="24"
            r="21"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.35"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
          {[
            'M24 37 C 22 27, 23 18, 24 11',
            'M24 29 C 28 26, 31 23, 32.5 19',
            'M24 24 C 20 21.5, 17.5 19, 16 15',
            'M24 18 C 27 16, 28.5 13.5, 29.5 11',
          ].map((d, i) => (
            <motion.path
              key={d}
              d={d}
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.25, ease: 'easeOut' }}
            />
          ))}
        </svg>

        <div className="h-12 text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={phrase}
              className={`font-serif text-3xl ${phrase === PHRASES.length - 1 ? 'italic text-accent' : 'text-ink'}`}
              style={
                phrase === PHRASES.length - 1 ? { fontVariationSettings: "'SOFT' 80" } : undefined
              }
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {PHRASES[phrase]}
            </motion.p>
          </AnimatePresence>
        </div>

        <button
          onClick={finish}
          className="annotation absolute bottom-8 cursor-pointer rounded-sm px-4 py-2 text-base underline decoration-accent/50 decoration-2 underline-offset-4 transition-colors hover:text-accent"
        >
          skip intro →
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
