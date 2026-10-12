import type { Feedback, FeedbackStatus } from '@/lib/school-data'
import { feedbackUpdatedAt } from '@/lib/school-data'

export const STATUS_LABEL: Record<FeedbackStatus, string> = {
  new: 'Góp ý mới',
  received: 'Đã tiếp nhận',
  resolved: 'Đã xử lý',
  reopened: 'Mở lại',
}

export const MAX_FILES = 10
export const MAX_FILE_MB = 10

export const nowIso = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

// "Vừa xong" for the first minutes, then "HH:mm · dd/MM".
export function listTime(at: string): string {
  if (Date.now() - new Date(at).getTime() < 120000) return 'Vừa xong'
  return `${at.slice(11, 16)} · ${at.slice(8, 10)}/${at.slice(5, 7)}`
}
export const fullDateTime = (at: string) => `${at.slice(8, 10)}/${at.slice(5, 7)}/${at.slice(0, 4)} ${at.slice(11, 16)}`

// Sender line "Diễm (PH Minh An)": parent + the child's given name (surname dropped).
export const senderLabel = (studentName: string) => `Diễm (PH ${studentName.split(' ').slice(1).join(' ') || studentName})`

export const replyCountLabel = (f: Feedback) => (f.replies.length ? `${f.replies.length} phản hồi` : 'Chưa có phản hồi')
export const lastUpdate = feedbackUpdatedAt
