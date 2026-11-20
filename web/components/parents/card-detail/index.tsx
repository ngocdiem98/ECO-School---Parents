'use client'

import { useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, HelpCircle, KeyRound, Lock, Settings } from 'lucide-react'
import { MOCK_STUDENTS, getStudent, type CardActivity } from '@/lib/mock-data'
import { StudentBar } from '@/components/parents/shared/student-bar'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { Toast } from '@/components/parents/shared/toast'
import { useToast } from '@/components/parents/shared/use-toast'
import { activityTimeVi } from '@/components/parents/shared/relative-time'
import type { ServiceIntent } from '@/components/parents/shared/use-service-launcher'
import { CardSettingsSheet } from './card-settings-sheet'

// Chi tiết thẻ học sinh (PRD "[PH] Enhance Trang Học sinh" mục 4.2): card info,
// the 4 latest card activities, the fixed "Nạp điểm vào thẻ" button and the
// gear that opens "Cài đặt thẻ". A locked card shows the red notice with
// "Mở khoá thẻ" and disables the top-up button.
const fmtPoints = (n: number) => n.toLocaleString('en-US')

function ActivityIcon({ kind }: { kind: CardActivity['kind'] }) {
  const Icon = kind === 'spend' ? ArrowUpFromLine : kind === 'topup' ? ArrowDownToLine : kind === 'unlock' ? KeyRound : Lock
  return (
    <span className={`cd-act-icon cd-act-icon--${kind}`}>
      <Icon size={20} strokeWidth={1.8} />
    </span>
  )
}

export function CardDetailApp({
  studentId,
  onBack,
  onSelectStudent,
  onOpenService,
  onOpenHelp,
}: {
  studentId: string
  onBack: () => void
  onSelectStudent: (id: string) => void
  onOpenService: (intent: ServiceIntent, studentId: string) => void
  onOpenHelp: () => void
}) {
  const student = getStudent(studentId)
  const [, setVersion] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const { toast, toastSuccess, show } = useToast()
  const card = student?.card
  if (!student || !card) return null

  const withCard = MOCK_STUDENTS.filter((s) => s.card)
  const locked = card.status === 'locked'

  // Lock / unlock keep the card state and add the matching activity.
  const setLocked = (next: boolean) => {
    card.status = next ? 'locked' : 'active'
    card.activities = [
      {
        id: `ca-${Date.now()}`,
        kind: next ? 'lock' : 'unlock',
        title: next ? 'Khoá thẻ khẩn cấp' : 'Mở khoá thẻ',
        at: new Date().toISOString(),
      },
      ...card.activities,
    ]
    setVersion((v) => v + 1)
  }

  const onAction = (action: 'auto_topup' | 'limit' | 'reissue') => {
    setShowSettings(false)
    show(
      action === 'auto_topup'
        ? 'Màn Nạp tiền tự động không thuộc phạm vi tài liệu này'
        : action === 'limit'
          ? 'Màn Cấu hình hạn mức không thuộc phạm vi tài liệu này'
          : 'Màn Cấp lại thẻ không thuộc phạm vi tài liệu này',
    )
  }

  return (
    <div className="screen sp-screen cd-screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
          ‹
        </button>
        <div className="topbar-title">Thẻ học sinh</div>
        <span className="cd-actions">
          <button className="icon-btn" onClick={onOpenHelp} aria-label="Hướng dẫn sử dụng">
            <HelpCircle size={24} strokeWidth={1.8} />
          </button>
          <button className="icon-btn" onClick={() => setShowSettings(true)} aria-label="Cài đặt thẻ">
            <Settings size={24} strokeWidth={1.8} />
          </button>
        </span>
      </div>

      <StudentBar student={student} onSwitch={withCard.length > 1 ? () => setShowPicker(true) : undefined} />

      <div className="sp-body cd-body">
        <div className="sp-panel cd-info">
          <div className="cd-info-head">
            <b>Thông tin thẻ</b>
            <span className={`sp-chip ${locked ? 'is-locked' : ''}`}>{locked ? 'Tạm khoá' : 'Đang hoạt động'}</span>
          </div>
          <div className="cd-kv">
            <span>Mã thẻ</span>
            <span className="cd-kv-v">{card.code}</span>
          </div>
          <div className="cd-kv">
            <span>Số dư thẻ</span>
            <span className={`cd-kv-balance ${locked ? 'is-dim' : ''}`}>
              {fmtPoints(student.balance)} <small>điểm</small>
            </span>
          </div>
          {locked && (
            <>
              <div className="cd-lock-alert">
                <span className="sp-alert-icon" aria-hidden="true">
                  !
                </span>
                <span>
                  Thẻ học sinh đang tạm khoá, hiện bạn không thể nạp điểm hoặc sử dụng chức năng thanh toán với Thẻ. Để
                  mở khoá vui lòng bấm nút <b className="cd-blue">Mở khoá thẻ</b> hoặc liên hệ <b>1900 9005</b> để được
                  hỗ trợ mở khoá.
                </span>
              </div>
              <button
                className="btn btn-primary cd-unlock"
                onClick={() => {
                  setLocked(false)
                  show('Đã mở khoá thẻ học sinh', true)
                }}
              >
                Mở khoá thẻ
              </button>
            </>
          )}
        </div>

        <div className="sp-panel cd-activities">
          <b className="cd-activities-title">Hoạt động gần đây</b>
          {card.activities.slice(0, 4).map((a) => (
            <div className="cd-act" key={a.id}>
              <ActivityIcon kind={a.kind} />
              <div className="cd-act-main">
                <div className="cd-act-title">{a.title}</div>
                <div className="cd-act-time">{activityTimeVi(a.at)}</div>
              </div>
              {a.amount !== undefined && (
                <div className={`cd-act-amount ${a.amount > 0 ? 'is-plus' : ''}`}>
                  {a.amount > 0 ? '+' : '-'}
                  {fmtPoints(Math.abs(a.amount))} điểm
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="cta-bar sticky">
        <button className="btn btn-primary" disabled={locked} onClick={() => onOpenService('topup', student.id)}>
          Nạp điểm vào thẻ
        </button>
      </div>

      {showSettings && (
        <CardSettingsSheet
          locked={locked}
          onToggleLock={() => {
            const next = !locked
            setLocked(next)
            show(next ? 'Đã kích hoạt khóa thẻ khẩn cấp' : 'Đã mở khóa thẻ học sinh', true)
          }}
          onAction={onAction}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showPicker && (
        <StudentPickerSheet
          students={withCard}
          selectedStudentId={studentId}
          onSelect={(s) => {
            setShowPicker(false)
            onSelectStudent(s.id)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {toast && <Toast message={toast} success={toastSuccess} />}
    </div>
  )
}
