'use client'

import { useRef } from 'react'
import { useScrollFade } from './use-scroll-fade'

export interface QuickReply {
  /** Chip label. */
  label: string
  /** Sentence put into the text field. */
  text: string
}

// Suggestion chips shown above a text field (Báo vắng: lý do nghỉ, Trao đổi:
// trả lời nhanh). Tapping only fills the field; the parent edits it and sends.
// One scrolling row with a faded right edge by default; `wrap` breaks onto lines.
export function QuickReplies({
  items,
  onPick,
  wrap,
}: {
  items: QuickReply[]
  onPick: (item: QuickReply) => void
  wrap?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { fading, onScroll } = useScrollFade(ref, items.length)
  return (
    <div ref={ref} onScroll={onScroll} className={`qr-row ${wrap ? 'qr-row--wrap' : ''} ${!wrap && fading ? 'is-fading' : ''}`}>
      {items.map((it) => (
        <button
          key={it.label}
          type="button"
          className="qr-chip"
          onClick={() => onPick(it)}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}
