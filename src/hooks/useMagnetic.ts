import { useRef, useState, useCallback } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

interface MagneticOptions {
  strength?: number
}

export function useMagnetic<T extends HTMLElement = HTMLDivElement>({ strength = 0.25 }: MagneticOptions = {}) {
  const ref = useRef<T>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 15 })
  const springY = useSpring(y, { stiffness: 200, damping: 15 })

  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const relX = e.clientX - rect.left - rect.width / 2
      const relY = e.clientY - rect.top - rect.height / 2
      x.set(relX * strength)
      y.set(relY * strength)
    },
    [strength, x, y]
  )

  const handleMouseEnter = useCallback(() => setIsHovering(true), [])
  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
    setIsHovering(false)
  }, [x, y])

  return {
    ref,
    style: { x: springX, y: springY },
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    isHovering,
  }
}
