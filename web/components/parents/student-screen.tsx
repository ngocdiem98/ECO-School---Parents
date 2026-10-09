'use client'

import { useState } from 'react'
import { MOCK_STUDENTS, getStudent, type HealthRecord } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

// Chỉ số Z (BMI-for-age z-score) classification per Quyết định số 3777/QĐ-BYT
// ngày 16/12/2024 của Bộ Y tế: z < -2 Thiếu cân, -2 ≤ z ≤ 2 Bình thường,
// z > 2 Thừa cân, z > 3 Béo phì (obese is a stricter sub-range of overweight,
// so its band must be checked before the wider "over" one below).
const Z_SCORE_BANDS = [
  { key: 'under', label: 'Thiếu cân', color: '#5c7cd1', max: -2, weight: 25 },
  { key: 'normal', label: 'Bình thường', color: '#5bb87a', max: 2, weight: 50 },
  { key: 'over', label: 'Thừa cân', color: '#d6a02c', max: 3, weight: 12.5 },
  { key: 'obese', label: 'Béo phì', color: '#cc9ba1', max: Infinity, weight: 12.5 },
]

function zScoreBand(z: number) {
  return Z_SCORE_BANDS.find((b) => z < b.max) ?? Z_SCORE_BANDS[Z_SCORE_BANDS.length - 1]
}

// High-level, non-diagnostic pointers per band — intentionally generic
// ("ăn đa dạng", "vận động phù hợp") rather than prescriptive dosing/menus,
// since anything more specific belongs with a doctor, not this app.
const Z_SCORE_ADVICE: Record<string, string[]> = {
  under: [
    'Cho bé ăn đủ bữa với thực phẩm đa dạng, giàu năng lượng và đạm (thịt, cá, trứng, sữa).',
    'Đảm bảo bé ngủ đủ giấc và vận động phù hợp lứa tuổi để ăn ngon, hấp thu tốt hơn.',
    'Theo dõi cân nặng, chiều cao định kỳ để sớm thấy sự thay đổi.',
  ],
  normal: [
    'Duy trì chế độ ăn cân đối, đủ các nhóm chất (đạm, tinh bột, chất béo, vitamin).',
    'Khuyến khích bé vận động, vui chơi ngoài trời mỗi ngày.',
    'Tiếp tục theo dõi định kỳ để sớm phát hiện thay đổi bất thường.',
  ],
  over: [
    'Điều chỉnh khẩu phần ăn, hạn chế đồ ngọt, nước có gas và đồ chiên rán.',
    'Tăng thời gian vận động, giảm thời gian xem màn hình của bé.',
    'Theo dõi sát cân nặng, chiều cao trong các lần đo tiếp theo.',
  ],
  obese: [
    'Xây dựng lại chế độ ăn khoa học: giảm tinh bột/đường, tăng rau xanh.',
    'Tăng cường vận động thể chất hằng ngày, hạn chế lối sống tĩnh tại.',
    'Nên đưa bé đi khám chuyên khoa dinh dưỡng để được theo dõi sát sao.',
  ],
}

// Position (in %) of a z-score along the gauge, clamped to [-4, 4] and
// piecewise-linear between the band boundaries (-2 / 2 / 3) so the marker
// lands proportionally inside its own segment, matching the boundary ticks.
function zScorePercent(z: number): number {
  const anchors: [number, number][] = [
    [-4, 0],
    [-2, 25],
    [2, 75],
    [3, 87.5],
    [4, 100],
  ]
  if (z <= -4) return 0
  if (z >= 4) return 100
  for (let i = 1; i < anchors.length; i++) {
    const [x0, p0] = anchors[i - 1]
    const [x1, p1] = anchors[i]
    if (z <= x1) return p0 + ((z - x0) / (x1 - x0)) * (p1 - p0)
  }
  return 100
}

