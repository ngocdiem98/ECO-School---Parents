'use client'

import type { Student } from '@/lib/mock-data'
import { StudentAvatar } from './student-avatar'

// eduparents' header pattern differs from eduteachers' AppHeader (which is
// class-scoped, with an "Đổi lớp" button): every feature screen here is
// scoped to one student, and repeats a compact info block (avatar, name,
// lớp; mã học sinh and trường live in the profile) with a "Đổi" button that reopens the student
// picker — mirrors topbarHTML()/studentHeaderHTML() in ../../../scripts/app.js.

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

export function StudentHeader({
  student,
  onChangeStudent,
}: {
  student: Student
  // Omit to hide the "Đổi" button (screens where switching student makes no sense).
  onChangeStudent?: () => void
}) {
  return (
    <div className="student-header">
      <StudentAvatar student={student} />
      <div className="info">
        <div className="student-name">{student.name}</div>
        <div className="meta">{student.className}</div>
      </div>
      {onChangeStudent && (
        <button className="btn-change" onClick={onChangeStudent}>
          ⇄ Đổi
        </button>
      )}
    </div>
  )
}
