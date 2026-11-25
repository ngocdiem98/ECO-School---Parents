'use client'

import type { Homework, HomeworkStatus, Student } from '@/lib/mock-data'
import { StudentHeader } from '@/components/parents/shared/header'

const TABS: { value: 'all' | HomeworkStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'notsubmitted', label: 'Chưa nộp' },
  { value: 'submitted', label: 'Đã nộp' },
  { value: 'graded', label: 'Đã chấm' },
]

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
  onChangeStudent?: () => void
  onOpen: (hw: Homework) => void
}) {
  const items = homework.filter((h) => filter === 'all' || h.status === filter)

  return (
    <div className="hw-screen-root">
      {/* 1. Top Bar */}
      <header className="hw-topbar">
        <button type="button" className="hw-back-btn" onClick={onBack} aria-label="Quay lại">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="hw-topbar-title">Bài tập</h1>
        <div className="hw-topbar-ghost" />
      </header>

      {/* 2. Student Info Header */}
      <StudentHeader student={student} onChangeStudent={onChangeStudent} />

      {/* 3. Filter Tabs */}
      <div className="hw-tabs-row">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`hw-tab-pill ${filter === tab.value ? 'active' : ''}`}
            onClick={() => onFilterChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Scrollable Body with Doodle Graph Paper Background */}
      <div className="hw-scroll-body">
        {items.length > 0 ? (
          <>
            {items.map((h) => {
              const isOverdue = h.overdue && h.status === 'notsubmitted'

              return (
                <div key={h.id} className="hw-card" onClick={() => onOpen(h)}>
                  {/* Subject and Status Badge */}
                  <div className="hw-card-head">
                    <span className="hw-card-subject">{h.subject || ''}</span>
                    <span className={`hw-status-badge hw-status-badge--${h.status}`}>
                      {h.status === 'notsubmitted' && 'Chưa nộp'}
                      {h.status === 'submitted' && 'Đã nộp'}
                      {h.status === 'graded' && 'Đã chấm'}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="hw-card-title">{h.title}</div>

                  {/* Score row if graded */}
                  {h.status === 'graded' && (
                    <div className="hw-card-score-row">
                      <span>Điểm</span>
                      <span className="hw-card-score-val">{h.score ?? '-'}</span>
                    </div>
                  )}

                  {/* Divider line */}
                  <div className="hw-card-divider" />

                  {/* Footer due date & teacher */}
                  <div className="hw-card-foot">
                    <span className={`hw-card-foot-due ${isOverdue ? 'overdue' : ''}`}>
                      {h.dueDate}
                      {isOverdue && !h.dueDate.includes('Quá hạn') ? ' (Quá hạn)' : ''}
                    </span>
                    <span className="hw-card-foot-teacher">{h.teacher}</span>
                  </div>
                </div>
              )
            })}

            <div className="hw-bottom-hint">Bạn đã xem hết bài tập</div>
          </>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6B7280',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ fontSize: 32 }}>📝</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>Chưa có bài tập nào</div>
            <div style={{ fontSize: 14 }}>Danh sách bài tập trống trong mục này</div>
          </div>
        )}
      </div>
    </div>
  )
}
