'use client'

import { useState } from 'react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import { GreenCheck } from '@/components/parents/link-invite'
import { Toast } from '@/components/parents/shared/toast'
import { useToast } from '@/components/parents/shared/use-toast'
import { StudentBar } from '@/components/parents/shared/student-bar'
import { PersonAvatar } from '@/components/parents/shared/person-avatar'
import { joinedTextVi, maskPhone } from '@/components/parents/shared/relative-time'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { Unlink } from 'lucide-react'
import { MOCK_STUDENTS, getStudent, MAX_LINKED_PEOPLE, type LinkedPerson } from '@/lib/mock-data'

// "Quản lý phụ huynh" (Hồ sơ học sinh > Phụ huynh). "Danh sách phụ huynh"
// includes people the school added (PRD "Nhà trường liên kết Phụ huynh – Học
// sinh" 4.6): shown and handled like people the main connector invited, even
// when they already have an ECO Me account:
// - Chờ đồng ý (invite not accepted yet, or no account yet): tag + "Hủy lời mời"; no "Nhắc lại" for a school invite.
// - Đã đồng ý: "Hủy theo dõi".
// The "Mời thêm phụ huynh" input hides at 3 people, pending ones included
// (BR-02). Only the main connector manages; a follower just sees the list.

type Confirm = { kind: 'unlink' | 'cancel' | 'resend'; person: LinkedPerson } | { kind: 'leave' } | null

const nameOf = (p: LinkedPerson) => p.name || maskPhone(p.phone || '')
const REMIND_GAP_MS = 30 * 60 * 1000

