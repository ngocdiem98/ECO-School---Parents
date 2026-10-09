// Mirrors the STUDENTS mock data in ../../scripts/app.js (vanilla app) so
// both versions show identical numbers while they coexist. Đợt 3 adds the
// fields needed for Báo vắng, Bài tập, and Kết quả học tập. Fields for
// screens still not rebuilt (spending history, timetable, attendance) are
// still not ported.

export type GbStatus = 'dat' | 'khongdat'

export type AbsenceStatus = 'pending' | 'approved' | 'cancelled'

export interface AbsenceRequest {
  id: string
  range: string
  status: AbsenceStatus
  time: string
  days: number
  note: string
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

export interface GoodBehaviorCycle {
  id: string
  type: 'week' | 'month'
  label: string
  status: GbStatus
  comment: string | null
  // ISO date (YYYY-MM-DD) of the Monday that starts this cycle's week —
  // only set for type: 'week', used to place the cycle on the calendar in
  // the "Tổng kết" tab (the week's Sunday cell gets the star).
  weekStart?: string
}

export interface GoodBehaviorRankingEntry {
  name: string
  count: number
  isSelf?: boolean
}

// Count of times the child has placed 1st/2nd/3rd in the class ranking,
// tallied at the end of each month based on the "Phiếu bé ngoan" count at
// that time — distinct from `top3`/`selfRank`, which reflect the *current*
// standing.
export interface GoodBehaviorPositionsAchieved {
  first: number
  second: number
  third: number
}

export interface GoodBehaviorRanking {
  achieved: number
  totalCycles: number
  top3: GoodBehaviorRankingEntry[]
  selfInTop3: boolean
  selfRank: number | null
  totalStudents: number
  // Week label the ranking was last recalculated for — the leaderboard
  // updates weekly, so this can lag behind the child's own latest cycle.
  asOfLabel: string
  positionsAchieved: GoodBehaviorPositionsAchieved
}

export interface GoodBehavior {
  yearLabel: string
  cycles: GoodBehaviorCycle[]
  ranking: GoodBehaviorRanking
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
    results: null,
    goodBehavior: {
      yearLabel: 'Năm học 2025 - 2026',
      cycles: [
        { id: 'vygb0', type: 'week', label: 'Tuần 27/07 - 02/08/2026', status: 'dat', comment: null, weekStart: '2026-07-27' },
        { id: 'vygb0b', type: 'week', label: 'Tuần 20/07 - 26/07/2026', status: 'khongdat', comment: null, weekStart: '2026-07-20' },
        { id: 'vygb1', type: 'week', label: 'Tuần 13/07 - 18/07/2026', status: 'dat', comment: 'Con rất ngoan, biết giúp đỡ bạn bè', weekStart: '2026-07-13' },
        { id: 'vygb2', type: 'week', label: 'Tuần 06/07 - 11/07/2026', status: 'dat', comment: null, weekStart: '2026-07-06' },
        { id: 'vygb3', type: 'week', label: 'Tuần 29/06 - 04/07/2026', status: 'dat', comment: null, weekStart: '2026-06-29' },
        { id: 'vygb4', type: 'week', label: 'Tuần 22/06 - 27/06/2026', status: 'khongdat', comment: null, weekStart: '2026-06-22' },
        { id: 'vygb5', type: 'month', label: 'Tháng 6/2026', status: 'dat', comment: 'Con tích cực tham gia các hoạt động của lớp' },
      ],
      ranking: {
        achieved: 25,
        totalCycles: 32,
        top3: [
          { name: 'Trần Thị Bình', count: 30 },
          { name: 'Nguyễn Văn An', count: 28 },
          { name: 'Lê Gia Hân', count: 27 },
        ],
        selfInTop3: false,
        selfRank: 5,
        totalStudents: 32,
        asOfLabel: 'Tuần 13/07 - 18/07/2026',
        positionsAchieved: { first: 2, second: 3, third: 0 },
      },
    },
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
        items: [
          { id: 'b07-1', name: 'Học phí 07/2026', amount: 200000, paid: false },
          { id: 'b07-2', name: 'Tiền ăn tháng 07/2026', amount: 945000, paid: false },
          { id: 'b07-3', name: 'Cơ sở vật chất', amount: 280000, paid: false },
          { id: 'b07-4', name: 'Tiếng Anh', amount: 1000, paid: false },
        ],
      },
      {
        id: 'bill-2026-06',
        label: 'Hóa đơn tháng 6/2026',
        year: 2026,
        month: 6,
        items: [
          { id: 'b06-1', name: 'Học phí 06/2026', amount: 200000, paid: false },
          { id: 'b06-2', name: 'Tiền ăn tháng 06/2026', amount: 910000, paid: false },
          { id: 'b06-3', name: 'Cơ sở vật chất', amount: 280000, paid: false },
          { id: 'b06-4', name: 'Tiếng Anh', amount: 1000, paid: false },
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
        items: [
          { id: 'b04a-1', name: 'Tiền ăn tháng 04/2026', amount: 770000, paid: false },
          { id: 'b04a-2', name: 'Cơ sở vật chất', amount: 2000, paid: false },
          { id: 'b04a-3', name: 'Tiếng Anh', amount: 1000, paid: false },
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
    goodBehavior: {
      yearLabel: 'Năm học 2025 - 2026',
      cycles: [
        { id: 'khoagb1', type: 'week', label: 'Tuần 13/07 - 18/07/2026', status: 'khongdat', comment: 'Con còn nói chuyện riêng trong giờ học', weekStart: '2026-07-13' },
        { id: 'khoagb2', type: 'week', label: 'Tuần 06/07 - 11/07/2026', status: 'dat', comment: 'Con tích cực phát biểu xây dựng bài', weekStart: '2026-07-06' },
        { id: 'khoagb3', type: 'month', label: 'Tháng 6/2026', status: 'dat', comment: null },
        { id: 'khoagb4', type: 'week', label: 'Tuần 22/06 - 27/06/2026', status: 'dat', comment: null, weekStart: '2026-06-22' },
        { id: 'khoagb5', type: 'week', label: 'Tuần 15/06 - 20/06/2026', status: 'khongdat', comment: null, weekStart: '2026-06-15' },
      ],
      ranking: {
        achieved: 18,
        totalCycles: 28,
        top3: [
          { name: 'Nguyễn Thị Mai', count: 27 },
          { name: 'Đặng Văn Hùng', count: 25 },
          { name: 'Lý Gia Bảo', count: 23 },
        ],
        selfInTop3: false,
        selfRank: 7,
        totalStudents: 25,
        asOfLabel: 'Tuần 13/07 - 18/07/2026',
        positionsAchieved: { first: 0, second: 1, third: 2 },
      },
    },
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
    results: null,
    goodBehavior: {
      yearLabel: 'Năm học 2025 - 2026',
      cycles: [
        { id: 'lamgb1', type: 'week', label: 'Tuần 27/07 - 02/08/2026', status: 'dat', comment: 'Con ngoan, ăn ngủ tốt', weekStart: '2026-07-27' },
        { id: 'lamgb2', type: 'week', label: 'Tuần 20/07 - 26/07/2026', status: 'dat', comment: null, weekStart: '2026-07-20' },
        { id: 'lamgb3', type: 'week', label: 'Tuần 13/07 - 18/07/2026', status: 'khongdat', comment: 'Con còn quấy khóc buổi trưa', weekStart: '2026-07-13' },
        { id: 'lamgb4', type: 'month', label: 'Tháng 6/2026', status: 'dat', comment: null },
      ],
      ranking: {
        achieved: 10,
        totalCycles: 14,
        top3: [
          { name: 'Nguyễn Bảo Ngọc', count: 13 },
          { name: 'Trần Gia Khang', count: 12 },
          { name: 'Đỗ Minh Thư', count: 11 },
        ],
        selfInTop3: false,
        selfRank: 6,
        totalStudents: 20,
        asOfLabel: 'Tuần 20/07 - 26/07/2026',
        positionsAchieved: { first: 0, second: 1, third: 2 },
      },
    },
  },
]

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
