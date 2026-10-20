'use client'

import React, { useState } from 'react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import { PickupPerson, maskNationalId, formatPhoneNumber } from './pickup-data'
import { getStudent } from '@/lib/mock-data'

interface PickupQRModalProps {
  person: PickupPerson
  onClose: () => void
}

export function PickupQRModal({ person, onClose }: PickupQRModalProps) {
  const [copied, setCopied] = useState(false)
  const student = getStudent(person.studentId)

  // Generate dynamic seed data for QR display
  const qrSessionTime = 'Hôm nay, ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

  const handleCopyLink = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <OverlayPortal>
      <div className="scrim" onClick={onClose} />
      <div className="pickup-qr-sheet">
        <div className="pickup-qr-header">
          <div className="pickup-qr-title">Thẻ đón trẻ học sinh</div>
          <button className="pickup-close-btn" onClick={onClose} aria-label="Đóng">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="pickup-qr-body">
          {/* Card Pass Container */}
          <div className="pickup-pass-card">
            {/* Top School Branding Header */}
            <div className="pickup-pass-head">
              <div className="pickup-pass-school-logo">ECO</div>
              <div className="pickup-pass-school-info">
                <div className="pickup-pass-school-name">{student?.school || 'Trường ECO FINVIET'}</div>
                <div className="pickup-pass-doc-title">THẺ ĐÓN HỌC SINH ĐIỆN TỬ</div>
              </div>
              <div className="pickup-pass-chip">
                {person.status === 'active' ? (
                  <span className="pickup-pass-status-active">● HỢP LỆ</span>
                ) : (
                  <span className="pickup-pass-status-paused">● TẠM DỪNG</span>
                )}
              </div>
            </div>

            {/* Student context banner */}
            <div className="pickup-pass-student-strip">
              <div className="pickup-pass-student-avatar">
                {student?.avatar?.startsWith('/') ? '👧' : student?.avatar || '👧'}
              </div>
              <div className="pickup-pass-student-details">
                <div className="pickup-pass-student-label">HỌC SINH ĐƯỢC ĐÓN:</div>
                <div className="pickup-pass-student-name">{student?.name || 'Huỳnh Ngọc Trúc Như'}</div>
                <div className="pickup-pass-student-meta">
                  <span>Lớp: {student?.className || '11A1'}</span>
                  <span> · </span>
                  <span>Mã: {student?.code || '9192930041'}</span>
                </div>
              </div>
            </div>

            {/* High-contrast QR Container */}
            <div className="pickup-pass-qr-frame">
              {person.status === 'active' ? (
                <div className="pickup-pass-qr-wrapper">
                  {/* Clean SVG QR Pattern */}
                  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" className="pickup-pass-qr-svg">
                    <rect width="180" height="180" rx="12" fill="#FFFFFF" />
                    {/* Corner 1: Top-Left finder */}
                    <rect x="16" y="16" width="44" height="44" rx="6" stroke="#000000" strokeWidth="8" fill="none" />
                    <rect x="28" y="28" width="20" height="20" rx="3" fill="#000000" />
                    {/* Corner 2: Top-Right finder */}
                    <rect x="120" y="16" width="44" height="44" rx="6" stroke="#000000" strokeWidth="8" fill="none" />
                    <rect x="132" y="28" width="20" height="20" rx="3" fill="#000000" />
                    {/* Corner 3: Bottom-Left finder */}
                    <rect x="16" y="120" width="44" height="44" rx="6" stroke="#000000" strokeWidth="8" fill="none" />
                    <rect x="28" y="132" width="20" height="20" rx="3" fill="#000000" />
                    {/* Decorative barcode/QR blocks */}
                    <rect x="70" y="18" width="10" height="10" fill="#000000" />
                    <rect x="90" y="18" width="16" height="10" fill="#000000" />
                    <rect x="70" y="38" width="18" height="12" fill="#000000" />
                    <rect x="96" y="36" width="10" height="16" fill="#000000" />
                    <rect x="74" y="60" width="14" height="14" fill="#000000" />
                    <rect x="20" y="72" width="12" height="10" fill="#000000" />
                    <rect x="42" y="72" width="16" height="12" fill="#000000" />
                    <rect x="120" y="72" width="14" height="14" fill="#000000" />
                    <rect x="144" y="74" width="18" height="10" fill="#000000" />
                    {/* Center security seal */}
                    <rect x="75" y="75" width="30" height="30" rx="8" fill="#111827" />
                    <path d="M85 90l3 4 8-8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Lower dots */}
                    <rect x="20" y="96" width="14" height="12" fill="#000000" />
                    <rect x="44" y="96" width="12" height="14" fill="#000000" />
                    <rect x="70" y="116" width="18" height="12" fill="#000000" />
                    <rect x="96" y="114" width="12" height="16" fill="#000000" />
                    <rect x="120" y="100" width="16" height="10" fill="#000000" />
                    <rect x="144" y="96" width="18" height="16" fill="#000000" />
                    <rect x="74" y="138" width="14" height="14" fill="#000000" />
                    <rect x="98" y="140" width="16" height="12" fill="#000000" />
                    <rect x="124" y="126" width="12" height="18" fill="#000000" />
                    <rect x="146" y="132" width="16" height="16" fill="#000000" />
                  </svg>
                  <div className="pickup-pass-scan-line" />
                </div>
              ) : (
                <div className="pickup-pass-paused-box">
                  <div className="pickup-pass-paused-icon">⚠️</div>
                  <div className="pickup-pass-paused-title">Thẻ tạm thời bị tạm dừng</div>
                  <div className="pickup-pass-paused-text">
                    Người liên kết chính đã tạm dừng quyền đón của người này. Bật lại quyền đón để kích hoạt mã QR.
                  </div>
                </div>
              )}
              <div className="pickup-pass-qr-caption">
                {person.status === 'active' ? (
                  <span>Mã QR tự động cập nhật · {qrSessionTime}</span>
                ) : (
                  <span>Trạng thái: Tạm dừng ủy quyền</span>
                )}
              </div>
            </div>

            {/* Authorized Person Information Card */}
            <div className="pickup-pass-person-card">
              <div className="pickup-pass-person-avatar">
                <span className="pickup-pass-avatar-emoji">{person.avatarUrl}</span>
              </div>
              <div className="pickup-pass-person-info">
                <div className="pickup-pass-person-role-tag">
                  {person.role === 'main_connector'
                    ? 'NGƯỜI LIÊN KẾT CHÍNH'
                    : person.authorizedType === 'sub_connector'
                      ? 'NGƯỜI LIÊN KẾT PHỤ'
                      : 'NGƯỜI ĐƯỢC THÊM MỚI'}
                </div>
                <div className="pickup-pass-person-name">{person.fullName}</div>
                <div className="pickup-pass-person-meta">
                  <span className="pickup-pass-relation-pill">{person.relationship}</span>
                  <span className="pickup-pass-phone">{formatPhoneNumber(person.phoneNumber)}</span>
                </div>
                <div className="pickup-pass-cccd-line">
                  CCCD: <strong>{maskNationalId(person.nationalId)}</strong>
                </div>
              </div>
            </div>

            {/* Gate Security Notice */}
            <div className="pickup-pass-footer-notice">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Xuất trình thẻ này tại cổng trường để giáo viên hoặc bảo vệ đối chiếu trước khi đón bé.</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pickup-pass-actions">
            <button
              type="button"
              className="pickup-pass-btn-share"
              onClick={handleCopyLink}
            >
              {copied ? '✓ Đã sao chép liên kết thẻ' : 'Chia sẻ thẻ đón trẻ'}
            </button>
            <button
              type="button"
              className="pickup-pass-btn-close"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
