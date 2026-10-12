// Shared helpers for Dặn thuốc. Dates are ISO yyyy-mm-dd strings (what
// <input type="date"> produces), times are 'HH:mm'.

export const MAX_DOSES = 3
export const MAX_PHOTOS = 10
export const ORDER_NOTE_MIN = 10
export const ORDER_NOTE_MAX = 256
export const DOSE_NOTE_MIN = 2
export const DOSE_NOTE_MAX = 255

// PRD v1.3 (EDU-768): times can only be picked on 30-minute marks.
export const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0')
  return `${h}:${i % 2 ? '30' : '00'}`
})
export const DEFAULT_FIRST_TIME = '08:00'

export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function todayIso(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// "Giờ thứ n+1 = giờ thứ n + 4h" (PRD v1.1), capped at the last selectable mark.
export function plusFourHours(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const next = h * 60 + m + 4 * 60
  const capped = Math.min(next, 23 * 60 + 30)
  const hh = String(Math.floor(capped / 60)).padStart(2, '0')
  return `${hh}:${capped % 60 === 0 ? '00' : '30'}`
}

import type { MedicineOrder, MedicineStatus } from '@/lib/mock-data'

// Every date from `from` to `to`, inclusive (ISO strings).
export function daysBetween(from: string, to: string): string[] {
  const out: string[] = []
  const d = new Date(from + 'T00:00:00')
  const end = new Date(to + 'T00:00:00')
  const p = (n: number) => String(n).padStart(2, '0')
  while (d <= end && out.length < 366) {
    out.push(`${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`)
    d.setDate(d.getDate() + 1)
  }
  return out
}

// "Thứ 4, 04/06/2026" (Chủ nhật for Sunday).
export function dayTitle(iso: string): string {
  const dow = new Date(iso + 'T00:00:00').getDay()
  return `${dow === 0 ? 'Chủ nhật' : 'Thứ ' + (dow + 1)}, ${fmtDate(iso)}`
}

export const doseKey = (date: string, index: number) => `${date}|${index}`

// A "Đã gửi" order turns "Đã hoàn thành" once the teacher confirmed every dose
// of every day; a cancelled order stays cancelled.
export function effectiveMedicineStatus(o: MedicineOrder): MedicineStatus {
  if (o.status !== 'sent') return o.status
  const days = daysBetween(o.from, o.to)
  const done = days.every((d) => o.doses.every((_, i) => o.confirmations?.[doseKey(d, i)]))
  return days.length > 0 && done ? 'completed' : 'sent'
}
