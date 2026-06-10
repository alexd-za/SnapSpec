import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Images, Plus, Settings, FileOutput, Home } from 'lucide-react'
import { LogoMark } from '../ui/LogoMark'
import { NatureBackground } from '../nature/NatureBackground'
import { IntroSequence } from '../motion/IntroSequence'
import { useMotionPref } from '../../lib/hooks/useMotionPref'

const NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/new', label: 'New Snap', icon: Plus },
  { to: '/gallery', label: 'Gallery', icon: Images },
  { to: '/exports', label: 'Exports', icon: FileOutput },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppShell() {
  const location = useLocation()
  const animate = useMotionPref()

  return (
    <div className="min-h-dvh">
      <NatureBackground />
      <IntroSequence />

      <header className="sticky top-0 z-40 border-b border-mist/15 bg-bg/80 backdrop-blur-md">
        <nav
          className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-3"
          aria-label="Main navigation"
        >
          <NavLink to="/" className="mr-4 flex items-center gap-2.5" aria-label="SpecSnap home">
            <LogoMark size={26} />
            <span className="font-serif text-lg font-semibold tracking-tight">SpecSnap</span>
          </NavLink>
          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors sm:px-3 ${
                    isActive ? 'bg-accent/15 text-accent' : 'text-mist hover:bg-mist/10 hover:text-ink'
                  }`
                }
              >
                <Icon size={16} aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sr-only sm:hidden">{label}</span>
              </NavLink>
            ))}
          </div>
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

      <footer className="border-t border-mist/10 py-6 text-center text-xs text-mist">
        SpecSnap · local-first · your notes never leave this device
      </footer>
    </div>
  )
}
