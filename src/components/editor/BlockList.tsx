import { ArrowDown, ArrowUp, Copy, Trash2 } from 'lucide-react'
import type { SnapBlock } from '../../lib/model/types'

const BLOCK_LABELS: Record<SnapBlock['type'], string> = {
  heading: 'Heading',
  summary: 'Summary',
  'key-points': 'Key points',
  definitions: 'Definitions',
  formulas: 'Formulas',
  quotes: 'Quotes',
  comparison: 'Comparison',
  timeline: 'Timeline',
  diagram: 'Diagram',
  flashcards: 'Flashcards',
  quiz: 'Quiz',
  'essay-outline': 'Essay outline',
  callout: 'Callout',
  'export-card': 'Export card',
}

export function blockLabel(block: SnapBlock): string {
  return block.title ?? BLOCK_LABELS[block.type]
}

type BlockListProps = {
  blocks: SnapBlock[]
  selectedId: string | null
  onSelect: (id: string) => void
  onMove: (id: string, direction: -1 | 1) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

/** Editor left sidebar: ordered block list with reorder / duplicate / delete. */
export function BlockList({
  blocks,
  selectedId,
  onSelect,
  onMove,
  onDuplicate,
  onDelete,
}: BlockListProps) {
  return (
    <nav aria-label="Blocks">
      <ul className="space-y-1.5">
        {blocks.map((block, i) => {
          const selected = block.id === selectedId
          return (
            <li
              key={block.id}
              className={`group rounded-sm border transition-colors ${
                selected
                  ? 'border-accent bg-accent/10'
                  : 'border-ink/15 bg-surface hover:border-ink/35'
              }`}
            >
              <button
                onClick={() => onSelect(block.id)}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left"
                aria-current={selected ? 'true' : undefined}
              >
                <span className="font-mono text-[10px] text-mist">{i + 1}</span>
                <span className="truncate text-xs font-medium">{blockLabel(block)}</span>
              </button>
              <div
                className={`flex items-center gap-0.5 px-2 pb-1.5 ${
                  selected ? '' : 'opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100'
                }`}
              >
                <IconBtn label={`Move ${blockLabel(block)} up`} disabled={i === 0} onClick={() => onMove(block.id, -1)}>
                  <ArrowUp size={12} aria-hidden />
                </IconBtn>
                <IconBtn
                  label={`Move ${blockLabel(block)} down`}
                  disabled={i === blocks.length - 1}
                  onClick={() => onMove(block.id, 1)}
                >
                  <ArrowDown size={12} aria-hidden />
                </IconBtn>
                <IconBtn label={`Duplicate ${blockLabel(block)}`} onClick={() => onDuplicate(block.id)}>
                  <Copy size={12} aria-hidden />
                </IconBtn>
                <IconBtn label={`Delete ${blockLabel(block)}`} onClick={() => onDelete(block.id)} danger>
                  <Trash2 size={12} aria-hidden />
                </IconBtn>
              </div>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`cursor-pointer rounded-md p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
        danger ? 'text-mist hover:bg-red-400/15 hover:text-red-400' : 'text-mist hover:bg-mist/15 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
