'use client'

import React from 'react'

export function FinvietLogo({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <div
      className={`provider-logo-wrap finviet-wrap ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        borderRadius: 8,
        border: '1px solid #F3F4F6',
        padding: '4px 6px',
        height: size,
        width: size * 2.2,
      }}
    >
      <svg width={size * 1.9} height={size * 0.9} viewBox="0 0 110 50" fill="none">
        {/* Yellow Triangular Chevron / Origami background */}
        <polygon points="44,46 12,6 76,6" fill="#FFB800" />
        {/* finviet text */}
        <text
          x="14"
          y="28"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="24"
          fontWeight="800"
          fill="#0284C7"
          letterSpacing="-0.5px"
        >
          fin
        </text>
        <text
          x="44"
          y="28"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="24"
          fontWeight="800"
          fill="#0284C7"
          letterSpacing="-0.5px"
        >
          viet
        </text>
      </svg>
    </div>
  )
}

export function TheSscLogo({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <div
      className={`provider-logo-wrap thessc-wrap ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        borderRadius: 8,
        border: '1px solid #F3F4F6',
        padding: '4px 6px',
        height: size,
        width: size * 2.2,
      }}
    >
      <svg width={size * 1.9} height={size * 0.9} viewBox="0 0 120 50" fill="none">
        {/* Stylized Golden Gradient SSC with S-SMART CARD */}
        <defs>
          <linearGradient id="sscGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#ECC440" />
            <stop offset="100%" stopColor="#B38F24" />
          </linearGradient>
        </defs>
        <text
          x="15"
          y="32"
          fontFamily="'Times New Roman', Times, serif"
          fontSize="36"
          fontWeight="bold"
          fill="url(#sscGold)"
          letterSpacing="1px"
        >
          SSC
        </text>
        <text
          x="14"
          y="44"
          fontFamily="system-ui, sans-serif"
          fontSize="7.5"
          fontWeight="700"
          fill="#997A1E"
          letterSpacing="0.8px"
        >
          S-SMART CARD
        </text>
      </svg>
    </div>
  )
}

export function VinaIdLogo({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <div
      className={`provider-logo-wrap vinaid-wrap ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        borderRadius: 8,
        border: '1px solid #F3F4F6',
        padding: '4px 6px',
        height: size,
        width: size * 2.2,
      }}
    >
      <svg width={size * 1.9} height={size * 0.9} viewBox="0 0 110 50" fill="none">
        {/* Vina in Navy Blue */}
        <text
          x="6"
          y="33"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="24"
          fontWeight="900"
          fill="#1E3A8A"
          letterSpacing="-0.5px"
        >
          Vina
        </text>
        {/* ID in Red Badge with White Text */}
        <rect x="64" y="10" width="38" height="28" rx="6" fill="#DC2626" />
        <text
          x="69"
          y="31"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="20"
          fontWeight="900"
          fill="#FFFFFF"
        >
          ID
        </text>
      </svg>
    </div>
  )
}
