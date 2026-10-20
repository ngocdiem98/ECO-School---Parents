'use client'

import { useEffect, useState } from 'react'
import { ArrowUp, Heart } from 'lucide-react'
import { MOCK_STUDENTS, getStudent } from '@/lib/mock-data'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { eligibleStudents } from '@/components/parents/shared/use-service-launcher'
import { PhotoViewer } from '@/components/parents/shared/photo-viewer'
import { MediaGrid } from '@/components/parents/shared/media-grid'
import { Toast } from '@/components/parents/shared/toast'
import { useToast } from '@/components/parents/shared/use-toast'
import { activitiesFor, fmtDateTime, type Activity } from '@/lib/school-data'

interface ActivityAppProps {
  studentId: string
  onBack: () => void
}

const initials = (name: string) => name.replace(/^(Cô|Thầy)\s+/, '').trim().split(/\s+/).slice(-1)[0]?.[0] ?? '?'

// [PH-02] Hoạt động: feed of the class's posts (newest first) with a media
// grid, "Xem thêm" to the detail page, hearts (one per parent, synced between
// list and detail), a media viewer and a "lên đầu trang" button.
export function ActivityApp({ studentId, onBack }: ActivityAppProps) {
  const [selectedId, setSelectedId] = useState(studentId)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const switchable = eligibleStudents('activity')
  const canSwitch = switchable.length > 1
  const [viewer, setViewer] = useState<{ photos: string[]; index: number } | null>(null)
  const [showTop, setShowTop] = useState(false)
  const [, setVersion] = useState(0)
  const { toast, show } = useToast()

  useEffect(() => {
    const root = document.querySelector('.screen-root')
    if (!root) return
    const onScroll = () => setShowTop(root.scrollTop > 240)
    root.addEventListener('scroll', onScroll)
    return () => root.removeEventListener('scroll', onScroll)
  }, [])

  const student = getStudent(selectedId)
  if (!student) return null
  const items = activitiesFor(student)
  const detail = detailId ? items.find((a) => a.id === detailId) : undefined

  const toggleLike = (a: Activity) => {
    a.liked = !a.liked
    a.likes += a.liked ? 1 : -1
    setVersion((v) => v + 1)
  }
  const open = (a: Activity, index: number) =>
    setViewer({ photos: a.media.map((m) => m.src), index })

  return (
    <div className="screen">
      <TopBar
        title={detail ? 'Chi tiết hoạt động' : 'Hoạt động'}
        onBack={detail ? () => setDetailId(null) : onBack}
      />
      {!detail && (
        <div className="sticky-head">
          <StudentHeader student={student} onChangeStudent={canSwitch ? () => setShowPicker(true) : undefined} />
        </div>
      )}

      {detail ? (
        <article className="post">
          <PostHead a={detail} />
          <div className="post-content" style={{ whiteSpace: 'pre-line' }}>
            {detail.content}
          </div>
          <MediaGrid items={detail.media} detail onOpen={(i) => open(detail, i)} />
          <LikeBar a={detail} onToggle={() => toggleLike(detail)} />
        </article>
      ) : items.length ? (
        <>
          {items.map((a) => (
            <article className="post" key={a.id}>
              <PostHead a={a} />
              <div className="post-content clamp3">{a.content}</div>
              {a.content.length > 140 && (
                <button className="post-more" onClick={() => setDetailId(a.id)}>
                  Xem thêm
                </button>
              )}
              <MediaGrid items={a.media} onOpen={(i) => (a.media.length > 4 && i === 3 ? setDetailId(a.id) : open(a, i))} />
              <LikeBar a={a} onToggle={() => toggleLike(a)} />
            </article>
          ))}
          <div className="feed-end">Bạn đã xem hết hoạt động</div>
        </>
      ) : (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">Chưa có thông tin hoạt động</div>
        </div>
      )}

      {!detail && showTop && (
        <button
          className="to-top"
          onClick={() => document.querySelector('.screen-root')?.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Lên đầu trang"
        >
          <ArrowUp size={18} /> Lên đầu trang
        </button>
      )}

      {showPicker && (
        <StudentPickerSheet
          students={switchable}
          selectedStudentId={selectedId}
          onSelect={(s) => {
            setSelectedId(s.id)
            setDetailId(null)
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
      {viewer && <PhotoViewer photos={viewer.photos} startIndex={viewer.index} onClose={() => setViewer(null)} onToast={show} />}
      {toast && <Toast message={toast} />}
    </div>
  )
}

function PostHead({ a }: { a: Activity }) {
  return (
    <div className="post-head">
      <span className="post-avatar">{initials(a.author)}</span>
      <div>
        <div className="post-author">{a.author}</div>
        <div className="post-time">{fmtDateTime(a.at)}</div>
      </div>
    </div>
  )
}

function LikeBar({ a, onToggle }: { a: Activity; onToggle: () => void }) {
  return (
    <div className="like-bar">
      <button className={`like-btn ${a.liked ? 'on' : ''}`} onClick={onToggle}>
        <Heart size={20} fill={a.liked ? 'currentColor' : 'none'} />
        <span>Yêu thích</span>
      </button>
      <span className="like-count">{a.likes}</span>
    </div>
  )
}
