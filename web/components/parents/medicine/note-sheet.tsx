'use client'

import { useState } from 'react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import { DOSE_NOTE_MAX, DOSE_NOTE_MIN } from './utils'

// Bottom sheet for the optional per-dose note: empty is fine, otherwise
// 2-255 characters, with the error shown while typing.
export function NoteSheet({
  initial,
  onSave,
  onClose,
}: {
  initial: string
  onSave: (note: string) => void
  onClose: () => void
}) {
  const [value, setValue] = useState(initial)
  const trimmed = value.trim()
  const tooShort = trimmed.length > 0 && trimmed.length < DOSE_NOTE_MIN

  return (
    <OverlayPortal>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-head">
          <span className="t">Ghi chú giờ uống thuốc</span>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        <div className="sheet-body">
          <div className="field" style={{ marginTop: 4 }}>
            <textarea
              autoFocus
              maxLength={DOSE_NOTE_MAX}
              placeholder="Ví dụ: uống sau khi ăn"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div className="med-field-foot">
              <span className="med-error">{tooShort ? `Ghi chú tối thiểu ${DOSE_NOTE_MIN} ký tự` : ''}</span>
              <span className="char-count" style={{ margin: 0 }}>
                {value.length}/{DOSE_NOTE_MAX}
              </span>
            </div>
          </div>
          <div className="cta-bar">
            <button className="btn btn-primary" disabled={tooShort} onClick={() => onSave(trimmed)}>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
