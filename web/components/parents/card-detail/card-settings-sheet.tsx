'use client'

import { ChevronRight, Lock, RefreshCcw, Gauge, WalletCards } from 'lucide-react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

// "Cài đặt thẻ": only the card's own settings (Khóa thẻ khẩn cấp, Nạp tiền tự
// động, Cấu hình hạn mức, Cấp lại thẻ). Quản lý liên kết and Hủy liên kết moved
// to Hồ sơ học sinh; the three sub-screens are out of scope (toast).
export function CardSettingsSheet({
  locked,
  onToggleLock,
  onAction,
  onClose,
}: {
  locked: boolean
  onToggleLock: () => void
  onAction: (action: 'auto_topup' | 'limit' | 'reissue') => void
  onClose: () => void
}) {
  const rows: { key: 'auto_topup' | 'limit' | 'reissue'; label: string; icon: typeof Lock }[] = [
    { key: 'auto_topup', label: 'Nạp tiền tự động', icon: WalletCards },
    { key: 'limit', label: 'Cấu hình hạn mức', icon: Gauge },
    { key: 'reissue', label: 'Cấp lại thẻ', icon: RefreshCcw },
  ]
  return (
    <OverlayPortal>
      <div className="eco-sheet-root" style={{ zIndex: 100 }}>
        <div className="eco-sheet-scrim" onClick={onClose} />
        <div className="eco-sheet" style={{ height: 'auto', maxHeight: '82%' }} role="dialog" aria-label="Cài đặt thẻ">
          <span className="eco-sheet__grabber" />
          <div className="eco-sheet__head">
            <h3>Cài đặt thẻ</h3>
            <button type="button" className="eco-iconbtn eco-iconbtn--md eco-iconbtn--ghost" onClick={onClose} aria-label="Đóng">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="eco-sheet__body eco-vscroll cs-body">
            <div className="cs-row" role="button" tabIndex={0} onClick={onToggleLock}>
              <Lock size={22} strokeWidth={1.8} />
              <span className="cs-label">Khóa thẻ khẩn cấp</span>
              <span onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={locked}
                  className={`eco-switch ${locked ? 'active' : ''}`}
                  onClick={onToggleLock}
                  aria-label="Khóa thẻ khẩn cấp"
                >
                  <span className="eco-switch-thumb" />
                </button>
              </span>
            </div>
            {rows.map(({ key, label, icon: Icon }) => (
              <button key={key} className="cs-row" onClick={() => onAction(key)}>
                <Icon size={22} strokeWidth={1.8} />
                <span className="cs-label">{label}</span>
                <ChevronRight size={20} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
