import { PALETTES, ACCENT_THEMES } from '../../lib/model/palettes'
import type { AccentTheme } from '../../lib/model/types'

type AccentSwitcherProps = {
  value: AccentTheme
  onChange: (accent: AccentTheme) => void
  compact?: boolean
}

/** Palette picker: five nature swatches. */
export function AccentSwitcher({ value, onChange, compact = false }: AccentSwitcherProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Accent palette"
      className={`flex items-center ${compact ? 'gap-1.5' : 'gap-2'}`}
    >
      {ACCENT_THEMES.map((theme) => {
        const p = PALETTES[theme]
        const selected = theme === value
        return (
          <button
            key={theme}
            role="radio"
            aria-checked={selected}
            aria-label={`${p.name} palette`}
            title={`${p.name} — ${p.description}`}
            onClick={() => onChange(theme)}
            className={`cursor-pointer rounded-full transition-transform hover:scale-110 ${
              selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : ''
            }`}
            style={{ width: compact ? 20 : 26, height: compact ? 20 : 26 }}
          >
            <span
              className="block h-full w-full rounded-full border border-black/20"
              style={{ background: `linear-gradient(135deg, ${p.bg} 50%, ${p.accent} 50%)` }}
            />
          </button>
        )
      })}
    </div>
  )
}
