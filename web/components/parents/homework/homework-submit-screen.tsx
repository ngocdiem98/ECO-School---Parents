'use client'

import { useRef } from 'react'

export function HomeworkSubmitScreen({
  files,
  isEdit,
  onBack,
  onAddFiles,
  onRemoveFile,
  onSubmit,
}: {
  files: string[]
  isEdit: boolean
  onBack: () => void
  onAddFiles: (fileList: FileList | null) => void
  onRemoveFile: (index: number) => void
  onSubmit: () => void
}) {
  const libraryInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="hw-screen-root">
      {/* 1. Top Bar */}
      <header className="hw-topbar">
        <button type="button" className="hw-back-btn" onClick={onBack} aria-label="Quay lại">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="hw-topbar-title">Nội dung bài nộp</h1>
        <div className="hw-topbar-ghost" />
      </header>

      {/* 2. Scrollable Body with Doodle Graph Paper Background */}
      <div className="hw-scroll-body" style={{ paddingBottom: 160 }}>
        <div className="hw-card" style={{ padding: 16, cursor: 'default' }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: '#181D27', marginBottom: 12 }}>
            Tài liệu đính kèm
          </div>

          <div className="hw-thumb-list">
            {files.map((file, idx) => (
              <div key={idx} className="hw-thumb-tile" style={{ width: 90, height: 90 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file || '/homework/sample-sub.png'}
                  alt={`Tệp ${idx + 1}`}
                  className="hw-thumb-img"
                />
                <button
                  type="button"
                  className="hw-thumb-del-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveFile(idx)
                  }}
                  aria-label="Xoá tệp"
                >
                  ✕
                </button>
              </div>
            ))}

            {files.length === 0 && (
              <div style={{ color: '#9CA3AF', fontSize: 13, padding: '12px 0' }}>
                Chưa có tệp nào được chọn
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Sticky Control Bar */}
      <div className="hw-submit-bottom-bar">
        <div className="hw-submit-count-label">Đã chọn ({files.length}) tệp</div>

        <div className="hw-submit-pill-btns">
          {/* Thư viện */}
          <button
            type="button"
            className="hw-submit-pill-btn"
            onClick={() => libraryInputRef.current?.click()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Thư viện</span>
            <input
              ref={libraryInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                onAddFiles(e.target.files)
                e.target.value = ''
              }}
            />
          </button>

          {/* Tài liệu */}
          <button
            type="button"
            className="hw-submit-pill-btn"
            onClick={() => docInputRef.current?.click()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Tài liệu</span>
            <input
              ref={docInputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                onAddFiles(e.target.files)
                e.target.value = ''
              }}
            />
          </button>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          disabled={files.length === 0}
          className="hw-btn-primary-yellow"
          onClick={onSubmit}
        >
          {isEdit ? 'Cập nhật bài nộp' : 'Gửi bài tập'}
        </button>
      </div>
    </div>
  )
}
