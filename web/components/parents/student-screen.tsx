'use client'

import { useState } from 'react'
import { ChevronRight, HelpCircle, Heart, IdCard, Inbox, Sparkles, UserRound } from 'lucide-react'
import { MOCK_STUDENTS, getStudent } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { StudentBar } from '@/components/parents/shared/student-bar'
import { eligibleStudents, type ServiceIntent } from '@/components/parents/shared/use-service-launcher'
import { PARENT_SERVICES, chunk } from '@/components/parents/shared/parent-services'
import { dsServiceIcon } from '@/components/parents/shared/ds-service-icon'
import { PagedIconGrid } from '@/components/parents/shared/paged-icon-grid'
import { Toast } from '@/components/parents/shared/toast'
import { useToast } from '@/components/parents/shared/use-toast'
import { getSurveyState, isParentEligibleForSurvey } from '@/lib/survey-storage'
import { CoachMarks, type CoachStep } from '@/components/parents/shared/coach-marks'
import { useFirstRun } from '@/components/parents/shared/first-run'

// First-run guide of the page (EDU-2106).
const COACH: CoachStep[] = [
  {
    target: 'sp-tiles',
    title: 'Hồ sơ và sức khoẻ của con',
    text: 'Bấm Hồ sơ học sinh để xem thông tin của con. Bấm Sức khoẻ để theo dõi chiều cao, cân nặng của con.',
  },
  {
    target: 'sp-services',
    title: 'Tiện ích của con',
    text: 'Theo dõi sát sao tình hình của con tại trường thông qua các chức năng chính. Lướt ngang để xem thêm.',
    place: 'above',
  },
  { target: 'sp-help', title: 'Hướng dẫn sử dụng', text: 'Bấm vào đây để xem cách dùng từng tính năng khi cần.' },
]

// Trang Học sinh (PRD "[PH] Enhance Trang Học sinh", Figma EDU-1819): a short
// page with the student bar, two entry tiles (Hồ sơ học sinh / Sức khoẻ), the
// Thẻ học sinh block (hidden when the school has no card), the service grid,
// the weekly digest banner and the "Chia sẻ ý kiến" card. Card details,
// settings and the profile live on their own screens.
interface StudentScreenProps {
  studentId: string
  onBack: () => void
  onSelectStudent: (studentId: string) => void
  onOpenProfile: (studentId: string, tab: 'info' | 'health') => void
  onOpenCard: (studentId: string) => void
  onOpenHelp: () => void
  onOpenService: (intent: ServiceIntent, studentId: string) => void
}

