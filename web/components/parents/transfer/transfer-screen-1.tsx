'use client'

import React, { useState } from 'react'
import { TransferRecipient } from './types'

interface TransferScreen1Props {
  onBack: () => void
  onSelectRecipient: (recipient: TransferRecipient) => void
  onBankTransferClick?: () => void
}

export const MOCK_RECIPIENT_THU: TransferRecipient = {
  id: 'thu-xinh-dep',
  name: 'Thu Xinh Dep',
  phone: '0901328985',
  avatarLetter: 'T',
  isEco: true,
}

export function TransferScreen1({
  onBack,
  onSelectRecipient,
  onBankTransferClick,
}: TransferScreen1Props) {
  const [activeTab, setActiveTab] = useState<'eco' | 'bank'>('eco')
  const [searchQuery, setSearchQuery] = useState('')

  const handleTabBank = () => {
    setActiveTab('bank')
    if (onBankTransferClick) {
      onBankTransferClick()
    }
  }

  const isThuMatched =
    !searchQuery ||
    'thu xinh dep'.includes(searchQuery.toLowerCase()) ||
    '0901328985'.includes(searchQuery.trim())

  return (
    <div className="eco-tr-screen eco-tr-screen-1">
      {/* Top Header */}
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
        <h1 className="eco-tr-header__title">Chuyển tiền</h1>
        <div className="eco-tr-header__spacer" />
      </header>

      {/* Tabs: Đến ví ECO / Đến ngân hàng */}
      <div className="eco-tr-tabs-wrap">
        <div className="eco-tr-tabs">
          <button
            type="button"
            className={`eco-tr-tab ${activeTab === 'eco' ? 'eco-tr-tab--active' : ''}`}
            onClick={() => setActiveTab('eco')}
          >
            Đến ví ECO
          </button>
          <button
            type="button"
            className={`eco-tr-tab ${activeTab === 'bank' ? 'eco-tr-tab--active' : ''}`}
            onClick={handleTabBank}
          >
            Đến ngân hàng
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="eco-tr-body">
        {/* Search Bar */}
        <div className="eco-tr-search">
          <span className="eco-tr-search__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="eco-tr-search__input"
            placeholder="Nhập tên hoặc số điện thoại"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="eco-tr-search__clear"
              onClick={() => setSearchQuery('')}
              aria-label="Xoá tìm kiếm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Section: Gần đây */}
        {isThuMatched && (
          <section className="eco-tr-section">
            <h2 className="eco-tr-section__title">Gần đây</h2>
            <div className="eco-tr-recents-list">
              <button
                type="button"
                className="eco-tr-contact-card"
                onClick={() => onSelectRecipient(MOCK_RECIPIENT_THU)}
              >
                <div className="eco-tr-avatar">
                  <span className="eco-tr-avatar__letter">T</span>
                  <span className="eco-tr-avatar__badge">e</span>
                </div>
                <div className="eco-tr-contact-info">
                  <span className="eco-tr-contact-name">Thu Xinh Dep</span>
                  <span className="eco-tr-contact-phone">0901328985</span>
                </div>
              </button>
            </div>
          </section>
        )}

        {/* Section: Chọn người nhận */}
        <section className="eco-tr-section" style={{ marginTop: '20px' }}>
          <div className="eco-tr-section__head-row">
            <h2 className="eco-tr-section__title">Chọn người nhận</h2>
            <button
              type="button"
              className="eco-tr-btn-refresh"
              onClick={() => {}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              <span>Cập nhật</span>
            </button>
          </div>

          {/* Empty State Illustration */}
          <div className="eco-tr-empty-state">
            <div className="eco-tr-empty-state__icon">
              <svg width="84" height="96" viewBox="0 0 84 96" fill="none">
                {/* Document paper with folded corner */}
                <path
                  d="M12 4C7.58172 4 4 7.58172 4 12V84C4 88.4183 7.58172 92 12 92H72C76.4183 92 80 88.4183 80 84V28L56 4H12Z"
                  fill="#E2E8F0"
                />
                <path
                  d="M56 4V24C56 26.2091 57.7909 28 60 28H80L56 4Z"
                  fill="#CBD5E1"
                />
                {/* Horizontal lines */}
                <rect x="18" y="24" width="28" height="5" rx="2.5" fill="#FFFFFF" />
                <rect x="18" y="36" width="46" height="5" rx="2.5" fill="#FFFFFF" />
                <rect x="18" y="48" width="40" height="5" rx="2.5" fill="#FFFFFF" />
                <rect x="18" y="60" width="24" height="5" rx="2.5" fill="#FFFFFF" />
                <rect x="18" y="72" width="20" height="5" rx="2.5" fill="#FFFFFF" />
                {/* Magnifying Glass overlaying document */}
                <circle
                  cx="54"
                  cy="66"
                  r="16"
                  fill="#FFFFFF"
                  stroke="#CBD5E1"
                  strokeWidth="5"
                />
                <path
                  d="M66 78L78 90"
                  stroke="#CBD5E1"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="eco-tr-empty-state__text">Không tìm thấy kết quả phù hợp</p>
          </div>
        </section>
      </div>
    </div>
  )
}
