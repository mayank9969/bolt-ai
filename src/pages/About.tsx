import { Link } from 'react-router-dom'
import Reveal from '@/components/Reveal'

export default function About() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        <Reveal>
          <span className="text-sm font-500 text-accent-400 tracking-widest uppercase">About</span>
          <h1 className="font-display text-4xl md:text-5xl font-700 text-ink-50 mt-3 mb-8">
            About NEXUS Quiz
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-6 text-ink-300 font-300 text-lg leading-relaxed">
            <p>
              NEXUS Quiz is a premium educational quiz platform designed to make learning
              feel immersive and intentional. It combines a focused quiz experience with
              sophisticated visual design to create a space where knowledge is tested, tracked,
              and celebrated.
            </p>
            <p>
              The platform supports multiple categories — from mathematics to Python
              programming — across three difficulty tiers. Each quiz can include multiple-choice
              and open-ended questions, with scoring that adapts to both format and difficulty.
            </p>
            <p>
              Every attempt is recorded, allowing you to trace your progress over time and
              identify areas for growth. The experience is designed as a continuous journey:
              from selecting your topic, through focused answering, to a detailed result and
              lasting history.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="glass-strong rounded-3xl p-8 mt-12">
            <h2 className="font-display text-2xl font-600 text-ink-100 mb-6">Credits</h2>
            <div className="space-y-4">
              <CreditRow label="Design & Development" value="Mayank Sarwal" />
              <CreditRow label="Project Type" value="Personal Portfolio Project" />
              <CreditRow label="Frontend" value="React, Three.js, Framer Motion, Tailwind CSS" />
              <CreditRow label="Backend" value="Python (Flask integration planned)" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8">
            <Link
              to="/setup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-400 to-accent-600 text-ink-950 font-500 text-base hover:shadow-[0_0_40px_rgba(44,196,245,0.3)] transition-all duration-300 hover:scale-[1.01]"
            >
              Start a Quiz
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

function CreditRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-ink-800/40 last:border-0">
      <span className="text-sm text-ink-400 font-400 sm:w-48 shrink-0">{label}</span>
      <span className="text-ink-100 font-400">{value}</span>
    </div>
  )
}
