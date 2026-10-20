// ECO School Phụ huynh — Service Worker (PWA)
const CACHE_NAME = 'eco-school-pwa-v3'

const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
]

// 1. Install: Pre-cache App Shell & Core Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// 2. Activate: Invalidate Stale Caches & Claim Clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  )
})

// 3. Fetch Strategy:
// - Navigation requests (HTML pages): Network-first with Cache fallback (App Shell)
// - Static assets (_next/static, icons, images, ds): Stale-while-revalidate
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only handle GET requests from http/https
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (!url.protocol.startsWith('http')) return

  // Skip Next.js hot module reloading & dev sockets
  if (url.pathname.includes('/_next/webpack-hmr') || url.pathname.includes('hot-update')) {
    return
  }

  // Never intercept or cache during local development or on local IPs
  const isLocalDev =
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname.startsWith('192.168.') ||
    url.port === '3100' ||
    url.port === '3000'

  if (isLocalDev) {
    return // Bypass service worker completely on local development!
  }

  // Navigation requests: Network-First
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone))
          }
          return response
        })
        .catch(async () => {
          const cached = await caches.match(request)
          if (cached) return cached
          return caches.match('/')
        })
    )
    return
  }

  // Static Assets (_next/static, /icons/, /ds/, /attendance/, etc.): Stale-While-Revalidate
  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/ds/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')

  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
            }
            return networkResponse
          })
          .catch(() => cachedResponse)

        return cachedResponse || fetchPromise
      })
    )
    return
  }

  // Default fallback: Network with Cache fallback
  event.respondWith(
    fetch(request).catch(async () => {
      return caches.match(request)
    })
  )
})

// Allow page to trigger immediate skipWaiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
