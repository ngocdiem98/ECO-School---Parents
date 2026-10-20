'use client'

import React from 'react'
import { OverlayPortal } from './overlay-portal'

export interface WeekPickerOption {
  id: string
  dateRange: string
  label?: string
  isCurrent?: boolean
  [key: string]: any
}

interface WeekPickerSheetProps {
  selectedId: string
  weeks: WeekPickerOption[]
  onSelect: (week: WeekPickerOption) => void
  onClose: () => void
  title?: string
}

function WeekCalendarIcon({ selected }: { selected?: boolean }) {
  const color = selected ? '#F59E0B' : '#374151'
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="8" cy="14" r="1.1" fill={color} stroke="none" />
      <circle cx="12" cy="14" r="1.1" fill={color} stroke="none" />
      <circle cx="16" cy="14" r="1.1" fill={color} stroke="none" />
      <circle cx="8" cy="18" r="1.1" fill={color} stroke="none" />
      <circle cx="12" cy="18" r="1.1" fill={color} stroke="none" />
      <circle cx="16" cy="18" r="1.1" fill={color} stroke="none" />
    </svg>
  )
}

export function WeekPickerSheet({
  selectedId,
  weeks,
  onSelect,
  onClose,
  title = 'Chọn tuần',
}: WeekPickerSheetProps) {
  return (
    <OverlayPortal>
      <div className="eco-sheet-root" style={{ zIndex: 120 }}>
        <div className="eco-sheet-scrim" onClick={onClose} />
        <div
          className="eco-sheet eco-weeksheet"
          style={{ height: 'auto', maxHeight: '82%' }}
          role="dialog"
          aria-label={title}
        >
          {/* Header with centered title and close button */}
          <div className="eco-weeksheet__head">
            <span style={{ width: 32 }} aria-hidden="true" />
            <h3 className="eco-weeksheet__title">{title}</h3>
            <button
              type="button"
              className="eco-weeksheet__close"
              onClick={onClose}
              aria-label="Đóng"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* List of week options */}
          <div className="eco-weeksheet__body">
            <div className="eco-weeklist" role="listbox" aria-label={title}>
              {weeks.map((w) => {
                const isSelected = w.id === selectedId
                const parts = w.dateRange.split(' - ')
                const startStr = parts[0] || w.dateRange
                const endStr = parts[1] || ''

                return (
                  <button
                    key={w.id}
                    type="button"
                    className={`eco-weekopt ${isSelected ? 'is-selected' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => {
                      onSelect(w)
                      onClose()
                    }}
                  >
                    <span className="eco-weekopt__ico">
                      <WeekCalendarIcon selected={isSelected} />
                    </span>

                    <span className="eco-weekopt__range">
                      <b>{startStr}</b>
                      {endStr && (
                        <>
                          <i aria-hidden="true">-</i>
                          <b>{endStr}</b>
                        </>
                      )}
                    </span>

                    <span className="eco-weekopt__blank" aria-hidden="true" />

                    {isSelected && (
                      <span className="eco-weekopt__mark" aria-hidden="true">
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path
                            d="M1 3.5L3.2 5.7L8 1"
                            stroke="#ffffff"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
