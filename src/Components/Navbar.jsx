'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Menu, X } from 'lucide-react'
import DecidoLogo from './DecidoLogo'

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Wheel', href: '/spin', highlight: true },
  { name: 'Coin Flip', href: '/flip' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'About', href: '/about' }
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex flex-col items-center px-4">
      {/* Floating Rounded Pill Bar */}
      <nav className="w-full max-w-2xl h-14 rounded-full glass-pill px-5 sm:px-7 flex items-center justify-between transition-all duration-300 border border-white/15 shadow-2xl shadow-indigo-950/40">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <DecidoLogo className="w-7 h-7" animated={true} />

          <span className="text-base font-black tracking-tight text-white group-hover:opacity-90">
            Decido<span className="text-cyan-400">.</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden sm:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/10">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-1 rounded-full text-xs font-semibold tracking-wide transition duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-cyan-500/25 to-purple-500/25 border border-cyan-400/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.name}</span>
                {link.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/5 transition"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu Pill Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 w-full max-w-xs rounded-2xl glass-pill p-3 flex flex-col gap-1.5 border border-white/15 shadow-2xl animate-in fade-in slide-in-from-top-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                pathname === link.href
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{link.name}</span>
              {link.highlight && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                  Active
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}