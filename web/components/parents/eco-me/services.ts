import type { ServiceIntent } from '@/components/parents/shared/use-service-launcher'

// ECO Me service catalogue, in the order of the "Danh sách dịch vụ" screen
// (Dịch vụ giáo dục). Entries with an `intent` open a student-scoped feature
// (student picker when 2+ students qualify, straight in when exactly 1 does);
// `ecoParent` opens the ECO Phụ huynh home; the rest are inert placeholders.
// `icon` is a key into ServiceIcon's icon table, `tint` its gradient.
export interface EcoService {
  id: string
  icon: string
  tint: [string, string]
  label: string
  intent?: ServiceIntent
  ecoParent?: true
}

export const EDU_SERVICES: EcoService[] = [
  { id: 'fee', icon: 'graduation', tint: ['#2F7BFF', '#0A4FD6'], label: 'Đóng Học Phí', intent: 'fee' },
  { id: 'paylater', icon: 'wallet', tint: ['#FFB347', '#F0802A'], label: 'Học phí trả sau' },
  { id: 'hoadon', icon: 'invoice', tint: ['#4DB6FF', '#2B8CF0'], label: 'Hóa đơn', intent: 'hoadon' },
  { id: 'topup', icon: 'card-plus', tint: ['#6B9BFF', '#3D6FE0'], label: 'Nạp điểm vào thẻ', intent: 'topup' },
  { id: 'spending', icon: 'calculator', tint: ['#5B9BFF', '#2F6FE8'], label: 'Lịch sử chi tiêu', intent: 'spending' },
  { id: 'attendance', icon: 'book-open', tint: ['#1FC7D4', '#0A98AE'], label: 'Theo dõi điểm danh', intent: 'attendance' },
  { id: 'absence', icon: 'calendar-plus', tint: ['#6670BD', '#3B4290'], label: 'Báo vắng', intent: 'absence' },
  { id: 'chat', icon: 'chat', tint: ['#2A7BFF', '#0B52DA'], label: 'Trao đổi', intent: 'chat' },
  { id: 'thucdon', icon: 'cloche', tint: ['#FFD24A', '#F5A700'], label: 'Thực đơn', intent: 'menu' },
  { id: 'danthuoc', icon: 'pill', tint: ['#5E8BFF', '#3A63E6'], label: 'Dặn thuốc', intent: 'medicine' },
  { id: 'nhatky', icon: 'care', tint: ['#2FC68F', '#0E9C6B'], label: 'Nhật ký chăm sóc', intent: 'diary' },
  { id: 'timetable', icon: 'timetable', tint: ['#FFD24A', '#F0A800'], label: 'Thời khoá biểu', intent: 'timetable' },
  { id: 'homework', icon: 'tasks', tint: ['#22B58A', '#0D7F5E'], label: 'Bài tập', intent: 'homework' },
  { id: 'bangtin', icon: 'megaphone', tint: ['#22BEDD', '#0A8FB0'], label: 'Bảng tin', intent: 'bulletin' },
  { id: 'hoatdong', icon: 'activity', tint: ['#8A68F5', '#5B3FD6'], label: 'Hoạt động', intent: 'activity' },
  { id: 'gallery', icon: 'gallery', tint: ['#F57AB6', '#D9308A'], label: 'Thư viện ảnh', intent: 'gallery' },
  { id: 'goodbehavior', icon: 'star', tint: ['#FFD24A', '#F0A800'], label: 'Phiếu bé ngoan', intent: 'goodbehavior' },
  { id: 'results', icon: 'library', tint: ['#6E7BF2', '#4553D6'], label: 'Kết quả học tập', intent: 'results' },
  { id: 'hocba', icon: 'notebook', tint: ['#FFAA5C', '#F57C2E'], label: 'Học bạ số' },
  { id: 'feedback', icon: 'feedback', tint: ['#FF9466', '#E5532D'], label: 'Góp ý', intent: 'feedback' },
  { id: 'eco-school', icon: 'id-card', tint: ['#6E86F5', '#4A62DB'], label: 'ECO School', ecoParent: true },
]

// The ECO Me home shows 7 of them, then "Xem thêm" as the 8th tile.
export const HOME_SERVICE_IDS = ['fee', 'attendance', 'timetable', 'thucdon', 'chat', 'hoatdong', 'bangtin']
