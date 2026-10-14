import type { Student } from '@/lib/mock-data'

// Demo student portrait: a boy or a girl in school uniform, picked from
// `student.gender` ("Nữ" → girl, anything else → boy). The mock data has no
// photos, so this is an inline SVG (no assets). `className` replaces the
// default `avatar` size class (e.g. "avatar sm", "profile-avatar").
export function StudentAvatar({ student, className = 'avatar' }: { student: Student; className?: string }) {
  const girl = student.gender === 'Nữ'
  return (
    <span className={`${className} student-avatar`} role="img" aria-label={`Ảnh học sinh ${student.name}`}>
      <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden>
        <circle cx="32" cy="32" r="32" fill={girl ? '#FFF0B8' : '#DCEBFA'} />
        {girl && (
          <>
            {/* back hair + pigtails */}
            <circle cx="32" cy="29" r="15.5" fill="#2E2220" />
            <circle cx="16.5" cy="37" r="5.5" fill="#2E2220" />
            <circle cx="47.5" cy="37" r="5.5" fill="#2E2220" />
          </>
        )}
        {/* shoulders: white shirt */}
        <path d="M8 64 C8 51 19 46 32 46 C45 46 56 51 56 64 Z" fill="#FFFFFF" />
        {/* neck */}
        <rect x="28" y="37" width="8" height="11" rx="3" fill="#E8B48C" />
        {/* collar + tie / ribbon */}
        <path d="M25 46.5 L32 55 L39 46.5 Z" fill={girl ? '#FFCC33' : '#0070CE'} />
        <path d="M24 46 L32 53 L40 46" fill="none" stroke="#0070CE" strokeWidth="2.2" strokeLinejoin="round" />
        {/* face */}
        <circle cx="32" cy="30" r="12.5" fill="#F3C9A5" />
        {girl ? (
          <>
            {/* fringe */}
            <path d="M19.5 29 C20 19 44 19 44.5 29 C41 25 37 23.5 32 23.5 C27 23.5 23 25 19.5 29 Z" fill="#2E2220" />
            {/* ribbons */}
            <circle cx="19" cy="31" r="2.4" fill="#FFCC33" />
            <circle cx="45" cy="31" r="2.4" fill="#FFCC33" />
          </>
        ) : (
          <path d="M19 30 C17.5 14 46.5 14 45 30 C43 24 39 21.5 32 21.5 C25 21.5 21 24 19 30 Z" fill="#33251C" />
        )}
        {/* eyes, smile, cheeks */}
        <circle cx="27" cy="31.5" r="1.4" fill="#2B2B2B" />
        <circle cx="37" cy="31.5" r="1.4" fill="#2B2B2B" />
        <path d="M28.5 36 Q32 39 35.5 36" fill="none" stroke="#9A5A44" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24.5" cy="35.5" r="2" fill="#F08A7A" opacity="0.35" />
        <circle cx="39.5" cy="35.5" r="2" fill="#F08A7A" opacity="0.35" />
      </svg>
    </span>
  )
}
