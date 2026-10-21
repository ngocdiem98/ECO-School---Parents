'use client'

import { fmtMoney } from '@/lib/mock-data'

// "Tổng số tiền" card under the Chưa thanh toán / Đã thanh toán tabs. On
// "Chưa thanh toán" it sums what is still left to pay in the school year; on
// "Đã thanh toán" it sums what was paid and "Xem chi tiết ›" opens Tổng quan
// hóa đơn (`onOpenOverview` is omitted on the unpaid tab, so no link there).
export function BillSummaryCard({ total, onOpenOverview }: { total: number; onOpenOverview?: () => void }) {
  return (
    <section className="bill-summary">
      <div className="bill-summary-head">
        <span>Tổng số tiền</span>
        {onOpenOverview && (
          <button className="bill-summary-link" onClick={onOpenOverview}>
            Xem chi tiết
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
      <div className="bill-summary-total">{fmtMoney(total)}</div>
    </section>
  )
}
