/** A torn paper edge: bridges a paper section into an ink plate. */
export function TornEdge({ flip = false, className = '' }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 22"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-4 w-full sm:h-5 ${flip ? 'rotate-180' : ''} ${className}`}
      style={{ color: 'var(--sn-bg)' }}
    >
      <path
        fill="currentColor"
        d="M0 0 L0 10 C 40 16, 80 6, 120 12 C 170 19, 210 5, 260 11 C 310 17, 350 7, 400 13 C 450 19, 490 4, 540 10 C 590 16, 630 8, 680 12 C 730 17, 770 5, 820 11 C 870 17, 910 7, 960 13 C 1010 18, 1050 5, 1100 10 C 1150 15, 1190 7, 1240 12 C 1290 17, 1330 6, 1380 11 C 1410 14, 1430 9, 1440 11 L1440 0 Z"
      />
    </svg>
  )
}
