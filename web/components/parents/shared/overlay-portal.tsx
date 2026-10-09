'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

// Sheets/dialogs render their .scrim + .sheet (or .dialog-wrap) here instead
// of inline, so they land in #overlay-root (a sibling of <main
// className="screen-root"> — see app/page.tsx) rather than nested inside it.
// .screen-root is the scrollable element; an inline .sheet is still
// position:absolute against it as the containing block, so scrolling
// screen-root drags the "fixed" sheet along with it. Escaping into the
// sibling overlay layer (already scaffolded as .overlay-root in
// globals.css) keeps the sheet glued to the screen while its scrim blocks
// all interaction with the content underneath.
export function OverlayPortal({ children }: { children: ReactNode }) {
  const [root, setRoot] = useState<Element | null>(null)

  useEffect(() => {
    setRoot(document.getElementById('overlay-root'))

    // .desktop-backdrop pads the device mockup beyond the viewport, so the
    // page itself can scroll behind an open sheet even once the sheet is no
    // longer nested inside .screen-root. Lock page scroll for as long as
    // this sheet/dialog is mounted.
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  if (!root) return null
  return createPortal(children, root)
}
