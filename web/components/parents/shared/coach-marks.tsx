'use client'

import { useLayoutEffect, useState } from 'react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

export interface CoachStep {
  /** Value of the target's `data-coach` attribute. */
  target: string
  text: string
  /** Overrides the default button label ("Tiếp", or "Đã hiểu" on the last step). */
  nextLabel?: string
}

interface Box {
  top: number
  left: number
  width: number
  height: number
  rootW: number
  rootH: number
}

const MAX_SPOT_H = 200
const BUBBLE_H = 150

// First-run guide (EDU-2106 phần B): dims the screen, cuts a spotlight around
// the element tagged data-coach="…" and shows a bubble with 1–2 sentences,
// "Tiếp" / "Đã hiểu" and "Bỏ qua". `stepOffset` / `totalSteps` let a guide
// continue on another screen (Trao đổi: list, then the composer).
export function CoachMarks({
  steps,
  onDone,
  onSkip,
  stepOffset = 0,
  totalSteps = steps.length,
}: {
  steps: CoachStep[]
  onDone: () => void
  onSkip: () => void
  stepOffset?: number
  totalSteps?: number
}) {
  const [idx, setIdx] = useState(0)
  const [box, setBox] = useState<Box | null>(null)
  const step = steps[idx]

  useLayoutEffect(() => {
    let tries = 0
    let raf = 0
    const measure = () => {
      const root = document.getElementById('overlay-root')
      const el = document.querySelector<HTMLElement>(`[data-coach="${step.target}"]`)
      if (!root || !el) {
        // Target not on screen (yet): retry a few frames, then skip the step.
        if (tries++ < 12) raf = requestAnimationFrame(measure)
        else if (idx < steps.length - 1) setIdx(idx + 1)
        else onDone()
        return
      }
      el.scrollIntoView({ block: 'nearest' })
      const r = el.getBoundingClientRect()
      const rr = root.getBoundingClientRect()
      const k = root.offsetWidth ? rr.width / root.offsetWidth : 1
      setBox({
        top: (r.top - rr.top) / k,
        left: (r.left - rr.left) / k,
        width: r.width / k,
        height: Math.min(r.height / k, MAX_SPOT_H),
        rootW: root.offsetWidth,
        rootH: root.offsetHeight,
      })
    }
    setBox(null)
    measure()
    // Screens slide in on entry: measure again once the animation has settled.
    const timers = [150, 400, 800].map((ms) => setTimeout(measure, ms))
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      window.removeEventListener('resize', measure)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, step?.target])

  if (!step || !box) return null

  const pad = 4
  const spot = { top: box.top - pad, left: box.left - pad, width: box.width + pad * 2, height: box.height + pad * 2 }
  const below = spot.top + spot.height + BUBBLE_H + 12 < box.rootH
  const bubbleW = Math.min(300, box.rootW - 32)
  const bubbleLeft = Math.min(Math.max(16, spot.left + spot.width / 2 - bubbleW / 2), box.rootW - bubbleW - 16)
  const arrowLeft = Math.min(Math.max(20, spot.left + spot.width / 2 - bubbleLeft), bubbleW - 20)
  const isLast = idx === steps.length - 1
  const label = step.nextLabel ?? (isLast ? 'Đã hiểu' : 'Tiếp')

  return (
    <OverlayPortal>
      <div className="coach-layer" role="dialog" aria-label="Chỉ dẫn">
        <div className="coach-spot" style={spot} />
        <div
          className={`coach-bubble ${below ? 'is-below' : 'is-above'}`}
          style={{
            width: bubbleW,
            left: bubbleLeft,
            ...(below ? { top: spot.top + spot.height + 12 } : { bottom: box.rootH - spot.top + 12 }),
          }}
        >
          <span className="coach-arrow" style={{ left: arrowLeft }} />
          <div className="coach-text">{step.text}</div>
          <div className="coach-foot">
            <span className="coach-count">
              {stepOffset + idx + 1}/{totalSteps}
            </span>
            <button className="coach-skip" onClick={onSkip}>
              Bỏ qua
            </button>
            <button
              className="coach-next"
              onClick={() => {
                if (isLast) onDone()
                else setIdx(idx + 1)
              }}
            >
              {label}
            </button>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
