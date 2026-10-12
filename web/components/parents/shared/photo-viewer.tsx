'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Share2 } from 'lucide-react'
import { OverlayPortal } from '@/components/parents/shared/overlay-portal'

// Fullscreen image viewer: close (✕), "3/10" counter, download, swipe
// left/right between photos, tap an image to zoom. Same contract as the photo
// view in Đơn báo vắng (PRD: "làm giống").
export function PhotoViewer({
  photos,
  startIndex,
  onClose,
  onToast,
  videos,
  shareable,
}: {
  photos: string[]
  startIndex: number
  onClose: () => void
  onToast: (message: string) => void
  /** Per-item video info (same length as `photos`): shows a play/pause control and the duration. */
  videos?: ({ duration?: string } | null)[]
  /** Show the share button (Web Share API, falls back to a toast). */
  shareable?: boolean
}) {
  const [index, setIndex] = useState(startIndex)
  const [zoomed, setZoomed] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = trackRef.current
    if (el) el.scrollLeft = startIndex * el.clientWidth
  }, [startIndex])

  const share = async () => {
    try {
      if (!navigator.share) throw new Error('unsupported')
      await navigator.share({ title: 'ECO Me', url: location.href })
    } catch (e) {
      if ((e as Error).name !== 'AbortError') onToast('Thiết bị không hỗ trợ chia sẻ')
    }
  }

  const download = () => {
    try {
      const a = document.createElement('a')
      a.href = photos[index]
      a.download = `don-dan-thuoc-${index + 1}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      onToast('Đã tải xuống thành công')
    } catch {
      onToast('Tải xuống không thành công, vui lòng thử lại.')
    }
  }

  return (
    <OverlayPortal>
      <div className="photo-viewer">
        <div className="photo-viewer-bar">
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
          <span>
            {index + 1}/{photos.length}
          </span>
          <span className="photo-viewer-actions">
            {shareable && (
              <button className="icon-btn" onClick={share} aria-label="Chia sẻ">
                <Share2 size={20} />
              </button>
            )}
            <button className="icon-btn" onClick={download} aria-label="Tải xuống">
              ⬇
            </button>
          </span>
        </div>
        <div
          className="photo-viewer-track"
          ref={trackRef}
          onScroll={(e) => {
            const el = e.currentTarget
            setIndex(Math.round(el.scrollLeft / el.clientWidth))
            setZoomed(null)
            setPlaying(false)
          }}
        >
          {photos.map((src, i) => (
            <div className={`photo-viewer-slide ${zoomed === i ? 'zoomed' : ''}`} key={src + i}>
              <img src={src} alt={`Ảnh ${i + 1}`} onClick={() => (videos?.[i] ? setPlaying((p) => !p) : setZoomed(zoomed === i ? null : i))} />
              {videos?.[i] && (
                <>
                  <button className="pv-play" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Tạm dừng' : 'Phát'}>
                    {playing && index === i ? <Pause size={30} fill="#fff" /> : <Play size={30} fill="#fff" />}
                  </button>
                  {videos[i]?.duration && <span className="pv-duration">{videos[i]!.duration}</span>}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </OverlayPortal>
  )
}
