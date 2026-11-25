'use client'

import type { Student } from '@/lib/mock-data'
import { StudentBar } from './student-bar'

export function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="topbar">
      <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
        ‹
      </button>
      <div className="topbar-title">{title}</div>
      <span className="icon-btn-ghost" />
    </div>
  )
}

// Student header of every feature screen (EDU-1478 / EDU-1950): avatar, name,
// lớp and the swap icon. Mã học sinh and trường only show in Hồ sơ học sinh.
export function StudentHeader({
  student,
  onChangeStudent,
}: {
  student: Student
  // Omit to hide the swap icon (single student, or a screen tied to one record).
  onChangeStudent?: () => void
}) {
  return <StudentBar student={student} onSwitch={onChangeStudent} flat />
}
