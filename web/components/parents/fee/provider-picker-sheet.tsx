'use client'

import { useState } from 'react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import { FinvietLogo, TheSscLogo, VinaIdLogo } from './provider-logos'

export type ProviderType = 'eco' | 'ssc' | 'vinaid'

export interface ProviderItem {
  id: ProviderType
  name: string
  logoComp: React.ComponentType<{ size?: number }>
}

export const FEE_PROVIDERS: ProviderItem[] = [
  { id: 'eco', name: 'ECO School', logoComp: FinvietLogo },
  { id: 'ssc', name: 'TheSSC', logoComp: TheSscLogo },
  { id: 'vinaid', name: 'VinaID', logoComp: VinaIdLogo },
]

export function ProviderPickerSheet({
  onSelect,
  onClose,
}: {
  onSelect: (providerId: ProviderType) => void
  onClose: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProviders = FEE_PROVIDERS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  return (
    <OverlayPortal>
      <div className="eco-sheet-root" role="dialog" aria-modal="true" aria-label="Chọn nhà cung cấp">
        <div className="eco-sheet-scrim" onClick={onClose} />
        <div
          className="eco-sheet"
          style={{
            top: 48,
            bottom: 0,
            height: 'calc(100% - 48px)',
            maxHeight: 'calc(100% - 48px)',
          }}
        >
          <div className="eco-sheet__grabber" />
          <div className="eco-sheet__head">
            <h3>Chọn nhà cung cấp</h3>
            <button
              type="button"
              className="eco-iconbtn"
              onClick={onClose}
              aria-label="Đóng"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="eco-sheet__body eco-vscroll">
            {/* Search Field (ECO.SearchField) */}
            <div className="eco-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a93a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm nhà cung cấp"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    border: 0,
                    background: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Provider List (ECO.LogoListItem) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
              {filteredProviders.map((p) => {
                const LogoComponent = p.logoComp
                return (
                  <button
                    key={p.id}
                    type="button"
                    className="eco-logoitem"
                    onClick={() => onSelect(p.id)}
                  >
                    <div className="eco-logoitem__logo">
                      <LogoComponent size={36} />
                    </div>
                    <span style={{ font: 'var(--text-body-m)', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {p.name}
                    </span>
                  </button>
                )
              })}
              {filteredProviders.length === 0 && (
                <div className="eco-empty" style={{ padding: '24px 0' }}>
                  <p style={{ font: 'var(--text-body-s)', color: 'var(--text-secondary)' }}>
                    Không tìm thấy nhà cung cấp phù hợp
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
