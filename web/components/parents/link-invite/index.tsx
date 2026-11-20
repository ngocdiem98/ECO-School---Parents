'use client'

import { useState } from 'react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import { dsStudentAvatar } from '@/components/parents/shared/student-avatar'
import { relativeTimeVi } from '@/components/parents/shared/relative-time'
import { MOCK_INVITES, acceptInvite, declineInvite, pendingInvites, type LinkInvite } from '@/lib/mock-data'

// "Nhà trường liên kết Phụ huynh – Học sinh" (PRD 4.6, App ECO Me): the invites
// the school created for this account. List "Lời mời liên kết của tôi" →
// detail "Lời mời liên kết học sinh" (Đồng ý liên kết / Từ chối) → popups
// Xác nhận từ chối, Liên kết thành công, and the error page "Lời mời không
// còn hiệu lực". Reuses the layout of the invite screens of the phone-invite
// PRDs; the inviter is the school, so no inviter name or phone is shown.

export type InviteView = 'list' | 'detail' | 'expired'

// Solid green check used by the benefit lists and the success popup.
export function GreenCheck({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: 'none' }}>
      <circle cx="12" cy="12" r="12" fill="#12A150" />
      <path d="M7 12.5l3.2 3.2L17 8.8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface LinkInviteAppProps {
  initial: { view: InviteView; inviteId?: string }
  onBack: () => void
  onGoEcoMe: () => void
  // Linked through an invite: back to the ECO Me home, where the new student card shows.
  onLinked: (studentId: string) => void
  onToast: (message: string) => void
}

const avatarOf = (i: LinkInvite) =>
  dsStudentAvatar({ gender: i.gender, className: i.className, school: i.schoolName })

function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="topbar">
      <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
        ‹
      </button>
      <div className="topbar-title">{title}</div>
      <span className="icon-btn-ghost" />
    </div>
  )
}

