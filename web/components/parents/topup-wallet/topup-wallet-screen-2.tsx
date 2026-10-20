'use client'

import React from 'react'
import { TopupBankSource } from './types'

interface TopupWalletScreen2Props {
  amount: number
  selectedSource: TopupBankSource
  accountNumber?: string
  accountName?: string
  onBack: () => void
  onConfirm: () => void
}

export function TopupWalletScreen2({
  amount,
  selectedSource,
  accountNumber = '0911512939',
  accountName = 'HIẾU VÕ',
  onBack,
  onConfirm,
}: TopupWalletScreen2Props) {
  const formatAmount = (num: number) => {
    return num.toLocaleString('en-US') + 'đ'
  }

  return (
    <div className="eco-tr-screen eco-tw-screen-2">
      {/* Header */}
      <header className="eco-tr-header">
        <button
          type="button"
          className="eco-tr-back-btn"
          onClick={onBack}
          aria-label="Quay lại"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="eco-tr-header__title">Xác nhận giao dịch</h1>
        <div className="eco-tr-header__spacer" />
      </header>

      {/* Main Content Area */}
      <div className="eco-tr-confirm-body">
        {/* Receipt Ticket Card */}
        <div className="eco-tr-receipt-card">
          {/* Decorative ECO top header */}
          <div className="eco-tr-receipt-pattern">
            <div className="eco-tr-receipt-pattern__logos">
              <span className="eco-tr-receipt-logo">ECO</span>
              <span className="eco-tr-receipt-dot">•</span>
              <span className="eco-tr-receipt-logo">ECO</span>
              <span className="eco-tr-receipt-dot">•</span>
              <span className="eco-tr-receipt-logo">ECO</span>
              <span className="eco-tr-receipt-dot">•</span>
              <span className="eco-tr-receipt-logo">ECO</span>
              <span className="eco-tr-receipt-dot">•</span>
              <span className="eco-tr-receipt-logo">ECO</span>
            </div>
            {/* Scalloped bottom border */}
            <div className="eco-tr-scallop-border" />
          </div>

          {/* Floating Icon: Yellow wallet with blue top / plus icon */}
          <div className="eco-tr-receipt-icon-wrap">
            <div className="eco-tr-receipt-icon">
              <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
                {/* Yellow Wallet Body */}
                <path
                  d="M27 16H29V14C29 11.24 26.76 9 24 9H8C5.24 9 3 11.24 3 14V23C3 25.76 5.24 28 8 28H24C26.76 28 29 25.76 29 23V21H27C25.34 21 24 19.66 24 18C24 16.34 25.34 16 27 16Z"
                  fill="#FEC700"
                />
                {/* Blue Top Flap */}
                <path
                  d="M20 4V9H8C5.24 9 3 11.24 3 14V9.5C3 8.12 3.84 6.88 5.12 6.39L15.68 2.39C17.33 1.76 19.1 2.98 19.1 4.75L20 4Z"
                  fill="#0070CE"
                />
                {/* Plus Icon Badge */}
                <circle cx="20" cy="20" r="4.5" fill="#0070CE" />
                <path d="M20 17.5V22.5M17.5 20H22.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="eco-tr-receipt-content" style={{ paddingBottom: 16 }}>
            <span className="eco-tr-receipt-sublabel">Tổng tiền</span>
            <div className="eco-tr-receipt-amount">{formatAmount(amount)}</div>
            <div className="eco-tw-receipt-subtitle">Nạp tiền vào ví ECO</div>

            <div className="eco-tr-receipt-divider" style={{ margin: '14px 0' }} />

            <div className="eco-tr-receipt-details">
              <div className="eco-tr-receipt-row">
                <span className="eco-tr-receipt-label">Số tài khoản ví</span>
                <span className="eco-tr-receipt-value">{accountNumber}</span>
              </div>
              <div className="eco-tr-receipt-row">
                <span className="eco-tr-receipt-label">Tên tài khoản ví</span>
                <span className="eco-tr-receipt-value">{accountName}</span>
              </div>
              <div className="eco-tr-receipt-row">
                <span className="eco-tr-receipt-label">Số tiền</span>
                <span className="eco-tr-receipt-value">{formatAmount(amount)}</span>
              </div>
            </div>

            {/* Section Nguồn tiền inside Card */}
            <div className="eco-tw-confirm-source-section">
              <h3 className="eco-tw-confirm-source-title">Nguồn tiền</h3>
              <div className="eco-tw-confirm-source-box">
                <div className="eco-tw-source-logo eco-tw-source-logo--acb" style={{ width: 44, height: 32 }}>
                  <span className="eco-tw-acb-text">ACB</span>
                </div>
                <div className="eco-tw-source-details">
                  <span className="eco-tw-source-title">ACB ** 9934</span>
                  <span className="eco-tw-source-fee">{selectedSource.feeText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Confirm CTA */}
      <div className="eco-tr-confirm-cta-wrap">
        <button
          type="button"
          className="eco-tr-btn-confirm"
          onClick={onConfirm}
        >
          Xác nhận giao dịch
        </button>
      </div>
    </div>
  )
}
