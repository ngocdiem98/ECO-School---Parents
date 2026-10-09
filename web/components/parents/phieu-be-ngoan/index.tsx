'use client'

import { useState } from 'react'
import { MOCK_STUDENTS, getStudent, isMamNonStudent } from '@/lib/mock-data'
import { TopBar, StudentHeader } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { PhieuCuaConScreen } from './phieu-cua-con-screen'
import { TongKetScreen } from './tong-ket-screen'

interface PhieuBeNgoanAppProps {
  studentId: string
  onBack: () => void
}

type Tab = 'card' | 'summary'

const TABS: { value: Tab; label: string }[] = [
  { value: 'card', label: 'Phiếu của con' },
  { value: 'summary', label: 'Tổng kết' },
]

export function PhieuBeNgoanApp({ studentId, onBack }: PhieuBeNgoanAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [tab, setTab] = useState<Tab>('card')
  const [showPicker, setShowPicker] = useState(false)

  const student = getStudent(selectedStudentId)
  if (!student) return null

  return (
    <div className="screen">
      <TopBar title="Phiếu bé ngoan" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={() => setShowPicker(true)} />

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.value}
            className={`tab-pill ${tab === t.value ? 'active' : ''}`}
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'card' ? (
        <PhieuCuaConScreen goodBehavior={student.goodBehavior} />
      ) : (
        <TongKetScreen goodBehavior={student.goodBehavior} />
      )}

      {showPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS.filter(isMamNonStudent)}
          selectedStudentId={selectedStudentId}
          onSelect={(s) => {
            setSelectedStudentId(s.id)
            setTab('card')
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}
