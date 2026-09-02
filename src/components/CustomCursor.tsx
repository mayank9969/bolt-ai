import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const ringX = useSpring(cursorX, { stiffness: 350, damping: 28, mass: 0.5 })
  const ringY = useSpring(cursorY, { stiffness: 350, damping: 28, mass: 0.5 })

  const dotX = useSpring(cursorX, { stiffness: 800, damping: 35 })
  const dotY = useSpring(cursorY, { stiffness: 800, damping: 35 })

  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)
  const rafRef = useRef<number>(0)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
      return
    }

    const move = (e: MouseEvent) => {
      if (!visible) setVisible(true)
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        cursorX.set(e.clientX)
        cursorY.set(e.clientY)
      })
    }

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return
      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], [data-cursor="hover"]'
      )
      setHovering(!!interactive)
    }

    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', checkHover, { passive: true })
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', checkHover)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
      cancelAnimationFrame(rafRef.current)
    }
  }, [cursorX, cursorY, visible])

  if (isTouch) return null

  return (
    <>
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        animate={{
          width: hovering ? 44 : 28,
          height: hovering ? 44 : 28,
          opacity: visible ? (hovering ? 0.6 : 0.35) : 0,
          borderColor: hovering ? 'rgba(44,196,245,0.6)' : 'rgba(125,143,189,0.35)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div
          className="w-full h-full rounded-full border-2 -translate-x-1/2 -translate-y-1/2"
          style={{ borderColor: 'inherit' }}
        />
      </motion.div>
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        animate={{ opacity: visible ? 1 : 0 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-accent-400 -translate-x-1/2 -translate-y-1/2" />
      </motion.div>
    </>
  )
}
