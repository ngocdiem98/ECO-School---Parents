'use client'

import { useState } from 'react'
import type { HealthRecord, Student } from '@/lib/mock-data'
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
  record,
  onInfoClick,
  onAdviceClick,
}: {
  record: { heightCm: number; weightKg: number; zScore: number } | null
  onInfoClick: () => void
  onAdviceClick: () => void
}) {
  // No measurement yet (Mầm non): every figure shows "-" and the marker is hidden.
  const bmi = record ? record.weightKg / (record.heightCm / 100) ** 2 : null
  const band = record ? zScoreBand(record.zScore) : null
  const pos = record ? zScorePercent(record.zScore) : null

  return (
    <div className="health-frame">
      <div className="health-stats">
        <div className="health-stat">
          <div className="val">{record ? record.heightCm : '-'}</div>
          <div className="lbl">Chiều cao (cm)</div>
        </div>
        <div className="health-stat">
          <div className="val">{record ? record.weightKg : '-'}</div>
          <div className="lbl">Cân nặng (kg)</div>
        </div>
        <div className="health-stat">
          <div className="val">{bmi !== null ? bmi.toFixed(1) : '-'}</div>
          <div className="lbl">BMI</div>
        </div>
      </div>

      <div className="divider" />

      <div className="bmi">
        <div className="bmi-value-row">
          <span className="bmi-value">{record ? record.zScore.toFixed(1) : '-'}</span>
          <span className="bmi-unit-group">
            <span className="bmi-unit">Z-score</span>
            <button className="bmi-info-btn" onClick={onInfoClick} aria-label="Thông tin về chỉ số Z-score">
              ⓘ
            </button>
          </span>
        </div>
        {band && (
          <div className="bmi-badge" style={{ background: band.color }}>
            {band.label}
          </div>
        )}
        <div className="bmi-track">
          <span className="bmi-tick" style={{ left: '25%' }}>-2</span>
          <span className="bmi-tick" style={{ left: '75%' }}>2</span>
          <span className="bmi-tick" style={{ left: '87.5%' }}>3</span>
          {pos !== null && <span className="bmi-marker" style={{ left: `${pos}%` }} />}
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
          <div className="text-muted" style={{ fontSize: 12, margin: '0 16px 10px' }}>
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
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 14px' }}>
            Z-score (chỉ số Z) đánh giá tình trạng dinh dưỡng của trẻ bằng cách
            so sánh chỉ số BMI theo tuổi và giới tính của trẻ với quần thể
            tham chiếu chuẩn tăng trưởng, thay vì chỉ dùng một ngưỡng BMI cố
            định như người lớn.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 14px' }}>
            Ngưỡng phân loại áp dụng theo Quyết định số 3777/QĐ-BYT ngày 16
            tháng 12 năm 2024 của Bộ Y tế:
          </p>
          <ul style={{ fontSize: 14, lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
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


// Tab "Sức khoẻ" của Hồ sơ học sinh. Logic and sub-screens follow PH-18 and
// EDU-1686: Chỉ số sức khoẻ is a Mầm non feature, so a K12 student sees the
// empty state (BR-14); a Mầm non student with no measurement yet sees "-".
export function HealthSection({ student, onOpenAdvice }: { student: Student; onOpenAdvice: () => void }) {
  const [showHistory, setShowHistory] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  if (!student.school.includes('Mầm non')) {
    return (
      <div className="hp-empty">
        <img src="/ds/payment/empty-bill.svg" alt="" width={140} height={140} />
        <div>Chưa có thông tin</div>
      </div>
    )
  }

  const latest = student.healthHistory[0]
  return (
    <>
      <div className="section-heading section-heading-row">
        <span>Chỉ số sức khoẻ</span>
        {latest && (
          <button className="icon-btn" onClick={() => setShowHistory(true)} aria-label="Lịch sử chỉ số sức khoẻ">
            🕐
          </button>
        )}
      </div>
      <HealthCard
        record={latest ? { heightCm: latest.heightCm, weightKg: latest.weightKg, zScore: latest.zScore } : null}
        onInfoClick={() => setShowInfo(true)}
        onAdviceClick={onOpenAdvice}
      />
      {showHistory && <HealthHistorySheet history={student.healthHistory} onClose={() => setShowHistory(false)} />}
      {showInfo && <ZScoreInfoSheet onClose={() => setShowInfo(false)} />}
    </>
  )
}
