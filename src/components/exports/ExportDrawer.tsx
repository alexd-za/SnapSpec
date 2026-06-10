import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, FileText, FileCode, Braces, Image as ImageIcon, FileArchive, Package, Film } from 'lucide-react'
import type { SnapProject, SnapExport } from '../../lib/model/types'
import { performExport, type ExportFormat } from '../../lib/exports/runExport'
import { downloadFile } from '../../lib/storage/persistence'
import { useSnapStore } from '../../lib/storage/store'
import { useMotionPref } from '../../lib/hooks/useMotionPref'

const FORMATS: { format: ExportFormat; label: string; desc: string; icon: typeof FileText }[] = [
  { format: 'html', label: 'HTML page', desc: 'Standalone styled page, works anywhere.', icon: FileCode },
  { format: 'markdown', label: 'Markdown', desc: 'Clean .md for Obsidian, Notion, GitHub.', icon: FileText },
  { format: 'json', label: 'JSON', desc: 'Full project data, re-importable.', icon: Braces },
  { format: 'svg', label: 'SVG poster', desc: 'Poster + concept map as vector art.', icon: ImageIcon },
  { format: 'svgz', label: 'SVGZ', desc: 'Gzip-compressed SVG poster.', icon: FileArchive },
  { format: 'png', label: 'PNG poster', desc: 'Raster poster for quick sharing.', icon: ImageIcon },
  { format: 'revision-pack', label: 'Revision pack', desc: 'page.html + page.md + project.json + assets.', icon: Package },
  { format: 'video', label: 'Video storyboard', desc: 'Remotion-ready storyboard JSON.', icon: Film },
]

type ExportDrawerProps = {
  project: SnapProject
  open: boolean
  onClose: () => void
  onExported: (label: string) => void
}

/** Slide-in drawer listing every export format for the current Snap. */
export function ExportDrawer({ project, open, onClose, onExported }: ExportDrawerProps) {
  const addExport = useSnapStore((s) => s.addExport)
  const [busy, setBusy] = useState<ExportFormat | null>(null)
  const [error, setError] = useState<string | null>(null)
  const animate = useMotionPref()

  async function run(format: ExportFormat) {
    setBusy(format)
    setError(null)
    try {
      const files = await performExport(project, format)
      for (const file of files) {
        downloadFile(file.fileName, file.blob)
      }
      const record = format === 'revision-pack' ? 'html' : format
      addExport(project.id, record as SnapExport['format'], files[0]?.fileName)
      onExported(FORMATS.find((f) => f.format === format)?.label ?? format)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed')
    } finally {
      setBusy(null)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            className="fixed inset-0 z-40 cursor-default bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close export drawer"
          />
          <motion.aside
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm overflow-y-auto border-l border-mist/20 bg-surface p-6 shadow-2xl"
            initial={animate ? { x: '100%' } : { x: 0 }}
            animate={{ x: 0 }}
            exit={animate ? { x: '100%' } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            role="dialog"
            aria-label="Export options"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl">Export</h2>
                <p className="text-xs text-mist">“{project.title}”</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="cursor-pointer rounded-lg p-2 text-mist transition-colors hover:bg-mist/10 hover:text-ink"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            {error && (
              <p className="mb-4 rounded-lg border border-red-400/40 bg-red-400/10 p-3 text-xs text-red-300">
                {error}
              </p>
            )}

            <ul className="space-y-2">
              {FORMATS.map(({ format, label, desc, icon: Icon }) => (
                <li key={format}>
                  <button
                    onClick={() => run(format)}
                    disabled={busy !== null}
                    className="flex w-full cursor-pointer items-start gap-3 rounded-xl border border-mist/20 bg-bg/50 p-3.5 text-left transition-colors hover:border-accent/50 disabled:opacity-50"
                  >
                    <span className="mt-0.5 text-accent">
                      <Icon size={18} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">
                        {busy === format ? 'Exporting…' : label}
                      </span>
                      <span className="block text-xs text-mist">{desc}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-[11px] leading-relaxed text-mist">
              Files download straight to your device. Nothing is uploaded — SpecSnap is local-first.
            </p>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
