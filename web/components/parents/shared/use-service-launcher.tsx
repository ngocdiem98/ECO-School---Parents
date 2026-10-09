'use client'

import { useState, type ReactNode } from 'react'
import { MOCK_STUDENTS, isMamNonStudent, type Student } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'

// Shared by every screen that launches a student-scoped service (the ECO
// Phụ huynh Home grid, the ECO Me home and its "Danh sách dịch vụ" list).
// Mirrors App.pickStudent's eligibility check in ../../../scripts/app.js.

export type ServiceIntent = 'fee' | 'topup' | 'goodbehavior' | 'hoadon' | 'absence' | 'homework' | 'results'

export interface ServiceNav {
  onNavigateToPhieuBeNgoan: (studentId: string) => void
  onNavigateToFee: (studentId: string) => void
  onNavigateToTopup: (studentId: string) => void
  onNavigateToAbsence: (studentId: string) => void
  onNavigateToHomework: (studentId: string) => void
  onNavigateToResults: (studentId: string) => void
  onNavigateToHoaDon: (studentId: string) => void
}

// "Nạp điểm vào thẻ" only lists students whose school supports top-up,
// "Phiếu bé ngoan" only applies to Mầm non students, and "Hóa đơn" only to
// students with bills.
export function eligibleStudents(intent: ServiceIntent): Student[] {
  switch (intent) {
    case 'topup':
      return MOCK_STUDENTS.filter((s) => s.supportsTopUp)
    case 'goodbehavior':
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

  const navigateFor = (intent: ServiceIntent, studentId: string) => {
    if (intent === 'fee') nav.onNavigateToFee(studentId)
    else if (intent === 'topup') nav.onNavigateToTopup(studentId)
    else if (intent === 'goodbehavior') nav.onNavigateToPhieuBeNgoan(studentId)
    else if (intent === 'absence') nav.onNavigateToAbsence(studentId)
    else if (intent === 'homework') nav.onNavigateToHomework(studentId)
    else if (intent === 'results') nav.onNavigateToResults(studentId)
    else if (intent === 'hoadon') nav.onNavigateToHoaDon(studentId)
  }

  const launch = (intent: ServiceIntent) => {
    const eligible = eligibleStudents(intent)
    if (eligible.length === 1) navigateFor(intent, eligible[0].id)
    else setPickerIntent(intent)
  }

  const picker = pickerIntent ? (
    <StudentPickerSheet
      students={eligibleStudents(pickerIntent)}
      onSelect={(s) => {
        setPickerIntent(null)
        navigateFor(pickerIntent, s.id)
      }}
      onClose={() => setPickerIntent(null)}
    />
  ) : null

  return { launch, picker }
}
