/**
 * Fixed paper backdrop: faint notebook rules and a left margin line —
 * a field journal page, not a glow gradient.
 */
export function NatureBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div className="ruled-paper absolute inset-0 opacity-60" />
      {/* the journal's red margin line, inked in the accent colour */}
      <div
        className="absolute bottom-0 top-0 hidden w-px lg:block"
        style={{
          left: 'max(1rem, calc(50% - 36rem))',
          background: 'color-mix(in srgb, var(--sn-accent) 35%, transparent)',
        }}
      />
    </div>
  )
}
