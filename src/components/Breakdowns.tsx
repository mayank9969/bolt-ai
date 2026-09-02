import { motion } from 'framer-motion'
import type { HistoryEntry } from '@/types/quiz'

interface BreakdownProps {
  history: HistoryEntry[]
}

export function CategoryBreakdown({ history }: BreakdownProps) {
  const counts: Record<string, number> = {}
  history.forEach((h) => {
    counts[h.category] = (counts[h.category] ?? 0) + 1
  })

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const max = Math.max(...Object.values(counts), 1)

  if (entries.length === 0) {
    return (
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-lg font-600 text-ink-100 mb-4">Categories</h3>
        <p className="text-ink-400 font-300 text-sm">No data yet.</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display text-lg font-600 text-ink-100 mb-5">Categories Attempted</h3>
      <div className="space-y-3">
        {entries.map(([cat, count], i) => (
          <div key={cat}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-500 text-ink-200 capitalize">{cat}</span>
              <span className="text-xs text-ink-400 font-400">{count} {count === 1 ? 'quiz' : 'quizzes'}</span>
            </div>
            <div className="h-2 rounded-full bg-ink-800/50 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-600"
                initial={{ width: 0 }}
                animate={{ width: `${(count / max) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DifficultyBreakdown({ history }: BreakdownProps) {
  const counts: Record<string, number> = { easy: 0, medium: 0, hard: 0 }
  history.forEach((h) => {
    const d = h.difficulty.toLowerCase()
    if (d in counts) counts[d]++
  })

  const total = history.length || 1
  const entries: Array<{ key: string; count: number; color: string; bg: string }> = [
    { key: 'easy', count: counts.easy, color: 'text-success-400', bg: 'bg-success-500' },
    { key: 'medium', count: counts.medium, color: 'text-gold-400', bg: 'bg-gold-500' },
    { key: 'hard', count: counts.hard, color: 'text-error-400', bg: 'bg-error-500' },
  ]

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display text-lg font-600 text-ink-100 mb-5">Difficulty Distribution</h3>
      <div className="flex items-end gap-6 h-32">
        {entries.map((e, i) => {
          const heightPct = (e.count / total) * 100
          return (
            <div key={e.key} className="flex-1 flex flex-col items-center gap-2">
              <span className={`text-sm font-600 ${e.color}`}>{e.count}</span>
              <div className="w-full flex-1 flex items-end">
                <motion.div
                  className={`w-full rounded-t-lg ${e.bg} opacity-70`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(heightPct, e.count > 0 ? 8 : 0)}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs text-ink-400 font-400 capitalize">{e.key}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
