import { motion } from 'framer-motion'
import { useMotionPref } from '../../lib/hooks/useMotionPref'

const CHIPS = [
  {
    src: '/generated/svg/17-formula-block.svg',
    label: 'formulas',
    className: '-left-7 top-24 sm:-left-16',
    duration: 5.2,
    delay: 0,
  },
  {
    src: '/generated/svg/18-quote-block.svg',
    label: 'quotes',
    className: '-right-5 top-56 sm:-right-12',
    duration: 6.4,
    delay: 1.2,
  },
  {
    src: '/generated/svg/22-flashcard-block.svg',
    label: 'flashcards',
    className: '-left-4 bottom-10 sm:-left-12',
    duration: 5.8,
    delay: 2.1,
  },
]

/** Little artifact chips bobbing around the hero demo — what the parser grows. */
export function FloatingChips() {
  const animate = useMotionPref()
  return (
    <>
      {CHIPS.map((chip) => (
        <motion.div
          key={chip.label}
          className={`float-panel absolute z-10 hidden items-center gap-1.5 rounded-full py-1 pl-1 pr-3 sm:flex ${chip.className}`}
          animate={animate ? { y: [0, -9, 0] } : undefined}
          transition={{
            duration: chip.duration,
            delay: chip.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          aria-hidden="true"
        >
          <img src={chip.src} alt="" className="h-7 w-7 rounded-full" />
          <span className="annotation text-[12px]">{chip.label}</span>
        </motion.div>
      ))}
    </>
  )
}
