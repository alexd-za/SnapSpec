import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMotionPref } from '../../lib/hooks/useMotionPref'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
}

/** Soft rise-and-fade entrance with a reduced-motion fallback. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const animate = useMotionPref()
  if (!animate) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.65, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Scroll-triggered rise: animates the first time it enters the viewport. */
export function RevealInView({
  children,
  delay = 0,
  y = 26,
  className,
}: RevealProps & { y?: number }) {
  const animate = useMotionPref()
  if (!animate) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.65, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Headline words rising from behind a baseline, one after another.
    Screen readers and text queries get the plain string; the animated
    copy is decorative. */
export function WordRise({ text, delay = 0 }: { text: string; delay?: number }) {
  const animate = useMotionPref()
  if (!animate) return <span>{text}</span>
  const words = text.split(' ')
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: delay + i * 0.07, ease: [0.21, 0.65, 0.36, 1] }}
            >
              {word}
            </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </>
  )
}

/** Cascading reveal for lists of generated blocks. */
export function CascadeItem({
  children,
  index,
  className,
}: {
  children: ReactNode
  index: number
  className?: string
}) {
  const animate = useMotionPref()
  if (!animate) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.08, 0.8),
        ease: [0.21, 0.65, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
