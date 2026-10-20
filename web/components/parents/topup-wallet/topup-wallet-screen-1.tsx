'use client'

import React, { useState } from 'react'
import { TopupBankSource } from './types'
import { TransferKeypad } from '../transfer/transfer-keypad'

interface TopupWalletScreen1Props {
  amount: number
  selectedSourceId: string
  walletBalance?: string
  onAmountChange: (amount: number) => void
  onSelectSource: (sourceId: string) => void
  onContinue: () => void
  onBack: () => void
}

export const MOCK_TOPUP_SOURCES: TopupBankSource[] = [
  {
    id: 'acb',
    name: 'ACB - ** 9934',
    feeText: 'Miễn phí nạp tiền',
    iconType: 'acb',
    accountMask: '** 9934',
  },
  {
    id: 'agribank',
    name: 'AGRIBANK TEST - ** 2133',
    feeText: 'Miễn phí nạp tiền',
    iconType: 'agribank',
    accountMask: '** 2133',
  },
]

export function TopupWalletScreen1({
  amount,
  selectedSourceId,
  walletBalance = '99,367,100đ',
  onAmountChange,
  onSelectSource,
  onContinue,
  onBack,
}: TopupWalletScreen1Props) {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2200)
  }

  const formatAmount = (num: number) => {
    return num.toLocaleString('en-US')
  }

  const handleDigit = (digit: string) => {
    const currentStr = amount === 0 ? '' : amount.toString()
    if (currentStr.length >= 9) return
    const newStr = currentStr + digit
    onAmountChange(parseInt(newStr, 10) || 0)
  }

  const handleDelete = () => {
    if (amount === 0) return
    const currentStr = amount.toString()
    if (currentStr.length <= 1) {
      onAmountChange(0)
    } else {
      const newStr = currentStr.slice(0, -1)
      onAmountChange(parseInt(newStr, 10) || 0)
    }
  }

  const handlePreset = (presetValue: number) => {
    onAmountChange(presetValue)
  }

  const presets = [100000, 200000, 500000, 1000000]
  const isEnabled = amount > 0

  return (
    <div className="eco-tr-screen eco-tw-screen-1">
      {/* Curved Soft Blue Header Gradient */}
      <div className="eco-tr-header-bg" />

      {/* Floating Toast */}
      {toastMessage && (
        <div className="eco-tr-float-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="eco-tr-header eco-tr-header--transparent">
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
        <h1 className="eco-tr-header__title">Nạp tiền vào ví ECO</h1>
        <div className="eco-tr-header__spacer" />
      </header>

      {/* Scrollable Content Body */}
      <div className="eco-tw-scroll-area">
        {/* Main Amount Card */}
        <div className="eco-tr-amount-card">
          <div className="eco-tr-balance-bar">
            <span className="eco-tr-balance-bar__label">Số dư ví</span>
            <span className="eco-tr-balance-bar__value">{walletBalance}</span>
          </div>

          <div className="eco-tr-amount-field" style={{ marginBottom: 4 }}>
            <span className="eco-tr-amount-field__label">Số tiền cần nạp</span>
            <div className="eco-tr-amount-display">
              {amount === 0 ? (
                <>
                  <span className="eco-tr-amount-zero">0</span>
                  <span className="eco-tr-cursor" />
                  <span className="eco-tr-currency-symbol eco-tr-currency-symbol--dim">đ</span>
                </>
              ) : (
                <>
                  <span className="eco-tr-amount-val">{formatAmount(amount)}</span>
                  <span className="eco-tr-cursor" />
                  <span className="eco-tr-currency-symbol eco-tr-currency-symbol--active">đ</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Section: Nguồn tiền */}
        <div className="eco-tw-section">
          <h2 className="eco-tr-section__title">Nguồn tiền</h2>

          <div className="eco-tw-sources-list">
            {/* Source 1: ACB */}
            <button
              type="button"
              className={`eco-tw-source-card ${selectedSourceId === 'acb' ? 'eco-tw-source-card--selected' : ''}`}
              onClick={() => onSelectSource('acb')}
            >
              <div className="eco-tw-source-logo eco-tw-source-logo--acb">
                <span className="eco-tw-acb-text">ACB</span>
              </div>
              <div className="eco-tw-source-details">
                <span className="eco-tw-source-title">ACB - ** 9934</span>
                <span className="eco-tw-source-fee">Miễn phí nạp tiền</span>
              </div>
              <div className="eco-tw-source-radio">
                <div className={`eco-tw-radio-ring ${selectedSourceId === 'acb' ? 'eco-tw-radio-ring--checked' : ''}`}>
                  {selectedSourceId === 'acb' && <div className="eco-tw-radio-dot" />}
                </div>
              </div>
            </button>

            {/* Source 2: AGRIBANK TEST */}
            <button
              type="button"
              className={`eco-tw-source-card ${selectedSourceId === 'agribank' ? 'eco-tw-source-card--selected' : ''}`}
              onClick={() => onSelectSource('agribank')}
            >
              <div className="eco-tw-source-logo eco-tw-source-logo--agribank">
                {/* Agribank Square Logo */}
                <div className="eco-tw-agribank-sq">
                  <span className="eco-tw-agribank-symbol">🌾</span>
                </div>
                <span className="eco-tw-agribank-text">AGRIBANK</span>
              </div>
              <div className="eco-tw-source-details">
                <span className="eco-tw-source-title">AGRIBANK TEST - ** 2133</span>
                <span className="eco-tw-source-fee">Miễn phí nạp tiền</span>
              </div>
              <div className="eco-tw-source-radio">
                <div className={`eco-tw-radio-ring ${selectedSourceId === 'agribank' ? 'eco-tw-radio-ring--checked' : ''}`}>
                  {selectedSourceId === 'agribank' && <div className="eco-tw-radio-dot" />}
                </div>
              </div>
            </button>
          </div>

          {/* Add Bank Card Banner */}
          <div className="eco-tw-add-bank-banner">
            <div className="eco-tw-add-bank-content">
              <p className="eco-tw-add-bank-desc">
                Thêm nguồn ngân hàng khác để các giao dịch được nhanh chóng.
              </p>
              <button
                type="button"
                className="eco-tw-add-bank-link"
                onClick={() => showToast('Tính năng liên kết ngân hàng mới đang được kết nối.')}
              >
                <span>Thêm ngân hàng khác</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            {/* Visual Graphic */}
            <div className="eco-tw-add-bank-graphic">
              <svg width="68" height="52" viewBox="0 0 68 52" fill="none">
                {/* Green Cash Note */}
                <rect x="14" y="6" width="46" height="28" rx="4" transform="rotate(-10 14 6)" fill="#10B981" />
                <rect x="18" y="10" width="38" height="20" rx="3" transform="rotate(-10 18 10)" fill="#059669" />
                <circle cx="36" cy="18" r="5" fill="#34D399" />
                {/* Gold Coin */}
                <circle cx="20" cy="38" r="10" fill="#F59E0B" />
                <circle cx="20" cy="38" r="8" fill="#FBBF24" />
                <text x="17" y="42" fill="#D97706" fontSize="11" fontWeight="800">$</text>
                {/* Credit Card */}
                <rect x="36" y="24" width="30" height="20" rx="3" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1" />
                <rect x="36" y="28" width="30" height="4" fill="#3B82F6" />
                <rect x="40" y="36" width="8" height="3" rx="1" fill="#FFFFFF" />
              </svg>
            </div>
          </div>
        </div>

        {/* Preset Amount Pills */}
        <div className="eco-tr-presets-wrap" style={{ marginTop: 'auto' }}>
          <div className="eco-tr-presets">
            {presets.map((val) => (
              <button
                key={val}
                type="button"
                className={`eco-tr-preset-btn ${amount === val ? 'eco-tr-preset-btn--selected' : ''}`}
                onClick={() => handlePreset(val)}
              >
                {formatAmount(val)}
              </button>
            ))}
          </div>
        </div>

        {/* CTA: Tiếp tục */}
        <div className="eco-tr-cta-wrap">
          <button
            type="button"
            className={`eco-tr-btn-continue ${isEnabled ? 'eco-tr-btn-continue--active' : 'eco-tr-btn-continue--disabled'}`}
            disabled={!isEnabled}
            onClick={onContinue}
          >
            Tiếp tục
          </button>
        </div>
      </div>

      {/* Numeric Keypad at bottom */}
      <TransferKeypad onDigit={handleDigit} onDelete={handleDelete} showLetters={true} />
    </div>
  )
}
