'use client'

import { useState } from 'react'
import { ChevronDown, NotebookText } from 'lucide-react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import { yearLabel } from './bill-year'

// "Năm học 2026 - 2027" row under the student card (notebook icon + bold
// label, divider below). Tappable when given `onClick`, read-only otherwise.
export function YearRow({ year, onClick }: { year: number; onClick?: () => void }) {
  const content = (
    <>
      <NotebookText size={22} strokeWidth={2} className="year-row-icon" />
      <span className="year-row-text">Năm học {yearLabel(year)}</span>
      {onClick && <ChevronDown size={18} className="year-row-chevron" />}
    </>
  )
  return onClick ? (
    <button className="year-row" onClick={onClick} aria-haspopup="dialog">
      {content}
    </button>
  ) : (
    <div className="year-row">{content}</div>
  )
}

// The school-year filter: the row plus its "Chọn năm học" bottom sheet. Used on
// the list and on the overview; picking a year reloads whichever screen holds it.
export function YearFilter({
  year,
  years,
  onChange,
}: {
  year: number
  years: number[]
  onChange: (startYear: number) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <YearRow year={year} onClick={() => setOpen(true)} />
      {open && (
        <OverlayPortal>
          <div className="scrim" onClick={() => setOpen(false)} />
          <div className="sheet">
            <div className="sheet-head">
              <span className="t">Chọn năm học</span>
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Đóng">
                ✕
              </button>
            </div>
            <div className="sheet-body">
              {years.map((y) => (
                <div
                  key={y}
                  className={`pick-row ${y === year ? 'selected' : ''}`}
                  onClick={() => {
                    setOpen(false)
                    onChange(y)
                  }}
                >
                  <div className="student-name">Năm học {yearLabel(y)}</div>
                </div>
              ))}
            </div>
          </div>
        </OverlayPortal>
      )}
    </>
  )
}
