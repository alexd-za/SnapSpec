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
      transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.8), ease: [0.21, 0.65, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
