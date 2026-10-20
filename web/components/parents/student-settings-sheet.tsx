'use client'

import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

// "Cài đặt" sheet of the Học sinh screen (from the reference app): emergency
// card lock, Người đón trẻ, auto top-up, spending limit, card reissue, unlink.
// Rows are DS MenuItems (eco-menuitem); only the lock toggle and Người đón trẻ
// are real, the others show a toast in StudentScreen.
export function StudentSettingsSheet({
  isLocked,
  onToggleLock,
  onClose,
  onActionClick,
  onOpenPickup,
}: {
  isLocked: boolean
  onToggleLock: () => void
  onClose: () => void
  onActionClick: (action: string) => void
  onOpenPickup?: () => void
}) {
  return (
    <OverlayPortal>
      <div className="eco-sheet-root" style={{ zIndex: 100 }}>
        <div className="eco-sheet-scrim" onClick={onClose} />
        <div
          className="eco-sheet"
          style={{ height: 'auto', maxHeight: '82%' }}
          role="dialog"
          aria-label="Cài đặt"
        >
          <span className="eco-sheet__grabber" />
          <div className="eco-sheet__head">
            <h3>Cài đặt</h3>
            <button
              type="button"
              className="eco-iconbtn eco-iconbtn--md eco-iconbtn--ghost"
              onClick={onClose}
              aria-label="Đóng"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="eco-sheet__body eco-vscroll" style={{ padding: '4px 0 32px', gap: 0 }}>
            <div className="eco-menusection__list">
              {/* 1. Khóa thẻ khẩn cấp */}
              <div
                className="eco-menuitem"
                onClick={onToggleLock}
                role="button"
                tabIndex={0}
              >
                <span className="eco-menuitem__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <span className="eco-menuitem__label" style={{ font: 'var(--text-body-m)', fontWeight: 500 }}>
                  Khóa thẻ khẩn cấp
                </span>
                <span onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isLocked}
                    className={`eco-switch ${isLocked ? 'active' : ''}`}
                    onClick={onToggleLock}
                    aria-label="Khóa thẻ khẩn cấp"
                    style={isLocked ? { background: 'var(--eco-blue, #1570ef)' } : undefined}
                  >
                    <span className="eco-switch-thumb" />
                  </button>
                </span>
              </div>

              {/* 2. Người đưa đón */}
              <button
                type="button"
                className="eco-menuitem"
                onClick={() => {
                  onClose()
                  if (onOpenPickup) onOpenPickup()
                }}
              >
                <span className="eco-menuitem__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <span className="eco-menuitem__label" style={{ font: 'var(--text-body-m)', fontWeight: 500 }}>
                  Người đón trẻ
                </span>
                <span className="eco-menuitem__chevron">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </button>

              {/* 3. Nạp tiền tự động */}
              <button
                type="button"
                className="eco-menuitem"
                onClick={() => onActionClick('auto_topup')}
              >
                <span className="eco-menuitem__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                    <circle cx="16" cy="15" r="2.5" />
                  </svg>
                </span>
                <span className="eco-menuitem__label" style={{ font: 'var(--text-body-m)', fontWeight: 500 }}>
                  Nạp tiền tự động
                </span>
                <span className="eco-menuitem__chevron">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </button>

              {/* 4. Cấu hình hạn mức */}
              <button
                type="button"
                className="eco-menuitem"
                onClick={() => onActionClick('limit')}
              >
                <span className="eco-menuitem__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 0 0-7.07 17.07l1.41-1.41A8 8 0 1 1 12 20a7.96 7.96 0 0 1-4.24-1.22" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M12 12l3.5-3.5" />
                  </svg>
                </span>
                <span className="eco-menuitem__label" style={{ font: 'var(--text-body-m)', fontWeight: 500 }}>
                  Cấu hình hạn mức
                </span>
                <span className="eco-menuitem__chevron">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </button>

              {/* 5. Cấp lại thẻ */}
              <button
                type="button"
                className="eco-menuitem"
                onClick={() => onActionClick('reissue')}
              >
                <span className="eco-menuitem__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6" />
                    <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l.67-1.19" />
                  </svg>
                </span>
                <span className="eco-menuitem__label" style={{ font: 'var(--text-body-m)', fontWeight: 500 }}>
                  Cấp lại thẻ
                </span>
                <span className="eco-menuitem__chevron">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </button>

              {/* 6. Hủy liên kết */}
              <button
                type="button"
                className="eco-menuitem"
                onClick={() => onActionClick('unlink')}
              >
                <span className="eco-menuitem__icon" style={{ color: 'var(--color-danger, #c0263a)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </span>
                <span
                  className="eco-menuitem__label"
                  style={{ font: 'var(--text-body-m)', fontWeight: 500, color: 'var(--color-danger, #c0263a)' }}
                >
                  Hủy liên kết
                </span>
                <span className="eco-menuitem__chevron">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
