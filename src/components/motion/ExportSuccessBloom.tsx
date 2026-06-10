import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useMotionPref } from '../../lib/hooks/useMotionPref'

/** A small bloom of leaves + check that confirms a successful export. */
export function ExportSuccessBloom({ show, label }: { show: boolean; label: string }) {
  const animate = useMotionPref()
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2"
          initial={animate ? { opacity: 0, y: 16, scale: 0.92 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          role="status"
          aria-live="polite"
        >
          <div className="relative flex items-center gap-2.5 rounded-full border border-accent/50 bg-surface px-5 py-2.5 shadow-xl">
            {animate && (
              <span className="absolute inset-0" aria-hidden>
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <motion.span
                    key={deg}
                    className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-accent"
                    initial={{ x: 0, y: 0, opacity: 0.9 }}
                    animate={{
                      x: Math.cos((deg * Math.PI) / 180) * 46,
                      y: Math.sin((deg * Math.PI) / 180) * 30,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  />
                ))}
              </span>
            )}
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-bg">
              <Check size={14} aria-hidden />
            </span>
            <span className="text-sm font-medium">{label}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
