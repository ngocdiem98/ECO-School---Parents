'use client'

import React from 'react'
import { TransferRecipient } from './types'

interface TransferScreen4Props {
  recipient: TransferRecipient
  amount: number
  note: string
  selectedSourceId: string
  onSelectSource: (sourceId: string) => void
  onBack: () => void
  onConfirm: () => void
  walletBalance?: string
}

export function TransferScreen4({
  recipient,
  amount,
  note,
  selectedSourceId,
  onSelectSource,
  onBack,
  onConfirm,
  walletBalance = '99,367,100đ',
}: TransferScreen4Props) {
  const formatAmount = (num: number) => {
    return num.toLocaleString('en-US') + 'đ'
  }

  // Format 0901328985 as 090 132 8985
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\s+/g, '')
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    }
    return phone
  }

  return (
    <div className="eco-tr-screen eco-tr-screen-4">
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

      {/* Main Content */}
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
            {/* Scalloped / wavy bottom border */}
            <div className="eco-tr-scallop-border" />
          </div>

          {/* Floating Icon */}
          <div className="eco-tr-receipt-icon-wrap">
            <div className="eco-tr-receipt-icon">
              {/* Yellow wallet with blue transfer arrows */}
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <path
                  d="M25.973 17.2664H28.6663V15.3464C28.6663 12.5864 26.413 10.333 23.653 10.333H8.34633C5.58633 10.333 3.33301 12.5864 3.33301 15.3464V20.213C4.38634 19.253 5.79967 18.6663 7.33301 18.6663C10.653 18.6663 13.333 21.3597 13.333 24.6663C13.333 25.373 13.213 26.0397 12.9863 26.6663C12.6263 27.7197 11.9597 28.6263 11.1197 29.333H23.653C26.413 29.333 28.6663 27.0797 28.6663 24.3197V22.733H26.133C24.693 22.733 23.373 21.6797 23.253 20.2397C23.173 19.3997 23.493 18.613 24.053 18.0663C24.5463 17.5597 25.2263 17.2664 25.973 17.2664Z"
                  fill="#FEC700"
                />
                <circle cx="21" cy="21" r="3" fill="#0070CE" />
                <path d="M19.5 21L21 19.5L22.5 21" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22.5 21L21 22.5L19.5 21" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="eco-tr-receipt-content">
            <span className="eco-tr-receipt-sublabel">Tổng thanh toán</span>
            <div className="eco-tr-receipt-amount">{formatAmount(amount)}</div>
            <div className="eco-tr-receipt-pill">
              <span>Chuyển tiền đến ví ECO</span>
            </div>

            <div className="eco-tr-receipt-divider" />

            <div className="eco-tr-receipt-details">
              <div className="eco-tr-receipt-row">
                <span className="eco-tr-receipt-label">Số tài khoản ví</span>
                <span className="eco-tr-receipt-value">{formatPhone(recipient.phone)}</span>
              </div>
              <div className="eco-tr-receipt-row">
                <span className="eco-tr-receipt-label">Tên tài khoản ví</span>
                <span className="eco-tr-receipt-value">{recipient.name}</span>
              </div>
              <div className="eco-tr-receipt-row">
                <span className="eco-tr-receipt-label">Số tiền</span>
                <span className="eco-tr-receipt-value">{formatAmount(amount)}</span>
              </div>
              {note && (
                <div className="eco-tr-receipt-row">
                  <span className="eco-tr-receipt-label">Lời nhắn</span>
                  <span className="eco-tr-receipt-value">{note}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Funding Source Card: Chọn nguồn tiền */}
        <div className="eco-tr-source-card">
          <div className="eco-tr-source-head">
            <div className="eco-tr-coin-icon">
              <span>$</span>
            </div>
            <h2 className="eco-tr-source-title">Chọn nguồn tiền</h2>
          </div>

          <div className="eco-tr-source-list">
            {/* Source 1: Ví ECO */}
            <button
              type="button"
              className={`eco-tr-source-item ${selectedSourceId === 'eco' ? 'eco-tr-source-item--active' : ''}`}
              onClick={() => onSelectSource('eco')}
            >
              <div className="eco-tr-source-logo eco-tr-source-logo--eco">
                {/* ECO blue polygon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
                    fill="#0070CE"
                  />
                  <path
                    d="M7 11L12 8L17 11L12 14L7 11Z"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M7 13.5L12 16.5L17 13.5"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="eco-tr-source-info">
                <span className="eco-tr-source-name">Ví ECO</span>
                <span className="eco-tr-source-balance">{walletBalance}</span>
              </div>
              <div className="eco-tr-source-radio">
                <div className={`eco-tr-radio-outer ${selectedSourceId === 'eco' ? 'eco-tr-radio-outer--checked' : ''}`}>
                  {selectedSourceId === 'eco' && <div className="eco-tr-radio-inner" />}
                </div>
              </div>
            </button>

            {/* Source 2: ACB */}
            <button
              type="button"
              className={`eco-tr-source-item ${selectedSourceId === 'acb' ? 'eco-tr-source-item--active' : ''}`}
              onClick={() => onSelectSource('acb')}
            >
              <div className="eco-tr-source-logo eco-tr-source-logo--acb">
                <span className="eco-tr-acb-text">ACB</span>
              </div>
              <div className="eco-tr-source-info">
                <span className="eco-tr-source-name">ACB</span>
                <span className="eco-tr-source-balance">**** 9934</span>
              </div>
              <div className="eco-tr-source-radio">
                <div className={`eco-tr-radio-outer ${selectedSourceId === 'acb' ? 'eco-tr-radio-outer--checked' : ''}`}>
                  {selectedSourceId === 'acb' && <div className="eco-tr-radio-inner" />}
                </div>
              </div>
            </button>
          </div>

          <button
            type="button"
            className="eco-tr-source-more"
            onClick={() => {}}
          >
            <span>Xem tất cả</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sticky Bottom Action */}
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
