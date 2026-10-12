'use client'

import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, MessageSquareText, NotepadText } from 'lucide-react'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import { PhotoViewer } from '@/components/parents/shared/photo-viewer'
import type { MedicineOrder, Student } from '@/lib/mock-data'
import { StatusChip } from './medicine-list-screen'
import { daysBetween, dayTitle, doseKey, effectiveMedicineStatus, fmtDate, todayIso } from './utils'

// "Chi tiết đơn dặn thuốc" (UC-02): the order summary, the photo grid (opens
// the viewer) and, per day, the dose schedule with the teacher's confirmation
// ("Đã được xác nhận bởi Giáo viên …"). Orders still "Đã gửi" get the cancel
// button with its confirmation popup. The parent cannot change the student
// here, so there is no "Đổi" button.
export function MedicineDetailScreen({
  student,
  order,
  onBack,
  onCancel,
  onToast,
}: {
  student: Student
  order: MedicineOrder
  onBack: () => void
  onCancel: () => void
  onToast: (message: string) => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [viewing, setViewing] = useState<number | null>(null)

  const status = effectiveMedicineStatus(order)
  // Today and past days first (newest first), upcoming days after them in
  // date order. Today (or the latest day before it) starts expanded.
  const today = todayIso()
  const all = daysBetween(order.from, order.to)
  const days = [...all.filter((d) => d <= today).reverse(), ...all.filter((d) => d > today)]
  const [open, setOpen] = useState<Set<string>>(() => new Set(days.slice(0, 1)))
  const toggle = (d: string) =>
    setOpen((prev) => {
      const n = new Set(prev)
      n.has(d) ? n.delete(d) : n.add(d)
      return n
    })

  return (
    <div className="screen med-detail">
      <TopBar title="Chi tiết đơn dặn thuốc" onBack={onBack} />
      <StudentHeader student={student} />

      <section className="md-card">
        <div className="md-head">
          <h3>Đơn dặn thuốc</h3>
          <StatusChip status={status} />
        </div>
        <div className="md-row">
          <span>Từ ngày</span>
          <b>{fmtDate(order.from)}</b>
        </div>
        <div className="md-row">
          <span>Đến ngày</span>
          <b>{fmtDate(order.to)}</b>
        </div>
        <div className="md-label">
          <MessageSquareText size={18} /> Nội dung lời nhắn
        </div>
        <p className="md-text">{order.note}</p>
      </section>

      {order.photos.length > 0 && (
        <section className="md-card">
          <h3>Ảnh đính kèm</h3>
          <div className="md-photos">
            {order.photos.map((src, i) => (
              <button key={src + i} onClick={() => setViewing(i)}>
                <img src={src} alt={`Ảnh ${i + 1}`} />
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="md-card">
        <h3>Giờ uống thuốc</h3>
        {days.map((d) => {
          const isOpen = open.has(d)
          return (
            <div className="md-day" key={d}>
              <button className="md-day-head" onClick={() => toggle(d)} aria-expanded={isOpen}>
                <b>{dayTitle(d)}</b>
                <span className="md-chevron">{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
              </button>
              {isOpen && (
                <div className="md-doses">
                  {order.doses.map((dose, i) => {
                    const c = order.confirmations?.[doseKey(d, i)]
                    return (
                      <div className="md-dose" key={i}>
                        <div className="md-dose-time">
                          <span className={`md-check ${c ? 'on' : ''}`}>{c && <Check size={16} strokeWidth={3} />}</span>
                          <span>{dose.time}</span>
                        </div>
                        <div className="md-dose-body">
                          <div className={`md-note ${dose.note ? '' : 'empty'}`}>
                            <NotepadText size={20} />
                            <span>{dose.note || 'Không có ghi chú'}</span>
                          </div>
                          {c && (
                            <div className="md-confirm">
                              Đã được xác nhận bởi Giáo viên {c.by} lúc {c.at.slice(11, 16)} {fmtDate(c.at.slice(0, 10))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </section>

      {status === 'sent' && (
        <div className="cta-bar sticky">
          <button className="btn btn-danger" onClick={() => setConfirming(true)}>
            Hủy đơn dặn thuốc
          </button>
        </div>
      )}

      {viewing !== null && (
        <PhotoViewer photos={order.photos} startIndex={viewing} onClose={() => setViewing(null)} onToast={onToast} />
      )}

      {confirming && (
        <OverlayPortal>
          <div className="scrim" />
          <div className="dialog-wrap">
            <div className="dialog-card">
              <div className="d-title">Hủy đơn dặn thuốc</div>
              <div className="d-sub">Bạn có chắc chắn muốn hủy đơn dặn thuốc này không?</div>
              <div className="btn-row">
                <button className="btn btn-outline" onClick={() => setConfirming(false)}>
                  Đóng
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setConfirming(false)
                    onCancel()
                  }}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </OverlayPortal>
      )}
    </div>
  )
}
