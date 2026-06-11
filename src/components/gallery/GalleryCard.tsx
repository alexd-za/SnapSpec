import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Download, PencilLine, Trash2 } from 'lucide-react'
import type { SnapProject } from '../../lib/model/types'
import { templateMeta } from '../../lib/model/templates'
import { PALETTES } from '../../lib/model/palettes'
import { formatDate } from '../../lib/utils/dates'
import { useMotionPref } from '../../lib/hooks/useMotionPref'

type GalleryCardProps = {
  project: SnapProject
  index: number
  onQuickExport: (project: SnapProject) => void
  onDelete: (project: SnapProject) => void
}

/** A pressed specimen: one saved Snap as a numbered field-journal card. */
export function GalleryCard({ project, index, onQuickExport, onDelete }: GalleryCardProps) {
  const animate = useMotionPref()
  const palette = PALETTES[project.accent]
  return (
    <motion.article
      initial={animate ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.5) }}
      whileHover={animate ? { y: -4, rotate: 0 } : undefined}
      className="float-lift flex flex-col float-panel rounded-xl p-5 transition-colors hover:border-ink/40"
      style={{ rotate: index % 3 === 0 ? '-0.4deg' : index % 3 === 1 ? '0.35deg' : '0deg' }}
    >
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-mist">
        <span>No. {String(index + 1).padStart(3, '0')}</span>
        <span className="flex items-center gap-2">
          {templateMeta(project.template).name}
          <span
            className="inline-block h-3.5 w-3.5 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${palette.bg} 50%, ${palette.accent} 50%)`,
            }}
            title={`${palette.name} palette`}
            aria-label={`${palette.name} palette`}
            role="img"
          />
        </span>
      </div>

      <Link to={`/editor/${project.id}`} className="group flex-1">
        <h3 className="font-serif text-xl leading-snug group-hover:text-accent">{project.title}</h3>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mist">
          {project.blocks.length} blocks · {formatDate(project.updatedAt)}
          {project.exports.length > 0 && ` · ${project.exports.length} exports`}
        </p>
      </Link>

      <div className="mt-4 flex items-center gap-1.5 border-t border-ink/10 pt-3">
        <Link
          to={`/editor/${project.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink/6 bg-bg/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink transition-colors hover:text-accent"
        >
          <PencilLine size={12} aria-hidden /> Open editor
        </Link>
        <button
          onClick={() => onQuickExport(project)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mist transition-colors hover:text-ink"
        >
          <Download size={12} aria-hidden /> Export
        </button>
        <button
          onClick={() => onDelete(project)}
          aria-label={`Delete ${project.title}`}
          className="ml-auto cursor-pointer rounded-sm p-1.5 text-mist transition-colors hover:bg-red-700/10 hover:text-red-700"
        >
          <Trash2 size={13} aria-hidden />
        </button>
      </div>
    </motion.article>
  )
}
