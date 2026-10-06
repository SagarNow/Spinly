'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
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
  const logoWheelRef = useRef(null)

  // Rotate navbar wheel continuously as page scrolls — rAF throttled, passive listener
  const handleScroll = useCallback(() => {
    if (logoWheelRef.current) {
      const deg = (window.scrollY * 0.75) % 360
      logoWheelRef.current.style.transform = `rotate(${deg}deg)`
    }
  }, [])

  useEffect(() => {
    let rafId = null
    const onScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        handleScroll()
        rafId = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [handleScroll])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex flex-col items-center px-4">
      {/* Floating Rounded Pill Bar */}
      <nav className="w-full max-w-2xl h-14 rounded-full glass-pill px-5 sm:px-7 flex items-center justify-between border border-white/15 shadow-2xl shadow-indigo-950/40">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          prefetch={true}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div ref={logoWheelRef} className="will-change-transform flex items-center justify-center shrink-0">
            <DecidoLogo className="w-7 h-7" animated={true} />
          </div>

          <span className="text-base font-black tracking-tight text-white group-hover:opacity-90 transition-opacity duration-150">
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
                prefetch={true}
                className={`relative px-4 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors duration-150 flex items-center gap-1.5 ${
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
          className="sm:hidden p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/5 transition-colors duration-150"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu Pill Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 w-full max-w-xs rounded-2xl glass-pill p-3 flex flex-col gap-1.5 border border-white/15 shadow-2xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors duration-150 ${
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