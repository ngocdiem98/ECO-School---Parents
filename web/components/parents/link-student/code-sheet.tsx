'use client'

import { useState } from 'react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

export function CodeSheet({
  initialStudentCode = '',
  onClose,
}: {
  initialStudentCode?: string
  onClose: () => void
}) {
  const [studentCode, setStudentCode] = useState(initialStudentCode)
  const [guardCode, setGuardCode] = useState('')
  const canConfirm = Boolean(studentCode.trim() && guardCode.trim())

  return (
    <OverlayPortal>
      <div className="eco-sheet-root" style={{ zIndex: 100 }}>
        <div className="eco-sheet-scrim" onClick={onClose} />
        <div
          className="eco-sheet"
          style={{ height: 'auto', maxHeight: '78%' }}
          role="dialog"
          aria-label="Kích hoạt liên kết học sinh"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="eco-sheet__grabber" />
          <div className="eco-sheet__head">
            <h3>Kích hoạt liên kết học sinh</h3>
            <button
              type="button"
              className="eco-iconbtn eco-iconbtn--md eco-iconbtn--ghost"
              onClick={onClose}
              aria-label="Đóng"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="eco-sheet__body eco-vscroll">
            <p
              style={{
                font: 'var(--text-body-s)',
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              Vui lòng liên hệ Hotline <b>1900 9005</b> để được hỗ trợ cung cấp mã bảo vệ
            </p>

            {/* ECO.FloatingInput: Mã học sinh */}
            <div className={`eco-finput${studentCode ? ' is-filled' : ''}`}>
              <label className="eco-finput__box">
                {studentCode ? (
                  <span className="eco-finput__label" style={{ font: 'var(--text-body-xs)' }}>
                    Mã học sinh
                  </span>
                ) : null}
                <input
                  type="text"
                  className="eco-finput__input"
                  style={{ font: 'var(--text-body-m)' }}
                  placeholder={studentCode ? '' : 'Mã học sinh'}
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                />
              </label>
            </div>

            {/* ECO.FloatingInput: Mã bảo vệ */}
            <div className={`eco-finput${guardCode ? ' is-filled' : ''}`}>
              <label className="eco-finput__box">
                {guardCode ? (
                  <span className="eco-finput__label" style={{ font: 'var(--text-body-xs)' }}>
                    Mã bảo vệ
                  </span>
                ) : null}
                <input
                  type="text"
                  className="eco-finput__input"
                  style={{ font: 'var(--text-body-m)' }}
                  placeholder={guardCode ? '' : 'Mã bảo vệ'}
                  value={guardCode}
                  onChange={(e) => setGuardCode(e.target.value)}
                />
              </label>
            </div>

            <div style={{ marginTop: 'var(--space-8, 8px)' }}>
              <button
                type="button"
                className="eco-btn eco-btn--brand eco-btn--lg eco-btn--full"
                disabled={!canConfirm}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
