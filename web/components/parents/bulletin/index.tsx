'use client'

import { useState } from 'react'
import { MOCK_STUDENTS, getStudent } from '@/lib/mock-data'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { PhotoViewer } from '@/components/parents/shared/photo-viewer'
import { MediaGrid } from '@/components/parents/shared/media-grid'
import { Toast } from '@/components/parents/shared/toast'
import { useToast } from '@/components/parents/shared/use-toast'
import { BULLETIN_CATEGORIES, bulletinFor, fmtDateTime } from '@/lib/school-data'

interface BulletinAppProps {
  studentId: string
  onBack: () => void
}

// [PH-03] Bảng tin: school / class announcements by category ("Tất cả" first
// and selected), newest first, 1:1 thumbnail from the first attachment; the
// detail page shows the full text and attachments (images, PDF previews) in
// the shared media layout with the zoomable viewer.
export function BulletinApp({ studentId, onBack }: BulletinAppProps) {
  const [selectedId, setSelectedId] = useState(studentId)
  const [category, setCategory] = useState<(typeof BULLETIN_CATEGORIES)[number]>('Tất cả')
  const [postId, setPostId] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [viewer, setViewer] = useState<{ photos: string[]; index: number } | null>(null)
  const { toast, show } = useToast()

  const student = getStudent(selectedId)
  if (!student) return null
  const all = bulletinFor(student)
  const posts = all.filter((p) => category === 'Tất cả' || p.category === category)
  const post = postId ? all.find((p) => p.id === postId) : undefined

  return (
    <div className="screen">
      <TopBar title="Bảng tin" onBack={post ? () => setPostId(null) : onBack} />
      {post ? (
        <article className="post bulletin-detail">
          <div className="bt-meta">
            <span className="bt-tag">{post.category}</span>
            <span className="post-time">{fmtDateTime(post.at)}</span>
          </div>
          <h2 className="bt-title">{post.title}</h2>
          <div className="post-content" style={{ whiteSpace: 'pre-line' }}>
            {post.content}
          </div>
          <MediaGrid
            detail
            items={post.attachments.map((a) => ({ src: a.src, kind: a.kind === 'pdf' ? 'pdf' : 'image' }))}
            onOpen={(i) => setViewer({ photos: post.attachments.map((a) => a.src), index: i })}
          />
          <div className="feed-end">Bạn đã đọc hết tin</div>
        </article>
      ) : (
        <>
          <div className="sticky-head">
            <StudentHeader student={student} onChangeStudent={() => setShowPicker(true)} />
            <div className="tabs bt-tabs">
              {BULLETIN_CATEGORIES.map((c) => (
                <button key={c} className={`tab-pill ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {posts.length ? (
            <>
              {posts.map((p) => (
                <button className="bt-card" key={p.id} onClick={() => setPostId(p.id)}>
                  <span className="bt-card-body">
                    <span className="bt-meta">
                      <span className="bt-tag">{p.category}</span>
                      <span className="post-time">{fmtDateTime(p.at)}</span>
                    </span>
                    <span className="bt-card-title">{p.title}</span>
                    <span className="bt-card-text">{p.content}</span>
                  </span>
                  {p.attachments[0] && <img className="bt-thumb" src={p.attachments[0].src} alt="" />}
                </button>
              ))}
              <div className="feed-end">Đã xem hết tin</div>
            </>
          ) : (
            <div className="empty-state">
              <div className="glyph">▢</div>
              <div className="text">Chưa có bảng tin</div>
            </div>
          )}
        </>
      )}

      {showPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS}
          selectedStudentId={selectedId}
          onSelect={(s) => {
            setSelectedId(s.id)
            setPostId(null)
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
