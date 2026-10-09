'use client'

import { TopBar } from '@/components/parents/shared/header'

// Mirrors SCREENS['homework-submit']. Files are represented by name only —
// same as vanilla, which never previews the actual file, just lists names.
export function HomeworkSubmitScreen({
  files,
  isEdit,
  onBack,
  onAddFiles,
  onRemoveFile,
  onSubmit,
}: {
  files: string[]
  isEdit: boolean
  onBack: () => void
  onAddFiles: (fileList: FileList | null) => void
  onRemoveFile: (index: number) => void
  onSubmit: () => void
}) {
  return (
    <div className="screen">
      <TopBar title="Nội dung bài nộp" onBack={onBack} />
      <div className="section-heading">Tài liệu đính kèm</div>
      <div className="upload-thumb-row">
        {files.map((f, i) => (
          <div className="upload-thumb" key={i}>
            <span>tệp</span>
            <span className="rm" onClick={() => onRemoveFile(i)}>
              ✕
            </span>
          </div>
        ))}
        {!files.length && (
          <div className="text-muted" style={{ fontSize: 12.5, padding: '8px 0' }}>
            Chưa có tệp nào
          </div>
        )}
      </div>
      <div className="field">
        <label>Đã chọn ({files.length}) tệp</label>
        <div className="btn-row">
          <label className="btn btn-outline" style={{ cursor: 'pointer', textAlign: 'center' }}>
            ▤ Thư viện
            <input
              type="file"
              className="hidden-input"
              accept="image/*"
              multiple
              onChange={(e) => onAddFiles(e.target.files)}
            />
          </label>
          <label className="btn btn-outline" style={{ cursor: 'pointer', textAlign: 'center' }}>
            ▤ Tài liệu
            <input type="file" className="hidden-input" multiple onChange={(e) => onAddFiles(e.target.files)} />
          </label>
        </div>
      </div>
      <div className="cta-bar sticky">
        <button className="btn btn-primary" disabled={!files.length} onClick={onSubmit}>
          {isEdit ? 'Cập nhật bài nộp' : 'Gửi bài tập'}
        </button>
      </div>
    </div>
  )
}
