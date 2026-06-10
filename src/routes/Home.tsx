import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { SnapTemplate } from '../lib/model/types'
import { TEMPLATES } from '../lib/model/templates'
import { PALETTES, ACCENT_THEMES } from '../lib/model/palettes'
import { useSnapStore } from '../lib/storage/store'
import { Reveal } from '../components/motion/Reveal'
import { SnapPreview } from '../components/gallery/SnapPreview'

const MESSY_NOTE = `photosynthesis?? check defn
chlorophyll = green pigment, absorbs light
light rxns -> thylakoid membranes!!
calvin cycle fixes CO2 (dark rxn??)
o2 = by-product of splitting water
limiting factors: light, temp, CO2 conc
"the leaf is a factory powered by sunlight"
exam fri — REVISE STOMATA`

/** Hand-drawn arrow from the messy note to the pressed page. */
function HandArrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden="true" fill="none">
      <path
        d="M8 10 C 30 40, 50 68, 102 70"
        stroke="var(--sn-accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="1 7"
      />
      <path
        d="M88 60 L 104 70 L 86 78"
        stroke="var(--sn-accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Home() {
  const [demoTemplate, setDemoTemplate] = useState<SnapTemplate>('study-notes')
  const setSettings = useSnapStore((s) => s.setSettings)

  return (
    <div>
      {/* Hero: the actual transformation, as overlapping artifacts on a desk */}
      <section className="grid items-start gap-12 py-8 lg:grid-cols-12 lg:gap-6 lg:py-14">
        <div className="lg:col-span-6 lg:pt-4">
          <Reveal>
            <p className="annotation text-base">
              a field guide for messy thinkers · local-first · no accounts · no cloud
            </p>
            <h1 className="mt-4 font-serif text-[2.9rem] font-medium leading-[1.02] tracking-[-0.02em] sm:text-7xl">
              Turn messy notes into{' '}
              <span className="relative inline-block text-accent">
                <em style={{ fontVariationSettings: "'opsz' 72, 'SOFT' 80" }}>living explainers</em>
                <svg
                  viewBox="0 0 240 14"
                  className="absolute -bottom-2 left-0 w-full"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9 C 40 3, 80 11, 120 7 S 200 4, 237 8"
                    stroke="var(--sn-accent)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>
            <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-ink/80">
              Paste notes. Pick a template. Edit the page. Export everything — parsed on your own
              device, never uploaded.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                to="/new"
                className="stamp inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-base font-semibold text-surface"
              >
                Create Snap <ArrowRight size={17} aria-hidden />
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

        {/* The desk: torn note overlapping the pressed page */}
        <div className="relative lg:col-span-6">
          <Reveal delay={0.18}>
            <div className="relative ml-auto mt-10 max-w-md lg:mr-2">
              <SnapPreview template={demoTemplate} maxBlocks={3} />
              {/* the messy original, taped over the corner */}
              <figure
                className="field-note absolute -left-4 -top-16 w-52 -rotate-6 p-4 pb-7 sm:-left-20"
                aria-label="A messy original note, before parsing"
              >
                <span className="tape" aria-hidden />
                <pre className="whitespace-pre-wrap font-mono text-[10.5px] leading-[1.7] text-ink/85">
                  {MESSY_NOTE}
                </pre>
              </figure>
              <HandArrow className="absolute -top-6 left-40 h-20 w-24 rotate-12 sm:left-36" />
              <figcaption className="annotation absolute -top-12 right-0 max-w-40 text-right text-sm">
                the parser presses it flat, in your browser
              </figcaption>
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

      {/* Manifesto: a committed ink plate, same family as the paper */}
      <section className="ink-band -mx-4 mt-10 px-4 py-14 sm:-mx-[max(1rem,calc((100vw-72rem)/2+1rem))] sm:px-[max(1rem,calc((100vw-72rem)/2+1rem))]">
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-center gap-8 sm:grid-cols-12">
            <p className="font-serif text-3xl leading-snug sm:col-span-8 sm:text-4xl">
              No accounts. No cloud. No AI seasoning.{' '}
              <em className="text-accent" style={{ fontVariationSettings: "'SOFT' 80" }}>
                Your notes stay on your desk.
              </em>
            </p>
            <p className="text-sm leading-relaxed opacity-80 sm:col-span-4">
              SpecSnap is a deterministic parser, not a chatbot. It finds the structure that was
              already in your notes — titles, definitions, formulas, quotes — and lays it out like a
              page worth keeping.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Method: margin-annotated rows */}
      <section className="py-14" aria-labelledby="how-heading">
        <Reveal>
          <h2 id="how-heading" className="annotation text-lg">
            the method, in three movements
          </h2>
        </Reveal>
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
            <Reveal key={step.n} delay={i * 0.07}>
              <div className="grid gap-1 py-8 sm:grid-cols-12 sm:gap-6">
                <span className="annotation text-xl sm:col-span-2" aria-hidden>
                  no. {step.n}
                </span>
                <h3 className="font-serif text-3xl tracking-[-0.01em] sm:col-span-4">
                  {step.title}
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-ink/75 sm:col-span-6 sm:pt-2">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Template index: an actual index, not a card grid */}
      <section className="py-10" aria-labelledby="templates-heading">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="templates-heading" className="font-serif text-4xl tracking-[-0.01em]">
              Index of templates
            </h2>
            <span className="annotation text-base">six ways to press a page</span>
          </div>
        </Reveal>
        <ol className="mt-7 border-t border-ink/15">
          {TEMPLATES.map((t, i) => (
            <Reveal key={t.id} delay={Math.min(i * 0.05, 0.3)}>
              <li className="group grid items-baseline gap-x-6 gap-y-1 border-b border-ink/10 py-5 transition-colors hover:bg-surface sm:grid-cols-12">
                <span className="annotation text-base sm:col-span-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-2xl group-hover:text-accent sm:col-span-4">
                  <Link to="/new" className="focus-visible:text-accent">
                    {t.name}
                  </Link>
                </h3>
                <p className="text-sm text-ink/70 sm:col-span-4">{t.description}</p>
                <p className="annotation text-sm sm:col-span-3 sm:text-right">
                  {t.produces.slice(0, 3).join(' · ').toLowerCase()}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Inks */}
      <section className="py-12" aria-labelledby="palettes-heading">
        <Reveal>
          <h2 id="palettes-heading" className="font-serif text-4xl tracking-[-0.01em]">
            Five inks
          </h2>
          <p className="annotation mt-1 text-base">
            three papers, two night plates — pick one to re-ink the journal
          </p>
        </Reveal>
        <div className="mt-7 flex flex-wrap gap-x-10 gap-y-5">
          {ACCENT_THEMES.map((theme) => {
            const p = PALETTES[theme]
            return (
              <button
                key={theme}
                onClick={() => setSettings({ defaultAccent: theme })}
                className="group cursor-pointer text-left"
                aria-label={`Switch to ${p.name} palette`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="inline-block h-10 w-10 rounded-full border border-ink/30 shadow-[2px_3px_0_0_color-mix(in_srgb,var(--sn-text)_20%,transparent)] transition-transform group-hover:-translate-y-0.5"
                    style={{ background: `linear-gradient(135deg, ${p.bg} 50%, ${p.accent} 50%)` }}
                  />
                  <span>
                    <span className="block font-serif text-lg leading-tight group-hover:text-accent">
                      {p.name}
                    </span>
                    <span className="annotation block text-sm">{p.description.toLowerCase()}</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Closing: the library pocket */}
      <section className="mb-6 mt-8">
        <Reveal>
          <div className="paper-grain relative overflow-hidden rounded-md border border-ink/20 bg-surface px-7 py-12 sm:px-12">
            <img
              src="/generated/svg/35-local-first.svg"
              alt=""
              className="absolute -right-6 -top-6 h-40 w-40 rotate-[8deg] opacity-50 sm:right-8 sm:top-1/2 sm:-translate-y-1/2 sm:rotate-[4deg] sm:opacity-90"
            />
            <p className="annotation text-base">checked out to: you, indefinitely</p>
            <h2 className="mt-2 max-w-xl font-serif text-4xl tracking-[-0.01em] sm:text-5xl">
              Your notes never leave this device.
            </h2>
            <Link
              to="/new"
              className="stamp mt-8 inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-base font-semibold text-surface"
            >
              Create your first Snap <ArrowRight size={17} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
