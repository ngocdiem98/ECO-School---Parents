'use client'

import { useState } from 'react'
import { TopBar } from '@/components/parents/shared/header'
import { Chevron, PayCheckIcon } from './bill-ds'
import { fmtMoney, sumItems, type Bill, type Student } from '@/lib/mock-data'

// "Thông tin hóa đơn": pick which open items to pay. A bill's header checkbox
// is tri-state (none / some / all of its open items), matching the dash/check
// states in the design. Paid items are not listed here.
export function BillSelectScreen({
  student,
  bills,
  selected,
  onSelectedChange,
  onBack,
  onContinue,
}: {
  student: Student
  // Bills to pick from (the school year chosen on the list); all when omitted.
  bills?: Bill[]
  selected: Set<string>
  onSelectedChange: (next: Set<string>) => void
  onBack: () => void
  onContinue: () => void
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const openBills = (bills ?? student.bills)
    .map((b) => ({ bill: b, open: b.items.filter((it) => !it.paid) }))
    .filter((x) => x.open.length > 0)
  const total = sumItems(openBills.flatMap((x) => x.open).filter((it) => selected.has(it.id)))

  const toggleItem = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectedChange(next)
  }

  const toggleBill = (ids: string[], allChecked: boolean) => {
    const next = new Set(selected)
    ids.forEach((id) => (allChecked ? next.delete(id) : next.add(id)))
    onSelectedChange(next)
  }

  return (
    <div className="screen bill-ds">
      <TopBar title="Thông tin hóa đơn" onBack={onBack} />

      {/* InfoSection + IconInfoRow + KeyValueRow */}
      <section className="eco-seccard bill-seccard bill-info">
        <div className="eco-infosec">
          <h4 className="eco-infosec__title bill-ds-heading">Thông tin học sinh</h4>
          <div className="eco-infosec__body">
            <div className="eco-iconrow">
              <img src="/ds/payment/student-user.svg" alt="" className="eco-iconrow__icon" />
              <span className="bill-ds-row-text">{student.name}</span>
            </div>
            <div className="eco-iconrow">
              <img src="/ds/payment/student-barcode.svg" alt="" className="eco-iconrow__icon" />
              <span className="bill-ds-row-text">{student.code}</span>
            </div>
            <div className="eco-iconrow">
              <img src="/ds/payment/student-class.svg" alt="" className="eco-iconrow__icon" />
              <span className="bill-ds-row-text">{student.className}</span>
            </div>
            <div className="eco-iconrow">
              <img src="/ds/payment/student-school.svg" alt="" className="eco-iconrow__icon" />
              <span className="bill-ds-row-text">{student.school}</span>
            </div>
          </div>
        </div>
        <div className="eco-infosec eco-infosec--divider">
          <h4 className="eco-infosec__title bill-ds-heading">Thông tin hoá đơn</h4>
          <div className="eco-infosec__body">
            <div className="eco-kv">
              <span className="eco-kv__label">Tên dịch vụ</span>
              <span className="eco-kv__value">Thanh toán học phí</span>
            </div>
            <div className="eco-kv">
              <span className="eco-kv__label">Nhà cung cấp</span>
              <span className="eco-kv__value">ECO School</span>
            </div>
          </div>
        </div>
      </section>

      {/* BillGroup (selectable) + PayCheckbox */}
      <section className="eco-seccard bill-seccard">
        <h4 className="eco-seccard__title bill-ds-heading">Hoá đơn chưa thanh toán ({openBills.length})</h4>
        <p className="bill-ds-hint">Chọn kỳ thanh toán</p>
        <div className="bill-group-list">
          {openBills.map(({ bill, open }) => {
            const ids = open.map((it) => it.id)
            const count = ids.filter((id) => selected.has(id)).length
            const all = count === ids.length
            const expanded = !collapsed[bill.id]
            return (
              <div className="eco-billgrp is-selectable" key={bill.id}>
                <div className="eco-billgrp__head">
                  <button
                    type="button"
                    className="eco-paycheck"
                    onClick={() => toggleBill(ids, all)}
                    aria-label={bill.label}
                  >
                    <PayCheckIcon checked={all} indeterminate={count > 0 && !all} />
                  </button>
                  <span
                    className="eco-billgrp__title bill-ds-title"
                    onClick={() => setCollapsed((c) => ({ ...c, [bill.id]: expanded }))}
                    style={{ cursor: 'pointer' }}
                  >
                    {bill.label}
                  </span>
                  <span className="bill-ds-amt">{fmtMoney(sumItems(open))}</span>
                  <button
                    type="button"
                    className="eco-billgrp__chev"
                    onClick={() => setCollapsed((c) => ({ ...c, [bill.id]: expanded }))}
                    aria-label={expanded ? 'Thu gọn' : 'Mở rộng'}
                  >
                    <Chevron open={expanded} />
                  </button>
                </div>
                {expanded && (
                  <div className="eco-billgrp__items">
                    {open.map((it) => (
                      <div
                        className="eco-billgrp__item"
                        key={it.id}
                        onClick={() => toggleItem(it.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <button
                          type="button"
                          className="eco-paycheck"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleItem(it.id)
                          }}
                          aria-label={it.name}
                        >
                          <PayCheckIcon checked={selected.has(it.id)} />
                        </button>
                        <span className="eco-billgrp__label bill-ds-row-label">{it.name}</span>
                        <span className="eco-billgrp__value bill-ds-row-label">{fmtMoney(it.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* TotalFooter */}
      <footer className="eco-totalfoot bill-footer">
        <div className="eco-totalfoot__bar">
          <div className="eco-totalfoot__sum">
            <span className="eco-totalfoot__label bill-ds-row-text">Tổng tiền</span>
            <span className="eco-totalfoot__amount bill-ds-total">{fmtMoney(total)}</span>
          </div>
          <div className="eco-totalfoot__btn">
            <button
              type="button"
              className="eco-btn eco-btn--brand eco-btn--lg eco-btn--full bill-ds-cta"
              disabled={total === 0}
              onClick={onContinue}
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
