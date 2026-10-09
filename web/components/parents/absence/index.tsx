'use client'

import { useState } from 'react'
import { MOCK_STUDENTS, getStudent, type AbsenceStatus } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { Dialog } from '@/components/parents/shared/dialog'
import { AbsenceListScreen } from './absence-list-screen'
import { AbsenceCreateScreen, DEFAULT_ABSENCE_FORM, type AbsenceFormState } from './absence-create-screen'

interface AbsenceAppProps {
  studentId: string
  onBack: () => void
}

type AbsenceScreen = 'list' | 'create'

// Mirrors App.confirmAbsence() in ../../../scripts/app.js: mutates the
// module-level MOCK_STUDENTS array in place (same "no real store" pattern
// eduteachers uses for its own PHIEU_BE_NGOAN_RECORDS — see its
// components/teachers/phieu-be-ngoan/index.tsx) and bumps a version counter
// to force React to re-read it.
export function AbsenceApp({ studentId, onBack }: AbsenceAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [screen, setScreen] = useState<AbsenceScreen>('list')
  const [filter, setFilter] = useState<'all' | AbsenceStatus>('all')
  const [form, setForm] = useState<AbsenceFormState>(DEFAULT_ABSENCE_FORM)
  const [showPicker, setShowPicker] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [, setVersion] = useState(0)

  const student = getStudent(selectedStudentId)
  if (!student) return null

  const handleFieldChange = <K extends keyof AbsenceFormState>(field: K, value: AbsenceFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddPhotos = (count: number) => {
    setForm((prev) => ({ ...prev, photos: Math.min(10, prev.photos + count) }))
  }

  const handleSubmit = () => {
    setShowSuccess(true)
  }

  const handleConfirmSuccess = () => {
    const fmt = (isoDate: string) => {
      const [y, m, d] = isoDate.split('-')
      return `${d}/${m}/${y}`
    }
    student.absence.unshift({
      id: 'ab' + Date.now(),
      range: `${fmt(form.from)} - ${fmt(form.to)}`,
      status: 'pending',
      time: form.period === 'full' ? 'Cả ngày' : form.period === 'morning' ? 'Buổi sáng' : 'Buổi chiều',
      days: 1,
      note: form.note,
    })
    setVersion((v) => v + 1)
    setForm(DEFAULT_ABSENCE_FORM)
    setShowSuccess(false)
    setFilter('all')
    setScreen('list')
  }

  return (
    <>
      {screen === 'list' ? (
        <AbsenceListScreen
          student={student}
          absences={student.absence}
          filter={filter}
          onFilterChange={setFilter}
          onBack={onBack}
          onChangeStudent={() => setShowPicker(true)}
          onCreate={() => setScreen('create')}
        />
      ) : (
        <AbsenceCreateScreen
          student={student}
          form={form}
          onFieldChange={handleFieldChange}
          onAddPhotos={handleAddPhotos}
          onBack={() => setScreen('list')}
          onChangeStudent={() => setShowPicker(true)}
          onSubmit={handleSubmit}
        />
      )}

      {showPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS}
          selectedStudentId={selectedStudentId}
          onSelect={(s) => {
            setSelectedStudentId(s.id)
            setScreen('list')
            setFilter('all')
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {showSuccess && (
        <Dialog
          title="Thành công"
          subtitle="Xin phép vắng thành công"
          ctaLabel="Đã hiểu"
          onConfirm={handleConfirmSuccess}
        />
      )}
    </>
  )
}
