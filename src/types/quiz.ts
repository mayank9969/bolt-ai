export type Difficulty = 'easy' | 'medium' | 'hard'

export type QuestionType = 'normal' | 'mcq'

export interface QuizQuestion {
  question: string
  answer: string
  category: string
  difficulty: Difficulty
  question_type: QuestionType
  options: Record<string, string> | null
}

export type QuestionBank = Record<string, Record<Difficulty, QuizQuestion[]>>

export interface HistoryEntry {
  category: string
  difficulty: string
  total_questions: number
  correct_answers: number
  wrong_answers: number
  score: number
  total_marks: number
  percentage: number
}

export interface QuizConfig {
  category: string
  difficulty: Difficulty
  questionCount: number
}

export interface QuizResult {
  config: QuizConfig
  questions: QuizQuestion[]
  userAnswers: string[]
  correctAnswers: number
  wrongAnswers: number
  score: number
  totalMarks: number
  percentage: number
}
