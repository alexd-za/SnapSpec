import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LogoMark } from '../ui/LogoMark'
import { NatureBackground } from '../nature/NatureBackground'
import { IntroSequence } from '../motion/IntroSequence'
import { useMotionPref } from '../../lib/hooks/useMotionPref'
import { GrowingVine } from '../nature/GrowingVine'

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
      <GrowingVine />
      <IntroSequence />

      {/* Nav melts into the canvas: a blur veil that fades out, no border line */}
      <header className="sticky top-0 z-40">
        <div
          className="absolute inset-x-0 -bottom-6 top-0 backdrop-blur-md"
          style={{
            background:
              'linear-gradient(to bottom, color-mix(in srgb, var(--sn-bg) 88%, transparent), color-mix(in srgb, var(--sn-bg) 55%, transparent) 70%, transparent)',
            maskImage: 'linear-gradient(to bottom, #000 65%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, #000 65%, transparent)',
          }}
          aria-hidden
        />
        <nav
          className="relative mx-auto flex max-w-6xl items-center gap-0.5 px-3 py-3.5 sm:gap-1 sm:px-5"
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
            <span className="hidden font-serif text-lg font-semibold tracking-tight min-[440px]:inline">
              SpecSnap
            </span>
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
                `whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12.5px] transition-colors sm:px-3.5 ${
                  isActive ? 'nav-dot text-accent' : 'text-mist hover:bg-ink/8 hover:text-ink'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={animate ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={animate ? { opacity: 0, y: -6 } : undefined}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer dissolves into the canvas — no rule above it */}
      <footer className="pb-10 pt-4 text-center">
        <LogoMark size={18} className="mx-auto mb-2 opacity-60" />
        <p className="annotation text-sm">local-first · your notes never leave this device</p>
        <p className="annotation mt-0.5 text-xs opacity-60">
          set in fraunces &amp; plex mono · grown, not assembled
        </p>
      </footer>
    </div>
  )
}
