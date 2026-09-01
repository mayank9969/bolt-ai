import type { QuestionBank, HistoryEntry, QuizQuestion, Difficulty } from '@/types/quiz'
import { mockQuestions, mockHistory } from '@/data/mockData'

// ══════════════════════════════════════════════════════════════
//  API STUB LAYER
//  ────────────────────────────────────────────────────────────
//  This module is the SINGLE connection point between the
//  frontend and the future Python/Flask backend.
//
//  Currently all functions return MOCK DATA.
//
//  When the Flask backend is ready, replace each function body
//  with a fetch() call to the corresponding API endpoint.
//  No other part of the frontend needs to change.
//
//  Expected Flask endpoints (for future reference):
//    GET  /api/categories            → string[]
//    GET  /api/questions             → QuestionBank
//    GET  /api/questions?cat=&diff=  → QuizQuestion[]
//    POST /api/quiz/submit            → QuizResult
//    GET  /api/history                → HistoryEntry[]
// ══════════════════════════════════════════════════════════════

// TODO: set API_BASE_URL when Flask backend is connected
// const API_BASE_URL = 'http://localhost:5000/api'

// ── Categories ──────────────────────────────────────────────
// MOCK — replace with: fetch(`${API_BASE_URL}/categories`).then(r => r.json())
export async function getCategories(): Promise<string[]> {
  return Object.keys(mockQuestions)
}

// ── Difficulties for a category ─────────────────────────────
// MOCK — replace with: fetch(`${API_BASE_URL}/difficulties?category=${cat}`).then(r => r.json())
export async function getDifficulties(category: string): Promise<Difficulty[]> {
  const cat = mockQuestions[category]
  if (!cat) return []
  return Object.keys(cat) as Difficulty[]
}

// ── All questions ───────────────────────────────────────────
// MOCK — replace with: fetch(`${API_BASE_URL}/questions`).then(r => r.json())
export async function getAllQuestions(): Promise<QuestionBank> {
  return mockQuestions
}

// ── Questions for a specific category + difficulty ─────────
// MOCK — replace with: fetch(`${API_BASE_URL}/questions?category=${cat}&difficulty=${diff}`).then(r => r.json())
export async function getQuestions(category: string, difficulty: Difficulty): Promise<QuizQuestion[]> {
  const cat = mockQuestions[category]
  if (!cat) return []
  return cat[difficulty] ?? []
}

// ── Quiz history ────────────────────────────────────────────
// MOCK — replace with: fetch(`${API_BASE_URL}/history`).then(r => r.json())
export async function getHistory(): Promise<HistoryEntry[]> {
  return mockHistory
}

// ── Submit quiz answers (scoring done on backend) ──────────
// MOCK — replace with: fetch(`${API_BASE_URL}/quiz/submit`, { method: 'POST', body: JSON.stringify(payload) }).then(r => r.json())
export async function submitQuiz(
  _questions: QuizQuestion[],
  _answers: string[],
): Promise<{ score: number; totalMarks: number; correctAnswers: number; wrongAnswers: number; percentage: number }> {
  // This will eventually be a POST to the Flask backend.
  // For now, scoring is computed in the mock scoring module.
  throw new Error('submitQuiz not yet connected to Flask backend — use mockScoring instead')
}
