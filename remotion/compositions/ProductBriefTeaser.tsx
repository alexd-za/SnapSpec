import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { videoTheme, SERIF, SANS } from '../theme'
import type { AccentTheme } from '../../src/lib/model/types'

export type ProductTeaserProps = {
  name: string
  problem: string
  solution: string
  user: string
  features: string[]
  launchLine: string
  accent: AccentTheme
}

export const productTeaserDefaults: ProductTeaserProps = {
  name: 'PlantPal',
  problem: 'People love houseplants but forget schedules, overwater, and miss early signs of stress.',
  solution: 'A local-first plant care companion that builds a watering rhythm per plant.',
  user: 'Urban renters with 3–15 plants and busy schedules.',
  features: ['Per-plant care rhythm', 'Photo growth journal', 'Offline-first, no account', 'Seasonal adjustment'],
  launchLine: 'The calm, private plant app that never nags.',
  accent: 'sunlit',
}

function Slide({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const t = spring({ frame: frame - delay, fps, config: { damping: 200 } })
  return <div style={{ opacity: t, transform: `translateX(${(1 - t) * 40}px)` }}>{children}</div>
}

/** 30s · 1920×1080 — problem, solution, user, feature set, launch line. */
export const ProductBriefTeaser = (props: ProductTeaserProps) => {
  const p = videoTheme(props.accent)
  const label = (text: string) => (
    <p style={{ color: p.accent, letterSpacing: 8, fontSize: 26, margin: 0 }}>{text}</p>
  )

  return (
    <AbsoluteFill style={{ background: p.bg, color: p.text, fontFamily: SANS, padding: 140 }}>
      <Sequence from={0} durationInFrames={210}>
        <AbsoluteFill style={{ justifyContent: 'center', padding: 140 }}>
          <Slide>
            {label('THE PROBLEM')}
            <p style={{ fontFamily: SERIF, fontSize: 64, lineHeight: 1.25, maxWidth: 1400 }}>{props.problem}</p>
          </Slide>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={210} durationInFrames={210}>
        <AbsoluteFill style={{ justifyContent: 'center', padding: 140 }}>
          <Slide>
            {label('THE SOLUTION')}
            <h1 style={{ fontFamily: SERIF, fontSize: 110, margin: '18px 0', color: p.accent }}>{props.name}</h1>
            <p style={{ fontSize: 42, maxWidth: 1300, lineHeight: 1.45 }}>{props.solution}</p>
            <p style={{ fontSize: 30, color: p.muted, marginTop: 28 }}>For: {props.user}</p>
          </Slide>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={420} durationInFrames={270}>
        <AbsoluteFill style={{ justifyContent: 'center', padding: 140 }}>
          <Slide>{label('FEATURES')}</Slide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 40 }}>
            {props.features.map((f, i) => (
              <Slide key={f} delay={12 + i * 16}>
                <div
                  style={{
                    background: p.surface,
                    borderRadius: 22,
                    padding: '40px 46px',
                    fontSize: 36,
                    border: `1px solid ${p.muted}55`,
                  }}
                >
                  {f}
                </div>
              </Slide>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={690} durationInFrames={210}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 200 }}>
          <Slide>
            <p style={{ fontFamily: SERIF, fontSize: 72, fontStyle: 'italic', lineHeight: 1.3 }}>
              “{props.launchLine}”
            </p>
            <p style={{ color: p.muted, fontSize: 26, marginTop: 50 }}>Brief made with SpecSnap</p>
          </Slide>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
