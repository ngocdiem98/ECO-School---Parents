'use client'

import { MilestoneItem, computeRadarPoints, STATUTORY_DOMAINS } from '@/lib/development-data'

interface RadarCardProps {
  milestones: MilestoneItem[]
  studentName: string
  ageMonths: number
  onViewTeacherReport?: () => void
}

export function DevelopmentRadarCard({
  milestones,
  studentName,
  ageMonths,
  onViewTeacherReport,
}: RadarCardProps) {
  const cx = 150
  const cy = 135
  const maxR = 90
  const { points, polygonPath, overallScore, statusText } = computeRadarPoints(milestones, cx, cy, maxR)

  // Web background concentric pentagons at 25%, 50%, 75%, 100%
  const concentricLevels = [0.25, 0.5, 0.75, 1.0]
  const angles = [90, 18, 306, 234, 162]

  const concentricPaths = concentricLevels.map((lvl) => {
    const r = maxR * lvl
    return (
      angles
        .map((deg, i) => {
          const rad = (deg * Math.PI) / 180
          const x = cx + r * Math.cos(rad)
          const y = cy - r * Math.sin(rad)
          return `${i === 0 ? 'M' : 'L'} ${Math.round(x)} ${Math.round(y)}`
        })
        .join(' ') + ' Z'
    )
  })

  // Radial axes lines from center to outer pentagon
  const radialLines = angles.map((deg) => {
    const rad = (deg * Math.PI) / 180
    return {
      x2: Math.round(cx + maxR * Math.cos(rad)),
      y2: Math.round(cy - maxR * Math.sin(rad)),
    }
  })

  const statusColor =
    overallScore >= 80 ? '#10B981' : overallScore >= 60 ? '#3B82F6' : '#F59E0B'

  return (
    <div className="dev-radar-card" style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '16px',
      margin: '0 16px 16px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      border: '1px solid #E5E7EB',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#1F2937' }}>
            La bàn phát triển toàn diện
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
            Theo Thông tư 51/2020/TT-BGDĐT · {ageMonths} tháng tuổi
          </div>
        </div>
        <div style={{
          background: `${statusColor}18`,
          color: statusColor,
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '11.5px',
          fontWeight: '600',
        }}>
          {statusText}
        </div>
      </div>

      {/* Pentagon SVG Chart */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', margin: '4px 0' }}>
        <svg width="300" height="260" viewBox="0 0 300 260" style={{ overflow: 'visible' }}>
          {/* Background Concentric Pentagons */}
          {concentricPaths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={i === concentricLevels.length - 1 ? '1.5' : '1'}
              strokeDasharray={i < concentricLevels.length - 1 ? '2 2' : undefined}
            />
          ))}

          {/* Radial Axis Lines */}
          {radialLines.map((line, i) => (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={line.x2}
              y2={line.y2}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}

          {/* Filled Developmental Polygon */}
          <path
            d={polygonPath}
            fill="rgba(59, 130, 246, 0.22)"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Vertex Points & Labels */}
          {points.map((pt, i) => {
            // Label offsets outward from point
            const labelOffsets = [
              { dx: 0, dy: -14, anchor: 'middle' },  // Top (Physical)
              { dx: 14, dy: 3, anchor: 'start' },    // Right Top (Cognitive)
              { dx: 12, dy: 14, anchor: 'start' },   // Right Bot (Language)
              { dx: -12, dy: 14, anchor: 'end' },    // Left Bot (Social)
              { dx: -14, dy: 3, anchor: 'end' },     // Left Top (Aesthetic)
            ]
            const offset = labelOffsets[i]

            return (
              <g key={pt.domain}>
                {/* Vertex dot */}
                <circle cx={pt.x} cy={pt.y} r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />

                {/* Domain Short Label & Score */}
                <text
                  x={radialLines[i].x2 + offset.dx}
                  y={radialLines[i].y2 + offset.dy}
                  textAnchor={offset.anchor as any}
                  fontSize="11"
                  fontWeight="600"
                  fill="#374151"
                >
                  {pt.label}
                </text>
                <text
                  x={radialLines[i].x2 + offset.dx}
                  y={radialLines[i].y2 + offset.dy + 12}
                  textAnchor={offset.anchor as any}
                  fontSize="10"
                  fontWeight="700"
                  fill={pt.color}
                >
                  {pt.percentage}%
                </text>
              </g>
            )
          })}

          {/* Center Score Indicator */}
          <circle cx={cx} cy={cy} r="18" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            fontSize="11"
            fontWeight="800"
            fill="#1E40AF"
          >
            {overallScore}%
          </text>
        </svg>
      </div>

      {/* Domain breakdown pill bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '6px',
        marginTop: '8px',
        paddingTop: '10px',
        borderTop: '1px dashed #F3F4F6',
      }}>
        {points.map((pt) => (
          <div key={pt.domain} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {pt.label}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: pt.color }}>
              {pt.achieved}/{pt.total}
            </div>
          </div>
        ))}
      </div>

      {/* Button to view Teacher Term Report */}
      {onViewTeacherReport && (
        <button
          onClick={onViewTeacherReport}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '8px 12px',
            background: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '10px',
            fontSize: '12px',
            color: '#374151',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>📋 Đánh giá cuối kỳ của Giáo viên chủ nhiệm</span>
          <span style={{ color: '#9CA3AF' }}>›</span>
        </button>
      )}
    </div>
  )
}
