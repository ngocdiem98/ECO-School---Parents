'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ListFilter } from 'lucide-react'
import { MOCK_STUDENTS, getStudent, isMamNonStudent } from '@/lib/mock-data'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import { CARE_DIARY, fmtDay, weekdayName, type CareDay } from '@/lib/school-data'

interface DiaryAppProps {
  studentId: string
  onBack: () => void
}

type Filter = { mode: 'all' } | { mode: 'day'; day: string } | { mode: 'range'; from: string; to: string }

const dayTitle = (iso: string) => {
  const w = weekdayName(iso)
  return `${w === 'Chủ nhật' ? 'Chủ nhật' : 'Thứ ' + ({ 'Thứ hai': 2, 'Thứ ba': 3, 'Thứ tư': 4, 'Thứ năm': 5, 'Thứ sáu': 6, 'Thứ bảy': 7 } as Record<string, number>)[w]}, ${fmtDay(iso)}`
}

// [PH-12] Nhật ký chăm sóc (mầm non, read-only): days as accordions, newest
// first; the latest day with data is open by default. Collapsing a day keeps
// the daily comment and hides the timeline. Filter by one day or a range.
export function DiaryApp({ studentId, onBack }: DiaryAppProps) {
  const [selectedId, setSelectedId] = useState(studentId)
  const [filter, setFilter] = useState<Filter>({ mode: 'all' })
  const [showFilter, setShowFilter] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [closed, setClosed] = useState<Set<string>>(new Set())
  const [opened, setOpened] = useState<Set<string>>(new Set())

  const student = getStudent(selectedId)
  if (!student) return null

  const days = [...(CARE_DIARY[student.id] ?? [])]
    .filter((d) => d.items.length > 0 || d.comment)
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((d) =>
      filter.mode === 'all' ? true : filter.mode === 'day' ? d.date === filter.day : d.date >= filter.from && d.date <= filter.to,
    )
  const latest = days[0]?.date

  const isOpen = (d: CareDay) => (d.date === latest && !closed.has(d.date)) || opened.has(d.date)
  const toggle = (d: CareDay) => {
    const open = isOpen(d)
    const flip = (set: Set<string>, add: boolean) => {
      const n = new Set(set)
      add ? n.add(d.date) : n.delete(d.date)
      return n
    }
    if (d.date === latest) setClosed((c) => flip(c, open))
    else setOpened((o) => flip(o, !open))
  }

  const label =
    filter.mode === 'all'
      ? 'Chọn ngày'
      : filter.mode === 'day'
        ? fmtDay(filter.day)
        : `${fmtDay(filter.from)} - ${fmtDay(filter.to)}`

  return (
    <div className="screen">
      <TopBar title="Nhật ký chăm sóc" onBack={onBack} />
      <div className="sticky-head">
        <StudentHeader student={student} onChangeStudent={() => setShowPicker(true)} />
      </div>
      <div className="diary-filter">
        <span>Lọc theo</span>
        <button className={`filter-chip ${filter.mode !== 'all' ? 'active' : ''}`} onClick={() => setShowFilter(true)}>
          <ListFilter size={14} /> {label}
        </button>
        {filter.mode !== 'all' && (
          <button className="btn-link" onClick={() => setFilter({ mode: 'all' })}>
            Xóa lọc
          </button>
        )}
      </div>

      {!isMamNonStudent(student) || !days.length ? (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">Chưa có thông tin</div>
        </div>
      ) : (
        <>
          {days.map((d) => {
            const open = isOpen(d)
            return (
              <section className="card diary-day" key={d.date}>
                <button className="diary-head" onClick={() => toggle(d)}>
                  <b>{dayTitle(d.date)}</b>
                  {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {d.comment && (
                  <div className="diary-comment">
                    <b>Nhận xét hằng ngày:</b> {d.comment}
                  </div>
                )}
                {open && (
                  <div className="diary-timeline">
                    {[...d.items]
                      .sort((a, b) => b.time.localeCompare(a.time))
                      .map((it, i) => (
                        <div className="diary-item" key={i}>
                          <span className="diary-time">{it.time}</span>
                          <div>
                            <div>
                              <b>{it.kind}:</b> {it.detail}
                            </div>
                            {it.note && <div className="diary-note">Nhận xét: {it.note}</div>}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </section>
            )
          })}
          <div className="feed-end">Bạn đã xem hết nhật ký</div>
        </>
      )}

      {showFilter && <FilterSheet filter={filter} onApply={(f) => { setFilter(f); setShowFilter(false) }} onClose={() => setShowFilter(false)} />}
      {showPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS.filter(isMamNonStudent)}
          selectedStudentId={selectedId}
          onSelect={(s) => {
            setSelectedId(s.id)
            setFilter({ mode: 'all' })
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}

function FilterSheet({ filter, onApply, onClose }: { filter: Filter; onApply: (f: Filter) => void; onClose: () => void }) {
  const [mode, setMode] = useState<'day' | 'range'>(filter.mode === 'range' ? 'range' : 'day')
  const [day, setDay] = useState(filter.mode === 'day' ? filter.day : '')
  const [from, setFrom] = useState(filter.mode === 'range' ? filter.from : '')
  const [to, setTo] = useState(filter.mode === 'range' ? filter.to : '')
  const bad = mode === 'range' && !!from && !!to && from > to
  const ready = mode === 'day' ? !!day : !!from && !!to && !bad

  return (
    <OverlayPortal>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-head">
          <span className="t">Lọc theo ngày</span>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        <div className="sheet-body">
          <div className="segmented" style={{ margin: '4px 16px 0' }}>
            <button className={mode === 'day' ? 'active' : ''} onClick={() => setMode('day')}>
              Một ngày
            </button>
            <button className={mode === 'range' ? 'active' : ''} onClick={() => setMode('range')}>
              Khoảng ngày
            </button>
          </div>
          {mode === 'day' ? (
            <div className="field">
              <label>Ngày</label>
              <input type="date" className="input-box" value={day} onChange={(e) => setDay(e.target.value)} />
            </div>
          ) : (
            <>
              <div className="field-row" style={{ margin: '14px 16px 0' }}>
                <div className="field" style={{ margin: 0 }}>
                  <label>Từ ngày</label>
                  <input type="date" className="input-box" value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>Đến ngày</label>
                  <input type="date" className="input-box" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
              </div>
              {bad && <div className="med-error" style={{ margin: '6px 16px 0' }}>Ngày bắt đầu không được lớn hơn ngày kết thúc</div>}
            </>
          )}
          <div className="cta-bar">
            <button
              className="btn btn-primary"
              disabled={!ready}
              onClick={() => onApply(mode === 'day' ? { mode: 'day', day } : { mode: 'range', from, to })}
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
