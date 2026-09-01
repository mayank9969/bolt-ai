import { useEffect, Suspense, lazy } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuiz } from '@/context/QuizContext'
import { checkAnswer } from '@/lib/mockScoring'
import Reveal from '@/components/Reveal'

const Scene3D = lazy(() => import('@/components/Scene3D'))

export default function Result() {
  const navigate = useNavigate()
  const { quizResult } = useQuiz()

  useEffect(() => {
    if (!quizResult) navigate('/setup')
  }, [quizResult, navigate])

  if (!quizResult) return null

  const { config, questions, userAnswers, score, totalMarks, percentage, correctAnswers, wrongAnswers } = quizResult
  const roundedPct = Math.round(percentage * 100) / 100
  const isPass = percentage >= 50
  const isExcellent = percentage >= 80

  const circumference = 2 * Math.PI * 80
  const offset = circumference - (percentage / 100) * circumference

  const stats = [
    { label: 'Score', value: score, unit: 'pts', color: 'text-accent-400' },
    { label: 'Correct', value: correctAnswers, unit: '', color: 'text-success-400' },
    { label: 'Wrong', value: wrongAnswers, unit: '', color: 'text-error-400' },
    { label: 'Total Marks', value: totalMarks, unit: 'pts', color: 'text-ink-200' },
  ]

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Suspense fallback={<div />}>
          <Scene3D variant="compact" />
        </Suspense>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 lg:py-20">
        {/* Completion header */}
        <Reveal>
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
            >
              <span className={`w-2 h-2 rounded-full ${isExcellent ? 'bg-success-500' : isPass ? 'bg-gold-500' : 'bg-error-500'} animate-pulse`} />
              <span className="text-sm text-ink-300 font-400 tracking-wide">Quiz Complete</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-6xl font-700 text-ink-50 mb-4">
              {isExcellent ? 'Outstanding!' : isPass ? 'Well done!' : 'Keep practicing!'}
            </h1>
            <p className="text-ink-400 font-300 text-lg">
              You've completed the {config.category} quiz. Here are your results.
            </p>
          </div>
        </Reveal>

        {/* Progress ring + percentage */}
        <Reveal delay={0.15}>
          <div className="glass-strong rounded-3xl p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="relative w-48 h-48 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="rgba(125, 143, 189, 0.1)"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={isExcellent ? '#4ade80' : isPass ? '#f5d061' : '#f87171'}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="font-display text-5xl font-700 text-ink-50"
                >
                  {roundedPct}%
                </motion.span>
                <span className="text-sm text-ink-400 font-400 mt-1">Score</span>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                    className="glass rounded-2xl p-5"
                  >
                    <p className="text-xs text-ink-400 font-400 tracking-wide uppercase mb-2">{stat.label}</p>
                    <p className={`font-display text-3xl font-700 ${stat.color}`}>
                      {stat.value}<span className="text-sm font-400 text-ink-500 ml-1">{stat.unit}</span>
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Quiz meta */}
        <Reveal delay={0.25}>
          <div className="glass rounded-2xl p-6 mb-8 flex flex-wrap items-center gap-6">
            <MetaItem label="Category" value={config.category} />
            <Divider />
            <MetaItem label="Difficulty" value={config.difficulty} />
            <Divider />
            <MetaItem label="Questions" value={String(config.questionCount)} />
          </div>
        </Reveal>

        {/* Answer review */}
        <Reveal delay={0.3}>
          <h2 className="font-display text-2xl font-600 text-ink-100 mb-6">Answer Review</h2>
          <div className="space-y-4 mb-10">
            {questions.map((q, i) => {
              const userAns = userAnswers[i] ?? ''
              const isCorrect = checkAnswer(q, userAns)
              const correctDisplay = q.question_type === 'mcq' && q.options
                ? q.options[q.answer] ?? q.answer
                : q.answer

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className={`glass rounded-2xl p-5 border-l-4 ${
                    isCorrect ? 'border-l-success-500' : 'border-l-error-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isCorrect ? 'bg-success-500/15 text-success-400' : 'bg-error-500/15 text-error-400'
                    }`}>
                      {isCorrect ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-ink-100 font-400 mb-2">{q.question}</p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                        <p className={isCorrect ? 'text-success-400' : 'text-error-400'}>
                          <span className="text-ink-500">Your answer: </span>
                          {q.question_type === 'mcq' && q.options ? (q.options[userAns] ?? (userAns || '—')) : (userAns || '—')}
                        </p>
                        {!isCorrect && (
                          <p className="text-success-400">
                            <span className="text-ink-500">Correct: </span>
                            {correctDisplay}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Reveal>

        {/* Actions */}
        <Reveal delay={0.35}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/setup"
              className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-400 to-accent-600 text-ink-950 font-500 text-base hover:shadow-[0_0_40px_rgba(44,196,245,0.3)] transition-all duration-300 hover:scale-[1.01]"
            >
              Start Another Quiz
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              to="/history"
              className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass text-ink-100 font-500 text-base hover:border-accent-400/30 hover:bg-ink-800/30 transition-all duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 7v5l4 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              View History
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-400 font-400 tracking-wide uppercase mb-1">{label}</p>
      <p className="text-lg font-500 text-ink-100 capitalize">{value}</p>
    </div>
  )
}

function Divider() {
  return <div className="w-px h-10 bg-ink-700/30" />
}
