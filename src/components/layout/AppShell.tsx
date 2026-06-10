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

      {/* Masthead: journal-style double rule with mono nav */}
      <header className="sticky top-0 z-40 border-b border-ink/20 bg-bg/90 backdrop-blur-sm">
        <nav
          className="mx-auto flex max-w-6xl items-baseline gap-1 px-4 pb-2.5 pt-3"
          aria-label="Main navigation"
        >
          <NavLink to="/" className="mr-auto flex items-center gap-2" aria-label="SpecSnap home">
            <LogoMark size={22} />
            <span className="font-serif text-lg font-semibold tracking-tight">SpecSnap</span>
            <span className="mb-0.5 hidden self-end font-mono text-[9px] uppercase tracking-[0.2em] text-mist md:inline">
              field guide for messy notes
            </span>
          </NavLink>
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors sm:px-2.5 ${
                  isActive
                    ? 'text-accent underline decoration-2 underline-offset-[6px]'
                    : 'text-mist hover:text-ink'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="h-px bg-ink/10" />
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

      <footer className="border-t border-ink/15 py-6 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
        SpecSnap · local-first · your notes never leave this device
      </footer>
    </div>
  )
}
