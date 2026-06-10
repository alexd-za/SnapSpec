/** The SpecSnap leaf-vein mark, drawable for the intro animation. */
export function LogoMark({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`text-accent ${className}`}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M24 37 C 22 27, 23 18, 24 11" />
        <path d="M24 29 C 28 26, 31 23, 32.5 19" />
        <path d="M24 24 C 20 21.5, 17.5 19, 16 15" />
        <path d="M24 18 C 27 16, 28.5 13.5, 29.5 11" />
      </g>
    </svg>
  )
}
