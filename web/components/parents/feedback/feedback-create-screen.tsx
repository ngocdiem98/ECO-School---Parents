'use client'

import { useState } from 'react'
import { Check, ChevronDown, CircleAlert, FileText, Plus, X } from 'lucide-react'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import type { Student } from '@/lib/mock-data'
import { FEEDBACK_TYPES, type FeedbackFile } from '@/lib/school-data'
import { AttachSheet } from './attach-sheet'
import { MAX_FILES, MAX_FILE_MB } from './utils'

type DraftFile = FeedbackFile & { id: string; error?: boolean }

const TITLE_MAX = 100
const CONTENT_MAX = 1000

// "Tạo góp ý" (wireframe 2). Required: Tiêu đề, Nội dung. "Loại góp ý" is
// optional (bottom sheet, tap the chosen value again to clear it). Files: up
// to 10 images/PDFs; a file that fails (over 10MB or unsupported) shows a red
// tile and disables "Gửi góp ý" until it is removed. "Gửi" always validates;
// a confirm popup precedes sending, and leaving with data asks first.
export function FeedbackCreateScreen({
  student,
  onBack,
  onSubmit,
  onWarn,
}: {
  student: Student
  onBack: () => void
  onSubmit: (data: { title: string; content: string; type: string; files: FeedbackFile[] }) => void
  onWarn: (message: string) => void
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState('')
  const [files, setFiles] = useState<DraftFile[]>([])
  const [attempted, setAttempted] = useState(false)
  const [sheet, setSheet] = useState<'attach' | 'type' | null>(null)
  const [dialog, setDialog] = useState<'send' | 'discard' | null>(null)

  const hasBadFile = files.some((f) => f.error)
  const errors = {
    title: !title.trim() ? 'Vui lòng nhập tiêu đề' : '',
    content: !content.trim() ? 'Vui lòng nhập nội dung' : '',
  }
  const dirty = !!(title || content || type || files.length)

  const addFiles = (list: FileList) => {
    const room = MAX_FILES - files.length
    const picked = Array.from(list)
    if (picked.length > room) onWarn(`Chỉ thêm được ${Math.max(room, 0)} tệp nữa`)
    setFiles((prev) => [
      ...prev,
      ...picked.slice(0, Math.max(room, 0)).map(
        (f): DraftFile => ({
          id: `${f.name}-${f.size}-${Math.random()}`,
          name: f.name,
          kind: f.type === 'application/pdf' ? 'pdf' : 'image',
          src: URL.createObjectURL(f),
          error: f.size > MAX_FILE_MB * 1024 * 1024 || !(f.type === 'application/pdf' || f.type.startsWith('image/')),
        }),
      ),
    ])
  }

  const trySend = () => {
    setAttempted(true)
    if (errors.title || errors.content || hasBadFile) return
    setDialog('send')
  }

  const confirmSend = () => {
    setDialog(null)
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      type,
      files: files.map(({ name, kind, src }) => ({ name, kind, src })),
    })
  }

  return (
    <div className="screen fb-screen">
      <TopBar title="Tạo góp ý" onBack={() => (dirty ? setDialog('discard') : onBack())} />
      <StudentHeader student={student} />

      <div className="fb-form">
        <label className={`fb-field ${attempted && errors.title ? 'err' : ''}`}>
          <span>
            Tiêu đề <b>*</b>
          </span>
          <input maxLength={TITLE_MAX} placeholder="Nhập tiêu đề ngắn gọn" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        {attempted && errors.title && <div className="fb-err">{errors.title}</div>}

        <label className={`fb-field ${attempted && errors.content ? 'err' : ''}`}>
          <span>
            Nội dung <b>*</b>
          </span>
          <textarea
            maxLength={CONTENT_MAX}
            placeholder="Mô tả chi tiết góp ý của bạn"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        {attempted && errors.content && <div className="fb-err">{errors.content}</div>}

        <button className="fb-field fb-select" onClick={() => setSheet('type')}>
          <span>Loại góp ý</span>
          <em className={type ? '' : 'ph'}>{type || 'Chọn loại góp ý'}</em>
          <ChevronDown size={18} />
        </button>

        <div className="fb-files-head">
          <b>Tệp đính kèm</b>
          <small>
            {files.length}/{MAX_FILES} · ảnh hoặc PDF
          </small>
        </div>
        <div className="fb-tiles">
          {files.length < MAX_FILES && (
            <button className="fb-tile add" onClick={() => setSheet('attach')} aria-label="Thêm tệp">
              <Plus size={20} />
            </button>
          )}
          {files.map((f) => (
            <div key={f.id} className={`fb-tile ${f.error ? 'bad' : ''}`}>
              {f.error ? (
                <CircleAlert size={22} color="#fff" fill="#E5322D" />
              ) : f.kind === 'image' ? (
                <img src={f.src} alt="" />
              ) : (
                <span className="fb-tile-pdf">
                  <FileText size={18} />
                  PDF
                </span>
              )}
              <button className="fb-tile-x" onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))} aria-label="Xóa tệp">
                <X size={10} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
        {hasBadFile && (
          <div className="fb-err">
            {files.filter((f) => f.error).length} tệp tải lên không thành công. Xóa tệp lỗi để gửi góp ý.
          </div>
        )}
        {files.length >= MAX_FILES && !hasBadFile && (
          <div className="fb-hint">Đã đạt tối đa {MAX_FILES} tệp. Xóa bớt để thêm tệp khác.</div>
        )}
      </div>

      <div className="cta-bar sticky">
        <button className="btn btn-primary" disabled={hasBadFile} onClick={trySend}>
          Gửi góp ý
        </button>
      </div>

      {sheet === 'attach' && (
        <AttachSheet remaining={MAX_FILES - files.length} onFiles={addFiles} onClose={() => setSheet(null)} />
      )}
      {sheet === 'type' && (
        <OverlayPortal>
          <div className="scrim" onClick={() => setSheet(null)} />
          <div className="sheet">
            <div className="sheet-grab" />
            <div className="sheet-head">
              <span className="t">Chọn loại góp ý</span>
              <button className="icon-btn" onClick={() => setSheet(null)} aria-label="Đóng">
                ✕
              </button>
            </div>
            <div className="sheet-body" style={{ padding: 0 }}>
              {FEEDBACK_TYPES.map((t) => (
                <button
                  key={t}
                  className={`fb-type ${t === type ? 'sel' : ''}`}
                  onClick={() => {
                    setType(t === type ? '' : t)
                    setSheet(null)
                  }}
                >
                  <span>{t}</span>
                  {t === type && <Check size={18} color="var(--c-blue)" />}
                </button>
              ))}
            </div>
          </div>
        </OverlayPortal>
      )}

      {dialog === 'send' && (
        <FbDialog
          title="Gửi góp ý này?"
          body="Sau khi gửi, bạn không thể chỉnh sửa nội dung. Bạn vẫn có thể trao đổi thêm với nhà trường trong phần phản hồi."
          secondary="Xem lại"
          primary="Gửi"
          onSecondary={() => setDialog(null)}
          onPrimary={confirmSend}
        />
      )}
      {dialog === 'discard' && (
        <FbDialog
          title="Bỏ góp ý đang viết?"
          body="Nội dung bạn đã nhập sẽ không được lưu."
          secondary="Viết tiếp"
          primary="Bỏ"
          outlinePrimary
          onSecondary={() => setDialog(null)}
          onPrimary={onBack}
        />
      )}
    </div>
  )
}

export function FbDialog({
  title,
  body,
  secondary,
  primary,
  outlinePrimary,
  primaryDisabled,
  children,
  onSecondary,
  onPrimary,
}: {
  title: string
  body: string
  secondary: string
  primary: string
  outlinePrimary?: boolean
  primaryDisabled?: boolean
  children?: React.ReactNode
  onSecondary: () => void
  onPrimary: () => void
}) {
  return (
    <OverlayPortal>
      <div className="scrim" />
      <div className="dialog-wrap">
        <div className="dialog-card fb-dialog">
          <div className="d-title">{title}</div>
          <div className="d-sub">{body}</div>
          {children}
          <div className="btn-row">
            <button className={`btn ${outlinePrimary ? 'btn-gray' : 'btn-gray'}`} onClick={onSecondary}>
              {secondary}
            </button>
            <button className={`btn ${outlinePrimary ? 'btn-outline' : 'btn-primary'}`} disabled={primaryDisabled} onClick={onPrimary}>
              {primary}
            </button>
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}
