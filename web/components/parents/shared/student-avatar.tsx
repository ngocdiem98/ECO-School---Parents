import type { Student } from '@/lib/mock-data'

// DS demo avatar (assets "Student avatars": Cấp × giới tính) for a student.
// Level comes from the class number (1-5 Tiểu học, 6-9 Trung học, 10-12 Phổ
// thông); Mầm non and classes without a number use the Tiểu học avatar.
export function dsStudentAvatar(student: Pick<Student, 'gender' | 'className' | 'school'>): string {
  const n = parseInt(student.className.match(/\d+/)?.[0] ?? '', 10)
  const level = student.school.includes('Mầm non') || Number.isNaN(n) || n <= 5 ? 'tieu-hoc' : n <= 9 ? 'trung-hoc' : 'pho-thong'
  return `/ds/avatars/${level}-${student.gender === 'Nữ' ? 'nu' : 'nam'}.svg`
}

// Student portrait. `className` replaces the default `avatar` size class (e.g.
// "avatar sm", "profile-avatar"). The DS SVG already is a bordered white circle.
export function StudentAvatar({ student, className = 'avatar' }: { student: Student; className?: string }) {
  return (
    <span className={`${className} student-avatar`} role="img" aria-label={`Ảnh học sinh ${student.name}`}>
      <img src={dsStudentAvatar(student)} alt="" />
    </span>
  )
}
