'use client'

import { useState } from 'react'
import { formatVND, type InvoiceItem, type InvoiceGroup } from '../invoice/invoice-data'

export interface FeeStudentMeta {
  name: string
  code: string
  className: string
  school: string
  providerName: string
}

interface FeeInvoiceSelectScreenProps {
  student: FeeStudentMeta
  onBack: () => void
  onConfirmPayment: (
    selectedItems: InvoiceItem[],
    totalAmount: number,
    periodLabel: string
  ) => void
}

export const MOCK_FEE_INVOICE_GROUPS: InvoiceGroup[] = [
  {
    id: 'fee-inv-group-1',
    monthLabel: 'Hóa đơn tháng 4/2026',
    totalAmount: 974000,
    items: [
      { id: 'fee-it-1', name: 'Học phí 04/2026', amount: 200000 },
      { id: 'fee-it-2', name: 'Tiền ăn tháng 04/2026', amount: 770000 },
      { id: 'fee-it-3', name: 'Học liệu', amount: 2000 },
      { id: 'fee-it-4', name: 'Tiếng Anh', amount: 1000 },
      { id: 'fee-it-5', name: 'Ngoại khóa', amount: 1000 },
    ],
  },
  {
    id: 'fee-inv-group-2',
    monthLabel: 'Hóa đơn tháng 4/2026',
    totalAmount: 1114000,
    items: [
      { id: 'fee-it-6', name: 'Học phí 04/2026', amount: 200000 },
      { id: 'fee-it-7', name: 'Tiền ăn tháng 04/2026', amount: 912000 },
      { id: 'fee-it-8', name: 'Học phẩm bổ sung', amount: 2000 },
    ],
  },
]

