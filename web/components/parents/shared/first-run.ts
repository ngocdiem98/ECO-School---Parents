'use client'

import { useCallback, useEffect, useState } from 'react'

// "Đã xem" flags for the first-run guides (EDU-2106). Stored on the device
// only (localStorage), one flag per guide; a failed read counts as "seen" so a
// blocked storage never traps the user in a guide. Open the prototype with
// `?firstrun=1` to clear every flag and see the guides again (stands in for
// "đăng xuất hoặc cài lại app").
const PREFIX = 'eco-firstrun:'
const memory = new Set<string>()
let resetChecked = false

// Runs before the first read: the ECO Me home guide mounts together with the page,
// so clearing the flags from a page-level effect would come too late.
function applyResetParam() {
  if (resetChecked) return
  resetChecked = true
  if (new URLSearchParams(window.location.search).get('firstrun') === '1') resetAllSeen()
}

export function isSeen(key: string): boolean {
  if (typeof window === 'undefined') return true
  applyResetParam()
  if (memory.has(key)) return true
  try {
    return localStorage.getItem(PREFIX + key) === '1'
  } catch {
    return false
  }
}

export function markSeen(key: string) {
  memory.add(key)
  try {
    localStorage.setItem(PREFIX + key, '1')
  } catch {
    /* storage unavailable: the in-memory flag still lasts for this visit */
  }
}

function resetAllSeen() {
  memory.clear()
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}

/** `active` is true while the guide `key` should show; `finish` records it as seen. */
export function useFirstRun(key: string, enabled = true) {
  const [seen, setSeen] = useState(true)
  useEffect(() => {
    setSeen(isSeen(key))
  }, [key])
  const finish = useCallback(() => {
    markSeen(key)
    setSeen(true)
  }, [key])
  return { active: enabled && !seen, finish }
}
