import { useEffect, useRef } from 'react'

export const useScrollbarHover = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    const handleMouseEnter = () => {
      container.classList.add('scrollbar-hovered')
    }

    const handleMouseLeave = () => {
      container.classList.remove('scrollbar-hovered')
    }

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.classList.remove('scrollbar-hovered')
    }
  }, [])

  return containerRef
}
