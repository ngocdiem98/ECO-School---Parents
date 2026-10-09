'use client'

import type { Student } from '@/lib/mock-data'

// eduparents' header pattern differs from eduteachers' AppHeader (which is
// class-scoped, with an "Đổi lớp" button): every feature screen here is
// scoped to one student, and repeats a fixed info block (avatar, name, mã
// học sinh, lớp, trường) with a "Đổi" button that reopens the student
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
  onChangeStudent: () => void
}) {
  return (
    <div className="student-header">
      <div className="avatar">{student.avatar}</div>
      <div className="info">
        <div className="student-name">{student.name}</div>
        <div className="meta">{student.code}</div>
        <div className="meta">{student.className}</div>
        <div className="meta">{student.school}</div>
      </div>
      <button className="btn-change" onClick={onChangeStudent}>
        ⇄ Đổi
      </button>
    </div>
  )
}
