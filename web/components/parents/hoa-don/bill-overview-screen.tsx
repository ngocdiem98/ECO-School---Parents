'use client'

import { useState } from 'react'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import { fmtMoney, sumItems, type BillItem, type Student } from '@/lib/mock-data'

const fmtDong = (n: number) => `${n.toLocaleString('vi-VN')} đồng`

// --- Data derivation ------------------------------------------------------

// Vietnamese school year runs Aug → Jul: Oct 2026 and Mar 2027 both belong to
// "2026 - 2027".
function schoolYearStart(now: Date): number {
  return now.getMonth() + 1 >= 8 ? now.getFullYear() : now.getFullYear() - 1
}

function inSchoolYear(year: number, month: number, startYear: number): boolean {
  const key = year * 12 + month
  return key >= startYear * 12 + 8 && key <= (startYear + 1) * 12 + 7
}

// BillItem has no category field; the mock data names items consistently, so
// derive it: học phí / tiền ăn collapse across months, anything else is its
// own category (Cơ sở vật chất, Tiếng Anh, Ngoại khóa, …).
function categoryOf(item: BillItem): string {
  const name = item.name
  if (/^học phí/i.test(name)) return 'Học phí'
  if (/^tiền ăn/i.test(name)) return 'Tiền ăn'
  return name
}

const MAX_SEGMENTS = 4
// A category under this share of the total is folded into "Khác".
const MIN_SEGMENT_SHARE = 0.05
const OTHER_ID = '__other'
// Darkest → lightest; "Khác" always takes the last (lightest) shade.
const SEGMENT_COLORS = ['#111111', '#595959', '#8f8f8f', '#d6d6d6']

interface Segment {
  id: string
  label: string
  color: string
  amount: number
  pct: number
  // Only on the grouped "Khác" segment: the categories folded into it.
  children?: { label: string; amount: number }[]
}

