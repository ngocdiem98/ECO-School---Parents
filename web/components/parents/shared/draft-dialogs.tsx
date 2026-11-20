'use client'

import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

// "Tiếp tục bản nháp?" with a short summary; "Soạn mới" deletes the draft.
export function DraftPromptDialog({
  lines,
  onContinue,
  onNew,
}: {
  lines: string[]
  onContinue: () => void
  onNew: () => void
}) {
  return (
    <OverlayPortal>
      <div className="scrim" />
      <div className="dialog-wrap">
        <div className="dialog-card">
          <div className="d-title">Tiếp tục bản nháp?</div>
          <div className="d-sub">
            {lines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
          <div className="btn-row">
            <button className="btn btn-outline" onClick={onNew}>
              Soạn mới
            </button>
            <button className="btn btn-primary" onClick={onContinue}>
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
