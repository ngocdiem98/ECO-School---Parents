// Round avatar placeholder for a linked person (no photos in the mock data).
export function PersonAvatar({ className = 'lm-avatar' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#DCEBFA" />
      <circle cx="24" cy="19" r="7.5" fill="#F2C9A5" />
      <path d="M16.5 17.5c0-5 3-7.5 7.5-7.5s7.5 2.5 7.5 7.5c-3-1.5-5-3-7.5-4.5-2.5 1.5-4.5 3-7.5 4.5z" fill="#2B2118" />
      <path d="M8 44c1.5-8 7-12 16-12s14.5 4 16 12a24 24 0 0 1-32 0z" fill="#2563B8" />
      <path d="M20 31.5 24 36l4-4.5" fill="#fff" />
    </svg>
  )
}
