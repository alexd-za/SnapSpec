import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Download, Monitor, Smartphone, Check } from 'lucide-react'
import { useSnapStore } from '../lib/storage/store'
import type { SnapBlock } from '../lib/model/types'
import { templateMeta } from '../lib/model/templates'
import { BlockList } from '../components/editor/BlockList'
import { BlockInspector } from '../components/editor/BlockInspector'
import { AccentSwitcher } from '../components/editor/AccentSwitcher'
import { BlockRenderer } from '../components/blocks/BlockRenderer'
import { ExportDrawer } from '../components/exports/ExportDrawer'
import { ExportSuccessBloom } from '../components/motion/ExportSuccessBloom'
import { CascadeItem } from '../components/motion/Reveal'
import { SkeletonEditor } from '../components/ui/Skeletons'
import { MossPanel } from '../components/nature/MossPanel'
import { Button } from '../components/ui/Button'

export function Editor() {
  const { id } = useParams<{ id: string }>()
  const project = useSnapStore((s) => s.projects.find((p) => p.id === id))
  const { updateProject, updateBlock, moveBlock, duplicateBlock, deleteBlock } = useSnapStore()
  const defaultAccent = useSnapStore((s) => s.settings.defaultAccent)

  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [bloom, setBloom] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 420)
    return () => clearTimeout(t)
  }, [])

  // Live-preview the Snap's own palette while editing; restore on leave.
  useEffect(() => {
    if (project) document.documentElement.dataset.accent = project.accent
    return () => {
      document.documentElement.dataset.accent = defaultAccent
    }
  }, [project, project?.accent, defaultAccent])

  useEffect(() => {
    if (!saving) return
    const t = setTimeout(() => setSaving(false), 600)
    return () => clearTimeout(t)
  }, [saving])

  const selected: SnapBlock | null = useMemo(
    () => project?.blocks.find((b) => b.id === selectedId) ?? null,
    [project, selectedId],
  )

  if (!project) {
    return (
      <MossPanel className="mx-auto max-w-md p-10 text-center">
        <h1 className="font-serif text-2xl">Snap not found</h1>
        <p className="mt-2 text-sm text-mist">It may have been deleted from local storage.</p>
        <Link to="/gallery" className="mt-5 inline-block text-sm text-accent hover:underline">
          ← Back to Gallery
        </Link>
      </MossPanel>
    )
  }

  if (loading) return <SkeletonEditor />

  const edit = (fn: () => void) => {
    fn()
    setSaving(true)
  }

  return (
    <div data-testid="editor">
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-mist/15 bg-surface/80 p-3 backdrop-blur">
        <input
          aria-label="Snap title"
          className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 font-serif text-lg font-semibold focus:border-mist/30"
          value={project.title}
          onChange={(e) => edit(() => updateProject(project.id, { title: e.target.value }))}
        />
        <span className="hidden rounded-full border border-mist/25 px-3 py-1 text-xs text-mist md:inline">
          {templateMeta(project.template).name}
        </span>
        <AccentSwitcher
          compact
          value={project.accent}
          onChange={(accent) => edit(() => updateProject(project.id, { accent }))}
        />
        <button
          onClick={() => setNarrow((n) => !n)}
          aria-label={narrow ? 'Switch to wide preview' : 'Switch to narrow preview'}
          title="Toggle preview width"
          className="hidden cursor-pointer rounded-lg border border-mist/25 p-2 text-mist transition-colors hover:text-accent lg:block"
        >
          {narrow ? <Smartphone size={15} aria-hidden /> : <Monitor size={15} aria-hidden />}
        </button>
        <span
          className={`flex items-center gap-1 text-[11px] ${saving ? 'text-mist' : 'text-accent'}`}
          aria-live="polite"
        >
          <Check size={12} aria-hidden />
          {saving ? 'Saving…' : 'Saved locally'}
        </span>
        <Button size="sm" onClick={() => setDrawerOpen(true)}>
          <Download size={14} aria-hidden /> Export
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)_280px]">
        <div className="order-2 lg:order-1">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-mist">
            Blocks
          </p>
          <BlockList
            blocks={project.blocks}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onMove={(bid, dir) => edit(() => moveBlock(project.id, bid, dir))}
            onDuplicate={(bid) => edit(() => duplicateBlock(project.id, bid))}
            onDelete={(bid) =>
              edit(() => {
                deleteBlock(project.id, bid)
                if (selectedId === bid) setSelectedId(null)
              })
            }
          />
        </div>

        <MossPanel
          className={`order-1 p-6 sm:p-8 lg:order-2 ${narrow ? 'mx-auto w-full max-w-sm' : ''}`}
        >
          {project.blocks.length === 0 ? (
            <div className="py-16 text-center">
              <img
                src="/generated/svg/40-loading-seed.svg"
                alt=""
                className="mx-auto mb-5 h-28 w-28 opacity-80"
              />
              <p className="font-serif text-lg">This page is an empty clearing</p>
              <p className="mt-1 text-sm text-mist">
                All blocks were removed. Create a new Snap, or duplicate one from the Gallery.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {project.blocks.map((block, i) => (
                <CascadeItem key={block.id} index={i}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedId(block.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedId(block.id)
                      }
                    }}
                    aria-label={`Edit ${block.type} block`}
                    className={`-mx-3 cursor-pointer rounded-xl px-3 py-1 transition-shadow ${
                      selectedId === block.id
                        ? 'ring-1 ring-accent/60'
                        : 'hover:ring-1 hover:ring-mist/30'
                    }`}
                  >
                    <BlockRenderer block={block} />
                  </div>
                </CascadeItem>
              ))}
            </div>
          )}
        </MossPanel>

        <div className="order-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-mist">
            Inspector
          </p>
          <MossPanel className="p-4">
            <BlockInspector
              block={selected}
              onChange={(patch) => {
                if (selected) edit(() => updateBlock(project.id, selected.id, patch))
              }}
            />
          </MossPanel>
        </div>
      </div>

      <ExportDrawer
        project={project}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onExported={(label) => {
          setBloom(`${label} exported`)
          setTimeout(() => setBloom(null), 2400)
        }}
      />
      <ExportSuccessBloom show={bloom !== null} label={bloom ?? ''} />
    </div>
  )
}
