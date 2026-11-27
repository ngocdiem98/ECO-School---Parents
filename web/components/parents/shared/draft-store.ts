// Drafts kept on this device only (localStorage) for 24 hours, counted from the
// moment the draft was first created: editing it does not restart the clock, even
// when it runs out while the form is open. An expired draft is deleted the next
// time it is read (that is, the next time it is offered or opened).
export const DRAFT_TTL_MS = 24 * 60 * 60 * 1000

interface Stored<T> {
  createdAt: number
  data: T
}

/** The stored entry, expired or not; null when missing or unreadable. */
function peek<T>(key: string): Stored<T> | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const s = JSON.parse(raw) as Stored<T>
    return typeof s?.createdAt === 'number' ? s : null
  } catch {
    return null
  }
}

export function readDraft<T>(key: string): T | null {
  const s = peek<T>(key)
  if (s && Date.now() - s.createdAt < DRAFT_TTL_MS) return s.data
  removeDraft(key)
  return null
}

export function writeDraft<T>(key: string, data: T) {
  const createdAt = peek<T>(key)?.createdAt ?? Date.now()
  try {
    localStorage.setItem(key, JSON.stringify({ createdAt, data }))
  } catch {
    /* ignore */
  }
}

export function removeDraft(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
