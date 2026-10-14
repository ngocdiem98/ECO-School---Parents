'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Search, Users } from 'lucide-react'
import { MOCK_STUDENTS, getStudent } from '@/lib/mock-data'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { threadsFor, type ChatOrderCard, type ChatThread } from '@/lib/school-data'
import { ChatThreadScreen } from './chat-thread-screen'
import { timeAgo, previewOf } from './utils'
import { StudentAvatar } from '@/components/parents/shared/student-avatar'

interface ChatAppProps {
  studentId: string
  /** Deep link (from a notification): open this conversation. */
  openThreadId?: string | null
  onBack: () => void
  onOpenOrder: (card: ChatOrderCard, studentId: string) => void
}

// [PH-14] Trao đổi: conversation list (one GV Lớp thread per child plus the
// class group when the parent was added), then the chat. Real-time chat is
// out of scope in the PRD, so messages are just appended to mock data.
export function ChatApp({ studentId, openThreadId, onBack, onOpenOrder }: ChatAppProps) {
  const [selectedId, setSelectedId] = useState(studentId)
  const [threadId, setThreadId] = useState<string | null>(openThreadId ?? null)
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [showPicker, setShowPicker] = useState(false)
  const [, setVersion] = useState(0)

  const student = getStudent(selectedId)
  if (!student) return null

  const thread = threadId ? (threadsFor(selectedId).find((t) => t.id === threadId) ?? findThread(threadId)) : undefined
  if (thread) {
    return (
      <ChatThreadScreen
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

  // Selected child first, then the others, each as a collapsible group.
  const order = [student, ...MOCK_STUDENTS.filter((s) => s.id !== selectedId)]
  const q = query.trim().toLowerCase()

  return (
    <div className="screen">
      <TopBar title="Trao đổi" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={() => setShowPicker(true)} />
      <label className="chat-search">
        <Search size={16} />
        <input
          placeholder="Tìm tên cuộc trò chuyện"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {order.map((s) => {
        const threads = threadsFor(s.id).filter((t) => !q || t.title.toLowerCase().includes(q))
        if (!threads.length) return null
        const isClosed = collapsed.has(s.id)
        return (
          <section key={s.id} className="chat-group">
            <button
              className="chat-group-head"
              onClick={() =>
                setCollapsed((c) => {
                  const n = new Set(c)
                  n.has(s.id) ? n.delete(s.id) : n.add(s.id)
                  return n
                })
              }
            >
              <StudentAvatar student={s} className="avatar sm" />
              <span className="chat-group-name">
                <b>{s.name}</b>
                <small>
                  {s.className} · {s.school}
                </small>
              </span>
              {isClosed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
            {!isClosed &&
              threads.map((t) => (
                <ThreadRow
                  key={t.id}
                  t={t}
                  onOpen={() => {
                    setSelectedId(s.id)
                    setThreadId(t.id)
                  }}
                />
              ))}
          </section>
        )
      })}
      {!MOCK_STUDENTS.some((s) => threadsFor(s.id).some((t) => !q || t.title.toLowerCase().includes(q))) && (
        <div className="empty-state">
          <div className="glyph">▢</div>
          <div className="text">Không tìm thấy cuộc trò chuyện</div>
        </div>
      )}

      {showPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS}
          selectedStudentId={selectedId}
          onSelect={(s) => {
            setSelectedId(s.id)
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
  return (
    <button className="chat-row" onClick={onOpen}>
      <span className={`chat-avatar ${t.kind}`}>{t.kind === 'group' ? <Users size={22} /> : 'GV'}</span>
      <span className="chat-row-body">
        <span className="chat-row-title">
          <b>{t.title}</b>
          {last && <small>{timeAgo(last.at)}</small>}
        </span>
        <span className="chat-row-sub">
          {t.kind === 'group' && <em>{t.members} thành viên · </em>}
          {last ? previewOf(last) : 'Chưa có tin nhắn'}
        </span>
      </span>
      {t.unread && <span className="chat-dot" aria-label="Chưa đọc" />}
    </button>
  )
}
