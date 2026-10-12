'use client'

import { Play } from 'lucide-react'

export interface GridMedia {
  src: string
  kind?: 'image' | 'video' | 'pdf'
  duration?: string
  name?: string
}

// Media layout shared by Hoạt động and Bảng tin (PRD: 1 → full width,
// 2 → stacked 16:9, 3 → one 16:9 over two 1:1, 4 → 2x2, 5+ → 2x2 with a "+N"
// overlay in the feed, or a 3-column grid on the detail page).
export function MediaGrid({
  items,
  detail,
  onOpen,
}: {
  items: GridMedia[]
  detail?: boolean
  onOpen: (index: number) => void
}) {
  if (!items.length) return null
  const n = items.length

  const cell = (i: number, cls: string, overlay?: number) => {
    const m = items[i]
    return (
      <button key={i} className={`mg-cell ${cls}`} onClick={() => onOpen(i)}>
        <img src={m.src} alt="" />
        {m.kind === 'video' && (
          <span className="mg-video">
            <Play size={22} fill="#fff" />
            {m.duration && <em>{m.duration}</em>}
          </span>
        )}
        {m.kind === 'pdf' && <span className="mg-pdf">PDF</span>}
        {overlay ? <span className="mg-more">+{overlay}</span> : null}
      </button>
    )
  }

  if (n === 1) return <div className="mg mg-1">{cell(0, 'wide')}</div>
  if (n === 2) return <div className="mg mg-2">{[0, 1].map((i) => cell(i, 'wide'))}</div>
  if (n === 3)
    return (
      <div className="mg mg-3">
        {cell(0, 'wide span2')}
        {cell(1, 'sq')}
        {cell(2, 'sq')}
      </div>
    )
  if (n === 4 || !detail)
    return (
      <div className="mg mg-4">
        {[0, 1, 2, 3].map((i) => cell(i, 'sq', i === 3 && n > 4 ? n - 4 : undefined))}
      </div>
    )
  return <div className="mg mg-n">{items.map((_, i) => cell(i, 'sq'))}</div>
}
