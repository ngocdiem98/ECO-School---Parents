// Drafts kept on this device only (localStorage) for 24 hours, counted from the
// moment the draft was first created: editing it does not restart the clock. An
// expired draft is deleted the next time it is read.
export const DRAFT_TTL_MS = 24 * 60 * 60 * 1000

interface Stored<T> {
  createdAt: number
  data: T
}

function readStored<T>(key: string): Stored<T> | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const s = JSON.parse(raw) as Stored<T>
    if (typeof s?.createdAt === 'number' && Date.now() - s.createdAt < DRAFT_TTL_MS) return s
  } catch {
    /* unreadable or written by an older version: drop it below */
  }
  removeDraft(key)
  return null
}

export function readDraft<T>(key: string): T | null {
  return readStored<T>(key)?.data ?? null
}

export function writeDraft<T>(key: string, data: T) {
  const createdAt = readStored<T>(key)?.createdAt ?? Date.now()
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
