'use client'

import { useState } from 'react'
import { ArrowRight, ChevronDown, Link2, Link2Off, School, UserRound } from 'lucide-react'
import { MOCK_STUDENTS, getStudent, type ProfileEventKind } from '@/lib/mock-data'
import { StudentBar } from '@/components/parents/shared/student-bar'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { PersonAvatar } from '@/components/parents/shared/person-avatar'
import { activityTimeVi } from '@/components/parents/shared/relative-time'
import type { ServiceIntent } from '@/components/parents/shared/use-service-launcher'
import { HealthSection } from './health-section'

interface ProfileAppProps {
  studentId: string
  initialTab?: 'info' | 'health'
  onBack: () => void
  onSelectStudent: (studentId: string) => void
  onOpenLinkManage: (studentId: string) => void
  onOpenService: (intent: ServiceIntent, studentId: string) => void
}

// Hồ sơ học sinh (PRD "[PH] Enhance Trang Học sinh" mục 4.3): two pill tabs.
// "Thông tin chung" = Thông tin cá nhân (read only, from the school), Phụ huynh
// (n) (people linked on ECO Me, not the Portal guardians) and Lịch sử hoạt động
// (4 latest events). "Sức khoẻ" = Chỉ số sức khoẻ (PH-18).
const EVENT_ICON: Record<ProfileEventKind, typeof Link2> = {
  link: Link2,
  unlink: Link2Off,
  school: School,
  created: UserRound,
}

export function ProfileApp({ studentId, initialTab = 'info', onBack, onSelectStudent, onOpenLinkManage, onOpenService }: ProfileAppProps) {
  const [tab, setTab] = useState<'info' | 'health'>(initialTab)
  const [open, setOpen] = useState(true)
  const [showPicker, setShowPicker] = useState(false)
  const student = getStudent(studentId)
  if (!student) return null

  const parents = student.linkedPeople.filter((p) => p.status === 'linked')
  const isManager = student.linkedPeople.some((p) => p.isMe && p.role === 'manager')

  return (
    <div className="screen sp-screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
          ‹
        </button>
        <div className="topbar-title">Hồ sơ học sinh</div>
        <span className="icon-btn-ghost" />
      </div>

      <StudentBar student={student} onSwitch={MOCK_STUDENTS.length > 1 ? () => setShowPicker(true) : undefined} />

      <div className="hp-tabs">
        <button className={`hp-tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>
          Thông tin chung
        </button>
        <button className={`hp-tab ${tab === 'health' ? 'active' : ''}`} onClick={() => setTab('health')}>
          Sức khoẻ
        </button>
      </div>

      {tab === 'info' ? (
        <div className="sp-body">
          <div className="sp-panel hp-card">
            <b className="hp-title">Thông tin cá nhân</b>
            {[
              ['Mã học sinh', student.code],
              ['Ngày sinh', student.dob],
              ['Giới tính', student.gender],
              ['Lớp', student.className.replace(/^Lớp\s*(?=\d)/, '')],
              ['Trường', student.school],
            ].map(([k, v]) => (
              <div className="hp-kv" key={k}>
                <span className="hp-k">{k}</span>
                <span className="hp-v">{v}</span>
              </div>
            ))}
          </div>

          <div className="sp-panel hp-card">
            <button className="hp-collapse" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
              <b className="hp-title">Phụ huynh ({parents.length})</b>
              <ChevronDown size={20} className={open ? 'is-open' : ''} />
            </button>
            {open && (
              <>
                {parents.map((p) => (
                  <div className="hp-person" key={p.id}>
                    <PersonAvatar />
                    <span>
                      {p.name}
                      {p.isMe && <span className="hp-me"> (Bạn)</span>}
                      {p.relation && <small className="hp-relation">{p.relation}</small>}
                    </span>
                  </div>
                ))}
                <button className="hp-manage" onClick={() => onOpenLinkManage(student.id)}>
                  {isManager ? 'Quản lý phụ huynh' : 'Xem chi tiết'}
                  <ArrowRight size={18} />
                </button>
              </>
            )}
          </div>

          <div className="sp-panel hp-card">
            <b className="hp-title">Lịch sử hoạt động</b>
            {student.profileHistory.slice(0, 4).map((e, i) => {
              const Icon = EVENT_ICON[e.kind]
              return (
                <div className="hp-event" key={i}>
                  <span className={`hp-event-icon hp-event-icon--${e.kind}`}>
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <div>
                    <div className="hp-event-text">{e.text}</div>
                    <div className="hp-event-time">{activityTimeVi(e.at)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="sp-body hp-health">
          <HealthSection student={student} onOpenAdvice={() => onOpenService('healthadvice', student.id)} />
        </div>
      )}

      {showPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS}
          selectedStudentId={studentId}
          onSelect={(s) => {
            setShowPicker(false)
            onSelectStudent(s.id)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}
