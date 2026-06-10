/** Horizontal divider drawn like the midrib and veins of a leaf. */
export function LeafVeinDivider({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`mx-auto block h-8 w-full max-w-sm text-accent ${className}`}
      viewBox="0 0 240 32"
      aria-hidden="true"
    >
      <path d="M10 16 H 230" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path
        d="M70 16 q 6 -9 14 -12 M70 16 q 6 9 14 12 M120 16 q 6 -9 14 -12 M120 16 q 6 9 14 12 M170 16 q 6 -9 14 -12 M170 16 q 6 9 14 12"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      <circle cx="10" cy="16" r="2" fill="currentColor" />
      <circle cx="230" cy="16" r="2" fill="currentColor" />
    </svg>
  )
}
