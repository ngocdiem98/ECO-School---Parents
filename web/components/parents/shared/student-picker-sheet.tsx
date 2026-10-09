'use client'

import type { Student } from '@/lib/mock-data'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

// Mirrors SHEETS['student-picker'] in ../../../scripts/app.js (vanilla app) —
// same interaction contract as eduteachers' ClassPickerSheet (scrim closes on
// click, panel stops propagation), styled with this app's own .sheet/.pick-row
// classes (see app/globals.css) rather than eduteachers' class-picker layout,
// since here we pick a *student*, not a class.

export function StudentPickerSheet({
  students,
  selectedStudentId,
  onSelect,
  onClose,
}: {
  students: Student[]
  selectedStudentId?: string
  onSelect: (student: Student) => void
  onClose: () => void
}) {
  return (
    <OverlayPortal>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-head">
          <span className="t">Danh sách học sinh</span>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        <div className="sheet-body">
          {students.map((s) => (
            <div
              key={s.id}
              className={`pick-row ${s.id === selectedStudentId ? 'selected' : ''}`}
              onClick={() => onSelect(s)}
            >
              <div>
                <div className="student-name">{s.name}</div>
                <div className="student-code">{s.code}</div>
              </div>
              <div className="right">
                <div className="lbl">Số dư thẻ</div>
                <div className="val">{s.balance.toLocaleString('vi-VN')} điểm</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OverlayPortal>
  )
}
