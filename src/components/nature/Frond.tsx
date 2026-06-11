import { useMotionPref } from '../../lib/hooks/useMotionPref'

/**
 * A delicate botanical frond — curved stem with paired leaflets.
 * Decorative, low-opacity, sways gently unless motion is reduced.
 */
export function Frond({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  const animate = useMotionPref()
  const leaflets = Array.from({ length: 7 }, (_, i) => {
    const t = (i + 1) / 8
    // points along a gentle curve from base (bottom) to tip (top)
    const x = 60 + Math.sin(t * 1.9) * 34
    const y = 230 - t * 200
    const len = 34 * (1 - t * 0.55)
    const angle = -38 - t * 14
    return { x, y, len, angle }
  })
  return (
    <svg
      viewBox="0 0 140 240"
      aria-hidden="true"
      className={`${animate ? 'sway' : ''} ${flip ? '-scale-x-100' : ''} ${className}`}
      fill="none"
      stroke="var(--sn-accent)"
    >
      <path
        d="M58 236 C 66 180, 88 120, 96 28"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.9"
      />
      {leaflets.map((l, i) => (
        <g key={i}>
          <path
            d={`M ${l.x} ${l.y} q ${-l.len * 0.7} ${-l.len * 0.45} ${-l.len} ${-l.len * 0.1}`}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.8"
            transform={`rotate(${l.angle * 0.1} ${l.x} ${l.y})`}
          />
          <path
            d={`M ${l.x} ${l.y} q ${l.len * 0.55} ${-l.len * 0.5} ${l.len * 0.8} ${-l.len * 0.05}`}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.65"
          />
        </g>
      ))}
    </svg>
  )
}
