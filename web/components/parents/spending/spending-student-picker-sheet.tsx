'use client'

import React, { useEffect, useState } from 'react'
import { OverlayPortal } from '../shared/overlay-portal'
import { getSpendingStudents, type SpendingStudent } from './spending-data'

interface SpendingStudentPickerSheetProps {
  selectedStudentId: string
  onSelect: (student: SpendingStudent) => void
  onClose: () => void
}

export function SpendingStudentPickerSheet({
  selectedStudentId,
  onSelect,
  onClose,
}: SpendingStudentPickerSheetProps) {
  const [activeId, setActiveId] = useState<string>(selectedStudentId)

  useEffect(() => {
    setActiveId(selectedStudentId)
  }, [selectedStudentId])

  return (
    <OverlayPortal>
      <div className="eco-sheet-root eco-stupicker" role="dialog" aria-modal="true" aria-label="Danh sách học sinh" style={{ zIndex: 100 }}>
        <div className="eco-sheet-scrim" onClick={onClose} />
        <div className="eco-sheet" style={{ maxHeight: '78%', height: 'auto' }} onClick={(e) => e.stopPropagation()}>
          <div className="eco-sheet__head">
            <h3>Danh sách học sinh</h3>
            <button
              type="button"
              className="eco-iconbtn eco-iconbtn--md eco-iconbtn--ghost"
              onClick={onClose}
              aria-label="Đóng"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#27272A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="eco-sheet__body eco-vscroll">
            {getSpendingStudents().map((student) => {
              const isSelected = activeId === student.id || activeId === student.code
              return (
                <button
                  key={student.id}
                  type="button"
                  className={`eco-selitem${isSelected ? ' is-selected' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setActiveId(student.id)
                    onSelect(student)
                    onClose()
                  }}
                >
                  <span className="eco-selitem__main">
                    <strong>{student.name}</strong>
                    <span>{student.code}</span>
                  </span>

                  <span className="eco-selitem__side">
                    <small>Số dư thẻ</small>
                    <b>
                      {student.balance.toLocaleString('en-US')} <em>điểm</em>
                    </b>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
