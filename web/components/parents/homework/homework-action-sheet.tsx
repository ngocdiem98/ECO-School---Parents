'use client'

import { useEffect } from 'react'

interface HomeworkActionSheetProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: 'library' | 'camera' | 'document') => void
}

export function HomeworkActionSheet({ isOpen, onClose, onSelect }: HomeworkActionSheetProps) {
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
    <div className="hw-sheet-overlay" onClick={onClose}>
      <div className="hw-sheet-content" onClick={(e) => e.stopPropagation()}>
        <div className="hw-sheet-handle" />

        {/* 1. Thư viện */}
        <button
          type="button"
          className="hw-sheet-item"
          onClick={() => {
            onSelect('library')
          }}
        >
          <svg className="hw-sheet-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>Thư viện</span>
        </button>

        {/* 2. Chụp ảnh mới */}
        <button
          type="button"
          className="hw-sheet-item"
          onClick={() => {
            onSelect('camera')
          }}
        >
          <svg className="hw-sheet-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span>Chụp ảnh mới</span>
        </button>

        {/* 3. Tài liệu */}
        <button
          type="button"
          className="hw-sheet-item"
          onClick={() => {
            onSelect('document')
          }}
        >
          <svg className="hw-sheet-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span>Tài liệu</span>
        </button>
      </div>
    </div>
  )
}
