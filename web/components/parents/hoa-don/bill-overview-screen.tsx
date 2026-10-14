'use client'

import { useState } from 'react'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { fmtMoney, sumItems, type Student } from '@/lib/mock-data'
import { fmtDong, inSchoolYear, summarizeYear, yearAnchor } from './bill-year'
import { CategoryDonut } from './bill-category-donut'
import { YearFilter } from './bill-year-row'

const sumOf = (xs: { amount: number }[]) => xs.reduce((n, x) => n + x.amount, 0)

// Compact amount for the bar tops: 1,25tr / 200k.
function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, '').replace('.', ',')}tr`
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

// The most recent MONTHS_WINDOW months ending at `now`, oldest first.
const MONTHS_WINDOW = 5
function recentMonths(now: Date): { year: number; month: number }[] {
  return Array.from({ length: MONTHS_WINDOW }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS_WINDOW - 1 - i), 1)
    return { year: d.getFullYear(), month: d.getMonth() + 1 }
  })
}

// --- Screen ---------------------------------------------------------------

// "Tổng quan hóa đơn đã đóng" — reached from the "Đã thanh toán" tab. Everything
// is derived from `student.bills` on each render, so it reflects payments made
// in the list flow. The summary (counts, total, donut) is scoped to the
// current school year; the total and the donut count paid items only; the month chart covers the last MONTHS_WINDOW calendar
// months (within that school year) and only shows months that have payments. A bill counts as "Đã
// thanh toán" only when fully paid; a bill with any open item counts as "Chưa
// thanh toán", so the two counts add up to the total.
export function BillOverviewScreen({
  student,
  year,
  years,
  onYearChange,
  onBack,
  onOpenPaid,
  onOpenUnpaid,
}: {
  student: Student
  // Start of the school year being shown; the row under the student card changes it.
  year: number
  years: number[]
  onYearChange: (startYear: number) => void
  onBack: () => void
  onOpenPaid: () => void
  onOpenUnpaid: () => void
}) {
  const [now] = useState(() => new Date())
  const [monthKey, setMonthKey] = useState<string | null>(null)
  // Bill ids whose items are collapsed in the month detail (all open by default).
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const toggleBill = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })

  const { startYear, paidItems, paidAmount, paidCount, unpaidCount } = summarizeYear(student, now, year)
  // Months are placed by billing period (Bill.year/month), not by when the
  // bill was paid. Each month keeps its paid items grouped per bill.
  const months = recentMonths(yearAnchor(now, startYear))
    .filter((m) => inSchoolYear(m.year, m.month, startYear))
    .map((m) => {
      const groups = student.bills
        .filter((b) => b.year === m.year && b.month === m.month)
        .map((bill) => {
          const items = bill.items.filter((it) => it.paid)
          return { bill, items, amount: sumItems(items) }
        })
        .filter((g) => g.items.length > 0)
      return { ...m, key: `${m.year}-${m.month}`, groups, amount: sumOf(groups) }
    })
    .filter((m) => m.amount > 0)
  const maxAmount = Math.max(...months.map((m) => m.amount), 0)
  // No month is preselected: the detail list appears once a bar is tapped.
  const active = months.find((m) => m.key === monthKey)

  return (
    <div className="screen">
      <TopBar title="Tổng quan hóa đơn" onBack={onBack} />
      <StudentHeader student={student} />
      <YearFilter year={startYear} years={years} onChange={onYearChange} />

      <div className="ov-section">
        <div className="ov-total">
          Tổng số tiền đã thanh toán: <b>{fmtDong(paidAmount)}</b>
        </div>

        <div className="ov-stats">
          <div className="ov-stat">
            <div className="ov-stat-box">
              <div className="ov-stat-label">Đã thanh toán</div>
              <div className="ov-stat-num">{paidCount}</div>
            </div>
            <button className="ov-stat-link" onClick={onOpenPaid}>
              Xem chi tiết ›
            </button>
          </div>
          <div className="ov-stat">
            <div className="ov-stat-box">
              <div className="ov-stat-label">Chưa thanh toán</div>
              <div className="ov-stat-num">{unpaidCount}</div>
            </div>
            <button className="ov-stat-link" onClick={onOpenUnpaid} disabled={unpaidCount === 0}>
              Thanh toán ngay ›
            </button>
          </div>
        </div>
      </div>

      <div className="ov-section">
        <div className="ov-heading">Phân bổ danh mục</div>
        <CategoryDonut paidItems={paidItems} />
      </div>

      <div className="ov-section">
        <div className="ov-heading">Thanh toán theo tháng</div>
        {months.length ? (
          <>
            <div className="ov-bars" role="group" aria-label="Số tiền đã thanh toán theo tháng">
              {months.map((m) => (
                <button
                  key={m.key}
                  className={`ov-bar-col ${m.key === active?.key ? 'active' : ''}`}
                  aria-pressed={m.key === active?.key}
                  aria-label={`Tháng ${m.month}/${m.year}: ${fmtMoney(m.amount)}`}
                  onClick={() => setMonthKey(m.key)}
                >
                  <div className="ov-bar-track">
                    <div className="ov-bar" style={{ height: `${Math.max((m.amount / maxAmount) * 82, 3)}%` }}>
                      <span className="ov-bar-value">{fmtCompact(m.amount)}</span>
                    </div>
                  </div>
                  <div className="ov-bar-label">T{m.month}</div>
                </button>
              ))}
            </div>

            {active ? (
              <div className="ov-month-list">
                <div className="ov-month-head">
                  <span>
                    Tháng {active.month}/{active.year}
                  </span>
                  <span className="amt">{fmtMoney(active.amount)}</span>
                </div>
                {active.groups.length === 1
                  ? active.groups[0].items.map((it) => (
                      <div className="invoice-line" key={it.id}>
                        <span>{it.name}</span>
                        <span className="amt">{fmtMoney(it.amount)}</span>
                      </div>
                    ))
                  : active.groups.map((g) => {
                      const open = !collapsed.has(g.bill.id)
                      return (
                        <div key={g.bill.id}>
                          <button
                            className="ov-bill-head"
                            aria-expanded={open}
                            onClick={() => toggleBill(g.bill.id)}
                          >
                            <span className="chevron">{open ? '⌄' : '›'}</span>
                            <span>{g.bill.label}</span>
                            <span className="amt">{fmtMoney(g.amount)}</span>
                          </button>
                          {open &&
                            g.items.map((it) => (
                              <div className="invoice-line ov-bill-line" key={it.id}>
                                <span>{it.name}</span>
                                <span className="amt">{fmtMoney(it.amount)}</span>
                              </div>
                            ))}
                        </div>
                      )
                    })}
              </div>
            ) : (
              <div className="ov-hint">Chạm vào một cột để xem các khoản đã thanh toán của tháng đó</div>
            )}
          </>
        ) : (
          <div className="ov-hint">Chưa có khoản thanh toán nào trong 5 tháng gần nhất</div>
        )}
      </div>

    </div>
  )
}
