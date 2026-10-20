'use client'

import React, { useState } from 'react'
import { getStudent } from '@/lib/mock-data'
import {
  getSpendingStudents,
  getSpendingTransactions,
  isoMonthsAgo,
  ddmmyyyyToIso,
  type SpendingStudent,
} from './spending-data'
import { SpendingDatePickerSheet } from './spending-date-picker-sheet'
import { SpendingStudentPickerSheet } from './spending-student-picker-sheet'

interface SpendingHistoryScreenProps {
  initialStudentId?: string
  onBack: () => void
}

type PeriodFilter = '3months' | '6months' | 'custom'

function TopupCardArrowIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      {/* Yellow card body (open top-right for green arrow) */}
      <path
        d="M15.5 6H5.5C4.11929 6 3 7.11929 3 8.5V18.5C3 19.8807 4.11929 21 5.5 21H19.5C20.8807 21 22 19.8807 22 18.5V15.5"
        stroke="#F59E0B"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Card horizontal stripe */}
      <path
        d="M3 10.5H13.5"
        stroke="#F59E0B"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* Card bottom chip detail */}
      <path
        d="M6.5 16.5H10"
        stroke="#F59E0B"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* Green downward deposit arrow */}
      <path
        d="M19.5 4.5V12M19.5 12L16.7 9.2M19.5 12L22.3 9.2"
        stroke="#16A34A"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SpendingHistoryScreen({
  initialStudentId = 'vy',
  onBack,
}: SpendingHistoryScreenProps) {
  const [selectedStudent, setSelectedStudent] = useState<SpendingStudent>(() => {
    const all = getSpendingStudents()
    return all.find((s) => s.id === initialStudentId) || all[0]
  })

  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('3months')
  const [customDate, setCustomDate] = useState<string | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showStudentPicker, setShowStudentPicker] = useState(false)
  const canSwitch = getSpendingStudents().length > 1

  const student = getStudent(selectedStudent.id)
  const all = student ? getSpendingTransactions(student) : []
  const start =
    periodFilter === 'custom' && customDate
      ? ddmmyyyyToIso(customDate)
      : isoMonthsAgo(periodFilter === '6months' ? 6 : 3)
  const end = periodFilter === 'custom' && customDate ? start : isoMonthsAgo(0)
  const transactions = all.filter((t) => t.date >= start && t.date <= end)

  const totalDeposited = transactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0)
  const totalUsed = transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc - t.amount, 0)

  const handleSelectDate = (dateStr: string) => {
    setCustomDate(dateStr)
    setPeriodFilter('custom')
  }

  return (
    <div
      className="screen"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        background: '#FFFFFF',
        paddingBottom: 0,
      }}
    >
      {/* ECO.NavBar */}
      <header
        className="eco-navbar eco-navbar--white"
        style={{ position: 'sticky', top: 0, zIndex: 20 }}
      >
        <div className="eco-navbar__side">
          <button
            type="button"
            className="eco-iconbtn"
            onClick={onBack}
            aria-label="Quay lại"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
        <div className="eco-navbar__title">Lịch sử chi tiêu</div>
        <div className="eco-navbar__side eco-navbar__side--right" />
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Controls Band: Grey container with Golden Student Banner & Filter Pills */}
        <div className="spending-top-controls-band">
          <div
            className="spending-student-banner-card"
            onClick={canSwitch ? () => setShowStudentPicker(true) : undefined}
            role={canSwitch ? 'button' : undefined}
            tabIndex={canSwitch ? 0 : undefined}
            onKeyDown={(e) => {
              if (canSwitch && (e.key === 'Enter' || e.key === ' ')) setShowStudentPicker(true)
            }}
            title={canSwitch ? 'Bấm để chọn học sinh khác' : undefined}
          >
            <div className="spending-banner-left">
              <div className="spending-banner-name">{selectedStudent.name}</div>
              <div className="spending-banner-code">{selectedStudent.code}</div>
            </div>
            {canSwitch && <div className="spending-banner-chevron">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>}
          </div>

          {/* Filter Section: Lọc theo */}
          <div className="spending-filter-section">
            <span className="spending-filter-lbl">Lọc theo</span>

            <button
              type="button"
              className={`spending-filter-pill ${periodFilter === 'custom' ? 'active-outline' : ''}`}
              onClick={() => setShowDatePicker(true)}
            >
              <span>{customDate ? customDate : 'Chọn ngày'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <button
              type="button"
              className={`spending-filter-pill ${periodFilter === '3months' ? 'active-fill' : ''}`}
              onClick={() => {
                setPeriodFilter('3months')
                setCustomDate(null)
              }}
            >
              3 tháng
            </button>

            <button
              type="button"
              className={`spending-filter-pill ${periodFilter === '6months' ? 'active-fill' : ''}`}
              onClick={() => {
                setPeriodFilter('6months')
                setCustomDate(null)
              }}
            >
              6 tháng
            </button>
          </div>
        </div>

        {/* Section: Nhật ký */}
        <section className="spending-log-section">
          <h4 className="spending-log-heading">Nhật ký</h4>

          {/* 2 Summary KPI Cards */}
          <div className="spending-kpi-row">
            <div className="spending-kpi-card">
              <div className="spending-kpi-lbl">Điểm đã nạp:</div>
              <div className="spending-kpi-val green">
                <span className="kpi-num">{totalDeposited.toLocaleString('en-US')}</span>
                <span className="kpi-unit">điểm</span>
              </div>
            </div>

            <div className="spending-kpi-card">
              <div className="spending-kpi-lbl">Điểm đã sử dụng:</div>
              <div className="spending-kpi-val dark">
                <span className="kpi-num">{totalUsed.toLocaleString('en-US')}</span>
                <span className="kpi-unit">điểm</span>
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div className="spending-tx-list">
            {transactions.map((tx) => (
              <div key={tx.id} className="spending-tx-item">
                <div className="spending-tx-icon-wrap">
                  <TopupCardArrowIcon />
                </div>

                <div className="spending-tx-info">
                  <div className="spending-tx-title">{tx.title}</div>
                  <div className="spending-tx-time">{tx.timestamp}</div>
                </div>

                <div className="spending-tx-amt" style={tx.amount < 0 ? { color: 'var(--text-label)' } : undefined}>
                  {tx.amount > 0 ? '+' : '-'}
                  {Math.abs(tx.amount).toLocaleString('en-US')} điểm
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="eco-empty" style={{ padding: '24px 0' }}>
                <img src="/ds/payment/empty-bill.svg" alt="" width={64} height={64} />
                <strong style={{ font: 'var(--text-body-m)', fontWeight: 500 }}>Chưa có giao dịch</strong>
                <p style={{ font: 'var(--text-body-xs)', color: 'var(--text-secondary)' }}>
                  Học sinh chưa có lịch sử nạp hoặc sử dụng điểm trong khoảng thời gian này
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Date Picker Sheet */}
      {showDatePicker && (
        <SpendingDatePickerSheet
          initialDay={14}
          onSelectDate={handleSelectDate}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {/* Student Picker Sheet */}
      {showStudentPicker && (
        <SpendingStudentPickerSheet
          selectedStudentId={selectedStudent.id}
          onSelect={(s) => setSelectedStudent(s)}
          onClose={() => setShowStudentPicker(false)}
        />
      )}
    </div>
  )
}
