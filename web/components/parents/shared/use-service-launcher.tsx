'use client'

import { useState, type ReactNode } from 'react'
import { MOCK_STUDENTS, isMamNonStudent, type Student } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'

// Shared by every screen that launches a student-scoped service (the ECO
// Phụ huynh Home grid, the ECO Me home and its "Danh sách dịch vụ" list).
// Mirrors App.pickStudent's eligibility check in ../../../scripts/app.js.

export type ServiceIntent =
  | 'fee'
  | 'topup'
  | 'goodbehavior'
  | 'hoadon'
  | 'absence'
  | 'homework'
  | 'results'
  | 'medicine'
  | 'attendance'
  | 'timetable'
  | 'spending'
  | 'menu'
  | 'activity'
  | 'bulletin'
  | 'diary'
  | 'chat'
  | 'gallery'
  | 'feedback'
  | 'postpaid'
  | 'development'
  | 'pickup'
  | 'healthadvice'
  | 'survey'
  | 'digitalreport'

// One handler for every service: page.tsx maps the intent to a screen.
export interface ServiceNav {
  onOpenService: (intent: ServiceIntent, studentId: string) => void
}

// "Nạp điểm vào thẻ" only lists students whose school supports top-up,
// "Phiếu bé ngoan", "Nhật ký chăm sóc" and "Tiến trình phát triển" only apply to Mầm non students, and
// "Hóa đơn" only to students with bills.
export function eligibleStudents(intent: ServiceIntent): Student[] {
  switch (intent) {
    case 'topup':
      return MOCK_STUDENTS.filter((s) => s.supportsTopUp)
    case 'goodbehavior':
    case 'diary':
    case 'development':
      return MOCK_STUDENTS.filter(isMamNonStudent)
    case 'hoadon':
      return MOCK_STUDENTS.filter((s) => s.bills.length > 0)
    default:
      return MOCK_STUDENTS
  }
}

// `launch(intent)` opens a service: straight in when exactly one student
// qualifies, otherwise the student picker sheet. Render `picker` somewhere in
// the screen's tree.
export function useServiceLauncher(nav: ServiceNav): { launch: (intent: ServiceIntent) => void; picker: ReactNode } {
  const [pickerIntent, setPickerIntent] = useState<ServiceIntent | null>(null)

  const launch = (intent: ServiceIntent) => {
    const eligible = eligibleStudents(intent)
    if (eligible.length === 1) nav.onOpenService(intent, eligible[0].id)
    else setPickerIntent(intent)
  }

  const picker = pickerIntent ? (
    <StudentPickerSheet
      students={eligibleStudents(pickerIntent)}
      onSelect={(s) => {
        setPickerIntent(null)
        nav.onOpenService(pickerIntent, s.id)
      }}
      onClose={() => setPickerIntent(null)}
    />
  ) : null

  return { launch, picker }
}
