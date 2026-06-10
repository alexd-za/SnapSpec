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
  selected?: boolean
  suggested?: boolean
  onSelect?: () => void
}

/** Template picker card with a gentle hover tilt. */
export function TemplateCard({ template, selected, suggested, onSelect }: TemplateCardProps) {
  const animate = useMotionPref()
  return (
    <motion.button
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileHover={animate ? { rotateX: 3, rotateY: -3, y: -3 } : undefined}
      whileTap={animate ? { scale: 0.98 } : undefined}
      style={{ transformPerspective: 700 }}
      className={`paper-grain relative cursor-pointer rounded-2xl border p-4 text-left transition-colors ${
        selected
          ? 'border-accent/70 bg-accent/10'
          : 'border-mist/20 bg-surface hover:border-mist/40'
      }`}
    >
      {suggested && (
        <span className="absolute right-3 top-3 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-bg">
          suggested
        </span>
      )}
      <img src={TEMPLATE_ICONS[template.id]} alt="" className="mb-3 h-14 w-14 rounded-lg" />
      <h3 className="font-serif text-base font-semibold">{template.name}</h3>
      <p className="mt-0.5 text-xs text-accent">{template.tagline}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-mist">{template.description}</p>
    </motion.button>
  )
}
