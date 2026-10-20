export type CapHoc = 1 | 2 | 3

export function capHocFromGrade(grade: number): CapHoc {
  if (grade <= 5) return 1
  if (grade <= 9) return 2
  return 3
}

export interface ResultsStudentProfile {
  id: string
  name: string
  code: string
  className: string
  school: string
  grade: number
  hasScores: boolean
}

export const RESULTS_STUDENT_PROFILES: Record<string, ResultsStudentProfile> = {
  // Primary school (Cấp 1 - Tiểu học) — matches Screenshot 1 (Ket qua hoc tap_Cap 1)
  khoa: {
    id: 'khoa',
    name: 'Phạm Đăng Khoa',
    code: '731205864129',
    className: 'Lớp Mầm',
    school: 'Demo Soha',
    grade: 2,
    hasScores: false,
  },
  quanh: {
    id: 'quanh',
    name: 'Nguyễn Thành Quân Anh',
    code: '112233446601',
    className: 'Lớp Mầm',
    school: 'Demo Soha',
    grade: 1,
    hasScores: false,
  },
  // Primary school (Cấp 1 - Tiểu học) with populated scores
  lam: {
    id: 'lam',
    name: 'Lý Tường Lam',
    code: '9192930065',
    className: 'Lớp 5B',
    school: 'Trường Tiểu học FINVIET',
    grade: 5,
    hasScores: true,
  },
  duong: {
    id: 'duong',
    name: 'Tạ Thái Dương',
    code: '340000000002',
    className: 'Lớp 1A',
    school: 'Trường Tiểu học FINVIET',
    grade: 1,
    hasScores: true,
  },
  // Secondary & High school (Cấp 2 & 3 - THCS & THPT) — matches Screenshot 2 (Ket qua hoc tap_Cap 2 & 3)
  nhu: {
    id: 'nhu',
    name: 'Huỳnh Ngọc Trúc Như',
    code: '9192930041',
    className: 'Lớp 11A1',
    school: 'Trường FINVIET',
    grade: 11,
    hasScores: false,
  },
  han: {
    id: 'han',
    name: 'Phạm Mỹ Hân',
    code: '012067164131',
    className: 'Lá',
    school: 'Demo Soha',
    grade: 8,
    hasScores: false,
  },
  // Secondary school (Cấp 2 - THCS) with populated scores
  vy: {
    id: 'vy',
    name: 'Phan Khánh Vy',
    code: '9192930059',
    className: 'Lớp 8A1',
    school: 'Trường THCS FINVIET',
    grade: 8,
    hasScores: true,
  },
}

// --- Cấp 1 (Tiểu học - Primary Schools) ---
export type Cap1TabId = 'giua-hk1' | 'hk1' | 'giua-hk2' | 'cuoi-nam'

export const CAP1_TABS: { id: Cap1TabId; label: string }[] = [
  { id: 'giua-hk1', label: 'Giữa học kỳ I' },
  { id: 'hk1', label: 'Học kỳ I' },
  { id: 'giua-hk2', label: 'Giữa học kỳ II' },
  { id: 'cuoi-nam', label: 'Cuối năm' },
]

export interface Cap1MonHocRow {
  name: string
  ktdk: string
  mucDatDuoc: string
}

export interface Cap1NangLucRow {
  name: string
  mucDatDuoc: string
}

export interface Cap1TabData {
  monHoc: Cap1MonHocRow[]
  nangLucChung: Cap1NangLucRow[]
  nangLucDacThu: Cap1NangLucRow[]
  phamChat: Cap1NangLucRow[]
}

// --- Cấp 2 & 3 (THCS & THPT - Secondary and High Schools) ---
export type Cap23TabId = 'hk1' | 'hk2' | 'ca-nam'

export const CAP23_TABS: { id: Cap23TabId; label: string }[] = [
  { id: 'hk1', label: 'Học kỳ I' },
  { id: 'hk2', label: 'Học kỳ II' },
  { id: 'ca-nam', label: 'Cả năm' },
]

export const DDGTX_COLUMNS = ['Miệng', '15 phút', '1 tiết', '1 tiết', 'Thực hành']

export interface Cap23BangDiemRow {
  name: string
  ddgtx: string[]
  ddggk: string
  ddgck: string
  tbhk: string
}

export interface Cap23NhanXetRow {
  subject: string
  text: string
}

export interface Cap23TongKetRow {
  danhMuc: string
  values: string[]
}

export interface Cap23HocKyData {
  tongKet: Cap23TongKetRow[]
  bangDiem: Cap23BangDiemRow[]
  nhanXet: Cap23NhanXetRow[]
}

export interface Cap23CaNamData {
  tongKet: Cap23TongKetRow[]
}

