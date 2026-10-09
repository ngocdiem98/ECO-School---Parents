'use client'

import { TopBar } from '@/components/parents/shared/header'
import { AMOUNT_PRESETS, type Student } from '@/lib/mock-data'

// Mirrors SCREENS['topup-amount']. The "Kích hoạt nạp điểm tự động" row is
// static/inert — no reference screenshot for that sub-flow (see prd.md).
export function AmountScreen({
  student,
  amount,
  showCustom,
  onSelectPreset,
  onCustomAmountChange,
  onShowCustom,
  onConfirm,
  onBack,
}: {
  student: Student
  amount: number
  showCustom: boolean
  onSelectPreset: (value: number) => void
  onCustomAmountChange: (value: number) => void
  onShowCustom: () => void
  onConfirm: () => void
  onBack: () => void
}) {
  return (
    <div className="screen">
      <TopBar title="Thông tin nạp điểm" onBack={onBack} />
      <div className="card text-center">
        <div style={{ fontSize: 30, marginBottom: 6 }}>◈</div>
        <div className="card-title" style={{ textAlign: 'center' }}>
          Nạp điểm thẻ học sinh
        </div>
        <div className="divider" />
        <div className="feedback-row" style={{ textAlign: 'left' }}>
          <span className="text-muted">Thông tin học sinh</span>
        </div>
        <div className="feedback-row" style={{ textAlign: 'left' }}>
          <span>{student.name}</span>
        </div>
        <div className="feedback-row" style={{ textAlign: 'left' }}>
          <span className="text-muted">{student.code}</span>
        </div>
      </div>
      <div className="section-heading">Số điểm nạp</div>
      <div className="amount-grid">
        {AMOUNT_PRESETS.map((v) => (
          <button
            key={v}
            className={`amount-opt ${!showCustom && amount === v ? 'active' : ''}`}
            onClick={() => onSelectPreset(v)}
          >
            {v.toLocaleString('vi-VN')}
          </button>
        ))}
      </div>
      <div className="text-center" style={{ marginTop: 10 }}>
        <button className="btn-link" onClick={onShowCustom}>
          Nhập số điểm khác ✎
        </button>
      </div>
      {showCustom && (
        <div className="field">
          <input
            type="number"
            className="input-box"
            placeholder="Nhập số điểm"
            value={amount}
            onChange={(e) => onCustomAmountChange(Number(e.target.value) || 0)}
          />
        </div>
      )}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 0 }}>
          Tiện ích
        </div>
        <div className="feedback-row" style={{ cursor: 'pointer' }}>
          <span>Kích hoạt nạp điểm tự động</span>
          <span>›</span>
        </div>
      </div>
      <div className="total-bar">
        <div>
          <div className="total-label">Tổng điểm</div>
          <div className="total-value">{amount.toLocaleString('vi-VN')}</div>
        </div>
        <button className="btn btn-primary" onClick={onConfirm}>
          Xác nhận
        </button>
      </div>
    </div>
  )
}
