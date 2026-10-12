'use client'

import { useEffect, useRef, useState } from 'react'
import { FileText, Plus, RotateCw, Send, X } from 'lucide-react'
import { TopBar } from '@/components/parents/shared/header'
import { PhotoViewer } from '@/components/parents/shared/photo-viewer'
import { canReopen, reopenDaysLeft, REOPEN_WINDOW_DAYS, type Feedback } from '@/lib/school-data'
import { dayTitle } from '@/components/parents/medicine/utils'
import { AttachSheet } from './attach-sheet'
import { FeedbackBadge } from './feedback-list-screen'
import { FbDialog } from './feedback-create-screen'
import { fullDateTime, nowIso } from './utils'

// "Chi tiết góp ý" (wireframe Option D): the whole detail (badge, title,
// info, content, files) sits at the top of the page and scrolls away with the
// conversation under it ("— Phản hồi —"); the composer / reopen bar is stuck
// to the bottom. A closed feedback replaces the composer with the reopen
// panel (unlimited re-opens, but only within 7 days of closing).
export function FeedbackDetailScreen({
  feedback,
  onBack,
  onChanged,
  onToast,
}: {
  feedback: Feedback
  onBack: () => void
  onChanged: () => void
  onToast: (message: string, success?: boolean) => void
}) {
  const [text, setText] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [attach, setAttach] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [viewer, setViewer] = useState<{ photos: string[]; index: number } | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    feedback.unread = false
    onChanged()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback.id])

  // The page opens at the top; only scroll down when the parent sends a reply.
  const seen = useRef(feedback.replies.length)
  useEffect(() => {
    if (feedback.replies.length > seen.current) endRef.current?.scrollIntoView({ block: 'nearest' })
    seen.current = feedback.replies.length
  }, [feedback.replies.length])

  const closed = feedback.status === 'resolved'
  const imageFiles = feedback.files.filter((f) => f.kind === 'image')
  const days = Array.from(new Set(feedback.replies.map((r) => r.at.slice(0, 10))))
  const left = reopenDaysLeft(feedback)

  const send = () => {
    if (!text.trim() && !images.length) return
    feedback.replies.push({
      id: 'rp' + Date.now(),
      from: 'parent',
      sender: 'Bạn',
      at: nowIso(),
      text: text.trim() || undefined,
      images: images.length ? images : undefined,
      failed: typeof navigator !== 'undefined' && navigator.onLine === false,
    })
    setText('')
    setImages([])
    onChanged()
  }

  return (
    <div className="screen fb-detail">
      <TopBar title="Chi tiết góp ý" onBack={onBack} />

      <section className="fb-d-info">
        <FeedbackBadge status={feedback.status} />
        <h2>{feedback.title}</h2>
        <dl>
          <dt>Người gửi</dt>
          <dd>{feedback.sender}</dd>
          <dt>Ngày gửi</dt>
          <dd>{fullDateTime(feedback.createdAt)}</dd>
          <dt>Loại góp ý</dt>
          <dd>{feedback.type || 'Chưa phân loại'}</dd>
          <dt>Người xử lý</dt>
          <dd className={feedback.handler ? '' : 'muted'}>{feedback.handler ?? 'Chưa phân công'}</dd>
        </dl>
        <hr />
        <p>{feedback.content}</p>
        {feedback.files.length > 0 && (
          <div className="fb-d-files">
            {feedback.files.map((f, i) =>
              f.kind === 'image' ? (
                <button key={i} onClick={() => setViewer({ photos: imageFiles.map((x) => x.src), index: imageFiles.indexOf(f) })}>
                  <img src={f.src} alt={f.name} />
                </button>
              ) : (
                <button key={i} onClick={() => setViewer({ photos: [f.src], index: 0 })} aria-label={f.name}>
                  <span className="fb-tile-pdf">
                    <FileText size={18} />
                    PDF
                  </span>
                </button>
              ),
            )}
          </div>
        )}
      </section>

      <section className="fb-thread-wrap">
        <div className="fb-thread-title">— Phản hồi —</div>
        {feedback.replies.length === 0 ? (
          <div className="fb-thread-empty">
            <b>Chưa có phản hồi</b>
            <p>Bạn có thể phản hồi để bổ sung thêm thông tin cho góp ý này</p>
          </div>
        ) : (
          days.map((day) => (
            <div key={day}>
              <div className="fb-day">{dayTitle(day)}</div>
              {feedback.replies
                .filter((r) => r.at.startsWith(day))
                .map((r) => (
                  <div key={r.id} className={`fb-msg ${r.from}`}>
                    {r.from === 'parent' && r.failed && (
                      <button
                        className="fb-retry"
                        aria-label="Gửi lại"
                        onClick={() => {
                          r.failed = false
                          onChanged()
                        }}
                      >
                        <RotateCw size={16} />
                      </button>
                    )}
                    <div className="fb-bubble">
                      {r.from === 'school' && <div className="fb-who">{r.sender} · Nhà trường</div>}
                      {r.images && (
                        <div className="fb-msg-imgs">
                          {r.images.map((src, i) => (
                            <button key={i} onClick={() => setViewer({ photos: r.images!, index: i })}>
                              <img src={src} alt="" />
                            </button>
                          ))}
                        </div>
                      )}
                      {r.text && <div className="fb-msg-text">{r.text}</div>}
                      <div className="fb-msg-time">{r.at.slice(11, 16)}</div>
                    </div>
                    {r.failed && (
                      <span className="fb-failed-wrap">
                        <span className="fb-failed">Gửi lỗi</span>
                      </span>
                    )}
                  </div>
                ))}
            </div>
          ))
        )}
        <div ref={endRef} />
      </section>

      {closed ? (
        <div className="fb-bottom closed">
          {canReopen(feedback) ? (
            <>
              <p>
                Góp ý đã được xử lý nên không thể nhắn thêm. Bạn có thể mở lại trong <b>{left} ngày</b> nữa.
              </p>
              <button className="btn btn-primary" onClick={() => setConfirming(true)}>
                Mở lại góp ý
              </button>
            </>
          ) : (
            <p>
              Góp ý đã đóng. Đã quá thời hạn {REOPEN_WINDOW_DAYS} ngày để mở lại. Nếu cần, bạn có thể gửi góp ý mới.
            </p>
          )}
        </div>
      ) : (
        <div className="fb-bottom">
          {images.length > 0 && (
            <div className="composer-preview">
              {images.map((src, i) => (
                <div className="med-photo" key={src}>
                  <img src={src} alt="" />
                  <span className="rm" onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}>
                    <X size={10} />
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="composer">
            <button className="icon-btn" onClick={() => setAttach(true)} aria-label="Đính kèm ảnh">
              <Plus size={22} />
            </button>
            <input
              placeholder="Nhập tin nhắn"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button className="icon-btn send" disabled={!text.trim() && !images.length} onClick={send} aria-label="Gửi">
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      {attach && (
        <AttachSheet
          remaining={10 - images.length}
          allowPdf={false}
          onFiles={(files) =>
            setImages((prev) => [...prev, ...Array.from(files).map((f) => URL.createObjectURL(f))].slice(0, 10))
          }
          onClose={() => setAttach(false)}
        />
      )}
      {confirming && (
        <FbDialog
          title="Mở lại góp ý?"
          body="Góp ý sẽ chuyển sang trạng thái Mở lại và bạn có thể tiếp tục trao đổi với nhà trường."
          secondary="Hủy"
          primary="Mở lại"
          onSecondary={() => setConfirming(false)}
          onPrimary={() => {
            feedback.status = 'reopened'
            setConfirming(false)
            onChanged()
            onToast('Đã mở lại góp ý', true)
          }}
        />
      )}
      {viewer && <PhotoViewer photos={viewer.photos} startIndex={viewer.index} onClose={() => setViewer(null)} onToast={onToast} />}
    </div>
  )
}
