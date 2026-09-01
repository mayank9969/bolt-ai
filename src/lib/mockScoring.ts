import type { QuizQuestion, Difficulty } from '@/types/quiz'

// ══════════════════════════════════════════════════════════════
//  MOCK SCORING MODULE
//  ────────────────────────────────────────────────────────────
//  This mirrors the EXACT scoring and answer-checking rules
//  from the Python backend (quiz.py) so the frontend behaves
//  identically until the Flask backend is connected.
//
//  Rules replicated from quiz.py:
//    - Marks: easy=2, medium=4, hard=6; MCQ gets half marks
//    - MCQ: exact match on option letter (uppercase)
//    - Normal easy:    case-insensitive
//    - Normal medium: whitespace-normalized + case-insensitive
//    - Normal hard:    exact string match (stripped)
// ══════════════════════════════════════════════════════════════

const MARKS: Record<Difficulty, number> = {
  easy: 2,
  medium: 4,
  hard: 6,
}

export function getMarks(question: QuizQuestion): number {
  let mark = MARKS[question.difficulty]
  if (question.question_type === 'mcq') {
    mark = mark / 2
  }
  return mark
}

export function checkAnswer(question: QuizQuestion, userAnswer: string): boolean {
  if (question.question_type === 'mcq') {
    return userAnswer === question.answer
  }
  if (question.difficulty === 'easy') {
    return userAnswer.toLowerCase() === question.answer.toLowerCase()
  }
  if (question.difficulty === 'medium') {
    const ua = userAnswer.split(/\s+/).join(' ')
    const ca = question.answer.split(/\s+/).join(' ')
    return ua.toLowerCase() === ca.toLowerCase()
  }
  // hard
  return userAnswer.trim() === question.answer.trim()
}

export function getTotalMarks(questions: QuizQuestion[]): number {
  return questions.reduce((sum, q) => sum + getMarks(q), 0)
}

export interface ScoreResult {
  score: number
  totalMarks: number
  correctAnswers: number
  wrongAnswers: number
  percentage: number
}

export function scoreQuiz(questions: QuizQuestion[], answers: string[]): ScoreResult {
  let score = 0
  let correct = 0
  let wrong = 0

  questions.forEach((q, i) => {
    if (checkAnswer(q, answers[i] ?? '')) {
      score += getMarks(q)
      correct++
    } else {
      wrong++
    }
  })

  const totalMarks = getTotalMarks(questions)
  const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0

  return { score, totalMarks, correctAnswers: correct, wrongAnswers: wrong, percentage }
}
