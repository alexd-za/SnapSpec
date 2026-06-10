import type { DiagramBlock } from '../../lib/model/types'
import { useMotionPref } from '../../lib/hooks/useMotionPref'

/** Concept-map renderer: nodes as moss pebbles, edges drawn like branches. */
export function DiagramCanvas({ block }: { block: DiagramBlock }) {
  const animate = useMotionPref()
  const nodeById = new Map(block.nodes.map((n) => [n.id, n]))

  return (
    <svg
      viewBox="0 0 600 340"
      className="h-auto w-full"
      role="img"
      aria-label={block.title ?? 'Concept map diagram'}
    >
      {block.edges.map((edge, i) => {
        const a = nodeById.get(edge.source)
        const b = nodeById.get(edge.target)
        if (!a || !b) return null
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2 - 18
        return (
          <path
            key={i}
            d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
            fill="none"
            stroke="var(--sn-accent)"
            strokeWidth="1.5"
            opacity="0.5"
            className={animate ? 'draw-line' : undefined}
            style={animate ? { animationDelay: `${i * 0.15}s` } : undefined}
          />
        )
      })}
      {block.nodes.map((node, i) => {
        const isCore = i === 0
        const w = Math.max(64, node.label.length * 7.5 + 28)
        return (
          <g key={node.id}>
            <rect
              x={node.x - w / 2}
              y={node.y - 17}
              width={w}
              height={34}
              rx={17}
              fill={isCore ? 'var(--sn-accent)' : 'var(--sn-surface)'}
              stroke="var(--sn-accent)"
              strokeWidth={isCore ? 0 : 1}
              strokeOpacity={0.6}
            />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fontSize="12"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fill={isCore ? 'var(--sn-bg)' : 'var(--sn-text)'}
            >
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
