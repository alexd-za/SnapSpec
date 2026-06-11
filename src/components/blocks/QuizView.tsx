import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import type { QuizBlock } from '../../lib/model/types'
import { useMotionPref } from '../../lib/hooks/useMotionPref'

/** Quiz with per-question answer reveal animation. */
export function QuizView({ block }: { block: QuizBlock }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const animate = useMotionPref()

  function toggle(i: number) {
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <ol className="space-y-4">
      {block.questions.map((q, i) => {
        const open = revealed.has(i)
        return (
          <li key={i} className="rounded-xl bg-ink/4 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">
                <span className="mr-2 text-accent">{i + 1}.</span>
                {q.prompt}
              </p>
              <button
                onClick={() => toggle(i)}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-ink/6 px-2.5 py-1 text-xs text-mist transition-colors hover:text-accent"
                aria-expanded={open}
              >
                {open ? <EyeOff size={13} aria-hidden /> : <Eye size={13} aria-hidden />}
                {open ? 'Hide' : 'Answer'}
              </button>
            </div>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={animate ? { height: 0, opacity: 0 } : false}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={animate ? { height: 0, opacity: 0 } : undefined}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 border-l-2 border-accent pl-3 text-sm">{q.answer}</p>
                  {q.memo && <p className="mt-1.5 pl-3 text-xs text-mist">{q.memo}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ol>
  )
}
