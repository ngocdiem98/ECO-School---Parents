'use client'

// Small DS building blocks shared by the Hóa đơn screens (BillGroup chevron,
// PayCheckbox). Classes come from the DS bundle (.eco-billgrp, .eco-paycheck).

export function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// Yellow check / dash box of the ECO Me PayCheckbox; empty = outlined box.
export function PayCheckIcon({ checked, indeterminate }: { checked: boolean; indeterminate?: boolean }) {
  if (checked) {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect width="20" height="20" rx="4" fill="#FAC515" />
        <path d="M5.5 10.2L8.4 13.1L14.6 6.9" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (indeterminate) {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect width="20" height="20" rx="4" fill="#FAC515" />
        <line x1="6" y1="10" x2="14" y2="10" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  return <span className="eco-paycheck__box" />
}
