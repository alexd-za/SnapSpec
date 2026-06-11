/**
 * Fixed paper backdrop: notebook rules, a margin line, and desk-lamp light
 * falling from the top corner with a soft vignette — the page sits on a desk.
 */
export function NatureBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div className="ruled-paper absolute inset-0 opacity-60" />
      {/* desk-lamp warmth + edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1100px 700px at 18% -8%, color-mix(in srgb, var(--sn-surface) 55%, transparent), transparent 65%), radial-gradient(140% 120% at 50% 50%, transparent 64%, color-mix(in srgb, var(--sn-text) 7%, transparent) 100%)',
        }}
      />
      {/* the journal's margin line, inked in the accent colour */}
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
