'use client'

import { useEffect, useRef, useState } from 'react'
import { ReceiptText } from 'lucide-react'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { fmtMoney, sumItems, type Bill, type Student } from '@/lib/mock-data'
import { fmtDong, summarizeYear } from './bill-year'
import { YearFilter } from './bill-year-row'
import { BillSummaryCard } from './bill-summary-card'
import { Chevron } from './bill-ds'

export type BillTab = 'unpaid' | 'paid'

const TABS: { value: BillTab; label: string }[] = [
  { value: 'unpaid', label: 'Chưa thanh toán' },
  { value: 'paid', label: 'Đã thanh toán' },
]

// "Hóa đơn" list. A partially paid bill appears in both tabs, each showing
// only the items that belong to that tab. On "Đã thanh toán", a bill that
// still has open items gets a warning row ("Hóa đơn chưa được thanh toán xong")
// with a "Thanh toán ngay" button that starts the normal payment flow (the
// select screen, all open items unchecked).
export function BillListScreen({
  student,
  tab,
  year,
  years,
  onYearChange,
  focusBillId,
  scrollToList,
  onTabChange,
  onBack,
  onChangeStudent,
  onPay,
  onViewInvoice,
  onOpenOverview,
}: {
  student: Student
  tab: BillTab
  // School year filter (start year): both tabs and the overview load this year.
  year: number
  years: number[]
  onYearChange: (startYear: number) => void
  // Bill to scroll to and briefly highlight (set when arriving from the
  // month chart on Tổng quan).
  focusBillId?: string | null
  // Scroll the tabs (and the list under them) to the top of the screen on
  // arrival — set when coming from "Xem chi tiết ›" on Tổng quan.
  scrollToList?: boolean
  onTabChange: (tab: BillTab) => void
  onBack: () => void
  onChangeStudent?: () => void
  onPay: () => void
  onViewInvoice: (bill: Bill) => void
  onOpenOverview: () => void
}) {
  const wantPaid = tab === 'paid'
  const [now] = useState(() => new Date())
  const summary = summarizeYear(student, now, year)
  const bills = summary.bills.filter((b) => b.items.some((it) => it.paid === wantPaid))
  const focusRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollToList) listRef.current?.scrollIntoView({ block: 'start' })
  }, [scrollToList])
  useEffect(() => {
    focusRef.current?.scrollIntoView({ block: 'center' })
  }, [focusBillId])
  const hasUnpaid = summary.bills.some((b) => b.items.some((it) => !it.paid))
  // BillGroup open/closed state (open by default).
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const toggle = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }))

  const heading = (
    <div className="bill-section-title bill-list-title" ref={listRef}>
      {wantPaid ? 'Hóa đơn đã thanh toán' : 'Hóa đơn chưa thanh toán'} ({bills.length})
    </div>
  )

  return (
    <div className="screen bill-ds">
      <TopBar title="Hoá đơn học phí" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={onChangeStudent} detailed />
      <YearFilter year={year} years={years} onChange={onYearChange} />

      {wantPaid && (
        <BillSummaryCard paidItems={summary.paidItems} total={summary.paidAmount} onOpenOverview={onOpenOverview} />
      )}

      {/* PillTabs "segment": two equal halves, selected = eco-yellow */}
      <div className="eco-segment bill-segment" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={tab === t.value}
            className={`eco-segment__item ${tab === t.value ? 'is-active' : ''}`}
            onClick={() => onTabChange(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {wantPaid ? (
        // Đã thanh toán: PaidBillCard per bill on the grey page
        <div className="bill-paid-list">
          {heading}
          {bills.length ? (
            bills.map((bill) => {
              const items = bill.items.filter((it) => it.paid)
              const remaining = bill.items.filter((it) => !it.paid)
              return (
                <div
                  className={`eco-paidbill ${bill.id === focusBillId ? 'focused' : ''}`}
                  key={bill.id}
                  ref={bill.id === focusBillId ? focusRef : undefined}
                >
                  <div className="eco-paidbill__head">
                    <img src="/ds/payment/calendar.svg" alt="" width={20} height={20} />
                    <span className="eco-paidbill__title bill-ds-title">{bill.label}</span>
                    <strong className="bill-ds-amt">{fmtMoney(sumItems(items))}</strong>
                  </div>
                  <div className="eco-paidbill__rows">
                    {items.map((it) => (
                      <div className="eco-paidbill__row" key={it.id}>
                        <span className="bill-ds-row-label">{it.name}</span>
                        <span className="bill-ds-row-value">{fmtMoney(it.amount)}</span>
                      </div>
                    ))}
                  </div>
                  {bill.hasVat && remaining.length === 0 && (
                    <div className="eco-paidbill__vat">
                      <img src="/ds/payment/invoice.svg" alt="" width={20} height={20} />
                      <span className="eco-paidbill__vatlabel bill-ds-title">Hoá đơn điện tử (VAT)</span>
                      <button className="eco-paidbill__vatlink bill-ds-title" onClick={() => onViewInvoice(bill)}>
                        <span>Xem hoá đơn</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {remaining.length > 0 && (
                    <div className="bill-remaining">
                      <ReceiptText size={22} strokeWidth={1.8} aria-hidden="true" />
                      <span>Hoá đơn chưa được hoàn tất thanh toán.</span>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <BillEmpty text="Chưa có hóa đơn đã thanh toán" />
          )}
        </div>
      ) : (
        // Chưa thanh toán: BillGroup per bill inside a white section card
        <section className="eco-seccard bill-seccard bill-unpaid">
          {heading}
          {bills.length ? (
            <div className="bill-group-list">
              {bills.map((bill) => {
                const items = bill.items.filter((it) => !it.paid)
                const open = !collapsed[bill.id]
                return (
                  <div
                    className={`eco-billgrp ${bill.id === focusBillId ? 'focused' : ''}`}
                    key={bill.id}
                    ref={bill.id === focusBillId ? focusRef : undefined}
                  >
                    <div className="eco-billgrp__head" onClick={() => toggle(bill.id)} style={{ cursor: 'pointer' }}>
                      <span className="eco-billgrp__title bill-ds-title">{bill.label}</span>
                      <span className="bill-ds-amt">{fmtMoney(sumItems(items))}</span>
                      <button type="button" className="eco-billgrp__chev" aria-label={open ? 'Thu gọn' : 'Mở rộng'}>
                        <Chevron open={open} />
                      </button>
                    </div>
                    {open && (
                      <div className="eco-billgrp__items">
                        {items.map((it) => (
                          <div className="eco-billgrp__item" key={it.id}>
                            <span className="eco-billgrp__label bill-ds-row-label">{it.name}</span>
                            <span className="eco-billgrp__value bill-ds-row-label">{fmtMoney(it.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <BillEmpty text="Không còn hóa đơn chưa thanh toán" />
          )}
        </section>
      )}

      <footer className="eco-actionfooter bill-footer">
        <div className="eco-actionfooter__bar">
          <button className="eco-btn eco-btn--brand eco-btn--lg eco-btn--full" disabled={!hasUnpaid} onClick={onPay}>
            Đóng học phí
          </button>
        </div>
        <div className="eco-actionfooter__safe" />
      </footer>
    </div>
  )
}

// DS EmptyState (simple): illustration + one line.
function BillEmpty({ text }: { text: string }) {
  return (
    <div className="eco-empty eco-empty--illus bill-empty">
      <img src="/ds/payment/empty-bill.svg" alt="" width={64} height={64} />
      <p>{text}</p>
    </div>
  )
}
