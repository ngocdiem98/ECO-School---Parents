'use client'

import { CircleCheck } from 'lucide-react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

// Transient feedback message ("Feedback Message" in the PRD). Rendered into
// #overlay-root so it stays glued to the screen; the owner clears it.
// `success` adds the green check used by the confirmation toasts.
export function Toast({ message, success }: { message: string; success?: boolean }) {
  return (
    <OverlayPortal>
      <div className={`toast ${success ? 'with-icon' : ''}`} role="status">
        {success && <CircleCheck size={20} color="#34C77B" />}
        <span>{message}</span>
      </div>
    </OverlayPortal>
  )
}
