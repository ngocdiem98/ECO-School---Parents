import { readDraft, removeDraft, writeDraft } from '@/components/parents/shared/draft-store'
import { DEFAULT_ABSENCE_FORM, type AbsenceFormState } from './absence-create-screen'

// Bản nháp đơn báo vắng (EDU-2095): one per student, kept on this device for 24
// hours (see draft-store). Photos are never part of the draft. Removed on submit
// and when the parent chooses "Tạo đơn mới".
const key = (studentId: string) => `eco-absence-draft:${studentId}`

type SavedFields = Omit<AbsenceFormState, 'photos'>

function isPristine(f: AbsenceFormState) {
  return (
    !f.note.trim() &&
    f.period === DEFAULT_ABSENCE_FORM.period &&
    f.from === DEFAULT_ABSENCE_FORM.from &&
    f.to === DEFAULT_ABSENCE_FORM.to
  )
}

export function loadDraft(studentId: string): AbsenceFormState | null {
  const saved = readDraft<SavedFields>(key(studentId))
  return saved ? { ...DEFAULT_ABSENCE_FORM, ...saved } : null
}

export function clearDraft(studentId: string) {
  removeDraft(key(studentId))
}

/** Saves the form, or removes the draft when nothing has been filled in. */
export function saveDraft(studentId: string, form: AbsenceFormState) {
  if (isPristine(form)) return clearDraft(studentId)
  const { period, from, to, note } = form
  writeDraft<SavedFields>(key(studentId), { period, from, to, note })
}

const fmt = (iso: string) => iso.split('-').reverse().join('/')

/** Lines shown in the draft popup: ngày nghỉ and the start of the content. */
export function draftSummary(f: AbsenceFormState) {
  const period = f.period === 'full' ? 'Cả ngày' : f.period === 'morning' ? 'Buổi sáng' : 'Buổi chiều'
  const note = f.note.trim()
  return [
    `Ngày nghỉ: ${fmt(f.from)} - ${fmt(f.to)} (${period})`,
    `Nội dung: ${note ? (note.length > 40 ? note.slice(0, 40) + '…' : note) : 'Chưa nhập'}`,
  ]
}
