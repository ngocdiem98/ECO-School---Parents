'use client'

import { useState } from 'react'
import {
  MOCK_NOTIFICATIONS,
  unreadNotificationCount,
  type AppNotification,
  type NotificationCategory,
  type NotificationTarget,
} from '@/lib/mock-data'

interface NotificationsAppProps {
  onBack: () => void
  onOpenTarget: (target: NotificationTarget) => void
}

type Filter = 'all' | NotificationCategory

const TABS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'transaction', label: 'Giao dịch' },
  { value: 'school', label: 'ECO School' },
]

const fmtDay = (at: string) => {
  const [y, m, d] = at.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}
const fmtStamp = (at: string) => `${at.slice(11, 16)} | ${fmtDay(at)}`

function WalletIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H17a1 1 0 0 1 1 1v1.5" />
      <rect x="3" y="7.5" width="18" height="12" rx="2.5" />
      <path d="M21 12.5h-4a1.5 1.5 0 0 0 0 3h4" />
    </svg>
  )
}

// "Thông báo": opened from the bell on the ECO Me home. Tabs filter by
// category, items are grouped by day (newest first), "Đọc tất cả (n)" marks
// everything read, and tapping an item marks it read and — when it has a
// target — opens that feature. Mutates MOCK_NOTIFICATIONS in place and bumps a
// version counter, same pattern as the feature apps.
export function NotificationsApp({ onBack, onOpenTarget }: NotificationsAppProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [, setVersion] = useState(0)

  const unread = unreadNotificationCount()
  const items = MOCK_NOTIFICATIONS.filter((n) => filter === 'all' || n.category === filter).sort((a, b) =>
    b.at.localeCompare(a.at),
  )
  const days = Array.from(new Set(items.map((n) => n.at.slice(0, 10))))

  const readAll = () => {
    MOCK_NOTIFICATIONS.forEach((n) => (n.read = true))
    setVersion((v) => v + 1)
  }

  const open = (n: AppNotification) => {
    n.read = true
    setVersion((v) => v + 1)
    if (n.target) onOpenTarget(n.target)
  }

  return (
    <div className="screen noti-screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
          ‹
        </button>
        <div className="topbar-title noti-title">Thông báo</div>
        <button className="noti-readall" disabled={unread === 0} onClick={readAll}>
          Đọc tất cả{unread > 0 ? ` (${unread})` : ''}
        </button>
      </div>

      <div className="tabs noti-tabs">
        {TABS.map((t) => (
          <button
            key={t.value}
            className={`tab-pill ${filter === t.value ? 'active' : ''}`}
            onClick={() => setFilter(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {days.length ? (
        <div className="noti-list">
          {days.map((day) => (
            <section key={day}>
              <div className="noti-day">{fmtDay(day)}</div>
              {items
                .filter((n) => n.at.startsWith(day))
                .map((n) => (
                  <button
                    key={n.id}
                    className={`noti-card ${n.read ? '' : 'unread'} ${n.category === 'transaction' ? 'has-icon' : ''}`}
                    onClick={() => open(n)}
                  >
                    {n.category === 'transaction' && (
                      <span className="noti-icon">
                        <WalletIcon />
                      </span>
                    )}
                    <span className="noti-body">
                      <span className="noti-card-title">{n.title}</span>
                      <span className="noti-card-text">{n.body}</span>
                      <span className="noti-time">{fmtStamp(n.at)}</span>
                    </span>
                    {!n.read && <span className="noti-dot" aria-label="Chưa đọc" />}
                  </button>
                ))}
            </section>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="glyph">🔔</div>
          <div className="text">Chưa có thông báo</div>
        </div>
      )}
    </div>
  )
}
