'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  ArrowUpRight, ArrowDown, Zap, Timer, Trophy, Shuffle,
  RotateCw, ListPlus, Flame, CheckCircle2, Crosshair,
  Sparkles, TrendingUp, Sliders, Coins, ArrowRight, Clock
} from 'lucide-react'

// ─── Scroll-reveal wrapper ────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Marquee ─────────────────────────────────────────────
const MARQUEE = [
  'Stop overthinking', 'Spin to decide', 'Build momentum',
  'One task at a time', 'Start now', 'Focus blocks',
  'Kill procrastination', 'Crush your goals'
]

function Marquee({ dir = 1 }) {
  const doubled = [...MARQUEE, ...MARQUEE]
  return (
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex gap-8 w-max"
        animate={{ x: dir > 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="shrink-0 flex items-center gap-4 text-xs font-semibold tracking-[0.22em] uppercase text-slate-600">
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────
export default function Main() {
  return (
    <main className="bg-[#070913] text-white overflow-x-hidden">

      {/* ══════════════════════════════════════════════════
          HERO — full-viewport, high-tech decision nexus
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Precision Grid Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Ambient Radial Mesh Gradients */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full opacity-40 blur-3xl"
          style={{
            width: 750,
            height: 750,
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(6,182,212,0.18) 40%, rgba(236,72,153,0.08) 65%, transparent 80%)',
          }}
        />

        {/* Subtle Cyber Kinetic Orbits in Center Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-20 hidden md:block">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
            className="w-[620px] h-[620px] rounded-full border border-dashed border-cyan-400/40 relative flex items-center justify-center"
          >
            <div className="w-[480px] h-[480px] rounded-full border border-white/20 relative flex items-center justify-center">
              <div className="w-[340px] h-[340px] rounded-full border border-dashed border-purple-500/30" />
            </div>
            {/* Orbital micro satellites */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#06b6d4]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]" />
          </motion.div>
        </div>

        {/* ── LEFT FLOATING TELEMETRY CHIPS (Replaces old giant half-wheel) ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
          className="hidden xl:flex absolute left-8 lg:left-14 top-1/2 -translate-y-1/2 flex-col gap-3.5 z-10 pointer-events-none select-none"
        >
          <div className="glass-card px-4 py-3 rounded-2xl border border-cyan-500/20 shadow-2xl flex items-center gap-3 backdrop-blur-xl">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
              <Timer className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Focus Protocol</div>
              <div className="text-xs font-bold text-slate-200">25m Deep Work Blocks</div>
            </div>
          </div>

          <div className="glass-card px-4 py-3 rounded-2xl border border-purple-500/20 shadow-2xl flex items-center gap-3 backdrop-blur-xl">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm shadow-purple-500/20">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Decision Velocity</div>
              <div className="text-xs font-bold text-slate-200">0.8s • Zero Overthinking</div>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT FLOATING TELEMETRY CHIPS (Replaces old giant half-wheel) ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: 'easeOut' }}
          className="hidden xl:flex absolute right-8 lg:right-14 top-1/2 -translate-y-1/2 flex-col gap-3.5 z-10 pointer-events-none select-none"
        >
          <div className="glass-card px-4 py-3 rounded-2xl border border-pink-500/20 shadow-2xl flex items-center gap-3 backdrop-blur-xl">
            <div className="w-9 h-9 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-sm shadow-pink-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Streak Engine</div>
              <div className="text-xs font-bold text-slate-200">Live Tracked Hours</div>
            </div>
          </div>

          <div className="glass-card px-4 py-3 rounded-2xl border border-emerald-500/20 shadow-2xl flex items-center gap-3 backdrop-blur-xl">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Execution Rate</div>
              <div className="text-xs font-bold text-slate-200">100% Commitment</div>
            </div>
          </div>
        </motion.div>

        {/* ── Hero text block — pt clears fixed navbar ── */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto" style={{ paddingTop: 100 }}>

          {/* overline badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-7 flex items-center justify-center gap-3"
          >
            <div className="h-px w-10 bg-slate-700" />
            <span className="text-[11px] uppercase tracking-[0.26em] text-cyan-400 font-mono font-medium">
              Task Decision Engine
            </span>
            <div className="h-px w-10 bg-slate-700" />
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="font-black leading-[0.88] tracking-[-0.045em] select-none"
            style={{ fontSize: 'clamp(4.5rem, 13vw, 10.5rem)' }}
          >
            <span className="block text-white select-none">SPIN.</span>
            <span
              className="block select-none"
              style={{ WebkitTextStroke: '2px rgba(255,255,255,0.14)', color: 'transparent' }}
            >
              DECIDE.
            </span>
            <span className="block text-white select-none">DO.</span>
          </motion.h1>

          {/* scroll hint only */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-16 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-1.5 text-slate-600 cursor-default"
            >
              <ArrowDown className="w-4 h-4 text-cyan-400/80" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MARQUEE STRIP
      ══════════════════════════════════════════════════ */}
      <div className="border-y border-white/[0.05] py-4">
        <Marquee dir={1} />
      </div>

      {/* ══════════════════════════════════════════════════
          THE PROBLEM — full-width editorial layout
      ══════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <span className="text-[11px] uppercase tracking-[0.26em] text-slate-500 font-mono font-medium">// THE PARALYSIS TRAP</span>
        </Reveal>

        {/* Big statement */}
        <Reveal delay={0.05}>
          <h2
            className="mt-4 font-black text-white tracking-tight leading-[1.05]"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}
          >
            Your to-do list is full.<br />
            <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.18)', color: 'transparent' }}>
              You still don't know where to start.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 text-slate-400 text-base leading-relaxed max-w-xl">
            Every morning you open your list and freeze. You re-read every item,
            shuffle priorities, and 20 minutes later you haven't started anything.
            That's not a productivity problem — that's a <em className="text-slate-300 not-italic font-semibold">decision problem</em>.
            Decido removes the friction so you can immediately lock in.
          </p>
        </Reveal>

        {/* 4 stat pills — horizontal row */}
        <Reveal delay={0.15}>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: '30m', sub: 'wasted daily just choosing what to work on first' },
              { value: '< 3s', sub: 'is all Decido needs to make the definitive call' },
              { value: '25m', sub: 'deep focus block kicks in directly after the spin' },
              { value: '0', sub: 'willpower burned on prioritizing — save it for doing' },
            ].map(({ value, sub }) => (
              <div
                key={value}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all"
              >
                <div className="text-4xl font-black text-white font-mono">{value}</div>
                <div className="text-xs text-slate-500 mt-2 leading-snug">{sub}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS — modern high-tier step cards (No Emojis)
      ══════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06] relative">
        <div className="max-w-6xl mx-auto px-6 py-24">

          <Reveal className="mb-14">
            <span className="text-[11px] uppercase tracking-[0.26em] text-cyan-400 font-mono font-medium">
              // 03-STEP EXECUTION FLOW
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">
              From blank list to<br />focused work in 3 moves.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: ListPlus,
                badge: 'Input Phase',
                title: 'Curate Your Tasks',
                desc: 'Add anything on your mind. Coding tasks, study assignments, or load instant preset packs (Dev, Study, Quick Wins) with one click.',
                accentGlow: 'from-violet-500/15 via-transparent to-transparent',
                borderColor: 'border-violet-500/30',
                iconColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30'
              },
              {
                step: '02',
                icon: RotateCw,
                badge: 'Decision Engine',
                title: 'Spin the Wheel',
                desc: 'Trigger the wheel. Real rotational momentum decelerates smoothly with mechanical ticker audio. When it stops, that is your target. No debate.',
                accentGlow: 'from-cyan-500/15 via-transparent to-transparent',
                borderColor: 'border-cyan-500/30',
                iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
              },
              {
                step: '03',
                icon: Zap,
                badge: 'Execution Protocol',
                title: 'Lock In & Crush It',
                desc: 'Launch directly into the Pomodoro workspace. Focus for 25m or 50m with live timer hours tracking, subtasks, and zero multitasking.',
                accentGlow: 'from-pink-500/15 via-transparent to-transparent',
                borderColor: 'border-pink-500/30',
                iconColor: 'text-pink-400 bg-pink-500/10 border-pink-500/30'
              },
            ].map(({ step, icon: Icon, badge, title, desc, accentGlow, borderColor, iconColor }, i) => (
              <Reveal key={step} delay={i * 0.12}>
                <div className={`relative h-full rounded-3xl border ${borderColor} bg-gradient-to-b ${accentGlow} bg-[#090c1a] p-7 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between group`}>
                  
                  {/* Subtle Top Ambient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />

                  <div>
                    {/* Top row: Icon + Step label */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg ${iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-500 tracking-wider">
                        {step}
                      </span>
                    </div>

                    <div className="inline-block text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold mb-2">
                      {badge}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2.5">
                      {title}
                    </h3>

                    <p className="text-sm text-slate-400 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono">Ready to execute</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES — elevated modern showcase
      ══════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06] relative">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <Reveal className="mb-14">
            <span className="text-[11px] uppercase tracking-[0.26em] text-cyan-400 font-mono font-medium">
              // CORE SYSTEM CAPABILITIES
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">
              Engineered to eliminate hesitation.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Sliders,
                tag: 'Momentum Physics',
                title: 'Physics Deceleration',
                desc: 'Smooth natural inertia with mechanical ticker clicks on every slice for satisfying, irreversible outcomes.',
                pill: '60 FPS Motion'
              },
              {
                icon: Clock,
                tag: 'Time Boxing',
                title: 'Live Focus Timer',
                desc: 'Pomodoro timer with second-by-second live hour tracking. 25m, 50m, or custom duration blocks.',
                pill: 'Accurate Hours'
              },
              {
                icon: TrendingUp,
                tag: 'Productivity Intel',
                title: 'Streak & Analytics',
                desc: 'Track daily targets, completed decisions, and weekly momentum charts in a dedicated dashboard.',
                pill: 'Daily Milestones'
              },
              {
                icon: Coins,
                tag: 'Decision Toolkit',
                title: 'Presets & 3D Coin',
                desc: 'Instant presets for Dev & Study, plus a realistic 3D Coin Flip engine for rapid binary choices.',
                pill: '1-Click Presets'
              },
            ].map(({ icon: Icon, tag, title, desc, pill }, idx) => (
              <Reveal key={title} delay={idx * 0.08}>
                <div className="rounded-2xl border border-white/[0.08] bg-[#090c1a] p-6 h-full flex flex-col justify-between hover:border-cyan-500/30 hover:bg-[#0d1226] transition-all duration-300 shadow-xl group">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.1] text-cyan-400 flex items-center justify-center mb-4 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1">{tag}</div>
                    <div className="text-base font-bold text-white mb-2">{title}</div>
                    <div className="text-xs text-slate-400 leading-relaxed">{desc}</div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] font-mono font-medium text-cyan-300/80 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                      {pill}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MARQUEE 2
      ══════════════════════════════════════════════════ */}
      <div className="border-y border-white/[0.05] py-4">
        <Marquee dir={-1} />
      </div>

      {/* ══════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-6 py-28 flex flex-col items-center text-center">
          <Reveal>
            <h2
              className="font-black tracking-tight leading-[0.9] text-white"
              style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)' }}
            >
              Stop planning.<br />
              <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.14)', color: 'transparent' }}>Start spinning.</span>
            </h2>
            <p className="mt-6 text-slate-400 text-base max-w-sm mx-auto leading-relaxed">
              Free forever. No account. No setup needed.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            {/* Glowing gradient CTA button */}
            <div className="mt-10 relative inline-block">
              {/* glow layer */}
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-70"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4, #ec4899)' }}
              />
              <Link
                href="/spin"
                className="group relative inline-flex items-center gap-3 px-9 py-4 rounded-full text-base font-black text-white hover:brightness-110 active:brightness-95 transition"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #0891b2, #db2777)',
                  boxShadow: '0 0 40px rgba(139,92,246,0.4), 0 0 80px rgba(6,182,212,0.2)',
                }}
              >
                Launch Decido
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  )
}
