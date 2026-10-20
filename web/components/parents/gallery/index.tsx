'use client'

import { useEffect, useRef, useState } from 'react'
import { CalendarDays, ImageOff, Loader2, Play } from 'lucide-react'
import { MOCK_STUDENTS, getStudent } from '@/lib/mock-data'
import { StudentHeader, TopBar } from '@/components/parents/shared/header'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { eligibleStudents } from '@/components/parents/shared/use-service-launcher'
import { PhotoViewer } from '@/components/parents/shared/photo-viewer'
import { Toast } from '@/components/parents/shared/toast'
import { useToast } from '@/components/parents/shared/use-toast'
import { addDays, albumCover, albumUpdatedAt, albumsFor, fmtDay, weekdayName, type Album } from '@/lib/school-data'

interface GalleryAppProps {
  studentId: string
  /** Deep link (from a notification): open this album. */
  openAlbumId?: string | null
  onBack: () => void
}

const PAGE = 18
const shortDay = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

// [PH-19] Thư viện ảnh / Album ảnh: 2-column grid of the albums of the chosen
// student (school-wide, class and tagged ones), newest update first; album
// detail with description (3 lines + Xem thêm), counters, items grouped by day
// in a 3-column grid with lazy loading, and the viewer with download / share.
export function GalleryApp({ studentId, openAlbumId, onBack }: GalleryAppProps) {
  const [selectedId, setSelectedId] = useState(studentId)
  const [albumId, setAlbumId] = useState<string | null>(openAlbumId ?? null)
  const [showPicker, setShowPicker] = useState(false)
  const switchable = eligibleStudents('gallery')
  const canSwitch = switchable.length > 1
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [shown, setShown] = useState(PAGE)
  const [loading, setLoading] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)
  const { toast, show } = useToast()

  const student = getStudent(selectedId)
  const albums = student ? albumsFor(student) : []
  const album = albums.find((a) => a.id === albumId)
  const sorted = album ? [...album.media].sort((a, b) => b.at.localeCompare(a.at)) : []

  // Lazy load: when the sentinel scrolls into view, "load" the next page.
  useEffect(() => {
    const el = sentinel.current
    if (!el || !album || shown >= sorted.length) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !loading) {
          setLoading(true)
          setTimeout(() => {
            setShown((n) => n + PAGE)
            setLoading(false)
          }, 500)
        }
      },
      { root: document.querySelector('.screen-root') },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [album, shown, sorted.length, loading])

  if (!student) return null

  const openAlbum = (a: Album) => {
    setAlbumId(a.id)
    setShown(PAGE)
    setExpanded(false)
  }

  if (album) {
    const photos = sorted.filter((m) => m.kind === 'image').length
    const vids = sorted.length - photos
    const visible = sorted.slice(0, shown)
    const days = Array.from(new Set(visible.map((m) => m.at.slice(0, 10))))
    const long = (album.description?.length ?? 0) > 120
    return (
      <div className="screen">
        <TopBar title={album.name} onBack={() => (openAlbumId ? onBack() : setAlbumId(null))} />
        {album.description && (
          <div className="album-desc">
            <p className={expanded ? '' : 'clamp3'}>{album.description}</p>
            {long && (
              <button className="post-more" onClick={() => setExpanded((v) => !v)}>
                {expanded ? 'Thu gọn' : 'Xem thêm'}
              </button>
            )}
          </div>
        )}
        <div className="album-summary">
          {photos} ảnh · {vids} video · Cập nhật {fmtDay(albumUpdatedAt(album))}
        </div>
        {sorted.length === 0 ? (
          <div className="empty-state">
            <ImageOff size={40} />
            <div className="text">Chưa có hình ảnh và video nào</div>
          </div>
        ) : (
          <>
            {days.map((day) => (
              <section key={day}>
                <div className="album-day">
                  <CalendarDays size={16} />
                  <b>
                    {weekdayName(day)}, {fmtDay(day)}
                  </b>
                </div>
                <div className="album-grid">
                  {visible
                    .filter((m) => m.at.startsWith(day))
                    .map((m) => (
                      <button key={m.id} className="mg-cell sq" onClick={() => setViewerIndex(sorted.indexOf(m))}>
                        <img src={m.src} alt="" />
                        {m.kind === 'video' && (
                          <span className="mg-video">
                            <Play size={22} fill="#fff" />
                            {m.duration && <em>{m.duration}</em>}
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              </section>
            ))}
            {shown < sorted.length ? (
              <div className="album-loading" ref={sentinel}>
                <Loader2 size={18} className="spin" /> Đang tải thêm…
              </div>
            ) : (
              <div className="feed-end">Đã xem hết album</div>
            )}
          </>
        )}
        {viewerIndex !== null && (
          <PhotoViewer
            photos={sorted.map((m) => m.src)}
            videos={sorted.map((m) => (m.kind === 'video' ? { duration: m.duration } : null))}
            startIndex={viewerIndex}
            shareable
            onClose={() => setViewerIndex(null)}
            onToast={show}
          />
        )}
        {toast && <Toast message={toast} />}
      </div>
    )
  }

  return (
    <div className="screen">
      <TopBar title="Thư viện ảnh" onBack={onBack} />
      <StudentHeader student={student} onChangeStudent={canSwitch ? () => setShowPicker(true) : undefined} />
      {albums.length ? (
        <div className="album-list">
          {albums.map((a) => {
            const cover = albumCover(a)
            return (
              <button className="album-card" key={a.id} onClick={() => openAlbum(a)}>
                <span className="album-cover">{cover ? <img src={cover} alt="" /> : <ImageOff size={28} />}</span>
                <span className="album-name">{a.name}</span>
                <span className="album-meta">
                  {a.media.length} mục · {shortDay(albumUpdatedAt(a))}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="empty-state">
          <ImageOff size={40} />
          <div className="text">Chưa có album nào</div>
        </div>
      )}
      {showPicker && (
        <StudentPickerSheet
          students={switchable}
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
