'use client'

import { useState } from 'react'
import type { AbsenceRequest, AbsenceStatus, Student } from '@/lib/mock-data'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

interface AbsenceDetailScreenProps {
  student: Student
  absence: AbsenceRequest
  onBack: (returnFilter?: 'all' | AbsenceStatus) => void
  onCancelAbsence: (absenceId: string) => void
}

export function AbsenceDetailScreen({
  student,
  absence,
  onBack,
  onCancelAbsence,
}: AbsenceDetailScreenProps) {
  const [showConfirmCancel, setShowConfirmCancel] = useState(false)
  const [showCancelSuccess, setShowCancelSuccess] = useState(false)
  const [wasJustCancelled, setWasJustCancelled] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const isPending = absence.status === 'pending'
  const isApproved = absence.status === 'approved'
  const isCancelled = absence.status === 'cancelled'

  const fromDate = absence.fromDate || absence.range.split(' - ')[0] || '13/10/2026'
  const toDate = absence.toDate || absence.range.split(' - ')[1] || fromDate
  const createdDate =
    absence.createdAt ||
    (isApproved ? '05/06/2026' : isCancelled ? '04/06/2026' : '12/10/2026')

  // Attached images for approved request, cancelled request, or if explicitly provided
  const attachedImages =
    absence.attachedImages && absence.attachedImages.length > 0
      ? absence.attachedImages
      : isApproved
      ? [
          '/absence/attached-photo-1.png',
          '/absence/attached-photo-2.png',
          '/absence/attached-photo-3.png',
        ]
      : isCancelled && absence.id === 'ab-cancelled-1'
      ? [
          '/absence/cancelled-photo-1.png',
          '/absence/cancelled-photo-2.png',
          '/absence/cancelled-photo-3.png',
        ]
      : []

  const handleConfirmCancel = () => {
    setShowConfirmCancel(false)
    onCancelAbsence(absence.id)
    setWasJustCancelled(true)
    setShowCancelSuccess(true)
  }

  const handleBack = () => {
    if (wasJustCancelled) {
      onBack('cancelled')
    } else {
      onBack()
    }
  }

  return (
    <div className="absence-screen-root">
      {/* Top Header Bar */}
      <div className="topbar absence-topbar">
        <button className="icon-btn" onClick={handleBack} aria-label="Quay lại">
          ‹
        </button>
        <div className="topbar-title">Chi tiết đơn báo vắng</div>
        <span className="icon-btn-ghost" />
      </div>

      {/* Status Header Block */}
      <div className="absence-detail-status-header">
        <div className="absence-detail-status-row">
          <span className="absence-detail-status-label">Trạng thái đơn</span>
          {isPending && (
            <span className="absence-status-text-pending">Chờ duyệt</span>
          )}
          {isApproved && (
            <span className="absence-status-pill-approved">Đã duyệt</span>
          )}
          {isCancelled && (
            <span className="absence-status-pill-cancelled">Đã huỷ</span>
          )}
        </div>

        {/* Pending Alert Banner (Bao vang 2.2) */}
        {isPending && (
          <div className="absence-pending-alert-banner">
            <span className="absence-pending-alert-icon">!</span>
            <span className="absence-pending-alert-text">
              Đơn xin báo vắng của học sinh đang chờ được duyệt.
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="absence-detail-scrollable">
        {/* Document Card: ĐƠN XIN PHÉP NGHỈ HỌC */}
        <div className="absence-doc-card">
          <h2 className="absence-doc-main-title">ĐƠN XIN PHÉP NGHỈ HỌC</h2>

          <div className="absence-doc-letter-meta">
            <p className="absence-doc-meta-line">Hôm nay, ngày {createdDate},</p>
            <p className="absence-doc-meta-line">
              <strong>Kính gửi:</strong> Ban Giám hiệu nhà trường và Giáo viên
            </p>
            <p className="absence-doc-meta-line">
              <strong>Tôi là phụ huynh em:</strong> {student.name}
            </p>
            <p className="absence-doc-meta-line">
              <strong>Lớp:</strong> {student.className} - Trường {student.school}
            </p>
            <p className="absence-doc-meta-line">
              Gia đình xin phép cho học sinh được nghỉ học:
            </p>
          </div>

          <div className="absence-doc-divider-line" />

          <h3 className="absence-doc-section-heading">Nội dung xin nghỉ</h3>

          <div className="absence-doc-info-list">
            <div className="absence-doc-kv-row">
              <span className="doc-kv-label">Từ ngày</span>
              <span className="doc-kv-val">{fromDate}</span>
            </div>
            <div className="absence-doc-kv-row">
              <span className="doc-kv-label">Đến ngày</span>
              <span className="doc-kv-val">{toDate}</span>
            </div>
            <div className="absence-doc-kv-row">
              <span className="doc-kv-label">Thời gian nghỉ</span>
              <span className="doc-kv-val">{absence.time}</span>
            </div>
            <div className="absence-doc-kv-row">
              <span className="doc-kv-label">Số ngày nghỉ</span>
              <span className="doc-kv-val">{absence.days} ngày</span>
            </div>
            <div className="absence-doc-reason-block">
              <div className="doc-reason-label-row">
                <span className="doc-reason-icon">💬</span>
                <span className="doc-reason-label">Lý do xin nghỉ</span>
              </div>
              <div className="doc-reason-text">{absence.note || 'Con xin nghỉ phép'}</div>
            </div>
          </div>
        </div>

        {/* Attached Photos Card (Bao vang 3.2 - Đã duyệt) */}
        {attachedImages.length > 0 && (
          <div className="absence-attached-card">
            <h3 className="absence-attached-card-title">Ảnh đính kèm</h3>
            <div className="absence-attached-photos-grid">
              {attachedImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="absence-photo-thumb-frame"
                  onClick={() => setSelectedPhoto(imgSrc)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Xem ảnh đính kèm ${idx + 1}`}
                >
                  <img
                    src={imgSrc}
                    alt={`Ảnh đính kèm ${idx + 1}`}
                    className="absence-photo-thumb-img"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky CTA Button: Huỷ đơn báo vắng (Bao vang 2.2) */}
      {isPending && (
        <div className="absence-sticky-bottom-bar">
          <button
            type="button"
            className="absence-btn-primary-yellow"
            onClick={() => setShowConfirmCancel(true)}
          >
            Huỷ đơn báo vắng
          </button>
        </div>
      )}

      {/* Modal 1: Xác nhận huỷ đơn */}
      {showConfirmCancel && (
        <OverlayPortal>
          <div className="scrim" onClick={() => setShowConfirmCancel(false)} />
          <div className="eco-notice-dialog medicine-confirm-dialog">
            <h3 className="medicine-dialog-title">Xác nhận huỷ đơn</h3>
            <p className="medicine-dialog-desc">
              Bạn có chắc chắn muốn huỷ đơn xin nghỉ ngày <strong>{absence.range}</strong> này không?
            </p>
            <div className="medicine-dialog-btn-row">
              <button
                type="button"
                className="medicine-dialog-btn-close"
                onClick={() => setShowConfirmCancel(false)}
              >
                Đóng
              </button>
              <button
                type="button"
                className="medicine-dialog-btn-confirm"
                onClick={handleConfirmCancel}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </OverlayPortal>
      )}

      {/* Modal 2: Đã huỷ đơn */}
      {showCancelSuccess && (
        <OverlayPortal>
          <div className="scrim" onClick={() => setShowCancelSuccess(false)} />
          <div className="eco-notice-dialog medicine-confirm-dialog">
            <h3 className="medicine-dialog-title">Đã huỷ đơn</h3>
            <p className="medicine-dialog-desc">
              Đơn báo vắng của bạn đã được huỷ.
            </p>
            <button
              type="button"
              className="medicine-dialog-btn-full"
              onClick={() => setShowCancelSuccess(false)}
            >
              Đã hiểu
            </button>
          </div>
        </OverlayPortal>
      )}

      {/* Full-size Photo Preview Modal */}
      {selectedPhoto && (
        <OverlayPortal>
          <div className="scrim" onClick={() => setSelectedPhoto(null)} />
          <div className="absence-photo-modal-wrap" onClick={() => setSelectedPhoto(null)}>
            <div className="absence-photo-modal-card" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="absence-photo-modal-close"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Đóng xem ảnh"
              >
                ✕
              </button>
              <img
                src={selectedPhoto}
                alt="Ảnh đính kèm kích thước lớn"
                className="absence-photo-modal-img"
              />
            </div>
          </div>
        </OverlayPortal>
      )}
    </div>
  )
}