// Categories under MIN_SEGMENT_SHARE of the total are folded into one "Khác"
// (its own total may exceed that share). At most MAX_SEGMENTS segments: if more
// remain, the smallest ones are folded into "Khác" as well.
function buildSegments(items: BillItem[]): Segment[] {
  const byCat = new Map<string, number>()
  items.forEach((it) => byCat.set(categoryOf(it), (byCat.get(categoryOf(it)) ?? 0) + it.amount))
  const cats = [...byCat.entries()]
    .map(([label, amount]) => ({ label, amount }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount)
  const total = sumOf(cats)

  let head = cats.filter((c) => c.amount / total >= MIN_SEGMENT_SHARE)
  let rest = cats.filter((c) => c.amount / total < MIN_SEGMENT_SHARE)
  if (head.length + (rest.length ? 1 : 0) > MAX_SEGMENTS) {
    const keep = MAX_SEGMENTS - 1
    rest = [...head.slice(keep), ...rest]
    head = head.slice(0, keep)
  }
  const raw = head.map((c) => ({ id: c.label, label: c.label, amount: c.amount, children: undefined as Segment['children'] }))
  if (rest.length) raw.push({ id: OTHER_ID, label: 'Khác', amount: sumOf(rest), children: rest })

  const pcts = toPercents(raw.map((r) => r.amount))
  return raw.map((r, i) => ({
    ...r,
    pct: pcts[i],
    color: i === raw.length - 1 && raw.length > 1 ? SEGMENT_COLORS[3] : SEGMENT_COLORS[i],
  }))
}

const sumOf = (xs: { amount: number }[]) => xs.reduce((n, x) => n + x.amount, 0)

const pctLabel = (s: Segment) => (s.pct === 0 && s.amount > 0 ? '<1%' : `${s.pct}%`)

// Compact amount for the bar tops: 1,25tr / 200k.
function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, '').replace('.', ',')}tr`
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

// Largest-remainder rounding so the legend percentages always add up to 100.
function toPercents(values: number[]): number[] {
  const total = values.reduce((a, b) => a + b, 0)
  if (!total) return values.map(() => 0)
  const raw = values.map((v) => (v / total) * 100)
  const floors = raw.map(Math.floor)
  let left = 100 - floors.reduce((a, b) => a + b, 0)
  const order = raw.map((r, i) => ({ i, rem: r - floors[i] })).sort((a, b) => b.rem - a.rem)
  for (const { i } of order) {
    if (left <= 0) break
    floors[i] += 1
    left -= 1
  }
  return floors
}

// The most recent MONTHS_WINDOW months ending at `now`, oldest first.
const MONTHS_WINDOW = 5
function recentMonths(now: Date): { year: number; month: number }[] {
  return Array.from({ length: MONTHS_WINDOW }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS_WINDOW - 1 - i), 1)
    return { year: d.getFullYear(), month: d.getMonth() + 1 }
  })
}

// --- Donut ----------------------------------------------------------------

const R = 44
const CIRC = 2 * Math.PI * R

function Donut({
  segments,
  selected,
  onSelect,
}: {
  segments: Segment[]
  selected: string | null
  onSelect: (id: string) => void
}) {
  const total = segments.reduce((n, s) => n + s.amount, 0)
  let offset = 0
  return (
    <svg className="ov-donut" viewBox="0 0 120 120" role="group" aria-label="Phân bổ danh mục">
      <g transform="rotate(-90 60 60)">
        {segments.map((s) => {
          const len = (s.amount / total) * CIRC
          const gap = segments.length > 1 ? 1.5 : 0
          const dash = Math.max(len - gap, 0)
          const el = (
            <circle
              key={s.id}
              className={`ov-donut-seg ${selected === s.id ? 'active' : ''}`}
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={selected === s.id ? 26 : 20}
              strokeDasharray={`${dash} ${CIRC - dash}`}
              strokeDashoffset={-offset}
              role="button"
              tabIndex={0}
              aria-label={`${s.label} ${pctLabel(s)}`}
              aria-pressed={selected === s.id}
              onClick={() => onSelect(s.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(s.id)
                }
              }}
            />
          )
          offset += len
          return el
        })}
      </g>
    </svg>
  )
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
  onBack,
  onChangeStudent,
  onOpenPaid,
  onOpenUnpaid,
}: {
  student: Student
  onBack: () => void
  onChangeStudent: () => void
  onOpenPaid: () => void
  onOpenUnpaid: () => void
}) {
  const [now] = useState(() => new Date())
  const [category, setCategory] = useState<string | null>(null)
  const [showOther, setShowOther] = useState(false)
  const [monthKey, setMonthKey] = useState<string | null>(null)
  // Bill ids whose items are collapsed in the month detail (all open by default).
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const toggleBill = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })

  const startYear = schoolYearStart(now)
  const yearBills = student.bills.filter((b) => inSchoolYear(b.year, b.month, startYear))
  // Total and donut only count what has been paid.
  const paidItems = yearBills.flatMap((b) => b.items.filter((it) => it.paid))
  // Partition of yearBills: fully paid vs. anything with an open item.
  const unpaidCount = yearBills.filter((b) => b.items.some((it) => !it.paid)).length
  const paidCount = yearBills.length - unpaidCount

  const segments = buildSegments(paidItems)
  const selectedSeg = segments.find((s) => s.id === category) ?? null
  const otherSeg = segments.find((s) => s.id === OTHER_ID)

  const pickSegment = (id: string) => {
    // Tapping the selected segment again clears it; "Khác" also opens its sheet.
    const next = category === id ? null : id
    setCategory(next)
    if (next === OTHER_ID) setShowOther(true)
  }

  // Months are placed by billing period (Bill.year/month), not by when the
  // bill was paid. Each month keeps its paid items grouped per bill.
  const months = recentMonths(now)
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
      <StudentHeader student={student} onChangeStudent={onChangeStudent} />

      <div className="ov-section">
        <div className="ov-year">
          Năm học {startYear} - {startYear + 1}
        </div>
        <div className="ov-total">
          Tổng số tiền thanh toán: <b>{fmtDong(sumItems(paidItems))}</b> ({yearBills.length} hóa đơn)
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
            <button className="ov-stat-link" onClick={onOpenUnpaid}>
              Thanh toán ngay ›
            </button>
          </div>
        </div>
      </div>

      <div className="ov-section">
        <div className="ov-heading">Phân bổ danh mục</div>
        {segments.length ? (
          <>
            <div className="ov-donut-row">
              <Donut segments={segments} selected={category} onSelect={pickSegment} />
              <div className="ov-legend">
                {segments.map((s) => (
                  <button
                    key={s.id}
                    className={`ov-legend-item ${category === s.id ? 'active' : ''}`}
                    onClick={() => pickSegment(s.id)}
                  >
                    <span className="ov-dot" style={{ background: s.color }} />
                    {pctLabel(s)} - {s.label}
                  </button>
                ))}
              </div>
            </div>
            {selectedSeg ? (
              <div className="ov-callout">
                Tổng số tiền ({selectedSeg.label}): <b>{fmtDong(selectedSeg.amount)}</b>
                {selectedSeg.children && (
                  <button className="ov-callout-link" onClick={() => setShowOther(true)}>
                    Xem chi tiết ›
                  </button>
                )}
              </div>
            ) : (
              <div className="ov-hint">Chạm vào biểu đồ để xem số tiền theo danh mục</div>
            )}
          </>
        ) : (
          <div className="ov-hint">Chưa có hóa đơn trong năm học này</div>
        )}
      </div>

      <div className="ov-section">
        <div className="ov-heading">Theo tháng</div>
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

      {showOther && otherSeg?.children && (
        <OverlayPortal>
          <div className="scrim" onClick={() => setShowOther(false)} />
          <div className="sheet">
            <div className="sheet-head">
              <span className="t">Khác · {fmtDong(otherSeg.amount)}</span>
              <button className="icon-btn" onClick={() => setShowOther(false)} aria-label="Đóng">
                ✕
              </button>
            </div>
            <div className="sheet-body">
              {otherSeg.children.map((c) => (
                <div className="invoice-line" key={c.label}>
                  <span>{c.label}</span>
                  <span className="amt">{fmtMoney(c.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </OverlayPortal>
      )}
    </div>
  )
}
