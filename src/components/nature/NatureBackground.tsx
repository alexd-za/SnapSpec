import { useMotionPref } from '../../lib/hooks/useMotionPref'

const LEAVES = [
  { left: '6%', size: 14, duration: 34, delay: 0 },
  { left: '18%', size: 10, duration: 46, delay: 9 },
  { left: '31%', size: 12, duration: 41, delay: 18 },
  { left: '44%', size: 9, duration: 52, delay: 4 },
  { left: '58%', size: 13, duration: 38, delay: 24 },
  { left: '71%', size: 10, duration: 44, delay: 14 },
  { left: '83%', size: 12, duration: 36, delay: 29 },
  { left: '93%', size: 9, duration: 50, delay: 7 },
]

/**
 * The living canvas: one continuous backdrop for the whole app.
 * Layered light pockets drift like sun through a canopy; a few leaves
 * rise slowly far behind the content. Nothing else sits between
 * sections and this canvas — no rules, no bands, no seams.
 */
export function NatureBackground() {
  const animate = useMotionPref()
  return (
    <div className="canvas-base pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div
        className="light-pocket h-[55vh] w-[55vh]"
        style={{ top: '-12%', right: '-8%', animationDuration: '30s' }}
      />
      <div
        className="light-pocket h-[45vh] w-[45vh]"
        style={{ bottom: '-10%', left: '-10%', animationDuration: '38s', animationDelay: '-12s' }}
      />
      <div
        className="light-pocket h-[34vh] w-[34vh] opacity-70"
        style={{ top: '38%', left: '52%', animationDuration: '46s', animationDelay: '-20s' }}
      />
      {animate &&
        LEAVES.map((leaf, i) => (
          <svg
            key={i}
            className="leaf-drift"
            style={{
              left: leaf.left,
              width: leaf.size,
              height: leaf.size,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
            }}
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 1 C 12 4, 14 8, 8 15 C 2 8, 4 4, 8 1 Z" opacity="0.8" />
            <path d="M8 3 L 8 13" stroke="currentColor" strokeWidth="0.6" fill="none" />
          </svg>
        ))}
      <div className="canvas-grain absolute inset-0" />
    </div>
  )
}
