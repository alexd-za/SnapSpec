import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { videoTheme, SERIF, SANS } from '../theme'
import type { SnapSummaryProps } from '../../src/lib/video/storyboard'

export const snapSummaryDefaults: SnapSummaryProps = {
  title: 'Photosynthesis',
  summary:
    'Plants convert light energy into chemical energy stored in glucose — the foundation of almost every food chain on Earth.',
  keyIdeas: [
    'Light reactions happen in the thylakoid membranes',
    'The Calvin cycle fixes carbon dioxide into glucose',
    'Oxygen is released as a by-product of splitting water',
  ],
  takeaway: 'The leaf is a factory powered by sunlight.',
  accent: 'forest',
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } })
  return (
    <div style={{ opacity: progress, transform: `translateY(${(1 - progress) * 28}px)` }}>
      {children}
    </div>
  )
}

/** 30s · 1920×1080 — title, summary, 3 key ideas, concept glimpse, takeaway. */
export const SnapSummary = (props: SnapSummaryProps) => {
  const p = videoTheme(props.accent)
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={{ background: p.bg, fontFamily: SANS, color: p.text, padding: 120 }}>
      {/* ambient contour */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, opacity: 0.18 }}
      >
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M0 ${260 + i * 200} Q 480 ${220 + i * 200}, 960 ${260 + i * 200} T 1920 ${260 + i * 200}`}
            fill="none"
            stroke={p.accent}
            strokeWidth={1.5}
            strokeDasharray={2400}
            strokeDashoffset={interpolate(frame, [0, 90], [2400, 0], { extrapolateRight: 'clamp' })}
          />
        ))}
      </svg>

      <Sequence from={0} durationInFrames={150}>
        <AbsoluteFill style={{ justifyContent: 'center', padding: 120 }}>
          <FadeUp>
            <p style={{ color: p.accent, letterSpacing: 8, fontSize: 26 }}>SPECSNAP EXPLAINER</p>
            <h1 style={{ fontFamily: SERIF, fontSize: 110, margin: '24px 0', lineHeight: 1.05 }}>
              {props.title}
            </h1>
          </FadeUp>
          <FadeUp delay={20}>
            <p style={{ fontSize: 38, color: p.muted, maxWidth: 1300, lineHeight: 1.5 }}>
              {props.summary}
            </p>
          </FadeUp>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={150} durationInFrames={450}>
        <AbsoluteFill style={{ justifyContent: 'center', padding: 120 }}>
          <FadeUp>
            <p style={{ color: p.accent, letterSpacing: 8, fontSize: 26 }}>KEY IDEAS</p>
          </FadeUp>
          {props.keyIdeas.map((idea, i) => (
            <FadeUp key={i} delay={15 + i * 25}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 28,
                  margin: '26px 0',
                  background: p.surface,
                  borderRadius: 24,
                  padding: '34px 44px',
                  border: `1px solid ${p.muted}44`,
                }}
              >
                <span
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    background: p.accent,
                    color: p.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: 36 }}>{idea}</span>
              </div>
            </FadeUp>
          ))}
        </AbsoluteFill>
      </Sequence>

      <Sequence from={600} durationInFrames={300}>
        <AbsoluteFill
          style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 160 }}
        >
          <FadeUp>
            <p style={{ color: p.accent, letterSpacing: 8, fontSize: 26 }}>REMEMBER</p>
            <p style={{ fontFamily: SERIF, fontSize: 64, fontStyle: 'italic', maxWidth: 1300, lineHeight: 1.3 }}>
              “{props.takeaway}”
            </p>
            <p style={{ color: p.muted, fontSize: 26, marginTop: 60 }}>
              Made with SpecSnap · local-first explainers
            </p>
          </FadeUp>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
