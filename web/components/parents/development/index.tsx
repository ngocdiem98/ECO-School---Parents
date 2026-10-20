'use client'

import { useState } from 'react'
import { MOCK_STUDENTS, getStudent, isMamNonStudent } from '@/lib/mock-data'
import {
  STATUTORY_DOMAINS,
  StatutoryDomain,
  getStudentMilestones,
  getStudentAgeMonths,
  MilestoneItem,
} from '@/lib/development-data'
import { TopBar, StudentHeader } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { DevelopmentRadarCard } from './radar-card'
import { MilestoneCard } from './milestone-card'
import { MilestoneObservationSheet } from './observation-sheet'
import { TeacherReportSheet } from './teacher-report-sheet'

interface ChildDevelopmentScreenProps {
  studentId: string
  onBack: () => void
  onSelectStudent: (studentId: string) => void
  onNavigateToResults?: (studentId: string) => void
}

type FilterTab = 'all' | StatutoryDomain

export function ChildDevelopmentScreen({
  studentId,
  onBack,
  onSelectStudent,
  onNavigateToResults,
}: ChildDevelopmentScreenProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [showPicker, setShowPicker] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneItem | null>(null)
  const [showTeacherReport, setShowTeacherReport] = useState(false)
  const [studentMilestones, setStudentMilestones] = useState<MilestoneItem[]>(
    getStudentMilestones(selectedStudentId)
  )

  const student = getStudent(selectedStudentId)
  if (!student) return null

  // Enforce Kindergarten Boundary (Not applied to K12)
  const isPreschool = isMamNonStudent(student)
  if (!isPreschool) {
    return (
      <div className="screen">
        <TopBar title="Tiến trình phát triển" onBack={onBack} />
        <StudentHeader student={student} onChangeStudent={() => setShowPicker(true)} />
        <div style={{ padding: '32px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎒</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Không áp dụng cho khối phổ thông (K12)
          </div>
          <p style={{ fontSize: '13.5px', color: '#4B5563', lineHeight: 1.6, marginBottom: '24px' }}>
            Tính năng <strong>Tiến trình phát triển của trẻ</strong> chỉ áp dụng cho học sinh mầm non (dưới 6 tuổi) theo Thông tư 51/2020/TT-BGDĐT. Đối với học sinh cấp THPT như <strong>{student.name}</strong> ({student.className}), ba mẹ vui lòng theo dõi học lực tại sổ học bạ.
          </p>
          {onNavigateToResults && (
            <button
              onClick={() => onNavigateToResults(student.id)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              Xem Kết quả học tập / Học bạ số
            </button>
          )}
          <button
            onClick={() => setShowPicker(true)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#F3F4F6',
              color: '#374151',
              border: '1px solid #D1D5DB',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Đổi sang bé Mầm non
          </button>
        </div>

        {showPicker && (
          <StudentPickerSheet
            students={MOCK_STUDENTS}
            selectedStudentId={selectedStudentId}
            onSelect={(s) => {
              setSelectedStudentId(s.id)
              onSelectStudent(s.id)
              setStudentMilestones(getStudentMilestones(s.id))
              setShowPicker(false)
            }}
            onClose={() => setShowPicker(false)}
          />
        )}
      </div>
    )
  }

  const ageMonths = getStudentAgeMonths(student.dob)
  const filteredMilestones =
    activeTab === 'all'
      ? studentMilestones
      : studentMilestones.filter((m) => m.domain === activeTab)

  const handleObservationSuccess = (milestoneId: string, note: string) => {
    setStudentMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: 'awaiting_ack' as const,
              achievedDate: '05/10/2026',
            }
          : m
      )
    )
  }

  return (
    <div className="screen" style={{ paddingBottom: '70px' }}>
      <TopBar title="Tiến trình phát triển" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={() => setShowPicker(true)} />

      {/* 5-Axis Pentagon Radar Card */}
      <DevelopmentRadarCard
        milestones={studentMilestones}
        studentName={student.name}
        ageMonths={ageMonths}
        onViewTeacherReport={() => setShowTeacherReport(true)}
      />

      {/* Domain Filter Tabs */}
      <div
        className="tabs-scroll"
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '0 16px 12px',
          scrollbarWidth: 'none',
        }}
      >
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'all' ? '#1F2937' : '#F3F4F6',
            color: activeTab === 'all' ? '#FFFFFF' : '#4B5563',
          }}
        >
          Tất cả ({studentMilestones.length})
        </button>
        {STATUTORY_DOMAINS.map((dom) => {
          const isActive = activeTab === dom.key
          const count = studentMilestones.filter((m) => m.domain === dom.key).length
          return (
            <button
              key={dom.key}
              onClick={() => setActiveTab(dom.key)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                border: 'none',
                cursor: 'pointer',
                background: isActive ? dom.color : '#F3F4F6',
                color: isActive ? '#FFFFFF' : '#4B5563',
              }}
            >
              {dom.icon} {dom.shortLabel} ({count})
            </button>
          )
        })}
      </div>

      {/* Milestones List */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '10px' }}>
          Danh mục mốc phát triển chuẩn ({filteredMilestones.length})
        </div>
        {filteredMilestones.map((m) => (
          <MilestoneCard
            key={m.id}
            milestone={m}
            onRecordMilestone={(item) => setSelectedMilestone(item)}
          />
        ))}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="cta-bar sticky">
        <button
          className="btn btn-primary"
          onClick={() => {
            const pendingItem = studentMilestones.find((m) => m.status !== 'achieved') || studentMilestones[0]
            setSelectedMilestone(pendingItem)
          }}
        >
          📸 Ghi nhận mốc con đạt được tại nhà
        </button>
      </div>

      {/* Student Picker Sheet (Restricted to Preschool only) */}
      {showPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS.filter(isMamNonStudent)}
          selectedStudentId={selectedStudentId}
          onSelect={(s) => {
            setSelectedStudentId(s.id)
            onSelectStudent(s.id)
            setStudentMilestones(getStudentMilestones(s.id))
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* Home Observation Sheet with Decree 13/2023 Consent Gate */}
      {selectedMilestone && (
        <MilestoneObservationSheet
          milestone={selectedMilestone}
          childName={student.name}
          onClose={() => setSelectedMilestone(null)}
          onSubmitSuccess={handleObservationSuccess}
        />
      )}

      {/* Teacher Term Report Sheet */}
      {showTeacherReport && (
        <TeacherReportSheet
          childName={student.name}
          onClose={() => setShowTeacherReport(false)}
        />
      )}
    </div>
  )
}
