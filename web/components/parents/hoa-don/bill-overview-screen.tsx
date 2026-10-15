'use client'

import { useEffect, useRef, useState } from 'react'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { fmtMoney, sumItems, type Student } from '@/lib/mock-data'
import { fmtDong, summarizeYear, yearAnchor } from './bill-year'
import { CategoryDonut } from './bill-category-donut'
import { YearFilter } from './bill-year-row'

const sumOf = (xs: { amount: number }[]) => xs.reduce((n, x) => n + x.amount, 0)

// Compact amount for the bar tops: 1,25tr / 200k.
function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, '').replace('.', ',')}tr`
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

// Every month of the school year from August up to `anchor`, oldest first.
function schoolYearMonths(startYear: number, anchor: Date): { year: number; month: number }[] {
  const out: { year: number; month: number }[] = []
  for (let d = new Date(startYear, 7, 1); d <= anchor; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    out.push({ year: d.getFullYear(), month: d.getMonth() + 1 })
  }
  return out
}

const BAR_MAX = 0.82

// Smallest 1 / 2 / 2.5 / 5 x 10^k that is >= n (n > 0), else 1.
function niceCeil(n: number): number {
  if (n <= 0) return 1
  const pow = 10 ** Math.floor(Math.log10(n))
  const step = [1, 2, 2.5, 5, 10].find((f) => f * pow >= n)!
  return step * pow
}

// Bars visible at once; the chart scrolls sideways through the rest of the year.
const VISIBLE_MONTHS = 5

// --- Screen ---------------------------------------------------------------

// "Tổng quan hóa đơn đã đóng" — reached from the "Đã thanh toán" tab. Everything
// is derived from `student.bills` on each render, so it reflects payments made
// in the list flow. The summary (counts, total, donut) is scoped to the
// current school year; the total and the donut count paid items only; the month chart lists every month of that school year up to today (July for
// a past year), months without payments included, 5 visible at a time and
// scrolling sideways; it opens on the latest months.
// "Số hóa đơn" counts bills with at least one paid item (fully or partly paid).
export function BillOverviewScreen({
  student,
  year,
  years,
  onYearChange,
  onBack,
  onOpenPaid,
}: {
  student: Student
  // Start of the school year being shown; the row under the student card changes it.
  year: number
  years: number[]
  onYearChange: (startYear: number) => void
  onBack: () => void
  onOpenPaid: () => void
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

  const { startYear, paidItems, paidAmount, paidCount } = summarizeYear(student, now, year)
  // Months are placed by billing period (Bill.year/month), not by when the
  // bill was paid. Each month keeps its paid items grouped per bill.
  const yearMonths = schoolYearMonths(startYear, yearAnchor(now, startYear))
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
  // Every month of the year so far, empty ones included. The chart shows
  // VISIBLE_MONTHS at a time and opens scrolled to the end (this month, or July
  // for a past year); the parent scrolls left for older months.
  const months = yearMonths
  const barsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = barsRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [])
  const maxAmount = Math.max(...months.map((m) => m.amount), 0)
  // Y axis: 0, half and top. The top is a round number that keeps the tallest
  // bar at or below BAR_MAX of the track, so its value label stays inside.
  const axisTop = niceCeil(maxAmount / BAR_MAX)
  const ticks = [0, axisTop / 2, axisTop]
  // No month is preselected: the detail list appears once a bar is tapped.
  const active = months.find((m) => m.key === monthKey)

  return (
    <div className="screen">
      <TopBar title="Tổng quan hóa đơn" onBack={onBack} />
      <StudentHeader student={student} />
      <YearFilter year={startYear} years={years} onChange={onYearChange} />

      <div className="ov-section">
        <div className="ov-kpis">
          <div className="ov-kpi">
            <div className="ov-kpi-label">Tổng số tiền đã thanh toán</div>
            <div className="ov-kpi-value">{fmtDong(paidAmount)}</div>
          </div>
          <div className="ov-kpi ov-kpi-count">
            <div className="ov-kpi-label">Số hóa đơn</div>
            <div className="ov-kpi-value">{paidCount}</div>
            <button className="ov-detail-link" onClick={onOpenPaid}>
              Xem chi tiết ›
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
        {yearMonths.length ? (
          <>
            <div className="ov-chart">
              <div className="ov-yaxis" aria-hidden>
                {ticks.map((t) => (
                  <span key={t} className="ov-ytick" style={{ bottom: `${(t / axisTop) * 100}%` }}>
                    {fmtCompact(t)}
                  </span>
                ))}
              </div>
              <div
                ref={barsRef}
                className={`ov-bars ${months.length > VISIBLE_MONTHS ? 'scroll' : ''}`}
                role="group"
                aria-label="Số tiền đã thanh toán theo tháng"
              >
                {months.map((m) => (
                  <button
                    key={m.key}
                    className={`ov-bar-col ${m.key === active?.key ? 'active' : ''}`}
                    aria-pressed={m.key === active?.key}
                    aria-label={`Tháng ${m.month}/${m.year}: ${fmtMoney(m.amount)}`}
                    onClick={() => setMonthKey(m.key)}
                  >
                    <div className="ov-bar-track">
                      <div className="ov-bar" style={{ height: m.amount > 0 ? `${Math.max((m.amount / axisTop) * 100, 3)}%` : 0 }}>
                        <span className="ov-bar-value">{fmtCompact(m.amount)}</span>
                      </div>
                    </div>
                    <div className="ov-bar-label">T{m.month}</div>
                  </button>
                ))}
              </div>
            </div>

            {active ? (
              <div className="ov-month-list">
                <div className="ov-month-head">
                  <span>
                    Tháng {active.month}/{active.year}
                  </span>
                  <span className="amt">{fmtMoney(active.amount)}</span>
                </div>
                {active.groups.length === 0 ? (
                  <div className="invoice-line">
                    <span>Không có khoản thanh toán trong tháng này</span>
                  </div>
                ) : active.groups.length === 1
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
          <div className="ov-hint">Chưa có khoản thanh toán nào trong năm học này</div>
        )}
      </div>

    </div>
  )
}
