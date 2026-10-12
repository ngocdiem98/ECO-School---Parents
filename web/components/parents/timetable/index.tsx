'use client'

import { useState } from 'react'
import { CalendarDays, Download } from 'lucide-react'
import { MOCK_STUDENTS, getStudent, type Timetable } from '@/lib/mock-data'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { Toast } from '@/components/parents/shared/toast'
import { useToast } from '@/components/parents/shared/use-toast'

interface TimetableAppProps {
  studentId: string
  onBack: () => void
}

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6']

// Plain SVG export of the timetable so "Tải xuống" produces a real file.
function timetableSvg(t: Timetable, name: string): string {
  const rows = t.lessons
    .map(
      (l, i) =>
        `<text x="20" y="${110 + i * 40}" font-size="14" font-family="Arial">${l.period} (${l.time}): ${l.subjects.join(' | ')}</text>`,
    )
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${150 + t.lessons.length * 40}"><rect width="100%" height="100%" fill="#fff"/><text x="20" y="40" font-size="22" font-weight="700" font-family="Arial">Thời khoá biểu - ${name}</text><text x="20" y="70" font-size="14" font-family="Arial">Thời gian: ${t.period}</text>${rows}</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// "Thời khoá biểu" — mirrors SCREENS.timetable in ../../../scripts/app.js:
// validity period banner, the timetable and a "Tải xuống" action; "Chưa có
// thông tin" when the school hasn't published one. (PRD PH-07 is empty.)
export function TimetableApp({ studentId, onBack }: TimetableAppProps) {
  const [selectedId, setSelectedId] = useState(studentId)
  const [showPicker, setShowPicker] = useState(false)
  const { toast, show } = useToast()

  const student = getStudent(selectedId)
  if (!student) return null
  const t = student.timetable

  const download = () => {
    if (!t) return
    try {
      const a = document.createElement('a')
      a.href = timetableSvg(t, student.name)
      a.download = 'thoi-khoa-bieu.svg'
      document.body.appendChild(a)
      a.click()
      a.remove()
      show('Đã tải xuống thành công')
    } catch {
      show('Tải xuống không thành công, vui lòng thử lại.')
    }
  }

  return (
    <div className="screen">
      <TopBar title="Thời khoá biểu" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={() => setShowPicker(true)} />
      {!t ? (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">Chưa có thông tin</div>
        </div>
      ) : (
        <>
          <div className="tt-period">
            <CalendarDays size={20} />
            <span>
              <b>Thời gian:</b> {t.period}
            </span>
          </div>
          <div className="tt-wrap">
            <table className="tt-table">
              <thead>
                <tr>
                  <th className="tt-sticky">Tiết</th>
                  {DAYS.map((d) => (
                    <th key={d}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.lessons.map((l) => (
                  <tr key={l.period}>
                    <th className="tt-sticky">
                      {l.period}
                      <span>{l.time}</span>
                    </th>
                    {l.subjects.map((s, i) => (
                      <td key={i}>{s}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center" style={{ margin: '8px 0 16px' }}>
            <button className="btn-link tt-download" onClick={download}>
              <Download size={18} /> Tải xuống
            </button>
          </div>
        </>
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
      {toast && <Toast message={toast} />}
    </div>
  )
}
