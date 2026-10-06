'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  RotateCcw, Volume2, VolumeX, Sparkles, Trophy,
  Play, Sliders, History, Trash2, Crown, Star
} from 'lucide-react'
import {
  playCoinFlipSound,
  playCoinLandSound,
  playButtonSound,
  playWinnerFanfare,
  warmUpAudio
} from '@/utils/audio'

const PRESET_CHOICES = [
  { head: 'HEADS', tail: 'TAILS' },
  { head: 'DO IT NOW', tail: 'TAKE A BREAK' },
  { head: 'WORKOUT', tail: 'REST DAY' },
  { head: 'COOK FOOD', tail: 'ORDER OUT' },
  { head: 'YES', tail: 'NO' },
  { head: 'BUILD FEATURE', tail: 'FIX BUGS' }
]

export default function CoinFlipPage() {
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState(null) // 'heads' | 'tails'
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // Pre-warm browser Web Audio API to eliminate latency on first click
  useEffect(() => {
    const primeAudio = () => warmUpAudio()
    window.addEventListener('pointerdown', primeAudio, { once: true })
    window.addEventListener('keydown', primeAudio, { once: true })
    return () => {
      window.removeEventListener('pointerdown', primeAudio)
      window.removeEventListener('keydown', primeAudio)
    }
  }, [])
  
  // Custom Choice text
  const [headsLabel, setHeadsLabel] = useState('HEADS')
  const [tailsLabel, setTailsLabel] = useState('TAILS')
  const [customModeOpen, setCustomModeOpen] = useState(false)

  // Best of 3 / 5 Mode
  const [matchMode, setMatchMode] = useState('single') // 'single' | 'best3' | 'best5'
  const [matchHistory, setMatchHistory] = useState([]) // list of recent round outcomes: ['heads', 'tails', ...]
  const [matchWinner, setMatchWinner] = useState(null)

  // Derived score strictly coupled to matchHistory — guarantees bullets and scores never desync
  const matchScore = {
    heads: matchHistory.filter((r) => r === 'heads').length,
    tails: matchHistory.filter((r) => r === 'tails').length
  }

  // Recent flips tape (e.g. ['heads', 'tails', 'heads'])
  const [recentFlips, setRecentFlips] = useState([])

  // Keyboard shortcut: Spacebar to flip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault()
        if (!isFlipping) handleFlip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFlipping, matchWinner, soundEnabled, headsLabel, tailsLabel, matchMode, matchHistory])

  const triggerLandingConfetti = () => {
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.62 },
        colors: ['#f59e0b', '#fbbf24', '#06b6d4', '#8b5cf6', '#ffffff']
      })
    } catch {}
  }

  const resetMatchState = () => {
    setMatchWinner(null)
    setMatchHistory([])
    setResult(null)
    playButtonSound(soundEnabled)
  }

  const handleFlip = () => {
    if (isFlipping) return

    // If match was already completed or won, start fresh!
    const isNewMatchStarting = matchWinner !== null
    const baseHistory = isNewMatchStarting ? [] : matchHistory

    if (isNewMatchStarting) {
      setMatchWinner(null)
      setMatchHistory([])
    }

    playCoinFlipSound(soundEnabled)
    setIsFlipping(true)
    setResult(null)

    // Outcome randomizer: 50/50
    const outcome = Math.random() < 0.5 ? 'heads' : 'tails'

    // Number of full 360 rotations (5 to 6 full spins for crisp, snappy pacing)
    const fullSpins = 5 + Math.floor(Math.random() * 2)
    const targetMod = outcome === 'heads' ? 0 : 180

    setRotation((prev) => {
      // Normalize current orientation to [0, 360)
      const currentMod = ((prev.x % 360) + 360) % 360
      // Calculate forward distance needed so it lands exactly on targetMod
      const diff = (targetMod - currentMod + 360) % 360
      // Spin forward by full revolutions + diff to guarantee 100% matching face
      const nextX = prev.x + (fullSpins * 360) + diff
      return {
        x: nextX,
        y: 0
      }
    })

    const flightDuration = 1500

    setTimeout(() => {
      setIsFlipping(false)
      setResult(outcome)
      playCoinLandSound(soundEnabled)

      // Add to recent flips tape
      setRecentFlips((prev) => [outcome, ...prev.slice(0, 7)])

      // Update match history if in Best of 3 / Best of 5
      if (matchMode !== 'single') {
        const nextHistory = [...baseHistory, outcome]
        setMatchHistory(nextHistory)

        const winThreshold = matchMode === 'best3' ? 2 : 3
        const headsCount = nextHistory.filter((r) => r === 'heads').length
        const tailsCount = nextHistory.filter((r) => r === 'tails').length

        if (headsCount >= winThreshold) {
          setMatchWinner('heads')
          playWinnerFanfare(soundEnabled)
          triggerLandingConfetti()
        } else if (tailsCount >= winThreshold) {
          setMatchWinner('tails')
          playWinnerFanfare(soundEnabled)
          triggerLandingConfetti()
        }
      } else {
        triggerLandingConfetti()
      }
    }, flightDuration)
  }

  const winThreshold = matchMode === 'best3' ? 2 : 3

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-24 relative overflow-hidden px-4 sm:px-6">
      {/* Background ambient lighting */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-amber-500/10 via-purple-600/15 to-cyan-500/10 blur-[130px] pointer-events-none -z-10" />

      <div className="w-full max-w-2xl mx-auto space-y-6">
        
        {/* ════ HEADER ════ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Decision Studio
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              3D Coin Flip
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Flip the minted bullion coin with 3D physics and settle choices instantly.
            </p>
          </div>

          {/* Sound & Options */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setCustomModeOpen(!customModeOpen)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                customModeOpen
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-400/20'
                  : 'bg-white/5 text-slate-300 hover:text-white border-white/10'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize Choices</span>
            </button>
          </div>
        </div>

        {/* ════ CUSTOM CHOICES ACCORDION ════ */}
        <AnimatePresence>
          {customModeOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-2xl p-5 border border-amber-500/30 overflow-hidden"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                <span>Personalize Heads & Tails</span>
              </h3>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {PRESET_CHOICES.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setHeadsLabel(p.head)
                      setTailsLabel(p.tail)
                      playButtonSound(soundEnabled)
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                      headsLabel === p.head && tailsLabel === p.tail
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-white/5 text-slate-300 hover:text-white border-white/5'
                    }`}
                  >
                    {p.head} vs {p.tail}
                  </button>
                ))}
              </div>

              {/* Manual input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-amber-300 uppercase block mb-1">
                    Side A (Heads / Gold)
                  </label>
                  <input
                    type="text"
                    value={headsLabel}
                    onChange={(e) => setHeadsLabel(e.target.value.toUpperCase())}
                    placeholder="e.g. YES, WORKOUT..."
                    maxLength={20}
                    className="w-full glass-input px-3 py-2 text-xs text-white rounded-xl focus:outline-none uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">
                    Side B (Tails / Silver)
                  </label>
                  <input
                    type="text"
                    value={tailsLabel}
                    onChange={(e) => setTailsLabel(e.target.value.toUpperCase())}
                    placeholder="e.g. NO, REST..."
                    maxLength={20}
                    className="w-full glass-input px-3 py-2 text-xs text-white rounded-xl focus:outline-none uppercase font-bold"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════ CENTER STAGE: 3D COIN ARENA (PERFECTLY CENTERED) ════ */}
        <div className="w-full flex flex-col items-center justify-between p-6 sm:p-9 pb-8 sm:pb-10 glass-card rounded-3xl border border-white/10 relative shadow-2xl">
          
          {/* Ambient glow behind coin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Toolbar: Mode Selection (Single / Best of 3 / Best of 5) */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/5 z-10 text-xs font-semibold mb-2">
            <button
              disabled={isFlipping}
              onClick={() => { setMatchMode('single'); resetMatchState() }}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${matchMode === 'single' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Single Flip
            </button>
            <button
              disabled={isFlipping}
              onClick={() => { setMatchMode('best3'); resetMatchState() }}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${matchMode === 'best3' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Best of 3
            </button>
            <button
              disabled={isFlipping}
              onClick={() => { setMatchMode('best5'); resetMatchState() }}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${matchMode === 'best5' ? 'bg-purple-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Best of 5
            </button>
          </div>

          {/* Series Match Scoreboard Header (when in Best of 3 / 5) */}
          {matchMode !== 'single' && (
            <div className="my-2 z-10 w-full max-w-sm bg-white/[0.03] p-3 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="text-center flex-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 block truncate">{headsLabel}</span>
                <span className="text-2xl font-black text-amber-300 font-mono">{matchScore.heads}</span>
              </div>

              <div className="flex flex-col items-center gap-1 px-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  First to {winThreshold}
                </span>
                
                {/* Round bullets */}
                <div className="flex items-center gap-1.5 mt-1">
                  {Array.from({ length: matchMode === 'best3' ? 3 : 5 }).map((_, i) => {
                    const roundOutcome = matchHistory[i]
                    return (
                      <span
                        key={i}
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] font-bold transition-all ${
                          roundOutcome === 'heads'
                            ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_8px_#f59e0b]'
                            : roundOutcome === 'tails'
                            ? 'bg-slate-200 border-slate-100 text-slate-950 shadow-[0_0_8px_#e2e8f0]'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        {roundOutcome === 'heads' ? 'H' : roundOutcome === 'tails' ? 'T' : ''}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className="text-center flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-300 block truncate">{tailsLabel}</span>
                <span className="text-2xl font-black text-slate-200 font-mono">{matchScore.tails}</span>
              </div>
            </div>
          )}

          {/* ── 3D FLIPPING COIN COMPONENT (SOLID PHYSICAL MEDALLION - NO HOVER JITTER) ── */}
          <div
            className="relative w-64 h-64 sm:w-72 sm:h-72 my-6 cursor-pointer select-none"
            style={{ perspective: '1400px' }}
            onClick={handleFlip}
            title="Click the coin or press Spacebar to flip!"
          >
            <motion.div
              animate={{
                rotateX: rotation.x,
                rotateY: isFlipping ? [0, 8, -8, 0] : 0,
                y: isFlipping ? [0, -170, 0] : 0,
                scale: isFlipping ? [1, 1.12, 1] : 1
              }}
              transition={{
                duration: isFlipping ? 1.5 : 0.4,
                times: isFlipping ? [0, 0.46, 1] : undefined,
                ease: isFlipping ? 'easeInOut' : 'easeOut'
              }}
              className="w-full h-full relative"
              style={{
                transformStyle: 'preserve-3d',
                willChange: isFlipping ? 'transform' : 'auto'
              }}
            >
              {/* ── SIDE 1: HEADS (CYBER IMPERIAL GOLD) ── */}
              <div
                className="absolute inset-0 rounded-full flex flex-col items-center justify-center text-center p-6 select-none overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  background: 'radial-gradient(circle at 35% 30%, #fef08a 0%, #f59e0b 35%, #b45309 70%, #451a03 100%)',
                  boxShadow: '0 0 0 6px #78350f, 0 0 35px rgba(245,158,11,0.55), inset 0 3px 12px rgba(255,255,255,0.9), inset 0 -6px 16px rgba(0,0,0,0.6)'
                }}
              >
                {/* Outer Milled Ridges Ring */}
                <div className="absolute inset-2.5 rounded-full border-2 border-dashed border-amber-950/60 pointer-events-none" />

                {/* Concentric Guilloché Tech Circles */}
                <div className="absolute inset-5 rounded-full border border-amber-300/40 bg-gradient-to-tr from-amber-600/25 via-transparent to-amber-200/35 pointer-events-none shadow-inner" />
                <div className="absolute inset-8 rounded-full border border-amber-400/20 pointer-events-none" />

                {/* Center Dimensional Gold Crest (Stable, solid, no hover movement) */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 p-1 shadow-2xl flex items-center justify-center border-2 border-amber-100/90 rotate-45">
                    {/* Inner content */}
                    <div className="-rotate-45 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-[#381503] drop-shadow-[0_2px_4px_rgba(255,255,255,0.6)] font-mono leading-none">
                        H
                      </span>
                    </div>
                    {/* Subtle core glow */}
                    <div className="absolute inset-0 rounded-3xl bg-amber-200/25 blur-sm pointer-events-none" />
                  </div>

                  {/* Heads Label */}
                  <span className="font-black text-2xl sm:text-3xl text-[#291002] tracking-wider uppercase mt-4 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] px-2 line-clamp-1">
                    {headsLabel}
                  </span>
                </div>
              </div>

              {/* ── SIDE 2: TAILS (CYBER OBSIDIAN & ELECTRIC CYAN) ── */}
              <div
                className="absolute inset-0 rounded-full flex flex-col items-center justify-center text-center p-6 select-none overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateX(180deg)',
                  background: 'radial-gradient(circle at 35% 30%, #e0f2fe 0%, #38bdf8 30%, #0369a1 70%, #082f49 100%)',
                  boxShadow: '0 0 0 6px #0369a1, 0 0 35px rgba(6,182,212,0.55), inset 0 3px 12px rgba(255,255,255,0.9), inset 0 -6px 16px rgba(0,0,0,0.6)'
                }}
              >
                {/* Outer Milled Ridges Ring */}
                <div className="absolute inset-2.5 rounded-full border-2 border-dashed border-cyan-950/60 pointer-events-none" />

                {/* Concentric Guilloché Tech Circles */}
                <div className="absolute inset-5 rounded-full border border-cyan-200/40 bg-gradient-to-tr from-cyan-600/25 via-transparent to-cyan-100/35 pointer-events-none shadow-inner" />
                <div className="absolute inset-8 rounded-full border border-cyan-300/20 pointer-events-none" />

                {/* Center Dimensional Platinum Crest (Stable, solid, no hover movement) */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-white via-cyan-200 to-cyan-700 p-1 shadow-2xl flex items-center justify-center border-2 border-white rotate-45">
                    {/* Inner content */}
                    <div className="-rotate-45 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-[#042f49] drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)] font-mono leading-none">
                        T
                      </span>
                    </div>
                    {/* Subtle core glow */}
                    <div className="absolute inset-0 rounded-3xl bg-cyan-200/30 blur-sm pointer-events-none" />
                  </div>

                  {/* Tails Label */}
                  <span className="font-black text-2xl sm:text-3xl text-[#082f49] tracking-wider uppercase mt-4 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] px-2 line-clamp-1">
                    {tailsLabel}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Dynamic 3D Coin Shadow on Table */}
            <motion.div
              animate={{
                scale: isFlipping ? [1, 0.35, 1] : 1,
                opacity: isFlipping ? [0.7, 0.12, 0.7] : 0.7,
                filter: isFlipping ? ['blur(8px)', 'blur(24px)', 'blur(8px)'] : 'blur(8px)'
              }}
              transition={{
                duration: isFlipping ? 1.5 : 0.4,
                times: isFlipping ? [0, 0.46, 1] : undefined,
                ease: 'easeInOut'
              }}
              className="w-56 h-7 mx-auto -mt-3 bg-black/90 rounded-full pointer-events-none"
            />
          </div>

          {/* Outcome Announcement & Victory Banner */}
          <div className="min-h-14 flex items-center justify-center mt-1 z-10">
            {matchWinner ? (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/25 via-yellow-500/25 to-purple-500/25 border-2 border-amber-400 text-amber-200 font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-amber-500/20"
              >
                <Trophy className="w-5 h-5 text-amber-300 animate-bounce" />
                <span>
                  <strong className="text-white uppercase">{matchWinner === 'heads' ? headsLabel : tailsLabel}</strong> WINS THE MATCH ({matchScore[matchWinner]}-{matchScore[matchWinner === 'heads' ? 'tails' : 'heads']})!
                </span>
              </motion.div>
            ) : isFlipping ? (
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-300 animate-pulse">
                <RotateCcw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Coin spinning in mid-air...</span>
              </div>
            ) : result ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <span className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Landed on <strong className={result === 'heads' ? 'text-amber-400' : 'text-slate-200'}>{result === 'heads' ? headsLabel : tailsLabel}</strong>!</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </span>
              </motion.div>
            ) : (
              <span className="text-xs text-slate-500 font-medium">
                Tap the coin or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px]">Spacebar</kbd> to flip!
              </span>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-4 z-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleFlip}
              disabled={isFlipping}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 hover:brightness-110 active:brightness-95 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>
                {isFlipping
                  ? 'Flipping...'
                  : matchWinner
                  ? 'Start New Match (0 - 0)'
                  : 'FLIP COIN'}
              </span>
            </button>

            {matchMode !== 'single' && (matchScore.heads > 0 || matchScore.tails > 0) && (
              <button
                disabled={isFlipping}
                onClick={resetMatchState}
                title="Reset match score back to 0-0"
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Match</span>
              </button>
            )}
          </div>

          {/* ════ RECENT FLIPS (CLEAN & CENTERED TAPE WITH CLEAR OPTION) ════ */}
          {recentFlips.length > 0 && (
            <div className="w-full max-w-lg mx-auto mt-8 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] z-10">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-cyan-400" /> Recent Flips
                </span>
                
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] text-slate-500 hidden sm:inline">Latest on left</span>
                  <button
                    onClick={() => {
                      setRecentFlips([])
                      playButtonSound(soundEnabled)
                    }}
                    title="Clear recent flip history"
                    className="text-[11px] font-bold text-slate-400 hover:text-red-400 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 flex-wrap pt-0.5">
                {recentFlips.map((f, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition ${
                      f === 'heads'
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-sm shadow-amber-500/10'
                        : 'bg-cyan-400/20 text-cyan-200 border-cyan-400/40 shadow-sm shadow-cyan-500/10'
                    } ${idx === 0 ? 'ring-2 ring-amber-400/60 shadow-md shadow-amber-500/20' : 'opacity-75'}`}
                  >
                    <span>{f === 'heads' ? <Crown className="w-3 h-3 text-amber-300" /> : <Star className="w-3 h-3 text-cyan-300" />}</span>
                    <span>{f === 'heads' ? headsLabel : tailsLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
