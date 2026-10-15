// Mirrors the STUDENTS mock data in ../../scripts/app.js (vanilla app) so
// both versions show identical numbers while they coexist. Đợt 3 adds the
// fields needed for Báo vắng, Bài tập, and Kết quả học tập. Fields for
// screens still not rebuilt (spending history, timetable, attendance) are
// still not ported.

export type AbsenceStatus = 'pending' | 'approved' | 'cancelled'

export interface AbsenceRequest {
  id: string
  range: string
  status: AbsenceStatus
  time: string
  days: number
  note: string
}

// 'completed' (Đã hoàn thành) = every dose of every day was confirmed by the
// teacher; see effectiveMedicineStatus() in components/parents/medicine/utils.ts.
export type MedicineStatus = 'sent' | 'completed' | 'cancelled'

export interface MedicineDose {
  time: string // 'HH:mm', 30-minute steps only
  note: string // per-dose note, '' when none
}

export interface MedicineOrder {
  id: string
  from: string // ISO yyyy-mm-dd
  to: string
  doses: MedicineDose[]
  note: string
  photos: string[] // image URLs (blob: for uploads, data: for the seed orders)
  status: MedicineStatus
  // Teacher confirmations ("Đánh dấu đã uống thuốc"), keyed `${date}|${doseIndex}`.
  confirmations?: Record<string, { by: string; at: string }>
}

