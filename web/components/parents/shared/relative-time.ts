// Relative times used by the link screens (PRD "Nhà trường liên kết Phụ
// huynh – Học sinh" 4.6, and "Quản lý liên kết"): within the hour "n phút
// trước", later the same day "n giờ trước", the day before "Hôm qua", older
// as dd/mm/yyyy.
const pad = (n: number) => String(n).padStart(2, '0')
const fmtDate = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

export function relativeTimeVi(iso: string, now: Date = new Date()): string {
  const d = new Date(iso)
  const mins = Math.max(1, Math.floor((now.getTime() - d.getTime()) / 60000))
  if (sameDay(d, now)) return mins < 60 ? `${mins} phút trước` : `${Math.floor(mins / 60)} giờ trước`
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (sameDay(d, yesterday)) return 'Hôm qua'
  return fmtDate(d)
}

// "Tham gia 2 giờ trước" / "Tham gia hôm qua" / "Tham gia từ ngày 02/02/2026".
export function joinedTextVi(iso: string, now: Date = new Date()): string {
  const rel = relativeTimeVi(iso, now)
  if (rel === 'Hôm qua') return 'Tham gia hôm qua'
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(rel)) return `Tham gia từ ngày ${rel}`
  return `Tham gia ${rel}`
}

// 0912 345 789 → 09***789
export function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, '')
  return d.length >= 5 ? `${d.slice(0, 2)}***${d.slice(-3)}` : phone
}

// "Thứ Hai, 26/10/2026 · 11:02" (Chi tiết thẻ, Lịch sử hoạt động của hồ sơ).
const WEEKDAYS_VI = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
export function activityTimeVi(iso: string): string {
  const d = new Date(iso)
  return `${WEEKDAYS_VI[d.getDay()]}, ${fmtDate(d)} · ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
