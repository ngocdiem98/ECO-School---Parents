'use client'

import { useState } from 'react'
import { ChevronRight, CircleArrowDown, CircleArrowUp } from 'lucide-react'
import { MOCK_STUDENTS, getStudent } from '@/lib/mock-data'
import { TopBar } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

interface SpendingAppProps {
  studentId: string
  onBack: () => void
}

type Range = '3m' | '6m' | 'custom'

const fmtDay = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`
const fmtStamp = (at: string) => `${fmtDay(at)} - ${at.slice(11, 16)}`
const fmtPoints = (n: number) => `${n > 0 ? '+' : n < 0 ? '-' : ''}${Math.abs(n).toLocaleString('vi-VN')} điểm`

function isoMonthsAgo(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// "Lịch sử chi tiêu" — mirrors SCREENS.spending in ../../../scripts/app.js:
// student card (tap to switch), "Chọn ngày" / 3 tháng / 6 tháng filter chips,
// Tiền vào / Tiền ra totals and the transaction log.
export function SpendingApp({ studentId, onBack }: SpendingAppProps) {
  const [selectedId, setSelectedId] = useState(studentId)
  const [range, setRange] = useState<Range>('3m')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [showDates, setShowDates] = useState(false)

  const student = getStudent(selectedId)
  if (!student) return null

  const today = isoMonthsAgo(0)
  const start = range === 'custom' ? from : isoMonthsAgo(range === '3m' ? 3 : 6)
  const end = range === 'custom' ? to : today
  const txs = student.spending
    .filter((t) => (!start || t.at.slice(0, 10) >= start) && (!end || t.at.slice(0, 10) <= end))
    .sort((a, b) => b.at.localeCompare(a.at))
  const totalIn = txs.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const totalOut = txs.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0)

  return (
    <div className="screen">
      <TopBar title="Lịch sử chi tiêu" onBack={onBack} />
      <button className="spend-card" onClick={() => setShowPicker(true)}>
        <span>
          <span className="name">{student.name}</span>
          <span className="code">{student.code}</span>
        </span>
        <ChevronRight size={20} />
      </button>
      <div className="filter-row">
        <button className={`filter-chip ${range === 'custom' ? 'active' : ''}`} onClick={() => setShowDates(true)}>
          {range === 'custom' && (from || to) ? `${from ? fmtDay(from) : '...'} - ${to ? fmtDay(to) : '...'}` : 'Chọn ngày ▾'}
        </button>
        <button className={`filter-chip ${range === '3m' ? 'active' : ''}`} onClick={() => setRange('3m')}>
          3 tháng
        </button>
        <button className={`filter-chip ${range === '6m' ? 'active' : ''}`} onClick={() => setRange('6m')}>
          6 tháng
        </button>
      </div>
      <div className="section-heading">Nhật ký</div>
      <div className="summary-row">
        <div className="summary-box">
          Tiền vào<span className="val">{totalIn.toLocaleString('vi-VN')} điểm</span>
        </div>
        <div className="summary-box">
          Tiền ra<span className="val">{totalOut.toLocaleString('vi-VN')} điểm</span>
        </div>
      </div>
      {txs.length ? (
        txs.map((t) => (
          <div className="list-item" key={t.id}>
            <span className={`spend-glyph ${t.amount > 0 ? 'in' : 'out'}`}>
              {t.amount > 0 ? <CircleArrowDown size={20} /> : <CircleArrowUp size={20} />}
            </span>
            <div className="body">
              <div className="title">{t.title}</div>
              <div className="time">{fmtStamp(t.at)}</div>
            </div>
            <div className={`amount spend-amount ${t.amount > 0 ? 'in' : 'out'}`}>{fmtPoints(t.amount)}</div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">Chưa có giao dịch</div>
        </div>
      )}

      {showPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS}
          selectedStudentId={selectedId}
          onSelect={(s) => {
            setSelectedId(s.id)
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {showDates && (
        <DateRangeSheet
          from={from}
          to={to}
          onApply={(f, t) => {
            setFrom(f)
            setTo(t)
            setRange('custom')
            setShowDates(false)
          }}
          onClose={() => setShowDates(false)}
        />
      )}
    </div>
  )
}

function DateRangeSheet({
  from,
  to,
  onApply,
  onClose,
}: {
  from: string
  to: string
  onApply: (from: string, to: string) => void
  onClose: () => void
}) {
  const [f, setF] = useState(from)
  const [t, setT] = useState(to)
  const invalid = !!f && !!t && f > t
  return (
    <OverlayPortal>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-head">
          <span className="t">Chọn ngày</span>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        <div className="sheet-body">
          <div className="field-row" style={{ margin: '4px 16px' }}>
            <div className="field" style={{ margin: 0 }}>
              <label>Từ ngày</label>
              <input type="date" className="input-box" value={f} onChange={(e) => setF(e.target.value)} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Đến ngày</label>
              <input type="date" className="input-box" value={t} onChange={(e) => setT(e.target.value)} />
            </div>
          </div>
          {invalid && <div className="med-error" style={{ margin: '6px 16px 0' }}>Ngày không hợp lệ</div>}
          <div className="cta-bar">
            <button className="btn btn-primary" disabled={invalid || (!f && !t)} onClick={() => onApply(f, t)}>
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