function HealthCard({
  heightCm,
  weightKg,
  zScore,
  onInfoClick,
  onAdviceClick,
}: {
  heightCm: number
  weightKg: number
  zScore: number
  onInfoClick: () => void
  onAdviceClick: () => void
}) {
  const bmi = weightKg / (heightCm / 100) ** 2
  const band = zScoreBand(zScore)
  const pos = zScorePercent(zScore)

  return (
    <div className="health-frame">
      <div className="health-stats">
        <div className="health-stat">
          <div className="val">{heightCm}</div>
          <div className="lbl">Chiều cao (cm)</div>
        </div>
        <div className="health-stat">
          <div className="val">{weightKg}</div>
          <div className="lbl">Cân nặng (kg)</div>
        </div>
        <div className="health-stat">
          <div className="val">{bmi.toFixed(1)}</div>
          <div className="lbl">BMI</div>
        </div>
      </div>

      <div className="divider" />

      <div className="bmi">
        <div className="bmi-value-row">
          <span className="bmi-value">{zScore.toFixed(1)}</span>
          <span className="bmi-unit-group">
            <span className="bmi-unit">Z-score</span>
            <button className="bmi-info-btn" onClick={onInfoClick} aria-label="Thông tin về chỉ số Z-score">
              ⓘ
            </button>
          </span>
        </div>
        <div className="bmi-badge" style={{ background: band.color }}>
          {band.label}
        </div>
        <div className="bmi-track">
          <span className="bmi-tick" style={{ left: '25%' }}>-2</span>
          <span className="bmi-tick" style={{ left: '75%' }}>2</span>
          <span className="bmi-tick" style={{ left: '87.5%' }}>3</span>
          <span className="bmi-marker" style={{ left: `${pos}%` }} />
          <div className="bmi-bar">
            {Z_SCORE_BANDS.map((b) => (
              <span key={b.key} style={{ flex: b.weight, background: b.color }} />
            ))}
          </div>
        </div>
        <div className="bmi-caps">
          {Z_SCORE_BANDS.map((b) => (
            <span key={b.key} style={{ flex: b.weight }}>
              {b.label}
            </span>
          ))}
        </div>

        <button className="zscore-advice-row" onClick={onAdviceClick}>
          <span className="zscore-advice-row-icon">💡</span>
          <span className="zscore-advice-row-label">Gợi ý cho ba mẹ</span>
          <span className="zscore-advice-row-chevron">›</span>
        </button>
      </div>
    </div>
  )
}

// Simple, coarse trend read on the two most recent history entries — not a
// regression/slope, just "did it move enough to mention" so the advice sheet
// can lead with something specific to this child instead of static text.
function zScoreTrendLine(history: HealthRecord[]): string | null {
  if (history.length < 2) return null
  const [latest, previous] = history
  const delta = latest.zScore - previous.zScore
  if (Math.abs(delta) < 0.15) {
    return `Z-score ổn định so với lần đo trước (${previous.recordedAt}).`
  }
  const dir = delta > 0 ? 'tăng' : 'giảm'
  return `Z-score đã ${dir} ${Math.abs(delta).toFixed(1)} so với lần đo trước (${previous.recordedAt}).`
}

