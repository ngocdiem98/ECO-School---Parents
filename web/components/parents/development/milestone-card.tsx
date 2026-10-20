'use client'

import { MilestoneItem, STATUTORY_DOMAINS } from '@/lib/development-data'

interface MilestoneCardProps {
  milestone: MilestoneItem
  onRecordMilestone?: (milestone: MilestoneItem) => void
}

export function MilestoneCard({ milestone, onRecordMilestone }: MilestoneCardProps) {
  const domainMeta = STATUTORY_DOMAINS.find((d) => d.key === milestone.domain)
  const isDelayed = milestone.status === 'delayed'
  const isAchieved = milestone.status === 'achieved'
  const isAwaiting = milestone.status === 'awaiting_ack'

  const statusBadge = {
    achieved: { label: '✓ ĐÃ ĐẠT', bg: '#DCFCE7', color: '#166534', border: '#BBF7D0' },
    awaiting_ack: { label: '⏳ CHỜ DUYỆT', bg: '#DBEAFE', color: '#1E40AF', border: '#BFDBFE' },
    in_progress: { label: 'ĐANG RÈN LUYỆN', bg: '#F3F4F6', color: '#4B5563', border: '#E5E7EB' },
    delayed: { label: '⚠️ CẦN TĂNG CƯỜNG', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' },
  }[milestone.status]

  return (
    <div
      style={{
        background: isDelayed ? '#FFFBEB' : '#FFFFFF',
        border: `1px solid ${isDelayed ? '#FCD34D' : '#E5E7EB'}`,
        borderRadius: '14px',
        padding: '14px',
        marginBottom: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Top row: Domain Icon + Status Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '18px' }}>{domainMeta?.icon}</span>
          <span style={{ fontSize: '11.5px', fontWeight: '600', color: domainMeta?.color }}>
            {domainMeta?.labelVi}
          </span>
        </div>
        <span
          style={{
            background: statusBadge.bg,
            color: statusBadge.color,
            border: `1px solid ${statusBadge.border}`,
            fontSize: '10px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '12px',
            letterSpacing: '0.2px',
          }}
        >
          {statusBadge.label}
        </span>
      </div>

      {/* Title & Description */}
      <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827', lineHeight: 1.4, marginBottom: '4px' }}>
        {milestone.title}
      </div>
      <div style={{ fontSize: '12.5px', color: '#4B5563', lineHeight: 1.5, marginBottom: '8px' }}>
        {milestone.description}
      </div>

      {/* Meta tags: Age Band + Circular 23 Standard (if applicable) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
        <span
          style={{
            background: '#F3F4F6',
            color: '#4B5563',
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '6px',
          }}
        >
          🗓️ {milestone.ageBandLabel}
        </span>
        {milestone.circular23Code && (
          <span
            style={{
              background: '#EFF6FF',
              color: '#1D4ED8',
              fontSize: '11px',
              fontWeight: '600',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid #DBEAFE',
            }}
          >
            🏛️ {milestone.circular23Code} (TT 23/2010)
          </span>
        )}
        {milestone.achievedDate && (
          <span
            style={{
              background: '#ECFDF5',
              color: '#047857',
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            Đạt ngày: {milestone.achievedDate}
          </span>
        )}
      </div>

      {/* Special Pedagogical Lag Alert Card for Delayed Milestones */}
      {isDelayed && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '10px',
            padding: '10px 12px',
            marginTop: '8px',
            marginBottom: '10px',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#991B1B', marginBottom: '4px' }}>
            💡 Gợi ý trò chơi tương tác tại nhà cho ba mẹ:
          </div>
          <ul style={{ margin: '0 0 8px', paddingLeft: '18px', fontSize: '12px', color: '#7F1D1D', lineHeight: 1.5 }}>
            {milestone.homeActivities.map((act, i) => (
              <li key={i}>{act}</li>
            ))}
          </ul>
          <div style={{ fontSize: '11px', color: '#991B1B', fontStyle: 'italic', borderTop: '1px dashed #FCA5A5', paddingTop: '6px' }}>
            * Lưu ý: Các gợi ý mang tính chất sư phạm tham khảo. Để được tư vấn chuyên sâu, ba mẹ nên tham vấn bác sĩ nhi khoa hoặc chuyên gia tâm lý giáo dục.
          </div>
        </div>
      )}

      {/* Action button */}
      {!isAchieved && onRecordMilestone && (
        <button
          onClick={() => onRecordMilestone(milestone)}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: isDelayed ? '#F59E0B' : '#3B82F6',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <span>📸 Ghi nhận mốc tại nhà</span>
        </button>
      )}
    </div>
  )
}
