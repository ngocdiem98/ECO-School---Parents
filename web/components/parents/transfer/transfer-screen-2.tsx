'use client'

import React, { useState } from 'react'
import { TransferRecipient } from './types'
import { TransferKeypad } from './transfer-keypad'

interface TransferScreen2Props {
  recipient: TransferRecipient
  amount: number
  note: string
  onBack: () => void
  onAmountChange: (amount: number) => void
  onNoteChange: (note: string) => void
  onContinue: () => void
  walletBalance?: string
}

export function TransferScreen2({
  recipient,
  amount,
  note,
  onBack,
  onAmountChange,
  onNoteChange,
  onContinue,
  walletBalance = '99,367,100đ',
}: TransferScreen2Props) {
  const [isEditingNote, setIsEditingNote] = useState(false)

  // Format amount with comma thousand separators
  const formatAmount = (num: number) => {
    return num.toLocaleString('en-US')
  }

  const handleDigit = (digit: string) => {
    const currentStr = amount === 0 ? '' : amount.toString()
    if (currentStr.length >= 9) return // Max 999,999,999
    const newStr = currentStr + digit
    const newAmount = parseInt(newStr, 10) || 0
    onAmountChange(newAmount)
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
    <div className="eco-tr-screen eco-tr-screen-2">
      {/* Curved soft blue gradient backdrop header */}
      <div className="eco-tr-header-bg" />

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
        <h1 className="eco-tr-header__title">Chuyển tiền</h1>
        <div className="eco-tr-header__spacer" />
      </header>

      <div className="eco-tr-scroll-area">
        {/* Main Floating Card */}
        <div className="eco-tr-amount-card">
          {/* Wallet Balance Pill */}
          <div className="eco-tr-balance-bar">
            <span className="eco-tr-balance-bar__label">Số dư ví</span>
            <span className="eco-tr-balance-bar__value">{walletBalance}</span>
          </div>

          <div className="eco-tr-amount-field">
            <span className="eco-tr-amount-field__label">Số tiền cần chuyển</span>
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

          {/* Note Input Box */}
          <div className="eco-tr-note-box">
            <div className="eco-tr-note-box__head">
              <span>Lời nhắn ({note.length}/200)</span>
            </div>
            <input
              type="text"
              className="eco-tr-note-box__input"
              placeholder="Nhập lời nhắn"
              maxLength={200}
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              onFocus={() => setIsEditingNote(true)}
              onBlur={() => setIsEditingNote(false)}
            />
          </div>
        </div>

        {/* Section: Người nhận */}
        <div className="eco-tr-recipient-section">
          <h2 className="eco-tr-section__title">Người nhận</h2>
          <div className="eco-tr-recipient-box">
            <div className="eco-tr-avatar">
              <span className="eco-tr-avatar__letter">{recipient.avatarLetter || 'T'}</span>
              <span className="eco-tr-avatar__badge">e</span>
            </div>
            <div className="eco-tr-recipient-info">
              <span className="eco-tr-recipient-name">{recipient.name}</span>
              <span className="eco-tr-recipient-phone">{recipient.phone}</span>
            </div>
            <div className="eco-tr-recipient-action" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <circle cx="12" cy="8" r="2" />
                <path d="M9 14h6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Preset Amount Pills (Horizontal scroll or wrap) */}
        <div className="eco-tr-presets-wrap">
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

      {/* Numeric Keypad at Bottom */}
      <TransferKeypad onDigit={handleDigit} onDelete={handleDelete} showLetters={true} />
    </div>
  )
}
