'use client'

import React, { useState } from 'react'
import { MOCK_STUDENTS, getStudent, type Student } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import {
  CAP23_TABS,
  RESULTS_STUDENT_PROFILES,
  type ResultsStudentProfile,
  capHocFromGrade,
  getCap1TabData,
  getCap23CaNamData,
  getCap23HocKyData,
} from './results-data'
import { Cap1Screen } from './cap1-screen'
import { Cap23Screen } from './cap23-screen'

interface ResultsAppProps {
  studentId: string
  onBack: () => void
}

function NotebookSvgIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <g transform="rotate(-8 12 12)">
        <rect
          x="5"
          y="2.5"
          width="14.5"
          height="19"
          rx="2.2"
          fill="#F59E0B"
        />
        <rect
          x="6.2"
          y="2.5"
          width="13.3"
          height="19"
          rx="2"
          fill="#FBBF24"
        />
        <rect x="4" y="5" width="2.6" height="1.6" rx="0.8" fill="#4B5563" />
        <rect x="4" y="8.5" width="2.6" height="1.6" rx="0.8" fill="#4B5563" />
        <rect x="4" y="12" width="2.6" height="1.6" rx="0.8" fill="#4B5563" />
        <rect x="4" y="15.5" width="2.6" height="1.6" rx="0.8" fill="#4B5563" />
        <rect x="4" y="18.5" width="2.6" height="1.6" rx="0.8" fill="#4B5563" />
        <line
          x1="9"
          y1="7.5"
          x2="16.5"
          y2="7.5"
          stroke="#F59E0B"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <line
          x1="9"
          y1="11"
          x2="16.5"
          y2="11"
          stroke="#F59E0B"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <line
          x1="9"
          y1="14.5"
          x2="14.5"
          y2="14.5"
          stroke="#F59E0B"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export function ResultsApp({ studentId, onBack }: ResultsAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(studentId)
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0)
  const [showStudentPicker, setShowStudentPicker] = useState<boolean>(false)

  // Header data comes from the app's own student; the sample scores (grade level,
  // hasScores) come from RESULTS_STUDENT_PROFILES when this student has an entry.
  const appStudent = getStudent(selectedStudentId)
  const sample = RESULTS_STUDENT_PROFILES[selectedStudentId]
  const classDigits = appStudent?.className.match(/\d+/)?.[0]
  const studentProfile: ResultsStudentProfile = {
    id: selectedStudentId,
    grade: classDigits ? parseInt(classDigits, 10) : (sample?.grade ?? 1),
    hasScores: sample?.hasScores ?? false,
    name: appStudent?.name ?? sample?.name ?? '',
    code: appStudent?.code ?? sample?.code ?? '',
    className: appStudent?.className ?? sample?.className ?? '',
    school: appStudent?.school ?? sample?.school ?? '',
  }

  const capHoc = capHocFromGrade(studentProfile.grade)

  const handleSelectStudent = (student: Student) => {
    setSelectedStudentId(student.id)
    setActiveTabIndex(0)
    setShowStudentPicker(false)
  }

  return (
    <div className="kqht-screen-root">
      {/* 1. Standard White Topbar (ECO.NavBar) */}
      <header className="topbar absence-topbar eco-navbar eco-navbar--white">
        <button
          type="button"
          className="icon-btn"
          onClick={onBack}
          aria-label="Quay lại"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="topbar-title">Kết quả học tập</div>
        <span className="icon-btn-ghost" />
      </header>

      {/* 2. Standard Student Profile Header (ECO.StudentHeader) */}
      <div className="absence-student-header-card eco-stuhead carelog-stuhead">
        <div
          className="absence-student-header-main"
          onClick={() => setShowStudentPicker(true)}
          role="button"
          tabIndex={0}
          aria-label="Đổi học sinh"
        >
          <div className="activity-avatar-circle">
            <svg width="48" height="48" viewBox="0 0 46 46" fill="none">
              <circle cx="23" cy="23" r="23" fill="#D5DADF" />
              <circle cx="23" cy="17" r="7.5" fill="#9CA3AF" />
              <path
                d="M9 39.5C11.5 32.5 16.8 29 23 29C29.2 29 34.5 32.5 37 39.5"
                fill="#9CA3AF"
              />
            </svg>
          </div>
          <div className="absence-student-info-col">
            <div className="absence-student-name">{studentProfile.name}</div>
            <div className="absence-student-code">{studentProfile.code}</div>
            <div className="absence-student-meta">
              {studentProfile.className}
            </div>
            <div className="absence-student-meta">{studentProfile.school}</div>
          </div>
        </div>

        <button
          type="button"
          className="eco-stuhead__action"
          onClick={() => setShowStudentPicker(true)}
          aria-label="Đổi học sinh"
        >
          <span
            style={{
              width: 20,
              height: 20,
              display: 'inline-flex',
              flexShrink: 0,
            }}
          >
            <img
              src="/ds/payment/student-switch.svg"
              alt=""
              width={20}
              height={20}
              style={{ display: 'block' }}
            />
          </span>
          <span style={{ fontWeight: 600 }}>Đổi</span>
        </button>
      </div>

      {/* 3. Academic Year Bar (ECO.AcademicYearBar) */}
      <div className="eco-yearbar">
        <NotebookSvgIcon />
        <span>Năm học 2025 - 2026</span>
      </div>

      {/* 4. Branch UI by School Level: Primary (Cấp 1) vs Secondary/High School (Cấp 2 & 3) */}
      {capHoc === 1 ? (
        <Cap1Screen
          activeTabIndex={activeTabIndex}
          onSelectTab={setActiveTabIndex}
          data={getCap1TabData(studentProfile.id, activeTabIndex)}
        />
      ) : (
        <Cap23Screen
          activeTabIndex={activeTabIndex}
          onSelectTab={setActiveTabIndex}
          hocKyLabel={CAP23_TABS[activeTabIndex]?.label ?? 'Học kỳ I'}
          hocKyData={
            activeTabIndex !== 2
              ? getCap23HocKyData(studentProfile.id, activeTabIndex as 0 | 1)
              : undefined
          }
          caNamData={
            activeTabIndex === 2
              ? getCap23CaNamData(studentProfile.id)
              : undefined
          }
        />
      )}

      {/* 5. StudentPickerSheet ("Danh sách học sinh") */}
      {showStudentPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS}
          selectedStudentId={selectedStudentId}
          onSelect={handleSelectStudent}
          onClose={() => setShowStudentPicker(false)}
        />
      )}
    </div>
  )
}
