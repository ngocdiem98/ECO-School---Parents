'use client'

import { RefreshCw } from 'lucide-react'
import type { Student } from '@/lib/mock-data'
import { StudentAvatar } from './student-avatar'

// "Thanh học sinh" of the enhanced Trang Học sinh (EDU-1819): avatar, họ tên,
// lớp and a swap icon. Only a parent with 2+ students gets the icon and the
// tap target that opens "Danh sách học sinh" (BR-02).
export function StudentBar({ student, onSwitch }: { student: Student; onSwitch?: () => void }) {
  const body = (
    <>
      <StudentAvatar student={student} />
      <div className="sb-info">
        <div className="sb-name">{student.name}</div>
        <div className="sb-class">{student.className}</div>
      </div>
      {onSwitch && <RefreshCw className="sb-swap" size={20} aria-hidden="true" />}
    </>
  )
  return onSwitch ? (
    <button className="sb-bar" onClick={onSwitch} aria-label="Đổi học sinh">
      {body}
    </button>
  ) : (
    <div className="sb-bar">{body}</div>
  )
}
