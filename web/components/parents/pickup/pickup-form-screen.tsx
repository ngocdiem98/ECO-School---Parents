'use client'

import React, { useState } from 'react'
import {
  PickupPerson,
  PickupRelationship,
  PICKUP_RELATIONSHIPS,
  PRESET_AVATARS,
} from './pickup-data'
import { getStudent } from '@/lib/mock-data'

interface PickupFormScreenProps {
  studentId: string
  initialData?: PickupPerson | null
  onSave: (person: PickupPerson) => void
  onCancel: () => void
}

export function PickupFormScreen({
  studentId,
  initialData,
  onSave,
  onCancel,
}: PickupFormScreenProps) {
  const isEditing = Boolean(initialData)
  const student = getStudent(studentId)

  // Form states
  const [fullName, setFullName] = useState(initialData?.fullName || '')
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || '')
  const [relationship, setRelationship] = useState<PickupRelationship>(
    initialData?.relationship || 'Bà'
  )
  const [nationalId, setNationalId] = useState(initialData?.nationalId || '')
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || '👵')
  const [note, setNote] = useState(initialData?.note || '')

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Validate form fields
  const validate = () => {
    const errs: Record<string, string> = {}

    // Full name
    if (!fullName.trim()) {
      errs.fullName = 'Vui lòng nhập họ và tên'
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Họ và tên tối thiểu 2 ký tự'
    }

    // Phone number: 10 digits starting with 0
    const cleanPhone = phoneNumber.replace(/\s+/g, '')
    if (!cleanPhone) {
      errs.phoneNumber = 'Vui lòng nhập số điện thoại'
    } else if (!/^0\d{9}$/.test(cleanPhone)) {
      errs.phoneNumber = 'Số điện thoại phải gồm 10 chữ số (bắt đầu bằng số 0)'
    }

    // National ID: 9 or 12 digits
    const cleanId = nationalId.replace(/\s+/g, '')
    if (!cleanId) {
      errs.nationalId = 'Vui lòng nhập số CCCD hoặc CMND'
    } else if (!/^\d{9}$|^\d{12}$/.test(cleanId)) {
      errs.nationalId = 'CCCD phải gồm 12 chữ số (hoặc CMND 9 chữ số)'
    }

    if (!relationship) {
      errs.relationship = 'Vui lòng chọn mối quan hệ với bé'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      fullName: true,
      phoneNumber: true,
      nationalId: true,
      relationship: true,
    })

    if (!validate()) return

    const now = new Date().toISOString()
    const cleanPhone = phoneNumber.replace(/\s+/g, '')
    const cleanId = nationalId.replace(/\s+/g, '')

    const personToSave: PickupPerson = {
      id: initialData?.id || `pickup_${studentId}_aux_${Date.now()}`,
      studentId,
      fullName: fullName.trim(),
      phoneNumber: cleanPhone,
      relationship,
      nationalId: cleanId,
      avatarUrl,
      role: 'auxiliary',
      authorizedType: initialData?.authorizedType || 'added_new',
      // Kích hoạt ngay lập tức theo quyết định sản phẩm
      status: initialData ? initialData.status : 'active',
      note: note.trim() || undefined,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    }

    onSave(personToSave)
  }

  return (
    <div className="pickup-form-screen">
      {/* Top sticky navigation bar */}
      <div className="topbar absence-topbar">
        <button
          type="button"
          className="icon-btn"
          onClick={onCancel}
          aria-label="Quay lại"
        >
          ‹
        </button>
        <div className="topbar-title">
          {isEditing ? 'Chỉnh sửa người đón trẻ' : 'Thêm người đón trẻ'}
        </div>
        <span className="icon-btn-ghost" />
      </div>

      <form className="pickup-form-body" onSubmit={handleSubmit}>
        {/* Student Target Summary Pill */}
        <div className="pickup-form-student-pill">
          <span className="pickup-form-student-icon">{student?.avatar?.startsWith('/') ? '👧' : student?.avatar || '👧'}</span>
          <span className="pickup-form-student-name">Ủy quyền đón học sinh: <strong>{student?.name || 'Bé'}</strong> ({student?.className || 'Lớp'})</span>
        </div>

        {/* Section 1: Portrait / Avatar Picker */}
        <div className="pickup-form-card">
          <div className="pickup-form-card-title">Ảnh chân dung / Nhận diện</div>
          <div className="pickup-avatar-selector-wrap">
            <div className="pickup-avatar-preview">
              <span className="pickup-avatar-large">{avatarUrl}</span>
            </div>
            <div className="pickup-avatar-options">
              <div className="pickup-avatar-options-label">Chọn hình tượng đại diện nhận diện:</div>
              <div className="pickup-avatar-grid">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    className={`pickup-avatar-chip ${avatarUrl === av.src ? 'selected' : ''}`}
                    onClick={() => setAvatarUrl(av.src)}
                  >
                    <span className="pickup-chip-icon">{av.src}</span>
                    <span className="pickup-chip-label">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="pickup-input-hint">
            Hình ảnh đại diện sẽ xuất hiện trên Thẻ đón bé để bảo vệ và giáo viên tại cổng trường đối chiếu.
          </div>
        </div>

        {/* Section 2: Personal KYC Info */}
        <div className="pickup-form-card">
          <div className="pickup-form-card-title">Thông tin định danh người đón trẻ</div>

          {/* Họ và tên */}
          <div className="pickup-form-field">
            <label className="pickup-label" htmlFor="pickup-fullname">
              Họ và tên <span className="pickup-req">*</span>
            </label>
            <input
              id="pickup-fullname"
              type="text"
              className={`pickup-input ${touched.fullName && errors.fullName ? 'error' : ''}`}
              placeholder="VD: Nguyễn Thị Mai"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                if (touched.fullName) validate()
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, fullName: true }))
                validate()
              }}
            />
            {touched.fullName && errors.fullName && (
              <div className="pickup-error-text">{errors.fullName}</div>
            )}
          </div>

          {/* Mối quan hệ */}
          <div className="pickup-form-field">
            <label className="pickup-label">
              Mối quan hệ với bé <span className="pickup-req">*</span>
            </label>
            <div className="pickup-relationship-grid">
              {PICKUP_RELATIONSHIPS.map((rel) => (
                <button
                  key={rel}
                  type="button"
                  className={`pickup-rel-btn ${relationship === rel ? 'selected' : ''}`}
                  onClick={() => {
                    setRelationship(rel)
                    // Auto switch avatar icon if appropriate
                    if (rel === 'Bà') setAvatarUrl('👵')
                    else if (rel === 'Ông') setAvatarUrl('👴')
                    else if (rel === 'Bố' || rel === 'Chú' || rel === 'Bác') setAvatarUrl('👨')
                    else if (rel === 'Mẹ' || rel === 'Cô' || rel === 'Dì') setAvatarUrl('👩')
                    else if (rel === 'Tài xế') setAvatarUrl('🚗')
                    else if (rel === 'Người giúp việc') setAvatarUrl('🧑‍🍳')
                  }}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="pickup-form-field">
            <label className="pickup-label" htmlFor="pickup-phone">
              Số điện thoại di động <span className="pickup-req">*</span>
            </label>
            <div className="pickup-input-group">
              <span className="pickup-input-prefix">VN +84</span>
              <input
                id="pickup-phone"
                type="tel"
                maxLength={10}
                className={`pickup-input has-prefix ${touched.phoneNumber && errors.phoneNumber ? 'error' : ''}`}
                placeholder="VD: 0912345678"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value)
                  if (touched.phoneNumber) validate()
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, phoneNumber: true }))
                  validate()
                }}
              />
            </div>
            {touched.phoneNumber && errors.phoneNumber && (
              <div className="pickup-error-text">{errors.phoneNumber}</div>
            )}
            <div className="pickup-input-hint">Nhà trường sẽ liên hệ số này trong trường hợp cần xác minh khẩn cấp.</div>
          </div>

          {/* CCCD / CMND */}
          <div className="pickup-form-field">
            <label className="pickup-label" htmlFor="pickup-nationalid">
              Số CCCD / CMND <span className="pickup-req">*</span>
            </label>
            <input
              id="pickup-nationalid"
              type="text"
              maxLength={12}
              className={`pickup-input ${touched.nationalId && errors.nationalId ? 'error' : ''}`}
              placeholder="12 chữ số CCCD gắn chip (hoặc 9 số CMND)"
              value={nationalId}
              onChange={(e) => {
                setNationalId(e.target.value.replace(/\D/g, ''))
                if (touched.nationalId) validate()
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, nationalId: true }))
                validate()
              }}
            />
            {touched.nationalId && errors.nationalId && (
              <div className="pickup-error-text">{errors.nationalId}</div>
            )}
            <div className="pickup-input-hint">Dùng đối chiếu danh tính trực tiếp tại cổng trường khi xuất trình thẻ.</div>
          </div>

          {/* Ghi chú đón trẻ */}
          <div className="pickup-form-field">
            <label className="pickup-label" htmlFor="pickup-note">
              Ghi chú lịch đón trẻ (Tùy chọn)
            </label>
            <textarea
              id="pickup-note"
              className="pickup-textarea"
              rows={2}
              maxLength={200}
              placeholder="VD: Đón bé vào buổi chiều thứ 3 và thứ 5 hàng tuần..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="pickup-char-count">{note.length}/200 ký tự</div>
          </div>
        </div>

        {/* Sticky Submit Button */}
        <div className="pickup-form-cta-bar">
          <button
            type="submit"
            className="pickup-btn-primary"
          >
            {isEditing ? 'Lưu cập nhật' : 'Xác nhận & Kích hoạt thẻ đón'}
          </button>
        </div>
      </form>
    </div>
  )
}
