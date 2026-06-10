import type { HTMLAttributes, ReactNode } from 'react'

type MossPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  glass?: boolean
}

/** The standard SpecSnap surface: a paper card with a hairline ink border. */
export function MossPanel({ children, glass = false, className = '', ...rest }: MossPanelProps) {
  return (
    <div
      {...rest}
      className={`paper-grain rounded-md border border-ink/15 ${
        glass ? 'bg-surface/80 backdrop-blur-md' : 'bg-surface'
      } ${className}`}
    >
      {children}
    </div>
  )
}
