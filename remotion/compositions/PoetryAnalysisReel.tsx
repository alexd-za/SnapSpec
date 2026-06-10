import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { videoTheme, SERIF, SANS } from '../theme'
import type { AccentTheme } from '../../src/lib/model/types'

export type PoetryReelProps = {
  poemTitle: string
  theme: string
  tone: string
  structure: string
  techniques: string[]
  thesis: string
  accent: AccentTheme
}

export const poetryReelDefaults: PoetryReelProps = {
  poemTitle: 'The Quiet Field',
  theme: 'Memory and inheritance',
  tone: 'Elegiac, tender',
  structure: 'Two quatrains, enjambed lines spilling like light',
  techniques: ['Personification', 'Paradox', 'Natural imagery'],
  thesis:
    'The poet turns a family field into a measure of grief, where nature’s indifference sharpens what memory keeps.',
  accent: 'bloom',
}

function Rise({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const t = spring({ frame: frame - delay, fps, config: { damping: 200 } })
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * 24}px)` }}>{children}</div>
}

function Card({ label, value, accent, surface, muted }: { label: string; value: string; accent: string; surface: string; muted: string }) {
  return (
    <div style={{ background: surface, borderRadius: 20, padding: '26px 34px', margin: '14px 0', border: `1px solid ${muted}44` }}>
      <p style={{ color: accent, letterSpacing: 6, fontSize: 20, margin: 0 }}>{label}</p>
      <p style={{ fontSize: 32, margin: '10px 0 0' }}>{value}</p>
    </div>
  )
}

/** 30s · 1080×1080 — poem title, theme, tone, structure, techniques, thesis. */
export const PoetryAnalysisReel = (props: PoetryReelProps) => {
  const p = videoTheme(props.accent)
  return (
    <AbsoluteFill style={{ background: p.bg, color: p.text, fontFamily: SANS, padding: 80 }}>
      <Sequence from={0} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', padding: 80 }}>
          <Rise>
            <p style={{ color: p.accent, letterSpacing: 8, fontSize: 22 }}>POETRY ANALYSIS</p>
            <h1 style={{ fontFamily: SERIF, fontSize: 84, margin: '20px 0', lineHeight: 1.1 }}>
              {props.poemTitle}
            </h1>
          </Rise>
          <Rise delay={18}>
            <Card label="THEME" value={props.theme} accent={p.accent} surface={p.surface} muted={p.muted} />
            <Card label="TONE" value={props.tone} accent={p.accent} surface={p.surface} muted={p.muted} />
          </Rise>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={180} durationInFrames={360}>
        <AbsoluteFill style={{ justifyContent: 'center', padding: 80 }}>
          <Rise>
            <Card label="STRUCTURE" value={props.structure} accent={p.accent} surface={p.surface} muted={p.muted} />
          </Rise>
          {props.techniques.map((t, i) => (
            <Rise key={t} delay={20 + i * 22}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '16px 0' }}>
                <span style={{ width: 14, height: 14, borderRadius: 7, background: p.accent }} />
                <span style={{ fontSize: 34 }}>{t}</span>
              </div>
            </Rise>
          ))}
        </AbsoluteFill>
      </Sequence>

      <Sequence from={540} durationInFrames={360}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 100 }}>
          <Rise>
            <p style={{ color: p.accent, letterSpacing: 8, fontSize: 22 }}>THESIS</p>
            <p style={{ fontFamily: SERIF, fontSize: 44, fontStyle: 'italic', lineHeight: 1.4 }}>
              {props.thesis}
            </p>
          </Rise>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
