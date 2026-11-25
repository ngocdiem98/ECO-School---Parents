'use client'

export interface QuickReply {
  /** Chip label. */
  label: string
  /** Sentence put into the text field. */
  text: string
}

// Horizontally scrolling row of suggestion chips shown above a text field
// (Báo vắng: lý do nghỉ, Trao đổi: trả lời nhanh). Tapping only fills the
// field; the parent edits it and sends.
export function QuickReplies({
  items,
  onPick,
}: {
  items: QuickReply[]
  onPick: (item: QuickReply) => void
}) {
  return (
    <div className="qr-row">
      {items.map((it) => (
        <button
          key={it.label}
          type="button"
          className="qr-chip"
          onClick={() => onPick(it)}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}
