'use client'

import { getStudent } from '@/lib/mock-data'
import { TopBar } from '@/components/parents/shared/header'

interface ProfileAppProps {
  studentId: string
  onBack: () => void
}

// "Hồ sơ học sinh" — a read-only profile reached by tapping the student info
// card at the top of the Học sinh screen. Two sections: "Thông tin cá nhân"
// (từ the student record) and "Người giám hộ" (mock guardians). The reference
// mockup is blue-tinted; rendered here in the app's monochrome identity to
// match every other rebuilt screen.
export function ProfileApp({ studentId, onBack }: ProfileAppProps) {
  const student = getStudent(studentId)
  if (!student) return null

  return (
    <div className="screen">
      <TopBar title="Hồ sơ học sinh" onBack={onBack} />

      <div className="profile-panel">
        <div className="profile-hero">
          <div className="profile-avatar">{student.avatar}</div>
          <div className="profile-hero-name">{student.name}</div>
          <div className="profile-hero-code">{student.code}</div>
        </div>

        <div className="profile-card">
          <div className="profile-card-title">Thông tin cá nhân</div>
          <div className="profile-kv-list">
            <div className="profile-kv">
              <span className="k">Ngày sinh</span>
              <span className="v">{student.dob}</span>
            </div>
            <div className="profile-kv">
              <span className="k">Giới tính</span>
              <span className="v">{student.gender}</span>
            </div>
            <div className="profile-kv">
              <span className="k">Lớp</span>
              <span className="v">{student.className}</span>
            </div>
            <div className="profile-kv">
              <span className="k">Trường</span>
              <span className="v">{student.school}</span>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-title">Người giám hộ</div>
          <div className="guardian-list">
            {student.guardians.map((g, i) => (
              <div className="guardian-card" key={i}>
                <div className="guardian-name">{g.name}</div>
                <div className="guardian-row">
                  <span className="ic">☎</span>
                  <span>{g.phone}</span>
                </div>
                <div className="guardian-row">
                  <span className="ic">⌖</span>
                  <span>{g.address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
