import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { videoTheme, SERIF, SANS } from '../theme'
import type { AccentTheme } from '../../src/lib/model/types'

export type MathsReelProps = {
  topic: string
  formula: string
  steps: string[]
  mistake: string
  accent: AccentTheme
}

export const mathsReelDefaults: MathsReelProps = {
  topic: 'Trig ratios',
  formula: 'sin θ = opposite / hypotenuse',
  steps: ['Identify: opposite = 4, angle = 65°', 'Set up: sin 65° = 4 / h', 'Solve: h = 4 / sin 65° ≈ 4.41 m'],
  mistake: 'Calculator left in radians — always check degree mode first.',
  accent: 'river',
}

function Pop({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const t = spring({ frame: frame - delay, fps, config: { damping: 16 } })
  return <div style={{ opacity: Math.min(t, 1), transform: `scale(${0.94 + t * 0.06})` }}>{children}</div>
}

/** 30s · 1080×1080 — formula, right-triangle diagram, worked example, common mistake. */
export const MathsFormulaReel = (props: MathsReelProps) => {
  const p = videoTheme(props.accent)
  const frame = useCurrentFrame()
  const draw = interpolate(frame, [10, 70], [600, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

  return (
    <AbsoluteFill style={{ background: p.bg, color: p.text, fontFamily: SANS, padding: 80 }}>
      <Sequence from={0} durationInFrames={270}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}>
          <Pop>
            <p style={{ color: p.accent, letterSpacing: 8, fontSize: 22, textAlign: 'center' }}>
              {props.topic.toUpperCase()}
            </p>
            <div
              style={{
                background: p.surface,
                border: `2px solid ${p.accent}`,
                borderRadius: 24,
                padding: '50px 70px',
                margin: '30px 0',
              }}
            >
              <code style={{ fontSize: 52, fontFamily: 'monospace' }}>{props.formula}</code>
            </div>
          </Pop>
          <svg width="420" height="280" viewBox="0 0 420 280">
            <path
              d="M40 240 L 380 240 L 380 40 Z"
              fill="none"
              stroke={p.accent}
              strokeWidth="4"
              strokeDasharray="600"
              strokeDashoffset={draw}
            />
            <rect x="352" y="212" width="28" height="28" fill="none" stroke={p.muted} strokeWidth="2" />
            <text x="200" y="270" fill={p.muted} fontSize="22" fontFamily={SANS}>adjacent</text>
            <text x="390" y="150" fill={p.muted} fontSize="22" fontFamily={SANS}>opp</text>
            <text x="160" y="120" fill={p.accent} fontSize="22" fontFamily={SANS}>hypotenuse</text>
            <text x="80" y="230" fill={p.text} fontSize="26" fontFamily={SERIF}>θ</text>
          </svg>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={270} durationInFrames={360}>
        <AbsoluteFill style={{ justifyContent: 'center', padding: 90 }}>
          <Pop>
            <p style={{ color: p.accent, letterSpacing: 8, fontSize: 22 }}>WORKED EXAMPLE</p>
          </Pop>
          {props.steps.map((step, i) => (
            <Pop key={i} delay={15 + i * 30}>
              <div
                style={{
                  display: 'flex',
                  gap: 24,
                  alignItems: 'center',
                  background: p.surface,
                  borderRadius: 18,
                  padding: '28px 36px',
                  margin: '14px 0',
                  border: `1px solid ${p.muted}44`,
                }}
              >
                <span style={{ color: p.accent, fontFamily: SERIF, fontSize: 38 }}>{i + 1}.</span>
                <span style={{ fontSize: 32, fontFamily: 'monospace' }}>{step}</span>
              </div>
            </Pop>
          ))}
        </AbsoluteFill>
      </Sequence>

      <Sequence from={630} durationInFrames={270}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 110 }}>
          <Pop>
            <p style={{ color: '#e8a13a', letterSpacing: 8, fontSize: 22 }}>⚠ COMMON MISTAKE</p>
            <p style={{ fontSize: 42, lineHeight: 1.4, fontFamily: SERIF }}>{props.mistake}</p>
            <p style={{ color: p.muted, fontSize: 24, marginTop: 50 }}>Made with SpecSnap</p>
          </Pop>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
