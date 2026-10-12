'use client'

import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import type { MedicineOrder, MedicineStatus, Student } from '@/lib/mock-data'
import { effectiveMedicineStatus, fmtDate } from './utils'

export const STATUS_LABEL: Record<MedicineStatus, string> = {
  sent: 'Đã gửi',
  completed: 'Đã hoàn thành',
  cancelled: 'Đã hủy',
}

const TABS: { value: 'all' | MedicineStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'sent', label: 'Đã gửi' },
  { value: 'completed', label: 'Đã hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
]

// "Danh sách đơn dặn thuốc" (PH-13): filter tabs, one card per order that
// opens its detail, empty state, and the "Tạo đơn dặn thuốc" CTA.
export function MedicineListScreen({
  student,
  orders,
  filter,
  onFilterChange,
  onBack,
  onChangeStudent,
  onOpen,
  onCreate,
}: {
  student: Student
  orders: MedicineOrder[]
  filter: 'all' | MedicineStatus
  onFilterChange: (value: 'all' | MedicineStatus) => void
  onBack: () => void
  onChangeStudent: () => void
  onOpen: (orderId: string) => void
  onCreate: () => void
}) {
  const items = orders.filter((o) => filter === 'all' || effectiveMedicineStatus(o) === filter)

  return (
    <div className="screen">
      <TopBar title="Dặn thuốc" onBack={onBack} />
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
        items.map((o) => (
          <div className="card med-card" key={o.id} onClick={() => onOpen(o.id)}>
            <div className="feedback-row">
              <span style={{ fontWeight: 700 }}>
                {fmtDate(o.from)} - {fmtDate(o.to)}
              </span>
              <StatusChip status={effectiveMedicineStatus(o)} />
            </div>
            <div className="divider" />
            <div className="feedback-row">
              <span className="text-muted">Giờ uống thuốc</span>
              <span>{o.doses.map((d) => d.time).join(', ')}</span>
            </div>
            <div className="med-card-note">{o.note}</div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <div className="glyph">✛</div>
          <div className="text">Chưa có đơn dặn thuốc</div>
        </div>
      )}
      <div className="cta-bar sticky">
        <button className="btn btn-primary" onClick={onCreate}>
          Tạo đơn dặn thuốc
        </button>
      </div>
    </div>
  )
}

// Coloured status pill shared by the list and the detail screen.
export function StatusChip({ status }: { status: MedicineStatus }) {
  return <span className={`med-chip ${status}`}>{STATUS_LABEL[status]}</span>
}
