'use client'

import { fmtMoney, type BillItem } from '@/lib/mock-data'
import { buildSegments } from './bill-category-donut'

// "Đã thanh toán năm học" card above the tabs: total paid, a small donut and a
// legend of the categories (colour dot, name, amount). "Xem tổng quan ›" opens
// Tổng quan hóa đơn.
export function BillSummaryCard({
  paidItems,
  total,
  onOpenOverview,
}: {
  paidItems: BillItem[]
  total: number
  onOpenOverview: () => void
}) {
  const segments = buildSegments(paidItems)
  const R = 40
  const C = 2 * Math.PI * R
  let offset = 0
  return (
    <section className="bill-summary">
      <div className="bill-summary-head">
        <span>Đã thanh toán năm học</span>
        <button className="bill-summary-link" onClick={onOpenOverview}>
          Xem tổng quan
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className="bill-summary-total">{fmtMoney(total)}</div>
      {segments.length > 0 && (
        <div className="bill-summary-body">
          <svg className="bill-summary-donut" viewBox="0 0 100 100" role="img" aria-label="Phân bổ danh mục">
            <g transform="rotate(-90 50 50)">
              {segments.map((s) => {
                const len = (s.amount / total) * C
                const el = (
                  <circle
                    key={s.id}
                    cx="50"
                    cy="50"
                    r={R}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="16"
                    strokeDasharray={`${Math.max(len - 0.6, 0)} ${C}`}
                    strokeDashoffset={-offset}
                  />
                )
                offset += len
                return el
              })}
            </g>
          </svg>
          <ul className="bill-summary-legend">
            {segments.map((s) => (
              <li key={s.id}>
                <span className="dot" style={{ background: s.color }} />
                <span className="name">{s.label}</span>
                <b>{fmtMoney(s.amount)}</b>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
