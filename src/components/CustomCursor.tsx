import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Premium custom cursor for desktop pointer devices.
 *  - A small precise dot tracks the pointer 1:1.
 *  - A larger ring trails with spring physics for a smooth, weighted feel.
 *  - The ring gently grows and brightens over interactive elements
 *    (magnetic-style feedback) without ever blocking clicks.
 *  - Automatically disables on touch / coarse-pointer devices, restoring
 *    the native cursor so usability is never harmed.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [hidden, setHidden] = useState(true)

  // Raw pointer position for the precise dot.
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  // Spring-smoothed position for the trailing ring.
  const ringX = useSpring(dotX, { stiffness: 350, damping: 28, mass: 0.4 })
  const ringY = useSpring(dotY, { stiffness: 350, damping: 28, mass: 0.4 })

  useEffect(() => {
    // Only enable on fine pointers (mouse/trackpad) that hover.
    const fine = window.matchMedia('(pointer: fine)').matches
    const canHover = window.matchMedia('(hover: hover)').matches
    if (!fine || !canHover) return
    setEnabled(true)

    const interactiveSelector = 'a, button, input, textarea, select, [role="button"], label, .cursor-interactive'

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      if (hidden) setHidden(false)
      const target = e.target as HTMLElement | null
      setHovering(Boolean(target?.closest(interactiveSelector)))
    }
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onLeave = () => setHidden(true)
    const onEnter = () => setHidden(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    document.body.classList.add('cursor-none')

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      document.body.classList.remove('cursor-none')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Trailing ring */}
      <motion.div
        className="absolute top-0 left-0 rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          borderColor: hovering ? 'rgba(93, 220, 255, 0.9)' : 'rgba(125, 143, 189, 0.5)',
          boxShadow: hovering ? '0 0 24px rgba(44, 196, 245, 0.35)' : 'none',
        }}
        animate={{
          width: hovering ? 52 : 34,
          height: hovering ? 52 : 34,
          opacity: hidden ? 0 : hovering ? 1 : 0.7,
          scale: pressed ? 0.8 : 1,
          backgroundColor: hovering ? 'rgba(44, 196, 245, 0.08)' : 'rgba(44, 196, 245, 0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
      {/* Precise dot */}
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-accent-300"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: pressed ? 10 : 6,
          height: pressed ? 10 : 6,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
    </div>
  )
}
