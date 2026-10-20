'use client'

import { useState, useEffect } from 'react'
import { saveSurveySubmission, type SurveySubmission } from '@/lib/survey-storage'

interface SurveyScreenProps {
  onBack: () => void
  onSuccess: () => void
}

export function SurveyScreen({ onBack, onSuccess }: SurveyScreenProps) {
  const [satisfactionScore, setSatisfactionScore] = useState<number | null>(null)
  const [satisfactionNote, setSatisfactionNote] = useState('')
  const [recommendScore, setRecommendScore] = useState<number | null>(null)
  const [recommendNote, setRecommendNote] = useState('')
  const [suggestionsNote, setSuggestionsNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const isValid = satisfactionScore !== null && recommendScore !== null

  const handleSubmit = () => {
    if (!isValid || submitting) return
    setSubmitting(true)

    // Save submission to storage
    saveSurveySubmission({
      satisfactionScore,
      satisfactionNote,
      recommendScore,
      recommendNote,
      suggestionsNote,
    })

    setTimeout(() => {
      setSubmitting(false)
      setShowToast(true)
    }, 600)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('toast') === '1') {
        setSatisfactionScore(9)
        setRecommendScore(10)
        setShowToast(true)
      }
    }
  }, [])

  useEffect(() => {
    if (showToast) {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
      if (params?.get('toast') === '1') return // Keep toast visible for screenshots
      const timer = setTimeout(() => {
        onSuccess()
      }, 2400)
      return () => clearTimeout(timer)
    }
  }, [showToast, onSuccess])

  const renderScoreRow = (value: number | null, onChange: (val: number) => void) => (
    <div className="eco-survey-score-row">
      {Array.from({ length: 11 }, (_, i) => i).map((num) => {
        const isSelected = value === num
        return (
          <button
            key={num}
            type="button"
            className={`eco-survey-score-btn ${isSelected ? 'selected' : ''}`}
            onClick={() => onChange(num)}
            aria-label={`Điểm ${num}`}
          >
            {num}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="screen eco-survey-screen">
      {/* 1. ECO.NavBar */}
      <div
        className="eco-navbar"
        style={{
          background: 'var(--bg-surface, #ffffff)',
          borderBottom: '1px solid var(--border-subtle, #f0f0f0)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div className="eco-navbar__side">
          <button
            type="button"
            className="eco-iconbtn eco-iconbtn--md eco-iconbtn--ghost"
            onClick={onBack}
            aria-label="Quay lại"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" />
            </svg>
          </button>
        </div>
        <div className="eco-navbar__title">Khảo sát ý kiến</div>
        <div className="eco-navbar__side eco-navbar__side--right" />
      </div>

      {/* Scrollable content body */}
      <div className="eco-survey-scroll-body">
        {/* Intro Banner */}
        <div className="eco-survey-intro-card">
          <p className="eco-survey-intro-text">
            Ý kiến của bạn giúp chúng tôi cải thiện ECO School mỗi ngày. Vui lòng dành ít phút trả lời các câu hỏi ngắn dưới đây.
          </p>
        </div>

        {/* Question 1: Satisfaction */}
        <div className="eco-survey-question-card">
          <div className="eco-survey-q-head">
            <span className="eco-survey-q-badge">1</span>
            <p className="eco-survey-q-title">
              Bạn hãy đánh giá mức độ hài lòng của mình khi sử dụng ECO School:
            </p>
          </div>
          <div className="eco-survey-scale-labels">
            <span>Rất không hài lòng</span>
            <span>Rất hài lòng</span>
          </div>
          {renderScoreRow(satisfactionScore, setSatisfactionScore)}
          {satisfactionScore !== null && (
            <div className="eco-survey-selected-display">
              Bạn đã chọn: <span className="font-bold">{satisfactionScore}/10</span>
            </div>
          )}

          <div className="eco-survey-note-field">
            <label className="eco-survey-note-label">
              Chia sẻ thêm ý kiến <span className="eco-survey-optional">(không bắt buộc)</span>
            </label>
            <div className="eco-survey-textarea-wrap">
              <textarea
                value={satisfactionNote}
                onChange={(e) => setSatisfactionNote(e.target.value.slice(0, 255))}
                placeholder="Nhập ý kiến của bạn..."
                rows={2}
                className="eco-survey-textarea"
              />
              <span className="eco-survey-char-count">{satisfactionNote.length}/255</span>
            </div>
          </div>
        </div>

        {/* Question 2: NPS Recommendation */}
        <div className="eco-survey-question-card">
          <div className="eco-survey-q-head">
            <span className="eco-survey-q-badge">2</span>
            <p className="eco-survey-q-title">
              Bạn có sẵn sàng giới thiệu ECO School cho những phụ huynh khác không?
            </p>
          </div>
          <div className="eco-survey-scale-labels">
            <span>Không bao giờ</span>
            <span>Chắc chắn giới thiệu</span>
          </div>
          {renderScoreRow(recommendScore, setRecommendScore)}
          {recommendScore !== null && (
            <div className="eco-survey-selected-display">
              Bạn đã chọn: <span className="font-bold">{recommendScore}/10</span>
            </div>
          )}

          <div className="eco-survey-note-field">
            <label className="eco-survey-note-label">
              Chia sẻ thêm ý kiến <span className="eco-survey-optional">(không bắt buộc)</span>
            </label>
            <div className="eco-survey-textarea-wrap">
              <textarea
                value={recommendNote}
                onChange={(e) => setRecommendNote(e.target.value.slice(0, 255))}
                placeholder="Nhập ý kiến của bạn..."
                rows={2}
                className="eco-survey-textarea"
              />
              <span className="eco-survey-char-count">{recommendNote.length}/255</span>
            </div>
          </div>
        </div>

        {/* Question 3: Feature suggestions */}
        <div className="eco-survey-question-card">
          <div className="eco-survey-q-head">
            <span className="eco-survey-q-badge">3</span>
            <p className="eco-survey-q-title">
              Bạn hãy chia sẻ thêm những tính năng mới muốn có trên ECO School hoặc vấn đề gặp phải:
            </p>
          </div>
          <div className="eco-survey-note-field" style={{ marginTop: 0 }}>
            <label className="eco-survey-note-label">
              Ý kiến đóng góp <span className="eco-survey-optional">(không bắt buộc)</span>
            </label>
            <div className="eco-survey-textarea-wrap">
              <textarea
                value={suggestionsNote}
                onChange={(e) => setSuggestionsNote(e.target.value.slice(0, 255))}
                placeholder="Chia sẻ đề xuất hoặc phản hồi của bạn..."
                rows={3}
                className="eco-survey-textarea"
              />
              <span className="eco-survey-char-count">{suggestionsNote.length}/255</span>
            </div>
          </div>
        </div>
      </div>

      {/* ECO.ActionFooter Sticky Submit Button Bar */}
      <div
        className="eco-actionfooter"
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 25,
          paddingBottom: 'var(--space-16, 16px)',
        }}
      >
        <div className="eco-actionfooter__bar">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="eco-btn eco-btn--brand eco-btn--lg eco-btn--full"
          >
            {submitting ? 'Đang gửi...' : 'Gửi khảo sát'}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="eco-toast-notice">
          Gửi khảo sát thành công. Cảm ơn bạn đã dành thời gian chia sẻ ý kiến.
        </div>
      )}
    </div>
  )
}
