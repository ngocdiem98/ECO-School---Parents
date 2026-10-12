'use client'

import { Camera, Image as ImageIcon, Paperclip } from 'lucide-react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

// "Thêm tệp đính kèm" bottom sheet: 3 sources (library, camera, PDF) and a
// sub-line saying how many files can still be added.
export function AttachSheet({
  remaining,
  allowPdf = true,
  onFiles,
  onClose,
}: {
  remaining: number
  allowPdf?: boolean
  onFiles: (files: FileList) => void
  onClose: () => void
}) {
  const pick = (files: FileList | null) => {
    if (files?.length) onFiles(files)
    onClose()
  }
  return (
    <OverlayPortal>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-grab" />
        <div className="sheet-head" style={{ borderBottom: 'none', paddingBottom: 4, flexDirection: 'column', alignItems: 'flex-start' }}>
          <span className="t">Thêm tệp đính kèm</span>
          <small className="text-muted">Còn chọn được {remaining} tệp</small>
        </div>
        <div className="sheet-body" style={{ padding: 0 }}>
          <label className="action-row">
            <ImageIcon size={20} /> Chọn từ thư viện ảnh
            <input type="file" className="hidden-input" accept="image/*" multiple onChange={(e) => pick(e.target.files)} />
          </label>
          <label className="action-row">
            <Camera size={20} /> Chụp ảnh
            <input type="file" className="hidden-input" accept="image/*" capture="environment" onChange={(e) => pick(e.target.files)} />
          </label>
          {allowPdf && (
            <label className="action-row">
              <Paperclip size={20} /> Chọn tệp PDF
              <input type="file" className="hidden-input" accept="application/pdf" multiple onChange={(e) => pick(e.target.files)} />
            </label>
          )}
        </div>
      </div>
    </OverlayPortal>
  )
}
