'use client'

import { fmtMoney, type Student } from '@/lib/mock-data'

// Mirrors SCREENS['topup-result']. No back chevron here — the vanilla
// screen's topbar is title-only, centered. "Chia sẻ", the auto-topup
// banner's CTA, and the 3 promo cards are static/inert (no reference
// screenshots for those sub-flows).
export function ResultScreen({
  student,
  amount,
  txId,
  timeStr,
  onGoHome,
  onNewTransaction,
}: {
  student: Student
  amount: number
  txId: string
  timeStr: string
  onGoHome: () => void
  onNewTransaction: () => void
}) {
  return (
    <div className="screen">
      <div className="topbar" style={{ justifyContent: 'center' }}>
        <div className="topbar-title" style={{ paddingRight: 0 }}>
          Kết quả giao dịch
        </div>
      </div>
      <div className="card text-center">
        <div className="result-hero" style={{ paddingTop: 8 }}>
          <div className="result-check">✓</div>
          <div className="text-muted" style={{ fontWeight: 700 }}>
            Giao dịch thành công
          </div>
          <div className="result-amount">{fmtMoney(amount)}</div>
          <span className="badge badge--outline">Nạp điểm thẻ học sinh</span>
        </div>
        <div className="divider" />
        <div className="feedback-row">
          <span className="text-muted">Mã giao dịch</span>
          <span>{txId} ›</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">Thời gian giao dịch</span>
          <span>{timeStr}</span>
        </div>
        <div className="feedback-row" style={{ textAlign: 'left' }}>
          <span className="text-muted">Thông tin dịch vụ</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">Mã học sinh</span>
          <span>{student.code}</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">Tên học sinh</span>
          <span>{student.name}</span>
        </div>
        <button className="btn-link" style={{ marginTop: 8 }}>
          Chia sẻ ⇪
        </button>
      </div>
      <div className="banner-note">
        <span style={{ flex: 1 }}>
          Kích hoạt nạp tiền học sinh tự động — Không lo gián đoạn sinh hoạt trường
        </span>
        <button className="btn-mini">Kích hoạt ngay</button>
      </div>
      <div className="section-heading">Đừng bỏ lỡ</div>
      <div className="promo-row">
        <div className="promo-card">
          <div className="p-title">Điện thoại trả sau</div>
          <div className="p-price">An toàn bảo mật tối đa</div>
        </div>
        <div className="promo-card">
          <div className="p-title">Bảo hiểm xe máy</div>
          <div className="p-price">66,000đ</div>
        </div>
        <div className="promo-card">
          <div className="p-title">Bảo hiểm ô tô</div>
          <div className="p-price">480,700đ</div>
        </div>
      </div>
      <div className="cta-bar sticky btn-row">
        <button className="btn btn-outline" onClick={onGoHome}>
          Trang chủ
        </button>
        <button className="btn btn-primary" onClick={onNewTransaction}>
          Giao dịch mới
        </button>
      </div>
    </div>
  )
}
