import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const VARIANTS = {
  primary:
    'bg-accent text-bg font-semibold hover:brightness-110 active:brightness-95 shadow-[0_2px_16px_-4px_var(--sn-accent)]',
  ghost: 'text-ink hover:bg-mist/10',
  outline: 'border border-mist/30 text-ink hover:border-accent/60 hover:text-accent',
  danger: 'border border-red-400/40 text-red-300 hover:bg-red-400/10',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
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
      className={`inline-flex cursor-pointer items-center justify-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </button>
  )
}
