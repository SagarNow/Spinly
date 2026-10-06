'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import DecidoLogo from '@/Components/DecidoLogo'
import {
  Sparkles,
  Brain,
  Timer,
  Shuffle,
  CheckCircle2,
  ArrowRight,
  Code2,
  ShieldCheck,
  Cpu,
  Zap,
  Target,
  Terminal,
  Activity,
  ChevronRight,
  Coins
} from 'lucide-react'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('philosophy')

  const pillars = [
    {
      icon: Brain,
      title: 'Defeat Hick’s Law',
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400',
      borderColor: 'group-hover:border-cyan-500/40',
      description:
        'Cognitive time increases logarithmically with choice count. When you face 8 options, your brain stalls. Decido reduces 8 options down to 1 in under 3 seconds.',
    },
    {
      icon: Shuffle,
      title: 'Physics-Based Delegation',
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-400',
      borderColor: 'group-hover:border-purple-500/40',
      description:
        'By delegating the initial pick to an unbiased wheel or coin flip, you eliminate the emotional weight of choosing. The resistance to starting immediately vanishes.',
    },
    {
      icon: Timer,
      title: 'Instant Focus Transition',
      color: 'from-pink-500 to-rose-600',
      textColor: 'text-pink-400',
      borderColor: 'group-hover:border-pink-500/40',
      description:
        'Decido doesn’t stop at picking a winner. It immediately presents a 25-minute Pomodoro sprint timer, converting decision momentum into immediate deep work.',
    },
    {
      icon: ShieldCheck,
      title: 'Zero Bloat, Zero Tracking',
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
      borderColor: 'group-hover:border-emerald-500/40',
      description:
        'No account creation, no subscriptions, no tracking cookies. All your tasks, custom wheel presets, and focus statistics live exclusively on your local device.',
    },
  ]

  const workflowSteps = [
    {
      step: '01',
      title: 'Dump Your Tasks',
      desc: 'Add anything you have been stalling on—coding, studying, chores, or decisions.',
      icon: Target,
    },
    {
      step: '02',
      title: 'Spin or Flip',
      desc: 'Let the dynamic Canvas inertia or 3D coin physics decide the outcome.',
      icon: Shuffle,
    },
    {
      step: '03',
      title: 'Lock into Sprint',
      desc: 'Jump directly into a 25-minute timer without second-guessing or debating.',
      icon: Timer,
    },
    {
      step: '04',
      title: 'Build Real Momentum',
      desc: 'Log completed deep work minutes and level up your milestone badges.',
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden bg-[#030712] text-slate-100">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-pink-600/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono font-medium text-cyan-300 mb-6 shadow-lg shadow-cyan-500/5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>The Anti-Overthinking Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Built to defeat{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent">
              Decision Paralysis
            </span>.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed">
            Starting is everything. When you spend all your cognitive energy debating what to do, you have nothing left to actually execute. Decido removes the friction of choice so you can jump straight into flow state.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            <div className="p-3 text-center">
              <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">0.0s</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">Choice Hesitation</div>
            </div>
            <div className="p-3 text-center border-l border-white/[0.06]">
              <div className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">25 Min</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">Pomodoro Sprint</div>
            </div>
            <div className="p-3 text-center border-l border-white/[0.06]">
              <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono">100%</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">Local &amp; Private</div>
            </div>
            <div className="p-3 text-center border-l border-white/[0.06]">
              <div className="text-xl sm:text-2xl font-black text-pink-400 font-mono">Zero</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">Account Friction</div>
            </div>
          </div>
        </div>

        {/* Narrative & Interactive Engine Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          
          {/* Left: Interactive Telemetry Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.1] shadow-2xl relative overflow-hidden group">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <DecidoLogo className="w-6 h-6" animated={true} />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">Decision Protocol</span>
                </div>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Active
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-2xl bg-[#070b18] border border-white/[0.08]">
                  <div className="text-[11px] uppercase font-mono text-cyan-400 tracking-wider font-semibold mb-1 flex items-center justify-between">
                    <span>The Mental Hurdle</span>
                    <Brain className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "I want to code, but should I fix tests, polish CSS, or read API docs first?"
                  </p>
                  <div className="mt-2 text-[11px] text-rose-400 font-mono flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>Result: 45 min wasted scrolling</span>
                  </div>
                </div>

                <div className="flex justify-center -my-1">
                  <div className="p-1 rounded-full bg-white/[0.05] border border-white/10 text-cyan-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-indigo-950/30 to-purple-950/20 border border-cyan-500/20">
                  <div className="text-[11px] uppercase font-mono text-emerald-400 tracking-wider font-semibold mb-1 flex items-center justify-between">
                    <span>The Decido Method</span>
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Options submitted &rarr; Physics spin triggered &rarr; Winner locked &rarr; 25:00 Timer starts immediately.
                  </p>
                  <div className="mt-2 text-[11px] text-emerald-400 font-mono flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Result: Instant deep work flow state</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">Formula: Action &gt; Motivation</span>
              <span className="text-slate-300 font-medium">Zero Second-Guessing</span>
            </div>
          </div>

          {/* Right: The Backstory & Mission (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-2xl relative">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Origin Story</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-mono">By Sagar</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-5">
                Motivation doesn’t create action. <br className="hidden sm:inline" />
                <span className="text-cyan-400">Action creates motivation.</span>
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                <p>
                  We have all stared at a screen with 15 open browser tabs, an endless to-do backlog, and a feeling of complete inertia. That mental freeze isn't laziness—it's <strong>analysis paralysis</strong>.
                </p>
                <p>
                  When every task feels equally important or intimidating, your brain expends its energy on continuous evaluation instead of execution. You debate for 20 minutes, get mentally fatigued, and procrastinate.
                </p>
                <p>
                  <strong>Decido was built to short-circuit this loop.</strong> By delegating the decision to an unbiased wheel spin or a 3D coin flip, you strip away the burden of prioritization. Once the wheel selects a task, your job isn't to evaluate—it's just to start the timer and work.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-cyan-500/20">
                  S
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Sagar</div>
                  <div className="text-xs text-slate-400 font-mono">Creator &amp; Frontend Developer</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="https://github.com/SagarNow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GitHub</span>
                </Link>
                <Link
                  href="https://www.linkedin.com/in/mrsagarsingh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* The 4 Principles / Pillars Grid */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              The Four Pillars of Decido
            </h3>
            <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
              Engineered from behavioral psychology and built with modern web technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <div
                  key={idx}
                  className={`p-6 sm:p-7 rounded-2xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.08] ${pillar.borderColor} transition-all duration-300 group flex flex-col justify-between`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${pillar.color} p-0.5 mb-5 shadow-lg group-hover:scale-105 transition-transform`}>
                      <div className="w-full h-full bg-[#070b18] rounded-[10px] flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${pillar.textColor}`} />
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {pillar.title}
                    </h4>

                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Principle 0{idx + 1}</span>
                    <span className="text-slate-400 group-hover:text-cyan-400 transition-colors">&rarr;</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* How It Operates (Flow Breakdown) */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] mb-20 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Workflow Blueprint</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              From Overthinking to Execution in 4 Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((item, i) => {
              const StepIcon = item.icon
              return (
                <div key={i} className="relative flex flex-col p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-slate-600">{item.step}</span>
                    <div className="p-2 rounded-xl bg-white/[0.04] text-cyan-400">
                      <StepIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tech Architecture Stack */}
        <div className="text-center mb-20">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
            Built with modern web standards
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
            {['Next.js 15 App Router', 'React 19', 'Tailwind CSS v4', 'HTML5 Canvas 2D', 'Web Audio API', 'Lucide Icons', 'LocalStorage Persistence'].map((tech, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono font-medium text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Final CTA Bar */}
        <div className="text-center max-w-2xl mx-auto p-10 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.1] shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-48 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl pointer-events-none" />

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3 relative z-10">
            Ready to stop debating your tasks?
          </h3>
          <p className="text-sm text-slate-300 mb-8 max-w-md mx-auto relative z-10">
            Pick a tool, drop in your tasks or flip for a binary choice, and let momentum take over.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <Link
              href="/spin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:via-indigo-500 hover:to-pink-400 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 hover:brightness-110 active:brightness-95 transition cursor-pointer"
            >
              <span>Launch Wheel Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/flip"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-semibold text-sm transition cursor-pointer"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>3D Coin Flip</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}