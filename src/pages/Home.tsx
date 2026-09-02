import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Reveal from '@/components/Reveal'
import { useMagnetic } from '@/hooks/useMagnetic'

const Scene3D = lazy(() => import('@/components/Scene3D'))

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        {/* 3D Scene */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="w-full h-full" />}>
            <Scene3D variant="hero" />
          </Suspense>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              <span className="text-sm text-ink-300 font-400 tracking-wide">Premium Educational Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-7xl font-700 text-ink-50 leading-[1.05] tracking-tight text-balance"
            >
              Learn. <span className="gradient-text">Challenge.</span> Improve.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-lg md:text-xl text-ink-300 font-300 leading-relaxed max-w-xl"
            >
              An interactive quiz experience built with Python.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <MagneticLink to="/setup" strength={0.15} className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-400 to-accent-600 text-ink-950 font-500 text-base hover:shadow-[0_0_40px_rgba(44,196,245,0.3)] transition-all duration-300 hover:scale-[1.02]">
                Start Quiz
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticLink>

              <MagneticLink to="/history" strength={0.1} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass text-ink-100 font-500 text-base hover:border-accent-400/30 hover:bg-ink-800/40 transition-all duration-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 7v5l4 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Explore Progress
              </MagneticLink>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-ink-500/40 flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-ink-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-600 text-ink-100 text-center mb-4">
              A quiz experience built for <span className="gradient-text-cool">depth</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-ink-400 text-center max-w-2xl mx-auto mb-16">
              Every element is designed to keep you focused on what matters — the questions, the answers, and your growth.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <div className="glass rounded-2xl p-8 card-hover h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ink-800 to-ink-900 flex items-center justify-center mb-6 border border-ink-700/30">
                    {f.icon}
                  </div>
                  <h3 className="font-display text-xl font-600 text-ink-100 mb-3">{f.title}</h3>
                  <p className="text-ink-400 font-300 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="relative py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-600 text-ink-100 text-center mb-16">
              The journey, step by step
            </h2>
          </Reveal>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-400/0 via-accent-400/30 to-accent-400/0" />

            {journey.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className={`relative flex items-center gap-8 mb-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="flex-1" />
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent-400 border-4 border-ink-950 z-10" />
                  <div className="flex-1 glass rounded-2xl p-6 card-hover">
                    <span className="text-xs font-500 text-accent-400 tracking-widest uppercase">Step {i + 1}</span>
                    <h3 className="font-display text-xl font-600 text-ink-100 mt-2 mb-2">{step.title}</h3>
                    <p className="text-ink-400 font-300 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 lg:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center glass-strong rounded-3xl p-12 md:p-16 glow-accent">
            <h2 className="font-display text-3xl md:text-5xl font-700 text-ink-50 mb-4 text-balance">
              Ready to test your knowledge?
            </h2>
            <p className="text-ink-300 font-300 text-lg mb-8 max-w-xl mx-auto">
              Pick a category, choose your difficulty, and begin your quiz journey.
            </p>
            <MagneticLink to="/setup" strength={0.15} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-400 to-accent-600 text-ink-950 font-500 text-base hover:shadow-[0_0_40px_rgba(44,196,245,0.3)] transition-all duration-300 hover:scale-[1.02]">
              Begin Your Journey
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </MagneticLink>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

function MagneticLink({
  to,
  children,
  className,
  strength = 0.15,
}: {
  to: string
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const magnetic = useMagnetic<HTMLDivElement>({ strength })
  return (
    <motion.div
      ref={magnetic.ref}
      style={magnetic.style}
      onMouseMove={magnetic.onMouseMove}
      onMouseEnter={magnetic.onMouseEnter}
      onMouseLeave={magnetic.onMouseLeave}
      className="inline-block"
    >
      <Link to={to} className={className}>
        {children}
      </Link>
    </motion.div>
  )
}

const features = [
  {
    title: 'Adaptive Difficulty',
    desc: 'Three tiers — easy, medium, hard — each with carefully crafted questions that scale with your confidence.',
    icon: (
      <svg className="w-6 h-6 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 7h4v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Multiple Categories',
    desc: 'From mathematics to Python programming — diverse subjects with MCQ and open-ended question formats.',
    icon: (
      <svg className="w-6 h-6 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Track Progress',
    desc: 'Every quiz attempt is recorded. Review your history, spot patterns, and measure your improvement over time.',
    icon: (
      <svg className="w-6 h-6 text-success-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18M7 12l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const journey = [
  { title: 'Discover', desc: 'Explore the platform and understand the journey ahead — a structured path from curiosity to mastery.' },
  { title: 'Choose a Subject', desc: 'Select a category that matches your interest — from mathematics to Python programming.' },
  { title: 'Choose Difficulty', desc: 'Pick easy, medium, or hard. Each tier scales with your confidence and challenges you appropriately.' },
  { title: 'Take the Challenge', desc: 'Answer focused questions with clean MCQ cards or text inputs. Stay in the zone with minimal distractions.' },
  { title: 'See Your Performance', desc: 'View your score, percentage, and detailed breakdown. Celebrate correct answers and learn from mistakes.' },
  { title: 'Track Improvement', desc: 'Review your quiz history over time. Every attempt is saved so you can watch your knowledge expand.' },
]
