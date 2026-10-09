'use client'

import { StudentHeader } from '@/components/parents/shared/header'
import type { AbsenceRequest, AbsenceStatus, Student } from '@/lib/mock-data'

const STATUS_LABEL: Record<AbsenceStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  cancelled: 'Đã huỷ',
}
const STATUS_BADGE: Record<AbsenceStatus, string> = {
  pending: 'outline',
  approved: 'filled',
  cancelled: 'muted',
}

const TABS: { value: 'all' | AbsenceStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'cancelled', label: 'Đã huỷ' },
]

// Mirrors SCREENS['absence-list'].
export function AbsenceListScreen({
  student,
  absences,
  filter,
  onFilterChange,
  onBack,
  onChangeStudent,
  onCreate,
}: {
  student: Student
  absences: AbsenceRequest[]
  filter: 'all' | AbsenceStatus
  onFilterChange: (value: 'all' | AbsenceStatus) => void
  onBack: () => void
  onChangeStudent: () => void
  onCreate: () => void
}) {
  const items = absences.filter((a) => filter === 'all' || a.status === filter)

  return (
    <div className="screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
          ‹
        </button>
        <div className="topbar-title">Báo vắng</div>
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
        items.map((a) => (
          <div className="card" key={a.id}>
            <div className="feedback-row">
              <span style={{ fontWeight: 700 }}>{a.range}</span>
              <span className={`badge badge--${STATUS_BADGE[a.status]}`}>{STATUS_LABEL[a.status]}</span>
            </div>
            <div className="divider" />
            <div className="feedback-row">
              <span className="text-muted">Thời gian nghỉ</span>
              <span>{a.time}</span>
            </div>
            <div className="feedback-row">
              <span className="text-muted">Số ngày nghỉ</span>
              <span>{a.days} ngày</span>
            </div>
            <div className="feedback-row">
              <span className="text-muted">Nội dung</span>
              <span>{a.note}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">Chưa có đơn báo vắng</div>
        </div>
      )}
      <div className="cta-bar sticky">
        <button className="btn btn-primary" onClick={onCreate}>
          Tạo đơn báo vắng
        </button>
      </div>
    </div>
  )
}
