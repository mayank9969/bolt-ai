import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getHistory } from '@/api/quizApi'
import { useQuiz } from '@/context/QuizContext'
import type { HistoryEntry } from '@/types/quiz'
import Reveal from '@/components/Reveal'
import TrendChart from '@/components/TrendChart'
import { CategoryBreakdown, DifficultyBreakdown } from '@/components/Breakdowns'

export default function History() {
  const { history: sessionHistory } = useQuiz()
  const [mockHistory, setMockHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    getHistory().then(setMockHistory)
  }, [])

  const allHistory = [...sessionHistory, ...mockHistory]
  const reversed = [...allHistory].reverse()

  // Stats summary
  const totalQuizzes = allHistory.length
  const avgPercentage = totalQuizzes > 0
    ? allHistory.reduce((sum, h) => sum + h.percentage, 0) / totalQuizzes
    : 0
  const totalCorrect = allHistory.reduce((sum, h) => sum + h.correct_answers, 0)
  const totalQuestions = allHistory.reduce((sum, h) => sum + h.total_questions, 0)

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
        <Reveal>
          <div className="mb-12">
            <span className="text-sm font-500 text-accent-400 tracking-widest uppercase">Your Journey</span>
            <h1 className="font-display text-4xl md:text-5xl font-700 text-ink-50 mt-3 mb-4">
              Quiz History
            </h1>
            <p className="text-ink-400 font-300 text-lg">
              Every quiz you've taken, recorded for reflection and growth.
            </p>
          </div>
        </Reveal>

        {/* Summary stats */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-3 gap-4 mb-12">
            <SummaryCard label="Total Quizzes" value={totalQuizzes} />
            <SummaryCard label="Avg. Score" value={`${Math.round(avgPercentage * 100) / 100}%`} />
            <SummaryCard label="Accuracy" value={totalQuestions > 0 ? `${Math.round((totalCorrect / totalQuestions) * 100)}%` : '—'} />
          </div>
        </Reveal>

        {/* Analytics visualizations */}
        {allHistory.length > 0 && (
          <Reveal delay={0.15}>
            <div className="mb-12 space-y-4">
              <TrendChart history={allHistory} />
              <div className="grid md:grid-cols-2 gap-4">
                <CategoryBreakdown history={allHistory} />
                <DifficultyBreakdown history={allHistory} />
              </div>
            </div>
          </Reveal>
        )}

        {/* History entries */}
        {reversed.length === 0 ? (
          <Reveal delay={0.15}>
            <div className="glass-strong rounded-3xl p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-ink-800/50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 7v5l4 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-600 text-ink-100 mb-2">No quizzes yet</h3>
              <p className="text-ink-400 font-300 mb-6">Take your first quiz to start building your history.</p>
              <Link
                to="/setup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-400 to-accent-600 text-ink-950 font-500 text-sm hover:shadow-[0_0_30px_rgba(44,196,245,0.25)] transition-all"
              >
                Start a Quiz
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-4">
            {reversed.map((entry, i) => (
              <motion.div
                key={`${entry.category}-${entry.difficulty}-${i}-${entry.percentage}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  {/* Left: category + difficulty */}
                  <div className="flex items-center gap-3 md:w-56 shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ink-800 to-ink-900 flex items-center justify-center border border-ink-700/30">
                      <span className="font-display text-lg font-700 text-accent-400 uppercase">
                        {entry.category.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-500 text-ink-100 capitalize">{entry.category}</p>
                      <p className={`text-xs font-500 capitalize ${
                        entry.difficulty === 'easy' ? 'text-success-400' :
                        entry.difficulty === 'medium' ? 'text-gold-400' : 'text-error-400'
                      }`}>
                        {entry.difficulty}
                      </p>
                    </div>
                  </div>

                  {/* Middle: stats */}
                  <div className="flex-1 flex flex-wrap gap-6">
                    <HistoryStat label="Questions" value={entry.total_questions} />
                    <HistoryStat label="Correct" value={entry.correct_answers} color="text-success-400" />
                    <HistoryStat label="Wrong" value={entry.wrong_answers} color="text-error-400" />
                    <HistoryStat label="Score" value={`${entry.score}/${entry.total_marks}`} />
                  </div>

                  {/* Right: percentage */}
                  <div className="md:w-32 shrink-0 flex md:flex-col items-center md:items-end gap-2">
                    <div className={`text-3xl font-display font-700 ${
                      entry.percentage >= 80 ? 'text-success-400' :
                      entry.percentage >= 50 ? 'text-gold-400' : 'text-error-400'
                    }`}>
                      {Math.round(entry.percentage * 100) / 100}%
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-ink-800/50 overflow-hidden md:block hidden">
                      <div
                        className={`h-full rounded-full ${
                          entry.percentage >= 80 ? 'bg-success-500' :
                          entry.percentage >= 50 ? 'bg-gold-500' : 'bg-error-500'
                        }`}
                        style={{ width: `${Math.min(entry.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-2xl p-5 text-center">
      <p className="text-xs text-ink-400 font-400 tracking-wide uppercase mb-2">{label}</p>
      <p className="font-display text-2xl md:text-3xl font-700 text-ink-50">{value}</p>
    </div>
  )
}

function HistoryStat({ label, value, color = 'text-ink-100' }: { label: string; value: string | number; color?: string }) {
  return (
    <div>
      <p className="text-xs text-ink-400 font-400 tracking-wide uppercase mb-1">{label}</p>
      <p className={`font-500 ${color}`}>{value}</p>
    </div>
  )
}