function PayCheckIcon({ checked, indeterminate }: { checked: boolean; indeterminate?: boolean }) {
  if (checked) {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="4" fill="#FAC515" />
        <path
          d="M5.5 10.2L8.4 13.1L14.6 6.9"
          stroke="#1F1F1F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (indeterminate) {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="4" fill="#FAC515" />
        <line x1="6" y1="10" x2="14" y2="10" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  return <span className="eco-paycheck__box" />
}

export function FeeInvoiceSelectScreen({
  student,
  onBack,
  onConfirmPayment,
}: FeeInvoiceSelectScreenProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<Record<string, boolean>>({})

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    [MOCK_FEE_INVOICE_GROUPS[0].id]: true,
    [MOCK_FEE_INVOICE_GROUPS[1].id]: false,
  })

  const toggleGroupExpand = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const handleToggleItem = (item: InvoiceItem) => {
    setSelectedItemIds((prev) => ({
      ...prev,
      [item.id]: !prev[item.id],
    }))
  }

  const handleToggleGroup = (group: InvoiceGroup) => {
    const allChecked = group.items.every((it) => !!selectedItemIds[it.id])
    const nextState = !allChecked
    setSelectedItemIds((prev) => {
      const next = { ...prev }
      group.items.forEach((it) => {
        next[it.id] = nextState
      })
      return next
    })
  }

  const allItems = MOCK_FEE_INVOICE_GROUPS.flatMap((g) => g.items)
  const selectedItemsList = allItems.filter((it) => !!selectedItemIds[it.id])
  const totalAmount = selectedItemsList.reduce((acc, it) => acc + it.amount, 0)
  const hasSelection = totalAmount > 0

  const handleConfirm = () => {
    if (!hasSelection) return
    const periodLabel = MOCK_FEE_INVOICE_GROUPS[0].monthLabel
    onConfirmPayment(selectedItemsList, totalAmount, periodLabel)
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
        <div className="eco-navbar__title">Thông tin hóa đơn</div>
        <div className="eco-navbar__side eco-navbar__side--right" />
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {/* Top Info Card: ECO.InfoSection + ECO.IconInfoRow + ECO.KeyValueRow */}
        <section className="eco-seccard" style={{ borderRadius: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          <div className="eco-infosec">
            <h4 className="eco-infosec__title" style={{ font: 'var(--text-body-m)', fontWeight: 500 }}>
              Thông tin học sinh
            </h4>
            <div className="eco-infosec__body">
              <div className="eco-iconrow">
                <img src="/ds/payment/student-user.svg" alt="" className="eco-iconrow__icon" />
                <span style={{ font: 'var(--text-body-s)' }}>{student.name}</span>
              </div>
              <div className="eco-iconrow">
                <img src="/ds/payment/student-barcode.svg" alt="" className="eco-iconrow__icon" />
                <span style={{ font: 'var(--text-body-s)' }}>{student.code}</span>
              </div>
              <div className="eco-iconrow">
                <img src="/ds/payment/student-class.svg" alt="" className="eco-iconrow__icon" />
                <span style={{ font: 'var(--text-body-s)' }}>{student.className}</span>
              </div>
              <div className="eco-iconrow">
                <img src="/ds/payment/student-school.svg" alt="" className="eco-iconrow__icon" />
                <span style={{ font: 'var(--text-body-s)' }}>{student.school}</span>
              </div>
            </div>
          </div>

          <div className="eco-infosec eco-infosec--divider">
            <h4 className="eco-infosec__title" style={{ font: 'var(--text-body-m)', fontWeight: 500 }}>
              Thông tin hoá đơn
            </h4>
            <div className="eco-infosec__body">
              <div className="eco-kv">
                <span className="eco-kv__label">Tên dịch vụ</span>
                <span className="eco-kv__value">Thanh toán học phí</span>
              </div>
              <div className="eco-kv">
                <span className="eco-kv__label">Nhà cung cấp</span>
                <span className="eco-kv__value">{student.providerName}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Hoá đơn chưa thanh toán (9) — ECO.BillGroup + ECO.PayCheckbox */}
        <section className="eco-seccard" style={{ borderRadius: 0 }}>
          <h4 className="eco-seccard__title" style={{ font: 'var(--text-body-m)', fontWeight: 500, marginBottom: 'var(--space-4)' }}>
            Hoá đơn chưa thanh toán (9)
          </h4>
          <p style={{ font: 'var(--text-body-xs)', color: 'var(--text-secondary)', margin: '0 0 var(--space-12)' }}>
            Chọn kỳ thanh toán
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
            {MOCK_FEE_INVOICE_GROUPS.map((group) => {
              const isExpanded = !!expandedGroups[group.id]
              const checkedCount = group.items.filter((it) => !!selectedItemIds[it.id]).length
              const isGroupChecked = checkedCount === group.items.length
              const isGroupIndeterminate = checkedCount > 0 && checkedCount < group.items.length

              return (
                <div key={group.id} className="eco-billgrp is-selectable">
                  <div className="eco-billgrp__head">
                    <button
                      type="button"
                      className="eco-paycheck"
                      onClick={() => handleToggleGroup(group)}
                      aria-label={group.monthLabel}
                    >
                      <PayCheckIcon checked={isGroupChecked} indeterminate={isGroupIndeterminate} />
                    </button>
                    <span
                      className="eco-billgrp__title"
                      onClick={() => toggleGroupExpand(group.id)}
                      style={{ font: 'var(--text-body-s)', fontWeight: 500, cursor: 'pointer' }}
                    >
                      {group.monthLabel}
                    </span>
                    <span
                      onClick={() => toggleGroupExpand(group.id)}
                      style={{ font: 'var(--text-body-s)', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {formatVND(group.totalAmount)}
                    </span>
                    <button
                      type="button"
                      className="eco-billgrp__chev"
                      onClick={() => toggleGroupExpand(group.id)}
                      aria-label="Mở rộng"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="eco-billgrp__items">
                      {group.items.map((item) => {
                        const isChecked = !!selectedItemIds[item.id]
                        return (
                          <div
                            key={item.id}
                            className="eco-billgrp__item"
                            onClick={() => handleToggleItem(item)}
                            style={{ cursor: 'pointer' }}
                          >
                            <button
                              type="button"
                              className="eco-paycheck"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleItem(item)
                              }}
                              aria-label={item.name}
                            >
                              <PayCheckIcon checked={isChecked} />
                            </button>
                            <span className="eco-billgrp__label" style={{ font: 'var(--text-body-s)' }}>
                              {item.name}
                            </span>
                            <span className="eco-billgrp__value" style={{ font: 'var(--text-body-s)' }}>
                              {formatVND(item.amount)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* ECO.TotalFooter */}
      <footer className="eco-totalfoot" style={{ position: 'sticky', bottom: 0, zIndex: 20 }}>
        <div className="eco-totalfoot__bar">
          <div className="eco-totalfoot__sum">
            <span className="eco-totalfoot__label" style={{ font: 'var(--text-body-s)' }}>
              Tổng tiền
            </span>
            <span className="eco-totalfoot__amount" style={{ font: 'var(--text-h5)', fontWeight: 700 }}>
              {formatVND(totalAmount)}
            </span>
          </div>
          <div className="eco-totalfoot__btn" style={{ flex: '0 0 auto' }}>
            <button
              type="button"
              className="eco-btn eco-btn--brand eco-btn--lg eco-btn--full"
              disabled={!hasSelection}
              onClick={handleConfirm}
              style={{
                whiteSpace: 'nowrap',
                font: 'var(--text-body-m)',
                fontWeight: 500,
                padding: '0 16px',
              }}
            >
              Xác nhận thanh toán
            </button>
          </div>
        </div>
        <div className="eco-actionfooter__safe" />
      </footer>
    </div>
  )
}