export function StudentScreen({
  studentId,
  onBack,
  onSelectStudent,
  onOpenProfile,
  onOpenCard,
  onOpenHelp,
  onOpenService,
}: StudentScreenProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [, setVersion] = useState(0)
  const { toast, show } = useToast()
  const coach = useFirstRun('coach-student')
  const student = getStudent(studentId)
  if (!student) return null

  const card = student.card
  const digest = student.weeklyDigest
  const canSwitch = MOCK_STUDENTS.length > 1

  const openDigest = () => {
    if (!digest) return
    digest.viewed = true // back from the digest turns the banner white (PH-21)
    setVersion((v) => v + 1)
    show('Nội dung Bản tin tuần theo PRD PH-21 (chưa dựng trong prototype)')
  }

  return (
    <div className="screen sp-screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
          ‹
        </button>
        <div className="topbar-title">Học sinh</div>
        <button className="icon-btn" data-coach="sp-help" onClick={onOpenHelp} aria-label="Hướng dẫn sử dụng">
          <HelpCircle size={24} strokeWidth={1.8} />
        </button>
      </div>

      <StudentBar student={student} onSwitch={canSwitch ? () => setShowPicker(true) : undefined} />

      {student.locked && (
        <div className="sp-alert" role="alert">
          <span className="sp-alert-icon" aria-hidden="true">
            !
          </span>
          <span>
            Học sinh đang tạm khóa, việc này hạn chế một số tính năng khi sử dụng, Vui lòng liên hệ <b>1900 9005</b> để
            được hỗ trợ mở khóa.
          </span>
        </div>
      )}

      <div className="sp-body">
        <div className="sp-tiles" data-coach="sp-tiles">
          <button className="sp-tile" onClick={() => onOpenProfile(student.id, 'info')}>
            <span className="sp-tile-icon sp-tile-icon--blue">
              <UserRound size={22} strokeWidth={1.8} />
            </span>
            Hồ sơ học sinh
          </button>
          <button className="sp-tile" onClick={() => onOpenProfile(student.id, 'health')}>
            <span className="sp-tile-icon sp-tile-icon--red">
              <Heart size={22} strokeWidth={1.8} />
            </span>
            Sức khoẻ
          </button>
        </div>

        {card && (
          <div className="sp-card">
            <div className="sp-card-head">
              <span className="sp-card-title">
                <IdCard size={20} strokeWidth={1.8} />
                Thẻ học sinh
              </span>
              <span className={`sp-chip ${card.status === 'locked' ? 'is-locked' : ''}`}>
                {card.status === 'locked' ? 'Tạm khoá' : 'Đang hoạt động'}
              </span>
            </div>
            <div className="sp-balance">
              <div>
                <div className="sp-balance-label">Số dư thẻ</div>
                <div className={`sp-balance-value ${card.status === 'locked' ? 'is-dim' : ''}`}>
                  {student.balance.toLocaleString('en-US')} <small>điểm</small>
                </div>
              </div>
              <button className="sp-outline-btn" onClick={() => onOpenCard(student.id)}>
                Xem chi tiết
              </button>
            </div>
          </div>
        )}

        <div className="sp-panel" data-coach="sp-services">
          <PagedIconGrid
            pages={chunk(
              PARENT_SERVICES.filter(
                (svc) => svc.intent && eligibleStudents(svc.intent).some((x) => x.id === student.id),
              ),
            ).map((page) =>
              page.map((svc) => ({
                ...svc,
                imgSrc: dsServiceIcon(svc.id),
                onClick: () => onOpenService(svc.intent!, student.id),
              })),
            )}
          />
        </div>

        {digest && (
          <div className={`sp-digest ${digest.viewed ? 'is-viewed' : ''}`}>
            <div className="sp-digest-row">
              <span className="sp-digest-icon">
                <Sparkles size={22} strokeWidth={1.6} />
              </span>
              <div className="sp-digest-text">
                {!digest.viewed && <small>Tuần {digest.weekLabel}</small>}
                <b>Tổng hợp thông tin tuần</b>
                {digest.viewed && <small>Tuần {digest.weekLabel}</small>}
              </div>
              <button className="sp-digest-btn" onClick={openDigest}>
                Xem ▷
              </button>
            </div>
            {!digest.viewed && <div className="sp-digest-foot">Tin sẽ được cập nhật vào 19:00 thứ 7 hàng tuần</div>}
          </div>
        )}

        {isParentEligibleForSurvey(getSurveyState()) && (
          <button className="sp-feedback" onClick={() => onOpenService('survey', student.id)}>
            <span className="sp-feedback-icon">
              <Inbox size={24} strokeWidth={1.6} />
            </span>
            <span className="sp-feedback-text">
              <b>Chia sẻ ý kiến</b>
              <small>Dành 1 phút chia sẻ trải nghiệm của bạn trên ứng dụng</small>
            </span>
            <ChevronRight size={20} className="sp-feedback-chev" />
          </button>
        )}
      </div>

      {showPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS}
          selectedStudentId={studentId}
          onSelect={(s) => {
            setShowPicker(false)
            onSelectStudent(s.id)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {coach.active && <CoachMarks steps={COACH} onDone={coach.finish} onSkip={coach.finish} />}

      {toast && <Toast message={toast} />}
    </div>
  )
}
