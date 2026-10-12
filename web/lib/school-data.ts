// Mock content for the school-facing services (Thực đơn, Hoạt động, Bảng tin,
// Nhật ký chăm sóc, Trao đổi). Built from the PRDs under "ECO School -
// Phụ huynh" on Confluence (PH-02, PH-03, PH-08, PH-12, PH-14); there is no
// vanilla counterpart. Like MOCK_STUDENTS these are mutated in place (hearts,
// pins, sent messages) and persist until a page reload. Content is scoped by
// `classKey` (the student's `className`) the way the PRDs scope it to the
// class of the student being viewed.

import type { Student } from './mock-data'

// ---- placeholder media ------------------------------------------------------
function svgUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// Soft gradient "photo" with a caption, standing in for real images.
export function scene(label: string, hue: number): string {
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},80%,82%)"/>` +
      `<stop offset="1" stop-color="hsl(${(hue + 40) % 360},70%,62%)"/></linearGradient></defs>` +
      `<rect width="800" height="800" fill="url(#g)"/><circle cx="560" cy="250" r="90" fill="rgba(255,255,255,.55)"/>` +
      `<path d="M0 640 Q200 520 400 610 T800 560 V800 H0Z" fill="rgba(0,44,84,.22)"/>` +
      `<text x="400" y="430" font-family="Arial" font-size="46" font-weight="700" text-anchor="middle" fill="#002C54">${label}</text></svg>`,
  )
}

export function pdfPage(title: string): string {
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">` +
      `<rect width="600" height="800" fill="#fff"/><rect x="0" y="0" width="600" height="90" fill="#E5322D"/>` +
      `<text x="40" y="58" font-family="Arial" font-size="36" font-weight="700" fill="#fff">PDF</text>` +
      `<text x="40" y="170" font-family="Arial" font-size="30" font-weight="700" fill="#002C54">${title}</text>` +
      [0, 1, 2, 3, 4, 5, 6, 7, 8]
        .map((i) => `<rect x="40" y="${220 + i * 46}" width="${i % 3 === 2 ? 300 : 520}" height="14" rx="7" fill="#D6DEE8"/>`)
        .join('') +
      `</svg>`,
  )
}

// ---- week helpers -----------------------------------------------------------
const pad = (n: number) => String(n).padStart(2, '0')
export function isoOf(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
// Monday of the week containing `d` (weeks run Mon–Sun).
export function weekStartOf(d: Date): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7))
  return isoOf(x)
}
export function addDays(iso: string, n: number): string {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return isoOf(d)
}
export function fmtDay(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}
export function fmtDateTime(at: string): string {
  return `${fmtDay(at)} ${at.slice(11, 16)}`
}
const WEEKDAY = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
export function weekdayName(iso: string): string {
  return WEEKDAY[new Date(iso.slice(0, 10) + 'T00:00:00').getDay()]
}

// ============================================================================
// Thực đơn (PH-08)
// ============================================================================
export interface MenuRow {
  meal: string
  days: string[] // Mon..Fri
}
export interface MenuWeek {
  weekStart: string // Monday, ISO
  scope: 'school' | 'class'
  classKey?: string
  schoolKey: string // student.school
  kind: 'table' | 'image'
  rows?: MenuRow[]
  image?: string
}

const KID_ROWS: MenuRow[] = [
  { meal: 'Sáng', days: ['Phở gà', 'Bún riêu', 'Cháo thịt bằm', 'Bánh mì trứng', 'Mì Ý sốt bò'] },
  { meal: 'Trưa', days: ['Cơm, thịt kho, canh bí', 'Cơm, cá sốt cà, canh rau', 'Cơm, gà rim, canh cải', 'Cơm, trứng chiên, canh bầu', 'Cơm, sườn xào, canh mướp'] },
  { meal: 'Xế', days: ['Sữa chua', 'Chè đậu xanh', 'Bánh flan', 'Trái cây', 'Sữa tươi, bánh quy'] },
  { meal: 'Phụ chiều', days: ['Bánh bao', 'Cháo yến mạch', 'Súp lơ hầm', 'Bánh bông lan', 'Nui sao'] },
]
const KID_ROWS_ALT: MenuRow[] = KID_ROWS.map((r) => ({
  ...r,
  days: [...r.days.slice(2), ...r.days.slice(0, 2)],
}))
const HS_ROWS: MenuRow[] = [
  { meal: 'Trưa', days: ['Cơm, gà chiên, canh chua', 'Cơm, thịt heo quay, canh cải', 'Cơm, cá kho, canh bí', 'Cơm, bò xào, canh rau', 'Bún chả, nem rán'] },
  { meal: 'Xế', days: ['Trái cây', 'Sữa chua', 'Bánh ngọt', 'Chè', 'Sữa tươi'] },
]

