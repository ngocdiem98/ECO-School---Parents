'use client'

import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

// Mirrors the DIALOGS pattern (centered modal, .dialog-wrap/.dialog-card) in
// ../../../scripts/app.js — used for "Xin phép vắng thành công" and "Nộp
// bài thành công". Unlike StudentPickerSheet, the vanilla dialog has no
// scrim-click-to-close or ✕ button — it only dismisses via its own CTA.
export function Dialog({
  title,
  subtitle,
  ctaLabel,
  onConfirm,
}: {
  title: string
  subtitle: string
  ctaLabel: string
  onConfirm: () => void
}) {
  return (
    <OverlayPortal>
      <div className="scrim" />
      <div className="dialog-wrap">
        <div className="dialog-card">
          <div className="d-title">{title}</div>
          <div className="d-sub">{subtitle}</div>
          <button className="btn btn-primary" onClick={onConfirm}>
            {ctaLabel}
          </button>
        </div>
      </div>
    </OverlayPortal>
  )
}
