import { motion } from 'framer-motion'

export default function Credits() {
  return (
    <div className="border-t border-ink-800/40 glass">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-ink-400 font-400">
          Designed &amp; developed by{' '}
          <motion.span
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
            className="font-500 text-ink-100"
          >
            Mayank
          </motion.span>
        </p>
        <div className="flex flex-col sm:items-end gap-0.5">
          <p className="text-xs text-ink-500 font-400 tracking-wide">
            NEXUS Quiz — Premium Educational Quiz Platform
          </p>
          <p className="text-xs text-ink-500 font-400 tracking-wide">
            Built by <span className="text-ink-300 font-500">Mayank Sarwal</span>
          </p>
        </div>
      </div>
    </div>
  )
}
