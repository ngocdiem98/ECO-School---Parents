export type PickupRole = 'main_connector' | 'auxiliary'

/**
 * Hai nhóm người được ủy quyền đón trẻ:
 * - 'sub_connector' (Case 1): Người liên kết phụ (tự động thêm vào danh sách, mặc định tắt, chỉ tính vào hạn mức khi bật)
 * - 'added_new' (Case 2): Người được thêm mới bởi Người liên kết chính
 */
export type PickupAuthorizedType = 'sub_connector' | 'added_new'

export type PickupRelationship =
  | 'Bố'
  | 'Mẹ'
  | 'Ông'
  | 'Bà'
  | 'Cô'
  | 'Chú'
  | 'Bác'
  | 'Dì'
  | 'Tài xế'
  | 'Người giúp việc'
  | 'Khác'

export const PICKUP_RELATIONSHIPS: PickupRelationship[] = [
  'Bố',
  'Mẹ',
  'Ông',
  'Bà',
  'Cô',
  'Chú',
  'Bác',
  'Dì',
  'Tài xế',
  'Người giúp việc',
  'Khác',
]

export type PickupStatus = 'active' | 'paused'

export interface PickupPerson {
  id: string
  studentId: string
  fullName: string
  phoneNumber: string
  relationship: PickupRelationship
  nationalId: string // CCCD (12 số) hoặc CMND (9 số)
  avatarUrl: string
  role: PickupRole
  authorizedType?: PickupAuthorizedType
  status: PickupStatus
  note?: string
  createdAt: string
  updatedAt: string
}

export const MAX_AUXILIARY_PICKUP = 2
export const STORAGE_KEY_PICKUP = 'eco_pickup_persons_v3'

export const PRESET_AVATARS = [
  { id: 'av_grandma', label: 'Bà', src: '👵', bg: '#FEF3C7', color: '#D97706' },
  { id: 'av_grandpa', label: 'Ông', src: '👴', bg: '#E0E7FF', color: '#4F46E5' },
  { id: 'av_father', label: 'Bố / Chú', src: '👨', bg: '#DBEAFE', color: '#2563EB' },
  { id: 'av_mother', label: 'Mẹ / Cô', src: '👩', bg: '#FCE7F3', color: '#DB2777' },
  { id: 'av_driver', label: 'Tài xế', src: '🚗', bg: '#D1FAE5', color: '#059669' },
  { id: 'av_helper', label: 'Giúp việc', src: '🧑‍🍳', bg: '#F3E8FF', color: '#9333EA' },
  { id: 'av_other', label: 'Khác', src: '👤', bg: '#F3F4F6', color: '#4B5563' },
]

export const INITIAL_PICKUP_DATA: Record<string, PickupPerson[]> = {
  vy: [
    {
      id: 'pickup_vy_main',
      studentId: 'vy',
      fullName: 'Phan Quốc Bảo',
      phoneNumber: '0909988776',
      relationship: 'Bố',
      nationalId: '079082003456',
      avatarUrl: '👨',
      role: 'main_connector',
      status: 'active',
      note: 'Người liên kết chính',
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'pickup_vy_sub_1',
      studentId: 'vy',
      fullName: 'Lê Thu Trang',
      phoneNumber: '0914556677',
      relationship: 'Mẹ',
      nationalId: '079192004455',
      avatarUrl: '👩',
      role: 'auxiliary',
      authorizedType: 'sub_connector',
      status: 'paused',
      createdAt: '2026-09-02T08:00:00Z',
      updatedAt: '2026-09-02T08:00:00Z',
    },
  ],
  khoa: [
    {
      id: 'pickup_khoa_main',
      studentId: 'khoa',
      fullName: 'Trần Thị Thảo',
      phoneNumber: '0987654321',
      relationship: 'Mẹ',
      nationalId: '079190001122',
      avatarUrl: '👩',
      role: 'main_connector',
      status: 'active',
      note: 'Người liên kết chính',
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'pickup_khoa_sub_1',
      studentId: 'khoa',
      fullName: 'Phạm Minh Quân',
      phoneNumber: '0988776655',
      relationship: 'Bố',
      nationalId: '079087002211',
      avatarUrl: '👨',
      role: 'auxiliary',
      authorizedType: 'sub_connector',
      status: 'paused',
      createdAt: '2026-09-02T08:00:00Z',
      updatedAt: '2026-09-02T08:00:00Z',
    },
    {
      id: 'pickup_khoa_aux_1',
      studentId: 'khoa',
      fullName: 'Phạm Văn Dũng',
      phoneNumber: '0978112233',
      relationship: 'Bác',
      nationalId: '079088003344',
      avatarUrl: '👨',
      role: 'auxiliary',
      authorizedType: 'added_new',
      status: 'active',
      note: 'Đón bé khi phụ huynh có lịch công tác',
      createdAt: '2026-10-02T14:15:00Z',
      updatedAt: '2026-10-02T14:15:00Z',
    },
  ],
  lam: [
    {
      id: 'pickup_lam_main',
      studentId: 'lam',
      fullName: 'Trần Văn Hoàng',
      phoneNumber: '0918765432',
      relationship: 'Bố',
      nationalId: '079080009988',
      avatarUrl: '👨',
      role: 'main_connector',
      status: 'active',
      note: 'Người liên kết chính',
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'pickup_lam_sub_1',
      studentId: 'lam',
      fullName: 'Nguyễn Thị Tuyết',
      phoneNumber: '0907333444',
      relationship: 'Mẹ',
      nationalId: '079191003344',
      avatarUrl: '👩',
      role: 'auxiliary',
      authorizedType: 'sub_connector',
      status: 'paused',
      createdAt: '2026-09-02T08:00:00Z',
      updatedAt: '2026-09-02T08:00:00Z',
    },
  ],
}

export function maskNationalId(id: string): string {
  if (!id) return ''
  const trimmed = id.trim()
  if (trimmed.length <= 6) return trimmed
  const start = trimmed.slice(0, 3)
  const end = trimmed.slice(-4)
  return `${start}*****${end}`
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return ''
  const clean = phone.replace(/\D/g, '')
  if (clean.length === 10) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`
  }
  return phone
}

export function loadPickupData(studentId: string): PickupPerson[] {
  if (typeof window === 'undefined') {
    return INITIAL_PICKUP_DATA[studentId] || []
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PICKUP}_${studentId}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Error loading pickup data from storage:', err)
  }
  return (
    INITIAL_PICKUP_DATA[studentId] || [
      {
        id: `pickup_${studentId}_main`,
        studentId,
        fullName: 'Phụ huynh học sinh',
        phoneNumber: '0901234567',
        relationship: 'Bố',
        nationalId: '079000000000',
        avatarUrl: '👨',
        role: 'main_connector',
        status: 'active',
        note: 'Người liên kết chính',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  )
}

export function savePickupData(studentId: string, list: PickupPerson[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      `${STORAGE_KEY_PICKUP}_${studentId}`,
      JSON.stringify(list)
    )
  } catch (err) {
    console.error('Error saving pickup data to storage:', err)
  }
}
