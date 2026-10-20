'use client'

import { useState } from 'react'
import { MOCK_TEACHER_REPORT, STATUTORY_DOMAINS } from '@/lib/development-data'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

interface TeacherReportSheetProps {
  childName: string
  onClose: () => void
}

export function TeacherReportSheet({ childName, onClose }: TeacherReportSheetProps) {
  const [acknowledged, setAcknowledged] = useState(MOCK_TEACHER_REPORT.viewed)

  return (
    <OverlayPortal>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" style={{ maxHeight: '88vh', overflowY: 'auto' }}>
        <div className="sheet-head">
          <span className="t">Đánh giá của Giáo viên chủ nhiệm</span>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <div style={{ padding: '0 16px 24px' }}>
          {/* Header Banner */}
          <div
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#166534' }}>
                {MOCK_TEACHER_REPORT.term} · {MOCK_TEACHER_REPORT.academicYear}
              </span>
              <span style={{ fontSize: '11px', color: '#15803D' }}>{MOCK_TEACHER_REPORT.date}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px' }}>
              Người đánh giá: <strong>{MOCK_TEACHER_REPORT.teacherName}</strong>
            </div>
            <div style={{ fontSize: '11.5px', color: '#15803D', marginTop: '2px' }}>
              Học sinh: <strong>{childName}</strong> · Đã duyệt bởi Ban Giám Hiệu
            </div>
          </div>

          {/* General Teacher Comment */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' }}>
              Nhận xét tổng quát:
            </div>
            <p
              style={{
                fontSize: '13px',
                color: '#374151',
                lineHeight: 1.6,
                background: '#F9FAFB',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                margin: 0,
              }}
            >
              "{MOCK_TEACHER_REPORT.generalComment}"
            </p>
          </div>

          {/* Detailed 5-Domain Feedback */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#1F2937', marginBottom: '8px' }}>
              Chi tiết theo 5 Lĩnh vực phát triển chuẩn:
            </div>
            {MOCK_TEACHER_REPORT.domainFeedback.map((item) => {
              const domainMeta = STATUTORY_DOMAINS.find((d) => d.key === item.domain)
              return (
                <div
                  key={item.domain}
                  style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    marginBottom: '8px',
                    background: '#FFFFFF',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: '700', color: domainMeta?.color }}>
                      {domainMeta?.icon} {domainMeta?.labelVi}
                    </span>
                    <span
                      style={{
                        background: '#DCFCE7',
                        color: '#15803D',
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '10px',
                      }}
                    >
                      {item.progressBadge}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#4B5563', lineHeight: 1.5 }}>
                    {item.evaluation}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Read receipt acknowledgment */}
          <button
            onClick={() => {
              setAcknowledged(true)
              onClose()
            }}
            style={{
              width: '100%',
              padding: '12px',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {acknowledged ? 'Đã xem phiếu đánh giá ✓' : 'Xác nhận đã xem & gửi lời cảm ơn cô'}
          </button>
        </div>
      </div>
    </OverlayPortal>
  )
}
