'use client'

import React, { useState } from 'react'

interface TopupWalletScreen5Props {
  amount: number
  sourceName?: string
  accountNumber?: string
  accountName?: string
  transactionId?: string
  transactionTime?: string
  onGoHome: () => void
  onTopupMore: () => void
  onNavigateToFee?: () => void
  onNavigateToPostpaid?: () => void
}

export function TopupWalletScreen5({
  amount,
  sourceName = 'ACB - ** 9934',
  accountNumber = '0911512939',
  accountName = 'HIẾU VÕ',
  transactionId = '119916580',
  transactionTime = '09:38 18/10/2026',
  onGoHome,
  onTopupMore,
  onNavigateToFee,
  onNavigateToPostpaid,
}: TopupWalletScreen5Props) {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2200)
  }

  const formatAmount = (num: number) => {
    return num.toLocaleString('en-US') + 'đ'
  }

  const handleCopyCode = () => {
    showToast(`Đã sao chép mã GD: ${transactionId}`)
  }

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: 'Kết quả nạp tiền ví ECO',
          text: `Nạp thành công ${formatAmount(amount)} vào ví ECO từ ${sourceName}. Mã GD: ${transactionId}`,
        })
        .catch(() => {})
    } else {
      showToast('Đã sao chép nội dung chia sẻ giao dịch!')
    }
  }

  return (
    <div className="eco-tr-screen eco-tr-screen-6">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="eco-tr-float-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header: Kết quả giao dịch */}
      <header className="eco-tr-header eco-tr-header--result">
        <div className="eco-tr-header__spacer" />
        <h1 className="eco-tr-header__title">Kết quả giao dịch</h1>
        <div className="eco-tr-header__spacer" />
      </header>

      {/* Main Content Area */}
      <div className="eco-tr-result-body">
        {/* Receipt / Result Card */}
        <div className="eco-tr-result-card">
          {/* Subtle concentric guilloche/watermark in background */}
          <div className="eco-tr-watermark-bg">
            <svg width="240" height="240" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="90" stroke="#0070CE" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.12" />
              <circle cx="100" cy="100" r="72" stroke="#0070CE" strokeWidth="0.8" opacity="0.08" />
              <circle cx="100" cy="100" r="54" stroke="#0070CE" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.1" />
              <circle cx="100" cy="100" r="36" fill="#0070CE" fillOpacity="0.03" />
              {/* ECO Polygon Logo Watermark */}
              <path
                d="M100 82L82 92V112L100 122L118 112V92L100 82Z"
                fill="#0070CE"
                fillOpacity="0.08"
              />
              <path
                d="M90 98L100 93L110 98L100 103L90 98Z"
                fill="#FFFFFF"
                fillOpacity="0.6"
              />
            </svg>
          </div>

          {/* Success Check Icon */}
          <div className="eco-tr-result-icon">
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
              <circle cx="27" cy="27" r="24" fill="#00C853" />
              <path
                d="M19 27.5L24.5 33L35 22.5"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="eco-tr-result-status">Giao dịch thành công</span>
          <div className="eco-tr-result-amount">{formatAmount(amount)}</div>
          <div className="eco-tr-receipt-pill">
            <span>Nạp tiền vào ví ECO</span>
          </div>

          {/* Dashed Divider */}
          <div className="eco-tr-result-dash-line" />

          {/* Transaction Metadata */}
          <div className="eco-tr-result-meta">
            <div className="eco-tr-result-row">
              <span className="eco-tr-result-label">Mã giao dịch</span>
              <button
                type="button"
                className="eco-tr-code-btn"
                onClick={handleCopyCode}
              >
                <span>{transactionId}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            <div className="eco-tr-result-row">
              <span className="eco-tr-result-label">Thời gian giao dịch</span>
              <span className="eco-tr-result-val">{transactionTime}</span>
            </div>

            <h3 className="eco-tr-result-sec-title">Thông tin dịch vụ</h3>

            <div className="eco-tr-result-row">
              <span className="eco-tr-result-label">Số tài khoản ví</span>
              <span className="eco-tr-result-val">{accountNumber}</span>
            </div>

            <div className="eco-tr-result-row">
              <span className="eco-tr-result-label">Tên tài khoản ví</span>
              <span className="eco-tr-result-val eco-tr-result-val--name">{accountName}</span>
            </div>

            <div className="eco-tr-result-row">
              <span className="eco-tr-result-label">Nguồn tiền</span>
              <span className="eco-tr-result-val">{sourceName}</span>
            </div>
          </div>

          {/* Dashed Divider */}
          <div className="eco-tr-result-dash-line" />

          {/* Share Action */}
          <button
            type="button"
            className="eco-tr-share-btn"
            onClick={handleShare}
          >
            <span>Chia sẻ</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>

        {/* Section: Đừng bỏ lỡ */}
        <section className="eco-tr-recommend-section">
          <h2 className="eco-tr-recommend-title">Đừng bỏ lỡ</h2>

          <div className="eco-tr-recommend-scroll">
            <div className="eco-tr-recommend-cards">
              {/* Card 1: Dịch vụ EcoPayLater */}
              <div className="eco-tr-rec-card">
                <div className="eco-tr-rec-icon eco-tr-rec-icon--orange">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="5" width="20" height="14" rx="3" fill="#FFFFFF" fillOpacity="0.2" />
                    <path
                      d="M21 9V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V7C3 5.9 3.9 5 5 5H17C18.1 5 19 5.9 19 7V9H21Z"
                      fill="#FFFFFF"
                    />
                    <circle cx="15" cy="12" r="2.5" fill="#F59E0B" />
                  </svg>
                </div>
                <div className="eco-tr-rec-name">
                  Dịch vụ<br />EcoPayLater
                </div>
                <p className="eco-tr-rec-desc">Thanh toán học phí trả sau</p>
                <button
                  type="button"
                  className="eco-tr-rec-btn"
                  onClick={() => {
                    if (onNavigateToPostpaid) onNavigateToPostpaid()
                    else showToast('Đang mở dịch vụ EcoPayLater...')
                  }}
                >
                  Thanh toán
                </button>
              </div>

              {/* Card 2: Đóng học phí */}
              <div className="eco-tr-rec-card">
                <div className="eco-tr-rec-icon eco-tr-rec-icon--blue">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z"
                      fill="#FFFFFF"
                    />
                    <path
                      d="M5 13.18V17.18C5 19.39 8.13 21.18 12 21.18C15.87 21.18 19 19.39 19 17.18V13.18L12 17L5 13.18Z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </div>
                <div className="eco-tr-rec-name">
                  Đóng học<br />phí
                </div>
                <p className="eco-tr-rec-desc">An toàn bảo mật tối đa</p>
                <button
                  type="button"
                  className="eco-tr-rec-btn"
                  onClick={() => {
                    if (onNavigateToFee) onNavigateToFee()
                    else showToast('Đang mở màn hình Đóng học phí...')
                  }}
                >
                  Thanh toán
                </button>
              </div>

              {/* Card 3: Hóa đơn tiền điện */}
              <div className="eco-tr-rec-card">
                <div className="eco-tr-rec-icon eco-tr-rec-icon--yellow">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 21C9 21.55 9.45 22 10 22H14C14.55 22 15 21.55 15 21V20H9V21ZM12 2C8.14 2 5 5.14 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.14 15.86 2 12 2Z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </div>
                <div className="eco-tr-rec-name">
                  Hóa đơn<br />tiền điện
                </div>
                <p className="eco-tr-rec-desc">An toàn bảo mật tối đa</p>
                <button
                  type="button"
                  className="eco-tr-rec-btn"
                  onClick={() => showToast('Dịch vụ hóa đơn tiền điện đang được kết nối.')}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="eco-tr-result-bottom-bar">
        <button
          type="button"
          className="eco-tr-btn-home"
          onClick={onGoHome}
        >
          Trang chủ
        </button>
        <button
          type="button"
          className="eco-tr-btn-more"
          onClick={onTopupMore}
        >
          Nạp thêm
        </button>
      </div>
    </div>
  )
}
