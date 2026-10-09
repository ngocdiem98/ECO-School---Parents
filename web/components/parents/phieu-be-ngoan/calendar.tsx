'use client'

import { useMemo, useState } from 'react'
import type { GoodBehavior } from '@/lib/mock-data'

const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + n)
  return next
}

// Builds the Mon–Sun week rows needed to fully cover `month` (0-indexed),
// including the leading/trailing days of adjacent months.
function buildMonthGrid(year: number, month: number): Date[][] {
  const firstOfMonth = new Date(year, month, 1)
  const lastOfMonth = new Date(year, month + 1, 0)
  const leadingOffset = (firstOfMonth.getDay() + 6) % 7 // Mon=0 .. Sun=6
  const gridStart = addDays(firstOfMonth, -leadingOffset)

  const weeks: Date[][] = []
  let cursor = gridStart
  while (cursor <= lastOfMonth) {
    const week = Array.from({ length: 7 }, (_, i) => addDays(cursor, i))
    weeks.push(week)
    cursor = addDays(cursor, 7)
  }
  return weeks
}

// Academic year "Năm học 2025 - 2026" runs September 2025 → August 2026.
function academicYearMonths(yearLabel: string): { year: number; month: number }[] {
  const match = yearLabel.match(/(\d{4})\s*-\s*(\d{4})/)
  const startYear = match ? Number(match[1]) : new Date().getFullYear()
  const endYear = match ? Number(match[2]) : startYear + 1

  const months: { year: number; month: number }[] = []
  for (let m = 8; m <= 11; m++) months.push({ year: startYear, month: m }) // Sep–Dec
  for (let m = 0; m <= 7; m++) months.push({ year: endYear, month: m }) // Jan–Aug
  return months
}

export function GoodBehaviorCalendar({ goodBehavior }: { goodBehavior: GoodBehavior }) {
  const months = useMemo(() => academicYearMonths(goodBehavior.yearLabel), [goodBehavior.yearLabel])

  const weekStatusByMonday = useMemo(() => {
    const map: Record<string, 'dat' | 'khongdat'> = {}
    for (const c of goodBehavior.cycles) {
      if (c.type === 'week' && c.weekStart) map[c.weekStart] = c.status
    }
    return map
  }, [goodBehavior.cycles])

  const defaultIndex = useMemo(() => {
    const latestWeek = goodBehavior.cycles.find((c) => c.type === 'week' && c.weekStart)
    if (!latestWeek?.weekStart) return months.length - 1
    const [y, m] = latestWeek.weekStart.split('-').map(Number)
    const i = months.findIndex((x) => x.year === y && x.month === m - 1)
    return i === -1 ? months.length - 1 : i
  }, [goodBehavior.cycles, months])

  const [index, setIndex] = useState(defaultIndex)
  const { year, month } = months[index]
  const weeks = useMemo(() => buildMonthGrid(year, month), [year, month])

  return (
    <div className="card gb-cal">
      <div className="gb-cal-head">
        <button
          className="icon-btn"
          aria-label="Tháng trước"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          ‹
        </button>
        <span className="gb-cal-label">
          Tháng {month + 1}/{year}
        </span>
        <button
          className="icon-btn"
          aria-label="Tháng sau"
          disabled={index === months.length - 1}
          onClick={() => setIndex((i) => Math.min(months.length - 1, i + 1))}
        >
          ›
        </button>
      </div>

      <div className="gb-cal-weekdays">
        {WEEKDAY_LABELS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      {weeks.map((week) => {
        const mondayISO = toISODate(week[0])
        const status = weekStatusByMonday[mondayISO]
        return (
          <div className={`gb-cal-week ${status === 'dat' ? 'gb-cal-week--achieved' : ''}`} key={mondayISO}>
            {week.map((d, i) => {
              const inMonth = d.getMonth() === month
              const isSunday = i === 6
              return (
                <div className={`gb-cal-day ${inMonth ? '' : 'gb-cal-day--outside'}`} key={toISODate(d)}>
                  <span className="gb-cal-daynum">{d.getDate()}</span>
                  {isSunday && status && (
                    <span className={`gb-cal-star ${status === 'dat' ? 'gb-cal-star--achieved' : ''}`}>
                      {status === 'dat' ? '★' : '☆'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
