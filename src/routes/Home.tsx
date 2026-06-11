import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { SnapTemplate } from '../lib/model/types'
import { TEMPLATES } from '../lib/model/templates'
import { PALETTES, ACCENT_THEMES } from '../lib/model/palettes'
import { useSnapStore } from '../lib/storage/store'
import { useMotionPref } from '../lib/hooks/useMotionPref'
import { Reveal, RevealInView, WordRise } from '../components/motion/Reveal'
import { SnapPreview } from '../components/gallery/SnapPreview'
import { TornEdge } from '../components/nature/TornEdge'
import { Frond } from '../components/nature/Frond'

const MESSY_NOTE = `photosynthesis?? check defn
chlorophyll = green pigment, absorbs light
light rxns -> thylakoid membranes!!
calvin cycle fixes CO2 (dark rxn??)
o2 = by-product of splitting water
limiting factors: light, temp, CO2 conc
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

/** The messy original drops onto the desk and settles at an angle. */
function FieldNote({ children }: { children: React.ReactNode }) {
  const animate = useMotionPref()
  if (!animate) {
    return (
      <figure
        className="field-note absolute -top-8 left-2 w-40 -rotate-3 p-3 pb-5 sm:-left-16 sm:-top-10 sm:w-48 sm:-rotate-[4deg] sm:p-4 sm:pb-6"
        aria-label="A messy original note, before parsing"
      >
        {children}
      </figure>
    )
  }
  return (
    <motion.figure
      className="field-note absolute -top-8 left-2 w-40 p-3 pb-5 sm:-left-16 sm:-top-10 sm:w-48 sm:p-4 sm:pb-6"
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

  return (
    <div>
      {/* Hero: the actual transformation, as overlapping artifacts on a desk */}
      <section className="grid items-start gap-12 py-8 lg:grid-cols-12 lg:gap-6 lg:py-14">
        <div className="lg:col-span-6 lg:pt-4">
          <Reveal>
            <p className="annotation text-base">
              a field guide for messy thinkers · local-first · no accounts · no cloud
            </p>
          </Reveal>
          <h1 className="letterpress mt-4 font-serif text-[2.6rem] font-medium leading-[1.04] tracking-[-0.02em] sm:text-7xl sm:leading-[1.02]">
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
            <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-ink/80">
              Paste notes. Pick a template. Edit the page. Export everything — parsed on your own
              device, never uploaded.
            </p>
          </Reveal>
          <Reveal delay={0.7}>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                to="/new"
                className="stamp group inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-base font-semibold text-surface"
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
                className="annotation text-base underline decoration-accent/50 decoration-2 underline-offset-4 hover:text-accent"
              >
                or browse the gallery
              </Link>
            </div>
            <p className="annotation mt-12 text-sm">
              presses to html, markdown, json, svg, svgz, png &amp; video
            </p>
          </Reveal>
        </div>

        {/* The desk: torn note landing on the pressed page */}
        <div className="relative lg:col-span-6">
          <Reveal delay={0.25}>
            <div className="relative ml-auto mt-12 max-w-md sm:mt-24 lg:mr-2 lg:mt-16">
              <Frond className="absolute -right-10 -top-24 h-56 w-32 opacity-25 sm:-right-16 sm:h-64" />
              <SnapPreview template={demoTemplate} maxBlocks={3} />
              <FieldNote>
                <span className="pin" aria-hidden />
                <pre className="whitespace-pre-wrap font-mono text-[10px] leading-[1.65] text-ink/85 sm:text-[10.5px]">
                  {MESSY_NOTE}
                </pre>
                <figcaption className="annotation mt-2 text-[13px] text-accent!">
                  ↓ pressed flat, in your browser
                </figcaption>
              </FieldNote>
            </div>
          </Reveal>
          <div
            className="mt-7 flex flex-wrap justify-end gap-x-5 gap-y-1"
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

      {/* Letterpress ticker */}
      <div className="ticker -mx-4 border-y border-ink/15 py-2.5" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              className="annotation inline-flex shrink-0 text-sm"
              aria-hidden={copy === 1}
            >
              {TICKER_ITEMS.map((item) => (
                <span key={item} className="inline-flex items-center">
                  <span className="px-5">{item}</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" className="text-accent">
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

      {/* Manifesto: a committed ink plate, same family as the paper */}
      <section className="relative left-1/2 mt-14 w-screen -translate-x-1/2">
        <TornEdge className="relative z-10 -mb-px" />
        <div className="ink-band px-4 py-14 sm:px-[max(1rem,calc((100vw-72rem)/2+1rem))]">
        <div className="mx-auto grid max-w-6xl items-center gap-8 sm:grid-cols-12">
          <RevealInView className="sm:col-span-8">
            <p className="font-serif text-3xl leading-snug sm:text-4xl">
              No accounts. No cloud. No AI seasoning.{' '}
              <em className="text-accent" style={{ fontVariationSettings: "'SOFT' 80" }}>
                Your notes stay on your desk.
              </em>
            </p>
          </RevealInView>
          <RevealInView delay={0.15} className="sm:col-span-4">
            <p className="text-sm leading-relaxed opacity-80">
              SpecSnap is a deterministic parser, not a chatbot. It finds the structure that was
              already in your notes — titles, definitions, formulas, quotes — and lays it out like a
              page worth keeping.
            </p>
          </RevealInView>
        </div>
        </div>
        <TornEdge flip className="relative z-10 -mt-px" />
      </section>

      {/* Method: margin-annotated rows */}
      <section className="py-16 sm:py-20" aria-labelledby="how-heading">
        <RevealInView>
          <h2 id="how-heading" className="annotation text-lg">
            the method, in three movements
          </h2>
        </RevealInView>
        <div className="mt-4 divide-y divide-ink/10 border-y border-ink/15">
          {[
            {
              n: 'one',
              title: 'Paste anything',
              body: 'Class notes, a poem, maths working, a product idea. Messy is the expected input — that is the point.',
            },
            {
              n: 'two',
              title: 'The parser does fieldwork',
              body: 'Titles, summaries, definitions, formulas, quotes, timelines — found deterministically, on your device, in milliseconds.',
            },
            {
              n: 'three',
              title: 'Edit, press, export',
              body: 'Refine every block, switch the ink, then press the page to HTML, Markdown, JSON, SVG — or a full revision pack.',
            },
          ].map((step, i) => (
            <RevealInView key={step.n} delay={i * 0.1}>
              <div className="group grid gap-1 py-8 sm:grid-cols-12 sm:gap-6">
                <span
                  className="annotation text-xl transition-colors group-hover:text-accent sm:col-span-2"
                  aria-hidden
                >
                  no. {step.n}
                </span>
                <h3 className="font-serif text-3xl tracking-[-0.01em] sm:col-span-4">
                  {step.title}
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-ink/75 sm:col-span-6 sm:pt-2">
                  {step.body}
                </p>
              </div>
            </RevealInView>
          ))}
        </div>
      </section>

      {/* Template index: an actual index, not a card grid */}
      <section className="py-16 sm:py-20" aria-labelledby="templates-heading">
        <RevealInView>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="templates-heading" className="letterpress font-serif text-4xl tracking-[-0.01em]">
              Index of templates
            </h2>
            <span className="annotation text-base">six ways to press a page</span>
          </div>
        </RevealInView>
        <ol className="mt-7 border-t border-ink/15">
          {TEMPLATES.map((t, i) => (
            <RevealInView key={t.id} delay={Math.min(i * 0.06, 0.3)} y={18}>
              <li className="group relative grid items-baseline gap-x-6 gap-y-1 border-b border-ink/10 py-5 pl-1 pr-8 transition-all duration-200 hover:bg-surface hover:pl-3 sm:grid-cols-12">
                <span className="annotation text-base transition-colors group-hover:text-accent sm:col-span-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-2xl transition-colors group-hover:text-accent sm:col-span-4">
                  <Link to="/new" className="focus-visible:text-accent">
                    {t.name}
                  </Link>
                </h3>
                <p className="text-sm text-ink/70 sm:col-span-4">{t.description}</p>
                <p className="annotation text-sm sm:col-span-3 sm:text-right">
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

      {/* Inks */}
      <section className="py-16 sm:py-20" aria-labelledby="palettes-heading">
        <RevealInView>
          <h2 id="palettes-heading" className="letterpress font-serif text-4xl tracking-[-0.01em]">
            Five inks
          </h2>
          <p className="annotation mt-1 text-base">
            three papers, two night plates — pick one to re-ink the journal
          </p>
        </RevealInView>
        <div className="mt-7 flex flex-wrap gap-x-10 gap-y-5">
          {ACCENT_THEMES.map((theme, i) => {
            const p = PALETTES[theme]
            return (
              <RevealInView key={theme} delay={i * 0.07} y={14}>
                <button
                  onClick={() => setSettings({ defaultAccent: theme })}
                  className="group cursor-pointer text-left"
                  aria-label={`Switch to ${p.name} palette`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="inline-block h-10 w-10 rounded-full border border-ink/30 shadow-[2px_3px_0_0_color-mix(in_srgb,var(--sn-text)_20%,transparent)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:rotate-12"
                      style={{
                        background: `linear-gradient(135deg, ${p.bg} 50%, ${p.accent} 50%)`,
                      }}
                    />
                    <span>
                      <span className="block font-serif text-lg leading-tight group-hover:text-accent">
                        {p.name}
                      </span>
                      <span className="annotation block text-sm">
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

      {/* Closing: the library pocket */}
      <section className="mb-6 mt-8">
        <RevealInView>
          <div className="paper-grain paper-lift relative overflow-hidden rounded-md border border-ink/20 bg-surface px-7 py-12 sm:px-12">
            <motion.img
              src="/generated/svg/35-local-first.svg"
              alt=""
              className="absolute -right-6 -top-6 h-40 w-40 opacity-50 sm:right-8 sm:top-1/2 sm:-translate-y-1/2 sm:opacity-90"
              initial={animate ? { rotate: 14, scale: 0.9 } : false}
              whileInView={{ rotate: 4, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 90, damping: 12 }}
            />
            <Frond flip className="pointer-events-none absolute -bottom-10 -left-6 h-48 w-28 opacity-15" />
            <p className="annotation text-base">checked out to: you, indefinitely</p>
            <h2 className="mt-2 max-w-xl font-serif text-4xl tracking-[-0.01em] sm:text-5xl">
              Your notes never leave this device.
            </h2>
            <Link
              to="/new"
              className="stamp group mt-8 inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-base font-semibold text-surface"
            >
              Create your first Snap
              <ArrowRight
                size={17}
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </RevealInView>
      </section>
    </div>
  )
}
