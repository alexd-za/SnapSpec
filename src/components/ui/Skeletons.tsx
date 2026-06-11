/** Nature-styled skeleton loaders: moss panels with flowing shimmer. */

export function SkeletonBlock({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div
      className={`float-panel rounded-xl p-5 ${className}`}
      role="status"
      aria-label="Loading content"
    >
      <div className="skeleton mb-4 h-4 w-1/3" />
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="skeleton mb-2.5 h-3"
          style={{ width: `${92 - i * 14}%` }}
        />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`float-panel rounded-xl p-5 ${className}`}
      role="status"
      aria-label="Loading card"
    >
      <div className="skeleton mb-4 h-24 rounded-sm" />
      <div className="skeleton mb-2 h-4 w-2/3" />
      <div className="skeleton h-3 w-1/2" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export function SkeletonEditor() {
  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr_260px]" role="status" aria-label="Loading editor">
      <div className="hidden space-y-2 lg:block">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton h-10" />
        ))}
      </div>
      <div className="space-y-4">
        <div className="skeleton h-28 rounded-2xl" />
        <SkeletonBlock lines={4} />
        <SkeletonBlock lines={3} />
      </div>
      <div className="hidden space-y-3 lg:block">
        <div className="skeleton h-8" />
        <div className="skeleton h-24" />
        <div className="skeleton h-16" />
      </div>
      <span className="sr-only">Loading editor…</span>
    </div>
  )
}
