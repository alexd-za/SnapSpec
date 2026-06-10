import { motion } from 'framer-motion'
import type { TemplateMeta } from '../../lib/model/templates'
import { useMotionPref } from '../../lib/hooks/useMotionPref'

const TEMPLATE_ICONS: Record<string, string> = {
  'study-notes': '/generated/svg/07-study-template.svg',
  'poetry-analysis': '/generated/svg/08-poetry-template.svg',
  'maths-explainer': '/generated/svg/09-maths-template.svg',
  'product-brief': '/generated/svg/10-product-template.svg',
  'project-showcase': '/generated/svg/11-showcase-template.svg',
  'revision-cheat-sheet': '/generated/svg/12-cheatsheet-template.svg',
}

type TemplateCardProps = {
  template: TemplateMeta
  index?: number
  selected?: boolean
  suggested?: boolean
  onSelect?: () => void
}

/** A plate from the index: numbered specimen card with a hairline border. */
export function TemplateCard({
  template,
  index,
  selected,
  suggested,
  onSelect,
}: TemplateCardProps) {
  const animate = useMotionPref()
  const interactive = Boolean(onSelect)
  return (
    <motion.button
      role={interactive ? 'radio' : undefined}
      aria-checked={interactive ? selected : undefined}
      onClick={onSelect}
      disabled={!interactive}
      whileHover={animate && interactive ? { y: -3 } : undefined}
      whileTap={animate && interactive ? { scale: 0.99 } : undefined}
      className={`paper-grain relative rounded-md border p-5 text-left transition-colors disabled:cursor-default ${
        selected
          ? 'border-accent bg-accent/10 shadow-[3px_3px_0_0_var(--sn-accent)]'
          : 'border-ink/15 bg-surface hover:border-ink/40'
      } ${interactive ? 'cursor-pointer' : ''}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <img
          src={TEMPLATE_ICONS[template.id]}
          alt=""
          className="h-12 w-12 rounded-sm border border-ink/10"
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
          {suggested ? (
            <span className="specimen-label border-accent text-accent">suggested</span>
          ) : index !== undefined ? (
            `Plate ${String(index + 1).padStart(2, '0')}`
          ) : null}
        </span>
      </div>
      <h3 className="font-serif text-xl leading-snug">{template.name}</h3>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
        {template.tagline}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-ink/70">{template.description}</p>
    </motion.button>
  )
}
