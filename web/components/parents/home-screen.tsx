'use client'

import { useRef, useState } from 'react'
import { MOCK_STUDENTS } from '@/lib/mock-data'
import { useServiceLauncher, type ServiceIntent, type ServiceNav } from '@/components/parents/shared/use-service-launcher'

// Mirrors PAGE1_LABELS/PAGE2_LABELS + ICONS in ../../scripts/app.js (vanilla
// app) — same glyph-character icon system (not eduteachers' line-art SVGs),
// to keep pixel parity with the already-verified vanilla screens. Wired by
// Đợt 3: "Đóng học phí", "Nạp điểm vào thẻ", "Báo vắng", "Bài tập", "Kết quả
// học tập" (page 1), "Phiếu bé ngoan" and "Hóa đơn" (page 2), "?" help, "Thêm học sinh mới
// +". Every other icon stays an inert placeholder, same convention
// eduteachers uses for its own unbuilt entry points (see its CLAUDE.md).
const PAGE1 = [
  { id: 'fee', icon: '▣', label: 'Đóng học phí' },
  { id: 'topup', icon: '◈', label: 'Nạp điểm vào thẻ' },
  { id: 'spending', icon: '▥', label: 'Lịch sử chi tiêu' },
  { id: 'timetable', icon: '▦', label: 'Thời khoá biểu' },
  { id: 'attendance', icon: '◷', label: 'Theo dõi điểm danh' },
  { id: 'absence', icon: '✎', label: 'Báo vắng' },
  { id: 'homework', icon: '▧', label: 'Bài tập' },
  { id: 'results', icon: '▨', label: 'Kết quả học tập' },
]

const PAGE2 = [
  { id: 'hocba', icon: '▩', label: 'Học bạ số' },
  { id: 'thucdon', icon: '▥', label: 'Thực đơn' },
  { id: 'hoatdong', icon: '◐', label: 'Hoạt động' },
  { id: 'hoadon', icon: '▤', label: 'Hóa đơn' },
  { id: 'danthuoc', icon: '✛', label: 'Dặn thuốc' },
  { id: 'bangtin', icon: '▬', label: 'Bảng tin' },
  { id: 'nhatky', icon: '▭', label: 'Nhật ký chăm sóc' },
  { id: 'goodbehavior', icon: '★', label: 'Phiếu bé ngoan' },
]

const WIRED_PAGE1_IDS = new Set(['fee', 'topup', 'absence', 'homework', 'results'])

// Page 2 entries that open a feature (id → picker intent).
const WIRED_PAGE2_INTENTS: Record<string, ServiceIntent> = {
  goodbehavior: 'goodbehavior',
  hoadon: 'hoadon',
}

interface ParentsHomeScreenProps extends ServiceNav {
  onBack: () => void
  onNavigateToStudent: (studentId: string) => void
  onNavigateToHelp: () => void
  onNavigateToLinkStudent: () => void
}

export function ParentsHomeScreen({
  onBack,
  onNavigateToStudent,
  onNavigateToPhieuBeNgoan,
  onNavigateToFee,
  onNavigateToTopup,
  onNavigateToAbsence,
  onNavigateToHomework,
  onNavigateToResults,
  onNavigateToHoaDon,
  onNavigateToHelp,
  onNavigateToLinkStudent,
}: ParentsHomeScreenProps) {
  const [page, setPage] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    setPage(Math.round(el.scrollLeft / el.clientWidth))
  }

  const { launch, picker } = useServiceLauncher({
    onNavigateToPhieuBeNgoan,
    onNavigateToFee,
    onNavigateToTopup,
    onNavigateToAbsence,
    onNavigateToHomework,
    onNavigateToResults,
    onNavigateToHoaDon,
  })

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

      <div className="icon-grid-wrap">
        <div className="icon-grid-scroller" ref={scrollerRef} onScroll={handleScroll}>
          <div className="icon-grid-page">
            {PAGE1.map(({ id, icon, label }) => {
              const wired = WIRED_PAGE1_IDS.has(id)
              return (
                <button
                  key={id}
                  className="icon-item"
                  disabled={!wired}
                  onClick={wired ? () => launch(id as ServiceIntent) : undefined}
                >
                  <span className="icon-glyph">{icon}</span>
                  <span className="icon-label">{label}</span>
                </button>
              )
            })}
          </div>
          <div className="icon-grid-page">
            {PAGE2.map(({ id, icon, label }) => {
              const intent = WIRED_PAGE2_INTENTS[id]
              return (
                <button
                  key={id}
                  className="icon-item"
                  disabled={!intent}
                  onClick={intent ? () => launch(intent) : undefined}
                >
                  <span className="icon-glyph">{icon}</span>
                  <span className="icon-label">{label}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="icon-dots">
          <span className={`icon-dot ${page === 0 ? 'active' : ''}`} />
          <span className={`icon-dot ${page === 1 ? 'active' : ''}`} />
        </div>
      </div>

      <div className="section-heading">Danh sách học sinh</div>
      {MOCK_STUDENTS.map((s) => (
        <div className="student-card" key={s.id} onClick={() => onNavigateToStudent(s.id)}>
          <div className="student-card-head">
            <div className="avatar">{s.avatar}</div>
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
