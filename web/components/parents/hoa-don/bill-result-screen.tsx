'use client'

import { useState } from 'react'
import { Chevron } from './bill-ds'
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
    <div className="screen bill-ds bill-result">
      {/* NavBar (title only, no back) */}
      <header className="eco-navbar eco-navbar--white bill-result-nav">
        <div className="eco-navbar__side" />
        <div className="eco-navbar__title">Kết quả giao dịch</div>
        <div className="eco-navbar__side eco-navbar__side--right" />
      </header>

      <div className="bill-result-body">
        {/* TransactionSummary (success) */}
        <div className="eco-txn eco-txn--success">
          <img src="/ds/payment/result-watermark.svg" alt="" className="eco-txn__watermark" />
          <div className="eco-txn__status">
            <span className="eco-txn__statusicon eco-txn__statusicon--success">
              <img src="/ds/payment/status-success.svg" alt="" width={48} height={48} />
            </span>
            <strong className="eco-txn__statuslabel--success" style={{ font: 'var(--text-body-m)', fontWeight: 700 }}>
              Giao dịch thành công
            </strong>
          </div>
          <strong className="eco-txn__amount" style={{ font: 'var(--text-amount)' }}>
            {fmtMoney(result.amount)}
          </strong>
          <span className="eco-txn__chip bill-ds-row-text">Thanh toán học phí</span>

          <div className="eco-txn__body">
            <div className="eco-dashdiv" />
            <div className="eco-drow">
              <span className="eco-drow__label bill-ds-row-text">Mã giao dịch</span>
              <span className="eco-drow__value eco-drow__value--link bill-ds-row-text">{result.txId} ›</span>
            </div>
            <div className="eco-drow">
              <span className="eco-drow__label bill-ds-row-text">Thời gian giao dịch</span>
              <span className="eco-drow__value bill-ds-row-text">{result.timeStr}</span>
            </div>
            <div className="eco-dashdiv" />
            <div className="eco-drow">
              <span className="eco-drow__label bill-ds-row-text">Thông tin dịch vụ</span>
              <span className="eco-drow__value" />
            </div>
            <div className="eco-drow">
              <span className="eco-drow__label bill-ds-row-text">Nhà cung cấp</span>
              <span className="eco-drow__value bill-ds-row-text">ECO School</span>
            </div>
            <div className="eco-drow">
              <span className="eco-drow__label bill-ds-row-text">Mã học sinh</span>
              <span className="eco-drow__value bill-ds-row-text">{student.code}</span>
            </div>
            <div className="eco-drow">
              <span className="eco-drow__label bill-ds-row-text">Tên học sinh</span>
              <span className="eco-drow__value bill-ds-row-text">{student.name}</span>
            </div>
            <div className="eco-drow" onClick={() => setOpen((v) => !v)} style={{ cursor: 'pointer' }}>
              <span className="eco-drow__label bill-ds-row-text">Kỳ thanh toán</span>
              <span className="eco-drow__value bill-ds-row-text">{periodLabel}</span>
              <button type="button" className="eco-drow__chev" aria-expanded={open} aria-label="Chi tiết">
                <Chevron open={open} />
              </button>
            </div>
            {open &&
              groups.map((g) => (
                <div key={g.bill.id}>
                  {groups.length > 1 && (
                    <div className="eco-drow">
                      <span className="eco-drow__label bill-ds-row-text">{g.bill.label}</span>
                      <span className="eco-drow__value bill-ds-row-text">{fmtMoney(sumItems(g.items))}</span>
                    </div>
                  )}
                  {g.items.map((it) => (
                    <div className="eco-drow eco-drow--sub" key={it.id}>
                      <span className="eco-drow__label bill-ds-xs">{it.name}</span>
                      <span className="eco-drow__value bill-ds-xs">{fmtMoney(it.amount)}</span>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          <div className="eco-txn__share">
            <button type="button" style={{ font: 'var(--text-body-s)', fontWeight: 500 }}>
              <img src="/ds/payment/share.svg" alt="" width={18} height={18} />
              <span>Chia sẻ</span>
            </button>
          </div>
          <div className="eco-txn__edge" />
        </div>

        {/* OfferTile: "Đừng bỏ lỡ" (inert) */}
        <section>
          <h4 className="bill-ds-heading bill-offer-title">Đừng bỏ lỡ</h4>
          <div className="eco-hscroll no-scrollbar bill-offers">
            <div className="eco-offer">
              <div className="eco-offer__icon" style={{ background: '#E5F3FF' }}>
                <img src="/ds/payment/service-electric.svg" alt="" width={32} height={32} />
              </div>
              <div className="eco-offer__title bill-ds-xs" style={{ fontWeight: 500 }}>Nạp tiền điện thoại</div>
              <div className="eco-offer__price bill-ds-row-text" style={{ fontWeight: 700 }}>50,000đ</div>
              <div className="eco-offer__btn">
                <button type="button" className="eco-btn eco-btn--brand eco-btn--xs eco-btn--full">Mua ngay</button>
              </div>
            </div>
            <div className="eco-offer">
              <div className="eco-offer__icon" style={{ background: '#FFF5EB' }}>
                <img src="/ds/payment/service-tuition.svg" alt="" width={32} height={32} />
              </div>
              <div className="eco-offer__title bill-ds-xs" style={{ fontWeight: 500 }}>Hóa đơn tiền điện</div>
              <div className="eco-offer__caption bill-ds-xs">An toàn bảo mật tối đa</div>
              <div className="eco-offer__btn">
                <button type="button" className="eco-btn eco-btn--brand eco-btn--xs eco-btn--full">Xem ngay</button>
              </div>
            </div>
            <div className="eco-offer">
              <div className="eco-offer__icon" style={{ background: '#F0F8FF' }}>
                <img src="/ds/payment/service-tuition.svg" alt="" width={32} height={32} />
              </div>
              <div className="eco-offer__title bill-ds-xs" style={{ fontWeight: 500 }}>Hóa đơn truyền hình</div>
              <div className="eco-offer__caption bill-ds-xs">An toàn bảo mật tối đa</div>
              <div className="eco-offer__btn">
                <button type="button" className="eco-btn eco-btn--brand eco-btn--xs eco-btn--full">Xem ngay</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ActionFooter (two buttons) */}
      <footer className="eco-actionfooter bill-footer">
        <div className="eco-actionfooter__bar eco-actionfooter__bar--dual">
          <button type="button" className="eco-btn eco-btn--secondary eco-btn--lg" onClick={onGoHome}>
            Trang chủ
          </button>
          <button type="button" className="eco-btn eco-btn--brand eco-btn--lg" onClick={onNewTransaction}>
            Giao dịch mới
          </button>
        </div>
        <div className="eco-actionfooter__safe" />
      </footer>
    </div>
  )
}
