import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuiz } from '@/context/QuizContext'
import { scoreQuiz } from '@/lib/mockScoring'
import type { QuizQuestion } from '@/types/quiz'

export default function Quiz() {
  const navigate = useNavigate()
  const { selectedQuestions, setUserAnswers, setQuizResult, addToHistory } = useQuiz()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [direction, setDirection] = useState(1)

  const currentQuestion: QuizQuestion | undefined = selectedQuestions[currentIndex]

  useEffect(() => {
    if (selectedQuestions.length === 0) {
      navigate('/setup')
    }
  }, [selectedQuestions, navigate])

  const goToNext = useCallback(() => {
    if (currentIndex < selectedQuestions.length - 1) {
      setDirection(1)
      setCurrentIndex((prev) => prev + 1)
      setCurrentAnswer('')
      setSelectedOption(null)
    } else {
      // Quiz complete
      const allAnswers = [...answers]
      if (currentQuestion) {
        allAnswers[currentIndex] = currentQuestion.question_type === 'mcq' ? (selectedOption ?? '') : currentAnswer
      }

      const result = scoreQuiz(selectedQuestions, allAnswers)
      const totalMarks = selectedQuestions.reduce((sum, q) => {
        const marks: Record<string, number> = { easy: 2, medium: 4, hard: 6 }
        let m = marks[q.difficulty]
        if (q.question_type === 'mcq') m = m / 2
        return sum + m
      }, 0)

      setUserAnswers(allAnswers)
      setQuizResult({
        config: {
          category: selectedQuestions[0]?.category ?? '',
          difficulty: selectedQuestions[0]?.difficulty ?? 'easy',
          questionCount: selectedQuestions.length,
        },
        questions: selectedQuestions,
        userAnswers: allAnswers,
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.wrongAnswers,
        score: result.score,
        totalMarks,
        percentage: result.percentage,
      })

      addToHistory({
        category: selectedQuestions[0]?.category ?? '',
        difficulty: selectedQuestions[0]?.difficulty ?? 'easy',
        total_questions: selectedQuestions.length,
        correct_answers: result.correctAnswers,
        wrong_answers: result.wrongAnswers,
        score: result.score,
        total_marks: totalMarks,
        percentage: result.percentage,
      })

      navigate('/result')
    }
  }, [currentIndex, selectedQuestions, answers, currentAnswer, selectedOption, currentQuestion, navigate, setUserAnswers, setQuizResult, addToHistory])

  const handleSubmit = () => {
    if (!currentQuestion) return

    const answer = currentQuestion.question_type === 'mcq' ? (selectedOption ?? '') : currentAnswer
    if (!answer.trim()) return

    const newAnswers = [...answers]
    newAnswers[currentIndex] = answer
    setAnswers(newAnswers)

    goToNext()
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex((prev) => prev - 1)
      const prevAnswer = answers[currentIndex - 1] ?? ''
      if (selectedQuestions[currentIndex - 1]?.question_type === 'mcq') {
        setSelectedOption(prevAnswer)
        setCurrentAnswer('')
      } else {
        setCurrentAnswer(prevAnswer)
        setSelectedOption(null)
      }
    }
  }

  if (!currentQuestion) return null

  const progress = ((currentIndex + 1) / selectedQuestions.length) * 100
  const isMCQ = currentQuestion.question_type === 'mcq'
  const optionKeys = isMCQ && currentQuestion.options ? Object.keys(currentQuestion.options) : []

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
    }),
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-16 z-20 glass-strong">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-500 text-ink-300">
              Question <span className="text-accent-400 font-600">{currentIndex + 1}</span> of {selectedQuestions.length}
            </span>
            <span className="text-sm font-400 text-ink-400">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-ink-800/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Category & difficulty badge */}
              <div className="flex items-center gap-3 mb-8">
                <span className="px-3 py-1.5 rounded-lg glass text-xs font-500 text-ink-300 capitalize tracking-wide">
                  {currentQuestion.category}
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-500 capitalize tracking-wide ${
                  currentQuestion.difficulty === 'easy' ? 'bg-success-500/10 text-success-400' :
                  currentQuestion.difficulty === 'medium' ? 'bg-gold-500/10 text-gold-400' :
                  'bg-error-500/10 text-error-400'
                }`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="px-3 py-1.5 rounded-lg glass text-xs font-500 text-ink-400 tracking-wide uppercase">
                  {isMCQ ? 'Multiple Choice' : 'Text Answer'}
                </span>
              </div>

              {/* Question */}
              <h2 className="font-display text-2xl md:text-4xl font-600 text-ink-50 leading-tight mb-10 text-balance">
                {currentQuestion.question}
              </h2>

              {/* Answer area */}
              {isMCQ ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {optionKeys.map((key, idx) => (
                    <motion.button
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.08, duration: 0.4 }}
                      onClick={() => setSelectedOption(key)}
                      className={`relative text-left p-6 rounded-2xl transition-all duration-300 ${
                        selectedOption === key
                          ? 'bg-accent-400/10 border-2 border-accent-400/50 text-ink-50 glow-accent'
                          : 'glass border-2 border-transparent text-ink-200 hover:border-ink-600/30 hover:bg-ink-800/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-600 text-lg shrink-0 transition-colors ${
                          selectedOption === key
                            ? 'bg-accent-400 text-ink-950'
                            : 'bg-ink-800/50 text-ink-400'
                        }`}>
                          {key}
                        </div>
                        <span className="text-base font-400 leading-relaxed pt-1.5">
                          {currentQuestion.options![key]}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  <input
                    type="text"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && currentAnswer.trim()) handleSubmit()
                    }}
                    placeholder="Type your answer here..."
                    autoFocus
                    className="w-full px-6 py-5 rounded-2xl glass-strong text-ink-50 text-lg font-400 outline-none border-2 border-transparent focus:border-accent-400/30 transition-colors placeholder:text-ink-500"
                  />
                  <p className="text-sm text-ink-500 mt-3 font-300">
                    Press Enter or click Submit to continue
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass text-ink-300 font-400 text-sm hover:text-ink-100 hover:bg-ink-800/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Previous
            </button>

            <button
              onClick={handleSubmit}
              disabled={isMCQ ? !selectedOption : !currentAnswer.trim()}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-accent-400 to-accent-600 text-ink-950 font-500 text-sm hover:shadow-[0_0_30px_rgba(44,196,245,0.25)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {currentIndex === selectedQuestions.length - 1 ? 'Finish Quiz' : 'Submit'}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
