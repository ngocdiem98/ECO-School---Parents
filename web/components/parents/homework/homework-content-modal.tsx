'use client'

import { useEffect } from 'react'

interface HomeworkContentModalProps {
  isOpen: boolean
  title: string
  content: string
  onClose: () => void
}

export function HomeworkContentModal({
  isOpen,
  title,
  content,
  onClose,
}: HomeworkContentModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="hw-dialog-overlay" onClick={onClose}>
      <div
        className="hw-dialog-box"
        style={{ maxWidth: 360, textAlign: 'left', maxHeight: '80vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 className="hw-dialog-title" style={{ margin: 0, fontSize: 16 }}>
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
              color: '#6B7280',
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {content || 'Chưa có thông tin chi tiết.'}
        </div>
        <button
          type="button"
          className="hw-dialog-btn"
          style={{ marginTop: 20 }}
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  )
}