export function getCap1TabData(studentId: string, tabIndex: number): Cap1TabData {
  const profile = RESULTS_STUDENT_PROFILES[studentId]
  const hasScores = profile?.hasScores ?? false
  const showKtdk = tabIndex === 1 || tabIndex === 3

  const subjects = [
    { name: 'Tiếng Việt', scored: true },
    { name: 'Toán', scored: true },
    { name: 'Đạo đức', scored: false },
    { name: 'Tự nhiên và Xã hội', scored: false },
    { name: 'Giáo dục thể chất', scored: false },
    { name: 'Nghệ thuật – Âm nhạc', scored: false },
    { name: 'Nghệ thuật – Mĩ thuật', scored: false },
    { name: 'Hoạt động trải nghiệm', scored: false },
  ]

  const monHoc: Cap1MonHocRow[] = subjects.map((s, i) => ({
    name: s.name,
    ktdk: hasScores && s.scored && showKtdk ? String(8 + ((i + tabIndex) % 3)) : hasScores ? '—' : '',
    mucDatDuoc: hasScores ? ['T', 'H', 'C'][(i + tabIndex) % 3] : '',
  }))

  const buildRows = (names: string[]): Cap1NangLucRow[] =>
    names.map((name, i) => ({
      name,
      mucDatDuoc: hasScores ? ['T', 'Đ', 'C'][(i + tabIndex) % 3] : '',
    }))

  return {
    monHoc,
    nangLucChung: buildRows([
      'Tự chủ và tự học',
      'Giao tiếp và hợp tác',
      'Giải quyết vấn đề và sáng tạo',
    ]),
    nangLucDacThu: buildRows([
      'Ngôn ngữ',
      'Toán học',
      'Khoa học',
      'Thẩm mỹ',
      'Thể chất',
      'Công nghệ',
      'Tin học',
    ]),
    phamChat: buildRows([
      'Yêu nước',
      'Nhân ái',
      'Chăm chỉ',
      'Trung thực',
      'Trách nhiệm',
    ]),
  }
}

export function getCap23HocKyData(studentId: string, tabIndex: 0 | 1): Cap23HocKyData {
  const profile = RESULTS_STUDENT_PROFILES[studentId]
  const hasScores = profile?.hasScores ?? false

  const subjects = [
    { name: 'Tiếng Việt', scored: true },
    { name: 'Đạo đức', scored: true },
    { name: 'Ngữ văn', scored: true },
    { name: 'Toán', scored: true },
    { name: 'Ngoại ngữ 1', scored: true },
    { name: 'GDCD', scored: true },
    { name: 'Lịch sử và Địa lí', scored: true },
    { name: 'Khoa học tự nhiên', scored: true },
    { name: 'Công nghệ', scored: true },
    { name: 'Tin học', scored: true },
    { name: 'Giáo dục thể chất', scored: false },
  ]

  const tongKet: Cap23TongKetRow[] = [
    { danhMuc: 'Kết quả học tập', values: [hasScores ? ['Tốt', 'Khá'][tabIndex] : '—'] },
    { danhMuc: 'Kết quả hành vi', values: [hasScores ? 'Tốt' : '—'] },
    { danhMuc: 'Số ngày nghỉ', values: [hasScores ? String(tabIndex + 1) : '—'] },
  ]

  const bangDiem: Cap23BangDiemRow[] = subjects.map((s, i) => {
    if (!hasScores) {
      return {
        name: s.name,
        ddgtx: DDGTX_COLUMNS.map(() => '—'),
        ddggk: '—',
        ddgck: '—',
        tbhk: '—',
      }
    }
    if (!s.scored) {
      return {
        name: s.name,
        ddgtx: DDGTX_COLUMNS.map(() => '—'),
        ddggk: '—',
        ddgck: '—',
        tbhk: 'Đạt',
      }
    }
    const base = 7 + ((i + tabIndex) % 3)
    return {
      name: s.name,
      ddgtx: DDGTX_COLUMNS.map((_, ci) => String(Math.min(10, base + ((ci + i) % 2)))),
      ddggk: String(Math.min(10, base + 1)),
      ddgck: String(Math.min(10, base)),
      tbhk: (base + 0.4).toFixed(1),
    }
  })

  const nhanXet: Cap23NhanXetRow[] = hasScores
    ? subjects.map((s) => ({
        subject: s.name,
        text: 'Con học tập tích cực, tiếp thu bài tốt, có ý thức kỷ luật cao.',
      }))
    : []

  return { tongKet, bangDiem, nhanXet }
}

export function getCap23CaNamData(studentId: string): Cap23CaNamData {
  const profile = RESULTS_STUDENT_PROFILES[studentId]
  const hasScores = profile?.hasScores ?? false

  return {
    tongKet: [
      { danhMuc: 'Kết quả học tập', values: hasScores ? ['Tốt', 'Tốt', 'Tốt'] : ['—', '—', '—'] },
      { danhMuc: 'Kết quả hành vi', values: hasScores ? ['Tốt', 'Tốt', 'Tốt'] : ['—', '—', '—'] },
      { danhMuc: 'Số ngày nghỉ', values: hasScores ? ['1', '2', '3'] : ['—', '—', '—'] },
    ],
  }
}
