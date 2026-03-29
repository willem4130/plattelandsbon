import { useEffect, useRef, useCallback } from 'react'
import type { CarouselApi } from '@/components/ui/carousel'

export function useCarouselWheel(api: CarouselApi | undefined) {
  const containerRef = useRef<HTMLDivElement>(null)
  const accumulatedDelta = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>(null)

  const setRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || !api) return

    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (delta === 0) return

      e.preventDefault()

      accumulatedDelta.current += delta

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)

      scrollTimeout.current = setTimeout(() => {
        if (Math.abs(accumulatedDelta.current) > 50) {
          if (accumulatedDelta.current > 0) {
            api.scrollNext()
          } else {
            api.scrollPrev()
          }
        }
        accumulatedDelta.current = 0
      }, 80)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    }
  }, [api])

  return setRef
}
