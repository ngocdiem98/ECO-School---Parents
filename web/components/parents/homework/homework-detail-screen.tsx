'use client'

import { useState } from 'react'
import type { Homework } from '@/lib/mock-data'
import { HomeworkContentModal } from './homework-content-modal'

export function HomeworkDetailScreen({
  homework,
  onBack,
  onSubmitClick,
}: {
  homework: Homework
  onBack: () => void
  onSubmitClick: () => void
}) {
  const isDone = homework.status === 'submitted' || homework.status === 'graded'
  const isGraded = homework.status === 'graded'
  const isOverdue = homework.overdue && !isGraded

  const [activeModal, setActiveModal] = useState<{ title: string; content: string } | null>(null)

  return (
    <div className="hw-screen-root">
      {/* 1. Top Bar */}
      <header className="hw-topbar">
        <button type="button" className="hw-back-btn" onClick={onBack} aria-label="Quay lại">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="hw-topbar-title">Chi tiết bài tập</h1>
        <div className="hw-topbar-ghost" />
      </header>

      {/* 2. Scrollable Body */}
      <div className="hw-scroll-body" style={{ paddingBottom: isGraded ? 40 : 100 }}>
        {/* Overdue alert banner */}
        {isOverdue && (
          <div className="hw-alert-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#DC2626" style={{ flexShrink: 0 }}>
              <path d="M12 2L1 21h22L12 2zm0 3.5L20.2 19H3.8L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
            </svg>
            <span>Lưu ý: Bài tập đã quá hạn nộp bài</span>
          </div>
        )}

        {/* 3. Taped "Nhận xét của Giáo viên" Card */}
        <div className="hw-feedback-card-wrap">
          <div className="hw-feedback-ribbon">
            <span className="hw-feedback-tape-left" />
            <div className="hw-feedback-ribbon-yellow">Nhận xét của Giáo viên</div>
            <span className="hw-feedback-tape-right" />
          </div>

          <div className="hw-feedback-box">
            <div className="hw-feedback-row">
              <span>Môn: {homework.subject ? <strong style={{ color: '#181D27' }}>{homework.subject}</strong> : ''}</span>
              <span className={`hw-status-badge hw-status-badge--${homework.status}`}>
                {homework.status === 'notsubmitted' && 'Chưa nộp'}
                {homework.status === 'submitted' && 'Đã nộp'}
                {homework.status === 'graded' && 'Đã chấm'}
              </span>
            </div>

            <div className="hw-feedback-row" style={{ marginTop: 4 }}>
              <span>Giáo viên: <strong style={{ color: '#181D27' }}>{homework.teacher}</strong></span>
            </div>

            {/* Evaluation Grid */}
            <div className="hw-feedback-eval-grid">
              <div className="hw-eval-col-score">
                <span style={{ fontSize: 14, color: '#4B5563' }}>Điểm</span>
                {isGraded ? (
                  <span className="hw-eval-col-score-val">{homework.score ?? 9}</span>
                ) : (
                  <span className="hw-eval-col-score-val--empty">-</span>
                )}
              </div>

              <div className="hw-eval-divider-v" />

              <div className="hw-eval-col-comment">
                <span style={{ fontSize: 14, color: '#4B5563' }}>Nhận xét</span>
                <span className="hw-eval-col-comment-val">
                  {isGraded
                    ? homework.comment || 'Con làm bài rất tốt mà dù nộp trễ hạn.'
                    : 'Chưa có nhận xét'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Spiral Calendar Pad Card */}
        <div className="hw-calendar-wrap">
          {/* Blue Spiral Header with 8 clips */}
          <div className="hw-calendar-spiral-bar">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="hw-calendar-spiral-hole" />
            ))}
          </div>

          {/* Calendar Body */}
          <div className="hw-calendar-body">
            <div className="hw-calendar-meta-row">
              <span>Ngày giao</span>
              <span className="hw-calendar-meta-val">{homework.assignedDate}</span>
            </div>
            <div className="hw-calendar-meta-row">
              <span>Hạn nộp</span>
              <span className="hw-calendar-meta-val">
                {homework.dueDate.replace(' (Quá hạn)', '').replace(' | ', ' ')}
              </span>
            </div>

            <div className="hw-calendar-divider" />

            <div className="hw-calendar-title">{homework.title}</div>

            {/* Inner Box 1: Nội dung bài tập */}
            <div className="hw-white-card">
              <div className="hw-white-card-head">
                <span>Nội dung bài tập:</span>
                {homework.content && (
                  <button
                    type="button"
                    className="hw-btn-viewdetail"
                    onClick={() =>
                      setActiveModal({
                        title: 'Nội dung bài tập',
                        content: homework.content,
                      })
                    }
                  >
                    Xem chi tiết
                  </button>
                )}
              </div>

              {homework.content ? (
                <>
                  <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                    {homework.content}
                  </div>

                  {homework.attachedFiles && homework.attachedFiles.length > 0 && (
                    <>
                      <div className="hw-card-divider" />
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#181D27', marginBottom: 8 }}>
                        Tài liệu đính kèm:
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: homework.attachedFiles.some((s) => s.includes('doc-icon')) ? 'row' : 'column',
                          gap: 8,
                          alignItems: 'flex-start',
                        }}
                      >
                        {homework.attachedFiles.map((src, i) => (
                          src.includes('doc-icon') ? (
                            <div key={i} style={{ width: 32, height: 32, borderRadius: 999, overflow: 'hidden' }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt="Tài liệu" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                          ) : (
                            <div
                              key={i}
                              style={{
                                width: 124,
                                height: 42,
                                borderRadius: 6,
                                overflow: 'hidden',
                                border: '1px solid #E5E7EB',
                                background: '#FFFFFF',
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt="Tài liệu đính kèm" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="hw-empty-dashed-box">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/homework/empty-clipboard.png"
                    alt="Chưa có tài liệu"
                    style={{ width: 64, height: 52, objectFit: 'contain' }}
                  />
                  <div className="hw-empty-dashed-text">Chưa có tài liệu nào</div>
                </div>
              )}
            </div>

            {/* Inner Box 2: Nội dung bài nộp */}
            <div className="hw-white-card">
              <div className="hw-white-card-head">
                <span>Nội dung bài nộp:</span>
                {isDone && (
                  <button
                    type="button"
                    className="hw-btn-viewdetail"
                    onClick={() =>
                      setActiveModal({
                        title: 'Nội dung bài nộp',
                        content: `Thời gian nộp: ${homework.submittedAt || '14:34 18/10/2026'}\nĐã đính kèm ${homework.submissionFiles.length || 1} tệp.`,
                      })
                    }
                  >
                    Xem chi tiết
                  </button>
                )}
              </div>

              {isDone ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                    <span style={{ color: '#6B7280' }}>Thời gian nộp</span>
                    <span style={{ color: homework.submittedAt?.includes('trễ') ? '#DC2626' : '#181D27', fontWeight: 700 }}>
                      {homework.submittedAt || '14:34 18/10/2026 (Nộp trễ)'}
                    </span>
                  </div>

                  <div style={{ fontSize: 14, fontWeight: 700, color: '#181D27', marginBottom: 8 }}>
                    Tài liệu đính kèm:
                  </div>

                  <div className="hw-thumb-list">
                    {(homework.submissionFiles.length > 0
                      ? homework.submissionFiles
                      : ['/homework/sample-sub.png']
                    ).map((file, i) => (
                      <div key={i} className="hw-thumb-tile">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={file || '/homework/sample-sub.png'}
                          alt="Bài nộp"
                          className="hw-thumb-img"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="hw-empty-dashed-box">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/homework/empty-clipboard.png"
                    alt="Chưa có tài liệu"
                    style={{ width: 64, height: 52, objectFit: 'contain' }}
                  />
                  <div className="hw-empty-dashed-text">Chưa có tài liệu nào</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Sticky Bottom Action CTA */}
      {!isGraded && (
        <div className="hw-bottom-cta">
          <button type="button" className="hw-btn-primary-yellow" onClick={onSubmitClick}>
            {homework.status === 'submitted' ? 'Chỉnh sửa bài nộp' : 'Nộp bài tập'}
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {activeModal && (
        <HomeworkContentModal
          isOpen={true}
          title={activeModal.title}
          content={activeModal.content}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  )
}
