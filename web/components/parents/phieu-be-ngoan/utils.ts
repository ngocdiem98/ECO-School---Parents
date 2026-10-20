import type { GoodBehaviorWeek } from '@/lib/mock-data'
import { addDays, weekStartOf } from '@/lib/school-data'

export const fmtShort = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`
export const weekRange = (weekStart: string) => `${fmtShort(weekStart)} - ${fmtShort(addDays(weekStart, 6))}`

// School year runs Aug → Jul: 12/10/2026 → { from: 2026, to: 2027 }.
export function schoolYear(d = new Date()) {
  const from = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1
  return { from, to: from + 1 }
}

export const currentWeekStart = () => weekStartOf(new Date())

export interface MonthGroup {
  key: string // 'YYYY-MM'
  label: string // 'Tháng 10/2026'
  weeks: GoodBehaviorWeek[] // oldest first (tab 1 = first week)
}

// BR-02: a week belongs to the month its first day falls in. Newest month
// first; the current school year only.
export function groupByMonth(weeks: GoodBehaviorWeek[]): MonthGroup[] {
  const map = new Map<string, GoodBehaviorWeek[]>()
  ;[...weeks]
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart))
    .forEach((w) => {
      const key = w.weekStart.slice(0, 7)
      map.set(key, [...(map.get(key) ?? []), w])
    })
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, ws]) => ({ key, label: `Tháng ${Number(key.slice(5))}/${key.slice(0, 4)}`, weeks: ws }))
}

// 'YYYY-MM-DDTHH:mm' → '16:20 13/09/2026'
export const fmtSent = (iso: string) => `${iso.slice(11, 16)} ${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`
