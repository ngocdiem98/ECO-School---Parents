'use client'

import { RefreshCw } from 'lucide-react'
import type { Student } from '@/lib/mock-data'
import { StudentAvatar } from './student-avatar'

// "Thanh học sinh" (EDU-1478, EDU-1819): avatar, họ tên, lớp and a swap icon.
// Only a parent with 2+ students gets the icon and the tap target that opens
// "Danh sách học sinh" (BR-02). `flat` is the square-edged bar of the feature
// screens; Trang Học sinh, Chi tiết thẻ and Hồ sơ keep the rounded one.
export function StudentBar({
  student,
  onSwitch,
  flat,
}: {
  student: Student
  onSwitch?: () => void
  flat?: boolean
}) {
  const className = `sb-bar${flat ? ' is-flat' : ''}`
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
    <button type="button" className={className} onClick={onSwitch} aria-label="Đổi học sinh">
      {body}
    </button>
  ) : (
    <div className={className}>{body}</div>
  )
}
