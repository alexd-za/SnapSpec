import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Upload, Wand2 } from 'lucide-react'
import type { SnapSource, SnapTemplate } from '../lib/model/types'
import { TEMPLATES } from '../lib/model/templates'
import { SAMPLE_INPUTS } from '../lib/model/examples'
import { detectTemplate } from '../lib/parser/detectTemplate'
import { useSnapStore } from '../lib/storage/store'
import { nowIso } from '../lib/utils/dates'
import { MossPanel } from '../components/nature/MossPanel'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/motion/Reveal'
import { SkeletonBlock } from '../components/ui/Skeletons'
import { TemplateCard } from '../components/gallery/TemplateCard'

export function NewSnap() {
  const navigate = useNavigate()
  const createProject = useSnapStore((s) => s.createProject)
  const defaultTemplate = useSnapStore((s) => s.settings.defaultTemplate)

  const [template, setTemplate] = useState<SnapTemplate>(defaultTemplate)
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState<string | undefined>()
  const [sourceType, setSourceType] = useState<SnapSource['type']>('paste')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const suggested = text.trim().length > 40 ? detectTemplate(text) : null

  function loadSample() {
    const sample = SAMPLE_INPUTS[template]
    setText(sample.text)
    setSourceType('sample')
    setFileName(undefined)
    setError(null)
  }

  async function onFile(file: File) {
    if (file.name.endsWith('.pdf')) {
      setError('PDF import is not supported yet — paste the text instead. (.txt and .md work.)')
      return
    }
    const content = await file.text()
    setText(content)
    setFileName(file.name)
    setSourceType(file.name.endsWith('.md') ? 'markdown' : 'txt')
    setError(null)
  }

  function generate() {
    if (text.trim().length < 10) {
      setError('Paste at least a few lines of notes first — SpecSnap needs something to work with.')
      return
    }
    setError(null)
    setGenerating(true)
    const source: SnapSource = { type: sourceType, rawText: text, fileName, importedAt: nowIso() }
    // A short, honest pause: parsing is instant, but the cascade reveal
    // lands better when the skeleton breathes once.
    setTimeout(() => {
      const project = createProject(source, template)
      navigate(`/editor/${project.id}`)
    }, 650)
  }

  if (generating) {
    return (
      <div className="mx-auto max-w-2xl space-y-4" aria-live="polite">
        <p className="text-center font-serif text-xl">Growing your explainer…</p>
        <SkeletonBlock lines={2} />
        <SkeletonBlock lines={4} />
        <SkeletonBlock lines={3} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Reveal>
        <h1 className="font-serif text-3xl tracking-tight">New Snap</h1>
        <p className="annotation mt-1.5 text-base">pick a template, paste your notes — the parser does the pressing</p>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 className="annotation mb-3 mt-8 text-lg">step one — choose a template</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Template">
          {TEMPLATES.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              selected={t.id === template}
              onSelect={() => setTemplate(t.id)}
              suggested={suggested === t.id}
            />
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.16}>
        <h2 className="annotation mb-3 mt-8 text-lg">step two — feed it your notes</h2>
        <MossPanel className="p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadSample}>
              <Sparkles size={14} aria-hidden /> Load sample: {SAMPLE_INPUTS[template].name}
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload size={14} aria-hidden /> Import .txt / .md
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.markdown,.pdf"
              className="hidden"
              aria-label="Import file"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) onFile(f)
                e.target.value = ''
              }}
            />
            {fileName && <span className="text-xs text-mist">Imported: {fileName}</span>}
          </div>

          <label className="block">
            <span className="sr-only">Paste your notes</span>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                if (sourceType === 'sample') setSourceType('paste')
              }}
              rows={12}
              placeholder={`Paste anything messy here — class notes, a poem, maths working, a product idea…\n\nSpecSnap finds the structure: title, summary, key points, definitions, formulas, quotes, flashcards.`}
              className="w-full resize-y rounded-xl border border-mist/25 bg-bg/60 p-4 font-mono text-sm leading-relaxed text-ink placeholder:text-mist/50 focus:border-accent/60"
            />
          </label>

          {suggested && suggested !== template && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-accent">
              <Wand2 size={13} aria-hidden />
              This looks like {TEMPLATES.find((t) => t.id === suggested)?.name}.{' '}
              <button className="cursor-pointer underline" onClick={() => setTemplate(suggested)}>
                Switch template
              </button>
            </p>
          )}

          {error && (
            <p role="alert" className="mt-3 rounded-lg border border-red-400/40 bg-red-400/10 p-3 text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-mist">{text.trim().length.toLocaleString()} characters · parsed locally</p>
            <Button size="lg" onClick={generate}>
              Generate page →
            </Button>
          </div>
        </MossPanel>
      </Reveal>
    </div>
  )
}
