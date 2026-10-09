'use client'

import { TopBar } from '@/components/parents/shared/header'
import type { Homework, HomeworkStatus } from '@/lib/mock-data'

const STATUS_LABEL: Record<HomeworkStatus, string> = {
  notsubmitted: 'Chưa nộp',
  submitted: 'Đã nộp',
  graded: 'Đã chấm',
}
const STATUS_BADGE: Record<HomeworkStatus, string> = {
  notsubmitted: 'outline',
  submitted: 'filled',
  graded: 'filled',
}

// Mirrors SCREENS['homework-detail']. "Xem chi tiết" links are static/inert
// — no reference screenshot for that drill-down.
export function HomeworkDetailScreen({
  homework,
  onBack,
  onSubmit,
}: {
  homework: Homework
  onBack: () => void
  onSubmit: () => void
}) {
  const isDone = homework.status === 'submitted' || homework.status === 'graded'

  return (
    <div className="screen">
      <TopBar title="Chi tiết bài tập" onBack={onBack} />
      {homework.overdue && !isDone && (
        <div className="alert-box">⚠ Lưu ý: Bài tập đã quá hạn nộp bài</div>
      )}
      <div className="feedback-card">
        <span className="feedback-card-tab">Nhận xét của Giáo viên</span>
        <div className="feedback-card-body">
          <div className="feedback-row">
            <span className="text-muted">Môn: {homework.subject}</span>
            <span className={`badge badge--${STATUS_BADGE[homework.status]}`}>
              {STATUS_LABEL[homework.status]}
            </span>
          </div>
          <div className="feedback-row">
            <span className="text-muted">Giáo viên: {homework.teacher}</span>
          </div>
          <div className="feedback-grade">
            <div>
              <div className="g-label">Điểm</div>
              <div>{homework.score !== null ? homework.score : '-'}</div>
            </div>
            <div>
              <div className="g-label">Nhận xét</div>
              <div className="text-muted">{homework.comment}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="feedback-row">
          <span className="text-muted">Ngày giao</span>
          <span>{homework.assignedDate}</span>
        </div>
        <div className="feedback-row">
          <span className="text-muted">Hạn nộp</span>
          <span>{homework.dueDate}</span>
        </div>
      </div>
      <div className="section-heading">Bài tập nhỏ</div>
      <div className="card">
        <div className="feedback-row">
          <span className="text-muted">Nội dung bài tập:</span>
          <button className="btn-link">Xem chi tiết</button>
        </div>
        <div className="feedback-row">
          <span>{homework.content}</span>
        </div>
        <div className="text-muted" style={{ fontSize: 12.5, marginTop: 6 }}>
          Tài liệu đính kèm:
        </div>
        <div className="attach-thumb">[ hình ảnh đính kèm ]</div>
        {isDone && (
          <>
            <div className="divider" />
            <div className="feedback-row">
              <span className="text-muted">Nội dung bài nộp:</span>
              <button className="btn-link">Xem chi tiết</button>
            </div>
          </>
        )}
      </div>
      <div className="cta-bar sticky">
        <button className="btn btn-primary" onClick={onSubmit}>
          {isDone ? 'Chỉnh sửa bài nộp' : 'Nộp bài tập'}
        </button>
      </div>
    </div>
  )
}
