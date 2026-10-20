'use client'

import { useState } from 'react'
import { formatVND, type InvoiceItem } from '../invoice/invoice-data'
import { type FeeStudentMeta } from './fee-invoice-select-screen'

interface FeeInvoiceConfirmScreenProps {
  student: FeeStudentMeta
  selectedItems: InvoiceItem[]
  totalAmount: number
  periodLabel: string
  onBack: () => void
  onProceed: () => void
}

export function FeeInvoiceConfirmScreen({
  student,
  selectedItems,
  totalAmount,
  periodLabel,
  onBack,
  onProceed,
}: FeeInvoiceConfirmScreenProps) {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(true)
  const [selectedMethod, setSelectedMethod] = useState<'ecopay' | 'vcb' | 'paylater' | 'atm'>('ecopay')

  return (
    <div
      className="screen"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        background: 'var(--bg-canvas)',
        paddingBottom: 0,
      }}
    >
      {/* ECO.NavBar */}
      <header
        className="eco-navbar eco-navbar--white"
        style={{ position: 'sticky', top: 0, zIndex: 20, borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="eco-navbar__side">
          <button
            type="button"
            className="eco-iconbtn"
            onClick={onBack}
            aria-label="Quay lại"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
        <div className="eco-navbar__title">Xác nhận giao dịch</div>
        <div className="eco-navbar__side eco-navbar__side--right" />
      </header>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-12)',
          padding: 'var(--space-12) var(--space-16)',
        }}
      >
        {/* ECO.TransactionSummary (confirm state) */}
        <div className="eco-txn eco-txn--confirm">
          <div className="eco-txn__ticket">
            <div
              className="eco-txn__strip"
              style={{ backgroundImage: 'url(/ds/payment/ticket-strip.png)' }}
            />
            <span className="eco-txn__svcicon">
              <img
                src="/ds/payment/service-tuition.svg"
                alt=""
                width={48}
                height={48}
                style={{ display: 'block', width: 48, height: 48 }}
              />
            </span>
          </div>

          <span className="eco-txn__label" style={{ font: 'var(--text-body-s)' }}>
            Tổng thanh toán
          </span>
          <strong className="eco-txn__amount" style={{ font: 'var(--text-amount)' }}>
            {formatVND(totalAmount)}
          </strong>
          <span className="eco-txn__chip" style={{ font: 'var(--text-body-s)' }}>
            Thanh toán học phí
          </span>

          <div className="eco-txn__body">
            <div className="eco-dashdiv" />

            <div className="eco-drow">
              <span className="eco-drow__label" style={{ font: 'var(--text-body-s)' }}>Nhà cung cấp</span>
              <span className="eco-drow__value" style={{ font: 'var(--text-body-s)' }}>{student.providerName}</span>
            </div>
            <div className="eco-drow">
              <span className="eco-drow__label" style={{ font: 'var(--text-body-s)' }}>Mã học sinh</span>
              <span className="eco-drow__value" style={{ font: 'var(--text-body-s)' }}>{student.code}</span>
            </div>
            <div className="eco-drow">
              <span className="eco-drow__label" style={{ font: 'var(--text-body-s)' }}>Tên học sinh</span>
              <span className="eco-drow__value" style={{ font: 'var(--text-body-s)' }}>{student.name}</span>
            </div>
            <div className="eco-drow">
              <span className="eco-drow__label" style={{ font: 'var(--text-body-s)' }}>Lớp</span>
              <span className="eco-drow__value" style={{ font: 'var(--text-body-s)' }}>{student.className}</span>
            </div>
            <div className="eco-drow">
              <span className="eco-drow__label" style={{ font: 'var(--text-body-s)' }}>Trường</span>
              <span className="eco-drow__value" style={{ font: 'var(--text-body-s)' }}>{student.school}</span>
            </div>
            <div
              className="eco-drow"
              onClick={() => setIsBreakdownOpen((v) => !v)}
              style={{ cursor: 'pointer' }}
            >
              <span className="eco-drow__label" style={{ font: 'var(--text-body-s)' }}>Kỳ thanh toán</span>
              <span className="eco-drow__value" style={{ font: 'var(--text-body-s)' }}>{periodLabel}</span>
              <button type="button" className="eco-drow__chev" aria-label="Chi tiết">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    transform: isBreakdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            {isBreakdownOpen &&
              selectedItems.map((it) => (
                <div key={it.id} className="eco-drow eco-drow--sub">
                  <span className="eco-drow__label" style={{ font: 'var(--text-body-xs)' }}>
                    {it.name}
                  </span>
                  <span className="eco-drow__value" style={{ font: 'var(--text-body-xs)' }}>
                    {formatVND(it.amount)}
                  </span>
                </div>
              ))}

            <div className="eco-dashdiv" />

            <div className="eco-drow">
              <span className="eco-drow__label" style={{ font: 'var(--text-body-s)' }}>Số tiền</span>
              <span className="eco-drow__value" style={{ font: 'var(--text-body-s)', fontWeight: 700 }}>
                {formatVND(totalAmount)}
              </span>
            </div>
            <div className="eco-drow">
              <span className="eco-drow__label" style={{ font: 'var(--text-body-s)' }}>Phí giao dịch</span>
              <span className="eco-drow__value" style={{ font: 'var(--text-body-s)' }}>Miễn phí</span>
            </div>

            <p className="eco-reward" style={{ font: 'var(--text-body-xs)' }}>
              Bạn nhận được <b>+10 điểm</b> ECO sau khi giao dịch thành công
            </p>
          </div>
        </div>

        {/* ECO.PromoRow */}
        <div className="eco-promorow">
          <img src="/ds/payment/promo-tag.svg" alt="" width={24} height={24} className="eco-promorow__icon" />
          <span className="eco-promorow__title" style={{ font: 'var(--text-body-s)', fontWeight: 500 }}>
            Ưu đãi ECO Me
          </span>
          <button type="button" className="eco-promorow__action" style={{ font: 'var(--text-body-s)', fontWeight: 500 }}>
            Chọn ưu đãi
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* ECO.PaymentMethodList */}
        <div className="eco-paylist">
          <div className="eco-paylist__head">
            <img src="/ds/payment/pay-method.svg" alt="" width={24} height={24} />
            <span className="eco-paylist__title" style={{ font: 'var(--text-body-m)', fontWeight: 500 }}>
              Chọn phương thức thanh toán
            </span>
            <button type="button" className="eco-paylist__more" style={{ font: 'var(--text-body-s)' }}>
              Xem thêm
            </button>
          </div>

          <div className="eco-paylist__opts">
            <div
              className={`eco-payopt ${selectedMethod === 'ecopay' ? 'is-selected' : ''}`}
              onClick={() => setSelectedMethod('ecopay')}
              role="radio"
              aria-checked={selectedMethod === 'ecopay'}
              tabIndex={0}
            >
              <img src="/ds/payment/logo-eco-wallet.svg" alt="" className="eco-payopt__logo" />
              <div className="eco-payopt__text">
                <span style={{ font: 'var(--text-body-s)', fontWeight: 500 }}>Ví ECO (Khuyên dùng)</span>
                <span className="eco-payopt__caption" style={{ font: 'var(--text-body-xs)' }}>
                  Số dư khả dụng: 2.500.000đ
                </span>
              </div>
              <span className={`eco-payradio ${selectedMethod === 'ecopay' ? 'is-checked' : ''}`} />
            </div>

            <div
              className={`eco-payopt ${selectedMethod === 'vcb' ? 'is-selected' : ''}`}
              onClick={() => setSelectedMethod('vcb')}
              role="radio"
              aria-checked={selectedMethod === 'vcb'}
              tabIndex={0}
            >
              <img src="/ds/payment/bank-vcb.svg" alt="" className="eco-payopt__logo" />
              <div className="eco-payopt__text">
                <span style={{ font: 'var(--text-body-s)', fontWeight: 500 }}>Vietcombank</span>
                <span className="eco-payopt__caption" style={{ font: 'var(--text-body-xs)' }}>
                  *6789 · Miễn phí giao dịch
                </span>
              </div>
              <span className={`eco-payradio ${selectedMethod === 'vcb' ? 'is-checked' : ''}`} />
            </div>

            <div
              className={`eco-payopt ${selectedMethod === 'paylater' ? 'is-selected' : ''}`}
              onClick={() => setSelectedMethod('paylater')}
              role="radio"
              aria-checked={selectedMethod === 'paylater'}
              tabIndex={0}
            >
              <img src="/ds/payment/pay-paylater.svg" alt="" className="eco-payopt__logo" />
              <div className="eco-payopt__text">
                <span style={{ font: 'var(--text-body-s)', fontWeight: 500 }}>Học phí trả sau</span>
                <span className="eco-payopt__caption" style={{ font: 'var(--text-body-xs)' }}>
                  Hạn mức khả dụng: 20.000.000đ
                </span>
              </div>
              <span className={`eco-payradio ${selectedMethod === 'paylater' ? 'is-checked' : ''}`} />
            </div>

            <div
              className={`eco-payopt ${selectedMethod === 'atm' ? 'is-selected' : ''}`}
              onClick={() => setSelectedMethod('atm')}
              role="radio"
              aria-checked={selectedMethod === 'atm'}
              tabIndex={0}
            >
              <img src="/ds/payment/pay-card.svg" alt="" className="eco-payopt__logo" />
              <div className="eco-payopt__text">
                <span style={{ font: 'var(--text-body-s)', fontWeight: 500 }}>Thẻ ATM / QR Ngân hàng</span>
                <span className="eco-payopt__caption" style={{ font: 'var(--text-body-xs)' }}>
                  Hỗ trợ 40+ ngân hàng nội địa
                </span>
              </div>
              <span className={`eco-payradio ${selectedMethod === 'atm' ? 'is-checked' : ''}`} />
            </div>
          </div>
        </div>
      </div>

      {/* ECO.ActionFooter */}
      <footer className="eco-actionfooter" style={{ position: 'sticky', bottom: 0, zIndex: 20 }}>
        <div className="eco-actionfooter__bar">
          <button
            type="button"
            className="eco-btn eco-btn--brand eco-btn--lg eco-btn--full"
            onClick={onProceed}
          >
            Tiếp tục
          </button>
        </div>
        <div className="eco-actionfooter__safe" />
      </footer>
    </div>
  )
}
