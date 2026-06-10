import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LogoMark } from '../ui/LogoMark'
import { NatureBackground } from '../nature/NatureBackground'
import { IntroSequence } from '../motion/IntroSequence'
import { useMotionPref } from '../../lib/hooks/useMotionPref'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/new', label: 'New Snap' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/exports', label: 'Exports' },
  { to: '/settings', label: 'Settings' },
]

export function AppShell() {
  const location = useLocation()
  const animate = useMotionPref()

  return (
    <div className="min-h-dvh">
      <NatureBackground />
      <IntroSequence />

      {/* Masthead: journal-style rule with serif wordmark and mono nav */}
      <header className="sticky top-0 z-40 border-b border-ink/20 bg-bg/90 backdrop-blur-sm">
        <nav
          className="mx-auto flex max-w-6xl items-baseline gap-1 px-4 pb-2.5 pt-3"
          aria-label="Main navigation"
        >
          <NavLink
            to="/"
            className="group mr-auto flex items-center gap-2"
            aria-label="SpecSnap home"
          >
            <motion.span
              whileHover={animate ? { rotate: -10, scale: 1.1 } : undefined}
              transition={{ type: 'spring', stiffness: 300, damping: 12 }}
              className="inline-flex"
            >
              <LogoMark size={22} />
            </motion.span>
            <span className="font-serif text-lg font-semibold tracking-tight">SpecSnap</span>
            <span className="annotation mb-0.5 hidden self-end text-xs md:inline">
              a field guide for messy notes
            </span>
          </NavLink>
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors sm:px-2.5 ${
                  isActive ? 'squiggle-active text-accent' : 'text-mist hover:text-ink'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={animate ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={animate ? { opacity: 0, y: -6 } : undefined}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-ink/15 py-7 text-center">
        <LogoMark size={18} className="mx-auto mb-2 opacity-70" />
        <p className="annotation text-sm">local-first · your notes never leave this device</p>
        <p className="annotation mt-0.5 text-xs opacity-70">
          set in fraunces &amp; plex mono · pressed by hand, not by cloud
        </p>
      </footer>
    </div>
  )
}
