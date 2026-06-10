import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { SnapTemplate } from '../lib/model/types'
import { TEMPLATES } from '../lib/model/templates'
import { PALETTES, ACCENT_THEMES } from '../lib/model/palettes'
import { useSnapStore } from '../lib/storage/store'
import { Reveal } from '../components/motion/Reveal'
import { TemplateCard } from '../components/gallery/TemplateCard'
import { SnapPreview } from '../components/gallery/SnapPreview'

const EXPORTS_LINE = 'HTML · Markdown · JSON · SVG · SVGZ · PNG · Video'

const STEPS = [
  {
    n: '01',
    title: 'Paste anything',
    body: 'Class notes, a poem, maths working, a product idea. Messy is the expected input — that is the point.',
  },
  {
    n: '02',
    title: 'The parser does fieldwork',
    body: 'A deterministic local parser identifies the title, summary, definitions, formulas, quotes, and timelines. No AI API. Nothing leaves your device.',
  },
  {
    n: '03',
    title: 'Edit, press, export',
    body: 'Refine every block in the editor, switch the ink palette, then press the page to HTML, Markdown, JSON, SVG — or a full revision pack.',
  },
]

export function Home() {
  const [demoTemplate, setDemoTemplate] = useState<SnapTemplate>('study-notes')
  const setSettings = useSnapStore((s) => s.setSettings)

  return (
    <div>
      {/* Masthead hero — asymmetric, left-aligned, journal cover */}
      <section className="grid gap-10 py-10 lg:grid-cols-12 lg:gap-8 lg:py-16">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-ink/20 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mist">
              <span>Field guide · Vol. 01</span>
              <span aria-hidden>—</span>
              <span className="text-accent">Local-first · no accounts · no cloud</span>
            </p>
            <h1 className="font-serif text-5xl leading-[1.02] tracking-tight sm:text-7xl">
              Turn messy notes into{' '}
              <em className="text-accent" style={{ fontVariationSettings: "'opsz' 72, 'SOFT' 60" }}>
                living explainers
              </em>
              .
            </h1>
            <p className="mt-6 max-w-md font-serif text-lg leading-relaxed text-ink/85">
              Paste notes. Pick a template. Edit the page. Export everything.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                to="/new"
                className="stamp inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3 text-base font-semibold text-surface"
              >
                Create Snap <ArrowRight size={17} aria-hidden />
              </Link>
              <Link
                to="/gallery"
                className="font-mono text-xs uppercase tracking-[0.16em] text-ink underline decoration-ink/30 underline-offset-4 hover:text-accent hover:decoration-accent"
              >
                Browse the gallery
              </Link>
            </div>
            <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
              Exports — {EXPORTS_LINE}
            </p>
          </Reveal>
        </div>

        {/* Specimen card: the live demo, pinned slightly off-axis */}
        <div className="lg:col-span-5">
          <Reveal delay={0.2}>
            <div className="relative lg:rotate-[0.6deg]">
              <span className="specimen-label absolute -top-2.5 left-5 z-10 text-mist">
                Specimen 001 · parsed live
              </span>
              <SnapPreview template={demoTemplate} maxBlocks={3} />
            </div>
            <div
              className="mt-4 flex flex-wrap gap-x-4 gap-y-1"
              role="group"
              aria-label="Demo template"
            >
              {TEMPLATES.slice(0, 3).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setDemoTemplate(t.id)}
                  aria-pressed={demoTemplate === t.id}
                  className={`cursor-pointer font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                    demoTemplate === t.id
                      ? 'text-accent underline decoration-2 underline-offset-4'
                      : 'text-mist hover:text-ink'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="ink-rule" role="presentation" />

      {/* Process — numbered editorial rows, not icon cards */}
      <section className="py-12" aria-labelledby="how-heading">
        <Reveal>
          <h2
            id="how-heading"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-mist"
          >
            The method
          </h2>
        </Reveal>
        <div className="mt-6 divide-y divide-ink/10">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <div className="grid gap-2 py-7 sm:grid-cols-12 sm:gap-6">
                <span
                  className="font-serif text-5xl text-accent/35 sm:col-span-2 sm:text-6xl"
                  aria-hidden
                >
                  {step.n}
                </span>
                <h3 className="font-serif text-2xl sm:col-span-4">{step.title}</h3>
                <p className="max-w-md text-sm leading-relaxed text-ink/75 sm:col-span-6">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="ink-rule" role="presentation" />

      {/* Templates — the index */}
      <section className="py-12" aria-labelledby="templates-heading">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="templates-heading" className="font-serif text-3xl">
              Six templates, one quiet system
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
              Index of plates
            </span>
          </div>
        </Reveal>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t, i) => (
            <TemplateCard key={t.id} template={t} index={i} />
          ))}
        </div>
      </section>

      <div className="ink-rule" role="presentation" />

      {/* Palettes — ink swatches */}
      <section className="py-12" aria-labelledby="palettes-heading">
        <Reveal>
          <h2 id="palettes-heading" className="font-serif text-3xl">
            Five inks
          </h2>
          <p className="mt-1.5 text-sm text-ink/70">
            Pick one to re-ink the whole journal. Three papers, two night plates.
          </p>
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
          {ACCENT_THEMES.map((theme, i) => {
            const p = PALETTES[theme]
            return (
              <button
                key={theme}
                onClick={() => setSettings({ defaultAccent: theme })}
                className="group cursor-pointer text-left"
                aria-label={`Switch to ${p.name} palette`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="inline-block h-9 w-9 rounded-full border border-ink/30 transition-transform group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${p.bg} 50%, ${p.accent} 50%)` }}
                  />
                  <span>
                    <span className="block font-serif text-base leading-tight">{p.name}</span>
                    <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-mist">
                      No. {i + 1} · {p.dark ? 'night plate' : 'paper'}
                    </span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="ink-rule" role="presentation" />

      {/* Closing plate */}
      <section className="grid items-center gap-8 py-14 sm:grid-cols-12">
        <img
          src="/generated/svg/35-local-first.svg"
          alt=""
          className="mx-auto h-28 w-28 sm:col-span-3 sm:h-32 sm:w-32"
        />
        <div className="sm:col-span-9">
          <Reveal>
            <h2 className="font-serif text-3xl sm:text-4xl">Your notes never leave this device.</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/75">
              Everything is parsed, stored, and exported locally. Delete the site data and it's gone
              — that's the deal.
            </p>
            <Link
              to="/new"
              className="stamp mt-7 inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3 text-base font-semibold text-surface"
            >
              Create your first Snap <ArrowRight size={17} aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
