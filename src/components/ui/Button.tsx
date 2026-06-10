import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

/* Stamp-style buttons: hard offset ink shadow, square corners, no glow. */
const VARIANTS = {
  primary: 'stamp bg-accent text-surface font-semibold',
  ghost: 'text-ink hover:bg-ink/8',
  outline: 'stamp bg-surface text-ink',
  danger: 'border border-red-700/50 text-red-700 hover:bg-red-700/10',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      {...rest}
      className={`inline-flex cursor-pointer items-center justify-center rounded-sm transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </button>
  )
}
