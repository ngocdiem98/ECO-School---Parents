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

// "Quản lý liên kết" (Hồ sơ học sinh > Phụ huynh). The list of "Người theo dõi"
// includes people the school added (PRD "Nhà trường liên kết Phụ huynh – Học
// sinh" 4.6): shown and handled like people the main connector invited, even
// when they already have an ECO Me account:
// - Chờ xác nhận (invite not accepted yet, or no account yet): tag + "Hủy lời mời"; no "Mời lại" for a school invite.
// - Đã liên kết: in the follower group with "Hủy liên kết".
// The "Thêm người giám hộ" input hides at 3 people, pending ones included
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
  // The parent confirmed "Huỷ liên kết với học sinh": the caller leaves this student.
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
    if (student.linkedPeople.some((p) => (p.phone || '').replace(/\s/g, '') === digits)) return setPhoneError('Số điện thoại này đã được mời')
    const now = new Date().toISOString()
    student.linkedPeople = [
      ...student.linkedPeople,
      { id: `lp-${Date.now()}`, name: '', phone: digits, role: 'follower', status: 'pending', source: 'parent', since: now, lastInvitedAt: now },
    ]
    setPhone('')
    setPhoneError('')
    show('Gửi lời mời thành công', true)
    bump()
  }

  const askResend = (p: LinkedPerson) => {
    const last = new Date(p.lastInvitedAt || p.since).getTime()
    if (Date.now() - last < REMIND_GAP_MS) return show('Thử mời lại sau 30 phút')
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
      show('Đã gửi lại lời mời', true)
    } else {
      remove(person)
      show(kind === 'unlink' ? 'Đã huỷ quyền liên kết' : 'Đã huỷ lời mời', true)
    }
    setConfirm(null)
    bump()
  }

  const dialog =
    confirm &&
    (confirm.kind === 'leave'
      ? { title: 'Huỷ liên kết với học sinh', sub: `Bạn sẽ không thể xem thông tin của ${student.name} nữa. Bạn có thể được mời lại bất cứ lúc nào.`, ok: 'Xác nhận' }
      : confirm.kind === 'unlink'
      ? { title: 'Xác nhận huỷ quyền liên kết', sub: `${nameOf(confirm.person)} sẽ không thể xem thông tin của học sinh này nữa. Bạn có thể mời lại bất cứ lúc nào.`, ok: 'Xác nhận' }
      : confirm.kind === 'cancel'
        ? { title: 'Xác nhận huỷ lời mời', sub: `${nameOf(confirm.person)} sẽ không thể chấp nhận lời mời theo dõi học sinh này nữa. Bạn có thể mời lại bất cứ lúc nào.`, ok: 'Xác nhận' }
        : { title: 'Gửi lại lời mời', sub: 'Bạn có chắc chắn muốn gửi lại lời mời liên kết đến tài khoản này?', ok: 'Gửi lại' })

  return (
    <div className="screen lm-screen sp-screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
          ‹
        </button>
        <div className="topbar-title">Quản lý liên kết</div>
        <span className="icon-btn-ghost" />
      </div>

      <StudentBar student={student} onSwitch={canSwitch ? () => setShowPicker(true) : undefined} />

      <div className="lm-body">
        <div className="lm-card">
          <div className="lm-card-label">{isManager ? 'Người theo dõi' : 'Người đang theo dõi'}</div>
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
                      <span className="lm-tag-pending">Chờ xác nhận</span>
                      {p.source === 'school' && <span> · Trường mời</span>}
                    </div>
                  ) : (
                    <div className="lm-row-sub">{joinedTextVi(p.since)}</div>
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
                              Mời lại
                            </button>
                            <span className="lm-sep" />
                          </>
                        )}
                        <button className="lm-act lm-act-red" onClick={() => setConfirm({ kind: pending ? 'cancel' : 'unlink', person: p })}>
                          {pending ? 'Hủy lời mời' : 'Hủy liên kết'}
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
            <div className="lm-card-title">Mời người giám hộ học sinh</div>
            {!full && (
              <div className="lm-invite">
                <input
                  className={`lm-input ${phoneError ? 'has-error' : ''}`}
                  inputMode="tel"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    setPhoneError('')
                  }}
                />
                <button className="btn btn-primary lm-invite-btn" onClick={invite} disabled={!phone.trim()}>
                  Mời người giám hộ
                </button>
              </div>
            )}
            {phoneError && <div className="lm-error">{phoneError}</div>}
            {full && (
              <div className="lm-alert">
                <span className="li-info-icon" aria-hidden="true">
                  i
                </span>
                <span>Một học sinh có thể liên kết tối đa 3 người. Muốn mời thêm, vui lòng hủy liên kết hoặc hủy lời mời của một người đang dùng suất.</span>
              </div>
            )}
          </div>
        )}

        <div className="li-benefits">
          <div className="li-benefits-title">{isManager ? 'Quyền hạn của người được mời' : 'Lợi ích của bạn'}</div>
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
        Huỷ liên kết với học sinh
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
