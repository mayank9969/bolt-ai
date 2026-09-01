import { useState, useEffect, Suspense, lazy } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getCategories, getQuestions } from '@/api/quizApi'
import { useQuiz } from '@/context/QuizContext'
import type { Difficulty } from '@/types/quiz'
import Reveal from '@/components/Reveal'

const Scene3D = lazy(() => import('@/components/Scene3D'))

const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

export default function Setup() {
  const navigate = useNavigate()
  const { setSelectedQuestions } = useQuiz()

  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [availableCount, setAvailableCount] = useState<number>(0)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats)
      if (cats.length > 0) setSelectedCategory(cats[0])
    })
  }, [])

  useEffect(() => {
    if (selectedCategory && selectedDifficulty) {
      getQuestions(selectedCategory, selectedDifficulty).then((qs) => {
        setAvailableCount(qs.length)
        if (questionCount > qs.length) setQuestionCount(qs.length)
      })
    } else {
      setAvailableCount(0)
    }
  }, [selectedCategory, selectedDifficulty])

  const handleStart = async () => {
    setError('')

    if (!selectedCategory) {
      setError('Please select a category.')
      return
    }
    if (!selectedDifficulty) {
      setError('Please select a difficulty.')
      return
    }
    if (questionCount < 1) {
      setError('Please select at least 1 question.')
      return
    }

    setLoading(true)
    const questions = await getQuestions(selectedCategory, selectedDifficulty)

    if (questions.length === 0) {
      setError('No questions available for this selection.')
      setLoading(false)
      return
    }

    // Shuffle and take the requested count (mirrors Python's random.sample)
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(questionCount, questions.length))

    setSelectedQuestions(selected)
    setLoading(false)
    navigate('/quiz')
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Suspense fallback={<div />}>
          <Scene3D variant="compact" />
        </Suspense>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 lg:py-24">
        <Reveal>
          <div className="text-center mb-12">
            <span className="text-sm font-500 text-accent-400 tracking-widest uppercase">Step 01</span>
            <h1 className="font-display text-4xl md:text-5xl font-700 text-ink-50 mt-3 mb-4">
              Configure your quiz
            </h1>
            <p className="text-ink-400 font-300 text-lg">
              Choose your category, difficulty, and the number of questions to begin.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass-strong rounded-3xl p-8 md:p-10">
            {/* Category */}
            <div className="mb-8">
              <label className="block text-sm font-500 text-ink-300 mb-3 tracking-wide">
                Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative px-5 py-4 rounded-xl text-left transition-all duration-300 ${
                      selectedCategory === cat
                        ? 'bg-accent-400/10 border-2 border-accent-400/40 text-ink-50'
                        : 'glass border-2 border-transparent text-ink-300 hover:border-ink-600/30 hover:text-ink-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedCategory === cat ? 'bg-accent-400/20' : 'bg-ink-800/50'
                      }`}>
                        {cat === 'maths' ? (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 5h16M4 12h16M4 19h16" strokeLinecap="round" />
                            <circle cx="8" cy="5" r="1.5" fill="currentColor" />
                            <circle cx="16" cy="12" r="1.5" fill="currentColor" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M8 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="font-500 capitalize">{cat}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-8">
              <label className="block text-sm font-500 text-ink-300 mb-3 tracking-wide">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {difficulties.map((diff) => {
                  const colors = {
                    easy: { active: 'border-success-500/40 bg-success-500/10 text-success-400', dot: 'bg-success-500' },
                    medium: { active: 'border-gold-500/40 bg-gold-500/10 text-gold-400', dot: 'bg-gold-500' },
                    hard: { active: 'border-error-500/40 bg-error-500/10 text-error-400', dot: 'bg-error-500' },
                  }
                  const isActive = selectedDifficulty === diff
                  const c = colors[diff]

                  return (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`relative px-4 py-4 rounded-xl text-center transition-all duration-300 capitalize font-500 ${
                        isActive
                          ? c.active + ' border-2'
                          : 'glass border-2 border-transparent text-ink-400 hover:border-ink-600/30 hover:text-ink-200'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${isActive ? c.dot : 'bg-ink-600'}`} />
                      {diff}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Question Count */}
            <div className="mb-8">
              <label className="block text-sm font-500 text-ink-300 mb-3 tracking-wide">
                Number of questions
                {availableCount > 0 && (
                  <span className="text-ink-500 font-400 ml-2">({availableCount} available)</span>
                )}
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1 glass rounded-xl p-4 flex items-center gap-4">
                  <button
                    onClick={() => setQuestionCount(Math.max(1, questionCount - 1))}
                    className="w-10 h-10 rounded-lg bg-ink-800/50 flex items-center justify-center text-ink-200 hover:bg-ink-700/50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" strokeLinecap="round" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    value={questionCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1
                      setQuestionCount(Math.max(1, Math.min(val, availableCount || 99)))
                    }}
                    className="flex-1 bg-transparent text-center text-2xl font-display font-600 text-ink-50 outline-none w-full"
                    min={1}
                    max={availableCount || 99}
                  />
                  <button
                    onClick={() => setQuestionCount(Math.min(questionCount + 1, availableCount || 99))}
                    className="w-10 h-10 rounded-lg bg-ink-800/50 flex items-center justify-center text-ink-200 hover:bg-ink-700/50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quick presets */}
              {availableCount > 0 && (
                <div className="flex gap-2 mt-3">
                  {[5, 10, 15].filter((n) => n <= availableCount).map((n) => (
                    <button
                      key={n}
                      onClick={() => setQuestionCount(n)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-400 transition-colors ${
                        questionCount === n
                          ? 'bg-accent-400/20 text-accent-300'
                          : 'glass text-ink-400 hover:text-ink-200'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 px-4 py-3 rounded-xl bg-error-500/10 border border-error-500/20 text-error-400 text-sm font-400"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Start button */}
            <button
              onClick={handleStart}
              disabled={loading || !selectedCategory || !selectedDifficulty}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-400 to-accent-600 text-ink-950 font-500 text-base hover:shadow-[0_0_40px_rgba(44,196,245,0.3)] transition-all duration-300 hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-ink-950/30 border-t-ink-950 rounded-full"
                />
              ) : (
                <>
                  Start Quiz
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-ink-400 hover:text-ink-200 transition-colors">
              ← Back to home
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
