'use client'

import { useState } from 'react'
import { Search, Users } from 'lucide-react'
import { MOCK_STUDENTS, getStudent } from '@/lib/mock-data'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { eligibleStudents } from '@/components/parents/shared/use-service-launcher'
import { threadsFor, type ChatOrderCard, type ChatThread } from '@/lib/school-data'
import { ChatThreadScreen } from './chat-thread-screen'
import { timeAgo, previewOf } from './utils'
import { draftText } from './draft'

interface ChatAppProps {
  studentId: string
  /** Deep link (from a notification): open this conversation. */
  openThreadId?: string | null
  onBack: () => void
  onOpenOrder: (card: ChatOrderCard, studentId: string) => void
}

// [PH-14] Trao đổi: the conversation list of the selected student only (the GV
// Lớp thread plus the class group when the parent was added), then the chat.
// Switching student in the header switches the whole list. Real-time chat is
// out of scope in the PRD, so messages are just appended to mock data.
export function ChatApp({ studentId, openThreadId, onBack, onOpenOrder }: ChatAppProps) {
  const [selectedId, setSelectedId] = useState(studentId)
  const [threadId, setThreadId] = useState<string | null>(openThreadId ?? null)
  const [query, setQuery] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const switchable = eligibleStudents('chat')
  const canSwitch = switchable.length > 1
  const [, setVersion] = useState(0)

  const student = getStudent(selectedId)
  if (!student) return null

  const thread = threadId ? (threadsFor(selectedId).find((t) => t.id === threadId) ?? findThread(threadId)) : undefined
  if (thread) {
    return (
      <ChatThreadScreen
        key={thread.id}
        thread={thread}
        onBack={() => {
          if (openThreadId) onBack()
          else setThreadId(null)
          setVersion((v) => v + 1)
        }}
        onOpenOrder={(card) => onOpenOrder(card, thread.studentId)}
      />
    )
  }

  const q = query.trim().toLowerCase()
  const threads = threadsFor(selectedId).filter((t) => !q || t.title.toLowerCase().includes(q))

  return (
    <div className="screen">
      <TopBar title="Trao đổi" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={canSwitch ? () => setShowPicker(true) : undefined} />
      <label className="chat-search">
        <Search size={16} />
        <input
          placeholder="Tìm tên cuộc trò chuyện"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <div className="chat-list">
        {threads.map((t) => (
          <ThreadRow key={t.id} t={t} onOpen={() => setThreadId(t.id)} />
        ))}
      </div>
      {!threads.length && (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">{q ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có cuộc trò chuyện'}</div>
        </div>
      )}

      {showPicker && (
        <StudentPickerSheet
          students={switchable}
          selectedStudentId={selectedId}
          onSelect={(s) => {
            setSelectedId(s.id)
            setQuery('')
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}

function findThread(id: string): ChatThread | undefined {
  for (const s of MOCK_STUDENTS) {
    const t = threadsFor(s.id).find((x) => x.id === id)
    if (t) return t
  }
  return undefined
}

function ThreadRow({ t, onOpen }: { t: ChatThread; onOpen: () => void }) {
  const last = t.messages[t.messages.length - 1]
  const draft = draftText(t.id)
  return (
    <button className="chat-row" onClick={onOpen}>
      <span className={`chat-avatar ${t.kind}`}>{t.kind === 'group' ? <Users size={22} /> : 'GV'}</span>
      <span className="chat-row-body">
        <span className="chat-row-title">
          <b>{t.title}</b>
          {last && <small>{timeAgo(last.at)}</small>}
        </span>
        <span className="chat-row-sub">
          {draft ? (
            <>
              <span className="chat-draft-tag">[Nháp]</span> {draft}
            </>
          ) : (
            <>
              {t.kind === 'group' && <em>{t.members} thành viên · </em>}
              {last ? previewOf(last) : 'Chưa có tin nhắn'}
            </>
          )}
        </span>
      </span>
      {t.unread && <span className="chat-dot" aria-label="Chưa đọc" />}
    </button>
  )
}
