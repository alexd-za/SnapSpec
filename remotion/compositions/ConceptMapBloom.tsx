import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { videoTheme, SERIF, SANS } from '../theme'
import type { AccentTheme } from '../../src/lib/model/types'

export type ConceptMapBloomProps = {
  core: string
  branches: string[]
  closing: string
  accent: AccentTheme
}

export const conceptMapBloomDefaults: ConceptMapBloomProps = {
  core: 'Photosynthesis',
  branches: ['Chlorophyll', 'Light reactions', 'Calvin cycle', 'Stomata', 'Glucose', 'Oxygen'],
  closing: 'Every idea connects back to the light.',
  accent: 'forest',
}

/** 30s · 1920×1080 — nodes grow like branches, edges draw like leaf veins. */
export const ConceptMapBloom = (props: ConceptMapBloomProps) => {
  const p = videoTheme(props.accent)
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const cx = 960
  const cy = 470

  const corePop = spring({ frame, fps, config: { damping: 14 } })
  const closingOpacity = interpolate(frame, [740, 800], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: p.bg, fontFamily: SANS, color: p.text }}>
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        {props.branches.map((branch, i) => {
          const angle = (Math.PI * 2 * i) / props.branches.length - Math.PI / 2
          const radius = 330 + (i % 2) * 90
          const x = cx + Math.cos(angle) * radius
          const y = cy + Math.sin(angle) * (radius * 0.62)
          const delay = 40 + i * 26
          const grow = spring({ frame: frame - delay, fps, config: { damping: 18 } })
          const drawn = interpolate(frame, [delay - 14, delay + 26], [900, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const mx = (cx + x) / 2
          const my = (cy + y) / 2 - 70
          const w = Math.max(180, branch.length * 22 + 60)
          return (
            <g key={branch}>
              <path
                d={`M ${cx} ${cy} Q ${mx} ${my} ${x} ${y}`}
                fill="none"
                stroke={p.accent}
                strokeWidth="3"
                opacity="0.6"
                strokeDasharray="900"
                strokeDashoffset={drawn}
              />
              <g opacity={Math.min(grow, 1)} transform={`translate(${x} ${y}) scale(${Math.max(grow, 0.001)})`}>
                <rect x={-w / 2} y={-44} width={w} height={88} rx={44} fill={p.surface} stroke={p.accent} strokeWidth="2" />
                <text textAnchor="middle" y={12} fontSize="34" fill={p.text} fontFamily={SANS}>
                  {branch}
                </text>
              </g>
            </g>
          )
        })}
        <g opacity={Math.min(corePop, 1)} transform={`translate(${cx} ${cy}) scale(${Math.max(corePop, 0.001)})`}>
          <rect x={-260} y={-64} width={520} height={128} rx={64} fill={p.accent} />
          <text textAnchor="middle" y={16} fontSize="48" fontWeight="bold" fill={p.bg} fontFamily={SERIF}>
            {props.core}
          </text>
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          width: '100%',
          textAlign: 'center',
          opacity: closingOpacity,
        }}
      >
        <p style={{ fontFamily: SERIF, fontSize: 46, fontStyle: 'italic', margin: 0 }}>{props.closing}</p>
        <p style={{ color: p.muted, fontSize: 24, marginTop: 16 }}>Made with SpecSnap</p>
      </div>
    </AbsoluteFill>
  )
}
