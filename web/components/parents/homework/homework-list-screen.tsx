'use client'

import { StudentHeader } from '@/components/parents/shared/header'
import type { Homework, HomeworkStatus, Student } from '@/lib/mock-data'

const STATUS_LABEL: Record<HomeworkStatus, string> = {
  notsubmitted: 'Chưa nộp',
  submitted: 'Đã nộp',
  graded: 'Đã chấm',
}
const STATUS_BADGE: Record<HomeworkStatus, string> = {
  notsubmitted: 'outline',
  submitted: 'filled',
  graded: 'filled',
}

const TABS: { value: 'all' | HomeworkStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'notsubmitted', label: 'Chưa nộp' },
  { value: 'submitted', label: 'Đã nộp' },
  { value: 'graded', label: 'Đã chấm' },
]

// Mirrors SCREENS['homework-list'].
export function HomeworkListScreen({
  student,
  homework,
  filter,
  onFilterChange,
  onBack,
  onChangeStudent,
  onOpen,
}: {
  student: Student
  homework: Homework[]
  filter: 'all' | HomeworkStatus
  onFilterChange: (value: 'all' | HomeworkStatus) => void
  onBack: () => void
  onChangeStudent: () => void
  onOpen: (hw: Homework) => void
}) {
  const items = homework.filter((h) => filter === 'all' || h.status === filter)

  return (
    <div className="screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
          ‹
        </button>
        <div className="topbar-title">Bài tập</div>
        <span className="icon-btn-ghost" />
      </div>
      <StudentHeader student={student} onChangeStudent={onChangeStudent} />
      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.value}
            className={`tab-pill ${filter === t.value ? 'active' : ''}`}
            onClick={() => onFilterChange(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.length ? (
        items.map((h) => (
          <div className="card" key={h.id} onClick={() => onOpen(h)}>
            <div className="feedback-row">
              <span style={{ fontWeight: 700 }}>{h.subject}</span>
              <span className={`badge badge--${STATUS_BADGE[h.status]}`}>{STATUS_LABEL[h.status]}</span>
            </div>
            <div className="feedback-row">
              <span>{h.title}</span>
            </div>
            <div className="divider" />
            <div className="feedback-row">
              <span className="text-muted">{h.status === 'graded' ? 'Điểm: ' + h.score : ''}</span>
              <span
                className="text-muted"
                style={h.overdue && h.status === 'notsubmitted' ? { fontWeight: 700 } : undefined}
              >
                {h.dueDate}
                {h.overdue && h.status === 'notsubmitted' ? ' (Quá hạn)' : ''} · {h.teacher}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">Chưa có bài tập</div>
        </div>
      )}
      <div className="text-center text-muted" style={{ padding: 14, fontSize: 12.5 }}>
        {items.length ? 'Bạn đã xem hết bài tập' : ''}
      </div>
    </div>
  )
}
