'use client'

import React from 'react'
import Link from 'next/link'
import SpinlyLogo from './SpinlyLogo'
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#05070f] text-slate-400 pt-16 pb-12 px-6 relative z-20 overflow-hidden">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-pink-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">

          {/* Col 1: Brand & Status (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group cursor-pointer w-fit">
              <SpinlyLogo className="w-8 h-8" animated={true} />
              <span className="text-xl font-black text-white tracking-tight group-hover:opacity-90">
                Spinly<span className="text-cyan-400">.</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The anti-procrastination decision engine designed to eliminate analysis paralysis. Stop debating your to-do list, spin the wheel, and lock in.
            </p>

            {/* Live operational badge */}
            <div className="flex items-center gap-2 mt-2 w-fit px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational • Instant Decision Engine</span>
            </div>
          </div>

          {/* Col 2: Tools (2 cols) */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Engines
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/spin" className="hover:text-white transition flex items-center gap-1">
                  Wheel Studio
                </Link>
              </li>
              <li>
                <Link href="/flip" className="hover:text-white transition flex items-center gap-1">
                  3D Coin Flip
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition flex items-center gap-1">
                  Focus Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources (2 cols) */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Platform
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Spinly
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Milestone Badges
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect & Social (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Developer
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-1">
              Created by Sagar with React, Next.js, and physics algorithms.
            </p>

            <div className="flex items-center gap-2.5">
              <Link
                href="https://github.com/SagarNow"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-cyan-500/30 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </Link>

              <Link
                href="https://www.linkedin.com/in/mrsagarsingh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="font-mono text-[11px]">
            &copy; {new Date().getFullYear()} Spinly. Built for focused minds. Zero overthinking.
          </span>
          <span className="flex items-center gap-1.5 text-[11px]">
            Designed &amp; Developed by <strong className="text-slate-300 font-semibold">Sagar</strong>
          </span>
        </div>

      </div>
    </footer>
  )
}