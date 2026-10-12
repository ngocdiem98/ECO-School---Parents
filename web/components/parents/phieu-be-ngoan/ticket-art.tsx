// "Phiếu bé ngoan" illustration: a coloured ribbon-and-star certificate when
// the child got the ticket, a washed-out grey one when not.
export function TicketArt({ got, size = 120 }: { got: boolean; size?: number }) {
  const c = got
    ? { bg: '#FFF3C4', ring: '#FFCC33', star: '#FFB400', ribbon: '#E5322D', text: '#002C54' }
    : { bg: '#F0F1F3', ring: '#D5D8DD', star: '#C3C7CE', ribbon: '#C3C7CE', text: '#9AA0A8' }
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={got ? 'Có Phiếu bé ngoan' : 'Chưa có Phiếu bé ngoan'}>
      <circle cx="60" cy="60" r="56" fill={c.bg} stroke={c.ring} strokeWidth="4" />
      <path d="M38 78 L28 112 L46 102 L56 116 L62 84Z" fill={c.ribbon} />
      <path d="M82 78 L92 112 L74 102 L64 116 L58 84Z" fill={c.ribbon} opacity=".85" />
      <circle cx="60" cy="56" r="36" fill="#fff" stroke={c.ring} strokeWidth="3" />
      <path
        d="M60 32 l7.4 15 16.6 2.4 -12 11.7 2.8 16.5 -14.8 -7.8 -14.8 7.8 2.8 -16.5 -12 -11.7 16.6 -2.4z"
        fill={c.star}
      />
      <text x="60" y="94" textAnchor="middle" fontFamily="Arial" fontSize="10" fontWeight="800" fill={c.text}>
        BÉ NGOAN
      </text>
    </svg>
  )
}
