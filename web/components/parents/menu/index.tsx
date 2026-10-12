'use client'

import { useState } from 'react'
import { ChevronDown, Download } from 'lucide-react'
import { MOCK_STUDENTS, getStudent } from '@/lib/mock-data'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import { PhotoViewer } from '@/components/parents/shared/photo-viewer'
import { Toast } from '@/components/parents/shared/toast'
import { useToast } from '@/components/parents/shared/use-toast'
import { addDays, fmtDay, menuFor, menuPoster, weekStartOf, type MenuWeek } from '@/lib/school-data'

interface MenuAppProps {
  studentId: string
  /** Deep link (from a notification): open this week. */
  weekStart?: string | null
  onBack: () => void
}

const DAY_HEADS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6']

// [PH-08] Thực đơn: weekly menu of the student's class (falling back to the
// school-wide menu), as an image or a table with the meal column pinned while
// scrolling sideways. Week picker = 4 past, current, 4 future weeks.
export function MenuApp({ studentId, weekStart, onBack }: MenuAppProps) {
  const current = weekStartOf(new Date())
  const [selectedId, setSelectedId] = useState(studentId)
  const [week, setWeek] = useState(weekStart ?? current)
  const [showPicker, setShowPicker] = useState(false)
  const [showWeeks, setShowWeeks] = useState(false)
  const [viewing, setViewing] = useState(false)
  const { toast, show } = useToast()

  const student = getStudent(selectedId)
  if (!student) return null
  const menu = menuFor(student, week)

  const download = (m: MenuWeek) => {
    try {
      const a = document.createElement('a')
      a.href = m.kind === 'image' ? m.image! : menuPoster(`THỰC ĐƠN ${fmtDay(week)}`, m.rows ?? [])
      a.download = `thuc-don-${week}.svg`
      document.body.appendChild(a)
      a.click()
      a.remove()
      show('Đã tải xuống thành công')
    } catch {
      show('Tải xuống thất bại')
    }
  }

  const weeks = Array.from({ length: 9 }, (_, i) => addDays(current, (i - 4) * 7))

  return (
    <div className="screen">
      <TopBar title="Thực đơn" onBack={onBack} />
      <div className="sticky-head">
        <StudentHeader student={student} onChangeStudent={() => setShowPicker(true)} />
      </div>
      <button className="week-pick" onClick={() => setShowWeeks(true)}>
        <span>
          Tuần: {fmtDay(week)} - {fmtDay(addDays(week, 6))}
        </span>
        <ChevronDown size={18} />
      </button>

      {!menu ? (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">Chưa có thực đơn cho tuần này</div>
        </div>
      ) : (
        <>
          {menu.kind === 'image' ? (
            <button className="menu-image" onClick={() => setViewing(true)}>
              <img src={menu.image} alt="Thực đơn" />
            </button>
          ) : (
            <div className="tt-wrap">
              <table className="tt-table">
                <thead>
                  <tr>
                    <th className="tt-sticky">Bữa ăn</th>
                    {DAY_HEADS.map((d, i) => (
                      <th key={d}>
                        {d}
                        <span>{fmtDay(addDays(week, i)).slice(0, 5)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {menu.rows!.map((r) => (
                    <tr key={r.meal}>
                      <th className="tt-sticky">{r.meal}</th>
                      {r.days.map((c, i) => (
                        <td key={i}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="text-center" style={{ margin: '12px 0 20px' }}>
            <button className="btn-link tt-download" onClick={() => download(menu)}>
              <Download size={18} /> Tải xuống
            </button>
          </div>
        </>
      )}

      {showWeeks && (
        <OverlayPortal>
          <div className="scrim" onClick={() => setShowWeeks(false)} />
          <div className="sheet">
            <div className="sheet-head">
              <span className="t">Chọn tuần</span>
              <button className="icon-btn" onClick={() => setShowWeeks(false)} aria-label="Đóng">
                ✕
              </button>
            </div>
            <div className="sheet-body">
              {weeks.map((w) => (
                <div
                  key={w}
                  className={`pick-row ${w === week ? 'selected' : ''}`}
                  onClick={() => {
                    setWeek(w)
                    setShowWeeks(false)
                  }}
                >
                  <div>
                    {fmtDay(w)} - {fmtDay(addDays(w, 6))}
                  </div>
                  {w === current && <div className="right">Tuần này</div>}
                </div>
              ))}
            </div>
          </div>
        </OverlayPortal>
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
      {viewing && menu?.image && (
        <PhotoViewer photos={[menu.image]} startIndex={0} onClose={() => setViewing(false)} onToast={show} />
      )}
      {toast && <Toast message={toast} />}
    </div>
  )
}