export function LinkManageApp({
  studentId,
  onBack,
  onSelectStudent,
  onLeft,
}: {
  studentId: string
  onBack: () => void
  onSelectStudent?: (id: string) => void
  // The parent confirmed "Hủy theo dõi học sinh": the caller leaves this student.
  onLeft?: (studentId: string) => void
}) {
  const student = getStudent(studentId)!
  const [, setVersion] = useState(0)
  const [confirm, setConfirm] = useState<Confirm>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const { toast, toastSuccess, show } = useToast()
  const bump = () => setVersion((v) => v + 1)

  const people = [...student.linkedPeople].sort((a, b) =>
    a.role !== b.role ? (a.role === 'manager' ? -1 : 1) : a.since.localeCompare(b.since),
  )
  const me = people.find((p) => p.isMe)
  const isManager = me?.role === 'manager'
  const full = people.length >= MAX_LINKED_PEOPLE
  const canSwitch = !!onSelectStudent && MOCK_STUDENTS.length > 1

  const remove = (p: LinkedPerson) => {
    student.linkedPeople = student.linkedPeople.filter((x) => x.id !== p.id)
    bump()
  }

  const invite = () => {
    const digits = phone.replace(/\s/g, '')
    if (!/^0\d{9}$/.test(digits)) return setPhoneError('Số điện thoại không hợp lệ')
    const existing = student.linkedPeople.find((p) => (p.phone || '').replace(/\s/g, '') === digits)
    if (existing) return setPhoneError(existing.status === 'pending' ? 'Số điện thoại này đã có lời mời đang chờ' : 'Số điện thoại này đã theo dõi học sinh')
    const now = new Date().toISOString()
    student.linkedPeople = [
      ...student.linkedPeople,
      { id: `lp-${Date.now()}`, name: '', phone: digits, role: 'follower', status: 'pending', source: 'parent', since: now, lastInvitedAt: now },
    ]
    setPhone('')
    setPhoneError('')
    show('Đã gửi lời mời đến phụ huynh', true)
    bump()
  }

  const askResend = (p: LinkedPerson) => {
    const last = new Date(p.lastInvitedAt || p.since).getTime()
    if (Date.now() - last < REMIND_GAP_MS) return show('Bạn có thể nhắc lại sau 30 phút')
    setConfirm({ kind: 'resend', person: p })
  }

  const doConfirm = () => {
    if (!confirm) return
    if (confirm.kind === 'leave') {
      setConfirm(null)
      onLeft?.(studentId)
      return
    }
    const { kind, person } = confirm
    if (kind === 'resend') {
      person.lastInvitedAt = new Date().toISOString()
      show('Đã nhắc lại lời mời', true)
    } else {
      remove(person)
      show(kind === 'unlink' ? `Đã hủy theo dõi của ${nameOf(person)}` : 'Đã hủy lời mời', true)
    }
    setConfirm(null)
    bump()
  }

  const dialog =
    confirm &&
    (confirm.kind === 'leave'
      ? { title: 'Hủy theo dõi học sinh', sub: `Bạn sẽ không xem được thông tin của ${student.name} nữa. Bạn có thể được mời lại bất cứ lúc nào.`, ok: 'Xác nhận' }
      : confirm.kind === 'unlink'
      ? { title: 'Hủy theo dõi', sub: `${nameOf(confirm.person)} sẽ không xem được thông tin của ${student.name} nữa. Bạn có thể mời lại bất cứ lúc nào.`, ok: 'Xác nhận' }
      : confirm.kind === 'cancel'
        ? { title: 'Hủy lời mời', sub: `${nameOf(confirm.person)} sẽ không đồng ý được lời mời theo dõi ${student.name} nữa. Bạn có thể mời lại bất cứ lúc nào.`, ok: 'Xác nhận' }
        : { title: 'Nhắc lại lời mời', sub: `Gửi lại lời mời theo dõi ${student.name} đến ${nameOf(confirm.person)}?`, ok: 'Nhắc lại' })

  return (
    <div className="screen lm-screen sp-screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
          ‹
        </button>
        <div className="topbar-title">Quản lý phụ huynh</div>
        <span className="icon-btn-ghost" />
      </div>

      <StudentBar student={student} onSwitch={canSwitch ? () => setShowPicker(true) : undefined} />

      <div className="lm-body">
        <div className="lm-card">
          <div className="lm-card-label">
            Danh sách phụ huynh ({people.length}/{MAX_LINKED_PEOPLE})
          </div>
          {people.map((p) => {
            const pending = p.status === 'pending'
            return (
              <div className="lm-row" key={p.id}>
                <PersonAvatar />
                <div className="lm-row-main">
                  <div className="lm-row-name">
                    {nameOf(p)}
                    {p.isMe && <span className="lm-me"> (Bạn)</span>}
                  </div>
                  {pending ? (
                    <div className="lm-row-sub">
                      {p.relation && <span>{p.relation} · </span>}
                      <span className="lm-tag-pending">Chờ đồng ý</span>
                      {p.source === 'school' && <span> · Trường mời</span>}
                    </div>
                  ) : (
                    <div className="lm-row-sub">
                      {p.relation && `${p.relation} · `}
                      {joinedTextVi(p.since)}
                    </div>
                  )}
                </div>
                <div className="lm-row-actions">
                  {p.role === 'manager' ? (
                    <span className={`lm-tag-manager ${isManager ? '' : 'is-blue'}`}>Người quản lý</span>
                  ) : (
                    isManager && (
                      <>
                        {pending && p.source === 'parent' && (
                          <>
                            <button className="lm-act lm-act-blue" onClick={() => askResend(p)}>
                              Nhắc lại
                            </button>
                            <span className="lm-sep" />
                          </>
                        )}
                        <button className="lm-act lm-act-red" onClick={() => setConfirm({ kind: pending ? 'cancel' : 'unlink', person: p })}>
                          {pending ? 'Hủy lời mời' : 'Hủy theo dõi'}
                        </button>
                      </>
                    )
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {isManager && (
          <div className="lm-card">
            <div className="lm-card-title">Mời thêm phụ huynh</div>
            {!full && (
              <div className="lm-invite">
                <input
                  className={`lm-input ${phoneError ? 'has-error' : ''}`}
                  inputMode="tel"
                  placeholder="Số điện thoại phụ huynh"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    setPhoneError('')
                  }}
                />
                <button className="btn btn-primary lm-invite-btn" onClick={invite} disabled={!phone.trim()}>
                  Gửi lời mời
                </button>
              </div>
            )}
            {phoneError && <div className="lm-error">{phoneError}</div>}
            {full && (
              <div className="lm-alert">
                <span className="li-info-icon" aria-hidden="true">
                  i
                </span>
                <span>Mỗi học sinh có tối đa 3 phụ huynh theo dõi. Để mời thêm, vui lòng hủy theo dõi hoặc hủy lời mời của một người.</span>
              </div>
            )}
          </div>
        )}

        <div className="li-benefits">
          <div className="li-benefits-title">{isManager ? 'Phụ huynh được mời có thể' : 'Lợi ích của bạn'}</div>
          {(isManager
            ? ['Cập nhật thông tin về học sinh tại trường', 'Thanh toán học phí và các khoản thu', 'Nhận thông báo từ nhà trường về học sinh này']
            : ['Cập nhật thông tin về học sinh tại trường', 'Thuận tiện thanh toán học phí', 'Tương tác dễ dàng hơn với nhà trường']
          ).map((t) => (
            <div className="li-benefit" key={t}>
              <GreenCheck />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="lm-leave" onClick={() => setConfirm({ kind: 'leave' })}>
        <Unlink size={18} />
        Hủy theo dõi học sinh
      </button>

      {dialog && (
        <OverlayPortal>
          <div className="scrim" onClick={() => setConfirm(null)} />
          <div className="dialog-wrap">
            <div className="dialog-card">
              <div className="d-title">{dialog.title}</div>
              <div className="d-sub">{dialog.sub}</div>
              <div className="btn-row">
                <button className="btn btn-outline" onClick={() => setConfirm(null)}>
                  Đóng
                </button>
                <button className="btn btn-primary" onClick={doConfirm}>
                  {dialog.ok}
                </button>
              </div>
            </div>
          </div>
        </OverlayPortal>
      )}

      {showPicker && onSelectStudent && (
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

      {toast && <Toast message={toast} success={toastSuccess} />}
    </div>
  )
}
