'use client'

import { useState } from 'react'
import { MOCK_STUDENTS, getStudent } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { eligibleStudents } from '@/components/parents/shared/use-service-launcher'
import { Toast } from '@/components/parents/shared/toast'
import { useToast } from '@/components/parents/shared/use-toast'
import { FEEDBACKS, feedbackFor, type FeedbackFile } from '@/lib/school-data'
import { nowIso, senderLabel } from './utils'
import { FeedbackListScreen } from './feedback-list-screen'
import { FeedbackCreateScreen } from './feedback-create-screen'
import { FeedbackDetailScreen } from './feedback-detail-screen'

interface FeedbackAppProps {
  studentId: string
  onBack: () => void
}

type Screen = 'list' | 'create' | 'detail'

// [PH-20] Góp ý: list (search + status tabs), create (title, content, type,
// up to 10 attachments), detail with the reply thread and "Mở lại góp ý" (only
// within 7 days of the school closing it). Feedback cannot be edited once
// sent. Data is scoped to the selected student (BR-04).
export function FeedbackApp({ studentId, onBack }: FeedbackAppProps) {
  const [selectedId, setSelectedId] = useState(studentId)
  const [screen, setScreen] = useState<Screen>('list')
  const [feedbackId, setFeedbackId] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const switchable = eligibleStudents('feedback')
  const canSwitch = switchable.length > 1
  const [, setVersion] = useState(0)
  const { toast, toastSuccess, show } = useToast()

  const student = getStudent(selectedId)
  if (!student) return null
  const feedback = feedbackId ? FEEDBACKS.find((f) => f.id === feedbackId) : undefined

  const submit = (data: { title: string; content: string; type: string; files: FeedbackFile[] }) => {
    FEEDBACKS.unshift({
      id: 'fb' + Date.now(),
      studentId: student.id,
      ...data,
      status: 'new',
      createdAt: nowIso(),
      sender: senderLabel(student.name),
      unread: false,
      replies: [],
    })
    setVersion((v) => v + 1)
    setScreen('list')
    show('Đã gửi góp ý thành công', true)
  }

  return (
    <>
      {screen === 'list' && (
        <FeedbackListScreen
          student={student}
          items={feedbackFor(student.id)}
          onBack={onBack}
          onChangeStudent={canSwitch ? () => setShowPicker(true) : undefined}
          onCreate={() => setScreen('create')}
          onOpen={(id) => {
            setFeedbackId(id)
            setScreen('detail')
          }}
        />
      )}
      {screen === 'create' && (
        <FeedbackCreateScreen student={student} onBack={() => setScreen('list')} onSubmit={submit} onWarn={show} />
      )}
      {screen === 'detail' && feedback && (
        <FeedbackDetailScreen
          feedback={feedback}
          onBack={() => setScreen('list')}
          onChanged={() => setVersion((v) => v + 1)}
          onToast={show}
        />
      )}

      {showPicker && (
        <StudentPickerSheet
          students={switchable}
          selectedStudentId={selectedId}
          onSelect={(s) => {
            setSelectedId(s.id)
            setScreen('list')
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
      {toast && <Toast message={toast} success={toastSuccess} />}
    </>
  )
}
