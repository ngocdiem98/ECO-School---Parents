'use client'

import { useCallback, useEffect, useState, type RefObject } from 'react'

/** True while a horizontal strip still has content hidden past its right edge. */
export function useScrollFade(ref: RefObject<HTMLElement | null>, itemCount: number) {
  const [fading, setFading] = useState(false)
  const update = useCallback(() => {
    const el = ref.current
    setFading(!!el && el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [ref])

  useEffect(() => {
    update()
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, itemCount, update])

  return { fading, onScroll: update }
}
