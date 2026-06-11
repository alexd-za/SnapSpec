import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useMotionPref } from '../../lib/hooks/useMotionPref'

const LEAFLETS = [0.18, 0.32, 0.46, 0.6, 0.74, 0.88]

/**
 * A vine that grows down the left margin as the page scrolls — one living
 * thread connecting every section. Leaflets unfurl as growth passes them.
 * Fixed, decorative, desktop-only; full-grown when motion is reduced.
 */
export function GrowingVine() {
  const animate = useMotionPref()
  const { scrollYProgress } = useScroll()
  const growth = useSpring(scrollYProgress, { stiffness: 60, damping: 20 })
  const pathLength = useTransform(growth, [0, 0.95], [0.06, 1])

  return (
    <div
      className="pointer-events-none fixed bottom-0 top-0 z-0 hidden w-12 lg:block"
      style={{ left: 'max(0.5rem, calc(50% - 39rem))' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 1000" preserveAspectRatio="none" className="h-full w-full">
        <motion.path
          d="M24 0 C 16 120, 32 220, 22 340 C 14 440, 34 540, 24 660 C 16 770, 30 880, 24 1000"
          fill="none"
          stroke="var(--sn-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.35"
          style={animate ? { pathLength } : { pathLength: 1 }}
        />
      </svg>
      {LEAFLETS.map((at, i) => (
        <Leaflet key={at} at={at} flip={i % 2 === 1} growth={growth} animate={animate} />
      ))}
    </div>
  )
}

function Leaflet({
  at,
  flip,
  growth,
  animate,
}: {
  at: number
  flip: boolean
  growth: ReturnType<typeof useSpring>
  animate: boolean
}) {
  // Unfurl just after the vine tip passes this point.
  const scale = useTransform(growth, [at * 0.95 - 0.06, at * 0.95], [0, 1])
  const opacity = useTransform(growth, [at * 0.95 - 0.06, at * 0.95], [0, 0.5])
  return (
    <motion.svg
      viewBox="0 0 24 16"
      className={`absolute h-4 w-6 ${flip ? '-scale-x-100' : ''}`}
      style={{
        top: `${at * 100}%`,
        left: flip ? 2 : 22,
        transformOrigin: flip ? 'right center' : 'left center',
        ...(animate ? { scale, opacity } : { opacity: 0.5 }),
      }}
      aria-hidden="true"
    >
      <path
        d="M1 14 C 6 4, 16 1, 23 2 C 20 10, 12 15, 1 14 Z"
        fill="var(--sn-accent)"
        opacity="0.55"
      />
      <path d="M2 13 C 9 9, 15 6, 21 3" stroke="var(--sn-bg)" strokeWidth="0.8" fill="none" />
    </motion.svg>
  )
}
