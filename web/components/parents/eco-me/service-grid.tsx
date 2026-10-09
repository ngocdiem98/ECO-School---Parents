'use client'

import type { EcoService } from './services'

// 4-column icon grid shared by the ECO Me home and "Danh sách dịch vụ".
// A service is interactive when it opens something (an intent or ECO Phụ
// huynh); everything else is a disabled placeholder, like the other Home grid.
export function ServiceGrid({
  services,
  onPick,
  more,
}: {
  services: EcoService[]
  onPick: (service: EcoService) => void
  // Optional trailing "Xem thêm" tile.
  more?: () => void
}) {
  return (
    <div className="eco-grid">
      {services.map((s) => (
        <button key={s.id} className="icon-item" disabled={!s.intent && !s.ecoParent} onClick={() => onPick(s)}>
          <span className="icon-glyph">{s.icon}</span>
          <span className="icon-label">{s.label}</span>
        </button>
      ))}
      {more && (
        <button className="icon-item" onClick={more}>
          <span className="icon-glyph">⊞</span>
          <span className="icon-label">Xem thêm</span>
        </button>
      )}
    </div>
  )
}
