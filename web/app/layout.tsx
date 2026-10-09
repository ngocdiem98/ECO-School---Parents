import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EDU Parent — Phụ huynh',
  description: 'ECO School Phụ huynh — Thẻ học sinh thông minh',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
