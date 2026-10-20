'use client'

import React, { useState } from 'react'
import { OverlayPortal } from '../shared/overlay-portal'

interface SpendingDatePickerSheetProps {
  initialDay?: number
  onSelectDate: (formattedDate: string) => void
  onClose: () => void
}

export function SpendingDatePickerSheet({
  initialDay = 14,
  onSelectDate,
  onClose,
}: SpendingDatePickerSheetProps) {
  const [selectedDay, setSelectedDay] = useState<number>(initialDay)
  const [currentMonth, setCurrentMonth] = useState({ month: 10, year: 2026 })

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 1) return { month: 12, year: prev.year - 1 }
      return { month: prev.month - 1, year: prev.year }
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 12) return { month: 1, year: prev.year + 1 }
      return { month: prev.month + 1, year: prev.year }
    })
  }

  const handleConfirm = () => {
    const d = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`
    const m = currentMonth.month < 10 ? `0${currentMonth.month}` : `${currentMonth.month}`
    const formatted = `${d}/${m}/${currentMonth.year}`
    onSelectDate(formatted)
    onClose()
  }

  return (
    <OverlayPortal>
      <div className="eco-sheet-root" role="dialog" aria-modal="true" aria-label="Chọn ngày">
        <div className="eco-sheet-scrim" onClick={onClose} />
        <div className="eco-sheet">
          <div className="eco-sheet__grabber" />

          {/* Sheet Header */}
          <div
            className="eco-sheet__head"
            style={{ justifyContent: 'space-between', padding: '0 16px' }}
          >
            <button
              type="button"
              className="eco-iconbtn"
              onClick={onClose}
              aria-label="Đóng"
              style={{ position: 'static' }}
            >
              ✕
            </button>
            <h3>Chọn ngày</h3>
            <button
              type="button"
              className="eco-provbar__action"
              onClick={handleConfirm}
              style={{ font: 'var(--text-body-s)', fontWeight: 700 }}
            >
              Chọn
            </button>
          </div>

          <div className="eco-sheet__body eco-vscroll">
            {/* Month Selector Bar */}
            <div className="spending-cal-month-bar">
              <button
                type="button"
                className="spending-cal-nav-btn"
                onClick={handlePrevMonth}
                aria-label="Tháng trước"
              >
                ‹
              </button>
              <span className="spending-cal-month-title">
                Tháng {currentMonth.month} {currentMonth.year}
              </span>
              <button
                type="button"
                className="spending-cal-nav-btn"
                onClick={handleNextMonth}
                aria-label="Tháng sau"
              >
                ›
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="spending-cal-grid">
              <div className="spending-cal-dow-row">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((dow) => (
                  <span key={dow} className="spending-cal-dow">
                    {dow}
                  </span>
                ))}
              </div>

              <div className="spending-cal-days-grid">
                {[27, 28, 29, 30].map((d) => (
                  <span key={`prev-${d}`} className="spending-cal-day other-month">
                    {d}
                  </span>
                ))}

                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const isSelected = day === selectedDay
                  const isFuture = day > 14
                  return (
                    <button
                      key={day}
                      type="button"
                      className={`spending-cal-day current-month ${isSelected ? 'selected' : ''} ${isFuture ? 'future-day' : ''}`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  )
                })}

                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <span key={`next-${d}`} className="spending-cal-day other-month">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
