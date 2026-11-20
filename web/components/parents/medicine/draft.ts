import type { MedicineDose } from '@/lib/mock-data'

// Bản nháp đơn dặn thuốc: one per student, on this device only. The fields go
// to localStorage; photos are blob URLs, so they live in memory for the visit.
export interface MedicineDraft {
  from: string
  to: string
  doses: MedicineDose[]
  note: string
  photos: string[]
}

const photoMem = new Map<string, string[]>()
const key = (studentId: string) => `eco-medicine-draft:${studentId}`

export function loadMedicineDraft(studentId: string): MedicineDraft | null {
  try {
    const raw = localStorage.getItem(key(studentId))
    if (!raw) return null
    return { ...JSON.parse(raw), photos: photoMem.get(studentId) ?? [] }
  } catch {
    return null
  }
}

export function saveMedicineDraft(studentId: string, d: MedicineDraft) {
  photoMem.set(studentId, d.photos)
  try {
    localStorage.setItem(key(studentId), JSON.stringify({ from: d.from, to: d.to, doses: d.doses, note: d.note }))
  } catch {
    /* ignore */
  }
}

export function clearMedicineDraft(studentId: string) {
  photoMem.delete(studentId)
  try {
    localStorage.removeItem(key(studentId))
  } catch {
    /* ignore */
  }
}

const fmt = (iso: string) => iso.split('-').reverse().join('/')

export function medicineDraftSummary(d: MedicineDraft) {
  const note = d.note.trim()
  return [
    `Ngày uống thuốc: ${fmt(d.from)} - ${fmt(d.to)}`,
    `Nội dung: ${note ? (note.length > 40 ? note.slice(0, 40) + '…' : note) : 'Chưa nhập'}`,
    `Ảnh đính kèm: ${d.photos.length} ảnh`,
  ]
}
