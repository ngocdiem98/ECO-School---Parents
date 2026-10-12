'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import type { Student } from '@/lib/mock-data'
import type { Feedback, FeedbackStatus } from '@/lib/school-data'
import { STATUS_LABEL, lastUpdate, listTime, replyCountLabel } from './utils'

const TABS: { value: 'all' | FeedbackStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'new', label: STATUS_LABEL.new },
  { value: 'received', label: STATUS_LABEL.received },
  { value: 'resolved', label: STATUS_LABEL.resolved },
  { value: 'reopened', label: STATUS_LABEL.reopened },
]

// Badge = coloured dot + label (not colour alone).
export function FeedbackBadge({ status }: { status: FeedbackStatus }) {
  return (
    <span className={`fb-badge ${status}`}>
      <i />
      {STATUS_LABEL[status]}
    </span>
  )
}

// "Danh sách góp ý" (wireframe 1): student header, search, status tabs
// (no counts, default Tất cả), cards sorted by latest update, fixed
// "Gửi góp ý mới" CTA. The search runs over all of the student's feedback,
// the tabs only filter when the search box is empty.
export function FeedbackListScreen({
  student,
  items,
  onBack,
  onChangeStudent,
  onCreate,
  onOpen,
}: {
  student: Student
  items: Feedback[]
  onBack: () => void
  onChangeStudent: () => void
  onCreate: () => void
  onOpen: (id: string) => void
}) {
  const [tab, setTab] = useState<'all' | FeedbackStatus>('all')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const list = q
    ? items.filter((f) => f.title.toLowerCase().includes(q) || f.content.toLowerCase().includes(q))
    : items.filter((f) => tab === 'all' || f.status === tab)

  return (
    <div className="screen fb-screen">
      <TopBar title="Góp ý" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={onChangeStudent} />
      <label className="fb-search">
        <Search size={18} />
        <input placeholder="Tìm kiếm góp ý" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <div className="tabs fb-tabs">
        {TABS.map((t) => (
          <button key={t.value} className={`tab-pill ${!q && tab === t.value ? 'active' : ''}`} onClick={() => setTab(t.value)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="fb-list">
        {list.length ? (
          list.map((f) => (
            <button className="fb-card" key={f.id} onClick={() => onOpen(f.id)}>
              <span className="fb-card-head">
                <FeedbackBadge status={f.status} />
                <small>{listTime(lastUpdate(f))}</small>
              </span>
              <span className="fb-card-title">{f.title}</span>
              <span className="fb-card-text">{f.content}</span>
              <span className="fb-card-foot">
                {f.unread && (
                  <>
                    <i className="fb-dot" />
                    <b>Phản hồi mới</b>
                    <em>·</em>
                  </>
                )}
                <span>{replyCountLabel(f)}</span>
              </span>
            </button>
          ))
        ) : items.length && q ? (
          <div className="fb-empty">
            <span className="fb-empty-art" />
            <b>Không tìm thấy góp ý phù hợp</b>
            <p>Thử từ khóa khác hoặc chuyển sang Tất cả.</p>
          </div>
        ) : (
          <div className="fb-empty">
            <span className="fb-empty-art" />
            <b>Chưa có góp ý nào</b>
            <p>Nhà trường luôn mong nhận được ý kiến của quý phụ huynh để cùng chăm lo tốt hơn cho các con.</p>
          </div>
        )}
      </div>

      <div className="cta-bar sticky">
        <button className="btn btn-primary" onClick={onCreate}>
          Gửi góp ý mới
        </button>
      </div>
    </div>
  )
}
