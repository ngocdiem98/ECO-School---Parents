'use client'

import { TopBar } from '@/components/parents/shared/header'
import { fmtMoney, type Student } from '@/lib/mock-data'

// Mirrors SCREENS['topup-confirm']. "Ưu đãi ECO Me", "Xem thêm", and the
// "Ví ECO" row's "Nạp tiền" button are static/inert — no reference
// screenshot for those sub-flows. Techcombank is the only real payment
// method in the reference screens, so it's the only selectable option.
export function ConfirmScreen({
  student,
  amount,
  onBack,
  onContinue,
}: {
  student: Student
  amount: number
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <div className="screen">
      <TopBar title="Xác nhận giao dịch" onBack={onBack} />
      <div className="result-hero">
        <div style={{ fontSize: 26 }}>◈</div>
        <div className="total-label">Tổng thanh toán</div>
        <div className="result-amount">{fmtMoney(amount)}</div>
        <span className="badge badge--outline">Nạp điểm thẻ học sinh</span>
      </div>
      <div className="card">
        <div className="feedback-row">
          <span className="text-muted">Mã học sinh</span>
          <span>{student.code}</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">Tên học sinh</span>
          <span>{student.name}</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">Số tiền</span>
          <span>{fmtMoney(amount)}</span>
        </div>
      </div>
      <div
        className="card"
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span>Ưu đãi ECO Me</span>
        <span className="btn-link">Chọn ưu đãi</span>
      </div>
      <div
        className="section-heading"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span>Chọn phương thức thanh toán</span>
        <button className="btn-link">Xem thêm</button>
      </div>
      <div className="pick-row">
        <div>
          <div className="student-name">Ví ECO</div>
          <div className="meta text-muted" style={{ fontSize: 12 }}>
            Số dư ví không đủ
          </div>
        </div>
        <button
          className="btn-mini"
          style={{
            border: 'none',
            background: 'var(--c-black)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 999,
            fontSize: 11.5,
            fontWeight: 700,
          }}
        >
          Nạp tiền
        </button>
      </div>
      <div className="pick-row selected">
        <div>
          <div className="student-name">Techcombank •••• 2939</div>
        </div>
        <span className="checkbox checked" style={{ borderRadius: '50%' }}>
          ✓
        </span>
      </div>
      <div className="cta-bar sticky">
        <button className="btn btn-primary" onClick={onContinue}>
          Tiếp tục
        </button>
      </div>
    </div>
  )
}
