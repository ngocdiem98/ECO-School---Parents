import type { ServiceIntent } from '@/components/parents/shared/use-service-launcher'

// ECO Me service catalogue, in the order of the "Danh sách dịch vụ" screen
// (Dịch vụ giáo dục). Same glyph-character icon system as the ECO Phụ huynh
// Home grid. Entries with an `intent` open a student-scoped feature (student
// picker when 2+ students qualify, straight in when exactly 1 does);
// `ecoParent` opens the ECO Phụ huynh home; the rest are inert placeholders.
export interface EcoService {
  id: string
  icon: string
  label: string
  intent?: ServiceIntent
  ecoParent?: true
}

export const EDU_SERVICES: EcoService[] = [
  { id: 'fee', icon: '▣', label: 'Đóng học phí', intent: 'fee' },
  { id: 'paylater', icon: '◫', label: 'Học phí trả sau' },
  { id: 'hoadon', icon: '▤', label: 'Hóa đơn', intent: 'hoadon' },
  { id: 'topup', icon: '◈', label: 'Nạp điểm vào thẻ', intent: 'topup' },
  { id: 'spending', icon: '▥', label: 'Lịch sử chi tiêu' },
  { id: 'attendance', icon: '◷', label: 'Theo dõi điểm danh' },
  { id: 'absence', icon: '✎', label: 'Báo vắng', intent: 'absence' },
  { id: 'chat', icon: '❝', label: 'Trao đổi' },
  { id: 'thucdon', icon: '▥', label: 'Thực đơn' },
  { id: 'danthuoc', icon: '✛', label: 'Dặn thuốc' },
  { id: 'nhatky', icon: '▭', label: 'Nhật ký chăm sóc' },
  { id: 'timetable', icon: '▦', label: 'Thời khoá biểu' },
  { id: 'homework', icon: '▧', label: 'Bài tập', intent: 'homework' },
  { id: 'bangtin', icon: '▬', label: 'Bảng tin' },
  { id: 'hoatdong', icon: '◐', label: 'Hoạt động' },
  { id: 'goodbehavior', icon: '★', label: 'Phiếu bé ngoan', intent: 'goodbehavior' },
  { id: 'results', icon: '▨', label: 'Kết quả học tập', intent: 'results' },
  { id: 'hocba', icon: '▩', label: 'Học bạ số' },
  { id: 'eco-teacher', icon: '◉', label: 'ECO Giáo viên' },
  { id: 'eco-parent', icon: '◎', label: 'ECO Phụ huynh', ecoParent: true },
]

// The ECO Me home shows 7 of them, then "Xem thêm" as the 8th tile. Only
// services that are actually built, so every tile on the home works.
export const HOME_SERVICE_IDS = ['fee', 'hoadon', 'topup', 'absence', 'homework', 'results', 'goodbehavior']
