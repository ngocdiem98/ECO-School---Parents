'use client'

import { useRef, useState } from 'react'
import { Info } from 'lucide-react'
import { StudentHeader } from '@/components/parents/shared/header'
import { QuickReplies, type QuickReply } from '@/components/parents/shared/quick-replies'
import type { Student } from '@/lib/mock-data'

const MIN_NOTE = 10

// Lý do nghỉ soạn sẵn (PRD BR-01), same wording for Mầm non and K12.
const ABSENCE_REASONS: QuickReply[] = [
  { label: 'Con bị ốm', text: 'Con bị ốm, gia đình xin phép cho con nghỉ học để ở nhà theo dõi sức khỏe ạ.' },
  { label: 'Đi khám bệnh', text: 'Gia đình đưa con đi khám bệnh, xin phép cho con nghỉ học ạ.' },
  { label: 'Việc gia đình', text: 'Gia đình có việc riêng, xin phép cho con nghỉ học ạ.' },
]

export interface AbsenceFormState {
  period: 'full' | 'morning' | 'afternoon'
  from: string
  to: string
  note: string
  photos: number
}

export const DEFAULT_ABSENCE_FORM: AbsenceFormState = {
  period: 'full',
  from: '2026-07-10',
  to: '2026-07-10',
  note: '',
  photos: 0,
}

// Mirrors SCREENS['absence-create']. File upload is simulated: there's no
// real file preview in the vanilla screen either, just a running count.
export function AbsenceCreateScreen({
  student,
  form,
  onFieldChange,
  onAddPhotos,
  onBack,
  onChangeStudent,
  onSubmit,
}: {
  student: Student
  form: AbsenceFormState
  onFieldChange: <K extends keyof AbsenceFormState>(field: K, value: AbsenceFormState[K]) => void
  onAddPhotos: (count: number) => void
  onBack: () => void
  onChangeStudent?: () => void
  onSubmit: () => void
}) {
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [flash, setFlash] = useState(0)
  // Chips only while Nội dung has no text (spaces count as empty), so they never overwrite.
  const hasText = !!form.note.trim()
  // Morning / afternoon only for schools with two sessions.
  const hasSessions = student.attendance.sessions === 'two'

  const pickReason = (reason: QuickReply) => {
    onFieldChange('note', reason.text)
    setPicked(reason.label)
    setFlash((n) => n + 1)
    setTimeout(() => {
      const el = noteRef.current
      el?.focus()
      el?.setSelectionRange(reason.text.length, reason.text.length)
    })
    setTimeout(() => setFlash(0), 900)
  }

  return (
    <div className="screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
          ‹
        </button>
        <div className="topbar-title">Tạo đơn báo vắng</div>
        <span className="icon-btn-ghost" />
      </div>
      <StudentHeader student={student} onChangeStudent={onChangeStudent} />
      <div className="field">
        <label>Hôm nay, ngày 10/07/2026</label>
      </div>
      <div className="section-heading">Thời gian xin nghỉ</div>
      {hasSessions && (
      <div className="segmented" style={{ marginTop: 0 }}>
        <button
          className={form.period === 'full' ? 'active' : ''}
          onClick={() => onFieldChange('period', 'full')}
        >
          Cả ngày
        </button>
        <button
          className={form.period === 'morning' ? 'active' : ''}
          onClick={() => onFieldChange('period', 'morning')}
        >
          Buổi sáng
        </button>
        <button
          className={form.period === 'afternoon' ? 'active' : ''}
          onClick={() => onFieldChange('period', 'afternoon')}
        >
          Buổi chiều
        </button>
      </div>
      )}
      <div className="field-row" style={{ margin: '14px 16px' }}>
        <div className="field" style={{ margin: 0 }}>
          <label>Từ ngày</label>
          <input
            type="date"
            className="input-box"
            value={form.from}
            onChange={(e) => onFieldChange('from', e.target.value)}
          />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Đến ngày</label>
          <input
            type="date"
            className="input-box"
            value={form.to}
            onChange={(e) => onFieldChange('to', e.target.value)}
          />
        </div>
      </div>
      <div className="section-heading">Lý do xin nghỉ</div>
      <div className="field">
        {!hasText && (
          <>
            <div className="qr-label">Chọn nhanh lý do</div>
            <QuickReplies wrap items={ABSENCE_REASONS} onPick={pickReason} />
          </>
        )}
        <textarea
          ref={noteRef}
          className={flash ? 'is-flash' : ''}
          maxLength={256}
          placeholder="Nội dung *"
          value={form.note}
          onChange={(e) => onFieldChange('note', e.target.value)}
        />
        <div className="char-count">
          <span>{form.note.length}</span>/256
        </div>
        {hasText && (
          <div className="draft-notice">
            <Info size={16} />
            <span>Đơn nháp sẽ được lưu trong vòng 24 giờ.</span>
          </div>
        )}
        <span className="sr-only" role="status">
          {picked ? `Đã điền lý do: ${picked}` : ''}
        </span>
      </div>
      <div className="field">
        <label>
          Ảnh đính kèm — tối đa 10 ảnh ({form.photos}/10 ảnh)
        </label>
        <label className="upload-box" style={{ cursor: 'pointer' }}>
          <span>▤</span>
          <span>Thư viện</span>
          <input
            type="file"
            className="hidden-input"
            accept="image/*"
            multiple
            onChange={(e) => onAddPhotos(e.target.files?.length ?? 0)}
          />
        </label>
      </div>
      <div className="cta-bar sticky">
        <button className="btn btn-primary" disabled={form.note.trim().length < MIN_NOTE} onClick={onSubmit}>
          Nộp đơn
        </button>
      </div>
    </div>
  )
}
