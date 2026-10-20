'use client'

import { MOCK_STUDENTS } from '@/lib/mock-data'
import { useServiceLauncher, type ServiceNav } from '@/components/parents/shared/use-service-launcher'
import { PARENT_SERVICES, chunk } from '@/components/parents/shared/parent-services'
import { dsServiceIcon } from '@/components/parents/shared/ds-service-icon'
import { PagedIconGrid } from '@/components/parents/shared/paged-icon-grid'
import { StudentAvatar } from '@/components/parents/shared/student-avatar'

// Icons come from the shared catalogue (shared/parent-services.ts), 8 per
// swipeable page; entries without an intent (Học bạ số) stay inert.

interface ParentsHomeScreenProps extends ServiceNav {
  onBack: () => void
  onNavigateToStudent: (studentId: string) => void
  onNavigateToHelp: () => void
  onNavigateToLinkStudent: () => void
}

export function ParentsHomeScreen({
  onBack,
  onNavigateToStudent,
  onOpenService,
  onNavigateToHelp,
  onNavigateToLinkStudent,
}: ParentsHomeScreenProps) {
  const { launch, picker } = useServiceLauncher({ onOpenService })

  return (
    <div className="screen">
      <div className="brand-hero brand-hero--home">
        <button className="icon-btn brand-hero-back" aria-label="Quay lại ECO Me" onClick={onBack}>
          ‹
        </button>
        <button className="icon-btn brand-hero-help" aria-label="Trợ giúp" onClick={onNavigateToHelp}>
          ?
        </button>
        <h1>THẺ HỌC SINH THÔNG MINH</h1>
        <p>Bước tiến mới trong chuyển đổi số giáo dục</p>
      </div>

      <PagedIconGrid
        pages={chunk(PARENT_SERVICES).map((page) =>
          page.map((svc) => ({
            ...svc,
            imgSrc: dsServiceIcon(svc.id),
            disabled: !svc.intent,
            onClick: svc.intent ? () => launch(svc.intent!) : undefined,
          })),
        )}
      />

      <div className="section-heading">Danh sách học sinh</div>
      {MOCK_STUDENTS.map((s) => (
        <div className="student-card" key={s.id} onClick={() => onNavigateToStudent(s.id)}>
          <div className="student-card-head">
            <StudentAvatar student={s} />
            <div>
              <div className="student-name">{s.name}</div>
              <div className="student-code">{s.code}</div>
            </div>
          </div>
          <div className="student-card-body">
            <div className="kv-label">Trường</div>
            <div className="kv-value">{s.school}</div>
            <div className="kv-label">Lớp</div>
            <div className="kv-value">{s.className}</div>
            <div className="kv-label">Số dư thẻ</div>
            <div className="kv-value balance">{s.balance.toLocaleString('vi-VN')} điểm</div>
          </div>
        </div>
      ))}

      <button className="btn-add-student" onClick={onNavigateToLinkStudent}>
        Thêm học sinh mới +
      </button>

      {picker}
    </div>
  )
}
