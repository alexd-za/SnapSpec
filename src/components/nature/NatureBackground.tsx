import { TopographicGrid } from './TopographicGrid'

/** Fixed ambient backdrop: soft light gradient + contour lines. */
export function NatureBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 600px at 70% -10%, color-mix(in srgb, var(--sn-accent) 8%, transparent), transparent 70%), radial-gradient(900px 500px at 10% 110%, color-mix(in srgb, var(--sn-accent) 5%, transparent), transparent 70%)',
        }}
      />
      <TopographicGrid />
    </div>
  )
}
