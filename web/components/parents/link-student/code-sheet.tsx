'use client'

import { useState } from 'react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

// Mirrors SHEETS['link-code']. The "Xác nhận" CTA has no onClick once
// enabled — no reference screenshot exists for a link result screen (see
// prd.md, mục 12), same "left inert on purpose" treatment as the fee
// invoice confirm button.
export function CodeSheet({ onClose }: { onClose: () => void }) {
  const [studentCode, setStudentCode] = useState('')
  const [guardCode, setGuardCode] = useState('')
  const canConfirm = studentCode.trim() && guardCode.trim()

  return (
    <OverlayPortal>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-head">
          <span className="t">Kích hoạt liên kết học sinh</span>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        <div className="sheet-body">
          <div className="text-muted" style={{ fontSize: 12.5, margin: '0 16px 10px' }}>
            Vui lòng liên hệ Hotline <b>1900 9005</b> để được hỗ trợ cung cấp mã bảo vệ
          </div>
          <div className="field">
            <input
              type="text"
              className="input-box"
              placeholder="Mã học sinh"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
            />
          </div>
          <div className="field">
            <input
              type="text"
              className="input-box"
              placeholder="Mã bảo vệ"
              value={guardCode}
              onChange={(e) => setGuardCode(e.target.value)}
            />
          </div>
          <div className="cta-bar">
            <button className="btn btn-primary" disabled={!canConfirm}>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
