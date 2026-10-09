'use client'

import { useState } from 'react'
import { fmtMoney, sumItems, type Bill, type BillItem, type Student } from '@/lib/mock-data'

export interface BillPaymentResult {
  txId: string
  timeStr: string
  amount: number
  groups: { bill: Bill; items: BillItem[] }[]
}

// "Kết quả giao dịch" after paying bills. Same layout as topup's ResultScreen
// (title-only topbar, no back; "Chia sẻ" and the promo cards are inert), with
// "Kỳ thanh toán" expanding to the bills and items that were just paid.
export function BillResultScreen({
  student,
  result,
  onGoHome,
  onNewTransaction,
}: {
  student: Student
  result: BillPaymentResult
  onGoHome: () => void
  onNewTransaction: () => void
}) {
  const [open, setOpen] = useState(false)
  const { groups } = result
  const periodLabel = groups.length === 1 ? groups[0].bill.label : `${groups.length} hóa đơn`

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
          <div className="result-amount">{fmtMoney(result.amount)}</div>
          <span className="badge badge--outline">Thanh toán học phí</span>
        </div>
        <div className="divider" />
        <div className="feedback-row">
          <span className="text-muted">Mã giao dịch</span>
          <span>{result.txId} ›</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">Thời gian giao dịch</span>
          <span>{result.timeStr}</span>
        </div>
        <div className="divider" />
        <div className="feedback-row" style={{ textAlign: 'left', fontWeight: 700 }}>
          <span>Thông tin dịch vụ</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">Nhà cung cấp</span>
          <span>ECO School</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">Mã học sinh</span>
          <span>{student.code}</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">Tên học sinh</span>
          <span>{student.name}</span>
        </div>
        <button className="bill-result-period" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span className="text-muted">Kỳ thanh toán</span>
          <span>
            {periodLabel} {open ? '⌃' : '⌄'}
          </span>
        </button>
        {open && (
          <div className="bill-result-detail">
            {groups.map((g) => (
              <div key={g.bill.id}>
                {groups.length > 1 && (
                  <div className="bill-result-bill">
                    <span>{g.bill.label}</span>
                    <span>{fmtMoney(sumItems(g.items))}</span>
                  </div>
                )}
                {g.items.map((it) => (
                  <div className="bill-result-item" key={it.id}>
                    <span>{it.name}</span>
                    <span>{fmtMoney(it.amount)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        <div className="divider" />
        <button className="btn-link" style={{ marginTop: 4 }}>
          Chia sẻ ⇪
        </button>
      </div>

      <div className="section-heading">Đừng bỏ lỡ</div>
      <div className="promo-row">
        <div className="promo-card">
          <div className="p-title">Nạp tiền điện thoại</div>
          <div className="p-price">50,000đ</div>
        </div>
        <div className="promo-card">
          <div className="p-title">Hóa đơn tiền điện</div>
          <div className="p-price">An toàn bảo mật tối đa</div>
        </div>
        <div className="promo-card">
          <div className="p-title">Hóa đơn truyền hình</div>
          <div className="p-price">An toàn bảo mật tối đa</div>
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
