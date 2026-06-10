import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { SnapProject } from '../lib/model/types'
import { useSnapStore } from '../lib/storage/store'
import { performExport } from '../lib/exports/runExport'
import { downloadFile } from '../lib/storage/persistence'
import { GalleryCard } from '../components/gallery/GalleryCard'
import { SkeletonCard } from '../components/ui/Skeletons'
import { ExportSuccessBloom } from '../components/motion/ExportSuccessBloom'
import { Reveal } from '../components/motion/Reveal'

export function Gallery() {
  const projects = useSnapStore((s) => s.projects)
  const deleteProject = useSnapStore((s) => s.deleteProject)
  const addExport = useSnapStore((s) => s.addExport)
  const [loading, setLoading] = useState(true)
  const [bloom, setBloom] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<SnapProject | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  async function quickExport(project: SnapProject) {
    const files = await performExport(project, 'html')
    for (const f of files) downloadFile(f.fileName, f.blob)
    addExport(project.id, 'html', files[0]?.fileName)
    setBloom('HTML exported')
    setTimeout(() => setBloom(null), 2400)
  }

  return (
    <div data-testid="gallery">
      <Reveal>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl tracking-tight">Gallery</h1>
            <p className="mt-1 text-sm text-mist">
              Every Snap you've grown, stored locally on this device.
            </p>
          </div>
          <Link
            to="/new"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-bg transition-all hover:brightness-110"
          >
            <Plus size={16} aria-hidden /> New Snap
          </Link>
        </div>
      </Reveal>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-mist/30 p-12 text-center">
          <img src="/generated/svg/33-empty-gallery.svg" alt="" className="mx-auto mb-6 h-40 w-40" />
          <h2 className="font-serif text-xl">Nothing planted yet</h2>
          <p className="mt-2 text-sm text-mist">
            Your first Snap is one paste away. Notes in, explainer out.
          </p>
          <Link
            to="/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-all hover:brightness-110"
          >
            <Plus size={15} aria-hidden /> Create your first Snap
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <GalleryCard
              key={project.id}
              project={project}
              index={i}
              onQuickExport={quickExport}
              onDelete={setConfirmDelete}
            />
          ))}
        </div>
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm deletion"
        >
          <div className="w-full max-w-sm rounded-2xl border border-mist/25 bg-surface p-6">
            <h2 className="font-serif text-lg">Delete “{confirmDelete.title}”?</h2>
            <p className="mt-2 text-sm text-mist">
              This removes the Snap from local storage. There is no undo.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="cursor-pointer rounded-xl border border-mist/30 px-4 py-2 text-sm transition-colors hover:border-mist/60"
              >
                Keep it
              </button>
              <button
                onClick={() => {
                  deleteProject(confirmDelete.id)
                  setConfirmDelete(null)
                }}
                className="cursor-pointer rounded-xl bg-red-400/90 px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ExportSuccessBloom show={bloom !== null} label={bloom ?? ''} />
    </div>
  )
}
