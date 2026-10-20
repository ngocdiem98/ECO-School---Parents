'use client'

import { useState } from 'react'
import { Chevron } from './bill-ds'
import { TopBar } from '@/components/parents/shared/header'
import { fmtMoney, sumItems, type Bill, type Student } from '@/lib/mock-data'

// Mock Ví ECO balance, as shown on the design's payment-method row. Same
// convention as topup's ConfirmScreen: "Ưu đãi ECO Me", "Xem thêm" and
// "Nạp tiền" are inert (no reference screens for those sub-flows).
const WALLET_BALANCE = 210913

type Method = 'wallet' | 'bank'

// "Xác nhận giao dịch": receipt of the selected items grouped by bill, then
// payment method. Ví ECO is only selectable when its balance covers the total.
export function BillConfirmScreen({
  student,
  bills,
  selected,
  total,
  onBack,
  onContinue,
}: {
  student: Student
  bills: Bill[]
  selected: Set<string>
  total: number
  onBack: () => void
  onContinue: () => void
}) {
  const [method, setMethod] = useState<Method>('bank')
  const [open, setOpen] = useState(true)
  const walletOk = WALLET_BALANCE >= total
  const effective: Method = method === 'wallet' && !walletOk ? 'bank' : method

  const groups = bills
    .map((b) => ({ bill: b, items: b.items.filter((it) => selected.has(it.id)) }))
    .filter((g) => g.items.length > 0)

  const totalSelected = sumItems(groups.flatMap((g) => g.items))

  return (
    <div className="screen bill-ds bill-confirm">
      <TopBar title="Xác nhận giao dịch" onBack={onBack} />
      <div className="bill-confirm-body">
        {/* TransactionSummary (confirm) */}
        <div className="eco-txn eco-txn--confirm">
          <div className="eco-txn__ticket">
            <div className="eco-txn__strip" style={{ backgroundImage: 'url(/ds/payment/ticket-strip.png)' }} />
            <span className="eco-txn__svcicon">
              <img src="/ds/payment/service-tuition.svg" alt="" width={48} height={48} style={{ display: 'block', width: 48, height: 48 }} />
            </span>
          </div>
          <span className="eco-txn__label bill-ds-row-text">Tổng thanh toán</span>
          <strong className="eco-txn__amount" style={{ font: 'var(--text-amount)' }}>
            {fmtMoney(total)}
          </strong>
          <span className="eco-txn__chip bill-ds-row-text">Thanh toán học phí</span>

          <div className="eco-txn__body">
            <div className="eco-dashdiv" />
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
            {groups.map(({ bill, items }, gi) => (
              <div key={bill.id}>
                <div
                  className="eco-drow"
                  onClick={() => gi === 0 && setOpen((v) => !v)}
                  style={{ cursor: gi === 0 ? 'pointer' : undefined }}
                >
                  <span className="eco-drow__label bill-ds-row-text">Kỳ thanh toán</span>
                  <span className="eco-drow__value bill-ds-row-text">{bill.label}</span>
                  {gi === 0 && (
                    <button type="button" className="eco-drow__chev" aria-label="Chi tiết">
                      <Chevron open={open} />
                    </button>
                  )}
                </div>
                {(open || gi > 0) &&
                  items.map((it) => (
                    <div className="eco-drow eco-drow--sub" key={it.id}>
                      <span className="eco-drow__label bill-ds-xs">{it.name}</span>
                      <span className="eco-drow__value bill-ds-xs">{fmtMoney(it.amount)}</span>
                    </div>
                  ))}
              </div>
            ))}
            <div className="eco-dashdiv" />
            <div className="eco-drow">
              <span className="eco-drow__label bill-ds-row-text">Số tiền</span>
              <span className="eco-drow__value bill-ds-row-text" style={{ fontWeight: 700 }}>
                {fmtMoney(totalSelected)}
              </span>
            </div>
          </div>
        </div>

        {/* PromoRow (inert) */}
        <div className="eco-promorow">
          <img src="/ds/payment/promo-tag.svg" alt="" width={24} height={24} className="eco-promorow__icon" />
          <span className="eco-promorow__title bill-ds-title">Ưu đãi ECO Me</span>
          <button type="button" className="eco-promorow__action bill-ds-title">
            Chọn ưu đãi
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* PaymentMethodList */}
        <div className="eco-paylist">
          <div className="eco-paylist__head">
            <img src="/ds/payment/pay-method.svg" alt="" width={24} height={24} />
            <span className="eco-paylist__title" style={{ font: 'var(--text-body-m)', fontWeight: 500 }}>
              Chọn phương thức thanh toán
            </span>
            <button type="button" className="eco-paylist__more bill-ds-row-text">
              Xem thêm
            </button>
          </div>
          <div className="eco-paylist__opts">
            <div
              className={`eco-payopt ${effective === 'wallet' ? 'is-selected' : ''} ${walletOk ? '' : 'is-disabled'}`}
              onClick={() => walletOk && setMethod('wallet')}
              role="radio"
              aria-checked={effective === 'wallet'}
              aria-disabled={!walletOk}
              tabIndex={0}
            >
              <img src="/ds/payment/logo-eco-wallet.svg" alt="" className="eco-payopt__logo" />
              <div className="eco-payopt__text">
                <span className="bill-ds-title">Ví ECO</span>
                <span className="eco-payopt__caption bill-ds-xs">
                  {walletOk ? 'Số dư khả dụng: ' : 'Số dư ví không đủ: '}
                  {fmtMoney(WALLET_BALANCE)}
                </span>
              </div>
              {walletOk ? (
                <span className={`eco-payradio ${effective === 'wallet' ? 'is-checked' : ''}`} />
              ) : (
                <button type="button" className="eco-btn eco-btn--sm eco-btn--brand">
                  Nạp tiền
                </button>
              )}
            </div>
            <div
              className={`eco-payopt ${effective === 'bank' ? 'is-selected' : ''}`}
              onClick={() => setMethod('bank')}
              role="radio"
              aria-checked={effective === 'bank'}
              tabIndex={0}
            >
              <img src="/ds/payment/pay-card.svg" alt="" className="eco-payopt__logo" />
              <div className="eco-payopt__text">
                <span className="bill-ds-title">Techcombank</span>
                <span className="eco-payopt__caption bill-ds-xs">•••• 2939</span>
              </div>
              <span className={`eco-payradio ${effective === 'bank' ? 'is-checked' : ''}`} />
            </div>
          </div>
        </div>
      </div>

      {/* ActionFooter */}
      <footer className="eco-actionfooter bill-footer">
        <div className="eco-actionfooter__bar">
          <button type="button" className="eco-btn eco-btn--brand eco-btn--lg eco-btn--full" onClick={onContinue}>
            Tiếp tục
          </button>
        </div>
        <div className="eco-actionfooter__safe" />
      </footer>
    </div>
  )
}
