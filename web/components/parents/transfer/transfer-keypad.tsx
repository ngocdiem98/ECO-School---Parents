'use client'

import React from 'react'

interface KeypadProps {
  onDigit: (digit: string) => void
  onDelete: () => void
  showLetters?: boolean
}

export function TransferKeypad({ onDigit, onDelete, showLetters = true }: KeypadProps) {
  const keys = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '', letters: '', isSpacer: true },
    { num: '0', letters: '' },
    { num: 'del', letters: '', isDelete: true },
  ]

  return (
    <div className="eco-tr-keypad">
      <div className="eco-tr-keypad__grid">
        {keys.map((k, idx) => {
          if (k.isSpacer) {
            return <div key={`spacer-${idx}`} className="eco-tr-keypad__spacer" />
          }

          if (k.isDelete) {
            return (
              <button
                key="del"
                type="button"
                className="eco-tr-keypad__btn eco-tr-keypad__btn--action"
                onClick={onDelete}
                aria-label="Xoá một chữ số"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              </button>
            )
          }

          return (
            <button
              key={k.num}
              type="button"
              className="eco-tr-keypad__btn"
              onClick={() => onDigit(k.num)}
            >
              <span className="eco-tr-keypad__num">{k.num}</span>
              {showLetters && k.letters && (
                <span className="eco-tr-keypad__letters">{k.letters}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