export function LinkInviteApp({ initial, onBack, onGoEcoMe, onLinked, onToast }: LinkInviteAppProps) {
  const [view, setView] = useState<InviteView>(initial.view)
  const [inviteId, setInviteId] = useState<string | undefined>(initial.inviteId)
  const [fromList, setFromList] = useState(false)
  const [confirmReject, setConfirmReject] = useState(false)
  const [success, setSuccess] = useState<LinkInvite | null>(null)
  const [successStudentId, setSuccessStudentId] = useState<string | null>(null)
  const [, setVersion] = useState(0)

  const invite = MOCK_INVITES.find((i) => i.id === inviteId)
  const pending = pendingInvites()

  const openDetail = (i: LinkInvite) => {
    i.isNew = false
    setInviteId(i.id)
    setFromList(true)
    setView('detail')
  }

  const accept = () => {
    if (!invite) return
    if (invite.status !== 'pending') {
      setView('expired')
      return
    }
    const st = acceptInvite(invite.id)
    setSuccessStudentId(st?.id ?? null)
    setSuccess(invite)
    setVersion((v) => v + 1)
  }

  const reject = () => {
    if (!invite) return
    declineInvite(invite.id)
    setConfirmReject(false)
    onToast('Đã từ chối lời mời liên kết')
    if (pendingInvites().length > 0) {
      setView('list')
      setVersion((v) => v + 1)
    } else onGoEcoMe()
  }

  // ---- Lời mời không còn hiệu lực ------------------------------------------
  const expired = view === 'expired' || (view === 'detail' && (!invite || invite.status === 'cancelled' || invite.status === 'declined'))
  if (expired) {
    return (
      <div className="screen li-screen li-expired-screen">
        <TopBar title="Lời mời liên kết học sinh" onBack={onBack} />
        <div className="li-expired">
          <span className="li-expired-icon">!</span>
          <h2>Lời mời không còn hiệu lực</h2>
          <p>Lời mời liên kết này đã bị hủy hoặc không còn tồn tại. Vui lòng liên hệ trường để nhận lời mời mới.</p>
        </div>
        <div className="li-footer">
          <button className="btn btn-primary" onClick={onGoEcoMe}>
            Về trang chủ
          </button>
        </div>
      </div>
    )
  }

  // ---- Chi tiết lời mời ------------------------------------------------------
  if (view === 'detail' && invite) {
    return (
      <div className="screen li-screen">
        <TopBar title="Lời mời liên kết học sinh" onBack={() => (fromList ? setView('list') : onBack())} />
        <div className="li-detail">
          <img className="li-detail-avatar" src={avatarOf(invite)} alt="" />
          <h2 className="li-detail-name">{invite.studentName}</h2>
          <div className="li-detail-code">{invite.studentCode}</div>
          <div className="li-chips">
            <span>{invite.className}</span>
            <span>{invite.schoolName}</span>
          </div>

          <div className="li-info">
            <span className="li-info-icon" aria-hidden="true">
              i
            </span>
            <span>
              <b>{invite.schoolName}</b> mời bạn liên kết với học sinh {invite.studentName}
            </span>
          </div>

          <div className="li-benefits">
            <div className="li-benefits-title">Lợi ích của bạn</div>
            {['Cập nhật thông tin về học sinh tại trường', 'Thuận tiện thanh toán học phí', 'Tương tác dễ dàng hơn với nhà trường'].map((t) => (
              <div className="li-benefit" key={t}>
                <GreenCheck />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="li-footer li-footer-stack">
          <button className="btn btn-primary" onClick={accept}>
            Đồng ý liên kết
          </button>
          <button className="li-btn-reject" onClick={() => setConfirmReject(true)}>
            Từ chối
          </button>
        </div>

        {confirmReject && (
          <OverlayPortal>
            <div className="scrim" onClick={() => setConfirmReject(false)} />
            <div className="dialog-wrap">
              <div className="dialog-card">
                <div className="d-title">Lời mời liên kết</div>
                <div className="d-sub">Bạn có chắc chắn muốn từ chối lời mời liên kết này?</div>
                <div className="btn-row">
                  <button className="btn btn-outline" onClick={() => setConfirmReject(false)}>
                    Đóng
                  </button>
                  <button className="btn btn-primary" onClick={reject}>
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </OverlayPortal>
        )}

        {success && (
          <OverlayPortal>
            <div className="scrim" />
            <div className="dialog-wrap">
              <div className="dialog-card li-success">
                <span className="li-success-icon">
                  <GreenCheck size={48} />
                </span>
                <div className="d-title">Liên kết thành công</div>
                <div className="d-sub">Bạn đã có thể theo dõi {success.studentName}</div>
                <button className="btn btn-primary" onClick={() => (successStudentId ? onLinked(successStudentId) : onGoEcoMe())}>
                  Về trang chủ
                </button>
                {pending.length > 0 && (
                  <button
                    className="btn btn-outline li-success-more"
                    onClick={() => {
                      setSuccess(null)
                      setView('list')
                    }}
                  >
                    Xem lời mời khác ({pending.length})
                  </button>
                )}
              </div>
            </div>
          </OverlayPortal>
        )}
      </div>
    )
  }

  // ---- Lời mời liên kết của tôi ---------------------------------------------
  return (
    <div className="screen li-screen">
      <TopBar title="Lời mời liên kết của tôi" onBack={onBack} />
      {pending.length > 0 ? (
        <>
          <div className="li-count">{pending.length} lời mời đang chờ bạn</div>
          <div className="li-list">
            {pending.map((i) => (
              <div className="li-card" key={i.id} role="button" tabIndex={0} onClick={() => openDetail(i)}>
                <div className="li-card-top">
                  <img className="li-card-avatar" src={avatarOf(i)} alt="" />
                  <div className="li-card-main">
                    <div className="li-card-name">{i.studentName}</div>
                    <div className="li-card-meta">
                      {i.className} · {i.schoolName}
                    </div>
                  </div>
                  <div className="li-card-side">
                    <span className="li-card-time">{relativeTimeVi(i.receivedAt)}</span>
                    {i.isNew && <span className="li-new">Mới</span>}
                  </div>
                </div>
                <div className="li-card-bottom">
                  <span>Từ {i.schoolName}</span>
                  <button
                    className="li-card-link"
                    onClick={(e) => {
                      e.stopPropagation()
                      openDetail(i)
                    }}
                  >
                    Xem lời mời
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="text">Không có lời mời nào đang chờ bạn</div>
        </div>
      )}
    </div>
  )
}
