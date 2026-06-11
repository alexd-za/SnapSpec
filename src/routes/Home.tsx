import { Suspense, lazy, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { SnapTemplate } from '../lib/model/types'
import { TEMPLATES } from '../lib/model/templates'
import { PALETTES, ACCENT_THEMES } from '../lib/model/palettes'
import { useSnapStore } from '../lib/storage/store'
import { useMotionPref } from '../lib/hooks/useMotionPref'
import { Reveal, RevealInView, WordRise } from '../components/motion/Reveal'
import { SnapPreview } from '../components/gallery/SnapPreview'
import { Frond } from '../components/nature/Frond'
import { FloatingChips } from '../components/nature/FloatingChips'

const Hero3D = lazy(() => import('../components/nature/Hero3D'))

const MESSY_NOTE = `photosynthesis?? check defn
chlorophyll = green pigment, absorbs light
light rxns -> thylakoid membranes!!
calvin cycle fixes CO2 (dark rxn??)
o2 = by-product of splitting water
"the leaf is a factory powered by sunlight"
exam fri — REVISE STOMATA`

const TICKER_ITEMS = [
  'pressed today: photosynthesis',
  'trig ratios, worked twice',
  'the quiet field — elegiac, tender',
  'plantpal, problem-first',
  'no cloud was consulted',
  'cell biology, one page',
  'svgz at 59% smaller',
  'your notes never left the desk',
]

/** The underline beneath the headline's accent words, drawn like a pen stroke. */
function InkUnderline() {
  const animate = useMotionPref()
  return (
    <svg
      viewBox="0 0 240 14"
      className="absolute -bottom-2 left-0 w-full"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M3 9 C 40 3, 80 11, 120 7 S 200 4, 237 8"
        stroke="var(--sn-accent)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 0.95, ease: 'easeOut' }}
      />
    </svg>
  )
}

/** The messy original drifts in and settles, pinned at an angle. */
function FieldNote({ children }: { children: React.ReactNode }) {
  const animate = useMotionPref()
  const cls =
    'field-note absolute -top-8 left-2 w-40 p-3 pb-5 sm:-left-14 sm:-top-10 sm:w-48 sm:p-4 sm:pb-6'
  if (!animate) {
    return (
      <figure className={`${cls} -rotate-3`} aria-label="A messy original note, before parsing">
        {children}
      </figure>
    )
  }
  return (
    <motion.figure
      className={cls}
      aria-label="A messy original note, before parsing"
      initial={{ y: -56, opacity: 0, rotate: -12 }}
      animate={{ y: 0, opacity: 1, rotate: -4 }}
      transition={{ type: 'spring', stiffness: 120, damping: 13, mass: 0.9, delay: 0.55 }}
      whileHover={{ rotate: -1.5, scale: 1.02 }}
    >
      {children}
    </motion.figure>
  )
}

export function Home() {
  const [demoTemplate, setDemoTemplate] = useState<SnapTemplate>('study-notes')
  const setSettings = useSnapStore((s) => s.setSettings)
  const animate = useMotionPref()

  // Parallax: the desk drifts slower than the page, the frond slower still.
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const deskY = useTransform(scrollYProgress, [0, 1], [0, 70])
  const frondY = useTransform(scrollYProgress, [0, 1], [0, 130])

  return (
    <div>
      {/* Hero — everything floats on the same canvas */}
      <section
        ref={heroRef}
        className="grid items-start gap-14 pb-20 pt-10 lg:grid-cols-12 lg:gap-6 lg:pb-28 lg:pt-16"
      >
        <div className="lg:col-span-6 lg:pt-6">
          <Reveal>
            <p className="annotation text-base">
              a field guide for messy thinkers · local-first · no accounts · no cloud
            </p>
          </Reveal>
          <h1 className="mt-5 font-serif text-[2.6rem] font-light leading-[1.05] tracking-[-0.02em] sm:text-7xl sm:leading-[1.02]">
            <WordRise text="Turn messy notes into" delay={0.15} />{' '}
            <span className="relative inline-block text-accent">
              <em style={{ fontVariationSettings: "'opsz' 72, 'SOFT' 80" }}>
                <WordRise text="living explainers" delay={0.55} />
              </em>
              <InkUnderline />
            </span>
            <WordRise text="." delay={0.8} />
          </h1>
          <Reveal delay={0.5}>
            <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-ink/75">
              Paste notes. Pick a template. Edit the page. Export everything — parsed on your own
              device, never uploaded.
            </p>
          </Reveal>
          <Reveal delay={0.7}>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link
                to="/new"
                className="btn-organic group inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
              >
                Create Snap
                <ArrowRight
                  size={17}
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/gallery"
                className="annotation text-base underline decoration-accent/40 decoration-2 underline-offset-4 transition-colors hover:text-accent"
              >
                or browse the gallery
              </Link>
            </div>
            <p className="annotation mt-12 text-sm opacity-80">
              presses to html, markdown, json, svg, svgz, png &amp; video
            </p>
          </Reveal>
        </div>

        {/* The desk: note pinned over the living page, drifting on scroll */}
        <div className="relative lg:col-span-6">
          {animate && (
            <div className="pointer-events-none absolute -inset-x-16 -top-20 bottom-0 -z-10 hidden lg:block">
              <Suspense fallback={null}>
                <Hero3D />
              </Suspense>
            </div>
          )}
          <Reveal delay={0.25}>
            <motion.div
              style={animate ? { y: deskY } : undefined}
              className="relative ml-auto mt-12 max-w-md sm:mt-20 lg:mr-2"
            >
              <motion.div
                style={animate ? { y: frondY } : undefined}
                className="pointer-events-none absolute -right-10 -top-24 sm:-right-16"
              >
                <Frond className="h-56 w-32 opacity-30 sm:h-64" />
              </motion.div>
              <SnapPreview template={demoTemplate} maxBlocks={3} />
              <FloatingChips />
              <FieldNote>
                <span className="pin" aria-hidden />
                <pre className="whitespace-pre-wrap font-mono text-[10px] leading-[1.65] text-ink/85 sm:text-[10.5px]">
                  {MESSY_NOTE}
                </pre>
                <figcaption className="annotation mt-2 text-[13px] text-accent!">
                  ↓ pressed flat, in your browser
                </figcaption>
              </FieldNote>
            </motion.div>
          </Reveal>
          <div
            className="mt-8 flex flex-wrap justify-end gap-x-5 gap-y-1"
            role="group"
            aria-label="Demo template"
          >
            {TEMPLATES.slice(0, 3).map((t) => (
              <button
                key={t.id}
                onClick={() => setDemoTemplate(t.id)}
                aria-pressed={demoTemplate === t.id}
                className={`annotation cursor-pointer text-sm transition-colors ${
                  demoTemplate === t.id
                    ? 'text-accent underline decoration-2 underline-offset-4'
                    : 'hover:text-ink'
                }`}
              >
                {t.name.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Drifting field log — fades into the canvas at both edges */}
      <div className="ticker py-2 opacity-70" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              className="annotation inline-flex shrink-0 text-sm"
              aria-hidden={copy === 1}
            >
              {TICKER_ITEMS.map((item) => (
                <span key={item} className="inline-flex items-center">
                  <span className="px-6">{item}</span>
                  <svg width="9" height="9" viewBox="0 0 10 10" className="text-accent/70">
                    <path
                      d="M5 1 C 5 5, 5 5, 5 9 M2 4 C 4 5, 6 5, 8 4"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Manifesto — a clearing of light, not a band */}
      <section className="relative py-20 sm:py-28" aria-label="Manifesto">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[140%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              'radial-gradient(50% 60% at 50% 50%, color-mix(in srgb, var(--sn-accent) 9%, transparent), transparent 75%)',
          }}
          aria-hidden
        />
        <RevealInView className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-3xl leading-snug sm:text-5xl sm:leading-[1.18]">
            No accounts. No cloud. No AI seasoning.{' '}
            <em className="text-accent" style={{ fontVariationSettings: "'SOFT' 80" }}>
              Your notes stay on your desk.
            </em>
          </p>
        </RevealInView>
        <RevealInView delay={0.15} className="mx-auto mt-7 max-w-xl text-center">
          <p className="text-sm leading-relaxed text-ink/65">
            SpecSnap is a deterministic parser, not a chatbot. It finds the structure that was
            already in your notes — titles, definitions, formulas, quotes — and lays it out like a
            page worth keeping.
          </p>
        </RevealInView>
      </section>

      {/* Method — three movements flowing in from alternating sides */}
      <section className="py-12 sm:py-16" aria-labelledby="how-heading">
        <RevealInView>
          <h2 id="how-heading" className="annotation text-center text-lg">
            the method, in three movements
          </h2>
        </RevealInView>
        <div className="mt-12 space-y-14 sm:space-y-16">
          {[
            {
              n: '01',
              title: 'Paste anything',
              body: 'Class notes, a poem, maths working, a product idea. Messy is the expected input — that is the point.',
            },
            {
              n: '02',
              title: 'The parser does fieldwork',
              body: 'Titles, summaries, definitions, formulas, quotes, timelines — found deterministically, on your device, in milliseconds.',
            },
            {
              n: '03',
              title: 'Edit, press, export',
              body: 'Refine every block, switch the ink, then press the page to HTML, Markdown, JSON, SVG — or a full revision pack.',
            },
          ].map((step, i) => (
            <RevealInView key={step.n} delay={0.05}>
              <div
                className={`flex max-w-2xl flex-col gap-2 ${
                  i % 2 === 1 ? 'ml-auto text-right' : ''
                }`}
              >
                <span
                  className="font-serif text-7xl font-light text-accent/25 sm:text-8xl"
                  aria-hidden
                >
                  {step.n}
                </span>
                <h3 className="-mt-7 font-serif text-3xl tracking-[-0.01em] sm:-mt-9 sm:text-4xl">
                  {step.title}
                </h3>
                <p
                  className={`max-w-md text-sm leading-relaxed text-ink/65 ${
                    i % 2 === 1 ? 'ml-auto' : ''
                  }`}
                >
                  {step.body}
                </p>
              </div>
            </RevealInView>
          ))}
        </div>
      </section>

      {/* Templates — rows lit by hover, separated only by air */}
      <section className="py-20 sm:py-24" aria-labelledby="templates-heading">
        <RevealInView>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="templates-heading" className="font-serif text-4xl tracking-[-0.01em]">
              Six templates, one quiet system
            </h2>
            <span className="annotation text-base">six ways to press a page</span>
          </div>
        </RevealInView>
        <ol className="mt-10 space-y-2">
          {TEMPLATES.map((t, i) => (
            <RevealInView key={t.id} delay={Math.min(i * 0.06, 0.3)} y={18}>
              <li className="row-glow group grid items-baseline gap-x-6 gap-y-1 py-4 pr-8 sm:grid-cols-12">
                <span className="annotation text-base transition-colors group-hover:text-accent sm:col-span-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-2xl transition-colors group-hover:text-accent sm:col-span-4">
                  <Link to="/new" className="focus-visible:text-accent">
                    {t.name}
                  </Link>
                </h3>
                <p className="text-sm text-ink/60 sm:col-span-4">{t.description}</p>
                <p className="annotation text-sm opacity-80 sm:col-span-3 sm:text-right">
                  {t.produces.slice(0, 3).join(' · ').toLowerCase()}
                </p>
                <ArrowRight
                  size={18}
                  aria-hidden
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-accent opacity-0 transition-all duration-200 group-hover:right-0 group-hover:opacity-100"
                />
              </li>
            </RevealInView>
          ))}
        </ol>
      </section>

      {/* Inks — glowing droplets */}
      <section className="py-16 sm:py-20" aria-labelledby="palettes-heading">
        <RevealInView>
          <h2 id="palettes-heading" className="font-serif text-4xl tracking-[-0.01em]">
            Five inks
          </h2>
          <p className="annotation mt-1 text-base">
            five moods of the same forest — pick one to re-light the canvas
          </p>
        </RevealInView>
        <div className="mt-9 flex flex-wrap gap-x-12 gap-y-6">
          {ACCENT_THEMES.map((theme, i) => {
            const p = PALETTES[theme]
            return (
              <RevealInView key={theme} delay={i * 0.07} y={14}>
                <button
                  onClick={() => setSettings({ defaultAccent: theme })}
                  className="group cursor-pointer text-left"
                  aria-label={`Switch to ${p.name} palette`}
                >
                  <span className="flex items-center gap-3.5">
                    <span
                      className="inline-block h-11 w-11 rounded-full transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                      style={{
                        background: `radial-gradient(circle at 32% 30%, ${p.accent}, ${p.bg} 85%)`,
                        boxShadow: `0 10px 24px -8px ${p.accent}55`,
                      }}
                    />
                    <span>
                      <span className="block font-serif text-lg leading-tight transition-colors group-hover:text-accent">
                        {p.name}
                      </span>
                      <span className="annotation block text-sm opacity-80">
                        {p.description.toLowerCase()}
                      </span>
                    </span>
                  </span>
                </button>
              </RevealInView>
            )
          })}
        </div>
      </section>

      {/* Closing — the canvas gathers into one last clearing */}
      <section className="relative py-24 text-center sm:py-32" aria-label="Closing">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[130%] w-[120%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              'radial-gradient(45% 55% at 50% 50%, color-mix(in srgb, var(--sn-accent) 11%, transparent), transparent 75%)',
          }}
          aria-hidden
        />
        <Frond className="pointer-events-none absolute bottom-6 left-[6%] hidden h-44 w-24 opacity-20 md:block" />
        <Frond
          flip
          className="pointer-events-none absolute right-[6%] top-10 hidden h-44 w-24 opacity-20 md:block"
        />
        <RevealInView>
          <p className="annotation text-base">checked out to: you, indefinitely</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif text-4xl tracking-[-0.01em] sm:text-6xl">
            Your notes never leave this device.
          </h2>
          <Link
            to="/new"
            className="btn-organic group mt-10 inline-flex items-center gap-2 px-9 py-4 text-lg font-semibold"
          >
            Create your first Snap
            <ArrowRight
              size={19}
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </RevealInView>
      </section>
    </div>
  )
}
