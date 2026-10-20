'use client'

import React from 'react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import { PickupPerson } from './pickup-data'

interface PickupDeleteModalProps {
  person: PickupPerson
  onConfirm: () => void
  onCancel: () => void
}

export function PickupDeleteModal({ person, onConfirm, onCancel }: PickupDeleteModalProps) {
  return (
    <OverlayPortal>
      <div className="scrim" onClick={onCancel} />
      <div className="pickup-delete-modal">
        <div className="pickup-delete-icon-wrap">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>

        <div className="pickup-delete-title">Hủy ủy quyền đón trẻ?</div>
        
        <div className="pickup-delete-desc">
          Bạn có chắc chắn muốn hủy ủy quyền đón trẻ đối với{' '}
          <strong>{person.fullName}</strong> ({person.relationship})?
          <br />
          <span className="pickup-delete-warning">
            Người này sẽ không thể xuất trình thẻ đón bé tại cổng trường nữa. Bạn có thể thêm người đón trẻ khác sau khi hủy.
          </span>
        </div>

        <div className="pickup-delete-actions">
          <button
            type="button"
            className="pickup-delete-btn-cancel"
            onClick={onCancel}
          >
            Giữ lại
          </button>
          <button
            type="button"
            className="pickup-delete-btn-confirm"
            onClick={onConfirm}
          >
            Xác nhận hủy
          </button>
        </div>
      </div>
    </OverlayPortal>
  )
}
