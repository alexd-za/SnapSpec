import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Lock, FileOutput, Wand2 } from 'lucide-react'
import type { SnapTemplate } from '../lib/model/types'
import { TEMPLATES } from '../lib/model/templates'
import { PALETTES, ACCENT_THEMES } from '../lib/model/palettes'
import { useSnapStore } from '../lib/storage/store'
import { Reveal } from '../components/motion/Reveal'
import { LeafVeinDivider } from '../components/nature/LeafVeinDivider'
import { TemplateCard } from '../components/gallery/TemplateCard'
import { SnapPreview } from '../components/gallery/SnapPreview'

const EXPORT_BADGES = ['HTML', 'Markdown', 'JSON', 'SVG', 'SVGZ', 'PNG', 'Video']

const STEPS = [
  {
    icon: Leaf,
    title: 'Paste anything',
    body: 'Class notes, a poem, maths working, a product idea — messy is fine.',
  },
  {
    icon: Wand2,
    title: 'SpecSnap structures it',
    body: 'A deterministic local parser finds the title, summary, definitions, formulas, and quotes. No AI API, no upload.',
  },
  {
    icon: FileOutput,
    title: 'Edit & export',
    body: 'Refine each block, switch palettes, then export HTML, Markdown, JSON, SVG, or a full revision pack.',
  },
]

export function Home() {
  const [demoTemplate, setDemoTemplate] = useState<SnapTemplate>('study-notes')
  const setSettings = useSnapStore((s) => s.setSettings)

  return (
    <div>
      {/* Hero */}
      <section className="py-10 text-center sm:py-16">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs text-accent">
            <Lock size={12} aria-hidden /> Local-first · no accounts · no cloud
          </p>
          <h1 className="mx-auto max-w-3xl font-serif text-4xl leading-tight tracking-tight sm:text-6xl">
            Turn messy notes into beautiful{' '}
            <span className="text-accent">living explainers</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-mist sm:text-lg">
            Paste notes. Pick a template. Edit the page. Export everything.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/new"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-base font-semibold text-bg shadow-[0_4px_24px_-6px_var(--sn-accent)] transition-all hover:brightness-110"
            >
              Create Snap <ArrowRight size={18} aria-hidden />
            </Link>
            <Link
              to="/gallery"
              className="rounded-xl border border-mist/30 px-6 py-3.5 text-base text-ink transition-colors hover:border-accent/60 hover:text-accent"
            >
              Browse Gallery
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {EXPORT_BADGES.map((b) => (
              <span
                key={b}
                className="rounded-full border border-mist/25 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-mist"
              >
                {b}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <LeafVeinDivider />

      {/* Live demo */}
      <section className="py-10" aria-labelledby="demo-heading">
        <Reveal>
          <h2 id="demo-heading" className="text-center font-serif text-2xl sm:text-3xl">
            Watch a page grow from raw notes
          </h2>
          <p className="mt-2 text-center text-sm text-mist">
            A real sample, parsed live in your browser. Pick a flavour:
          </p>
        </Reveal>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {TEMPLATES.slice(0, 3).map((t) => (
            <button
              key={t.id}
              onClick={() => setDemoTemplate(t.id)}
              aria-pressed={demoTemplate === t.id}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors ${
                demoTemplate === t.id
                  ? 'bg-accent text-bg font-medium'
                  : 'border border-mist/30 text-mist hover:text-ink'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-2xl">
          <SnapPreview template={demoTemplate} />
        </div>
      </section>

      <LeafVeinDivider />

      {/* How it works */}
      <section className="py-10" aria-labelledby="how-heading">
        <Reveal>
          <h2 id="how-heading" className="text-center font-serif text-2xl sm:text-3xl">
            How it works
          </h2>
        </Reveal>
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <div className="paper-grain h-full rounded-2xl border border-mist/20 bg-surface p-5">
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <step.icon size={20} aria-hidden />
                </span>
                <h3 className="font-serif text-lg">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mist">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <LeafVeinDivider />

      {/* Templates */}
      <section className="py-10" aria-labelledby="templates-heading">
        <Reveal>
          <h2 id="templates-heading" className="text-center font-serif text-2xl sm:text-3xl">
            Six templates, one calm system
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </section>

      <LeafVeinDivider />

      {/* Palettes */}
      <section className="py-10 text-center" aria-labelledby="palettes-heading">
        <Reveal>
          <h2 id="palettes-heading" className="font-serif text-2xl sm:text-3xl">
            Five palettes from the field guide
          </h2>
          <p className="mt-2 text-sm text-mist">Click one to re-tint the whole app.</p>
        </Reveal>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {ACCENT_THEMES.map((theme) => {
            const p = PALETTES[theme]
            return (
              <button
                key={theme}
                onClick={() => setSettings({ defaultAccent: theme })}
                className="group cursor-pointer rounded-2xl border border-mist/20 p-3 transition-colors hover:border-accent/50"
                aria-label={`Switch to ${p.name} palette`}
              >
                <span
                  className="block h-16 w-24 rounded-xl border border-black/20 transition-transform group-hover:scale-105"
                  style={{
                    background: `linear-gradient(160deg, ${p.bg} 55%, ${p.surface} 55%, ${p.surface} 80%, ${p.accent} 80%)`,
                  }}
                />
                <span className="mt-2 block text-xs font-medium">{p.name}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-14 text-center">
        <Reveal>
          <img src="/generated/svg/35-local-first.svg" alt="" className="mx-auto mb-5 h-24 w-24" />
          <h2 className="font-serif text-2xl sm:text-3xl">Your notes never leave this device.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-mist">
            Everything is parsed, stored, and exported locally. Delete the site data and it's gone —
            that's the deal.
          </p>
          <Link
            to="/new"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-base font-semibold text-bg shadow-[0_4px_24px_-6px_var(--sn-accent)] transition-all hover:brightness-110"
          >
            Create your first Snap <ArrowRight size={18} aria-hidden />
          </Link>
        </Reveal>
      </section>
    </div>
  )
}
