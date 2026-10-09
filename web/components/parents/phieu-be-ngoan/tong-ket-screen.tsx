import type { GoodBehavior } from '@/lib/mock-data'
import { GoodBehaviorCalendar } from './calendar'

// Xếp hạng lớp (Top 3) moved to the "Phiếu của con" tab per user direction;
// this tab now only shows the year's achieved total and the monthly
// calendar.
export function TongKetScreen({ goodBehavior }: { goodBehavior: GoodBehavior }) {
  const r = goodBehavior.ranking
  return (
    <>
      <div className="section-heading" style={{ marginTop: 14 }}>
        {goodBehavior.yearLabel}
      </div>
      <div className="card text-center">
        <div className="card-title" style={{ textAlign: 'center' }}>
          Tổng số phiếu bé ngoan con đã đạt
        </div>
        <div className="gb-total">{r.achieved}</div>
      </div>

      <GoodBehaviorCalendar goodBehavior={goodBehavior} />
    </>
  )
}
