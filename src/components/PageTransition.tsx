import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

interface PageTransitionProps {
  children: ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.99,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    scale: 0.99,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()

  return (
    <motion.div
      key={location.pathname}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="relative z-10"
    >
      {children}
    </motion.div>
  )
}
