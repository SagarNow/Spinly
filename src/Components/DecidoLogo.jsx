import React from 'react'

export default function DecidoLogo({ className = 'w-8 h-8', animated = true }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${animated ? 'transition-transform duration-700 ease-out group-hover:rotate-180' : ''}`}
      >
        <defs>
          {/* Vibrant Decido Gradients */}
          <linearGradient id="decidoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          <linearGradient id="bladeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <linearGradient id="bladeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>

          <linearGradient id="bladeGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>

          <linearGradient id="bladeGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Track with Glow */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#decidoRingGrad)"
          strokeWidth="3"
          strokeDasharray="4 3"
          opacity="0.75"
        />

        {/* Solid precision rim */}
        <circle
          cx="50"
          cy="50"
          r="41"
          stroke="url(#decidoRingGrad)"
          strokeWidth="2.5"
        />

        {/* 4 Aerodynamic Kinetic Spinner Blades */}
        {/* Blade 1 (Top) */}
        <path
          d="M 50 14 C 50 14, 62 26, 62 38 C 62 44, 56 50, 50 50 Z"
          fill="url(#bladeGrad1)"
        />

        {/* Blade 2 (Right) */}
        <path
          d="M 86 50 C 86 50, 74 62, 62 62 C 56 62, 50 56, 50 50 Z"
          fill="url(#bladeGrad2)"
        />

        {/* Blade 3 (Bottom) */}
        <path
          d="M 50 86 C 50 86, 38 74, 38 62 C 38 56, 44 50, 50 50 Z"
          fill="url(#bladeGrad3)"
        />

        {/* Blade 4 (Left) */}
        <path
          d="M 14 50 C 14 50, 26 38, 38 38 C 44 38, 50 44, 50 50 Z"
          fill="url(#bladeGrad4)"
        />

        {/* Outer Pointer Ticker at 12 o'clock */}
        <polygon
          points="50,4 55,14 45,14"
          fill="#ec4899"
          filter="url(#logoGlow)"
        />

        {/* Inner Hub Housing */}
        <circle
          cx="50"
          cy="50"
          r="14"
          fill="#070913"
          stroke="url(#decidoRingGrad)"
          strokeWidth="2"
        />

        {/* Center Bearing Pivot Point */}
        <circle
          cx="50"
          cy="50"
          r="6"
          fill="#06b6d4"
          filter="url(#logoGlow)"
        />
        <circle
          cx="50"
          cy="50"
          r="2.5"
          fill="#ffffff"
        />
      </svg>
    </div>
  )
}
