'use client'

import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

// Draft popup with a short summary: open the draft, or start a new one (which
// deletes it). With `onClose`, tapping outside dismisses it and keeps the draft.
export function DraftPromptDialog({
  title = 'Tiếp tục bản nháp?',
  continueLabel = 'Tiếp tục',
  newLabel = 'Soạn mới',
  lines,
  onContinue,
  onNew,
  onClose,
}: {
  title?: string
  continueLabel?: string
  newLabel?: string
  lines: string[]
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
          <div className="d-sub">
            {lines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
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
