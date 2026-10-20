'use client'

import React, { useState, useEffect } from 'react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import {
  PickupPerson,
  loadPickupData,
  savePickupData,
  MAX_AUXILIARY_PICKUP,
} from './pickup-data'
import { PickupMainScreen } from './pickup-main-screen'
import { PickupFormScreen } from './pickup-form-screen'
import { PickupQRModal } from './pickup-qr-modal'
import { PickupDeleteModal } from './pickup-delete-modal'

interface PickupAppProps {
  studentId: string
  onBack: () => void
  onSelectStudent?: (id: string) => void
}

type PickupView = 'list' | 'create' | 'edit'

export function PickupApp({ studentId, onBack, onSelectStudent }: PickupAppProps) {
  const [view, setView] = useState<PickupView>('list')
  const [persons, setPersons] = useState<PickupPerson[]>([])
  const [editingPerson, setEditingPerson] = useState<PickupPerson | null>(null)
  const [deletingPerson, setDeletingPerson] = useState<PickupPerson | null>(null)
  const [qrPerson, setQrPerson] = useState<PickupPerson | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Load initial data for active student
  useEffect(() => {
    const data = loadPickupData(studentId)
    setPersons(data)
  }, [studentId])

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur))
    }, 2800)
  }

  // Toggle active / paused status
  const handleToggleStatus = (person: PickupPerson) => {
    const nextStatus = person.status === 'active' ? 'paused' : 'active'
    if (nextStatus === 'active') {
      const activeAuxCount = persons.filter(
        (p) => p.role === 'auxiliary' && p.status === 'active'
      ).length
      if (activeAuxCount >= MAX_AUXILIARY_PICKUP) {
        triggerToast('Đã đủ 2 người đón trẻ đang hoạt động! Vui lòng tắt bớt 1 người trước.')
        return
      }
    }
    const updated = persons.map((p) =>
      p.id === person.id
        ? { ...p, status: nextStatus as 'active' | 'paused', updatedAt: new Date().toISOString() }
        : p
    )
    setPersons(updated)
    savePickupData(studentId, updated)
    triggerToast(
      nextStatus === 'active'
        ? `Đã bật quyền đón trẻ cho ${person.fullName}`
        : `Đã tạm dừng quyền đón trẻ của ${person.fullName}`
    )
  }

  // Save creation or editing
  const handleSave = (savedPerson: PickupPerson) => {
    const exists = persons.some((p) => p.id === savedPerson.id)
    let nextList: PickupPerson[]

    if (exists) {
      nextList = persons.map((p) => (p.id === savedPerson.id ? savedPerson : p))
      triggerToast(`Đã cập nhật thông tin người đón trẻ: ${savedPerson.fullName}`)
    } else {
      // Check active quota safety
      const activeAuxCount = persons.filter(
        (p) => p.role === 'auxiliary' && p.status === 'active'
      ).length
      if (activeAuxCount >= MAX_AUXILIARY_PICKUP) {
        triggerToast('Đã đạt giới hạn tối đa 2 người đón trẻ đang hoạt động!')
        return
      }
      nextList = [...persons, savedPerson]
      triggerToast(`Đã thêm thành công người đón trẻ: ${savedPerson.fullName}`)
    }

    setPersons(nextList)
    savePickupData(studentId, nextList)
    setEditingPerson(null)
    setView('list')
  }

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deletingPerson) return
    const name = deletingPerson.fullName
    const nextList = persons.filter((p) => p.id !== deletingPerson.id)
    setPersons(nextList)
    savePickupData(studentId, nextList)
    setDeletingPerson(null)
    triggerToast(`Đã hủy ủy quyền đón trẻ đối với ${name}`)
  }

  return (
    <div className="pickup-app-container">
      {/* Views routing */}
      {view === 'list' && (
        <PickupMainScreen
          studentId={studentId}
          persons={persons}
          onBack={onBack}
          onSelectStudent={onSelectStudent}
          onAddClick={() => {
            setEditingPerson(null)
            setView('create')
          }}
          onEditClick={(person) => {
            setEditingPerson(person)
            setView('edit')
          }}
          onDeleteClick={(person) => setDeletingPerson(person)}
          onToggleStatus={handleToggleStatus}
          onViewQR={(person) => setQrPerson(person)}
        />
      )}

      {view === 'create' && (
        <PickupFormScreen
          studentId={studentId}
          initialData={null}
          onSave={handleSave}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'edit' && (
        <PickupFormScreen
          studentId={studentId}
          initialData={editingPerson}
          onSave={handleSave}
          onCancel={() => {
            setEditingPerson(null)
            setView('list')}
          }
        />
      )}

      {/* QR Pass Modal */}
      {qrPerson && (
        <PickupQRModal
          person={qrPerson}
          onClose={() => setQrPerson(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingPerson && (
        <PickupDeleteModal
          person={deletingPerson}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingPerson(null)}
        />
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <OverlayPortal>
          <div className="eco-toast-notice">
            <div className="eco-toast-dot" />
            <div className="eco-toast-text">{toastMessage}</div>
          </div>
        </OverlayPortal>
      )}
    </div>
  )
}

export * from './pickup-data'
export { PickupMainScreen } from './pickup-main-screen'
export { PickupFormScreen } from './pickup-form-screen'
export { PickupQRModal } from './pickup-qr-modal'
export { PickupDeleteModal } from './pickup-delete-modal'
