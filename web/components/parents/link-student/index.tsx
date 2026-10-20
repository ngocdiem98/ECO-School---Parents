'use client'

import { useState } from 'react'
import { CodeSheet } from './code-sheet'
import { QrScannerScreen } from './qr-scanner-screen'

interface LinkStudentAppProps {
  onBack: () => void
  onScanModeChange?: (isScanning: boolean) => void
}

export function LinkStudentApp({
  onBack,
  onScanModeChange,
}: LinkStudentAppProps) {
  const [showCodeSheet, setShowCodeSheet] = useState(false)
  const [showQrScanner, setShowQrScanner] = useState(false)
  const [scannedCode, setScannedCode] = useState('')

  const openScanner = () => {
    setShowQrScanner(true)
    onScanModeChange?.(true)
  }

  const closeScanner = () => {
    setShowQrScanner(false)
    onScanModeChange?.(false)
  }

  if (showQrScanner) {
    return (
      <QrScannerScreen
        onBack={closeScanner}
        onDetected={(code) => {
          closeScanner()
          setScannedCode(code)
          setShowCodeSheet(true)
        }}
      />
    )
  }

  return (
    <div
      className="screen"
      style={{
        paddingBottom: 0,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans-native)',
        background:
          'linear-gradient(180deg, #FFD543 0%, #FAEA70 38%, #FDF9C8 68%, #FFFCE0 100%)',
      }}
    >
      {/* Top Hero Banner with Back Chevron */}
      <div
        style={{
          position: 'relative',
          flexShrink: 0,
          width: '100%',
          paddingTop: 34,
          backgroundImage: "url('/ds/home/home-hero-bg.png')",
          backgroundPosition: 'top center',
          backgroundSize: '100% auto',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <img
          src="/ds/home/link-student-hero.png"
          alt="Giải pháp chuyển đổi số giáo dục"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
          }}
        />
        <button
          type="button"
          onClick={onBack}
          aria-label="Quay lại"
          style={{
            position: 'absolute',
            top: 36,
            left: 6,
            width: 36,
            height: 36,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 0,
            padding: 0,
            color: '#232628',
            cursor: 'pointer',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 6L9 12L15 18" />
          </svg>
        </button>
      </div>

      {/* Lower Body: Seamless Warm Yellow Gradient + ECO.StepsCard + Actions */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background:
            'linear-gradient(180deg, rgba(251, 243, 175, 0) 0px, #FDF9C8 85px, #FFFCE0 100%), linear-gradient(90deg, #FAEA70 0%, #FBF3AF 50%, #FEFEF4 100%)',
        }}
      >
        {/* ECO.StepsCard + ECO.StepList */}
        <div style={{ padding: '4px 12px 0' }}>
          <section className="eco-stepscard">
            <h4>Nhập thông tin học sinh để liên kết</h4>
            <ol className="eco-steps">
              <li>
                <i />
                <p>
                  <b>Bước 1:</b> Chọn nút <b>&quot;Nhập thông tin&quot;</b> bên dưới
                </p>
              </li>
              <li>
                <i />
                <p>
                  <b>Bước 2:</b> Nhập <b>Mã học sinh</b> và <b>Mã bảo vệ</b>
                </p>
              </li>
              <li>
                <i />
                <p>
                  <b>Bước 3:</b> Kiểm tra và nhấn <b>&quot;Xác nhận&quot;</b> để kích hoạt liên kết
                </p>
              </li>
            </ol>
          </section>
        </div>

        {/* Bottom Action Area: ECO.Button (brand) + ECO.Divider (Hoặc) + ECO.Button (soft) */}
        <div
          style={{
            marginTop: 'auto',
            padding: '24px 15px 22px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <button
            type="button"
            className="eco-btn eco-btn--brand eco-btn--lg eco-btn--full"
            style={{
              background: '#FEC020',
              color: '#141414',
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 10,
              height: 46,
            }}
            onClick={() => {
              setScannedCode('')
              setShowCodeSheet(true)
            }}
          >
            Nhập thông tin
          </button>

          <div
            className="eco-divider eco-divider--label"
            style={{ margin: '10px 36px', color: '#8A93A6', fontSize: 13 }}
          >
            Hoặc
          </div>

          <button
            type="button"
            className="eco-btn eco-btn--soft eco-btn--lg eco-btn--full"
            style={{
              background: 'var(--bg-neutral-soft, #F3F4F8)',
              color: '#141414',
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 10,
              height: 46,
            }}
            onClick={openScanner}
          >
            Quét mã trên thẻ học sinh
          </button>

          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <span style={{ font: 'var(--text-body-m)', fontSize: 15, color: '#141414' }}>
              Bạn làm hỏng, mất thẻ,{' '}
            </span>
            <button
              type="button"
              style={{
                font: 'var(--text-body-m)',
                fontSize: 15,
                fontWeight: 500,
                color: 'var(--eco-link, #006FDA)',
                background: 'none',
                border: 0,
                padding: 0,
                cursor: 'pointer',
              }}
            >
              Cấp lại thẻ
            </button>
          </div>
        </div>
      </div>

      {showCodeSheet && (
        <CodeSheet
          initialStudentCode={scannedCode}
          onClose={() => setShowCodeSheet(false)}
        />
      )}
    </div>
  )
}
