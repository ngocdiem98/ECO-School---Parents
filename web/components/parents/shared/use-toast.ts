'use client'

import { useCallback, useEffect, useState } from 'react'

// Tiny toast state: `show(message, success?)` sets it, it clears itself after
// 2.5s. Render <Toast message={toast} success={toastSuccess} /> while `toast`
// is non-null.
export function useToast() {
  const [state, setState] = useState<{ message: string; success: boolean } | null>(null)

  useEffect(() => {
    if (!state) return
    const t = setTimeout(() => setState(null), 2500)
    return () => clearTimeout(t)
  }, [state])

  const show = useCallback((message: string, success = false) => setState({ message, success }), [])
  return { toast: state?.message ?? null, toastSuccess: state?.success ?? false, show }
}
