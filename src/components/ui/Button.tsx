import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

/* Organic luminous buttons — rounded, soft depth, no hard edges. */
const VARIANTS = {
  primary: 'btn-organic font-semibold',
  ghost: 'btn-ghost text-ink',
  outline: 'btn-ghost text-ink',
  danger: 'rounded-full bg-red-400/15 text-red-300 transition-colors hover:bg-red-400/25',
}

const SIZES = {
  sm: 'px-4 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2 text-sm gap-2',
  lg: 'px-7 py-3 text-base gap-2',
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
      className={`inline-flex cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </button>
  )
}
