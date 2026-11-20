'use client'

import { useEffect, useState } from 'react'
import { MOCK_STUDENTS, getStudent, type MedicineStatus } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { eligibleStudents } from '@/components/parents/shared/use-service-launcher'
import { Dialog } from '@/components/parents/shared/dialog'
import { MedicineListScreen } from './medicine-list-screen'
import { MedicineCreateScreen, type MedicineSubmit } from './medicine-create-screen'
import { MedicineDetailScreen } from './medicine-detail-screen'
import { CoachMarks, type CoachStep } from '@/components/parents/shared/coach-marks'
import { useFirstRun } from '@/components/parents/shared/first-run'
import { Toast } from '@/components/parents/shared/toast'

interface MedicineAppProps {
  studentId: string
  // Deep link (from a notification): start on this order's detail, and let
  // back leave the feature instead of going to the list.
  openOrderId?: string | null
  onBack: () => void
}

type MedicineScreen = 'list' | 'create' | 'detail'

// Chỉ dẫn lần đầu (EDU-2106 phần B).
const COACH: CoachStep[] = [
  { target: 'medicine-create', text: 'Gửi cô đơn dặn thuốc kèm ảnh thuốc, liều và giờ uống.' },
  { target: 'medicine-list', text: 'Xem cô đã nhận và cho con uống thuốc chưa tại đây.' },
]

// [PH-13] Phụ huynh gửi đơn dặn thuốc. No vanilla counterpart — built from
// the PRD (Confluence EDUS, pageId 99230047). Same "mutate MOCK_STUDENTS in
// place + bump a version counter" pattern as AbsenceApp. Orders need no
// approval: they are saved straight as "Đã gửi" and the parent can only
// cancel them (irreversible).
export function MedicineApp({ studentId, openOrderId, onBack }: MedicineAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [screen, setScreen] = useState<MedicineScreen>(openOrderId ? 'detail' : 'list')
  const [deepLinked, setDeepLinked] = useState(!!openOrderId)
  const [filter, setFilter] = useState<'all' | MedicineStatus>('all')
  const [orderId, setOrderId] = useState<string | null>(openOrderId ?? null)
  const [showPicker, setShowPicker] = useState(false)
  const switchable = eligibleStudents('medicine')
  const canSwitch = switchable.length > 1
  const [showCancelled, setShowCancelled] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [, setVersion] = useState(0)
  // Opening an order from a notification does not count as the first visit.
  const coach = useFirstRun('coach-medicine', screen === 'list' && !openOrderId)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const student = getStudent(selectedStudentId)
  if (!student) return null
  const order = orderId ? student.medicine.find((o) => o.id === orderId) : undefined

  const handleSubmit = (data: MedicineSubmit) => {
    student.medicine.unshift({ id: 'md' + Date.now(), ...data, status: 'sent' })
    setVersion((v) => v + 1)
    setFilter('all')
    setScreen('list')
    setToast('Tạo đơn dặn thuốc của học sinh đã được gửi thành công đến giáo viên.')
  }

  const handleCancel = () => {
    if (!order) return
    order.status = 'cancelled'
    setVersion((v) => v + 1)
    setShowCancelled(true)
  }

  return (
    <>
      {screen === 'list' && (
        <MedicineListScreen
          student={student}
          orders={student.medicine}
          filter={filter}
          onFilterChange={setFilter}
          onBack={onBack}
          onChangeStudent={canSwitch ? () => setShowPicker(true) : undefined}
          onOpen={(id) => {
            setOrderId(id)
            setScreen('detail')
          }}
          onCreate={() => setScreen('create')}
        />
      )}
      {screen === 'create' && (
        <MedicineCreateScreen
          student={student}
          onBack={() => setScreen('list')}
          onChangeStudent={canSwitch ? () => setShowPicker(true) : undefined}
          onSubmit={handleSubmit}
          onWarn={setToast}
        />
      )}
      {screen === 'detail' && order && (
        <MedicineDetailScreen
          student={student}
          order={order}
          onBack={() => (deepLinked ? onBack() : setScreen('list'))}
          onCancel={handleCancel}
          onToast={setToast}
        />
      )}

      {coach.active && screen === 'list' && <CoachMarks steps={COACH} onDone={coach.finish} onSkip={coach.finish} />}

      {showPicker && (
        <StudentPickerSheet
          students={switchable}
          selectedStudentId={selectedStudentId}
          onSelect={(s) => {
            setSelectedStudentId(s.id)
            setScreen('list')
            setDeepLinked(false)
            setFilter('all')
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {showCancelled && (
        <Dialog
          title="Đã hủy đơn"
          subtitle="Đơn dặn thuốc của bạn đã được hủy."
          ctaLabel="Đã hiểu"
          onConfirm={() => setShowCancelled(false)}
        />
      )}

      {toast && <Toast message={toast} />}
    </>
  )
}
