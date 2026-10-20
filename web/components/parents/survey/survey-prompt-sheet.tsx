'use client'

import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

interface SurveyPromptSheetProps {
  onTakeSurvey: () => void
  onDismiss: () => void
}

export function SurveyPromptSheet({ onTakeSurvey, onDismiss }: SurveyPromptSheetProps) {
  return (
    <OverlayPortal>
      <div className="eco-sheet-root" style={{ zIndex: 100 }}>
        <div className="eco-sheet-scrim" onClick={onDismiss} />
        <div
          className="eco-sheet eco-survey-prompt-sheet"
          style={{ height: 'auto', paddingBottom: 24 }}
          role="dialog"
          aria-label="Trải nghiệm ECO School của bạn thế nào?"
        >
          <span className="eco-sheet__grabber" />
          <button
            type="button"
            className="eco-iconbtn eco-iconbtn--md eco-iconbtn--ghost eco-survey-close-btn"
            onClick={onDismiss}
            aria-label="Đóng"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="eco-survey-prompt-body">
            <span
              className="eco-tile__icon eco-tile__icon--blue"
              style={{ width: 56, height: 56, borderRadius: 20, color: '#ffffff', marginBottom: 14 }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h.01" />
                <path d="M12 10h.01" />
                <path d="M16 10h.01" />
              </svg>
            </span>

            <h3 className="eco-survey-prompt-title">
              Trải nghiệm ECO School của bạn thế nào?
            </h3>
            <p className="eco-survey-prompt-desc">
              Hãy dành 1 phút chia sẻ cảm nhận để chúng tôi cải thiện ứng dụng và phục vụ con bạn tốt hơn.
            </p>

            <div className="eco-survey-prompt-actions">
              <button
                type="button"
                className="eco-btn eco-btn--brand eco-btn--lg eco-btn--full"
                onClick={onTakeSurvey}
              >
                Làm khảo sát
              </button>
              <button
                type="button"
                className="eco-survey-btn-secondary"
                onClick={onDismiss}
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}

