'use client'

import { dsStudentAvatar } from '@/components/parents/shared/student-avatar'
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { STUDENT_TIMETABLES, type TimetablePeriod } from './timetable-data'
import { StudentPickerSheet } from '../shared/student-picker-sheet'
import { MOCK_STUDENTS, getStudent, type Student } from '@/lib/mock-data'

interface TimetableScreenProps {
  initialStudentId?: string
  onBack: () => void
}

export function TimetableScreen({
  initialStudentId = 'nhu',
  onBack,
}: TimetableScreenProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId)
  const [showPicker, setShowPicker] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isImageZoomed, setIsImageZoomed] = useState(false)

  // Get student schedule configuration
  // Header data comes from the app's own student; the schedule from the sample
  // timetable of that student id (or the default one).
  const appStudent = getStudent(selectedStudentId)
  const sampleConfig = STUDENT_TIMETABLES[selectedStudentId] || STUDENT_TIMETABLES['nhu']
  const currentConfig = appStudent
    ? {
        ...sampleConfig,
        studentId: appStudent.id,
        studentName: appStudent.name,
        studentCode: appStudent.code,
        className: appStudent.className,
        school: appStudent.school,
      }
    : sampleConfig

  // Sync student selection
  const handleSelectStudent = (student: Student) => {
    setSelectedStudentId(student.id)
    setShowPicker(false)
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur))
    }, 2800)
  }

  const handleDownload = () => {
    triggerToast('Đã tải xuống thời khoá biểu')
  }

  const periods: TimetablePeriod[] =
    currentConfig.periods || STUDENT_TIMETABLES['nhu'].periods!

  return (
    <div className="timetable-screen-container">
      {/* Topbar */}
      <div className="timetable-topbar">
        <button
          type="button"
          className="timetable-back-btn"
          onClick={onBack}
          aria-label="Quay lại"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="timetable-topbar-title">Thời khoá biểu</div>
        <div style={{ width: 36 }} />
      </div>

      <div className="timetable-scroll-body">
        {/* Student Profile Card (Image 4 & 5) */}
        <div className="timetable-student-card">
          <div className="timetable-student-avatar-wrap">
            <div className="timetable-student-avatar">
              <img src={appStudent ? dsStudentAvatar(appStudent) : '/ds/avatars/tieu-hoc-nu.svg'} alt="" style={{ width: '100%', height: '100%' }} />
            </div>
          </div>

          <div className="timetable-student-info">
            <div className="timetable-student-name">
              {currentConfig.studentName}
            </div>
            <div className="timetable-student-code">
              {currentConfig.studentCode}
            </div>
            <div className="timetable-student-class">
              {currentConfig.className}
            </div>
            <div className="timetable-student-school">
              {currentConfig.school}
            </div>
          </div>

          {/* Switch Student Button */}
          <button
            type="button"
            className="timetable-btn-change"
            onClick={() => setShowPicker(true)}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Đổi</span>
          </button>
        </div>

        {/* Time Period Subtitle */}
        <div className="timetable-period-row">
          <span className="timetable-period-icon">📒</span>
          <span className="timetable-period-text">
            <strong>Thời gian :</strong> {currentConfig.periodRange}
          </span>
        </div>

        {/* Mode 1: Table Schedule (Image 4 - Horizontally swipeable) */}
        {currentConfig.format === 'table' && (
          <div className="timetable-table-outer">
            <div className="timetable-table-scroll-container">
              <table className="timetable-table">
                <thead>
                  <tr>
                    <th className="th-time">Thời gian</th>
                    <th className="th-day">Thứ 2</th>
                    <th className="th-day">Thứ 3</th>
                    <th className="th-day">Thứ 4</th>
                    <th className="th-day">Thứ 5</th>
                    <th className="th-day">Thứ 6</th>
                    <th className="th-day">Thứ 7</th>
                  </tr>
                </thead>
                <tbody>
                  {periods.map((row, idx) => (
                    <tr key={idx}>
                      <td className="td-time">{row.time}</td>
                      <td className="td-subj">{row.t2}</td>
                      <td className="td-subj">{row.t3}</td>
                      <td className="td-subj">{row.t4}</td>
                      <td className="td-subj">{row.t5}</td>
                      <td className="td-subj">{row.t6}</td>
                      <td className="td-subj">{row.t7}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mode 2: Image Schedule (Image 5 - Official School Timetable Poster) */}
        {currentConfig.format === 'image' && (
          <div className="timetable-image-wrap">
            <div
              className="timetable-image-card"
              onClick={() => setIsImageZoomed(true)}
              role="button"
              tabIndex={0}
              title="Bấm để xem phóng to"
            >
              <Image
                src={currentConfig.imageUrl || '/timetable/timetable-lop1.png'}
                alt={`Thời khoá biểu ${currentConfig.className}`}
                width={473}
                height={328}
                className="timetable-poster-img"
                priority
              />
              <div className="timetable-image-zoom-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
                <span>Xem lớn</span>
              </div>
            </div>
          </div>
        )}

        {/* Action: Tải xuống */}
        <div className="timetable-download-wrap">
          <button
            type="button"
            className="timetable-btn-download"
            onClick={handleDownload}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1E293B"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Tải xuống</span>
          </button>
        </div>

        {/* Bottom Doodle Graph Paper Background Decoration */}
        <div className="timetable-doodle-bg-spacer" />
      </div>

      {/* Lightbox Zoom Modal for Image format */}
      {isImageZoomed && (
        <div
          className="timetable-lightbox-scrim"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="timetable-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="timetable-lightbox-close"
              onClick={() => setIsImageZoomed(false)}
            >
              ✕
            </button>
            <Image
              src={currentConfig.imageUrl || '/timetable/timetable-lop1.png'}
              alt={`Thời khoá biểu ${currentConfig.className}`}
              width={473}
              height={328}
              className="timetable-lightbox-img"
            />
          </div>
        </div>
      )}

      {/* Student Switcher Sheet */}
      {showPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS}
          selectedStudentId={selectedStudentId}
          onSelect={handleSelectStudent}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* Toast Notice */}
      {toastMessage && (
        <div className="eco-toast-notice">
          <div className="eco-toast-dot" />
          <div className="eco-toast-text">{toastMessage}</div>
        </div>
      )}
    </div>
  )
}
