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

/** Gallery entry: a Snap rendered as a small field-guide card. */
export function GalleryCard({ project, index, onQuickExport, onDelete }: GalleryCardProps) {
  const animate = useMotionPref()
  const palette = PALETTES[project.accent]
  return (
    <motion.article
      initial={animate ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.5) }}
      whileHover={animate ? { y: -4 } : undefined}
      className="paper-grain flex flex-col rounded-2xl border border-mist/20 bg-surface p-5 transition-colors hover:border-accent/40"
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className="inline-block h-4 w-4 rounded-full border border-black/20"
          style={{ background: `linear-gradient(135deg, ${palette.bg} 50%, ${palette.accent} 50%)` }}
          title={`${palette.name} palette`}
          aria-label={`${palette.name} palette`}
          role="img"
        />
        <span className="rounded-full border border-mist/25 px-2.5 py-0.5 text-[11px] text-mist">
          {templateMeta(project.template).name}
        </span>
      </div>

      <Link to={`/editor/${project.id}`} className="group flex-1">
        <h3 className="font-serif text-lg leading-snug group-hover:text-accent">{project.title}</h3>
        <p className="mt-1.5 text-xs text-mist">
          {project.blocks.length} blocks · {formatDate(project.updatedAt)}
          {project.exports.length > 0 && ` · ${project.exports.length} exports`}
        </p>
      </Link>

      <div className="mt-4 flex items-center gap-1.5 border-t border-mist/15 pt-3">
        <Link
          to={`/editor/${project.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent/15 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/25"
        >
          <PencilLine size={13} aria-hidden /> Open editor
        </Link>
        <button
          onClick={() => onQuickExport(project)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-mist transition-colors hover:bg-mist/10 hover:text-ink"
        >
          <Download size={13} aria-hidden /> Quick export
        </button>
        <button
          onClick={() => onDelete(project)}
          aria-label={`Delete ${project.title}`}
          className="ml-auto cursor-pointer rounded-lg p-1.5 text-mist transition-colors hover:bg-red-400/15 hover:text-red-400"
        >
          <Trash2 size={13} aria-hidden />
        </button>
      </div>
    </motion.article>
  )
}
