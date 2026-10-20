import type { Metadata, Viewport } from 'next'
import './ds-tokens.css'
import './eco-ds-bundle.css'
import './globals.css'
import './features-imported.css'
import './type-scale.css'
import './pwa-mobile.css'
import { PwaInstaller } from '@/components/pwa/pwa-installer'

export const metadata: Metadata = {
  title: 'EDU Parent — Phụ huynh',
  description: 'ECO School Phụ huynh — Thẻ học sinh thông minh',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ECO School',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'ECO School',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body>
        {children}
        <PwaInstaller />
      </body>
    </html>
  )
}
