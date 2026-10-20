'use client'

import { useState } from 'react'
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
  const walletOk = WALLET_BALANCE >= total
  const effective: Method = method === 'wallet' && !walletOk ? 'bank' : method

  const groups = bills
    .map((b) => ({ bill: b, items: b.items.filter((it) => selected.has(it.id)) }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="screen">
      <TopBar title="Xác nhận giao dịch" onBack={onBack} />
      <div className="result-hero">
        <div style={{ fontSize: 24 }}>▣</div>
        <div className="total-label">Tổng thanh toán</div>
        <div className="result-amount">{fmtMoney(total)}</div>
        <span className="badge badge--outline">Thanh toán học phí</span>
      </div>
      <div className="card">
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
        {groups.map(({ bill, items }) => (
          <div key={bill.id}>
            <div className="divider" />
            <div className="feedback-row">
              <span className="text-muted">Kỳ thanh toán</span>
              <span style={{ fontWeight: 700 }}>{bill.label}</span>
            </div>
            {items.map((it) => (
              <div className="feedback-row" key={it.id}>
                <span className="text-muted">{it.name}</span>
                <span>{fmtMoney(it.amount)}</span>
              </div>
            ))}
          </div>
        ))}
        <div className="divider" />
        <div className="feedback-row">
          <span className="text-muted">Số tiền</span>
          <span style={{ fontWeight: 700 }}>{fmtMoney(sumItems(groups.flatMap((g) => g.items)))}</span>
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
      <div
        className={`pick-row ${effective === 'wallet' ? 'selected' : ''}`}
        onClick={() => walletOk && setMethod('wallet')}
        style={walletOk ? undefined : { opacity: 0.7 }}
      >
        <div>
          <div className="student-name">Ví ECO</div>
          <div className="meta text-muted" style={{ fontSize: 12 }}>
            {fmtMoney(WALLET_BALANCE)}
            {walletOk ? '' : ' · Số dư ví không đủ'}
          </div>
        </div>
        {walletOk ? (
          <span className={`checkbox ${effective === 'wallet' ? 'checked' : ''}`} style={{ borderRadius: '50%' }}>
            {effective === 'wallet' ? '✓' : ''}
          </span>
        ) : (
          <button
            className="btn-mini"
            style={{
              border: 'none',
              background: 'var(--c-black)',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Nạp tiền
          </button>
        )}
      </div>
      <div className={`pick-row ${effective === 'bank' ? 'selected' : ''}`} onClick={() => setMethod('bank')}>
        <div>
          <div className="student-name">Techcombank •••• 2939</div>
        </div>
        <span className={`checkbox ${effective === 'bank' ? 'checked' : ''}`} style={{ borderRadius: '50%' }}>
          {effective === 'bank' ? '✓' : ''}
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
