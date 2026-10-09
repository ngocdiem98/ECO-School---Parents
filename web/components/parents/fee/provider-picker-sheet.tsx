'use client'

import { PROVIDERS, type Provider } from '@/lib/mock-data'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

// Mirrors SHEETS['fee-provider'] in ../../../scripts/app.js.
export function ProviderPickerSheet({
  onSelect,
  onClose,
}: {
  onSelect: (provider: Provider) => void
  onClose: () => void
}) {
  return (
    <OverlayPortal>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-head">
          <span className="t">Chọn nhà cung cấp</span>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        <div className="sheet-body">
          <div className="search-box">⌕ Tìm kiếm nhà cung cấp</div>
          {PROVIDERS.map((p) => (
            <div className="provider-row" key={p.id} onClick={() => onSelect(p)}>
              <div className="provider-logo">{p.logo}</div>
              <div className="name">{p.name}</div>
            </div>
          ))}
        </div>
      </div>
    </OverlayPortal>
  )
}