function ZScoreAdviceSheet({
  zScore,
  history,
  onClose,
}: {
  zScore: number
  history: HealthRecord[]
  onClose: () => void
}) {
  const band = zScoreBand(zScore)
  const trendLine = zScoreTrendLine(history)

  return (
    <OverlayPortal>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-head">
          <span className="t">Gợi ý cho ba mẹ</span>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        <div className="sheet-body" style={{ padding: '0 16px 20px' }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: '0 0 14px' }}>
            Bé đang ở nhóm <span style={{ fontWeight: 700, color: band.color }}>{band.label}</span>
            {trendLine ? <>. {trendLine}</> : '.'}
          </p>
          <ul className="zscore-advice-list">
            {Z_SCORE_ADVICE[band.key].map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          <div className="zscore-advice-note">
            Đây là gợi ý tham khảo ở mức cơ bản. Để có tư vấn cụ thể, ba mẹ nên
            đưa bé đi khám bác sĩ.
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}

// "Lịch sử chỉ số sức khoẻ" — newest entry first, capped to the last 6
// months by mock-data.ts itself (healthHistory only ever holds that window).
function HealthHistorySheet({ history, onClose }: { history: HealthRecord[]; onClose: () => void }) {
  return (
    <OverlayPortal>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-head">
          <span className="t">Lịch sử chỉ số sức khoẻ</span>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        <div className="sheet-body">
          <div className="text-muted" style={{ fontSize: 11.5, margin: '0 16px 10px' }}>
            Hiển thị các thay đổi trong 6 tháng gần nhất
          </div>
          <div className="table-scroll">
            <table className="kv-table" style={{ margin: '0 16px', width: 'calc(100% - 32px)' }}>
              <thead>
                <tr>
                  <th>Chỉ số</th>
                  <th>Z-score</th>
                  <th>Thời gian ghi nhận</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => {
                  const bmi = h.weightKg / (h.heightCm / 100) ** 2
                  const band = zScoreBand(h.zScore)
                  return (
                    <tr key={i}>
                      <td>
                        <div className="health-history-metrics">{h.heightCm} cm · {h.weightKg} kg</div>
                        <div className="health-history-sub">BMI {bmi.toFixed(1)}</div>
                      </td>
                      <td>
                        <div className="bmi-history-value">{h.zScore.toFixed(1)}</div>
                        <div className="bmi-history-band" style={{ color: band.color }}>
                          {band.label}
                        </div>
                      </td>
                      <td>{h.recordedAt}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}

// "Bộ Y tế Việt Nam" z-score reference bands, mirroring Z_SCORE_BANDS' cut-offs above.
function ZScoreInfoSheet({ onClose }: { onClose: () => void }) {
  return (
    <OverlayPortal>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-head">
          <span className="t">Chỉ số Z-score là gì?</span>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        <div className="sheet-body" style={{ padding: '0 16px 20px' }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: '0 0 14px' }}>
            Z-score (chỉ số Z) đánh giá tình trạng dinh dưỡng của trẻ bằng cách
            so sánh chỉ số BMI theo tuổi và giới tính của trẻ với quần thể
            tham chiếu chuẩn tăng trưởng, thay vì chỉ dùng một ngưỡng BMI cố
            định như người lớn.
          </p>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: '0 0 14px' }}>
            Ngưỡng phân loại áp dụng theo Quyết định số 3777/QĐ-BYT ngày 16
            tháng 12 năm 2024 của Bộ Y tế:
          </p>
          <ul style={{ fontSize: 13.5, lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
            <li>Dưới -2: Thiếu cân</li>
            <li>-2 đến 2: Bình thường</li>
            <li>Trên 2: Thừa cân</li>
            <li>Trên 3: Béo phì</li>
          </ul>
        </div>
      </div>
    </OverlayPortal>
  )
}

// Mirrors SCREENS.student in ../../scripts/app.js — a single (non-swiping)
// page1 icon grid. "Đóng học phí", "Nạp điểm vào thẻ", "Báo vắng", "Bài tập"
// and "Kết quả học tập" are wired; "Lịch sử chi tiêu", "Thời khoá biểu" and
// "Theo dõi điểm danh" stay inert (not rebuilt yet). "Cài đặt" (⚙) has no
// reference screenshot in the vanilla app either — stays inert here too.
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

interface StudentScreenProps {
  studentId: string
  onBack: () => void
  onSelectStudent: (studentId: string) => void
  onOpenProfile: (studentId: string) => void
  onOpenFee: (studentId: string) => void
  onOpenTopup: (studentId: string) => void
  onOpenAbsence: (studentId: string) => void
  onOpenHomework: (studentId: string) => void
  onOpenResults: (studentId: string) => void
}

export function StudentScreen({
  studentId,
  onBack,
  onSelectStudent,
  onOpenProfile,
  onOpenFee,
  onOpenTopup,
  onOpenAbsence,
  onOpenHomework,
  onOpenResults,
}: StudentScreenProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [showHealthHistory, setShowHealthHistory] = useState(false)
  const [showZScoreInfo, setShowZScoreInfo] = useState(false)
  const [showZScoreAdvice, setShowZScoreAdvice] = useState(false)
  const student = getStudent(studentId)
  if (!student) return null

  return (
    <div className="screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
          ‹
        </button>
        <div className="topbar-title">Học sinh</div>
        <span className="icon-btn-ghost" />
      </div>

      <div className="student-header">
        <button
          className="student-header-main"
          onClick={() => onOpenProfile(student.id)}
          aria-label="Hồ sơ học sinh"
        >
          <div className="avatar">{student.avatar}</div>
          <div className="info">
            <div className="student-name">{student.name}</div>
            <div className="meta">{student.code}</div>
            <div className="meta">{student.className}</div>
            <div className="meta">{student.school}</div>
          </div>
          <span className="student-header-chevron">›</span>
        </button>
        <button className="btn-change" onClick={() => setShowPicker(true)}>
          ⇄ Đổi
        </button>
      </div>

      <div className="balance-row">
        <span>Số dư thẻ</span>
        <span className="value">{student.balance.toLocaleString('vi-VN')} điểm</span>
      </div>

      <div className="icon-grid-wrap">
        <div className="icon-grid-page" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          {PAGE1.map(({ id, icon, label }) => {
            const isTopup = id === 'topup'
            const disabled = isTopup && !student.supportsTopUp
            let onClick: (() => void) | undefined
            if (!disabled) {
              if (id === 'fee') onClick = () => onOpenFee(student.id)
              else if (id === 'topup') onClick = () => onOpenTopup(student.id)
              else if (id === 'absence') onClick = () => onOpenAbsence(student.id)
              else if (id === 'homework') onClick = () => onOpenHomework(student.id)
              else if (id === 'results') onClick = () => onOpenResults(student.id)
            }
            return (
              <button key={id} className="icon-item" disabled={disabled} onClick={onClick}>
                <span className="icon-glyph">{icon}</span>
                <span className="icon-label">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="section-heading section-heading-row">
        <span>Chỉ số sức khoẻ</span>
        <button
          className="icon-btn"
          onClick={() => setShowHealthHistory(true)}
          aria-label="Lịch sử chỉ số sức khoẻ"
        >
          🕐
        </button>
      </div>
      <HealthCard
        heightCm={student.heightCm}
        weightKg={student.weightKg}
        zScore={student.zScore}
        onInfoClick={() => setShowZScoreInfo(true)}
        onAdviceClick={() => setShowZScoreAdvice(true)}
      />

      <div className="section-heading">Hoạt động gần đây</div>
      <div className="recent-frame">
        {student.recentActivity.length ? (
          student.recentActivity.map((a, i) => (
            <div className="list-item" key={i}>
              <span className="glyph">•</span>
              <div className="body">
                <div className="title">{a.title}</div>
                <div className="time">{a.time}</div>
              </div>
              {a.amount && <div className="amount">{a.amount}</div>}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="glyph">▢</div>
            <div className="text">Chưa có thông tin</div>
          </div>
        )}
      </div>

      <div className="cta-bar sticky">
        <button
          className="btn btn-primary"
          disabled={!student.supportsTopUp}
          onClick={() => onOpenTopup(student.id)}
        >
          Nạp điểm vào thẻ
        </button>
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

      {showHealthHistory && (
        <HealthHistorySheet
          history={student.healthHistory}
          onClose={() => setShowHealthHistory(false)}
        />
      )}

      {showZScoreInfo && <ZScoreInfoSheet onClose={() => setShowZScoreInfo(false)} />}

      {showZScoreAdvice && (
        <ZScoreAdviceSheet
          zScore={student.zScore}
          history={student.healthHistory}
          onClose={() => setShowZScoreAdvice(false)}
        />
      )}
    </div>
  )
}
