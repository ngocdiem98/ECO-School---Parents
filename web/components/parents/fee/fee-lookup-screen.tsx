'use client'

import { TopBar } from '@/components/parents/shared/header'
import type { Provider, Student } from '@/lib/mock-data'

// Mirrors SCREENS['fee-lookup'] — entered when a student has no linked
// invoice yet. The "Hoá đơn mẫu" block is static reference artwork ported
// verbatim from the vanilla screen (it points at a fixed sample mã học sinh,
// not the one the parent types).
export function FeeLookupScreen({
  student,
  provider,
  code,
  onCodeChange,
  onBack,
  onChangeProvider,
  onContinue,
}: {
  student: Student
  provider: Provider
  code: string
  onCodeChange: (value: string) => void
  onBack: () => void
  onChangeProvider: () => void
  onContinue: () => void
}) {
  return (
    <div className="screen">
      <TopBar title="Hoá đơn học phí" onBack={onBack} />
      <div className="provider-row" style={{ margin: '12px 16px' }}>
        <div className="provider-logo">{provider.logo}</div>
        <div className="name" style={{ flex: 1 }}>
          {provider.name}
        </div>
        <button className="btn-link" onClick={onChangeProvider}>
          Thay đổi
        </button>
      </div>
      <div className="field">
        <label>Thông tin học sinh</label>
        <input
          type="text"
          className="input-box"
          placeholder="Mã học sinh"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
        />
      </div>
      <div className="section-heading">Hoá đơn đã lưu</div>
      <div className="list-item">
        <span className="glyph">▣</span>
        <div className="body">
          <div className="title">ECO School</div>
          <div className="time">
            {student.name} · {student.code}
          </div>
        </div>
      </div>
      <div className="section-heading">Hoá đơn mẫu</div>
      <div className="sample-invoice">
        <div className="si-head">
          <span>{provider.logo} PHIẾU BÁO THU TIỀN</span>
          <span>QR</span>
        </div>
        <div className="si-row">
          <span>Trường Finviet</span>
        </div>
        <div className="si-row">
          <span>Tên học sinh:</span>
          <span>Nguyễn Văn A</span>
        </div>
        <div className="si-row">
          <span>Mã học sinh:</span>
          <span className="si-highlight">9192931210 ← (ở đây)</span>
        </div>
        <div className="si-row">
          <span>Lớp 11A1</span>
          <span>Kỳ phí: 04/2026</span>
        </div>
      </div>
      <div className="cta-bar sticky">
        <button className="btn btn-primary" disabled={!code.trim()} onClick={onContinue}>
          Tiếp tục
        </button>
      </div>
    </div>
  )
}
