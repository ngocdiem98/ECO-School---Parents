'use client'

import { useState } from 'react'
import { MOCK_STUDENTS, fmtMoney } from '@/lib/mock-data'
import { useServiceLauncher, type ServiceNav } from '@/components/parents/shared/use-service-launcher'
import { ServiceGrid } from './service-grid'
import { EDU_SERVICES, HOME_SERVICE_IDS, type EcoService } from './services'

// Mock Ví ECO balance (same figure as the confirm screens' wallet row).
const WALLET_BALANCE = 210913

const QUICK_ACTIONS = [
  { icon: '＋', label: 'Nạp tiền' },
  { icon: '⇄', label: 'Chuyển tiền' },
  { icon: '−', label: 'Rút tiền' },
  { icon: '▦', label: 'Mã thanh toán' },
]

interface EcoHomeScreenProps extends ServiceNav {
  onOpenServices: () => void
  onOpenEcoParent: () => void
  onNavigateToStudent: (studentId: string) => void
  onNavigateToLinkStudent: () => void
}

// ECO Me home (the super-app landing): greeting, wallet card, 7 services plus
// "Xem thêm", and the linked students. Wallet actions, search and the bell are
// inert placeholders — only the education services are built.
export function EcoHomeScreen({
  onOpenServices,
  onOpenEcoParent,
  onNavigateToStudent,
  onNavigateToLinkStudent,
  ...nav
}: EcoHomeScreenProps) {
  const [showBalance, setShowBalance] = useState(true)
  const { launch, picker } = useServiceLauncher(nav)

  const homeServices = HOME_SERVICE_IDS.map((id) => EDU_SERVICES.find((s) => s.id === id)!)

  const pick = (s: EcoService) => {
    if (s.intent) launch(s.intent)
    else if (s.ecoParent) onOpenEcoParent()
  }

  return (
    <div className="screen">
      <div className="eco-header">
        <div className="eco-avatar">D</div>
        <div className="eco-greeting">Xin chào, Diem 👋</div>
        <button className="icon-btn" disabled aria-label="Tìm kiếm">
          ⌕
        </button>
        <button className="icon-btn" disabled aria-label="Thông báo">
          🔔
        </button>
      </div>

      <div className="eco-wallet">
        <div className="eco-wallet-actions">
          {QUICK_ACTIONS.map((a) => (
            <button key={a.label} className="icon-item" disabled>
              <span className="icon-glyph">{a.icon}</span>
              <span className="icon-label">{a.label}</span>
            </button>
          ))}
        </div>
        <div className="eco-wallet-balances">
          <div className="eco-balance">
            <button className="eco-eye" onClick={() => setShowBalance((v) => !v)} aria-label="Ẩn/hiện số dư">
              {showBalance ? '◉' : '◌'}
            </button>
            <div>
              <div className="eco-balance-label">Ví ECO</div>
              <div className="eco-balance-value">{showBalance ? fmtMoney(WALLET_BALANCE) : '••••••'}</div>
            </div>
          </div>
          <div className="eco-balance">
            <div>
              <div className="eco-balance-label">ECO trả sau</div>
              <div className="eco-balance-link">Đăng ký ›</div>
            </div>
          </div>
        </div>
      </div>

      <ServiceGrid services={homeServices} onPick={pick} more={onOpenServices} />

      <div className="eco-students-head">
        <span className="eco-section-title" style={{ margin: 0 }}>
          Danh sách học sinh
        </span>
        <button className="eco-link" onClick={onNavigateToLinkStudent}>
          Thêm học sinh +
        </button>
      </div>
      <div className="eco-students">
        {MOCK_STUDENTS.map((s) => (
          <div className="student-card eco-student-card" key={s.id} onClick={() => onNavigateToStudent(s.id)}>
            <div className="student-card-head">
              <div className="avatar">{s.avatar}</div>
              <div>
                <div className="student-name">{s.name}</div>
                <div className="student-code">{s.code}</div>
              </div>
            </div>
            <div className="student-card-body">
              <div className="kv-label">Trường</div>
              <div className="kv-value">{s.school}</div>
              <div className="kv-label">Lớp</div>
              <div className="kv-value">{s.className}</div>
            </div>
          </div>
        ))}
      </div>

      {picker}
    </div>
  )
}
