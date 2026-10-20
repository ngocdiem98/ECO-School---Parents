'use client'

import { useState } from 'react'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import type { MedicineDose, Student } from '@/lib/mock-data'
import { NoteSheet } from './note-sheet'
import {
  DEFAULT_FIRST_TIME,
  MAX_DOSES,
  MAX_PHOTOS,
  ORDER_NOTE_MAX,
  ORDER_NOTE_MIN,
  TIME_OPTIONS,
  fmtDate,
  plusFourHours,
  todayIso,
} from './utils'

export interface MedicineSubmit {
  from: string
  to: string
  doses: MedicineDose[]
  note: string
  photos: string[]
}

// "Tạo đơn dặn thuốc" (UC-01). The form lives here (the parent mounts a fresh
// copy per visit), validation errors surface once the field was touched or
// "Gửi" was pressed. Photos are real files shown through object URLs.
export function MedicineCreateScreen({
  student,
  onBack,
  onChangeStudent,
  onSubmit,
  onWarn,
}: {
  student: Student
  onBack: () => void
  onChangeStudent: () => void
  onSubmit: (order: MedicineSubmit) => void
  onWarn: (message: string) => void
}) {
  const today = todayIso()
  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(today)
  const [doses, setDoses] = useState<MedicineDose[]>([{ time: DEFAULT_FIRST_TIME, note: '' }])
  const [note, setNote] = useState('')
  const [noteTouched, setNoteTouched] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [attempted, setAttempted] = useState(false)
  const [editingDose, setEditingDose] = useState<number | null>(null)

  const dateError = !from || !to || from > to ? 'Ngày không hợp lệ' : ''
  const doseErrors = doses.map((d, i) =>
    i > 0 && d.time <= doses[i - 1].time ? 'Giờ uống thuốc phải sau giờ trước đó' : '',
  )
  const noteLen = note.trim().length
  const noteError =
    noteLen === 0 ? 'Vui lòng nhập nội dung ghi chú' : noteLen < ORDER_NOTE_MIN ? `Nội dung tối thiểu ${ORDER_NOTE_MIN} ký tự` : ''
  const showNoteError = (noteTouched || attempted) && !!noteError
  const valid = !dateError && doseErrors.every((e) => !e) && !noteError

  const updateDose = (i: number, patch: Partial<MedicineDose>) =>
    setDoses((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)))
  const addDose = () => setDoses((prev) => [...prev, { time: plusFourHours(prev[prev.length - 1].time), note: '' }])
  const removeDose = (i: number) => setDoses((prev) => prev.filter((_, idx) => idx !== i))

  const addPhotos = (files: FileList | null) => {
    if (!files?.length) return
    const room = MAX_PHOTOS - photos.length
    const picked = Array.from(files).slice(0, Math.max(room, 0))
    if (files.length > room) onWarn(`Chỉ được đính kèm tối đa ${MAX_PHOTOS} ảnh`)
    setPhotos((prev) => [...prev, ...picked.map((f) => URL.createObjectURL(f))])
  }

  const submit = () => {
    setAttempted(true)
    if (!valid) return
    onSubmit({ from, to, doses, note: note.trim(), photos })
  }

  return (
    <div className="screen">
      <TopBar title="Tạo đơn dặn thuốc" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={onChangeStudent} />
      <div className="field">
        <label>Hôm nay, ngày {fmtDate(today)}</label>
      </div>

      <div className="field-row" style={{ margin: '0 16px' }}>
        <div className="field" style={{ margin: 0 }}>
          <label>Từ ngày</label>
          <input type="date" className="input-box" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Đến ngày</label>
          <input type="date" className="input-box" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>
      {dateError && <div className="med-error" style={{ margin: '6px 16px 0' }}>{dateError}</div>}

      <div className="section-heading section-heading-row">
        <span>Giờ uống thuốc</span>
        <span className="text-muted" style={{ fontSize: 12 }}>
          {doses.length}/{MAX_DOSES}
        </span>
      </div>
      {doses.map((d, i) => (
        <div key={i} style={{ margin: '0 16px 10px' }}>
          <div className="med-dose-row">
            <select
              className="input-box med-time"
              value={d.time}
              onChange={(e) => updateDose(i, { time: e.target.value })}
              aria-label={`Giờ uống thuốc ${i + 1}`}
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button className="med-note-btn" onClick={() => setEditingDose(i)}>
              {d.note || '+ Ghi chú'}
            </button>
            {doses.length > 1 && (
              <button className="icon-btn" onClick={() => removeDose(i)} aria-label="Xóa giờ uống thuốc">
                🗑
              </button>
            )}
          </div>
          {doseErrors[i] && <div className="med-error">{doseErrors[i]}</div>}
        </div>
      ))}
      {doses.length < MAX_DOSES && (
        <button className="btn-link" style={{ margin: '0 16px 6px' }} onClick={addDose}>
          + Thêm giờ
        </button>
      )}

      <div className="field">
        <label>Ghi chú</label>
        <textarea
          maxLength={ORDER_NOTE_MAX}
          placeholder="Nội dung hướng dẫn uống thuốc *"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => setNoteTouched(true)}
        />
        <div className="med-field-foot">
          <span className="med-error">{showNoteError ? noteError : ''}</span>
          <span className="char-count" style={{ margin: 0 }}>
            <span>{note.length}</span>/{ORDER_NOTE_MAX}
          </span>
        </div>
      </div>

      <div className="field">
        <label>
          Ảnh đính kèm — tối đa {MAX_PHOTOS} ảnh ({photos.length}/{MAX_PHOTOS} ảnh)
        </label>
        <div className="med-photo-row">
          {photos.map((src, i) => (
            <div className="med-photo" key={src}>
              <img src={src} alt={`Ảnh ${i + 1}`} />
              <span className="rm" onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}>
                ✕
              </span>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="upload-box" style={{ cursor: 'pointer' }}>
              <span>▤</span>
              <span>Thư viện</span>
              <input
                type="file"
                className="hidden-input"
                accept="image/*"
                multiple
                onChange={(e) => {
                  addPhotos(e.target.files)
                  e.target.value = ''
                }}
              />
            </label>
          )}
        </div>
      </div>

      <div className="cta-bar sticky">
        <button className="btn btn-primary" onClick={submit}>
          Gửi
        </button>
      </div>

      {editingDose !== null && (
        <NoteSheet
          initial={doses[editingDose].note}
          onSave={(n) => {
            updateDose(editingDose, { note: n })
            setEditingDose(null)
          }}
          onClose={() => setEditingDose(null)}
        />
      )}
    </div>
  )
}
