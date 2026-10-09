'use client'

import { useEffect, useRef } from 'react'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { fmtMoney, sumItems, type Bill, type Student } from '@/lib/mock-data'

export type BillTab = 'unpaid' | 'paid'

const TABS: { value: BillTab; label: string }[] = [
  { value: 'unpaid', label: 'Chưa thanh toán' },
  { value: 'paid', label: 'Đã thanh toán' },
]

// "Hóa đơn" list. A partially paid bill appears in both tabs, each showing
// only the items that belong to that tab. On "Đã thanh toán", a bill that
// still has open items gets a "Thanh toán tiếp" CTA (the annotated addition
// on the design: let parents continue paying partially paid invoices).
export function BillListScreen({
  student,
  tab,
  focusBillId,
  onTabChange,
  onBack,
  onChangeStudent,
  onPay,
  onPayRemaining,
  onViewInvoice,
  onOpenOverview,
}: {
  student: Student
  tab: BillTab
  // Bill to scroll to and briefly highlight (set when arriving from the
  // month chart on Tổng quan).
  focusBillId?: string | null
  onTabChange: (tab: BillTab) => void
  onBack: () => void
  onChangeStudent: () => void
  onPay: () => void
  onPayRemaining: (bill: Bill) => void
  onViewInvoice: (bill: Bill) => void
  onOpenOverview: () => void
}) {
  const wantPaid = tab === 'paid'
  const bills = student.bills.filter((b) => b.items.some((it) => it.paid === wantPaid))
  const focusRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    focusRef.current?.scrollIntoView({ block: 'center' })
  }, [focusBillId])
  const hasUnpaid = student.bills.some((b) => b.items.some((it) => !it.paid))

  return (
    <div className="screen">
      <TopBar title="Hóa đơn" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={onChangeStudent} />
      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.value}
            className={`tab-pill ${tab === t.value ? 'active' : ''}`}
            onClick={() => onTabChange(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {wantPaid && (
        <button className="ov-entry" onClick={onOpenOverview}>
          <span>Xem tổng quan hóa đơn đã đóng</span>
          <span className="chevron">›</span>
        </button>
      )}

      {bills.length ? (
        bills.map((bill) => {
          const items = bill.items.filter((it) => it.paid === wantPaid)
          const remaining = bill.items.filter((it) => !it.paid)
          return (
            <div
              className={`invoice-group ${bill.id === focusBillId ? 'focused' : ''}`}
              key={bill.id}
              ref={bill.id === focusBillId ? focusRef : undefined}
            >
              <div className="invoice-group-head">
                <span>{bill.label}</span>
                <span className="amt">
                  {wantPaid ? '-' : ''}
                  {fmtMoney(sumItems(items))}
                </span>
              </div>
              {items.map((it) => (
                <div className="invoice-line" key={it.id}>
                  <span>{it.name}</span>
                  <span className="amt">
                    {wantPaid ? '-' : ''}
                    {fmtMoney(it.amount)}
                  </span>
                </div>
              ))}
              {wantPaid && bill.hasVat && remaining.length === 0 && (
                <div className="invoice-line">
                  <span>▤ Hóa đơn điện tử (VAT)</span>
                  <button className="amt btn-link" style={{ textDecoration: 'none' }} onClick={() => onViewInvoice(bill)}>
                    Xem hóa đơn ›
                  </button>
                </div>
              )}
              {wantPaid && remaining.length > 0 && (
                <div className="invoice-line" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                  <div className="feedback-row" style={{ margin: 0 }}>
                    <span className="text-muted">Còn lại chưa thanh toán</span>
                    <span style={{ fontWeight: 700 }}>{fmtMoney(sumItems(remaining))}</span>
                  </div>
                  <button className="btn btn-primary" onClick={() => onPayRemaining(bill)}>
                    Thanh toán tiếp
                  </button>
                </div>
              )}
            </div>
          )
        })
      ) : (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">{wantPaid ? 'Chưa có hóa đơn đã thanh toán' : 'Không còn hóa đơn chưa thanh toán'}</div>
        </div>
      )}

      {!wantPaid && (
        <div className="cta-bar sticky">
          <button className="btn btn-primary" disabled={!hasUnpaid} onClick={onPay}>
            Đóng học phí
          </button>
        </div>
      )}
    </div>
  )
}
