'use client'

import { useState } from 'react'
import { MOCK_STUDENTS, getStudent, type Homework, type HomeworkStatus } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { HomeworkListScreen } from './homework-list-screen'
import { HomeworkDetailScreen } from './homework-detail-screen'
import { HomeworkSubmitScreen } from './homework-submit-screen'
import { HomeworkActionSheet } from './homework-action-sheet'
import { HomeworkSuccessDialog } from './homework-success-dialog'

interface HomeworkAppProps {
  studentId?: string
  onBack: () => void
}

type HwScreen = 'list' | 'detail' | 'submit'

export function HomeworkApp({ studentId = 'han', onBack }: HomeworkAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [screen, setScreen] = useState<HwScreen>('list')
  const [filter, setFilter] = useState<'all' | HomeworkStatus>('all')
  const [selectedHwId, setSelectedHwId] = useState<string | null>(null)
  const [files, setFiles] = useState<string[]>([])
  const [isEdit, setIsEdit] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [, setVersion] = useState(0)

  const student = getStudent(selectedStudentId) || MOCK_STUDENTS[0]
  const selectedHw: Homework | undefined = student.homework.find((h) => h.id === selectedHwId)

  const openDetail = (hw: Homework) => {
    setSelectedHwId(hw.id)
    setScreen('detail')
  }

  const handleOpenActionSheet = () => {
    if (!selectedHw) return
    const edit = selectedHw.status === 'submitted' || selectedHw.status === 'graded'
    setIsEdit(edit)
    if (edit) {
      if (selectedHw.submissionFiles && selectedHw.submissionFiles.length > 0) {
        setFiles(selectedHw.submissionFiles.slice())
      } else {
        setFiles(['/homework/sample-sub.png'])
      }
      setScreen('submit')
    } else {
      setFiles(['/homework/sample-sub.png'])
      setShowActionSheet(true)
    }
  }

  const handleSelectSource = (source: 'library' | 'camera' | 'document') => {
    setShowActionSheet(false)
    if (files.length === 0) {
      setFiles(['/homework/sample-sub.png'])
    }
    setScreen('submit')
  }

  const handleAddFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const newFiles: string[] = []
    Array.from(fileList).forEach((file) => {
      newFiles.push(URL.createObjectURL(file))
    })
    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleConfirmSuccess = () => {
    if (selectedHw) {
      selectedHw.status = 'submitted'
      selectedHw.submissionFiles = files.slice()
      selectedHw.submittedAt = '14:41 18/10/2026'
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
          onSubmitClick={handleOpenActionSheet}
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

      {/* Upload Source Bottom Sheet */}
      <HomeworkActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        onSelect={handleSelectSource}
      />

      {/* Student Switcher Sheet */}
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

      {/* Success Modal Dialog */}
      <HomeworkSuccessDialog
        isOpen={showSuccess}
        title={isEdit ? 'Cập nhật thành công' : 'Nộp bài thành công'}
        subtitle="Học sinh nộp bài thành công"
        ctaLabel="Đã hiểu"
        onConfirm={handleConfirmSuccess}
      />
    </>
  )
}
