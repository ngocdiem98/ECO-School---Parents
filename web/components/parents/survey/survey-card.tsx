'use client'

import { type SurveySubmission } from '@/lib/survey-storage'

interface SurveyCardProps {
  isEligible: boolean
  lastSubmission: SurveySubmission | null
  onOpenSurvey: () => void
}

export function SurveyCard({
  isEligible,
  lastSubmission,
  onOpenSurvey,
}: SurveyCardProps) {
  if (!isEligible) return null

  const hasSubmitted = !!lastSubmission

  return (
    <div className="eco-survey-card-wrapper" style={{ margin: 0 }}>
      <div className="eco-sechead" style={{ marginBottom: 'var(--space-12, 12px)' }}>
        <h3>Khảo sát &amp; Đóng góp</h3>
      </div>

      <div
        onClick={onOpenSurvey}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpenSurvey()
          }
        }}
        style={{
          background: hasSubmitted ? '#F6FEF9' : 'var(--bg-surface, #ffffff)',
          border: hasSubmitted
            ? '1px solid #ABEFC6'
            : '1px solid var(--border-subtle, #f0f0f0)',
          borderRadius: 'var(--radius-lg, 16px)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <span
            className={`eco-tile__icon eco-tile__icon--${hasSubmitted ? 'green' : 'blue'}`}
            style={{ width: 42, height: 42, borderRadius: 14, flexShrink: 0, color: '#ffffff' }}
          >
            {hasSubmitted ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M8 12.5L10.5 15L16 9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 5H7C5.34315 5 4 6.34315 4 8V18C4 19.6569 5.34315 21 7 21H17C18.6569 21 20 19.6569 20 18V8C20 6.34315 18.6569 5 17 5H15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <rect
                  x="9"
                  y="3"
                  width="6"
                  height="4"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M8.5 11.5L10 13L13 10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 16.5H15.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: 'var(--text-body-s)', fontWeight: 700, color: 'var(--text-primary, #232628)' }}>
              {hasSubmitted ? 'Đã ghi nhận đánh giá của bạn' : 'Đánh giá trải nghiệm ứng dụng'}
            </div>
            <div
              style={{
                font: 'var(--text-body-xs)',
                color: 'var(--text-secondary, #595959)',
                marginTop: 2,
                lineHeight: '16px',
              }}
            >
              Chia sẻ ý kiến của bạn để giúp chúng tôi phục vụ con bạn tốt hơn.
            </div>
          </div>
        </div>

        <span
          className={`eco-badge eco-badge--md ${hasSubmitted ? 'eco-badge--success' : 'eco-badge--info'}`}
          style={{ flexShrink: 0 }}
        >
          Làm khảo sát ›
        </span>
      </div>
    </div>
  )
}

