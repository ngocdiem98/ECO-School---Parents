'use client'

import { useState } from 'react'
import { CodeSheet } from './code-sheet'

interface LinkStudentAppProps {
  onBack: () => void
}

// Mirrors SCREENS['link-intro']. "Quét mã QR" and "Cấp lại thẻ" are
// static/inert — no reference screenshots for those sub-flows (prd.md).
export function LinkStudentApp({ onBack }: LinkStudentAppProps) {
  const [showCodeSheet, setShowCodeSheet] = useState(false)

  return (
    <div className="screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
          ‹
        </button>
        <span className="icon-btn-ghost" />
        <span className="icon-btn-ghost" />
      </div>
      <div className="brand-hero" style={{ marginTop: 0 }}>
        <h1>THẺ HỌC SINH THÔNG MINH</h1>
        <p>Bước tiến mới trong chuyển đổi số giáo dục</p>
      </div>
      <div className="card">
        <div className="card-title">Quét hoặc nhập thông tin học sinh để liên kết</div>
        <div className="feedback-row" style={{ textAlign: 'left' }}>
          <span>① Bước 1: Nhập mã học sinh và mã bảo vệ hoặc quét mã QR trên thẻ học sinh.</span>
        </div>
        <div className="feedback-row" style={{ textAlign: 'left' }}>
          <span>② Bước 2: Kiểm tra thông tin học sinh.</span>
        </div>
        <div className="feedback-row" style={{ textAlign: 'left' }}>
          <span>③ Bước 3: Nhấn &quot;Xác nhận&quot; để hoàn tất.</span>
        </div>
      </div>
      <div className="push-bottom">
        <div className="cta-bar">
          <div className="btn-row" style={{ flexDirection: 'column' }}>
            <button className="btn btn-primary">Quét mã QR</button>
            <button className="btn btn-outline" style={{ marginTop: 10 }} onClick={() => setShowCodeSheet(true)}>
              Nhập thông tin
            </button>
          </div>
        </div>
        <div className="text-center" style={{ marginTop: 6, paddingBottom: 16 }}>
          <span className="text-muted" style={{ fontSize: 12.5 }}>
            Bạn làm hỏng, mất thẻ,{' '}
          </span>
          <button className="btn-link">Cấp lại thẻ</button>
        </div>
      </div>

      {showCodeSheet && <CodeSheet onClose={() => setShowCodeSheet(false)} />}
    </div>
  )
}
