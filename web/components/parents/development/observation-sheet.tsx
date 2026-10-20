'use client'

import { useState } from 'react'
import { MilestoneItem } from '@/lib/development-data'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

interface ObservationSheetProps {
  milestone: MilestoneItem
  childName: string
  onClose: () => void
  onSubmitSuccess: (milestoneId: string, note: string) => void
}

export function MilestoneObservationSheet({
  milestone,
  childName,
  onClose,
  onSubmitSuccess,
}: ObservationSheetProps) {
  const [achievedDate, setAchievedDate] = useState('2026-10-05')
  const [parentNote, setParentNote] = useState('')
  const [consentConfirmed, setConsentConfirmed] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleAddSamplePhoto = () => {
    if (uploadedPhotos.length < 3) {
      setUploadedPhotos([...uploadedPhotos, `📷 Ảnh minh chứng ${uploadedPhotos.length + 1}.jpg`])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!consentConfirmed) {
      setShowError(true)
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      onSubmitSuccess(milestone.id, parentNote)
      onClose()
    }, 400)
  }

  return (
    <OverlayPortal>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" style={{ maxHeight: '88vh', overflowY: 'auto' }}>
        <div className="sheet-head">
          <span className="t">Ghi nhận mốc tại nhà</span>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '0 16px 24px' }}>
          {/* Milestone Header Summary */}
          <div
            style={{
              background: '#F0F9FF',
              border: '1px solid #BAE6FD',
              borderRadius: '10px',
              padding: '10px 12px',
              marginBottom: '14px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#0369A1', fontWeight: '600', textTransform: 'uppercase' }}>
              Mốc kỹ năng cần ghi nhận
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0C4A6E', marginTop: '2px' }}>
              {milestone.title}
            </div>
            <div style={{ fontSize: '12px', color: '#0284C7', marginTop: '2px' }}>
              Bé: <strong>{childName}</strong>
            </div>
          </div>

          {/* Date Picker */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
              Ngày bé làm được <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="date"
              max="2026-10-05"
              value={achievedDate}
              onChange={(e) => setAchievedDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>

          {/* Parent Notes */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
              Ghi chú của ba mẹ
            </label>
            <textarea
              rows={3}
              placeholder="Ví dụ: Bé hào hứng tự làm được khi mẹ hướng dẫn chơi vào buổi tối..."
              value={parentNote}
              onChange={(e) => setParentNote(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '13px',
                lineHeight: 1.5,
                boxSizing: 'border-box',
                resize: 'none',
              }}
            />
          </div>

          {/* Photos/Videos */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
              Hình ảnh / Video minh chứng (Tối đa 3 mục)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {uploadedPhotos.map((photo, i) => (
                <div
                  key={i}
                  style={{
                    background: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '11.5px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{photo}</span>
                  <button
                    type="button"
                    onClick={() => setUploadedPhotos(uploadedPhotos.filter((_, idx) => idx !== i))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '14px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {uploadedPhotos.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddSamplePhoto}
                  style={{
                    padding: '8px 12px',
                    border: '1px dashed #9CA3AF',
                    borderRadius: '8px',
                    background: '#F9FAFB',
                    fontSize: '12px',
                    color: '#4B5563',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>+ Đính kèm ảnh</span>
                </button>
              )}
            </div>
          </div>

          {/* MANDATORY STATUTORY CONSENT GATE (Nghị định 13/2023/NĐ-CP & Luật Trẻ em 2016) */}
          <div
            style={{
              background: consentConfirmed ? '#F0FDF4' : '#FFFBEB',
              border: `1px solid ${consentConfirmed ? '#BBF7D0' : showError ? '#F87171' : '#FCD34D'}`,
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '18px',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={consentConfirmed}
                onChange={(e) => {
                  setConsentConfirmed(e.target.checked)
                  if (e.target.checked) setShowError(false)
                }}
                style={{ marginTop: '2px', width: '17px', height: '17px', accentColor: '#16A34A', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>
                <strong>Xác nhận đồng thuận bảo vệ dữ liệu trẻ em (Nghị định 13/2023/NĐ-CP):</strong> Tôi là cha/mẹ/người giám hộ hợp pháp của bé, tôi đồng ý tải lên thông tin và hình ảnh này để phục vụ theo dõi giáo dục nội bộ giữa gia đình và nhà trường.
              </span>
            </label>
            {showError && !consentConfirmed && (
              <div style={{ color: '#DC2626', fontSize: '11px', marginTop: '6px', fontWeight: '600' }}>
                ⚠️ Bạn vui lòng tích chọn xác nhận đồng thuận theo quy định trước khi gửi.
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px',
              background: consentConfirmed ? '#16A34A' : '#9CA3AF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: consentConfirmed ? 'pointer' : 'not-allowed',
              boxShadow: consentConfirmed ? '0 2px 6px rgba(22, 163, 74, 0.3)' : 'none',
            }}
          >
            {submitting ? 'Đang gửi...' : 'Gửi cho Giáo viên xác nhận'}
          </button>
        </form>
      </div>
    </OverlayPortal>
  )
}
