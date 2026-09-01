import { createContext, useContext, useState, type ReactNode } from 'react'
import type { QuizQuestion, QuizResult, HistoryEntry } from '@/types/quiz'

interface QuizContextValue {
  selectedQuestions: QuizQuestion[]
  setSelectedQuestions: (q: QuizQuestion[]) => void
  userAnswers: string[]
  setUserAnswers: (a: string[]) => void
  quizResult: QuizResult | null
  setQuizResult: (r: QuizResult | null) => void
  history: HistoryEntry[]
  addToHistory: (entry: HistoryEntry) => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [selectedQuestions, setSelectedQuestions] = useState<QuizQuestion[]>([])
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  const addToHistory = (entry: HistoryEntry) => {
    setHistory((prev) => [...prev, entry])
  }

  return (
    <QuizContext.Provider
      value={{
        selectedQuestions,
        setSelectedQuestions,
        userAnswers,
        setUserAnswers,
        quizResult,
        setQuizResult,
        history,
        addToHistory,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider')
  return ctx
}
