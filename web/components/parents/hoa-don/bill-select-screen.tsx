'use client'

import { TopBar } from '@/components/parents/shared/header'
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
    <div className="screen">
      <TopBar title="Thông tin hóa đơn" onBack={onBack} />
      <div className="card">
        <div className="card-title">Thông tin học sinh</div>
        <div className="feedback-row">
          <span>{student.name}</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">{student.code}</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">{student.className}</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">{student.school}</span>
        </div>
        <div className="divider" />
        <div className="card-title">Thông tin hoá đơn</div>
        <div className="feedback-row">
          <span className="text-muted">Tên dịch vụ</span>
          <span>Thanh toán học phí</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">Nhà cung cấp</span>
          <span>ECO School</span>
        </div>
      </div>

      <div className="section-heading">Hoá đơn chưa thanh toán ({openBills.length})</div>
      <div
        className="section-heading"
        style={{ marginTop: -4, fontWeight: 400, color: 'var(--c-gray-500)', fontSize: 12 }}
      >
        Chọn kỳ thanh toán
      </div>

      {openBills.map(({ bill, open }) => {
        const ids = open.map((it) => it.id)
        const count = ids.filter((id) => selected.has(id)).length
        const all = count === ids.length
        const state = all ? 'checked' : count > 0 ? 'partial' : ''
        return (
          <div className="invoice-group" key={bill.id}>
            <div className="invoice-group-head" onClick={() => toggleBill(ids, all)}>
              <span className={`checkbox ${state}`}>{all ? '✓' : count > 0 ? '–' : ''}</span>
              <span>{bill.label}</span>
              <span className="amt">{fmtMoney(sumItems(open))}</span>
            </div>
            {open.map((it) => {
              const checked = selected.has(it.id)
              return (
                <div className="invoice-line" key={it.id} onClick={() => toggleItem(it.id)}>
                  <span className={`checkbox ${checked ? 'checked' : ''}`}>{checked ? '✓' : ''}</span>
                  <span>{it.name}</span>
                  <span className="amt">{fmtMoney(it.amount)}</span>
                </div>
              )
            })}
          </div>
        )
      })}

      <div className="total-bar">
        <div>
          <div className="total-label">Tổng tiền</div>
          <div className="total-value">{fmtMoney(total)}</div>
        </div>
        <button className="btn btn-primary" disabled={total === 0} onClick={onContinue}>
          Xác nhận thanh toán
        </button>
      </div>
    </div>
  )
}