// Stand-in "medicine photo" for the seeded orders (there is no backend or
// real image to show).
function medicinePhoto(label: string, bg: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">` +
    `<rect width="600" height="600" fill="${bg}"/>` +
    `<rect x="190" y="230" width="220" height="140" rx="26" fill="#fff" stroke="#002C54" stroke-width="8"/>` +
    `<line x1="300" y1="230" x2="300" y2="370" stroke="#002C54" stroke-width="8"/>` +
    `<text x="300" y="450" font-family="Arial" font-size="34" font-weight="700" text-anchor="middle" fill="#002C54">${label}</text>` +
    `</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// ---- Lịch sử chi tiêu ------------------------------------------------------
export interface SpendingTx {
  id: string
  title: string
  at: string // 'YYYY-MM-DDTHH:mm'
  amount: number // + in, - out (points)
}

// ---- Thời khoá biểu --------------------------------------------------------
export interface TimetableLesson {
  period: string // e.g. 'Tiết 1'
  time: string // e.g. '07:00 - 07:45'
  subjects: string[] // Mon..Fri
}
export interface Timetable {
  period: string // validity range, display text
  lessons: TimetableLesson[]
}

// ---- Theo dõi điểm danh ----------------------------------------------------
export type AttendanceStatus = 'present' | 'late' | 'excused' | 'unexcused'
export interface AttendanceSession {
  status: AttendanceStatus
  checkIn?: string // 'HH:mm'
  checkOut?: string | null // null = chưa về
  outLate?: boolean // về muộn
  photoIn?: string
  photoOut?: string
  note?: string
}
export interface AttendanceDay {
  date: string // ISO yyyy-mm-dd
  full?: AttendanceSession
  morning?: AttendanceSession
  afternoon?: AttendanceSession
}
export interface AttendanceData {
  sessions: 'full' | 'two' // trường học cả ngày / 2 buổi
  days: AttendanceDay[]
}

export type HomeworkStatus = 'notsubmitted' | 'submitted' | 'graded'

export interface Homework {
  id: string
  subject: string
  title: string
  status: HomeworkStatus
  score: number | null
  teacher: string
  assignedDate: string
  dueDate: string
  content: string
  overdue: boolean
  comment: string
  submissionFiles: string[]
}

export interface ResultsTerm {
  study: string
  behavior: string
  absentDays: string
}

export interface ResultsSubject {
  name: string
  gtx: string
  gk: string
}

export interface Results {
  year: string
  terms: Record<string, ResultsTerm>
  subjects: ResultsSubject[]
}

export interface RecentActivity {
  title: string
  time: string
  amount?: string
}

// Người giám hộ — mock data only (there is no real guardian source in the
// vanilla app). Shown on the "Hồ sơ học sinh" profile screen.
export interface Guardian {
  name: string
  phone: string
  address: string
}

export interface InvoiceItem {
  name: string
  amount: number
}

export interface InvoiceMonthGroup {
  label: string
  total: number
  items: InvoiceItem[]
}

export interface Invoices {
  linked: boolean
  // Used when a student has no linked provider yet — the single "hoá đơn
  // chưa thanh toán" line shown after entering mã học sinh (fee-lookup flow).
  sample?: InvoiceItem[]
  // Used when a student already has a linked invoice — grouped by month.
  months?: InvoiceMonthGroup[]
}

// "Hóa đơn" screen data — a separate, per-item model from `Invoices` above
// (which only drives the Đóng học phí flow). Each Bill is one billing period;
// items are paid individually, so a bill can be partially paid and then shows
// up in both the "Chưa thanh toán" and "Đã thanh toán" tabs.
export interface BillItem {
  id: string
  name: string
  amount: number
  paid: boolean
}

export interface Bill {
  id: string
  label: string
  // Billing period — drives the month bars on the Tổng quan Hóa đơn screen.
  year: number
  month: number
  items: BillItem[]
  // Fully paid bills with an e-invoice show a "Hóa đơn điện tử (VAT)" row;
  // it stays hidden while the bill still has open items.
  hasVat?: boolean
}

// Phiếu bé ngoan (PRD PH-17): one record per Monday-started week. A week
// belongs to the month its first day falls in. `comment` is the teacher's
// weekly remark (hidden when absent).
export interface GoodBehaviorWeek {
  weekStart: string // ISO Monday
  got: boolean // "Có phiếu" / "Chưa có phiếu"
  teacher?: string
  comment?: string
}

export interface GoodBehavior {
  weeks: GoodBehaviorWeek[]
}

export interface HealthRecord {
  heightCm: number
  weightKg: number
  zScore: number
  recordedAt: string
}

export interface Student {
  id: string
  code: string
  name: string
  school: string
  className: string
  // Personal info shown on the "Hồ sơ học sinh" profile screen.
  dob: string
  gender: string
  guardians: Guardian[]
  // Chỉ số sức khoẻ (Học sinh screen) — cm / kg. BMI is derived, not stored.
  heightCm: number
  weightKg: number
  // BMI-for-age z-score (per Quyết định 3777/QĐ-BYT). Stored directly since
  // computing it needs WHO age/sex growth-reference tables not modeled here.
  zScore: number
  // History shown in the "Lịch sử chỉ số sức khoẻ" sheet — newest first,
  // limited to the last 6 months (the default/only window shown to parents).
  // healthHistory[0] mirrors heightCm/weightKg above.
  healthHistory: HealthRecord[]
  balance: number
  avatar: string
  supportsTopUp: boolean
  hasLinkedInvoice: boolean
  recentActivity: RecentActivity[]
  invoices: Invoices
  bills: Bill[]
  homework: Homework[]
  absence: AbsenceRequest[]
  medicine: MedicineOrder[]
  spending: SpendingTx[]
  timetable: Timetable | null
  attendance: AttendanceData
  results: Results | null
  goodBehavior: GoodBehavior
}

export interface Provider {
  id: string
  name: string
  logo: string
}

export const PROVIDERS: Provider[] = [
  { id: 'eco', name: 'ECO School', logo: 'fin' },
  { id: 'ssc', name: 'TheSSC', logo: 'SSC' },
  { id: 'vinaid', name: 'VinaID', logo: 'ID' },
]

export const AMOUNT_PRESETS = [10000, 20000, 50000, 100000, 200000, 500000]

// ---- seed helpers ----------------------------------------------------------
function faceShot(label: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">` +
    `<rect width="480" height="480" fill="#E5F1FB"/><circle cx="240" cy="190" r="78" fill="#9DB7D3"/>` +
    `<path d="M90 440c10-96 70-140 150-140s140 44 150 140z" fill="#9DB7D3"/>` +
    `<text x="240" y="62" font-family="Arial" font-size="30" font-weight="700" text-anchor="middle" fill="#002C54">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// Weekdays between two ISO dates, inclusive.
function weekdaysBetween(from: string, to: string): string[] {
  const out: string[] = []
  const d = new Date(from + 'T00:00:00')
  const end = new Date(to + 'T00:00:00')
  while (d <= end) {
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) {
      const p = (n: number) => String(n).padStart(2, '0')
      out.push(`${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`)
    }
    d.setDate(d.getDate() + 1)
  }
  return out
}

function hhmm(base: number, jitter: number): string {
  const m = base + jitter
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

// Deterministic mock attendance: mostly on time, a few late / excused /
// unexcused days. `two` = school with morning + afternoon sessions.
function seedAttendance(sessions: 'full' | 'two', special: Record<string, Partial<Record<'full' | 'morning' | 'afternoon', AttendanceSession>>>): AttendanceData {
  const days = weekdaysBetween('2026-09-01', '2026-10-12').map((date, i): AttendanceDay => {
    const day: AttendanceDay = { date }
    const late = i % 9 === 4
    const inMin = late ? 8 * 60 + 12 + (i % 5) : 7 * 60 + 25 + ((i * 7) % 20)
    const photo = i % 6 === 0 ? faceShot('Điểm danh vào') : undefined
    if (sessions === 'full') {
      day.full = {
        status: late ? 'late' : 'present',
        checkIn: hhmm(inMin, 0),
        checkOut: hhmm(16 * 60 + 5, (i * 3) % 25),
        photoIn: photo,
      }
    } else {
      day.morning = { status: late ? 'late' : 'present', checkIn: hhmm(inMin, 0), checkOut: hhmm(11 * 60 + 30, (i * 2) % 12), photoIn: photo }
      day.afternoon = { status: 'present', checkIn: hhmm(13 * 60 + 15, (i * 5) % 14), checkOut: hhmm(16 * 60 + 30, (i * 3) % 20) }
    }
    return { ...day, ...special[date] }
  })
  // The latest day is still in progress: no check-out yet.
  const last = days[days.length - 1]
  const sess = last.full ?? last.afternoon
  if (sess && sess.status !== 'excused' && sess.status !== 'unexcused') sess.checkOut = null
  return { sessions, days }
}

// Weekly Phiếu bé ngoan for school year 2026-2027: Mondays 03/08 … 12/10/2026.
function seedGoodBehavior(teacher: string, got: boolean[], comments: Record<number, string>): GoodBehavior {
  const starts = weekdaysBetween('2026-08-03', '2026-10-12').filter((d) => new Date(d + 'T00:00:00').getDay() === 1)
  return {
    weeks: starts.map((weekStart, i) => ({
      weekStart,
      got: got[i] ?? false,
      teacher: comments[i] ? teacher : undefined,
      comment: comments[i],
    })),
  }
}

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'vy',
    code: '9192930059',
    name: 'Phan Khánh Vy',
    school: 'Trường Mầm non Demo',
    className: 'Lớp Lá',
    dob: '05/09/2020',
    gender: 'Nữ',
    guardians: [
      { name: 'Phan Văn Dũng', phone: '0912 345 678', address: 'Thành phố Hồ Chí Minh' },
    ],
    heightCm: 112,
    weightKg: 24,
    zScore: 0.4,
    healthHistory: [
      { heightCm: 112, weightKg: 24, zScore: 0.4, recordedAt: '01/09/2026' },
      { heightCm: 111, weightKg: 23.5, zScore: 0.3, recordedAt: '01/08/2026' },
      { heightCm: 110, weightKg: 23, zScore: 0.3, recordedAt: '01/07/2026' },
      { heightCm: 109, weightKg: 22.5, zScore: 0.2, recordedAt: '01/06/2026' },
      { heightCm: 108, weightKg: 22, zScore: 0.1, recordedAt: '01/05/2026' },
      { heightCm: 107, weightKg: 21.5, zScore: 0.1, recordedAt: '01/04/2026' },
    ],
    balance: 12000,
    avatar: 'V',
    spending: [
      { id: 'vysp1', title: 'Nạp tiền', at: '2026-10-09T09:41', amount: 1000 },
      { id: 'vysp2', title: 'Mua đồ ăn căng tin', at: '2026-10-07T10:15', amount: -15000 },
      { id: 'vysp3', title: 'Nạp tiền', at: '2026-10-02T13:52', amount: 5000 },
      { id: 'vysp4', title: 'Nạp tiền', at: '2026-08-27T14:18', amount: 1000 },
      { id: 'vysp5', title: 'Nạp tiền', at: '2026-06-17T16:04', amount: 5000 },
    ],
    timetable: null,
    attendance: seedAttendance('full', {
      '2026-09-30': { full: { status: 'excused', note: 'Con ốm, có đơn xin phép' } },
      '2026-10-08': { full: { status: 'unexcused' } },
    }),
    supportsTopUp: true,
    hasLinkedInvoice: false,
    recentActivity: [
      { title: 'Nạp tiền', time: '10/07/2026 - 09:41', amount: '+1,000 điểm' },
      { title: 'Thêm liên kết học sinh Phan Khánh Vy | 9192930059', time: '10/07/2026 - 09:29' },
      { title: 'Đã kích hoạt thẻ học sinh Phan Khánh Vy', time: '10/07/2026 - 09:29' },
      { title: 'Đã hủy liên kết thẻ học sinh Phan Khánh Vy', time: '10/07/2026 - 09:29' },
    ],
    invoices: { linked: false, sample: [{ name: 'Học phí 07/2026', amount: 200000 }] },
    bills: [],
    homework: [],
    absence: [],
    medicine: [],
    results: null,
    goodBehavior: seedGoodBehavior(
      'Nguyễn Ngọc Đài Trang',
      [true, true, false, true, true, true, false, true, true, true, true],
      {
        1: 'Con ngoan, biết xếp hàng chờ đến lượt.',
        3: 'Con hòa đồng và hay giúp đỡ các bạn.',
        7: 'Con tích cực tham gia hoạt động vẽ tranh.',
        10: 'Con rất ngoan, biết giúp đỡ bạn bè và chào cô khi đến lớp.',
      },
    ),
  },
  {
    id: 'khoa',
    code: '9192930072',
    name: 'Trần Đăng Khoa',
    school: 'Trường FINVIET',
    className: 'Lớp 10A1',
    dob: '12/04/2010',
    gender: 'Nam',
    guardians: [
      { name: 'Trần Đăng Khoa', phone: '0397 486 867', address: 'Thành phố Hồ Chí Minh' },
    ],
    heightCm: 165,
    weightKg: 65,
    zScore: 2.3,
    healthHistory: [
      { heightCm: 165, weightKg: 65, zScore: 2.3, recordedAt: '15/08/2026' },
      { heightCm: 164, weightKg: 63, zScore: 2.1, recordedAt: '15/06/2026' },
      { heightCm: 163, weightKg: 61, zScore: 1.9, recordedAt: '15/04/2026' },
    ],
    balance: 0,
    avatar: 'K',
    spending: [],
    timetable: {
      period: '10/08/2026 - 31/05/2027',
      lessons: [
        { period: 'Tiết 1', time: '07:00 - 07:45', subjects: ['Chào cờ', 'Toán', 'Ngữ văn', 'Vật lý', 'Toán'] },
        { period: 'Tiết 2', time: '07:50 - 08:35', subjects: ['Toán', 'Toán', 'Ngữ văn', 'Hóa học', 'Tiếng Anh'] },
        { period: 'Tiết 3', time: '08:50 - 09:35', subjects: ['Ngữ văn', 'Tiếng Anh', 'Lịch sử', 'Sinh học', 'Vật lý'] },
        { period: 'Tiết 4', time: '09:40 - 10:25', subjects: ['Tiếng Anh', 'Vật lý', 'Địa lý', 'Tin học', 'Hóa học'] },
        { period: 'Tiết 5', time: '10:30 - 11:15', subjects: ['GDQP-AN', 'Thể dục', 'GDCD', 'Tiếng Anh', 'Sinh hoạt lớp'] },
      ],
    },
    attendance: seedAttendance('two', {
      '2026-09-23': { morning: { status: 'unexcused' } },
      '2026-10-08': {
        morning: { status: 'present', checkIn: '07:31', checkOut: '11:40' },
        afternoon: { status: 'excused', note: 'Con khám bệnh, đã báo vắng' },
      },
    }),
    supportsTopUp: false,
    hasLinkedInvoice: true,
    recentActivity: [
      { title: 'Đã điểm danh', time: 'Thứ tư 08/07/2026 - 08:21' },
      { title: 'Đã điểm danh', time: 'Thứ ba 07/07/2026 - 08:00' },
      { title: 'Đã điểm danh', time: 'Thứ sáu 03/07/2026 - 08:13' },
      { title: 'Thêm liên kết học sinh Trần Đăng Khoa | 9192930072', time: '02/07/2026 - 13:41' },
    ],
    invoices: {
      linked: true,
      months: [
        {
          label: 'Hóa đơn tháng 6/2026',
          total: 1355000,
          items: [
            { name: 'Học phí 06/2026', amount: 200000 },
            { name: 'Tiền ăn tháng 06/2026', amount: 875000 },
            { name: 'Học liệu Lịch sử', amount: 280000 },
          ],
        },
        {
          label: 'Hóa đơn tháng 7/2026',
          total: 1426000,
          items: [
            { name: 'Học phí 07/2026', amount: 200000 },
            { name: 'Tiền ăn tháng 07/2026', amount: 945000 },
            { name: 'Học liệu Lịch sử', amount: 280000 },
          ],
        },
      ],
    },
    bills: [
      // School year 2025-2026 (Feb–Jul 2026): payments in Jan–Apr, Jun, Jul (Mar partly
      // paid) — May has no payment, so the month chart skips it and the < > arrows
      // have an older page; Apr bổ sung, May and Mar's Tiếng Anh stay open.
      // School year 2026-2027 (5 bills, the Tổng quan demo set when the app is
      // opened in Oct 2026): 3 fully paid (Aug, Sep, Sep bổ sung — the last
      // without an e-invoice), Oct partially paid, Oct bổ sung fully unpaid.
      // Sep has two paid bills so the month detail on Tổng quan can group them.
      {
        id: 'bill-2026-10b',
        label: 'Hóa đơn bổ sung tháng 10/2026',
        year: 2026,
        month: 10,
        items: [
          { id: 'b10b-1', name: 'Cơ sở vật chất', amount: 400000, paid: false },
          { id: 'b10b-2', name: 'Tiếng Anh', amount: 50000, paid: false },
          { id: 'b10b-3', name: 'Nước uống', amount: 50000, paid: false },
        ],
      },
      {
        id: 'bill-2026-10a',
        label: 'Hóa đơn tháng 10/2026',
        year: 2026,
        month: 10,
        items: [
          { id: 'b10a-1', name: 'Học phí 10/2026', amount: 2000000, paid: true },
          { id: 'b10a-2', name: 'Tiền ăn tháng 10/2026', amount: 980000, paid: false },
          { id: 'b10a-3', name: 'Ngoại khóa', amount: 50000, paid: false },
        ],
      },
      // Fully paid but no e-invoice (VAT) issued.
      {
        id: 'bill-2026-09b',
        label: 'Hóa đơn bổ sung tháng 9/2026',
        year: 2026,
        month: 9,
        items: [
          { id: 'b09b-1', name: 'Cơ sở vật chất', amount: 300000, paid: true },
          { id: 'b09b-2', name: 'Đồng phục', amount: 50000, paid: true },
          { id: 'b09b-3', name: 'Sổ liên lạc', amount: 50000, paid: true },
        ],
      },
      {
        id: 'bill-2026-09a',
        label: 'Hóa đơn tháng 9/2026',
        year: 2026,
        month: 9,
        hasVat: true,
        items: [
          { id: 'b09a-1', name: 'Học phí 09/2026', amount: 2000000, paid: true },
          { id: 'b09a-2', name: 'Tiền ăn tháng 09/2026', amount: 910000, paid: true },
          { id: 'b09a-3', name: 'Ngoại khóa', amount: 50000, paid: true },
          { id: 'b09a-4', name: 'Bảo hiểm y tế', amount: 50000, paid: true },
        ],
      },
      {
        id: 'bill-2026-08',
        label: 'Hóa đơn tháng 8/2026',
        year: 2026,
        month: 8,
        hasVat: true,
        items: [
          { id: 'b08-1', name: 'Học phí 08/2026', amount: 2000000, paid: true },
          { id: 'b08-2', name: 'Tiền ăn tháng 08/2026', amount: 840000, paid: true },
          { id: 'b08-3', name: 'Cơ sở vật chất', amount: 500000, paid: true },
          { id: 'b08-4', name: 'Tiếng Anh', amount: 50000, paid: true },
        ],
      },
      {
        id: 'bill-2026-07',
        label: 'Hóa đơn tháng 7/2026',
        year: 2026,
        month: 7,
        hasVat: true,
        items: [
          { id: 'b07-1', name: 'Học phí 07/2026', amount: 200000, paid: true },
          { id: 'b07-2', name: 'Tiền ăn tháng 07/2026', amount: 945000, paid: true },
          { id: 'b07-3', name: 'Cơ sở vật chất', amount: 280000, paid: true },
          { id: 'b07-4', name: 'Tiếng Anh', amount: 1000, paid: true },
        ],
      },
      {
        id: 'bill-2026-06',
        label: 'Hóa đơn tháng 6/2026',
        year: 2026,
        month: 6,
        hasVat: true,
        items: [
          { id: 'b06-1', name: 'Học phí 06/2026', amount: 200000, paid: true },
          { id: 'b06-2', name: 'Tiền ăn tháng 06/2026', amount: 910000, paid: true },
          { id: 'b06-3', name: 'Cơ sở vật chất', amount: 280000, paid: true },
          { id: 'b06-4', name: 'Tiếng Anh', amount: 1000, paid: true },
        ],
      },
      {
        id: 'bill-2026-05',
        label: 'Hóa đơn tháng 5/2026',
        year: 2026,
        month: 5,
        items: [
          { id: 'b05-1', name: 'Tiền ăn tháng 05/2026', amount: 490000, paid: false },
          { id: 'b05-2', name: 'Cơ sở vật chất', amount: 2000, paid: false },
          { id: 'b05-3', name: 'Tiếng Anh', amount: 1000, paid: false },
          { id: 'b05-4', name: 'Ngoại khóa', amount: 1000, paid: false },
        ],
      },
      {
        id: 'bill-2026-04a',
        label: 'Hóa đơn tháng 4/2026',
        year: 2026,
        month: 4,
        hasVat: true,
        items: [
          { id: 'b04a-1', name: 'Tiền ăn tháng 04/2026', amount: 770000, paid: true },
          { id: 'b04a-2', name: 'Cơ sở vật chất', amount: 2000, paid: true },
          { id: 'b04a-3', name: 'Tiếng Anh', amount: 1000, paid: true },
        ],
      },
      {
        id: 'bill-2026-04b',
        label: 'Hóa đơn tháng 4/2026',
        year: 2026,
        month: 4,
        items: [
          { id: 'b04b-1', name: 'Tiền ăn tháng 04/2026', amount: 22000, paid: false },
          { id: 'b04b-2', name: 'Cơ sở vật chất', amount: 2000, paid: false },
          { id: 'b04b-3', name: 'Tiếng Anh', amount: 2000, paid: false },
        ],
      },
      // Partially paid: học phí + tiền ăn settled, Tiếng Anh still open — the
      // case the "Thanh toán tiếp" CTA on the Đã thanh toán tab exists for.
      {
        id: 'bill-2026-03',
        label: 'Hóa đơn tháng 3/2026',
        year: 2026,
        month: 3,
        hasVat: true,
        items: [
          { id: 'b03-1', name: 'Học phí 03/2026', amount: 200000, paid: true },
          { id: 'b03-2', name: 'Tiền ăn tháng 03/2026', amount: 840000, paid: true },
          { id: 'b03-3', name: 'Tiếng Anh', amount: 1000, paid: false },
        ],
      },
      {
        id: 'bill-2026-02',
        label: 'Hóa đơn tháng 2/2026',
        year: 2026,
        month: 2,
        hasVat: true,
        items: [
          { id: 'b02-1', name: 'Học phí 02/2026', amount: 200000, paid: true },
          { id: 'b02-2', name: 'Tiền ăn tháng 02/2026', amount: 840000, paid: true },
        ],
      },
      {
        id: 'bill-2026-01',
        label: 'Hóa đơn tháng 1/2026',
        year: 2026,
        month: 1,
        items: [
          { id: 'b01-1', name: 'Học phí 01/2026', amount: 200000, paid: true },
          { id: 'b01-2', name: 'Tiền ăn tháng 01/2026', amount: 840000, paid: true },
        ],
      },
    ],
    homework: [
      {
        id: 'hw1',
        subject: 'GDQP-AN',
        title: 'Tính toán',
        status: 'graded',
        score: 10,
        teacher: 'Phùng Thị Thu',
        assignedDate: '26/05/2026',
        dueDate: '14:40 29/05/2026',
        content: 'Kiểm tra chủ đề',
        overdue: false,
        comment: 'Chưa có nhận xét',
        submissionFiles: ['bai-nop-toan-1.jpg'],
      },
      {
        id: 'hw2',
        subject: 'Toán',
        title: 'Bài tập nhỏ',
        status: 'notsubmitted',
        score: null,
        teacher: 'Phùng Thị Thu',
        assignedDate: '26/05/2026',
        dueDate: '14:40 29/05/2026',
        content: 'Kiểm tra chủ đề',
        overdue: true,
        comment: 'Chưa có nhận xét',
        submissionFiles: [],
      },
    ],
    absence: [
      { id: 'ab1', range: '10/07/2026 - 10/07/2026', status: 'pending', time: 'Cả ngày', days: 1, note: 'con xin nghi' },
      { id: 'ab2', range: '25/06/2026 - 27/06/2026', status: 'cancelled', time: 'Buổi sáng', days: 3, note: 'Con xin nghỉ phép' },
    ],
    medicine: [
      {
        id: 'khoamd1',
        from: '2026-10-12',
        to: '2026-10-16',
        doses: [
          { time: '08:00', note: 'Uống sau khi ăn sáng' },
          { time: '12:00', note: '' },
        ],
        note: 'Thuốc hạ sốt Paracetamol 250mg, uống 1 gói mỗi lần, nếu con sốt trên 38.5 độ.',
        photos: [medicinePhoto('Paracetamol', '#E5F1FB'), medicinePhoto('Đơn thuốc', '#FFF6D6')],
        status: 'sent',
        confirmations: { '2026-10-12|0': { by: 'Nguyễn Ngọc Lan', at: '2026-10-12T08:15' } },
      },
      {
        id: 'khoamd3',
        from: '2026-09-28',
        to: '2026-09-30',
        doses: [
          { time: '08:30', note: 'Uống sau khi ăn sáng khoảng 15 phút' },
          { time: '12:30', note: '' },
        ],
        note: 'Thuốc kháng sinh Amoxicillin 250mg, uống đủ liều theo chỉ định của bác sĩ.',
        photos: [medicinePhoto('Amoxicillin', '#E5F7EE')],
        status: 'sent',
        confirmations: Object.fromEntries(
          ['2026-09-28', '2026-09-29', '2026-09-30'].flatMap((d) => [
            [`${d}|0`, { by: 'Nguyễn Ngọc Lan', at: `${d}T08:35` }],
            [`${d}|1`, { by: 'Nguyễn Ngọc Lan', at: `${d}T12:34` }],
          ]),
        ),
      },
      {
        id: 'khoamd2',
        from: '2026-10-05',
        to: '2026-10-07',
        doses: [{ time: '10:30', note: 'Uống nhiều nước sau khi uống thuốc' }],
        note: 'Siro ho Prospan, uống 5ml mỗi lần.',
        photos: [],
        status: 'cancelled',
      },
    ],
    results: {
      year: '2025-2026',
      terms: {
        'Học kỳ I': { study: '--', behavior: '--', absentDays: '--' },
        'Học kỳ II': { study: '--', behavior: '--', absentDays: '--' },
        'Tổng kết': { study: '--', behavior: '--', absentDays: '--' },
      },
      subjects: [
        { name: 'Ngữ Văn', gtx: '--', gk: '--' },
        { name: 'Toán', gtx: '--', gk: '--' },
        { name: 'Ngoại ngữ 1', gtx: '--', gk: '--' },
      ],
    },
    goodBehavior: { weeks: [] },
  },
  {
    id: 'lam',
    code: '9192930085',
    name: 'Võ Phạm Hiểu Lam',
    school: 'Trường Mầm non Demo',
    className: 'Lớp Mầm',
    dob: '18/11/2022',
    gender: 'Nữ',
    guardians: [
      { name: 'Võ Thành Nam', phone: '0938 111 222', address: 'Thành phố Hồ Chí Minh' },
      { name: 'Phạm Thị Hồng', phone: '0907 333 444', address: 'Thành phố Hồ Chí Minh' },
    ],
    heightCm: 96,
    weightKg: 14,
    zScore: -2.4,
    healthHistory: [
      { heightCm: 96, weightKg: 14, zScore: -2.4, recordedAt: '01/09/2026' },
      { heightCm: 95, weightKg: 13.5, zScore: -2.3, recordedAt: '01/08/2026' },
      { heightCm: 94, weightKg: 13, zScore: -2.3, recordedAt: '01/07/2026' },
      { heightCm: 93, weightKg: 12.5, zScore: -2.2, recordedAt: '01/06/2026' },
      { heightCm: 92, weightKg: 12, zScore: -2.1, recordedAt: '01/05/2026' },
      { heightCm: 91.5, weightKg: 11.5, zScore: -2.0, recordedAt: '01/04/2026' },
    ],
    balance: 0,
    avatar: 'L',
    spending: [],
    timetable: null,
    attendance: { sessions: 'full', days: [] },
    supportsTopUp: false,
    hasLinkedInvoice: false,
    recentActivity: [
      { title: 'Thêm liên kết học sinh Võ Phạm Hiểu Lam | 9192930085', time: '20/07/2026 - 08:15' },
      { title: 'Đã kích hoạt thẻ học sinh Võ Phạm Hiểu Lam', time: '20/07/2026 - 08:15' },
    ],
    invoices: { linked: false, sample: [{ name: 'Học phí 07/2026', amount: 200000 }] },
    bills: [],
    homework: [],
    absence: [],
    medicine: [],
    results: null,
    goodBehavior: seedGoodBehavior(
      'Lê Thị Hồng',
      [true, false, true, true, false, true, true, true, false, true, false],
      {
        1: 'Con còn quấy khóc buổi trưa, cô sẽ phối hợp cùng gia đình.',
        5: 'Con ăn ngủ tốt, tự xúc ăn gọn gàng.',
        9: 'Con ngoan, ăn ngủ tốt.',
      },
    ),

  },
]

// ECO Me notification centre ("Thông báo"). No vanilla counterpart; the
// layout comes from a design screenshot. Mutated in place (read flags), like
// the rest of the mock data. `at` is local 'YYYY-MM-DDTHH:mm'. A notification
// with a `target` opens that feature when tapped.
export type NotificationCategory = 'transaction' | 'school'

export type NotificationTarget =
  | { type: 'medicine'; studentId: string; orderId: string }
  // Opens a service by intent id (see ServiceIntent), optionally a chat thread.
  | { type: 'service'; intent: string; studentId: string; threadId?: string; albumId?: string }

export interface AppNotification {
  id: string
  category: NotificationCategory
  title: string
  body: string
  at: string
  read: boolean
  target?: NotificationTarget
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'nt-md1',
    category: 'school',
    title: 'Thông báo đã uống thuốc - khung giờ 08:00',
    body: 'Giáo viên đã cho học sinh Trần Đăng Khoa uống thuốc. Nhấn để xem chi tiết.',
    at: '2026-10-12T08:15',
    read: false,
    target: { type: 'medicine', studentId: 'khoa', orderId: 'khoamd1' },
  },
  {
    id: 'nt-menu',
    category: 'school',
    title: 'Thực đơn đã được cập nhật',
    body: 'Thực đơn tuần 12/10/2026 - 16/10/2026 đã được cập nhật. Phụ huynh vui lòng xem thông tin mới nhất.',
    at: '2026-10-09T11:39',
    read: false,
    target: { type: 'service', intent: 'menu', studentId: 'vy' },
  },
  {
    id: 'nt-album',
    category: 'school',
    title: 'Album Ngày hội Trung thu 2026 có ảnh/video mới',
    body: 'Nhà trường vừa đăng 14 ảnh/video mới trong album Ngày hội Trung thu 2026. Bấm vào để xem chi tiết.',
    at: '2026-10-10T09:05',
    read: false,
    target: { type: 'service', intent: 'gallery', studentId: 'vy', albumId: 'al-trungthu' },
  },
  {
    id: 'nt-chat1',
    category: 'school',
    title: 'Tin nhắn mới từ giáo viên Cô Trang',
    body: 'Cô Trang: Chiều nay bé ăn hết phần cháo và ngủ rất ngon ạ.',
    at: '2026-10-09T15:30',
    read: false,
    target: { type: 'service', intent: 'chat', studentId: 'vy', threadId: 'ch-vy-gv' },
  },
  {
    id: 'nt-chat2',
    category: 'school',
    title: 'Tin mới trong nhóm lớp Nhóm lớp 10A1',
    body: 'Thầy Huy: Thông báo: Họp phụ huynh lớp vào 19h00 thứ Sáu tuần này.',
    at: '2026-10-09T18:00',
    read: false,
    target: { type: 'service', intent: 'chat', studentId: 'khoa', threadId: 'ch-khoa-group' },
  },
  {
    id: 'nt-pay1',
    category: 'transaction',
    title: 'Thanh toán thành công',
    body: 'Thanh toán 15,000đ thành công cho Cafe take away',
    at: '2026-10-09T09:53',
    read: false,
  },
  {
    id: 'nt-gb1',
    category: 'school',
    title: 'Chúc mừng Phan Khánh Vy đã nhận Phiếu bé ngoan',
    body: 'Phan Khánh Vy đã nhận Phiếu bé ngoan tuần 05/10/2026 - 09/10/2026. Nhấn để xem nhận xét của giáo viên.',
    at: '2026-10-06T11:20',
    read: false,
    target: { type: 'service', intent: 'goodbehavior', studentId: 'vy' },
  },
  {
    id: 'nt-gb0',
    category: 'school',
    title: 'Chúc mừng Phan Khánh Vy đã nhận Phiếu bé ngoan',
    body: 'Phan Khánh Vy đã nhận Phiếu bé ngoan tuần 28/09/2026 - 02/10/2026. Nhấn để xem nhận xét của giáo viên.',
    at: '2026-10-05T10:48',
    read: true,
    target: { type: 'service', intent: 'goodbehavior', studentId: 'vy' },
  },
  {
    id: 'nt-pay0',
    category: 'transaction',
    title: 'Nạp tiền thành công',
    body: 'Bạn đã nạp 200,000đ vào Ví ECO thành công.',
    at: '2026-10-03T14:05',
    read: true,
  },
]

export function unreadNotificationCount(): number {
  return MOCK_NOTIFICATIONS.filter((n) => !n.read).length
}

export function getStudent(id: string): Student | undefined {
  return MOCK_STUDENTS.find((s) => s.id === id)
}

// "Phiếu bé ngoan" only applies to Mầm non (preschool) students.
export function isMamNonStudent(s: Student): boolean {
  return s.school.includes('Mầm non')
}

export const sumItems = (items: BillItem[]) => items.reduce((n, it) => n + it.amount, 0)

export function abbreviateName(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length <= 1) return name
  return parts[0] + ' ' + parts.slice(1).map((p) => p[0] + '.').join(' ')
}

export function fmtMoney(n: number): string {
  return n.toLocaleString('vi-VN') + 'đ'
}
