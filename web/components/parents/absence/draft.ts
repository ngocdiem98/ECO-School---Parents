import { DEFAULT_ABSENCE_FORM, type AbsenceFormState } from './absence-create-screen'

// Bản nháp đơn báo vắng (EDU-2095): one per student, kept on this device only
// (localStorage). Removed on submit, on "Soạn mới", on logout and when the
// student leaves the account (the prototype has neither, so only the first two).
const key = (studentId: string) => `eco-absence-draft:${studentId}`

export function isPristine(f: AbsenceFormState) {
  return (
    !f.note.trim() &&
    f.photos === 0 &&
    f.period === DEFAULT_ABSENCE_FORM.period &&
    f.from === DEFAULT_ABSENCE_FORM.from &&
    f.to === DEFAULT_ABSENCE_FORM.to
  )
}

export function loadDraft(studentId: string): AbsenceFormState | null {
  try {
    const raw = localStorage.getItem(key(studentId))
    return raw ? { ...DEFAULT_ABSENCE_FORM, ...JSON.parse(raw) } : null
  } catch {
    return null
  }
}

export function clearDraft(studentId: string) {
  try {
    localStorage.removeItem(key(studentId))
  } catch {
    /* ignore */
  }
}

/** Saves the form, or removes the draft when nothing has been filled in. */
export function saveDraft(studentId: string, form: AbsenceFormState) {
  if (isPristine(form)) return clearDraft(studentId)
  try {
    localStorage.setItem(key(studentId), JSON.stringify(form))
  } catch {
    /* ignore */
  }
}

const fmt = (iso: string) => iso.split('-').reverse().join('/')

/** Lines shown in the "Tiếp tục bản nháp?" popup: ngày nghỉ, phần đầu nội dung, số ảnh. */
export function draftSummary(f: AbsenceFormState) {
  const period = f.period === 'full' ? 'Cả ngày' : f.period === 'morning' ? 'Buổi sáng' : 'Buổi chiều'
  const note = f.note.trim()
  return [
    `Ngày nghỉ: ${fmt(f.from)} - ${fmt(f.to)} (${period})`,
    `Nội dung: ${note ? (note.length > 40 ? note.slice(0, 40) + '…' : note) : 'Chưa nhập'}`,
    `Ảnh đính kèm: ${f.photos} ảnh`,
  ]
}
