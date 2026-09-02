import { motion } from 'framer-motion'
import type { HistoryEntry } from '@/types/quiz'

interface TrendChartProps {
  history: HistoryEntry[]
}

export default function TrendChart({ history }: TrendChartProps) {
  if (history.length < 2) {
    return (
      <div className="glass rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
        <p className="text-ink-400 font-300 text-sm">
          Take at least 2 quizzes to see your score trend.
        </p>
      </div>
    )
  }

  const reversed = [...history].reverse()
  const data = reversed.slice(0, 12)

  const width = 600
  const height = 180
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const stepX = chartW / Math.max(data.length - 1, 1)

  const points = data.map((entry, i) => ({
    x: padding.left + i * stepX,
    y: padding.top + chartH - (Math.min(entry.percentage, 100) / 100) * chartH,
    pct: entry.percentage,
    category: entry.category,
  }))

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-600 text-ink-100">Score Trend</h3>
        <span className="text-xs text-ink-400 font-400">Last {data.length} quizzes</span>
      </div>
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: 400 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2cc4f5" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2cc4f5" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 25, 50, 75, 100].map((val) => {
            const y = padding.top + chartH - (val / 100) * chartH
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(125,143,189,0.08)"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-ink-500"
                  style={{ fontSize: '10px', fontFamily: 'Outfit, sans-serif' }}
                >
                  {val}
                </text>
              </g>
            )
          })}

          <motion.path
            d={areaPath}
            fill="url(#trendGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          <motion.path
            d={linePath}
            fill="none"
            stroke="#2cc4f5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          {points.map((p, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.06, duration: 0.3 }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#0d1124"
                stroke="#2cc4f5"
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                className="fill-ink-300"
                style={{ fontSize: '10px', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
              >
                {Math.round(p.pct * 10) / 10}%
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
    </div>
  )
}
