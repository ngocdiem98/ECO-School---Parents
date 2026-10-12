'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { MOCK_STUDENTS, getStudent, isMamNonStudent, type GoodBehaviorWeek } from '@/lib/mock-data'
import { TopBar, StudentHeader } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { TicketArt } from './ticket-art'
import { currentWeekStart, groupByMonth, schoolYear, weekRange } from './utils'

interface PhieuBeNgoanAppProps {
  studentId: string
  onBack: () => void
}

type View = { screen: 'overview' } | { screen: 'detail'; monthKey: string; weekStart: string }

// [PH-17] Phiếu bé ngoan (read-only): overview with the school-year total,
// the current week's result and the history grouped by month (dots = weeks);
// detail with the week tabs 1…5 of a month, the ticket and the teacher's
// remark. Replaces the earlier vanilla-based "Phiếu của con / Tổng kết" tabs.
export function PhieuBeNgoanApp({ studentId, onBack }: PhieuBeNgoanAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [view, setView] = useState<View>({ screen: 'overview' })
  const [showPicker, setShowPicker] = useState(false)

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
      students={MOCK_STUDENTS.filter(isMamNonStudent)}
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
      return (
        <div className="screen">
          <TopBar title={month.label} onBack={() => setView({ screen: 'overview' })} />
          <StudentHeader student={student} onChangeStudent={() => setShowPicker(true)} />
          <div className="gb-weeks" role="tablist">
            {month.weeks.map((w, i) => (
              <button
                key={w.weekStart}
                role="tab"
                aria-selected={w.weekStart === week.weekStart}
                className={`gb-week ${w.weekStart === week.weekStart ? 'sel' : ''}`}
                onClick={() => setView({ screen: 'detail', monthKey: month.key, weekStart: w.weekStart })}
              >
                <span>{i + 1}</span>
                <i className={w.got ? 'got' : ''} />
              </button>
            ))}
          </div>
          <WeekResult week={week} isCurrent={week.weekStart === thisWeek} big />
          {week.comment && (
            <div className="gb-comment">
              <span className="post-avatar">{(week.teacher ?? 'G').split(' ').slice(-1)[0][0]}</span>
              <div>
                <b>Nhận xét từ GV {week.teacher}</b>
                <p>{week.comment}</p>
              </div>
            </div>
          )}
          {picker}
        </div>
      )
    }
  }

  return (
    <div className="screen">
      <TopBar title="Phiếu bé ngoan" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={() => setShowPicker(true)} />

      {!inYear.length ? (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">Chưa có thông tin</div>
        </div>
      ) : (
        <>
          <p className="gb-total">
            Bé đã nhận được <b>{total}</b> phiếu trong năm học{' '}
            <b>
              {sy.from} - {sy.to}
            </b>
          </p>
          {current && (
            <button
              className="gb-current"
              onClick={() =>
                setView({ screen: 'detail', monthKey: current.weekStart.slice(0, 7), weekStart: current.weekStart })
              }
            >
              <WeekResult week={current} isCurrent />
              <span className="gb-cta">{current.comment ? 'Xem nhận xét của giáo viên' : 'Xem chi tiết'}</span>
            </button>
          )}
          <div className="section-heading">Lịch sử</div>
          {months.map((m) => (
            <button
              className="gb-month"
              key={m.key}
              onClick={() => setView({ screen: 'detail', monthKey: m.key, weekStart: m.weeks[0].weekStart })}
            >
              <b>{m.label}</b>
              <span className="gb-dots">
                {m.weeks.map((w) => (
                  <i key={w.weekStart} className={w.got ? 'got' : ''} />
                ))}
              </span>
              <ChevronRight size={18} />
            </button>
          ))}
        </>
      )}
      {picker}
    </div>
  )
}

function WeekResult({ week, isCurrent, big }: { week: GoodBehaviorWeek; isCurrent: boolean; big?: boolean }) {
  return (
    <div className={`gb-result ${big ? 'big' : ''}`}>
      <TicketArt got={week.got} size={big ? 168 : 96} />
      <div className="gb-result-title">{week.got ? 'Chúc mừng bé đã nhận Phiếu Bé Ngoan' : 'Chưa có Phiếu Bé Ngoan'}</div>
      <div className="gb-result-time">
        {isCurrent ? 'Tuần này' : 'Tuần'}: {weekRange(week.weekStart)}
      </div>
    </div>
  )
}
