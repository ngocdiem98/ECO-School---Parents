'use client'

import { useState } from 'react'
import { getStudent } from '@/lib/mock-data'
import { TopBar, StudentHeader } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { eligibleStudents } from '@/components/parents/shared/use-service-launcher'

interface DigitalReportAppProps {
  studentId: string
  onBack: () => void
}

// Học bạ số: its PRD page (PH-06) is empty, so the screen is only the empty
// state for every student.
export function DigitalReportApp({ studentId, onBack }: DigitalReportAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [showPicker, setShowPicker] = useState(false)
  const switchable = eligibleStudents('digitalreport')
  const canSwitch = switchable.length > 1

  const student = getStudent(selectedStudentId)
  if (!student) return null

  return (
    <div className="screen">
      <TopBar title="Học bạ số" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={canSwitch ? () => setShowPicker(true) : undefined} />
      <div className="empty-state">
        <img src="/ds/payment/empty-bill.svg" alt="" width={96} height={96} />
        <div className="text">Chưa có thông tin học bạ số</div>
      </div>
      {showPicker && (
        <StudentPickerSheet
          students={switchable}
          selectedStudentId={selectedStudentId}
          onSelect={(s) => {
            setSelectedStudentId(s.id)
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}
