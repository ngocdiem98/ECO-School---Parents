// Bản nháp tin nhắn theo từng cuộc trò chuyện (EDU-2118). Text is mirrored to
// localStorage (this device only); attachments are blob URLs, so they live in
// memory for the visit. The draft is dropped when the text is emptied, when the
// message is sent, and on logout.
interface Draft {
  text: string
  files: string[]
}

const mem = new Map<string, Draft>()
const key = (threadId: string) => `eco-chat-draft:${threadId}`

export function getDraft(threadId: string): Draft | null {
  const m = mem.get(threadId)
  if (m) return m
  try {
    const t = localStorage.getItem(key(threadId))
    return t ? { text: t, files: [] } : null
  } catch {
    return null
  }
}

export function setDraft(threadId: string, text: string, files: string[]) {
  if (!text.trim()) {
    mem.delete(threadId)
    try {
      localStorage.removeItem(key(threadId))
    } catch {
      /* ignore */
    }
    return
  }
  mem.set(threadId, { text, files })
  try {
    localStorage.setItem(key(threadId), text)
  } catch {
    /* ignore */
  }
}

export function draftText(threadId: string): string | null {
  return getDraft(threadId)?.text ?? null
}

// Fill-in sentences (EDU-2118 "Danh sách câu mẫu").
export const CHAT_QUICK_REPLIES = [
  { label: 'Cảm ơn', text: 'Dạ, gia đình cảm ơn ạ.' },
  { label: 'Nhận thông tin', text: 'Dạ, gia đình đã nhận được thông tin ạ.' },
  { label: 'Phản hồi sau', text: 'Dạ, gia đình xem lại và phản hồi sau ạ.' },
  { label: 'Hỏi thêm', text: 'Dạ, cho gia đình hỏi thêm về ' },
]
