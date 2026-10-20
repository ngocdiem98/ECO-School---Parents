'use client'

import React from 'react'
import Image from 'next/image'

interface PostpaidFeeScreenProps {
  onBack: () => void
  onOpenFeePayment: () => void
}

export function PostpaidFeeScreen({
  onBack,
  onOpenFeePayment,
}: PostpaidFeeScreenProps) {
  return (
    <div
      className="screen"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        background: 'var(--bg-canvas)',
        paddingBottom: 0,
      }}
    >
      {/* ECO.NavBar */}
      <header
        className="eco-navbar eco-navbar--white"
        style={{ position: 'sticky', top: 0, zIndex: 20, borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="eco-navbar__side">
          <button
            type="button"
            className="eco-iconbtn"
            onClick={onBack}
            aria-label="Quay lại"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
        <div className="eco-navbar__title">ECOPayLater - Học Phí Trả Sau</div>
        <div className="eco-navbar__side eco-navbar__side--right" />
      </header>

      {/* Scrollable Body (Hoc phi tra sau 1 & 2) */}
      <div className="postpaid-scroll-body" style={{ flex: 1 }}>
        {/* Top Hero Banner Graphic (3D shiny ECOPayLater Học Phí Trả Sau) */}
        <div className="postpaid-hero-wrap">
          <Image
            src="/postpaid-fee/hero-banner.png"
            alt="ECOPayLater - Học Phí Trả Sau"
            width={473}
            height={232}
            className="postpaid-hero-img"
            priority
          />
        </div>

        {/* Dark Blue Container: 4 Core Features */}
        <div className="postpaid-blue-wrap">
          <Image
            src="/postpaid-fee/blue-features.png"
            alt="Học phí đến hạn - ECO bên bạn"
            width={473}
            height={387}
            className="postpaid-blue-img"
            priority
          />
        </div>

        {/* Section: What is ECOPayLater? */}
        <div className="postpaid-what-is-wrap">
          <Image
            src="/postpaid-fee/what-is-banner.png"
            alt="ECOPayLater - Học Phí Trả Sau là gì?"
            width={473}
            height={163}
            className="postpaid-what-is-img"
          />
        </div>

        {/* Partner & Trust Credentials Row (ECO & BVBank) */}
        <div className="postpaid-partner-wrap">
          <Image
            src="/postpaid-fee/partner-row.png"
            alt="ECO và BVBank bảo trợ"
            width={473}
            height={88}
            className="postpaid-partner-img"
          />
        </div>

        {/* Hoc phi tra sau 2: Unlock Next Period Callout Card (ECO.SectionCard + ECO.Button) */}
        <div style={{ padding: 'var(--space-16)' }}>
          <div
            className="eco-seccard"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-16)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <p style={{ margin: 0, font: 'var(--text-body-m)', fontWeight: 500, color: 'var(--text-primary)' }}>
              Hãy thanh toán học phí trên
              <br />
              ECO Me để mở tính năng
              <br />
              ECOPayLater - Học Phí Trả Sau
              <br />
              vào kỳ tiếp theo
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', width: '100%' }}>
              <button
                type="button"
                className="eco-btn eco-btn--brand eco-btn--lg eco-btn--full"
                onClick={onOpenFeePayment}
              >
                Thanh toán học phí ngay
              </button>

              <button
                type="button"
                className="eco-btn eco-btn--secondary eco-btn--lg eco-btn--full"
                onClick={onBack}
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
