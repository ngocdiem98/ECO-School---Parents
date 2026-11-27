'use client'

import type { ReactNode } from 'react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

// Draft popup with a short summary (plain `lines`, or a custom `children` block):
// open the draft, or start a new one (which deletes it). With `onClose`, tapping
// outside dismisses it and keeps the draft.
export function DraftPromptDialog({
  title = 'Tiếp tục bản nháp?',
  message,
  continueLabel = 'Tiếp tục',
  newLabel = 'Soạn mới',
  lines = [],
  children,
  onContinue,
  onNew,
  onClose,
}: {
  title?: string
  message?: string
  continueLabel?: string
  newLabel?: string
  lines?: string[]
  children?: ReactNode
  onContinue: () => void
  onNew: () => void
  onClose?: () => void
}) {
  return (
    <OverlayPortal>
      <div className="scrim" />
      <div className="dialog-wrap" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div className="dialog-card">
          <div className="d-title">{title}</div>
          {message && <div className="d-sub">{message}</div>}
          {lines.length > 0 && (
            <div className="d-sub">
              {lines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          )}
          {children}
          <div className="btn-row">
            <button className="btn btn-outline" onClick={onNew}>
              {newLabel}
            </button>
            <button className="btn btn-primary" onClick={onContinue}>
              {continueLabel}
            </button>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
