'use client'

import React, { useState } from 'react'
import {
  PickupPerson,
  MAX_AUXILIARY_PICKUP,
  maskNationalId,
  formatPhoneNumber,
} from './pickup-data'
import { getStudent, MOCK_STUDENTS } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'

interface PickupMainScreenProps {
  studentId: string
  persons: PickupPerson[]
  onBack: () => void
  onSelectStudent?: (id: string) => void
  onAddClick: () => void
  onEditClick: (person: PickupPerson) => void
  onDeleteClick: (person: PickupPerson) => void
  onToggleStatus: (person: PickupPerson) => void
  onViewQR: (person: PickupPerson) => void
}

export function PickupMainScreen({
  studentId,
  persons,
  onBack,
  onSelectStudent,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onToggleStatus,
  onViewQR,
}: PickupMainScreenProps) {
  const [showStudentPicker, setShowStudentPicker] = useState(false)
  const student = getStudent(studentId)
  const avatarSrc = student?.avatar?.startsWith('/') ? student.avatar : '/absence/student-avatar.png'

  // Separate Slot 0 (Main Connector) and auxiliary persons
  const mainConnector = persons.find((p) => p.role === 'main_connector')
  const auxiliaryPersons = persons.filter((p) => p.role === 'auxiliary')
  const activeAuxCount = auxiliaryPersons.filter((p) => p.status === 'active').length
  const canAddMore = activeAuxCount < MAX_AUXILIARY_PICKUP

  return (
    <div className="pickup-main-screen">
      {/* Standard Top Header Bar */}
      <div className="topbar absence-topbar">
        <button
          type="button"
          className="icon-btn"
          onClick={onBack}
          aria-label="Quay lại"
        >
          ‹
        </button>
        <div className="topbar-title">Người đón trẻ</div>
        <span className="icon-btn-ghost" />
      </div>

      {/* Standard Student Profile Card with '⇄ Đổi' Button */}
      <div className="absence-student-header-card">
        <div
          className="absence-student-header-main"
          onClick={() => onSelectStudent && setShowStudentPicker(true)}
          role="button"
          tabIndex={0}
          aria-label="Đổi học sinh"
        >
          <img
            src={avatarSrc}
            alt={student?.name || 'Học sinh'}
            className="absence-student-avatar-img"
          />
          <div className="absence-student-info-col">
            <div className="absence-student-name">{student?.name || 'Học sinh'}</div>
            <div className="absence-student-code">{student?.code}</div>
            <div className="absence-student-meta">{student?.className}</div>
            <div className="absence-student-meta">{student?.school}</div>
          </div>
        </div>
        {onSelectStudent && (
          <button
            type="button"
            className="btn-change absence-btn-change"
            onClick={() => setShowStudentPicker(true)}
            aria-label="Đổi học sinh"
          >
            ⇄ Đổi
          </button>
        )}
      </div>

      <div className="pickup-main-scroll">
        {/* Quota Summary Banner (simplified: only shows number of active authorized pickup persons) */}
        <div className="pickup-quota-banner">
          <div className="pickup-quota-header" style={{ marginBottom: 8 }}>
            <div className="pickup-quota-title-row">
              <span className="pickup-quota-icon">🛡️</span>
              <span className="pickup-quota-title">Số người ủy quyền đón trẻ</span>
            </div>
            <div className="pickup-quota-badge">
              <strong>{activeAuxCount}</strong> / {MAX_AUXILIARY_PICKUP} người
            </div>
          </div>
          <div className="pickup-quota-progress-track" style={{ marginBottom: 0 }}>
            <div
              className="pickup-quota-progress-bar"
              style={{ width: `${Math.min(100, (activeAuxCount / MAX_AUXILIARY_PICKUP) * 100)}%` }}
            />
          </div>
        </div>

        {/* Section 1: Main Connector (Slot 0) */}
        <div className="pickup-section">
          <div className="pickup-section-title">
            <span>Người liên kết chính</span>
            <span className="pickup-main-tag">Mặc định</span>
          </div>

          {mainConnector ? (
            <div className="pickup-card is-main">
              <div className="pickup-card-top">
                <div className="pickup-card-avatar-wrap">
                  <span className="pickup-card-avatar">{mainConnector.avatarUrl}</span>
                </div>
                <div className="pickup-card-info">
                  <div className="pickup-card-name-row">
                    <span className="pickup-card-name">{mainConnector.fullName}</span>
                    <span className="pickup-badge-main">Người liên kết chính</span>
                  </div>
                  <div className="pickup-card-relation-row">
                    <span className="pickup-relation-tag">{mainConnector.relationship}</span>
                    <span className="pickup-card-phone">{formatPhoneNumber(mainConnector.phoneNumber)}</span>
                  </div>
                  <div className="pickup-card-id-row">
                    CCCD: <strong>{maskNationalId(mainConnector.nationalId)}</strong>
                  </div>
                </div>
              </div>

              <div className="pickup-card-divider" />

              <div className="pickup-card-footer">
                <div className="pickup-card-status">
                  <span className="pickup-status-dot active" />
                  <span className="pickup-status-text active">Đang hoạt động (Toàn quyền)</span>
                </div>
                <button
                  type="button"
                  className="pickup-btn-qr"
                  onClick={() => onViewQR(mainConnector)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  <span>Thẻ đón bé</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Section 2: Authorized Pickup Persons */}
        <div className="pickup-section">
          <div className="pickup-section-title">
            <span>Người được ủy quyền đón trẻ</span>
            <span className="pickup-count-tag">{activeAuxCount}/{MAX_AUXILIARY_PICKUP} đang hoạt động</span>
          </div>

          {auxiliaryPersons.length === 0 ? (
            <div className="pickup-empty-card">
              <div className="pickup-empty-icon">👥</div>
              <div className="pickup-empty-title">Chưa có người được ủy quyền đón trẻ</div>
              <div className="pickup-empty-desc">
                Bạn có thể bật quyền cho người liên kết phụ hoặc thêm mới người đón trẻ (tối đa 2 người hoạt động cùng lúc).
              </div>
            </div>
          ) : (
            <div className="pickup-list">
              {auxiliaryPersons.map((person) => {
                const isActive = person.status === 'active'
                const isSubConnector = person.authorizedType === 'sub_connector'
                return (
                  <div key={person.id} className={`pickup-card ${!isActive ? 'is-paused' : ''}`}>
                    <div className="pickup-card-top">
                      <div className="pickup-card-avatar-wrap">
                        <span className="pickup-card-avatar">{person.avatarUrl}</span>
                      </div>
                      <div className="pickup-card-info">
                        <div className="pickup-card-name-row">
                          <span className="pickup-card-name">{person.fullName}</span>
                          <span className={`pickup-status-pill ${isActive ? 'active' : 'paused'}`}>
                            {isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                          </span>
                        </div>
                        <div className="pickup-card-auth-case-row">
                          <span
                            className={`pickup-auth-type-tag ${
                              isSubConnector ? 'sub-connector' : 'added-new'
                            }`}
                          >
                            {isSubConnector ? 'Người liên kết phụ' : 'Người được thêm mới'}
                          </span>
                        </div>
                        <div className="pickup-card-relation-row">
                          <span className="pickup-relation-tag">{person.relationship}</span>
                          <span className="pickup-card-phone">{formatPhoneNumber(person.phoneNumber)}</span>
                        </div>
                        <div className="pickup-card-id-row">
                          CCCD: <strong>{maskNationalId(person.nationalId)}</strong>
                        </div>
                        {person.note && (
                          <div className="pickup-card-note">
                            <span className="pickup-note-label">Ghi chú:</span> {person.note}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pickup-card-divider" />

                    <div className="pickup-card-footer">
                      {/* Toggle Active / Paused switch */}
                      <div className="pickup-card-toggle-group">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isActive}
                          className={`eco-switch ${isActive ? 'active' : ''}`}
                          onClick={() => onToggleStatus(person)}
                          aria-label={`Trạng thái đón của ${person.fullName}`}
                        >
                          <span className="eco-switch-thumb" />
                        </button>
                        <span className="pickup-toggle-label">
                          {isActive ? 'Được phép đón' : 'Tạm dừng đón'}
                        </span>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pickup-card-actions">
                        <button
                          type="button"
                          className="pickup-btn-qr"
                          onClick={() => onViewQR(person)}
                          title="Xem mã thẻ đón"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                          </svg>
                          <span>Thẻ đón</span>
                        </button>

                        <button
                          type="button"
                          className="pickup-btn-edit"
                          onClick={() => onEditClick(person)}
                          aria-label="Chỉnh sửa"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </button>

                        {!isSubConnector && (
                          <button
                            type="button"
                            className="pickup-btn-delete"
                            onClick={() => onDeleteClick(person)}
                            aria-label="Hủy ủy quyền"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Section 3: Add More Button (Disabled when 2 active, Enabled when < 2 active) */}
        <div className="pickup-section">
          <button
            type="button"
            className={`pickup-add-card-btn ${!canAddMore ? 'is-disabled' : ''}`}
            disabled={!canAddMore}
            onClick={() => {
              if (canAddMore) onAddClick()
            }}
          >
            <div className="pickup-add-icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div className="pickup-add-text-wrap">
              <div className="pickup-add-title">Thêm người đón trẻ</div>
              <div className="pickup-add-sub">
                {canAddMore
                  ? `Còn ${MAX_AUXILIARY_PICKUP - activeAuxCount} lượt ủy quyền đón trẻ cho bé ${student?.name}`
                  : `Đã đủ ${MAX_AUXILIARY_PICKUP}/${MAX_AUXILIARY_PICKUP} người đón trẻ đang hoạt động (Tắt bớt quyền đón để thêm mới)`}
              </div>
            </div>
            <div className="pickup-add-chevron">›</div>
          </button>
        </div>

        <div style={{ height: 32 }} />
      </div>

      {showStudentPicker && onSelectStudent && (
        <StudentPickerSheet
          students={MOCK_STUDENTS}
          selectedStudentId={studentId}
          onSelect={(st) => {
            onSelectStudent(st.id)
            setShowStudentPicker(false)
          }}
          onClose={() => setShowStudentPicker(false)}
        />
      )}
    </div>
  )
}
