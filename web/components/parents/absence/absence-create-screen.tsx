'use client'

import { StudentHeader } from '@/components/parents/shared/header'
import type { Student } from '@/lib/mock-data'

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
  onChangeStudent: () => void
  onSubmit: () => void
}) {
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
      <div className="section-heading">Thời gian nghỉ</div>
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
      <div className="field">
        <label>Ghi chú</label>
        <textarea
          maxLength={256}
          placeholder="Nội dung *"
          value={form.note}
          onChange={(e) => onFieldChange('note', e.target.value)}
        />
        <div className="char-count">
          <span>{form.note.length}</span>/256
        </div>
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
        <button className="btn btn-primary" disabled={!form.note.trim()} onClick={onSubmit}>
          Nộp đơn
        </button>
      </div>
    </div>
  )
}
