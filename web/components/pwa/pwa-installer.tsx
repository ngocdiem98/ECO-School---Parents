'use client'

import React, { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [showIosGuide, setShowIosGuide] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  // 1. Register Service Worker & Detect PWA state
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            reg.update()
            console.log('[PWA] Service Worker registered and updated:', reg.scope)
          })
          .catch((err) => {
            console.error('[PWA] Service Worker registration failed:', err)
          })
      })
    }

    // Check if already running in standalone mode (installed PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error navigator.standalone exists on iOS Safari
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')

    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    // Detect iOS Safari
    const ua = window.navigator.userAgent
    const isIosDevice = /iPhone|iPad|iPod/i.test(ua)
    const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/i.test(ua)
    setIsIos(isIosDevice && isSafari)

    // Check dismissal cooldown (dismissed within last 3 days)
    const dismissedAt = localStorage.getItem('eco_pwa_prompt_dismissed')
    const now = Date.now()
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000
    const wasRecentlyDismissed = dismissedAt && now - parseInt(dismissedAt, 10) < THREE_DAYS_MS

    // Handle beforeinstallprompt (Android / Chrome / Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      if (!wasRecentlyDismissed) {
        // Delay slightly for smooth initial page render
        setTimeout(() => setShowPrompt(true), 2500)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      console.log('[PWA] App installed successfully')
    })

    // Online/Offline tracking
    const updateOnlineStatus = () => setIsOffline(!navigator.onLine)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    setIsOffline(!navigator.onLine)

    // Show iOS install hint after a short while if eligible
    if (isIosDevice && isSafari && !wasRecentlyDismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 3500)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.removeEventListener('online', updateOnlineStatus)
        window.removeEventListener('offline', updateOnlineStatus)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice.outcome === 'accepted') {
        setShowPrompt(false)
        setDeferredPrompt(null)
      }
    } else if (isIos) {
      setShowIosGuide(true)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setShowIosGuide(false)
    localStorage.setItem('eco_pwa_prompt_dismissed', Date.now().toString())
  }

  return (
    <>
      {/* Offline Toast Banner */}
      {isOffline && (
        <div className="eco-pwa-offline-toast" role="alert">
          <span className="eco-pwa-offline-dot" />
          <span>Đang ngoại tuyến — Bạn vẫn có thể xem dữ liệu đã lưu</span>
        </div>
      )}

      {/* Floating PWA Install Prompt (Mobile & Desktop) */}
      {!isInstalled && showPrompt && (
        <div className="eco-pwa-banner" role="dialog" aria-label="Cài đặt ứng dụng ECO School">
          <div className="eco-pwa-banner__content">
            <div className="eco-pwa-banner__icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/icon-192x192.png"
                alt="ECO School App Icon"
                width={48}
                height={48}
              />
            </div>
            <div className="eco-pwa-banner__text">
              <div className="eco-pwa-banner__title">Cài đặt ECO School</div>
              <div className="eco-pwa-banner__desc">
                Mở nhanh từ màn hình chính, tra cứu mượt mà không cần mở trình duyệt.
              </div>
            </div>
          </div>

          <div className="eco-pwa-banner__actions">
            <button
              type="button"
              className="eco-pwa-btn eco-pwa-btn--install"
              onClick={handleInstallClick}
            >
              Cài đặt
            </button>
            <button
              type="button"
              className="eco-pwa-btn eco-pwa-btn--dismiss"
              onClick={handleDismiss}
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          {/* iOS Safari Step-by-Step Tooltip */}
          {showIosGuide && (
            <div className="eco-pwa-ios-guide">
              <div className="eco-pwa-ios-guide__title">Cách cài đặt trên iPhone / iPad:</div>
              <ol className="eco-pwa-ios-guide__steps">
                <li>
                  Nhấn vào biểu tượng <strong>Chia sẻ (Share)</strong>{' '}
                  <span className="eco-pwa-ios-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  </span>{' '}
                  ở thanh công cụ Safari.
                </li>
                <li>
                  Cuộn xuống và chọn <strong>Thêm vào MH chính (Add to Home Screen)</strong>{' '}
                  <span className="eco-pwa-ios-icon">➕</span>.
                </li>
                <li>
                  Nhấn <strong>Thêm (Add)</strong> ở góc trên bên phải để hoàn tất.
                </li>
              </ol>
              <button
                type="button"
                className="eco-pwa-btn eco-pwa-btn--gotit"
                onClick={() => setShowIosGuide(false)}
              >
                Đã hiểu
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
