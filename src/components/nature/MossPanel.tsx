import type { HTMLAttributes, ReactNode } from 'react'

type MossPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  glass?: boolean
}

/** The standard SpecSnap surface: rounded, bordered, paper-grained. */
export function MossPanel({ children, glass = false, className = '', ...rest }: MossPanelProps) {
  return (
    <div
      {...rest}
      className={`paper-grain rounded-2xl border border-mist/20 ${
        glass ? 'bg-surface/70 backdrop-blur-md' : 'bg-surface'
      } ${className}`}
    >
      {children}
    </div>
  )
}
