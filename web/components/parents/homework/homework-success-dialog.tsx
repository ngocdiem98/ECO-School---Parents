'use client'

import { useEffect } from 'react'

interface HomeworkSuccessDialogProps {
  isOpen: boolean
  title?: string
  subtitle?: string
  ctaLabel?: string
  onConfirm: () => void
}

export function HomeworkSuccessDialog({
  isOpen,
  title = 'Nộp bài thành công',
  subtitle = 'Học sinh nộp bài thành công',
  ctaLabel = 'Đã hiểu',
  onConfirm,
}: HomeworkSuccessDialogProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        onConfirm()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onConfirm])

  if (!isOpen) return null

  return (
    <div className="hw-dialog-overlay" onClick={onConfirm}>
      <div className="hw-dialog-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="hw-dialog-title">{title}</h3>
        <p className="hw-dialog-subtitle">{subtitle}</p>
        <button type="button" className="hw-dialog-btn" onClick={onConfirm}>
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}
