'use client'

import { LayoutGrid } from 'lucide-react'
import { ServiceIcon } from './service-icon'
import type { EcoService } from './services'

// 4-column icon grid shared by the ECO Me home and "Danh sách dịch vụ".
// A service is interactive when it opens something (an intent or ECO Phụ
// huynh); everything else is a muted placeholder.
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
      {services.map((s) => {
        const live = !!(s.intent || s.ecoParent)
        return (
          <button key={s.id} className="svc-item" disabled={!live} onClick={() => onPick(s)}>
            <ServiceIcon name={s.icon} tint={s.tint} disabled={!live} />
            <span className="svc-label">{s.label}</span>
          </button>
        )
      })}
      {more && (
        <button className="svc-item" onClick={more}>
          <span className="svc-icon" style={{ background: 'linear-gradient(145deg, #5A6486, #3B4466)' }}>
            <LayoutGrid size={22} strokeWidth={2} color="#fff" />
          </span>
          <span className="svc-label">Xem thêm</span>
        </button>
      )}
    </div>
  )
}
