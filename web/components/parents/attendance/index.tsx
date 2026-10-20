'use client'

import { useState } from 'react'
import { CalendarCheck, CalendarClock, CalendarOff, CalendarX2, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  MOCK_STUDENTS,
  getStudent,
  type AttendanceDay,
  type AttendanceSession,
  type AttendanceStatus,
  type Student,
} from '@/lib/mock-data'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { eligibleStudents } from '@/components/parents/shared/use-service-launcher'
import { PhotoViewer } from '@/components/parents/shared/photo-viewer'
import { Toast } from '@/components/parents/shared/toast'
import { useToast } from '@/components/parents/shared/use-toast'
import { fmtDay, weekdayName } from '@/lib/school-data'

interface AttendanceAppProps {
  studentId: string
  onBack: () => void
  onCreateAbsence: (studentId: string) => void
}

type Tab = 'log' | 'stats'
type Which = 'full' | 'morning' | 'afternoon'

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const sessionOf = (d: AttendanceDay, which: Which): AttendanceSession | undefined => d[which]

// [PH-01] Theo dõi điểm danh. Tab "Nhật ký" is the per-day timeline (giờ vào
// lớp / giờ ra về, split Sáng / Chiều for 2-session schools), tab "Thống kê"
// the monthly counters + coloured calendar. Full-day schools get no session
// filter. Based on the PRD (v2.1, K12 update) and SCREENS.attendance in the
// vanilla app.
export function AttendanceApp({ studentId, onBack, onCreateAbsence }: AttendanceAppProps) {
  const now = new Date()
  const [selectedId, setSelectedId] = useState(studentId)
  const [tab, setTab] = useState<Tab>('log')
  const [logFilter, setLogFilter] = useState<'all' | 'morning' | 'afternoon'>('all')
  const [statSession, setStatSession] = useState<'morning' | 'afternoon'>('morning')
  const [month, setMonth] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [showPicker, setShowPicker] = useState(false)
  const switchable = eligibleStudents('attendance')
  const canSwitch = switchable.length > 1
  const [photo, setPhoto] = useState<string | null>(null)
  const { toast, show } = useToast()

  const student = getStudent(selectedId)
  if (!student) return null
  const { sessions, days } = student.attendance
  const two = sessions === 'two'

  return (
    <div className="screen">
      <TopBar title="Theo dõi điểm danh" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={canSwitch ? () => setShowPicker(true) : undefined} />
      <div className="subtabs">
        <button className={tab === 'log' ? 'active' : ''} onClick={() => setTab('log')}>
          Nhật ký
        </button>
        <button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>
          Thống kê
        </button>
      </div>

      {tab === 'log' ? (
        <LogTab days={days} two={two} filter={logFilter} onFilter={setLogFilter} onPhoto={setPhoto} />
      ) : (
        <StatsTab
          student={student}
          two={two}
          session={statSession}
          onSession={setStatSession}
          month={month}
          onMonth={setMonth}
          onCreateAbsence={() => onCreateAbsence(student.id)}
        />
      )}

      {showPicker && (
        <StudentPickerSheet
          students={switchable}
          selectedStudentId={selectedId}
          onSelect={(s) => {
            setSelectedId(s.id)
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
      {photo && <PhotoViewer photos={[photo]} startIndex={0} onClose={() => setPhoto(null)} onToast={show} />}
      {toast && <Toast message={toast} />}
    </div>
  )
}

function LogTab({
  days,
  two,
  filter,
  onFilter,
  onPhoto,
}: {
  days: AttendanceDay[]
  two: boolean
  filter: 'all' | 'morning' | 'afternoon'
  onFilter: (f: 'all' | 'morning' | 'afternoon') => void
  onPhoto: (src: string) => void
}) {
  const sorted = [...days].sort((a, b) => b.date.localeCompare(a.date))
  const whiches: Which[] = !two ? ['full'] : filter === 'all' ? ['morning', 'afternoon'] : [filter]
  const visible = sorted.filter((d) => whiches.some((w) => sessionOf(d, w)))

  return (
    <>
      {two && (
        <div className="tabs">
          {(
            [
              ['all', 'Tất cả'],
              ['morning', 'Buổi sáng'],
              ['afternoon', 'Buổi chiều'],
            ] as const
          ).map(([v, label]) => (
            <button key={v} className={`tab-pill ${filter === v ? 'active' : ''}`} onClick={() => onFilter(v)}>
              {label}
            </button>
          ))}
        </div>
      )}
      {visible.length ? (
        visible.map((d) => (
          <div className="card att-day" key={d.date}>
            <div className="att-date">
              {weekdayName(d.date)}, {fmtDay(d.date)}
            </div>
            {whiches.map((w) => {
              const s = sessionOf(d, w)
              if (!s) return null
              return (
                <div key={w}>
                  {two && <div className="att-session">{w === 'morning' ? 'SÁNG' : 'CHIỀU'}</div>}
                  <SessionRows s={s} onPhoto={onPhoto} />
                </div>
              )
            })}
          </div>
        ))
      ) : (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">Chưa có thông tin</div>
        </div>
      )}
    </>
  )
}

function SessionRows({ s, onPhoto }: { s: AttendanceSession; onPhoto: (src: string) => void }) {
  if (s.status === 'excused' || s.status === 'unexcused') {
    return (
      <div className="att-row">
        <span className={`att-tag ${s.status}`}>{s.status === 'excused' ? 'Vắng có phép' : 'Vắng không phép'}</span>
        {s.note && <span className="att-note">{s.note}</span>}
      </div>
    )
  }
  const inLate = s.status === 'late'
  const outTag = s.checkOut == null ? 'Chưa về' : s.outLate ? 'Về muộn' : 'Đúng giờ'
  return (
    <>
      <div className="att-row">
        <span className="att-label">Giờ vào lớp</span>
        <span className={`att-tag ${inLate ? 'late' : 'present'}`}>{inLate ? 'Đến muộn' : 'Đúng giờ'}</span>
        <span className="att-time">{s.checkIn}</span>
        {s.photoIn && (
          <button className="att-thumb" onClick={() => onPhoto(s.photoIn!)} aria-label="Xem ảnh điểm danh">
            <img src={s.photoIn} alt="" />
          </button>
        )}
      </div>
      <div className="att-row">
        <span className="att-label">Giờ ra về</span>
        <span className={`att-tag ${s.checkOut == null ? 'pending' : s.outLate ? 'late' : 'present'}`}>{outTag}</span>
        <span className="att-time">{s.checkOut ?? '--:--'}</span>
        {s.photoOut && (
          <button className="att-thumb" onClick={() => onPhoto(s.photoOut!)} aria-label="Xem ảnh điểm danh">
            <img src={s.photoOut} alt="" />
          </button>
        )}
      </div>
    </>
  )
}

const STATUS_CLASS: Record<AttendanceStatus, string> = {
  present: 'present',
  late: 'late',
  excused: 'excused',
  unexcused: 'unexcused',
}

function StatsTab({
  student,
  two,
  session,
  onSession,
  month,
  onMonth,
  onCreateAbsence,
}: {
  student: Student
  two: boolean
  session: 'morning' | 'afternoon'
  onSession: (s: 'morning' | 'afternoon') => void
  month: { y: number; m: number }
  onMonth: (m: { y: number; m: number }) => void
  onCreateAbsence: () => void
}) {
  const which: Which = two ? session : 'full'
  const prefix = `${month.y}-${String(month.m + 1).padStart(2, '0')}`
  const byDate = new Map<string, AttendanceSession>()
  student.attendance.days.forEach((d) => {
    const s = sessionOf(d, which)
    if (s && d.date.startsWith(prefix)) byDate.set(d.date, s)
  })
  const all = [...byDate.values()]
  const count = {
    present: all.filter((s) => s.status === 'present' || s.status === 'late').length,
    excused: all.filter((s) => s.status === 'excused').length,
    unexcused: all.filter((s) => s.status === 'unexcused').length,
    late: all.filter((s) => s.status === 'late').length,
  }

  const first = new Date(month.y, month.m, 1)
  const offset = (first.getDay() + 6) % 7
  const dim = new Date(month.y, month.m + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: dim }, (_, i) => i + 1)]
  while (cells.length % 7) cells.push(null)
  const today = new Date()
  const isToday = (d: number) => today.getFullYear() === month.y && today.getMonth() === month.m && today.getDate() === d

  const shift = (delta: number) => {
    const d = new Date(month.y, month.m + delta, 1)
    onMonth({ y: d.getFullYear(), m: d.getMonth() })
  }

  const KPIS = [
    { key: 'present', label: 'Có mặt', n: count.present, Icon: CalendarCheck },
    { key: 'excused', label: 'Vắng có phép', n: count.excused, Icon: CalendarOff },
    { key: 'unexcused', label: 'Vắng không phép', n: count.unexcused, Icon: CalendarX2 },
    { key: 'late', label: 'Đến muộn', n: count.late, Icon: CalendarClock },
  ]

  return (
    <>
      {two && (
        <div className="segmented" style={{ margin: '12px 16px 0' }}>
          <button className={session === 'morning' ? 'active' : ''} onClick={() => onSession('morning')}>
            Buổi sáng
          </button>
          <button className={session === 'afternoon' ? 'active' : ''} onClick={() => onSession('afternoon')}>
            Buổi chiều
          </button>
        </div>
      )}
      <div className="card">
        <div className="card-title">
          Thống kê tháng {String(month.m + 1).padStart(2, '0')}/{month.y}
        </div>
        <div className="stat-grid">
          {KPIS.map(({ key, label, n, Icon }) => (
            <div className="stat-item" key={key}>
              <span className={`stat-icon ${key}`}>
                <Icon size={20} />
              </span>
              <span>
                {label}
                <b>{n}</b>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="calendar">
        <div className="calendar-head">
          <span>
            Tháng {month.m + 1}, {month.y}
          </span>
          <span>
            <button className="nav-btn" onClick={() => shift(-1)} aria-label="Tháng trước">
              <ChevronLeft size={16} />
            </button>{' '}
            <button className="nav-btn" onClick={() => shift(1)} aria-label="Tháng sau">
              <ChevronRight size={16} />
            </button>
          </span>
        </div>
        <div className="calendar-grid">
          {WEEKDAYS.map((w) => (
            <span className="wd" key={w}>
              {w}
            </span>
          ))}
          {cells.map((d, i) => {
            if (!d) return <span className="day muted" key={i} />
            const iso = `${prefix}-${String(d).padStart(2, '0')}`
            const s = byDate.get(iso)
            return (
              <span className={`day ${s ? `cal-${STATUS_CLASS[s.status]}` : ''} ${isToday(d) ? 'today' : ''}`} key={i}>
                {d}
              </span>
            )
          })}
        </div>
        <div className="cal-legend">
          <span><i className="cal-present" />Có mặt</span>
          <span><i className="cal-excused" />Vắng có phép</span>
          <span><i className="cal-unexcused" />Vắng không phép</span>
          <span><i className="cal-late" />Đến muộn</span>
        </div>
      </div>
      <div className="cta-bar sticky">
        <button className="btn btn-primary" onClick={onCreateAbsence}>
          Tạo đơn báo vắng
        </button>
      </div>
    </>
  )
}
