'use client'

import { useRef, useState } from 'react'

export interface GridItem {
  id: string
  icon: string
  label: string
  disabled?: boolean
  onClick?: () => void
}

// Horizontally swipeable icon grid: one page per block of items (4 columns ×
// 2 rows = 8 per page), snap scrolling, and dots under it when there is more
// than one page. Used by the ECO Phụ huynh Home and the Học sinh page.
export function PagedIconGrid({ pages }: { pages: GridItem[][] }) {
  const [page, setPage] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const onScroll = () => {
    const el = scrollerRef.current
    if (el) setPage(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div className="icon-grid-wrap">
      <div className="icon-grid-scroller" ref={scrollerRef} onScroll={onScroll}>
        {pages.map((items, p) => (
          <div className="icon-grid-page" key={p}>
            {items.map(({ id, icon, label, disabled, onClick }) => (
              <button key={id} className="icon-item" disabled={disabled} onClick={onClick}>
                <span className="icon-glyph">{icon}</span>
                <span className="icon-label">{label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      {pages.length > 1 && (
        <div className="icon-dots">
          {pages.map((_, p) => (
            <span key={p} className={`icon-dot ${page === p ? 'active' : ''}`} />
          ))}
        </div>
      )}
    </div>
  )
}
