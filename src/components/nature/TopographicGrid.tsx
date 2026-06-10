/** Faint topographic contour lines fused with a grid — the signature backdrop motif. */
export function TopographicGrid({ className = '' }: { className?: string }) {
  const contours = Array.from({ length: 6 }, (_, i) => {
    const y = 80 + i * 110
    return (
      <path
        key={i}
        d={`M0 ${y} Q 240 ${y - 36}, 480 ${y} T 960 ${y} T 1440 ${y}`}
        fill="none"
        stroke="var(--sn-accent)"
        strokeWidth="1"
        opacity={0.05 + i * 0.012}
      />
    )
  })
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {contours}
      <g stroke="var(--sn-muted)" strokeWidth="0.5" opacity="0.06">
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={i * 144} y1="0" x2={i * 144} y2="760" />
        ))}
      </g>
    </svg>
  )
}
