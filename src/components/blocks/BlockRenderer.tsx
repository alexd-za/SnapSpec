import type { SnapBlock } from '../../lib/model/types'
import { DiagramCanvas } from './DiagramCanvas'
import { FlashcardDeck } from './FlashcardDeck'
import { QuizView } from './QuizView'
import { AlertTriangle, CheckCircle2, GraduationCap, Info, Lightbulb } from 'lucide-react'

function SectionTitle({ title }: { title?: string }) {
  if (!title) return null
  return (
    <h2 className="mb-4 flex items-baseline justify-between gap-3 border-b border-ink/15 pb-1.5">
      <span
        className="font-serif text-lg italic text-accent"
        style={{ fontVariationSettings: "'opsz' 18, 'SOFT' 60" }}
      >
        {title.toLowerCase()}
      </span>
      <span className="inline-block h-[3px] w-8 self-center bg-accent/60" aria-hidden />
    </h2>
  )
}

const TONE_STYLE = {
  info: { icon: Info, label: 'Note' },
  warning: { icon: AlertTriangle, label: 'Watch out' },
  success: { icon: CheckCircle2, label: 'Good to know' },
  exam: { icon: GraduationCap, label: 'Exam trigger' },
  idea: { icon: Lightbulb, label: 'Idea' },
}

type BlockRendererProps = {
  block: SnapBlock
  /** Demote the heading block when the page is embedded (e.g. home demo)
      so each document keeps a single h1. */
  headingAs?: 'h1' | 'h2'
}

/** Renders any SnapBlock as a polished page section. */
export function BlockRenderer({ block, headingAs = 'h1' }: BlockRendererProps) {
  switch (block.type) {
    case 'heading': {
      const HeadingTag = headingAs
      return (
        <header className="py-2">
          {block.eyebrow && (
            <p className="annotation mb-2 text-base text-accent!">{block.eyebrow}</p>
          )}
          <HeadingTag className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
            {block.heading}
          </HeadingTag>
          {block.subheading && <p className="mt-3 text-base text-mist">{block.subheading}</p>}
        </header>
      )
    }

    case 'summary':
      return (
        <section>
          <SectionTitle title={block.title ?? 'Summary'} />
          <p className="font-serif text-lg leading-relaxed">{block.summary}</p>
        </section>
      )

    case 'key-points':
      return (
        <section>
          <SectionTitle title={block.title ?? 'Key points'} />
          <ul className="space-y-2.5">
            {block.points.map((point, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </section>
      )

    case 'definitions':
      return (
        <section>
          <SectionTitle title={block.title ?? 'Definitions'} />
          <dl className="grid gap-3 sm:grid-cols-2">
            {block.terms.map((t, i) => (
              <div key={i} className="rounded-xl bg-ink/4 p-4">
                <dt className="text-sm font-semibold text-accent">{t.term}</dt>
                <dd className="mt-1 text-sm text-ink/90">{t.definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      )

    case 'formulas':
      return (
        <section>
          <SectionTitle title={block.title ?? 'Formulas'} />
          <div className="space-y-3">
            {block.formulas.map((f, i) => (
              <div key={i} className="rounded-xl bg-ink/4 p-4">
                <p className="annotation text-base text-accent!">{f.label.toLowerCase()}</p>
                <code className="mt-2 block overflow-x-auto rounded-lg bg-bg px-4 py-3 font-mono text-base">
                  {f.expression}
                </code>
                <p className="mt-2 text-xs text-mist">{f.explanation}</p>
              </div>
            ))}
          </div>
        </section>
      )

    case 'quotes':
      return (
        <section>
          <SectionTitle title={block.title ?? 'Quotes'} />
          <div className="space-y-4">
            {block.quotes.map((q, i) => (
              <blockquote key={i} className="border-l-2 border-accent pl-4">
                <p className="font-serif text-base italic leading-relaxed">“{q.quote}”</p>
                {q.explanation && <p className="mt-2 text-sm text-mist">{q.explanation}</p>}
              </blockquote>
            ))}
          </div>
        </section>
      )

    case 'comparison':
      return (
        <section>
          <SectionTitle title={block.title ?? 'Comparison'} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {block.columns.map((c, i) => (
                    <th
                      key={i}
                      className="border-b border-mist/30 px-3 py-2 text-left font-semibold text-accent"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border-b border-mist/15 px-3 py-2 align-top">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )

    case 'timeline':
      return (
        <section>
          <SectionTitle title={block.title ?? 'Timeline'} />
          <ol className="space-y-0">
            {block.events.map((e, i) => (
              <li key={i} className="relative border-l-2 border-accent/40 pb-5 pl-5 last:pb-0">
                <span
                  className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-accent"
                  aria-hidden
                />
                <p className="annotation text-[15px] text-accent!">{e.label}</p>
                <p className="mt-0.5 text-sm">{e.detail}</p>
              </li>
            ))}
          </ol>
        </section>
      )

    case 'diagram':
      return (
        <section>
          <SectionTitle title={block.title ?? 'Diagram'} />
          <div className="rounded-xl bg-ink/4">
            <DiagramCanvas block={block} />
          </div>
        </section>
      )

    case 'flashcards':
      return (
        <section>
          <SectionTitle title={block.title ?? 'Flashcards'} />
          <FlashcardDeck block={block} />
        </section>
      )

    case 'quiz':
      return (
        <section>
          <SectionTitle title={block.title ?? 'Quiz'} />
          <QuizView block={block} />
        </section>
      )

    case 'essay-outline':
      return (
        <section>
          <SectionTitle title={block.title ?? 'Essay outline'} />
          <div className="space-y-4 text-sm">
            <p className="rounded-xl border-l-4 border-l-accent bg-accent/8 p-4 font-serif text-base italic">
              {block.thesis}
            </p>
            <ol className="space-y-2 pl-1">
              {block.arguments.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-serif font-semibold text-accent">{i + 1}.</span>
                  {a}
                </li>
              ))}
            </ol>
            {block.evidenceSlots.length > 0 && (
              <ul className="space-y-1 text-mist">
                {block.evidenceSlots.map((e, i) => (
                  <li key={i} className="pl-1">
                    — {e}
                  </li>
                ))}
              </ul>
            )}
            <p>
              <span className="font-semibold text-accent">Conclusion angle: </span>
              {block.conclusionAngle}
            </p>
          </div>
        </section>
      )

    case 'callout': {
      const tone = TONE_STYLE[block.tone] ?? TONE_STYLE.info
      const Icon = tone.icon
      return (
        <aside className="rounded-xl border-l-4 border-l-accent bg-accent/10 p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
            <Icon size={14} aria-hidden />
            {block.title ?? tone.label}
          </p>
          <p className="mt-2 text-sm leading-relaxed">{block.body}</p>
        </aside>
      )
    }

    case 'export-card':
      return (
        <section className="rounded-md border border-dashed border-ink/25 p-4">
          <SectionTitle title={block.title ?? 'Export this Snap'} />
          <div className="flex flex-wrap gap-2">
            {block.formats.map((f) => (
              <span
                key={f}
                className="rounded-full border border-mist/30 px-3 py-1 font-mono text-xs uppercase text-mist"
              >
                {f}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-mist">Use the Export button in the top bar.</p>
        </section>
      )

    default:
      return null
  }
}
