import type { ServiceIntent } from '@/components/parents/shared/use-service-launcher'

// Glyph-icon catalogue of the ECO Phụ huynh app (Home grid and Học sinh page),
// in display order. Same glyph-character icon system as the vanilla app
// (scripts/app.js ICONS), extended with the services built later. An entry
// without `intent` is an inert placeholder (Học bạ số: its PRD is empty).
export interface ParentService {
  id: string
  icon: string
  label: string
  intent?: ServiceIntent
}

export const PARENT_SERVICES: ParentService[] = [
  { id: 'fee', icon: '▣', label: 'Đóng học phí', intent: 'fee' },
  { id: 'topup', icon: '◈', label: 'Nạp điểm vào thẻ', intent: 'topup' },
  { id: 'spending', icon: '▥', label: 'Lịch sử chi tiêu', intent: 'spending' },
  { id: 'timetable', icon: '▦', label: 'Thời khoá biểu', intent: 'timetable' },
  { id: 'attendance', icon: '◷', label: 'Theo dõi điểm danh', intent: 'attendance' },
  { id: 'absence', icon: '✎', label: 'Báo vắng', intent: 'absence' },
  { id: 'homework', icon: '▧', label: 'Bài tập', intent: 'homework' },
  { id: 'results', icon: '▨', label: 'Kết quả học tập', intent: 'results' },
  { id: 'hocba', icon: '▩', label: 'Học bạ số' },
  { id: 'thucdon', icon: '▥', label: 'Thực đơn', intent: 'menu' },
  { id: 'hoatdong', icon: '◐', label: 'Hoạt động', intent: 'activity' },
  { id: 'hoadon', icon: '▤', label: 'Hóa đơn', intent: 'hoadon' },
  { id: 'danthuoc', icon: '✛', label: 'Dặn thuốc', intent: 'medicine' },
  { id: 'bangtin', icon: '▬', label: 'Bảng tin', intent: 'bulletin' },
  { id: 'nhatky', icon: '▭', label: 'Nhật ký chăm sóc', intent: 'diary' },
  { id: 'goodbehavior', icon: '★', label: 'Phiếu bé ngoan', intent: 'goodbehavior' },
  { id: 'thuvien', icon: '▣', label: 'Thư viện ảnh', intent: 'gallery' },
  { id: 'gopy', icon: '✉', label: 'Góp ý', intent: 'feedback' },
  { id: 'chat', icon: '❝', label: 'Trao đổi', intent: 'chat' },
]

export const PAGE_SIZE = 8

export function chunk<T>(items: T[], size = PAGE_SIZE): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}
