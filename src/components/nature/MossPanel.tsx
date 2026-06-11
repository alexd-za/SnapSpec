import type { HTMLAttributes, ReactNode } from 'react'

type MossPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  glass?: boolean
}

/** The standard surface: a breath of light floating on the canvas — no border seams. */
export function MossPanel({ children, glass: _glass, className = '', ...rest }: MossPanelProps) {
  return (
    <div {...rest} className={`float-panel rounded-2xl ${className}`}>
      {children}
    </div>
  )
}
