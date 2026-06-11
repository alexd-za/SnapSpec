import type { HTMLAttributes, ReactNode } from 'react'

type MossPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  glass?: boolean
}

/** The standard SpecSnap surface: a sheet of good paper with a soft shadow. */
export function MossPanel({ children, glass = false, className = '', ...rest }: MossPanelProps) {
  return (
    <div
      {...rest}
      className={`paper-grain sheet rounded-lg ${glass ? 'bg-surface/85 backdrop-blur-md' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
