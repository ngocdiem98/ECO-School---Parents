'use client'

import { useState } from 'react'
import { MOCK_STUDENTS, getStudent } from '@/lib/mock-data'
import { TopBar, StudentHeader } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'

interface ResultsAppProps {
  studentId: string
  onBack: () => void
}

// Mirrors SCREENS.results — a single screen (no sub-navigation), term tabs
// switch which column of the summary table is shown. `results: null`
// (e.g. Phan Khánh Vy, a mầm non student) renders an empty state instead.
export function ResultsApp({ studentId, onBack }: ResultsAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [term, setTerm] = useState('Học kỳ I')
  const [showPicker, setShowPicker] = useState(false)

  const student = getStudent(selectedStudentId)
  if (!student) return null

  const r = student.results

  return (
    <div className="screen">
      <TopBar title="Kết quả học tập" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={() => setShowPicker(true)} />

      {!r ? (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">Chưa có kết quả học tập</div>
        </div>
      ) : (
        <>
          <div className="field" style={{ marginBottom: 0 }}>
            <label style={{ fontWeight: 700 }}>▨ Năm học {r.year}</label>
          </div>
          <div className="tabs">
            {Object.keys(r.terms).map((t) => (
              <button
                key={t}
                className={`tab-pill ${term === t ? 'active' : ''}`}
                onClick={() => setTerm(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="section-heading">Tổng kết học kỳ</div>
          <div className="table-scroll">
            <table className="kv-table" style={{ margin: '0 16px', width: 'calc(100% - 32px)' }}>
              <thead>
                <tr>
                  <th>Danh mục</th>
                  <th className="num">{term}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Kết quả học tập</td>
                  <td className="num">{r.terms[term].study}</td>
                </tr>
                <tr>
                  <td>Kết quả hành vi</td>
                  <td className="num">{r.terms[term].behavior}</td>
                </tr>
                <tr>
                  <td>Số ngày nghỉ</td>
                  <td className="num">{r.terms[term].absentDays}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-muted" style={{ fontSize: 11.5, margin: '10px 16px' }}>
            Ghi chú: T: Tốt, K: Khá, Đ: Đạt, CD: Chưa đạt / G: Giỏi, TT: Tiên tiến, XS: Xuất sắc
          </div>
          <div className="section-heading">Kết quả học tập</div>
          <div className="table-scroll">
            <table className="kv-table" style={{ margin: '0 16px', width: 'calc(100% - 32px)' }}>
              <thead>
                <tr>
                  <th>Môn học</th>
                  <th className="num">ĐĐGTX</th>
                  <th className="num">ĐĐGK</th>
                </tr>
              </thead>
              <tbody>
                {r.subjects.map((sub) => (
                  <tr key={sub.name}>
                    <td>{sub.name}</td>
                    <td className="num">{sub.gtx}</td>
                    <td className="num">{sub.gk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS}
          selectedStudentId={selectedStudentId}
          onSelect={(s) => {
            setSelectedStudentId(s.id)
            setTerm('Học kỳ I')
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}
