'use client'

import { useCallback, useEffect, useState } from 'react'

// Tiny toast state: `show(message, success?)` sets it, it clears itself after
// `duration` (2.5s unless a PRD asks for another). Render <Toast message={toast} success={toastSuccess} /> while `toast`
// is non-null.
export function useToast(duration = 2500) {
  const [state, setState] = useState<{ message: string; success: boolean } | null>(null)

  useEffect(() => {
    if (!state) return
    const t = setTimeout(() => setState(null), duration)
    return () => clearTimeout(t)
  }, [state, duration])

  const show = useCallback((message: string, success = false) => setState({ message, success }), [])
  return { toast: state?.message ?? null, toastSuccess: state?.success ?? false, show }
}