export function menuPoster(title: string, rows: MenuRow[]): string {
  const lines = rows
    .map((r, i) => `<text x="40" y="${150 + i * 90}" font-family="Arial" font-size="26" font-weight="700" fill="#002C54">${r.meal}: ${r.days[0]}, ${r.days[1]}…</text>`)
    .join('')
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="900" viewBox="0 0 720 900"><rect width="720" height="900" fill="#FFF8E1"/>` +
      `<rect width="720" height="90" fill="#FFCC33"/><text x="360" y="60" font-family="Arial" font-size="34" font-weight="800" text-anchor="middle" fill="#002C54">${title}</text>${lines}</svg>`,
  )
}

const THIS_WEEK = weekStartOf(new Date())
export const MENUS: MenuWeek[] = [
  { weekStart: THIS_WEEK, scope: 'school', schoolKey: 'Trường Mầm non Demo', kind: 'table', rows: KID_ROWS },
  { weekStart: THIS_WEEK, scope: 'class', classKey: 'Lớp Lá', schoolKey: 'Trường Mầm non Demo', kind: 'table', rows: KID_ROWS_ALT },
  { weekStart: THIS_WEEK, scope: 'school', schoolKey: 'Trường FINVIET', kind: 'table', rows: HS_ROWS },
  {
    weekStart: addDays(THIS_WEEK, -7),
    scope: 'school',
    schoolKey: 'Trường Mầm non Demo',
    kind: 'image',
    image: menuPoster('THỰC ĐƠN TUẦN TRƯỚC', KID_ROWS),
  },
  {
    weekStart: addDays(THIS_WEEK, -7),
    scope: 'school',
    schoolKey: 'Trường FINVIET',
    kind: 'image',
    image: menuPoster('THỰC ĐƠN TUẦN TRƯỚC', HS_ROWS),
  },
  { weekStart: addDays(THIS_WEEK, 7), scope: 'school', schoolKey: 'Trường Mầm non Demo', kind: 'table', rows: KID_ROWS_ALT },
]

// Class menu wins over the school-wide one (PRD UC-03 business rule).
export function menuFor(student: Student, weekStart: string): MenuWeek | null {
  const same = MENUS.filter((m) => m.weekStart === weekStart && m.schoolKey === student.school)
  return same.find((m) => m.scope === 'class' && m.classKey === student.className) ?? same.find((m) => m.scope === 'school') ?? null
}

// ============================================================================
// Hoạt động (PH-02)
// ============================================================================
export interface MediaItem {
  id: string
  kind: 'image' | 'video'
  src: string
  duration?: string // mm:ss for videos
}
export interface Activity {
  id: string
  classKey: string
  schoolKey: string
  author: string
  at: string // 'YYYY-MM-DDTHH:mm'
  content: string
  media: MediaItem[]
  likes: number
  liked: boolean
}

const imgs = (prefix: string, labels: string[], hue: number): MediaItem[] =>
  labels.map((l, i) => ({ id: `${prefix}${i}`, kind: 'image', src: scene(l, (hue + i * 23) % 360) }))

export const ACTIVITIES: Activity[] = [
  {
    id: 'ac1',
    classKey: 'Lớp Lá',
    schoolKey: 'Trường Mầm non Demo',
    author: 'Cô Nguyễn Ngọc Đài Trang',
    at: '2026-10-09T15:20',
    content:
      'Hôm nay các bé lớp Lá có buổi học vẽ tranh chủ đề "Ngôi nhà mơ ước". Các bé rất hào hứng sáng tạo, dùng màu sắc tươi vui để thể hiện ngôi nhà của riêng mình. Cô giáo khen các bé đã rất tập trung và biết giúp đỡ bạn bè khi dùng chung màu vẽ. Phụ huynh có thể trò chuyện thêm với bé ở nhà về bức tranh mà bé đã vẽ nhé!',
    media: imgs('ac1m', ['Vẽ tranh 1', 'Vẽ tranh 2', 'Vẽ tranh 3', 'Vẽ tranh 4', 'Vẽ tranh 5', 'Vẽ tranh 6', 'Vẽ tranh 7'], 20),
    likes: 12,
    liked: false,
  },
  {
    id: 'ac2',
    classKey: 'Lớp Lá',
    schoolKey: 'Trường Mầm non Demo',
    author: 'Cô Lê Thị Hồng',
    at: '2026-10-08T10:05',
    content: 'Giờ thể dục buổi sáng của lớp Lá 🏃‍♀️ Các bé khởi động cùng cô rất vui nhộn.',
    media: [
      { id: 'ac2m0', kind: 'video', src: scene('Video thể dục', 200), duration: '00:30' },
      ...imgs('ac2m', ['Thể dục'], 160).map((m, i) => ({ ...m, id: `ac2mi${i}` })),
    ],
    likes: 8,
    liked: true,
  },
  {
    id: 'ac3',
    classKey: 'Lớp Lá',
    schoolKey: 'Trường Mầm non Demo',
    author: 'Cô Nguyễn Ngọc Đài Trang',
    at: '2026-10-06T09:40',
    content: 'Các bé tham gia hoạt động làm quen với chữ cái. Cả lớp cùng ghép chữ A, Ă, Â bằng đất nặn.',
    media: imgs('ac3m', ['Đất nặn', 'Chữ cái', 'Ghép chữ'], 300),
    likes: 5,
    liked: false,
  },
  {
    id: 'ac4',
    classKey: 'Lớp Lá',
    schoolKey: 'Trường Mầm non Demo',
    author: 'Cô Lê Thị Hồng',
    at: '2026-10-02T14:12',
    content: 'Góc thiên nhiên của lớp có thêm chậu cây mới do các bé cùng chăm sóc.',
    media: imgs('ac4m', ['Góc thiên nhiên'], 100),
    likes: 3,
    liked: false,
  },
  {
    id: 'ac5',
    classKey: 'Lớp Lá',
    schoolKey: 'Trường Mầm non Demo',
    author: 'Cô Lê Thị Hồng',
    at: '2026-09-28T16:30',
    content: 'Cô và các bé cùng dọn dẹp lớp học sau giờ chơi. Bé nào cũng biết xếp đồ chơi gọn gàng.',
    media: [],
    likes: 0,
    liked: false,
  },
  {
    id: 'ac6',
    classKey: 'Lớp 10A1',
    schoolKey: 'Trường FINVIET',
    author: 'Thầy Phạm Quốc Huy',
    at: '2026-10-09T17:00',
    content:
      'Lớp 10A1 tham gia ngày hội STEM của trường. Các em đã trình bày dự án "Máy lọc nước mini" và nhận nhiều lời khen từ ban giám khảo. Chúc mừng các em!',
    media: imgs('ac6m', ['STEM 1', 'STEM 2', 'STEM 3', 'STEM 4'], 210),
    likes: 21,
    liked: true,
  },
  {
    id: 'ac7',
    classKey: 'Lớp 10A1',
    schoolKey: 'Trường FINVIET',
    author: 'Cô Phùng Thị Thu',
    at: '2026-10-05T11:15',
    content: 'Tiết sinh hoạt lớp: bầu ban cán sự mới và thống nhất nội quy lớp học học kỳ I.',
    media: imgs('ac7m', ['Sinh hoạt lớp', 'Bầu cán sự'], 40),
    likes: 9,
    liked: false,
  },
]

export function activitiesFor(student: Student): Activity[] {
  return ACTIVITIES.filter((a) => a.classKey === student.className && a.schoolKey === student.school).sort((a, b) =>
    b.at.localeCompare(a.at),
  )
}

// ============================================================================
// Bảng tin (PH-03)
// ============================================================================
export const BULLETIN_CATEGORIES = [
  'Tất cả',
  'Thông báo chung',
  'Kế hoạch học tập',
  'Thời khóa biểu',
  'Thực đơn',
  'Sự kiện',
  'Lịch nghỉ',
] as const
export type BulletinCategory = Exclude<(typeof BULLETIN_CATEGORIES)[number], 'Tất cả'>

export interface BulletinAttachment {
  kind: 'image' | 'pdf'
  src: string
  name: string
}
export interface BulletinPost {
  id: string
  schoolKey: string
  classKey?: string // omitted = whole school
  category: BulletinCategory
  at: string
  title: string
  content: string
  attachments: BulletinAttachment[]
}

export const BULLETIN: BulletinPost[] = [
  {
    id: 'bt1',
    schoolKey: 'Trường Mầm non Demo',
    category: 'Lịch nghỉ',
    at: '2026-10-09T08:30',
    title: 'Thông báo lịch nghỉ lễ Giỗ Tổ và nghỉ bù',
    content:
      'Kính gửi quý phụ huynh,\n\nNhà trường thông báo lịch nghỉ: học sinh nghỉ từ thứ Hai đến hết thứ Ba tuần sau. Lớp học sẽ hoạt động trở lại bình thường vào thứ Tư. Trong thời gian nghỉ, nhà trường không tổ chức bán trú.\n\nXin cảm ơn quý phụ huynh đã phối hợp.',
    attachments: [],
  },
  {
    id: 'bt2',
    schoolKey: 'Trường Mầm non Demo',
    category: 'Sự kiện',
    at: '2026-10-07T14:00',
    title: 'Mời tham dự Ngày hội Gia đình Demo 2026',
    content:
      'Nhà trường trân trọng kính mời quý phụ huynh cùng các bé tham dự Ngày hội Gia đình vào sáng thứ Bảy tuần này tại sân trường. Chương trình gồm trò chơi vận động, gian hàng ẩm thực và biểu diễn văn nghệ.',
    attachments: [
      { kind: 'image', src: scene('Ngày hội Gia đình', 30), name: 'poster' },
      { kind: 'pdf', src: pdfPage('Chương trình Ngày hội Gia đình'), name: 'chuong-trinh.pdf' },
    ],
  },
  {
    id: 'bt3',
    schoolKey: 'Trường Mầm non Demo',
    classKey: 'Lớp Lá',
    category: 'Kế hoạch học tập',
    at: '2026-10-05T09:00',
    title: 'Kế hoạch giáo dục chủ đề "Bản thân" - Lớp Lá',
    content: 'Phụ huynh vui lòng xem kế hoạch chủ đề tháng 10 của lớp Lá trong file đính kèm và trao đổi thêm với cô giáo nếu cần.',
    attachments: [{ kind: 'pdf', src: pdfPage('Kế hoạch chủ đề Bản thân'), name: 'ke-hoach.pdf' }],
  },
  {
    id: 'bt4',
    schoolKey: 'Trường Mầm non Demo',
    category: 'Thực đơn',
    at: '2026-10-05T07:45',
    title: 'Thực đơn tuần mới đã được cập nhật',
    content: 'Thực đơn bán trú của tuần này đã được nhà trường cập nhật. Phụ huynh xem chi tiết tại mục Thực đơn.',
    attachments: [],
  },
  {
    id: 'bt5',
    schoolKey: 'Trường Mầm non Demo',
    category: 'Thông báo chung',
    at: '2026-09-30T16:20',
    title: 'Nhắc nhở đóng học phí tháng 10',
    content: 'Nhà trường nhắc phụ huynh hoàn tất học phí tháng 10 trước ngày 15/10. Phụ huynh có thể thanh toán ngay trong ECO Me, mục Đóng Học Phí.',
    attachments: [],
  },
  {
    id: 'bt6',
    schoolKey: 'Trường FINVIET',
    category: 'Thông báo chung',
    at: '2026-10-09T10:10',
    title: 'Thông báo họp phụ huynh đầu năm học',
    content:
      'Nhà trường tổ chức họp phụ huynh toàn trường vào 19h00 thứ Sáu tuần này. Nội dung: kế hoạch năm học, quy định nề nếp và giải đáp thắc mắc. Đề nghị phụ huynh tham dự đầy đủ.',
    attachments: [{ kind: 'pdf', src: pdfPage('Giấy mời họp phụ huynh'), name: 'giay-moi.pdf' }],
  },
  {
    id: 'bt7',
    schoolKey: 'Trường FINVIET',
    classKey: 'Lớp 10A1',
    category: 'Thời khóa biểu',
    at: '2026-10-06T08:00',
    title: 'Thời khóa biểu học kỳ I - Lớp 10A1',
    content: 'Thời khóa biểu áp dụng từ tuần này. Học sinh chuẩn bị sách vở theo từng ngày.',
    attachments: [{ kind: 'image', src: scene('Thời khóa biểu', 200), name: 'tkb' }],
  },
  {
    id: 'bt8',
    schoolKey: 'Trường FINVIET',
    category: 'Sự kiện',
    at: '2026-10-02T09:30',
    title: 'Ngày hội STEM FINVIET 2026',
    content: 'Ngày hội STEM năm nay có sự tham gia của các lớp khối 10 và 11. Chi tiết xem hình ảnh đính kèm.',
    attachments: [
      { kind: 'image', src: scene('STEM Day 1', 260), name: 's1' },
      { kind: 'image', src: scene('STEM Day 2', 290), name: 's2' },
      { kind: 'image', src: scene('STEM Day 3', 320), name: 's3' },
    ],
  },
]

export function bulletinFor(student: Student): BulletinPost[] {
  return BULLETIN.filter((b) => b.schoolKey === student.school && (!b.classKey || b.classKey === student.className)).sort(
    (a, b) => b.at.localeCompare(a.at),
  )
}

// ============================================================================
// Nhật ký chăm sóc (PH-12) — preschool only
// ============================================================================
export type CareKind = 'Ăn sáng' | 'Ăn nhẹ' | 'Ăn trưa' | 'Ăn xế (bữa lỡ)' | 'Ăn tối' | 'Uống nước' | 'Giấc ngủ' | 'Vệ sinh chung' | 'Tiểu tiện' | 'Đại tiện'
export interface CareItem {
  time: string // HH:mm
  kind: CareKind
  detail: string
  note?: string
}
export interface CareDay {
  date: string
  comment?: string
  items: CareItem[]
}

export const CARE_DIARY: Record<string, CareDay[]> = {
  vy: [
    {
      date: '2026-10-09',
      comment: 'Bé ngoan, hòa đồng với các bạn.',
      items: [
        { time: '08:00', kind: 'Ăn sáng', detail: 'Tự ăn, ăn hết suất' },
        { time: '09:30', kind: 'Uống nước', detail: '150ml' },
        { time: '11:00', kind: 'Ăn trưa', detail: 'Tự ăn, ăn hết suất', note: 'Có tiến bộ' },
        { time: '12:00', kind: 'Giấc ngủ', detail: 'Ngủ sâu, tự ngủ (2 giờ)' },
        { time: '14:20', kind: 'Tiểu tiện', detail: 'Vàng nhạt, chủ động, tự đi' },
        { time: '15:00', kind: 'Ăn xế (bữa lỡ)', detail: 'Ăn hết phần', note: 'Bé hôm nay ăn rất ngon miệng' },
      ],
    },
    {
      date: '2026-10-08',
      items: [
        { time: '08:00', kind: 'Ăn sáng', detail: 'Ăn ít, cần cô hỗ trợ', note: 'Bé hơi mệt buổi sáng' },
        { time: '10:10', kind: 'Vệ sinh chung', detail: 'Rửa tay trước khi ăn, thay áo' },
        { time: '11:00', kind: 'Ăn trưa', detail: 'Ăn được 2/3 suất' },
        { time: '12:00', kind: 'Giấc ngủ', detail: 'Ngủ ngon (1 giờ 45 phút)' },
      ],
    },
    {
      date: '2026-10-06',
      comment: 'Bé tham gia đầy đủ các hoạt động.',
      items: [
        { time: '08:00', kind: 'Ăn sáng', detail: 'Tự ăn, ăn hết suất' },
        { time: '11:05', kind: 'Đại tiện', detail: 'Bình thường, tự đi' },
        { time: '11:00', kind: 'Ăn trưa', detail: 'Tự ăn, ăn hết suất' },
      ],
    },
    {
      date: '2026-10-02',
      items: [{ time: '09:15', kind: 'Uống nước', detail: '200ml', note: 'Bé uống đủ nước' }],
    },
  ],
  lam: [
    {
      date: '2026-10-09',
      comment: 'Bé ăn ngủ tốt.',
      items: [
        { time: '08:00', kind: 'Ăn sáng', detail: 'Ăn hết suất' },
        { time: '12:00', kind: 'Giấc ngủ', detail: 'Ngủ sâu (2 giờ)' },
      ],
    },
    {
      date: '2026-10-07',
      items: [{ time: '11:00', kind: 'Ăn trưa', detail: 'Ăn ít, cần cô hỗ trợ', note: 'Có nhận xét' }],
    },
  ],
}

// ============================================================================
// Trao đổi (PH-14)
// ============================================================================
export interface ChatOrderCard {
  kind: 'absence' | 'medicine'
  // absence
  range?: string
  period?: string
  reason?: string
  // medicine
  times?: string
  note?: string
  orderId?: string
  status: string
}
export interface ChatMessage {
  id: string
  from: 'me' | 'teacher' | 'member'
  sender: string
  at: string // 'YYYY-MM-DDTHH:mm'
  text?: string
  images?: string[]
  order?: ChatOrderCard
  pinnedBy?: 'me' | 'teacher'
}
export interface ChatThread {
  id: string
  studentId: string
  kind: 'teacher' | 'group'
  title: string
  members?: number
  readOnly?: boolean // "Chỉ GV được đăng"
  unread: boolean
  messages: ChatMessage[]
}

export const CHAT_THREADS: ChatThread[] = [
  {
    id: 'ch-vy-gv',
    studentId: 'vy',
    kind: 'teacher',
    title: 'GV Lớp Lá',
    unread: true,
    messages: [
      { id: 'm1', from: 'teacher', sender: 'Cô Trang', at: '2026-10-08T07:50', text: 'Chào anh/chị, hôm nay bé Vy đến lớp rất vui vẻ ạ.' },
      { id: 'm2', from: 'me', sender: 'Bạn', at: '2026-10-08T08:05', text: 'Dạ cảm ơn cô. Bé hơi ho nhẹ, nhờ cô để ý giúp em ạ.' },
      {
        id: 'm3',
        from: 'me',
        sender: 'Bạn',
        at: '2026-10-08T08:06',
        order: { kind: 'medicine', times: '08:00, 12:00', note: 'Siro ho Prospan 5ml sau ăn', status: 'Đã gửi' },
      },
      { id: 'm4', from: 'teacher', sender: 'Cô Trang', at: '2026-10-08T08:20', text: 'Cô đã nhận đơn dặn thuốc, cô sẽ cho bé uống đúng giờ ạ.', pinnedBy: 'teacher' },
      { id: 'm5', from: 'teacher', sender: 'Cô Trang', at: '2026-10-09T15:30', text: 'Chiều nay bé ăn hết phần cháo và ngủ rất ngon ạ.' },
    ],
  },
  {
    id: 'ch-vy-group',
    studentId: 'vy',
    kind: 'group',
    title: 'Nhóm lớp Lá',
    members: 28,
    unread: false,
    messages: [
      { id: 'g1', from: 'teacher', sender: 'Cô Trang', at: '2026-10-07T17:00', text: 'Nhắc phụ huynh mang áo ấm cho bé vì trời trở lạnh nhé.' },
      { id: 'g2', from: 'member', sender: 'Phụ huynh bé Bông', at: '2026-10-07T17:12', text: 'Dạ vâng cô, cảm ơn cô nhắc ạ.' },
      { id: 'g3', from: 'member', sender: 'Phụ huynh bé Su', at: '2026-10-07T17:20', text: 'Cô cho em hỏi lịch chụp ảnh kỷ yếu với ạ?' },
    ],
  },
  {
    id: 'ch-khoa-gv',
    studentId: 'khoa',
    kind: 'teacher',
    title: 'GV Lớp 10A1',
    unread: false,
    messages: [
      { id: 'k1', from: 'teacher', sender: 'Cô Thu', at: '2026-10-05T19:10', text: 'Chào anh/chị, em Khoa còn thiếu bài tập Toán tuần trước ạ.' },
      { id: 'k2', from: 'me', sender: 'Bạn', at: '2026-10-05T19:30', text: 'Dạ em sẽ nhắc cháu nộp bù trong tuần này ạ.' },
      {
        id: 'k3',
        from: 'me',
        sender: 'Bạn',
        at: '2026-10-08T07:20',
        order: { kind: 'absence', range: '08/10/2026 - 08/10/2026', period: 'Buổi chiều', reason: 'Con khám bệnh', status: 'Đã duyệt' },
      },
    ],
  },
  {
    id: 'ch-khoa-group',
    studentId: 'khoa',
    kind: 'group',
    title: 'Nhóm lớp 10A1',
    members: 36,
    readOnly: true,
    unread: true,
    messages: [
      { id: 'kg1', from: 'teacher', sender: 'Thầy Huy', at: '2026-10-09T18:00', text: 'Thông báo: Họp phụ huynh lớp vào 19h00 thứ Sáu tuần này.', pinnedBy: 'teacher' },
    ],
  },
  {
    id: 'ch-lam-gv',
    studentId: 'lam',
    kind: 'teacher',
    title: 'GV Lớp Mầm',
    unread: false,
    messages: [],
  },
]

export function threadsFor(studentId: string): ChatThread[] {
  return CHAT_THREADS.filter((t) => t.studentId === studentId)
}
export function hasUnreadChat(): boolean {
  return CHAT_THREADS.some((t) => t.unread)
}

// ============================================================================
// Thư viện ảnh / Album ảnh (PH-19)
// ============================================================================
export interface AlbumMedia {
  id: string
  kind: 'image' | 'video'
  src: string
  duration?: string // mm:ss for videos
  at: string // upload time, 'YYYY-MM-DDTHH:mm'
}
export interface Album {
  id: string
  name: string
  description?: string
  schoolKey: string
  classKey?: string // omitted = whole school
  createdAt: string
  media: AlbumMedia[]
}

function albumMedia(prefix: string, label: string, hue: number, spec: { day: string; images: number; videos?: number }[]): AlbumMedia[] {
  const out: AlbumMedia[] = []
  spec.forEach(({ day, images, videos = 0 }, di) => {
    for (let i = 0; i < images; i++)
      out.push({ id: `${prefix}-${di}-i${i}`, kind: 'image', src: scene(`${label} ${out.length + 1}`, (hue + out.length * 17) % 360), at: `${day}T${String(9 + (i % 8)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}` })
    for (let v = 0; v < videos; v++)
      out.push({ id: `${prefix}-${di}-v${v}`, kind: 'video', src: scene(`Video ${v + 1}`, (hue + 120) % 360), duration: `${String(Math.floor((45 + v * 27) / 60)).padStart(2, '0')}:${String((45 + v * 27) % 60).padStart(2, '0')}`, at: `${day}T15:${String(10 + v * 9).padStart(2, '0')}` })
  })
  return out
}

export const ALBUMS: Album[] = [
  {
    id: 'al-trungthu',
    name: 'Ngày hội Trung thu 2026',
    description:
      'Chương trình Trung thu năm nay có rất nhiều hoạt động thú vị: rước đèn, phá cỗ, múa lân và các tiết mục văn nghệ của các bé. Nhà trường xin gửi đến quý phụ huynh những khoảnh khắc đáng nhớ của các con trong ngày hội. Ảnh và video sẽ tiếp tục được cập nhật trong những ngày tới.',
    schoolKey: 'Trường Mầm non Demo',
    createdAt: '2026-09-26',
    media: albumMedia('tt', 'Trung thu', 30, [
      { day: '2026-09-28', images: 14, videos: 2 },
      { day: '2026-09-27', images: 10, videos: 1 },
      { day: '2026-09-26', images: 8, videos: 1 },
    ]),
  },
  {
    id: 'al-diemdanh-la',
    name: 'Điểm danh',
    schoolKey: 'Trường Mầm non Demo',
    classKey: 'Lớp Lá',
    createdAt: '2026-10-01',
    media: albumMedia('dd', 'Điểm danh', 200, [
      { day: '2026-10-12', images: 3 },
      { day: '2026-10-09', images: 4 },
      { day: '2026-10-08', images: 5 },
    ]),
  },
  {
    id: 'al-vetranh',
    name: 'Hoạt động vẽ tranh "Ngôi nhà mơ ước"',
    description: 'Các bé lớp Lá vẽ tranh về ngôi nhà mơ ước.',
    schoolKey: 'Trường Mầm non Demo',
    classKey: 'Lớp Lá',
    createdAt: '2026-10-09',
    media: albumMedia('vt', 'Vẽ tranh', 20, [{ day: '2026-10-09', images: 7 }]),
  },
  {
    id: 'al-dangoai',
    name: 'Dã ngoại tháng 11',
    description: 'Album sẽ được cập nhật sau chuyến dã ngoại.',
    schoolKey: 'Trường Mầm non Demo',
    createdAt: '2026-10-10',
    media: [],
  },
  {
    id: 'al-stem',
    name: 'Ngày hội STEM FINVIET 2026',
    description: 'Hình ảnh và video các dự án STEM của học sinh khối 10 và 11.',
    schoolKey: 'Trường FINVIET',
    createdAt: '2026-10-02',
    media: albumMedia('st', 'STEM', 260, [
      { day: '2026-10-09', images: 8, videos: 1 },
      { day: '2026-10-08', images: 5 },
    ]),
  },
  {
    id: 'al-diemdanh-10a1',
    name: 'Điểm danh',
    schoolKey: 'Trường FINVIET',
    classKey: 'Lớp 10A1',
    createdAt: '2026-10-01',
    media: albumMedia('dk', 'Điểm danh', 180, [{ day: '2026-10-12', images: 3 }, { day: '2026-10-09', images: 4 }]),
  },
]

export const albumUpdatedAt = (a: Album): string =>
  a.media.length ? a.media.map((m) => m.at).sort().pop()! : a.createdAt
// BR-02: the cover is the most recently added item.
export const albumCover = (a: Album): string | null =>
  a.media.length ? [...a.media].sort((x, y) => y.at.localeCompare(x.at))[0].src : null

export function albumsFor(student: Student): Album[] {
  return ALBUMS.filter((a) => a.schoolKey === student.school && (!a.classKey || a.classKey === student.className)).sort((a, b) =>
    albumUpdatedAt(b).localeCompare(albumUpdatedAt(a)),
  )
}

// ============================================================================
// Góp ý (PH-20)
// ============================================================================
export type FeedbackStatus = 'new' | 'received' | 'resolved' | 'reopened'
// "Loại góp ý" is optional (EDU-1498 wireframe): pick one of these 8 or none.
export const FEEDBACK_TYPES = [
  'Góp ý về nội dung',
  'Góp ý về hình thức / trình bày',
  'Góp ý về hiệu suất / chất lượng',
  'Góp ý về kỹ năng',
  'Góp ý về thái độ / hành vi',
  'Góp ý về quy trình',
  'Góp ý về trải nghiệm người dùng',
  'Góp ý mang tính chiến lược',
] as const
export interface FeedbackFile {
  name: string
  kind: 'image' | 'pdf'
  src: string
}
export interface FeedbackReply {
  id: string
  from: 'parent' | 'school'
  sender: string
  at: string
  text?: string
  images?: string[]
  failed?: boolean // "Gửi lỗi" — shown with a retry button
}
export interface Feedback {
  id: string
  studentId: string
  title: string
  content: string
  type: string // '' when the parent did not pick one
  status: FeedbackStatus
  createdAt: string
  sender: string
  handler?: string
  closedAt?: string // set when the school marks it "Đã xử lý"
  unread?: boolean // the school replied and the parent has not opened it yet
  files: FeedbackFile[]
  replies: FeedbackReply[]
}

export const FEEDBACKS: Feedback[] = [
  {
    id: 'fb1',
    studentId: 'khoa',
    title: 'Đề xuất bổ sung quạt cho phòng học 10A1',
    content: 'Phòng học 10A1 vào buổi chiều khá nóng, các con khó tập trung. Nhà trường xem xét bổ sung quạt hoặc điều hòa giúp các con.',
    type: 'Góp ý về trải nghiệm người dùng',
    status: 'new',
    createdAt: '2026-10-11T20:15',
    sender: 'Diễm (PH Đăng Khoa)',
    files: [],
    replies: [],
  },
  {
    id: 'fb2',
    studentId: 'khoa',
    title: 'Thời gian đón học sinh buổi chiều',
    content: 'Cổng trường buổi chiều rất đông, phụ huynh xin nhà trường chia khung giờ đón theo khối lớp.',
    type: 'Góp ý về quy trình',
    status: 'received',
    unread: true,
    createdAt: '2026-10-09T08:40',
    sender: 'Diễm (PH Đăng Khoa)',
    handler: 'Cô Nguyễn Ngọc Lan',
    files: [{ name: 'cong-truong.png', kind: 'image', src: scene('Cổng trường', 40) }],
    replies: [
      { id: 'r1', from: 'school', sender: 'Cô Nguyễn Ngọc Lan', at: '2026-10-09T10:05', text: 'Nhà trường đã tiếp nhận góp ý và sẽ trao đổi với Ban giám hiệu trong tuần này.' },
      { id: 'r1b', from: 'school', sender: 'Cô Nguyễn Ngọc Lan', at: '2026-10-11T15:30', text: 'Từ tuần sau trường sẽ chia khung giờ đón theo khối lớp, nhà trường sẽ gửi thông báo cụ thể.' },
    ],
  },
  {
    id: 'fb3',
    studentId: 'khoa',
    title: 'Suất ăn bán trú thiếu rau xanh',
    content: 'Mấy hôm nay con chia sẻ bữa trưa ít rau. Mong nhà trường điều chỉnh thực đơn.',
    type: 'Góp ý về hiệu suất / chất lượng',
    status: 'resolved',
    createdAt: '2026-10-02T09:10',
    sender: 'Diễm (PH Đăng Khoa)',
    handler: 'Thầy Phạm Quốc Huy',
    closedAt: '2026-10-08T16:00',
    files: [{ name: 'thuc-don.pdf', kind: 'pdf', src: pdfPage('Thực đơn bán trú') }],
    replies: [
      { id: 'r2', from: 'school', sender: 'Thầy Phạm Quốc Huy', at: '2026-10-03T08:00', text: 'Nhà trường đã làm việc với bộ phận bếp.' },
      { id: 'r3', from: 'parent', sender: 'Bạn', at: '2026-10-03T19:30', text: 'Cảm ơn thầy, em sẽ theo dõi thêm.' },
      { id: 'r4', from: 'school', sender: 'Thầy Phạm Quốc Huy', at: '2026-10-08T16:00', text: 'Thực đơn tuần này đã bổ sung thêm rau xanh. Nhà trường xin đóng góp ý.' },
    ],
  },
  {
    id: 'fb4',
    studentId: 'khoa',
    title: 'Học phí tháng 9 bị trừ hai lần',
    content: 'Tài khoản của em bị trừ học phí tháng 9 hai lần, nhờ nhà trường kiểm tra.',
    type: 'Góp ý về quy trình',
    status: 'resolved',
    createdAt: '2026-09-15T10:00',
    sender: 'Diễm (PH Đăng Khoa)',
    handler: 'Cô Nguyễn Ngọc Lan',
    closedAt: '2026-09-20T15:00',
    files: [],
    replies: [{ id: 'r5', from: 'school', sender: 'Cô Nguyễn Ngọc Lan', at: '2026-09-20T15:00', text: 'Đã hoàn tiền khoản trừ trùng. Nhà trường xin đóng góp ý.' }],
  },
  {
    id: 'fb5',
    studentId: 'khoa',
    title: 'Nội quy sử dụng điện thoại trong lớp',
    content: 'Phụ huynh muốn hiểu rõ hơn về nội quy dùng điện thoại và cách nhà trường phối hợp.',
    type: 'Góp ý về thái độ / hành vi',
    status: 'reopened',
    createdAt: '2026-09-25T09:00',
    sender: 'Diễm (PH Đăng Khoa)',
    handler: 'Thầy Phạm Quốc Huy',
    files: [],
    replies: [{ id: 'r6', from: 'school', sender: 'Thầy Phạm Quốc Huy', at: '2026-09-26T09:00', text: 'Nhà trường gửi bạn quy định chi tiết.' }],
  },
  {
    id: 'fb6',
    studentId: 'vy',
    title: 'Xin thêm ảnh hoạt động hằng ngày của bé',
    content: 'Phụ huynh mong cô cập nhật thêm ảnh sinh hoạt hằng ngày của các bé.',
    type: '',
    status: 'new',
    createdAt: '2026-10-10T18:00',
    sender: 'Diễm (PH Khánh Vy)',
    files: [],
    replies: [],
  },
]

export const feedbackFor = (studentId: string): Feedback[] =>
  FEEDBACKS.filter((f) => f.studentId === studentId).sort((a, b) => feedbackUpdatedAt(b).localeCompare(feedbackUpdatedAt(a)))

export const REOPEN_WINDOW_DAYS = 7
// Whole days left to reopen a closed feedback (0 when expired).
export function reopenDaysLeft(f: Feedback): number {
  if (f.status !== 'resolved' || !f.closedAt) return 0
  const left = new Date(f.closedAt).getTime() + REOPEN_WINDOW_DAYS * 86400000 - Date.now()
  return left > 0 ? Math.ceil(left / 86400000) : 0
}
export const canReopen = (f: Feedback): boolean => reopenDaysLeft(f) > 0

// Sorted by latest update (last reply, else creation).
export const feedbackUpdatedAt = (f: Feedback): string => f.replies.length ? f.replies[f.replies.length - 1].at : f.createdAt
