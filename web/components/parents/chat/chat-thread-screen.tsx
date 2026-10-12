'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Camera, ChevronRight, Copy, Download, Image as ImageIcon, Pin, PinOff, Plus, Send, Users, X } from 'lucide-react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'
import { PhotoViewer } from '@/components/parents/shared/photo-viewer'
import { Toast } from '@/components/parents/shared/toast'
import { useToast } from '@/components/parents/shared/use-toast'
import { weekdayName, type ChatMessage, type ChatOrderCard, type ChatThread } from '@/lib/school-data'

const MAX_CHARS = 1200
const MAX_PINS = 3
const MAX_FILES = 10

const dayLabel = (iso: string) => `${weekdayName(iso)}, ${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`

function nowIso(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function snippet(m: ChatMessage): string {
  if (m.order) return m.order.kind === 'medicine' ? 'Đơn dặn thuốc' : 'Đơn báo vắng'
  if (m.text) return m.text.length > 48 ? m.text.slice(0, 48) + '....' : m.text
  return `${m.images?.length ?? 0} hình ảnh`
}

// One conversation: pinned banner, messages grouped by day, order cards,
// long-press actions (Ghim / Bỏ ghim / Sao chép / Tải xuống), and a composer
// with the "+" attachment menu. In groups where only teachers may post the
// composer is replaced by a read-only notice.
export function ChatThreadScreen({
  thread,
  onBack,
  onOpenOrder,
}: {
  thread: ChatThread
  onBack: () => void
  onOpenOrder: (card: ChatOrderCard) => void
}) {
  const [, setVersion] = useState(0)
  const [text, setText] = useState('')
  const [files, setFiles] = useState<string[]>([])
  const [showAttach, setShowAttach] = useState(false)
  const [actionMsg, setActionMsg] = useState<ChatMessage | null>(null)
  const [showPins, setShowPins] = useState(false)
  const [unpinMsg, setUnpinMsg] = useState<ChatMessage | null>(null)
  const [viewer, setViewer] = useState<{ photos: string[]; index: number } | null>(null)
  const { toast, show } = useToast()
  const endRef = useRef<HTMLDivElement>(null)
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bump = () => setVersion((v) => v + 1)

  useEffect(() => {
    thread.unread = false
    bump()
  }, [thread])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [thread.messages.length])

  const pins = thread.messages.filter((m) => m.pinnedBy)
  const days = Array.from(new Set(thread.messages.map((m) => m.at.slice(0, 10))))

  const send = () => {
    const body = text.trim()
    if (!body) return // media must go together with text (pilot rule)
    thread.messages.push({
      id: 'cm' + Date.now(),
      from: 'me',
      sender: 'Bạn',
      at: nowIso(),
      text: body,
      images: files.length ? files : undefined,
    })
    setText('')
    setFiles([])
    bump()
  }

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return
    const room = MAX_FILES - files.length
    if (list.length > room) show(`Chỉ được chọn tối đa ${MAX_FILES} tệp`)
    setFiles((prev) => [...prev, ...Array.from(list).slice(0, Math.max(room, 0)).map((f) => URL.createObjectURL(f))])
    setShowAttach(false)
  }

  const pin = (m: ChatMessage) => {
    if (pins.length >= MAX_PINS) {
      show(`Chỉ ghim tối đa ${MAX_PINS} tin nhắn`)
    } else {
      m.pinnedBy = 'me'
      show('Đã ghim tin nhắn')
    }
    setActionMsg(null)
    bump()
  }

  const copy = async (m: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(m.text ?? '')
      show('Đã sao chép')
    } catch {
      show('Không thể sao chép')
    }
    setActionMsg(null)
  }

  const download = (m: ChatMessage) => {
    m.images?.forEach((src, i) => {
      const a = document.createElement('a')
      a.href = src
      a.download = `anh-${i + 1}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
    })
    show('Đã tải xuống thành công')
    setActionMsg(null)
  }

  const startPress = (m: ChatMessage) => {
    pressTimer.current = setTimeout(() => setActionMsg(m), 450)
  }
  const endPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current)
  }

  return (
    <div className="screen chat-screen">
      <div className="topbar chat-top">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
          <ArrowLeft size={20} />
        </button>
        <span className={`chat-avatar sm ${thread.kind}`}>{thread.kind === 'group' ? <Users size={18} /> : 'GV'}</span>
        <div className="chat-top-title">
          <b>{thread.title}</b>
          {thread.kind === 'group' && <small>{thread.members} thành viên</small>}
        </div>
      </div>

      {pins.length > 0 && (
        <button className="pin-banner" onClick={() => setShowPins(true)}>
          <Pin size={16} />
          <span>
            <b>{pins[0].pinnedBy === 'me' ? 'Bạn' : pins[0].sender}</b> · {snippet(pins[0])}
          </span>
          <span className="pin-count">{pins.length}</span>
          <ChevronRight size={16} />
        </button>
      )}

      <div className="chat-body">
        {thread.messages.length === 0 && (
          <div className="empty-state">
            <div className="glyph">▢</div>
            <div className="text">Chưa có tin nhắn nào</div>
          </div>
        )}
        {days.map((day) => (
          <div key={day}>
            <div className="chat-day">{dayLabel(day)}</div>
            {thread.messages
              .filter((m) => m.at.startsWith(day))
              .map((m) => (
                <div
                  key={m.id}
                  className={`msg ${m.from === 'me' ? 'out' : 'in'} ${m.pinnedBy ? 'pinned' : ''}`}
                  onPointerDown={() => startPress(m)}
                  onPointerUp={endPress}
                  onPointerLeave={endPress}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setActionMsg(m)
                  }}
                >
                  {m.from !== 'me' && thread.kind === 'group' && <div className="msg-sender">{m.sender}</div>}
                  {m.from === 'teacher' && thread.kind === 'teacher' && <div className="msg-sender">{m.sender}</div>}
                  <div className="bubble">
                    {m.order ? (
                      <OrderCard card={m.order} onOpen={() => onOpenOrder(m.order!)} />
                    ) : (
                      <>
                        {m.images && (
                          <div className={`msg-imgs n${Math.min(m.images.length, 3)}`}>
                            {m.images.map((src, i) => (
                              <button key={i} onClick={() => setViewer({ photos: m.images!, index: i })}>
                                <img src={src} alt="" />
                              </button>
                            ))}
                          </div>
                        )}
                        {m.text && <div className="msg-text">{m.text}</div>}
                      </>
                    )}
                    <div className="msg-time">
                      {m.pinnedBy && <Pin size={11} />} {m.at.slice(11, 16)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {thread.readOnly ? (
        <div className="composer-locked">Chỉ giáo viên được đăng bài trong nhóm này</div>
      ) : (
        <div className="composer-wrap">
          {files.length > 0 && (
            <div className="composer-preview">
              {files.map((src, i) => (
                <div className="med-photo" key={src}>
                  <img src={src} alt="" />
                  <span className="rm" onClick={() => setFiles((f) => f.filter((_, idx) => idx !== i))}>
                    ✕
                  </span>
                </div>
              ))}
              {!text.trim() && <span className="med-error">Vui lòng nhập nội dung kèm theo ảnh</span>}
            </div>
          )}
          <div className="composer">
            <button className="icon-btn" onClick={() => setShowAttach((v) => !v)} aria-label="Đính kèm">
              {showAttach ? <X size={22} /> : <Plus size={22} />}
            </button>
            <input
              placeholder="Nhập tin nhắn"
              maxLength={MAX_CHARS}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button className="icon-btn send" disabled={!text.trim()} onClick={send} aria-label="Gửi">
              <Send size={20} />
            </button>
          </div>
          {showAttach && (
            <div className="attach-menu">
              <label>
                <Camera size={20} /> Chụp ảnh
                <input type="file" className="hidden-input" accept="image/*" capture="environment" onChange={(e) => addFiles(e.target.files)} />
              </label>
              <label>
                <ImageIcon size={20} /> Thư viện
                <input type="file" className="hidden-input" accept="image/*,video/*" multiple onChange={(e) => addFiles(e.target.files)} />
              </label>
            </div>
          )}
        </div>
      )}

      {actionMsg && (
        <OverlayPortal>
          <div className="scrim" onClick={() => setActionMsg(null)} />
          <div className="sheet">
            <div className="sheet-body" style={{ padding: '8px 0 12px' }}>
              {actionMsg.pinnedBy ? (
                actionMsg.pinnedBy === 'me' && (
                  <button
                    className="action-row"
                    onClick={() => {
                      setUnpinMsg(actionMsg)
                      setActionMsg(null)
                    }}
                  >
                    <PinOff size={20} /> Bỏ ghim
                  </button>
                )
              ) : (
                <button className="action-row" onClick={() => pin(actionMsg)}>
                  <Pin size={20} /> Ghim
                </button>
              )}
              {actionMsg.text && !actionMsg.order && (
                <button className="action-row" onClick={() => copy(actionMsg)}>
                  <Copy size={20} /> Sao chép
                </button>
              )}
              {actionMsg.images?.length ? (
                <button className="action-row" onClick={() => download(actionMsg)}>
                  <Download size={20} /> Tải xuống
                </button>
              ) : null}
            </div>
          </div>
        </OverlayPortal>
      )}

      {showPins && (
        <OverlayPortal>
          <div className="scrim" onClick={() => setShowPins(false)} />
          <div className="sheet">
            <div className="sheet-head">
              <span className="t">Tin nhắn đã ghim ({pins.length})</span>
              <button className="icon-btn" onClick={() => setShowPins(false)} aria-label="Đóng">
                ✕
              </button>
            </div>
            <div className="sheet-body">
              {pins.length === 0 && <div className="text-muted" style={{ padding: 16 }}>Chưa có tin nhắn ghim</div>}
              {pins.map((m) => (
                <div className="pin-card" key={m.id}>
                  <div>
                    <b>{m.pinnedBy === 'me' ? 'Bạn' : m.sender}</b>
                    <div>{snippet(m)}</div>
                  </div>
                  {m.pinnedBy === 'me' && (
                    <button
                      className="icon-btn"
                      aria-label="Bỏ ghim"
                      onClick={() => {
                        setUnpinMsg(m)
                        setShowPins(false)
                      }}
                    >
                      <PinOff size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </OverlayPortal>
      )}

      {unpinMsg && (
        <OverlayPortal>
          <div className="scrim" />
          <div className="dialog-wrap">
            <div className="dialog-card">
              <div className="d-title">Bỏ ghim tin nhắn</div>
              <div className="d-sub">Bạn có chắc chắn muốn bỏ ghim tin nhắn này không?</div>
              <div className="btn-row">
                <button className="btn btn-outline" onClick={() => setUnpinMsg(null)}>
                  Đóng
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    unpinMsg.pinnedBy = undefined
                    setUnpinMsg(null)
                    show('Đã bỏ ghim tin nhắn')
                    bump()
                  }}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </OverlayPortal>
      )}

      {viewer && <PhotoViewer photos={viewer.photos} startIndex={viewer.index} onClose={() => setViewer(null)} onToast={show} />}
      {toast && <Toast message={toast} />}
    </div>
  )
}

function OrderCard({ card, onOpen }: { card: ChatOrderCard; onOpen: () => void }) {
  return (
    <div className="order-card">
      <div className="order-head">
        <b>{card.kind === 'medicine' ? 'Đơn dặn thuốc' : 'Đơn báo vắng'}</b>
        <span className="badge badge--filled">{card.status}</span>
      </div>
      {card.kind === 'medicine' ? (
        <>
          <div>Giờ uống thuốc: {card.times}</div>
          <div>Ghi chú: {card.note}</div>
        </>
      ) : (
        <>
          <div>Ngày nghỉ: {card.range}</div>
          <div>Thời gian nghỉ: {card.period}</div>
          <div>Lý do: {card.reason}</div>
        </>
      )}
      <button className="btn-link" onClick={onOpen}>
        Xem chi tiết
      </button>
    </div>
  )
}
