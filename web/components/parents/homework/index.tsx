'use client'

import { useState } from 'react'
import { MOCK_STUDENTS, getStudent, type Homework, type HomeworkStatus } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { Dialog } from '@/components/parents/shared/dialog'
import { HomeworkListScreen } from './homework-list-screen'
import { HomeworkDetailScreen } from './homework-detail-screen'
import { HomeworkSubmitScreen } from './homework-submit-screen'

interface HomeworkAppProps {
  studentId: string
  onBack: () => void
}

type HwScreen = 'list' | 'detail' | 'submit'

// Mirrors App.confirmHomeworkSubmit() — mutates the module-level student's
// homework entry in place (same pattern as AbsenceApp / eduteachers'
// PHIEU_BE_NGOAN_RECORDS) and bumps a version counter to force a re-render.
export function HomeworkApp({ studentId, onBack }: HomeworkAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [screen, setScreen] = useState<HwScreen>('list')
  const [filter, setFilter] = useState<'all' | HomeworkStatus>('all')
  const [selectedHwId, setSelectedHwId] = useState<string | null>(null)
  const [files, setFiles] = useState<string[]>([])
  const [isEdit, setIsEdit] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [, setVersion] = useState(0)

  const student = getStudent(selectedStudentId)
  if (!student) return null

  const selectedHw: Homework | undefined = student.homework.find((h) => h.id === selectedHwId)

  const openDetail = (hw: Homework) => {
    setSelectedHwId(hw.id)
    setScreen('detail')
  }

  const openSubmit = (hw: Homework, edit: boolean) => {
    setSelectedHwId(hw.id)
    setIsEdit(edit)
    setFiles(hw.submissionFiles.slice())
    setScreen('submit')
  }

  const handleAddFiles = (fileList: FileList | null) => {
    if (!fileList) return
    setFiles((prev) => [...prev, ...Array.from(fileList).map((f) => f.name)])
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleConfirmSuccess = () => {
    if (selectedHw) {
      selectedHw.status = 'submitted'
      selectedHw.submissionFiles = files.slice()
    }
    setVersion((v) => v + 1)
    setShowSuccess(false)
    setScreen('detail')
  }

  return (
    <>
      {screen === 'list' && (
        <HomeworkListScreen
          student={student}
          homework={student.homework}
          filter={filter}
          onFilterChange={setFilter}
          onBack={onBack}
          onChangeStudent={() => setShowPicker(true)}
          onOpen={openDetail}
        />
      )}

      {screen === 'detail' && selectedHw && (
        <HomeworkDetailScreen
          homework={selectedHw}
          onBack={() => setScreen('list')}
          onSubmit={() =>
            openSubmit(selectedHw, selectedHw.status === 'submitted' || selectedHw.status === 'graded')
          }
        />
      )}

      {screen === 'submit' && selectedHw && (
        <HomeworkSubmitScreen
          files={files}
          isEdit={isEdit}
          onBack={() => setScreen('detail')}
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
          onSubmit={() => setShowSuccess(true)}
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
          title="Nộp bài thành công"
          subtitle="Học sinh nộp bài thành công"
          ctaLabel="Đã hiểu"
          onConfirm={handleConfirmSuccess}
        />
      )}
    </>
  )
}
