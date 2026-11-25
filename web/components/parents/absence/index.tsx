'use client'

import { useState } from 'react'
import { MOCK_STUDENTS, getStudent, type AbsenceRequest, type AbsenceStatus } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { eligibleStudents } from '@/components/parents/shared/use-service-launcher'
import { DraftPromptDialog } from '@/components/parents/shared/draft-dialogs'
import { Dialog } from '@/components/parents/shared/dialog'
import { AbsenceListScreen } from './absence-list-screen'
import { AbsenceDetailScreen } from './absence-detail-screen'
import { clearDraft, draftSummary, loadDraft, saveDraft } from './draft'
import { AbsenceCreateScreen, DEFAULT_ABSENCE_FORM, type AbsenceFormState } from './absence-create-screen'

interface AbsenceAppProps {
  studentId: string
  /** Open straight on the create form (shortcut from Theo dõi điểm danh). */
  startOnCreate?: boolean
  onBack: () => void
}

type AbsenceScreen = 'list' | 'create' | 'detail'

// Mirrors App.confirmAbsence() in ../../../scripts/app.js: mutates the
// module-level MOCK_STUDENTS array in place (same "no real store" pattern
// eduteachers uses for its own PHIEU_BE_NGOAN_RECORDS — see its
// components/teachers/phieu-be-ngoan/index.tsx) and bumps a version counter
// to force React to re-read it.
export function AbsenceApp({ studentId, startOnCreate, onBack }: AbsenceAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  // Bản nháp (EDU-2095): asked on the list, before the create form opens. The
  // shortcut from Theo dõi điểm danh therefore stops on the list when a draft exists.
  const [draftPrompt, setDraftPrompt] = useState<AbsenceFormState | null>(() =>
    startOnCreate ? loadDraft(studentId) : null,
  )
  const [screen, setScreen] = useState<AbsenceScreen>(startOnCreate && !draftPrompt ? 'create' : 'list')
  // True while the form was reached through the shortcut: back returns to where it came from.
  const [fromShortcut, setFromShortcut] = useState(!!startOnCreate)
  const [selectedAbsence, setSelectedAbsence] = useState<AbsenceRequest | null>(null)
  const [filter, setFilter] = useState<'all' | AbsenceStatus>('all')
  const [form, setForm] = useState<AbsenceFormState>(DEFAULT_ABSENCE_FORM)
  const [showPicker, setShowPicker] = useState(false)
  const switchable = eligibleStudents('absence')
  const canSwitch = switchable.length > 1
  const [showSuccess, setShowSuccess] = useState(false)
  const [, setVersion] = useState(0)
  const student = getStudent(selectedStudentId)
  if (!student) return null

  const handleFieldChange = <K extends keyof AbsenceFormState>(field: K, value: AbsenceFormState[K]) => {
    const next = { ...form, [field]: value }
    setForm(next)
    saveDraft(selectedStudentId, next)
  }

  const handleAddPhotos = (count: number) => {
    setForm({ ...form, photos: Math.min(10, form.photos + count) }) // photos are not drafted
  }

  const leaveCreate = () => (fromShortcut ? onBack() : setScreen('list'))

  const startForm = (initial: AbsenceFormState) => {
    setForm(initial)
    setDraftPrompt(null)
    setScreen('create')
  }

  const openCreate = () => {
    setFromShortcut(false)
    const draft = loadDraft(selectedStudentId)
    if (draft) setDraftPrompt(draft)
    else startForm(DEFAULT_ABSENCE_FORM)
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

      {draftPrompt && (
        <DraftPromptDialog
          title="Bạn có đơn nháp"
          continueLabel="Mở đơn nháp"
          newLabel="Tạo đơn mới"
          lines={draftSummary(draftPrompt)}
          onContinue={() => startForm(draftPrompt)}
          onNew={() => {
            clearDraft(selectedStudentId)
            startForm(DEFAULT_ABSENCE_FORM)
          }}
          onClose={() => setDraftPrompt(null)}
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
