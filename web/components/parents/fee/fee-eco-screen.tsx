'use client'

import React, { useState } from 'react'
import { FinvietLogo } from './provider-logos'

interface FeeEcoScreenProps {
  onBack: () => void
  onChangeProvider: () => void
  onSelectStudentInvoice: (studentId: string, studentName: string, studentCode: string) => void
}

interface SavedStudentInvoice {
  id: string
  providerName: string
  studentName: string
  studentCode: string
  hasUnpaidInvoices: boolean
}

const SAVED_STUDENTS: SavedStudentInvoice[] = [
  {
    id: 'nhu',
    providerName: 'ECO School',
    studentName: 'Huỳnh Ngọc Trúc Như',
    studentCode: '9192930041',
    hasUnpaidInvoices: true,
  },
  {
    id: 'duong',
    providerName: 'ECO School',
    studentName: 'Tạ Thái Dương',
    studentCode: '340000000002',
    hasUnpaidInvoices: false,
  },
  {
    id: 'lam',
    providerName: 'ECO School',
    studentName: 'Lý Tường Lam',
    studentCode: '9192930065',
    hasUnpaidInvoices: false,
  },
]

export function FeeEcoScreen({
  onBack,
  onChangeProvider,
  onSelectStudentInvoice,
}: FeeEcoScreenProps) {
  const [studentCodeInput, setStudentCodeInput] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)
  const [noDebtStudentId, setNoDebtStudentId] = useState<string | null>(null)

  const handleCardClick = (student: SavedStudentInvoice) => {
    if (student.hasUnpaidInvoices) {
      setNoDebtStudentId(null)
      onSelectStudentInvoice(student.id, student.studentName, student.studentCode)
    } else {
      setNoDebtStudentId(student.id)
    }
  }

  const handleContinue = () => {
    const trimmed = studentCodeInput.trim()
    if (!trimmed) return

    if (trimmed === '9192930041' || trimmed.toLowerCase() === 'nhu') {
      setInputError(null)
      onSelectStudentInvoice('nhu', 'Huỳnh Ngọc Trúc Như', '9192930041')
    } else {
      setInputError('Không có hoá đơn nợ cần thanh toán')
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
            <FinvietLogo size={32} />
          </div>
          <span className="eco-provbar__name" style={{ font: 'var(--text-body-m)', fontWeight: 500 }}>
            ECO School
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

        {/* Section 1: Thông tin học sinh (ECO.SectionCard + ECO.FloatingInput) */}
        <section className="eco-seccard" style={{ borderRadius: 0 }}>
          <h4 className="eco-seccard__title" style={{ font: 'var(--text-body-m)', fontWeight: 700 }}>
            Thông tin học sinh
          </h4>
          <div
            className={`eco-finput ${studentCodeInput ? 'is-filled' : ''} ${inputError ? 'is-error' : ''}`}
          >
            <label className="eco-finput__box">
              {studentCodeInput && (
                <span className="eco-finput__label" style={{ font: 'var(--text-body-xs)' }}>
                  Mã học sinh
                </span>
              )}
              <input
                type="text"
                className="eco-finput__input"
                placeholder="Mã học sinh"
                value={studentCodeInput}
                onChange={(e) => {
                  setStudentCodeInput(e.target.value)
                  if (inputError) setInputError(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleContinue()
                }}
                style={{ font: 'var(--text-body-m)' }}
              />
            </label>
            {inputError && (
              <p className="eco-finput__error" style={{ font: 'var(--text-body-xs)' }}>
                {inputError}
              </p>
            )}
          </div>
        </section>

        {/* Section 2: Hóa đơn đã lưu (ECO.SectionCard + ECO.SavedBillCard) */}
        <section className="eco-seccard" style={{ borderRadius: 0 }}>
          <h4 className="eco-seccard__title" style={{ font: 'var(--text-body-m)', fontWeight: 700 }}>
            Hóa đơn đã lưu
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
            {SAVED_STUDENTS.map((item) => {
              const isNoDebt = noDebtStudentId === item.id
              return (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <button
                    type="button"
                    className="eco-savedbill"
                    onClick={() => handleCardClick(item)}
                    style={isNoDebt ? { border: '1px solid #e01c1c' } : undefined}
                  >
                    <span className="eco-savedbill__icon">
                      <img
                        src="/ds/payment/service-tuition.svg"
                        alt=""
                        width={32}
                        height={32}
                        style={{ display: 'block', width: 32, height: 32 }}
                      />
                    </span>
                    <span className="eco-savedbill__text">
                      <span style={{ font: 'var(--text-body-s)', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {item.providerName}
                      </span>
                      <span style={{ font: 'var(--text-body-s)', color: 'var(--text-primary)' }}>
                        {item.studentName}
                      </span>
                      <span className="eco-savedbill__code" style={{ font: 'var(--text-body-xs)' }}>
                        {item.studentCode}
                      </span>
                    </span>
                  </button>
                  {isNoDebt && (
                    <p className="eco-finput__error" style={{ font: 'var(--text-body-xs)' }}>
                      Không có hoá đơn nợ cần thanh toán
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
            <button
              type="button"
              className="eco-provbar__action"
              style={{ font: 'var(--text-body-s)', fontWeight: 500 }}
            >
              Xem thêm
            </button>
          </div>
        </section>

        {/* Section 3: Hoá đơn mẫu */}
        <section className="eco-seccard" style={{ borderRadius: 0 }}>
          <h4 className="eco-seccard__title" style={{ font: 'var(--text-body-m)', fontWeight: 700 }}>
            Hoá đơn mẫu
          </h4>
          <div className="fee-sample-invoice-card">
            <div className="fee-sample-top-gray" />

            <div className="fee-sample-body">
              <div className="fee-sample-content-left">
                <div className="fee-sample-brand">
                  <FinvietLogo size={20} />
                </div>
                <div className="fee-sample-doc-title">PHIẾU BÁO THU TIỀN</div>
                <div className="fee-sample-doc-sub">Mã hóa đơn: 9294924</div>

                <div className="fee-sample-school">Trường Finviet</div>
                <div className="fee-sample-address">
                  <strong>Địa chỉ:</strong> 34 Hoàng Việt, Phường Tân Sơn Nhất, HCM
                </div>
                <div className="fee-sample-student">
                  Tên học sinh: <strong>Nguyễn Văn A</strong>
                </div>

                <div className="fee-sample-code-highlight-row">
                  <div className="fee-sample-code-box">
                    Mã học sinh: <strong>9192931210</strong>
                  </div>
                  <span className="fee-sample-code-pointer">Mã HS ghi tại đây</span>
                </div>

                <div className="fee-sample-class">Lớp 11A1</div>
              </div>

              <div className="fee-sample-qr-box">
                <img
                  src="/ds/payment/qr-sample.png"
                  alt="QR Sample"
                  width={74}
                  height={74}
                  style={{ display: 'block', width: 74, height: 74, objectFit: 'contain' }}
                />
                <div className="fee-sample-qr-note">Phí dịch vụ x,xxxd</div>
                <div className="fee-sample-qr-sub">Quét mã QR để thanh toán</div>
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
            disabled={!studentCodeInput.trim()}
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
