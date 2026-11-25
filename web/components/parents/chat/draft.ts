import { readDraft, removeDraft, writeDraft } from '@/components/parents/shared/draft-store'

// Bản nháp tin nhắn theo từng cuộc trò chuyện (EDU-2118): text only (attached
// photos / videos are never kept), on this device for 24 hours (see draft-store).
// Dropped when the text is emptied and when the message is sent.
const key = (threadId: string) => `eco-chat-draft:${threadId}`

export function draftText(threadId: string): string | null {
  return readDraft<string>(key(threadId))
}

export function setDraft(threadId: string, text: string) {
  if (!text.trim()) removeDraft(key(threadId))
  else writeDraft(key(threadId), text)
}

// Fill-in sentences (EDU-2118 "Danh sách câu mẫu").
export const CHAT_QUICK_REPLIES = [
  { label: 'Cảm ơn', text: 'Dạ, gia đình cảm ơn ạ.' },
  { label: 'Nhận thông tin', text: 'Dạ, gia đình đã nhận được thông tin ạ.' },
  { label: 'Phản hồi sau', text: 'Dạ, gia đình xem lại và phản hồi sau ạ.' },
  { label: 'Hỏi thêm', text: 'Dạ, cho gia đình hỏi thêm về ' },
]
