'use client'

import React, { useState } from 'react'
import { TheSscLogo } from './provider-logos'

interface FeeTheSscScreenProps {
  onBack: () => void
  onChangeProvider: () => void
  onSuccessCheckInvoices: (studentInfo: {
    name: string
    code: string
    className: string
    school: string
  }) => void
}

export function FeeTheSscScreen({
  onBack,
  onChangeProvider,
  onSuccessCheckInvoices,
}: FeeTheSscScreenProps) {
  const [sscCodeInput, setSscCodeInput] = useState('')
  const [errorText, setErrorText] = useState<string | null>(null)

  const handleContinue = () => {
    const trimmed = sscCodeInput.trim()
    if (!trimmed) return

    if (
      trimmed === '1202999915000001' ||
      trimmed === '1202999915' ||
      trimmed === '1599990001' ||
      trimmed === '9192930041'
    ) {
      setErrorText(null)
      onSuccessCheckInvoices({
        name: 'Mai Ngọc Châu',
        code: trimmed,
        className: 'Lớp 11A1',
        school: 'Trường Kiểm soát dữ liệu SGD HCM 5',
      })
    } else {
      setErrorText('Không có hoá đơn nợ cần thanh toán')
    }
  }

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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
        <div className="eco-navbar__title">Hóa đơn học phí</div>
        <div className="eco-navbar__side eco-navbar__side--right" />
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {/* ECO.ProviderBar */}
        <div className="eco-provbar">
          <div className="eco-provbar__logo">
            <TheSscLogo size={32} />
          </div>
          <span className="eco-provbar__name" style={{ font: 'var(--text-body-m)', fontWeight: 500 }}>
            TheSSC
          </span>
          <button
            type="button"
            className="eco-provbar__action"
            onClick={onChangeProvider}
            style={{ font: 'var(--text-body-s)', fontWeight: 500 }}
          >
            Thay đổi
          </button>
        </div>

        {/* Section: Chọn hình thức tra cứu thông tin */}
        <section className="eco-seccard" style={{ borderRadius: 0 }}>
          <h4 className="eco-seccard__title" style={{ font: 'var(--text-body-m)', fontWeight: 700 }}>
            Chọn hình thức tra cứu thông tin
          </h4>
          <div className="eco-finput is-filled">
            <div
              className="eco-finput__box"
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="eco-finput__label" style={{ font: 'var(--text-body-xs)' }}>
                  Hình thức tra cứu
                </span>
                <span style={{ font: 'var(--text-body-m)', color: 'var(--text-primary)' }}>
                  Theo mã số SSC
                </span>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </section>

        {/* Section: Thông tin học sinh */}
        <section className="eco-seccard" style={{ borderRadius: 0 }}>
          <h4 className="eco-seccard__title" style={{ font: 'var(--text-body-m)', fontWeight: 700 }}>
            Thông tin học sinh
          </h4>
          <div className={`eco-finput ${sscCodeInput ? 'is-filled' : ''} ${errorText ? 'is-error' : ''}`}>
            <label className="eco-finput__box">
              {sscCodeInput && (
                <span className="eco-finput__label" style={{ font: 'var(--text-body-xs)' }}>
                  Mã số SSC
                </span>
              )}
              <input
                type="text"
                className="eco-finput__input"
                placeholder="Mã số SSC"
                value={sscCodeInput}
                onChange={(e) => {
                  setSscCodeInput(e.target.value)
                  if (errorText) setErrorText(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleContinue()
                }}
                style={{ font: 'var(--text-body-m)' }}
              />
            </label>
            {errorText && (
              <p className="eco-finput__error" style={{ font: 'var(--text-body-xs)' }}>
                {errorText}
              </p>
            )}
          </div>
        </section>

        {/* Section: Hoá đơn mẫu */}
        <section className="eco-seccard" style={{ borderRadius: 0 }}>
          <h4 className="eco-seccard__title" style={{ font: 'var(--text-body-m)', fontWeight: 700 }}>
            Hoá đơn mẫu
          </h4>
          <div className="fee-sample-invoice-card">
            <div className="fee-sample-top-gray" />

            <div className="fee-sample-body ssc-sample">
              <div className="fee-ssc-sample-header-row">
                <TheSscLogo size={22} />
                <div className="fee-ssc-barcode">
                  <svg width="130" height="28" viewBox="0 0 130 28" fill="#000000">
                    <rect x="0" y="0" width="3" height="28" />
                    <rect x="5" y="0" width="1.5" height="28" />
                    <rect x="8" y="0" width="4" height="28" />
                    <rect x="15" y="0" width="2" height="28" />
                    <rect x="19" y="0" width="5" height="28" />
                    <rect x="26" y="0" width="2" height="28" />
                    <rect x="30" y="0" width="4" height="28" />
                    <rect x="36" y="0" width="1.5" height="28" />
                    <rect x="40" y="0" width="3" height="28" />
                    <rect x="45" y="0" width="6" height="28" />
                    <rect x="53" y="0" width="2" height="28" />
                    <rect x="57" y="0" width="4" height="28" />
                    <rect x="63" y="0" width="1.5" height="28" />
                    <rect x="67" y="0" width="5" height="28" />
                    <rect x="74" y="0" width="2" height="28" />
                    <rect x="78" y="0" width="4" height="28" />
                    <rect x="84" y="0" width="2" height="28" />
                    <rect x="88" y="0" width="5" height="28" />
                    <rect x="95" y="0" width="3" height="28" />
                    <rect x="100" y="0" width="1.5" height="28" />
                    <rect x="103" y="0" width="4" height="28" />
                    <rect x="110" y="0" width="2" height="28" />
                    <rect x="114" y="0" width="5" height="28" />
                    <rect x="121" y="0" width="2" height="28" />
                    <rect x="125" y="0" width="4" height="28" />
                  </svg>
                </div>
              </div>

              <div className="fee-ssc-school-title">
                Trường Kiểm soát dữ liệu SGD HCM 5
              </div>
              <div className="fee-ssc-school-district">Quận 1</div>

              <div className="fee-ssc-doc-title">Phiếu Báo Học Phí</div>
              <div className="fee-ssc-doc-period">Tháng 06/2020-10/2020</div>

              <div className="fee-ssc-id-row">
                <span className="fee-ssc-highlight-box">
                  SSCID : <strong>1202999915000001</strong>
                </span>
                <span className="fee-ssc-student-code-text">Mã học sinh : 1599990001</span>
              </div>

              <div className="fee-ssc-meta-line">
                <span>Lớp: 11A1</span>
                <span> · </span>
                <span>Tên học sinh: <strong>Mai Ngọc Châu</strong></span>
              </div>

              <div className="fee-ssc-table-preview">
                <div className="fee-ssc-table-head">
                  <span>STT</span>
                  <span>Tên phí</span>
                  <span>Tháng</span>
                  <span>Số tiền</span>
                  <span>Miễn giảm</span>
                  <span>Thành tiền</span>
                </div>
                <div className="fee-ssc-table-row">
                  <span>1</span>
                  <span>Học phí chính khóa</span>
                  <span>10/2020</span>
                  <span>200,000</span>
                  <span>0</span>
                  <span>200,000</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ECO.ActionFooter */}
      <footer className="eco-actionfooter" style={{ position: 'sticky', bottom: 0, zIndex: 20 }}>
        <div className="eco-actionfooter__bar">
          <button
            type="button"
            className="eco-btn eco-btn--brand eco-btn--lg eco-btn--full"
            disabled={!sscCodeInput.trim()}
            onClick={handleContinue}
          >
            Tiếp tục
          </button>
        </div>
        <div className="eco-actionfooter__safe" />
      </footer>
    </div>
  )
}
