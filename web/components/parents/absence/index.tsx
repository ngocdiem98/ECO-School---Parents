'use client'

import { useEffect, useState } from 'react'
import { MOCK_STUDENTS, getStudent, type AbsenceRequest, type AbsenceStatus } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { eligibleStudents } from '@/components/parents/shared/use-service-launcher'
import { DraftPromptDialog } from '@/components/parents/shared/draft-dialogs'
import { Dialog } from '@/components/parents/shared/dialog'
import { AbsenceListScreen } from './absence-list-screen'
import { AbsenceDetailScreen } from './absence-detail-screen'
import { CoachMarks, type CoachStep } from '@/components/parents/shared/coach-marks'
import { useFirstRun } from '@/components/parents/shared/first-run'
import { clearDraft, draftSummary, loadDraft, saveDraft } from './draft'
import { AbsenceCreateScreen, DEFAULT_ABSENCE_FORM, type AbsenceFormState } from './absence-create-screen'

interface AbsenceAppProps {
  studentId: string
  /** Open straight on the create form (shortcut from Theo dõi điểm danh). */
  startOnCreate?: boolean
  onBack: () => void
}

type AbsenceScreen = 'list' | 'create' | 'detail'

// Chỉ dẫn lần đầu (EDU-2106 phần B).
const COACH: CoachStep[] = [
  { target: 'absence-create', text: 'Bấm vào đây để báo con nghỉ học, chọn ngày và lý do nghỉ.' },
  { target: 'absence-status', text: 'Theo dõi đơn đã gửi tại đây: Chờ duyệt, Đã duyệt.' },
]

// Mirrors App.confirmAbsence() in ../../../scripts/app.js: mutates the
// module-level MOCK_STUDENTS array in place (same "no real store" pattern
// eduteachers uses for its own PHIEU_BE_NGOAN_RECORDS — see its
// components/teachers/phieu-be-ngoan/index.tsx) and bumps a version counter
// to force React to re-read it.
export function AbsenceApp({ studentId, startOnCreate, onBack }: AbsenceAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [screen, setScreen] = useState<AbsenceScreen>(startOnCreate ? 'create' : 'list')
  const [selectedAbsence, setSelectedAbsence] = useState<AbsenceRequest | null>(null)
  const [filter, setFilter] = useState<'all' | AbsenceStatus>('all')
  const [form, setForm] = useState<AbsenceFormState>(DEFAULT_ABSENCE_FORM)
  const [showPicker, setShowPicker] = useState(false)
  const switchable = eligibleStudents('absence')
  const canSwitch = switchable.length > 1
  const [showSuccess, setShowSuccess] = useState(false)
  const [, setVersion] = useState(0)
  // Bản nháp (EDU-2095): the "Tiếp tục bản nháp?" popup shows the saved form.
  const [draftPrompt, setDraftPrompt] = useState<AbsenceFormState | null>(null)
  // Not shown when the feature is opened straight on the create form (shortcut).
  const coach = useFirstRun('coach-absence', screen === 'list' && !startOnCreate)

  useEffect(() => {
    if (startOnCreate) setDraftPrompt(loadDraft(selectedStudentId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const student = getStudent(selectedStudentId)
  if (!student) return null

  const handleFieldChange = <K extends keyof AbsenceFormState>(field: K, value: AbsenceFormState[K]) => {
    const next = { ...form, [field]: value }
    setForm(next)
    saveDraft(selectedStudentId, next)
  }

  const handleAddPhotos = (count: number) => {
    const next = { ...form, photos: Math.min(10, form.photos + count) }
    setForm(next)
    saveDraft(selectedStudentId, next)
  }

  const leaveCreate = () => (startOnCreate ? onBack() : setScreen('list'))

  const openCreate = () => {
    setForm(DEFAULT_ABSENCE_FORM)
    setDraftPrompt(loadDraft(selectedStudentId))
    setScreen('create')
  }

  const handleSubmit = () => {
    setShowSuccess(true)
  }

  const handleConfirmSuccess = () => {
    const fmt = (isoDate: string) => {
      const [y, m, d] = isoDate.split('-')
      return `${d}/${m}/${y}`
    }
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    student.absence.unshift({
      id: 'ab' + Date.now(),
      range: `${fmt(form.from)} - ${fmt(form.to)}`,
      status: 'pending',
      time: form.period === 'full' ? 'Cả ngày' : form.period === 'morning' ? 'Buổi sáng' : 'Buổi chiều',
      days: 1,
      note: form.note,
      createdAt: `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`,
      fromDate: fmt(form.from),
      toDate: fmt(form.to),
    })
    setVersion((v) => v + 1)
    clearDraft(selectedStudentId)
    setForm(DEFAULT_ABSENCE_FORM)
    setShowSuccess(false)
    setFilter('all')
    setScreen('list')
  }

  const handleCancelAbsence = (absenceId: string) => {
    const target = student.absence.find((a) => a.id === absenceId)
    if (target) {
      target.status = 'cancelled'
      setSelectedAbsence({ ...target })
    }
    setVersion((v) => v + 1)
  }

  return (
    <>
      {screen === 'detail' && selectedAbsence ? (
        <AbsenceDetailScreen
          student={student}
          absence={selectedAbsence}
          onBack={(returnFilter) => {
            if (returnFilter) setFilter(returnFilter)
            setScreen('list')
          }}
          onCancelAbsence={handleCancelAbsence}
        />
      ) : screen === 'list' ? (
        <AbsenceListScreen
          student={student}
          absences={student.absence}
          filter={filter}
          onFilterChange={setFilter}
          onSelectAbsence={(a) => {
            setSelectedAbsence(a)
            setScreen('detail')
          }}
          onBack={onBack}
          onChangeStudent={canSwitch ? () => setShowPicker(true) : undefined}
          onCreate={openCreate}
        />
      ) : (
        <AbsenceCreateScreen
          student={student}
          form={form}
          onFieldChange={handleFieldChange}
          onAddPhotos={handleAddPhotos}
          onBack={leaveCreate}
          onChangeStudent={canSwitch ? () => setShowPicker(true) : undefined}
          onSubmit={handleSubmit}
        />
      )}

      {showPicker && (
        <StudentPickerSheet
          students={switchable}
          selectedStudentId={selectedStudentId}
          onSelect={(s) => {
            setSelectedStudentId(s.id)
            setForm(DEFAULT_ABSENCE_FORM)
            setDraftPrompt(null)
            setScreen('list')
            setFilter('all')
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {coach.active && screen === 'list' && <CoachMarks steps={COACH} onDone={coach.finish} onSkip={coach.finish} />}

      {draftPrompt && (
        <DraftPromptDialog
          lines={draftSummary(draftPrompt)}
          onContinue={() => {
            setForm(draftPrompt)
            setDraftPrompt(null)
          }}
          onNew={() => {
            clearDraft(selectedStudentId)
            setForm(DEFAULT_ABSENCE_FORM)
            setDraftPrompt(null)
          }}
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
