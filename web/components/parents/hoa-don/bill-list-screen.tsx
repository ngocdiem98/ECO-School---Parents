'use client'

import { useEffect, useRef, useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { fmtMoney, sumItems, type Bill, type Student } from '@/lib/mock-data'
import { fmtDong, summarizeYear } from './bill-year'
import { YearFilter } from './bill-year-row'
import { CategoryDonut } from './bill-category-donut'

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
  scrollToTabs,
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
  scrollToTabs?: boolean
  onTabChange: (tab: BillTab) => void
  onBack: () => void
  onChangeStudent: () => void
  onPay: () => void
  onViewInvoice: (bill: Bill) => void
  onOpenOverview: () => void
}) {
  const wantPaid = tab === 'paid'
  const [now] = useState(() => new Date())
  const summary = summarizeYear(student, now, year)
  const bills = summary.bills.filter((b) => b.items.some((it) => it.paid === wantPaid))
  const focusRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollToTabs) tabsRef.current?.scrollIntoView({ block: 'start' })
  }, [scrollToTabs])
  useEffect(() => {
    focusRef.current?.scrollIntoView({ block: 'center' })
  }, [focusBillId])
  const hasUnpaid = summary.bills.some((b) => b.items.some((it) => !it.paid))

  return (
    <div className="screen">
      <TopBar title="Hóa đơn" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={onChangeStudent} />
      <YearFilter year={year} years={years} onChange={onYearChange} />

      <div className="tabs" ref={tabsRef}>
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
        <>
          <div className="bill-section-title bill-section-title--row">
            <span>Tổng quan Hóa đơn</span>
            <button className="ov-card-link" onClick={onOpenOverview}>
              Xem chi tiết ›
            </button>
          </div>
          <div className="ov-card">
            <div className="ov-card-total">
              Tổng số tiền đã thanh toán: <b>{fmtDong(summary.paidAmount)}</b>
            </div>
            <CategoryDonut paidItems={summary.paidItems} showHint={false} />
          </div>
        </>
      )}

      <div className="bill-section-title">
        {wantPaid ? 'Hóa đơn đã thanh toán' : 'Hóa đơn chưa thanh toán'} ({bills.length})
      </div>

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
                <div className="invoice-line bill-remaining">
                  <span className="bill-remaining-warn">
                    <TriangleAlert size={18} />
                    Hóa đơn chưa được thanh toán xong
                  </span>
                  <button className="bill-remaining-cta" onClick={onPay}>
                    Thanh toán ngay
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
