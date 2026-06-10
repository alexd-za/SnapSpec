import type { SnapBlock } from '../../lib/model/types'

type InspectorProps = {
  block: SnapBlock | null
  onChange: (patch: Partial<SnapBlock>) => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-mist">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-lg border border-mist/25 bg-bg/60 px-3 py-2 text-sm text-ink placeholder:text-mist/60 focus:border-accent/60'

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      className={inputCls}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function TextArea({
  value,
  onChange,
  rows = 5,
  hint,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
  hint?: string
}) {
  return (
    <div>
      <textarea
        className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1 text-[11px] text-mist">{hint}</p>}
    </div>
  )
}

const SEP = ' :: '
const lines = (v: string) => v.split('\n').map((l) => l.trim()).filter(Boolean)

/** Editor right sidebar: structured editing for the selected block. */
export function BlockInspector({ block, onChange }: InspectorProps) {
  if (!block) {
    return (
      <div className="rounded-xl border border-dashed border-mist/25 p-6 text-center text-xs text-mist">
        Select a block to edit it here.
      </div>
    )
  }

  return (
    <div className="space-y-4" key={block.id}>
      <Field label="Section title">
        <TextInput value={block.title ?? ''} onChange={(title) => onChange({ title })} />
      </Field>
      <BlockFields block={block} onChange={onChange} />
    </div>
  )
}

function BlockFields({ block, onChange }: { block: SnapBlock; onChange: InspectorProps['onChange'] }) {
  switch (block.type) {
    case 'heading':
      return (
        <>
          <Field label="Eyebrow">
            <TextInput value={block.eyebrow ?? ''} onChange={(eyebrow) => onChange({ eyebrow })} />
          </Field>
          <Field label="Heading">
            <TextInput value={block.heading} onChange={(heading) => onChange({ heading })} />
          </Field>
          <Field label="Subheading">
            <TextArea
              rows={3}
              value={block.subheading ?? ''}
              onChange={(subheading) => onChange({ subheading })}
            />
          </Field>
        </>
      )

    case 'summary':
      return (
        <Field label="Summary">
          <TextArea rows={7} value={block.summary} onChange={(summary) => onChange({ summary })} />
        </Field>
      )

    case 'key-points':
      return (
        <Field label="Points">
          <TextArea
            rows={8}
            value={block.points.join('\n')}
            onChange={(v) => onChange({ points: lines(v) })}
            hint="One point per line."
          />
        </Field>
      )

    case 'definitions':
      return (
        <Field label="Terms">
          <TextArea
            rows={8}
            value={block.terms.map((t) => `${t.term}${SEP}${t.definition}`).join('\n')}
            onChange={(v) =>
              onChange({
                terms: lines(v).map((l) => {
                  const [term = '', definition = ''] = l.split(SEP.trim()).map((s) => s.trim())
                  return { term, definition }
                }),
              })
            }
            hint="One per line: term :: definition"
          />
        </Field>
      )

    case 'formulas':
      return (
        <Field label="Formulas">
          <TextArea
            rows={8}
            value={block.formulas.map((f) => [f.label, f.expression, f.explanation].join(SEP)).join('\n')}
            onChange={(v) =>
              onChange({
                formulas: lines(v).map((l) => {
                  const [label = '', expression = '', explanation = ''] = l
                    .split(SEP.trim())
                    .map((s) => s.trim())
                  return { label, expression, explanation }
                }),
              })
            }
            hint="One per line: label :: expression :: explanation"
          />
        </Field>
      )

    case 'quotes':
      return (
        <Field label="Quotes">
          <TextArea
            rows={8}
            value={block.quotes.map((q) => [q.quote, q.explanation ?? ''].join(SEP)).join('\n')}
            onChange={(v) =>
              onChange({
                quotes: lines(v).map((l) => {
                  const [quote = '', explanation] = l.split(SEP.trim()).map((s) => s.trim())
                  return { quote, explanation: explanation || undefined }
                }),
              })
            }
            hint="One per line: quote :: explanation"
          />
        </Field>
      )

    case 'comparison':
      return (
        <>
          <Field label="Columns">
            <TextInput
              value={block.columns.join(' | ')}
              onChange={(v) => onChange({ columns: v.split('|').map((c) => c.trim()).filter(Boolean) })}
            />
          </Field>
          <Field label="Rows">
            <TextArea
              rows={7}
              value={block.rows.map((r) => r.join(' | ')).join('\n')}
              onChange={(v) =>
                onChange({ rows: lines(v).map((l) => l.split('|').map((c) => c.trim())) })
              }
              hint="One row per line, cells separated by |"
            />
          </Field>
        </>
      )

    case 'timeline':
      return (
        <Field label="Events">
          <TextArea
            rows={8}
            value={block.events.map((e) => `${e.label}${SEP}${e.detail}`).join('\n')}
            onChange={(v) =>
              onChange({
                events: lines(v).map((l) => {
                  const [label = '', detail = ''] = l.split(SEP.trim()).map((s) => s.trim())
                  return { label, detail }
                }),
              })
            }
            hint="One per line: label :: detail"
          />
        </Field>
      )

    case 'diagram':
      return (
        <Field label="Node labels">
          <TextArea
            rows={7}
            value={block.nodes.map((n) => n.label).join('\n')}
            onChange={(v) => {
              const labels = lines(v)
              onChange({
                nodes: block.nodes.map((n, i) => ({ ...n, label: labels[i] ?? n.label })),
              })
            }}
            hint="Edit one label per line (positions stay fixed)."
          />
        </Field>
      )

    case 'flashcards':
      return (
        <Field label="Cards">
          <TextArea
            rows={9}
            value={block.cards.map((c) => `${c.front}${SEP}${c.back}`).join('\n')}
            onChange={(v) =>
              onChange({
                cards: lines(v).map((l) => {
                  const [front = '', back = ''] = l.split(SEP.trim()).map((s) => s.trim())
                  return { front, back }
                }),
              })
            }
            hint="One per line: front :: back"
          />
        </Field>
      )

    case 'quiz':
      return (
        <Field label="Questions">
          <TextArea
            rows={9}
            value={block.questions.map((q) => [q.prompt, q.answer, q.memo ?? ''].join(SEP)).join('\n')}
            onChange={(v) =>
              onChange({
                questions: lines(v).map((l) => {
                  const [prompt = '', answer = '', memo] = l.split(SEP.trim()).map((s) => s.trim())
                  return { prompt, answer, memo: memo || undefined }
                }),
              })
            }
            hint="One per line: prompt :: answer :: memo"
          />
        </Field>
      )

    case 'essay-outline':
      return (
        <>
          <Field label="Thesis">
            <TextArea rows={3} value={block.thesis} onChange={(thesis) => onChange({ thesis })} />
          </Field>
          <Field label="Arguments">
            <TextArea
              rows={4}
              value={block.arguments.join('\n')}
              onChange={(v) => onChange({ arguments: lines(v) })}
              hint="One argument per line."
            />
          </Field>
          <Field label="Evidence slots">
            <TextArea
              rows={3}
              value={block.evidenceSlots.join('\n')}
              onChange={(v) => onChange({ evidenceSlots: lines(v) })}
            />
          </Field>
          <Field label="Conclusion angle">
            <TextArea
              rows={2}
              value={block.conclusionAngle}
              onChange={(conclusionAngle) => onChange({ conclusionAngle })}
            />
          </Field>
        </>
      )

    case 'callout':
      return (
        <>
          <Field label="Tone">
            <select
              className={inputCls}
              value={block.tone}
              onChange={(e) => onChange({ tone: e.target.value as typeof block.tone })}
            >
              {['info', 'warning', 'success', 'exam', 'idea'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Body">
            <TextArea rows={4} value={block.body} onChange={(body) => onChange({ body })} />
          </Field>
        </>
      )

    case 'export-card':
      return (
        <Field label="Formats">
          <TextInput
            value={block.formats.join(', ')}
            onChange={(v) => onChange({ formats: v.split(',').map((f) => f.trim()).filter(Boolean) })}
          />
        </Field>
      )

    default:
      return null
  }
}
