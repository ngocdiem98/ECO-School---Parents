import { readDraft, removeDraft, writeDraft } from '@/components/parents/shared/draft-store'
import { DEFAULT_ABSENCE_FORM, type AbsenceFormState } from './absence-create-screen'

// Bản nháp đơn báo vắng (PRD "[PH] Báo vắng: Gợi ý nội dung và lưu nháp đơn"):
// one per student, kept on this device for 24 hours (see draft-store). Only a
// form whose Nội dung has text becomes a draft; photos are never part of it.
// Removed on submit, on "Tạo mới" and when the student leaves the account.
const key = (studentId: string) => `eco-absence-draft:${studentId}`

type SavedFields = Omit<AbsenceFormState, 'photos'>

export function loadDraft(studentId: string): AbsenceFormState | null {
  const saved = readDraft<SavedFields>(key(studentId))
  return saved?.note.trim() ? { ...DEFAULT_ABSENCE_FORM, ...saved } : null
}

export function clearDraft(studentId: string) {
  removeDraft(key(studentId))
}

/** Saves the form, or removes the draft when Nội dung is empty. */
export function saveDraft(studentId: string, form: AbsenceFormState) {
  if (!form.note.trim()) return clearDraft(studentId)
  const { period, from, to, note } = form
  writeDraft<SavedFields>(key(studentId), { period, from, to, note })
}

const fmt = (iso: string) => iso.split('-').reverse().join('/')

/** Rows of the draft popup: "26/11/2026", or "26/11 – 28/11/2026" for several days. */
export function draftSummary(f: AbsenceFormState) {
  return {
    date: f.from === f.to ? fmt(f.from) : `${fmt(f.from).slice(0, 5)} – ${fmt(f.to)}`,
    session: f.period === 'full' ? 'Cả ngày' : f.period === 'morning' ? 'Buổi sáng' : 'Buổi chiều',
    note: f.note.trim(),
  }
}
