'use client'

import { useState } from 'react'
import {
  ArrowLeftRight,
  ArrowUpFromLine,
  Bell,
  ChevronRight,
  Eye,
  EyeOff,
  House,
  Plus,
  ReceiptText,
  ScanLine,
  Search,
  ShoppingBasket,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { MOCK_STUDENTS, fmtMoney, unreadNotificationCount } from '@/lib/mock-data'
import { useServiceLauncher, type ServiceNav } from '@/components/parents/shared/use-service-launcher'
import { ServiceGrid } from './service-grid'
import { EDU_SERVICES, HOME_SERVICE_IDS, type EcoService } from './services'

// Mock Ví ECO balance (same figure as the confirm screens' wallet row).
const WALLET_BALANCE = 204913

const QUICK_ACTIONS: { icon: LucideIcon; label: string }[] = [
  { icon: Plus, label: 'Nạp tiền' },
  { icon: ArrowLeftRight, label: 'Chuyển tiền' },
  { icon: ArrowUpFromLine, label: 'Rút tiền' },
  { icon: ScanLine, label: 'Mã thanh toán' },
]

const TABS: { icon: LucideIcon; label: string; active?: boolean }[] = [
  { icon: House, label: 'Trang chủ', active: true },
  { icon: ShoppingBasket, label: 'Mua sắm' },
  { icon: ReceiptText, label: 'Đơn hàng' },
  { icon: Wallet, label: 'Ví của tôi' },
]

interface EcoHomeScreenProps extends ServiceNav {
  onOpenServices: () => void
  onOpenEcoParent: () => void
  onOpenNotifications: () => void
  onNavigateToStudent: (studentId: string) => void
  onNavigateToLinkStudent: () => void
}

// ECO Me home (the super-app landing): promo banner with greeting, wallet
// card, 7 services plus "Xem thêm", the linked students and the bottom tab bar.
// Wallet actions, search, the banner CTA and the bottom tabs are inert
// placeholders (only the education services are built); the bell opens Thông báo.
export function EcoHomeScreen({
  onOpenServices,
  onOpenEcoParent,
  onOpenNotifications,
  onNavigateToStudent,
  onNavigateToLinkStudent,
  ...nav
}: EcoHomeScreenProps) {
  const [showBalance, setShowBalance] = useState(true)
  const { launch, picker } = useServiceLauncher(nav)
  const unread = unreadNotificationCount()

  const homeServices = HOME_SERVICE_IDS.map((id) => EDU_SERVICES.find((s) => s.id === id)!)

  const pick = (s: EcoService) => {
    if (s.intent) launch(s.intent)
    else if (s.ecoParent) onOpenEcoParent()
  }

  return (
    <div className="screen eco-home">
      <div className="eco-banner">
        <div className="eco-header">
          <div className="eco-avatar">D</div>
          <div className="eco-greeting">Xin chào, Diễm 👋</div>
          <button className="eco-round" disabled aria-label="Tìm kiếm">
            <Search size={20} />
          </button>
          <button className="eco-round eco-bell" onClick={onOpenNotifications} aria-label="Thông báo">
            <Bell size={20} />
            {unread > 0 && <span className="eco-bell-badge">{unread}</span>}
          </button>
        </div>
        <div className="eco-promo">
          <div className="eco-promo-text">
            <div className="eco-promo-title">
              HỌC PHÍ ĐÚNG HẠN
              <br />
              AN TÂM ĐẾN TRƯỜNG
            </div>
            <div className="eco-promo-limit">Hạn mức</div>
            <div className="eco-promo-amount">10.000.000đ</div>
          </div>
          <div className="eco-promo-art" aria-hidden="true">
            <div className="eco-promo-phone">
              <b>ECOPayLater</b>
              <span>Học phí trả sau</span>
            </div>
            <div className="eco-promo-burst">
              DỊCH VỤ
              <br />
              MỚI
            </div>
          </div>
          <button className="eco-promo-cta" disabled>
            ĐĂNG KÝ NGAY
          </button>
        </div>
      </div>

      <div className="eco-wallet">
        <div className="eco-wallet-actions">
          {QUICK_ACTIONS.map(({ icon: Icon, label }) => (
            <button key={label} className="svc-item eco-action" disabled>
              <span className="eco-action-icon">
                <Icon size={24} strokeWidth={2.2} />
              </span>
              <span className="svc-label">{label}</span>
            </button>
          ))}
        </div>
        <div className="eco-wallet-balances">
          <div className="eco-balance">
            <button className="eco-eye" onClick={() => setShowBalance((v) => !v)} aria-label="Ẩn/hiện số dư">
              {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <div>
              <div className="eco-balance-label">Ví ECO</div>
              <div className="eco-balance-value">{showBalance ? fmtMoney(WALLET_BALANCE) : '••••••'}</div>
            </div>
          </div>
          <div className="eco-balance">
            <span className="eco-eye">
              <EyeOff size={18} />
            </span>
            <div>
              <div className="eco-balance-label">ECO trả sau</div>
              <div className="eco-balance-link">
                Đăng ký <ChevronRight size={14} style={{ verticalAlign: '-2px' }} />
              </div>
            </div>
          </div>
          <div className="eco-coin">
            <span className="eco-coin-dot">E</span>0 <ChevronRight size={14} />
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

      <div className="eco-tabbar">
        {TABS.slice(0, 2).map(({ icon: Icon, label, active }) => (
          <button key={label} className={`eco-tab ${active ? 'active' : ''}`} disabled={!active}>
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
        <button className="eco-tab eco-tab-pay" disabled>
          <span className="eco-tab-pay-btn">
            <ScanLine size={26} />
          </span>
          <span>Thanh toán</span>
        </button>
        {TABS.slice(2).map(({ icon: Icon, label }) => (
          <button key={label} className="eco-tab" disabled>
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {picker}
    </div>
  )
}
