import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Credits from './Credits'
import CustomCursor from './CustomCursor'

interface LayoutProps {
  children: ReactNode
  showNav?: boolean
  showCredits?: boolean
}

export default function Layout({ children, showNav = true, showCredits = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <CustomCursor />
      {/* Background layers */}
      <div className="fixed inset-0 -z-10 grid-bg radial-fade" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-ink-950 via-ink-950 to-ink-900" />
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #2cc4f5 0%, transparent 70%)' }}
      />

      {showNav && (
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="sticky top-0 z-50 glass-strong"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-ink-950" fill="currentColor">
                  <path d="M5 6h14v2H5zm0 5h10v2H5zm0 5h14v2H5z" />
                  <circle cx="19" cy="4" r="2" />
                </svg>
              </div>
              <span className="font-display text-lg font-600 tracking-tight text-ink-100">
                NEXUS<span className="text-accent-400">.</span>Quiz
              </span>
            </Link>

            <div className="flex items-center gap-1 md:gap-2">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/setup">Start Quiz</NavLink>
              <NavLink to="/history">History</NavLink>
              <NavLink to="/about">About</NavLink>
            </div>
          </div>
        </motion.nav>
      )}

      <main className="flex-1 relative z-10">{children}</main>

      {showCredits && (
        <footer className="relative z-10 mt-auto">
          <Credits />
        </footer>
      )}
    </div>
  )
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="px-3 md:px-4 py-2 text-sm font-400 text-ink-300 hover:text-ink-100 hover:bg-ink-800/40 rounded-lg transition-colors"
    >
      {children}
    </Link>
  )
}
