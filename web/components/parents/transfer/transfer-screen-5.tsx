'use client'

import React, { useState, useEffect } from 'react'

interface TransferScreen5Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function TransferScreen5({
  isOpen,
  onClose,
  onSuccess,
}: TransferScreen5Props) {
  const [pin, setPin] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Reset PIN when modal opens
  useEffect(() => {
    if (isOpen) {
      setPin('')
      setIsVerifying(false)
      setShowToast(false)
    }
  }, [isOpen])

  const handleDigit = (digit: string) => {
    if (pin.length >= 6 || isVerifying) return
    const nextPin = pin + digit
    setPin(nextPin)

    if (nextPin.length === 6) {
      // Completed 6 digits, simulate verification
      setIsVerifying(true)
      setTimeout(() => {
        setIsVerifying(false)
        setShowToast(true)
        setTimeout(() => {
          onSuccess()
        }, 1800)
      }, 600)
    }
  }

  const handleDelete = () => {
    if (isVerifying || pin.length === 0) return
    setPin(pin.slice(0, -1))
  }

  if (!isOpen) return null

  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '', '0', 'del',
  ]

  return (
    <div className="eco-tr-modal-overlay" onClick={onClose}>
      <div
        className="eco-tr-modal-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tr-pin-title"
      >
        {/* Modal Header */}
        <div className="eco-tr-modal-header">
          <h2 id="tr-pin-title" className="eco-tr-modal-title">
            Xác nhận mật khẩu
          </h2>
          <button
            type="button"
            className="eco-tr-modal-close"
            onClick={onClose}
            aria-label="Đóng"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* PIN Boxes */}
        <div className="eco-tr-pin-boxes">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const hasValue = idx < pin.length
            const isCurrent = idx === pin.length
            return (
              <div
                key={idx}
                className={`eco-tr-pin-box ${hasValue ? 'eco-tr-pin-box--filled' : ''} ${isCurrent ? 'eco-tr-pin-box--current' : ''}`}
              >
                {hasValue && <span className="eco-tr-pin-dot" />}
              </div>
            )
          })}
        </div>

        {/* Forgot Password Link */}
        <div className="eco-tr-pin-forgot">
          <button
            type="button"
            className="eco-tr-link-forgot"
            onClick={() => alert('Vui lòng liên hệ hotline ECO để khôi phục mật khẩu ví.')}
          >
            Quên mật khẩu
          </button>
        </div>

        {/* Numeric Keypad in Modal */}
        <div className="eco-tr-modal-keypad">
          <div className="eco-tr-modal-keypad__grid">
            {keys.map((k, index) => {
              if (k === '') {
                return <div key={`spacer-${index}`} className="eco-tr-modal-keypad__spacer" />
              }

              if (k === 'del') {
                return (
                  <button
                    key="del"
                    type="button"
                    className="eco-tr-modal-keypad__btn eco-tr-modal-keypad__btn--del"
                    onClick={handleDelete}
                    aria-label="Xoá ký tự"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="#64748B">
                      <path d="M21 4H8a2 2 0 0 0-1.414.586l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 8 20h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-4.293 11.293a1 1 0 0 1-1.414 0L13 12.914l-2.293 2.379a1 1 0 0 1-1.414-1.414L11.586 11.5 9.293 9.207a1 1 0 0 1 1.414-1.414L13 10.086l2.293-2.293a1 1 0 0 1 1.414 1.414L14.414 11.5l2.293 2.379a1 1 0 0 1 0 1.414z" />
                    </svg>
                  </button>
                )
              }

              return (
                <button
                  key={k}
                  type="button"
                  className="eco-tr-modal-keypad__btn"
                  onClick={() => handleDigit(k)}
                >
                  <span className="eco-tr-modal-keypad__num">{k}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Verification Status Toast / Feedback */}
        {showToast && (
          <div className="eco-tr-success-toast">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span>Xác nhận thành công! Đang chuyển hướng...</span>
          </div>
        )}
      </div>
    </div>
  )
}
