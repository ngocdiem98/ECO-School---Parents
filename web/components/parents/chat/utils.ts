import type { ChatMessage } from '@/lib/school-data'

// Relative time shown on the list ("5 phút", "3 giờ", else dd/MM).
export function timeAgo(at: string): string {
  const diff = Date.now() - new Date(at).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'Vừa xong'
  if (min < 60) return `${min} phút`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} giờ`
  return `${at.slice(8, 10)}/${at.slice(5, 7)}`
}

// Last-message preview: "người gửi: tin nhắn" (PRD 5.1 update 28-29/07).
export function previewOf(m: ChatMessage): string {
  const who = m.from === 'me' ? 'Bạn' : m.sender
  if (m.order) return `${who}: ${m.order.kind === 'medicine' ? 'Đơn dặn thuốc' : 'Đơn báo vắng'}`
  if (m.text) return `${who}: ${m.text}`
  if (m.images?.length) return `${who} đã gửi hình ảnh`
  return who
}
