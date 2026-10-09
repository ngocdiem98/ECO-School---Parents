'use client'

import { useState } from 'react'
import { TopBar } from '@/components/parents/shared/header'
import { fmtMoney, type Student } from '@/lib/mock-data'

// Mirrors SCREENS['fee-invoice'] — two branches: "lookup" (student typed a
// mã học sinh, uses invoices.sample) and "linked" (already-linked student,
// uses invoices.months grouped by month). The "Xác nhận thanh toán" CTA has
// no onClick: the vanilla app has no reference screenshot for a result
// screen here either (see prd.md, mục 4) — the button is left inert on
// purpose, same as vanilla's placeholder link, rather than inventing one.
export function FeeInvoiceScreen({
  student,
  mode,
  onBack,
}: {
  student: Student
  mode: 'lookup' | 'linked'
  onBack: () => void
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  let total = 0
  let body: React.ReactNode

  if (mode === 'lookup') {
    const items = student.invoices.sample ?? []
    body = (
      <>
        <div className="section-heading">Hoá đơn chưa thanh toán ({items.length})</div>
        <div
          className="section-heading"
          style={{ marginTop: -4, fontWeight: 400, color: 'var(--c-gray-500)', fontSize: 12 }}
        >
          Chọn kỳ thanh toán
        </div>
        <div className="invoice-group">
          {items.map((item, i) => {
            const id = 'lk' + i
            const checked = selected.has(id)
            if (checked) total += item.amount
            return (
              <div className="invoice-line" key={id} onClick={() => toggle(id)}>
                <span className={`checkbox ${checked ? 'checked' : ''}`}>{checked ? '✓' : ''}</span>
                <span>{item.name}</span>
                <span className="amt">{fmtMoney(item.amount)}</span>
              </div>
            )
          })}
        </div>
      </>
    )
  } else {
    const groups = student.invoices.months ?? []
    body = (
      <>
        <div className="section-heading">Hoá đơn chưa thanh toán ({groups.length})</div>
        <div
          className="section-heading"
          style={{ marginTop: -4, fontWeight: 400, color: 'var(--c-gray-500)', fontSize: 12 }}
        >
          Chọn kỳ thanh toán
        </div>
        {groups.map((group, gi) => (
          <div className="invoice-group" key={group.label}>
            <div className="invoice-group-head">
              <span>{group.label}</span>
              <span className="amt">{fmtMoney(group.total)}</span>
              <span className="chevron">▲</span>
            </div>
            {group.items.map((item, ii) => {
              const id = `g${gi}i${ii}`
              const checked = selected.has(id)
              if (checked) total += item.amount
              return (
                <div className="invoice-line" key={id} onClick={() => toggle(id)}>
                  <span className={`checkbox ${checked ? 'checked' : ''}`}>{checked ? '✓' : ''}</span>
                  <span>{item.name}</span>
                  <span className="amt">{fmtMoney(item.amount)}</span>
                </div>
              )
            })}
          </div>
        ))}
      </>
    )
  }

  return (
    <div className="screen">
      <TopBar title="Thông tin hoá đơn" onBack={onBack} />
      <div className="card">
        <div className="card-title">Thông tin học sinh</div>
        <div className="feedback-row">
          <span>{student.name}</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">{student.code}</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">Lớp {student.className}</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">{student.school}</span>
        </div>
        <div className="divider" />
        <div className="feedback-row">
          <span className="text-muted">Tên dịch vụ</span>
          <span>Thanh toán học phí</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">Nhà cung cấp</span>
          <span>ECO School</span>
        </div>
      </div>
      {body}
      <div className="total-bar">
        <div>
          <div className="total-label">Tổng tiền</div>
          <div className="total-value">{fmtMoney(total)}</div>
        </div>
        <button className="btn btn-primary" disabled={total === 0}>
          Xác nhận thanh toán
        </button>
      </div>
    </div>
  )
}
