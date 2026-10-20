'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { MOCK_STUDENTS, getStudent, isMamNonStudent, type GoodBehaviorWeek } from '@/lib/mock-data'
import { TopBar, StudentHeader } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { eligibleStudents } from '@/components/parents/shared/use-service-launcher'
import { currentWeekStart, fmtSent, groupByMonth, schoolYear, weekRange } from './utils'

interface PhieuBeNgoanAppProps {
  studentId: string
  onBack: () => void
}

type View = { screen: 'overview' } | { screen: 'detail'; monthKey: string; weekStart: string }

const mascot = (got: boolean) => `/phieu-be-ngoan/mascot-${got ? 'received' : 'missing'}.svg`

// [PH-17] Phiếu bé ngoan (read-only), laid out from the Figma frames: the
// overview has the school-year total, the "Tuần này" card (tap → that week in
// the detail, "Xem nhận xét của giáo viên" only when the teacher left a remark)
// and the history by month (dots = weeks, tap → the month's first week);
// the detail has the week tabs of a month, the mascot, the week range, the
// time it was sent and the teacher's remark (section hidden when empty).
export function PhieuBeNgoanApp({ studentId, onBack }: PhieuBeNgoanAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [view, setView] = useState<View>({ screen: 'overview' })
  const [showPicker, setShowPicker] = useState(false)
  const switchable = eligibleStudents('goodbehavior')
  const canSwitch = switchable.length > 1

  const student = getStudent(selectedStudentId)
  if (!student) return null

  const sy = schoolYear()
  const inYear = student.goodBehavior.weeks.filter((w) => {
    const d = new Date(w.weekStart + 'T00:00:00')
    return d >= new Date(sy.from, 7, 1) && d < new Date(sy.to, 7, 1)
  })
  const months = groupByMonth(inYear)
  const total = inYear.filter((w) => w.got).length
  const thisWeek = currentWeekStart()
  const current = inYear.find((w) => w.weekStart === thisWeek)

  const picker = showPicker && (
    <StudentPickerSheet
      students={switchable}
      selectedStudentId={selectedStudentId}
      onSelect={(s) => {
        setSelectedStudentId(s.id)
        setView({ screen: 'overview' })
        setShowPicker(false)
      }}
      onClose={() => setShowPicker(false)}
    />
  )

  if (view.screen === 'detail') {
    const month = months.find((m) => m.key === view.monthKey)
    if (month) {
      const week = month.weeks.find((w) => w.weekStart === view.weekStart) ?? month.weeks[0]
      const index = month.weeks.indexOf(week)
      const isCurrent = week.weekStart === thisWeek
      return (
        <div className="screen pbn-screen">
          <TopBar title={month.label} onBack={() => setView({ screen: 'overview' })} />
          <StudentHeader student={student} />
          <div className="pbn-body">
            <div className="pbn-weeks" role="tablist">
              {month.weeks.map((w, i) => (
                <button
                  key={w.weekStart}
                  role="tab"
                  aria-selected={w.weekStart === week.weekStart}
                  aria-label={`Tuần ${i + 1}: ${w.got ? 'có phiếu' : 'chưa có phiếu'}`}
                  className={`pbn-week ${w.weekStart === week.weekStart ? 'sel' : ''}`}
                  onClick={() => setView({ screen: 'detail', monthKey: month.key, weekStart: w.weekStart })}
                >
                  <i className={`pbn-dot ${w.got ? 'got' : ''}`} />
                  <span className="num">{i + 1}</span>
                </button>
              ))}
            </div>
            <div className="pbn-reward">
              <img src={mascot(week.got)} alt="" />
              <div className="pbn-reward-title">{week.got ? 'Chúc mừng bé đã nhận Phiếu Bé Ngoan' : 'Chưa có Phiếu Bé Ngoan'}</div>
              <WeekDate week={week} label={isCurrent ? 'Tuần này' : `Tuần ${index + 1}`} chip />
              {week.got && week.sentAt && (
                <div className="pbn-sent">
                  Gửi vào <b>{fmtSent(week.sentAt)}</b>
                </div>
              )}
            </div>
            {week.comment && (
              <div className="pbn-comment">
                <div className="pbn-comment-by">
                  Nhận xét từ <b>GV {week.teacher}</b>
                </div>
                <p>{week.comment}</p>
              </div>
            )}
          </div>
          {picker}
        </div>
      )
    }
  }

  return (
    <div className="screen pbn-screen">
      <TopBar title="Phiếu bé ngoan" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={canSwitch ? () => setShowPicker(true) : undefined} />

      {!inYear.length ? (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">Chưa có thông tin</div>
        </div>
      ) : (
        <div className="pbn-body">
          <p className="pbn-total">
            Bé đã nhận được <span className="n">{total} phiếu</span> trong năm học{' '}
            <b>
              {sy.from} - {sy.to}
            </b>
          </p>
          {current && (
            <button
              className="pbn-current"
              onClick={() =>
                setView({ screen: 'detail', monthKey: current.weekStart.slice(0, 7), weekStart: current.weekStart })
              }
            >
              <img src={mascot(current.got)} alt="" />
              <span className="pbn-current-title">{current.got ? 'Chúc mừng bé đã nhận Phiếu Bé Ngoan' : 'Chưa có Phiếu Bé Ngoan'}</span>
              <WeekDate week={current} label="Tuần này" />
              {current.got && current.comment && <span className="pbn-link">Xem nhận xét của giáo viên</span>}
            </button>
          )}
          <div className="pbn-months">
            {months.map((m) => (
              <button
                className="pbn-month"
                key={m.key}
                onClick={() => setView({ screen: 'detail', monthKey: m.key, weekStart: m.weeks[0].weekStart })}
              >
                <span className="pbn-month-main">
                  <span className="pbn-month-title">{m.label}</span>
                  <span className="pbn-month-status">
                    Phiếu bé ngoan:
                    <span className="pbn-dots">
                      {m.weeks.map((w) => (
                        <i key={w.weekStart} className={`pbn-dot ${w.got ? 'got' : ''}`} />
                      ))}
                    </span>
                  </span>
                </span>
                <ChevronRight size={24} />
              </button>
            ))}
          </div>
        </div>
      )}
      {picker}
    </div>
  )
}

function WeekDate({ week, label, chip }: { week: GoodBehaviorWeek; label: string; chip?: boolean }) {
  return (
    <span className={`pbn-date ${chip ? 'is-chip' : ''}`}>
      {label}
      <span className="dot">•</span>
      {weekRange(week.weekStart)}
    </span>
  )
}
