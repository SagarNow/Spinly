'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, Plus, Trash2, CheckCircle2,
  Sparkles, Shuffle, Timer, Trophy, X, Check, Flame, Zap,
  ArrowLeft, AlertTriangle, CheckSquare, Square, CornerDownLeft, Sliders, Clock,
  Mic, MicOff
} from 'lucide-react'
import { playTickSound, playWinnerFanfare, playButtonSound, playFocusChime, speakCoachMessage } from '@/utils/audio'
import { recordTaskCompletion, recordFocusSession, recordRealFocusTime } from '@/utils/dashboardStore'

const SEGMENT_COLORS = [
  { bg: '#7C3AED', bgDark: '#4C1D95', text: '#FFFFFF', glow: '#A78BFA' }, // Royal Violet
  { bg: '#06B6D4', bgDark: '#0E7490', text: '#FFFFFF', glow: '#67E8F9' }, // Cyan Neon
  { bg: '#F43F5E', bgDark: '#9F1239', text: '#FFFFFF', glow: '#FDA4AF' }, // Crimson Rose
  { bg: '#059669', bgDark: '#064E3B', text: '#FFFFFF', glow: '#6EE7B7' }, // Emerald Jade
  { bg: '#D97706', bgDark: '#78350F', text: '#FFFFFF', glow: '#FDE68A' }, // Golden Amber
  { bg: '#2563EB', bgDark: '#1E3A8A', text: '#FFFFFF', glow: '#93C5FD' }, // Cobalt Blue
  { bg: '#C026D3', bgDark: '#701A75', text: '#FFFFFF', glow: '#F0ABFC' }, // Electric Fuchsia
  { bg: '#0D9488', bgDark: '#134E4A', text: '#FFFFFF', glow: '#5EEAD4' }, // Teal Neon
  { bg: '#EA580C', bgDark: '#7C2D12', text: '#FFFFFF', glow: '#FDBA74' }, // Electric Coral
  { bg: '#4F46E5', bgDark: '#312E81', text: '#FFFFFF', glow: '#A5B4FC' }  // Deep Indigo
]

const LS_DAILY_KEY = 'decido_daily_tasks'
const LS_WHEEL_KEY = 'decido_wheel_tasks'
const LS_COMPLETED_KEY = 'decido_completed_tasks'

const DEFAULT_DAILY = ['Post on LinkedIn', 'Check & reply emails', 'Daily standup', 'Review PRs', '30m Workout']
const OLD_DEFAULTS = ['Build Next Feature', 'Fix That Bug', 'Write Docs', '30m Deep Focus', 'Quick Walk']


export default function SpinWheel() {
  const [dailyTasks, setDailyTasks] = useState(DEFAULT_DAILY)
  const [tasks, setTasks] = useState([]) // Empty by default!
  const [newDailyInput, setNewDailyInput] = useState('')
  const [newWheelInput, setNewWheelInput] = useState('')
  const [wheelState, setWheelState] = useState('idle') // 'idle' | 'spinning' | 'stopping'
  const isSpinning = wheelState !== 'idle'
  const [winner, setWinner] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [completedTasks, setCompletedTasks] = useState([])
  const [addedFeedback, setAddedFeedback] = useState(null)

  // ── Accountability / Reroll Checkpoint state ──
  const [showRerollModal, setShowRerollModal] = useState(false)

  // ── Dedicated Active Focus Mode state ──
  const [focusTask, setFocusTask] = useState(null)
  const [pomodoroMode, setPomodoroMode] = useState('focus25') // 'focus25', 'deep50', 'break5', 'break15', 'custom'
  const [voiceMode, setVoiceMode] = useState('female') // 'female' | 'male' | 'off'
  const [customMinutes, setCustomMinutes] = useState(20)
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [initialDurationSeconds, setInitialDurationSeconds] = useState(25 * 60)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [subtasks, setSubtasks] = useState([])
  const [newSubtaskInput, setNewSubtaskInput] = useState('')

  const uncommittedFocusSecondsRef = useRef(0)
  const currentSessionSecondsRef = useRef(0)

  const flushUncommittedFocusTime = (taskTitle = focusTask) => {
    if (uncommittedFocusSecondsRef.current > 0) {
      recordRealFocusTime(uncommittedFocusSecondsRef.current, taskTitle || 'Focus Session')
      uncommittedFocusSecondsRef.current = 0
    }
  }

  const canvasRef = useRef(null)
  const rotationAngleRef = useRef(0)
  const animationFrameRef = useRef(null)
  const lastTickSliceRef = useRef(-1)
  const currentVelocityRef = useRef(0)
  const needleRef = useRef(null)
  const needleLedRef = useRef(null)

  const triggerTickerBump = useCallback(() => {
    if (needleRef.current) {
      needleRef.current.style.transform = 'scale(1.22) translateY(-2px)'
      if (needleLedRef.current) {
        needleLedRef.current.style.backgroundColor = '#ec4899'
        needleLedRef.current.style.boxShadow = '0 0 10px #ec4899'
      }
      setTimeout(() => {
        if (needleRef.current) needleRef.current.style.transform = 'scale(1) translateY(0)'
        if (needleLedRef.current) {
          needleLedRef.current.style.backgroundColor = '#06b6d4'
          needleLedRef.current.style.boxShadow = '0 0 8px #06b6d4'
        }
      }, 45)
    }
  }, [])

  // ── Load saved data on mount ──
  useEffect(() => {
    try {
      const daily = localStorage.getItem(LS_DAILY_KEY) || localStorage.getItem('spinly_daily_tasks')
      const wheel = localStorage.getItem(LS_WHEEL_KEY) || localStorage.getItem('spinly_wheel_tasks')
      const completed = localStorage.getItem(LS_COMPLETED_KEY) || localStorage.getItem('spinly_completed_tasks')
      const savedVoice = localStorage.getItem('decido_voice_mode')

      if (savedVoice) {
        setVoiceMode(savedVoice)
      }

      if (daily) {
        const parsed = JSON.parse(daily)
        if (Array.isArray(parsed) && parsed.length > 0) setDailyTasks(parsed)
      }
      if (wheel) {
        const parsed = JSON.parse(wheel)
        const isOldDefault = Array.isArray(parsed) &&
          parsed.length === OLD_DEFAULTS.length &&
          parsed.every((t, i) => t === OLD_DEFAULTS[i])

        if (Array.isArray(parsed) && !isOldDefault) {
          setTasks(parsed)
        } else {
          setTasks([])
          localStorage.setItem(LS_WHEEL_KEY, JSON.stringify([]))
        }
      }
      if (completed) {
        const parsed = JSON.parse(completed)
        if (Array.isArray(parsed)) setCompletedTasks(parsed)
      }
    } catch { /* noop */ }
  }, [])

  // ── Auto-save to localStorage ──
  useEffect(() => {
    try { localStorage.setItem(LS_WHEEL_KEY, JSON.stringify(tasks)) } catch { /* noop */ }
  }, [tasks])

  useEffect(() => {
    try { localStorage.setItem(LS_COMPLETED_KEY, JSON.stringify(completedTasks)) } catch { /* noop */ }
  }, [completedTasks])

  // ── Draw Wheel ──
  const drawWheel = useCallback((currentAngle) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)
    const size = canvas.clientWidth || 380
    const targetDim = Math.round(size * dpr)
    if (canvas.width !== targetDim || canvas.height !== targetDim) {
      canvas.width = targetDim
      canvas.height = targetDim
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 12

    ctx.clearRect(0, 0, size, size)
    const sliceCount = tasks.length

    // Empty state wheel
    if (sliceCount === 0) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = '#0b0f20'
      ctx.fill()

      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2)
      ctx.setLineDash([8, 10])
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.45)'
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.restore()

      for (let deg = 0; deg < 360; deg += 45) {
        const rad = (deg * Math.PI) / 180
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + Math.cos(rad) * (radius - 4), centerY + Math.sin(rad) * (radius - 4))
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, 38, 0, Math.PI * 2)
      ctx.fillStyle = '#070913'
      ctx.fill()
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()

      ctx.save()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'rgba(226, 232, 240, 0.85)'
      ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.fillText('Wheel is empty', centerX, centerY - 68)
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
      ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.fillText('Add tasks from left to spin', centerX, centerY + 68)
      ctx.restore()
      return
    }

    // 1 task state
    if (sliceCount === 1) {
      const colorScheme = SEGMENT_COLORS[0]
      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = colorScheme.bg
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = colorScheme.text
      ctx.font = '900 18px -apple-system, "Inter", sans-serif'
      ctx.shadowColor = 'rgba(0,0,0,0.8)'
      ctx.shadowBlur = 8
      ctx.fillText(tasks[0], 0, -radius * 0.4)
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, 32, 0, Math.PI * 2)
      ctx.fillStyle = '#070913'
      ctx.fill()
      ctx.strokeStyle = '#8b5cf6'
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.restore()
      return
    }

    // 2+ tasks state
    const sliceAngle = (Math.PI * 2) / sliceCount

    // 1. Draw Each Slice
    tasks.forEach((task, index) => {
      const startAngle = currentAngle + index * sliceAngle
      const endAngle = startAngle + sliceAngle
      const colorScheme = SEGMENT_COLORS[index % SEGMENT_COLORS.length]

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      // Rich 3D radial gradient: vibrant at middle, deep at inner & outer edge
      const grad = ctx.createRadialGradient(
        centerX, centerY, radius * 0.15,
        centerX, centerY, radius
      )
      grad.addColorStop(0, colorScheme.bg)
      grad.addColorStop(0.65, colorScheme.bg)
      grad.addColorStop(1, colorScheme.bgDark || adjustColor(colorScheme.bg, -35))
      ctx.fillStyle = grad
      ctx.fill()

      // Subtle slice bevel border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()

      // High-contrast clean white typography with deep shadow
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + sliceAngle / 2)
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#FFFFFF'

      const fontSize = sliceCount <= 4 ? 16 : sliceCount <= 6 ? 14 : sliceCount <= 9 ? 12 : 10
      ctx.font = `900 ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, sans-serif`
      ctx.shadowColor = 'rgba(0,0,0,0.95)'
      ctx.shadowBlur = 6
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      let displayText = task.replace(/[\u{1F600}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F000}-\u{1FFFF}]/gu, '').trim()
      const maxChars = sliceCount <= 4 ? 20 : sliceCount <= 6 ? 18 : sliceCount <= 9 ? 14 : 11
      if (displayText.length > maxChars) displayText = displayText.slice(0, maxChars - 1) + '…'
      ctx.fillText(displayText, radius - 18, 0)
      ctx.restore()
    })

    // 2. Dark Vignette / 3D Depth Inner Ring
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    const vignette = ctx.createRadialGradient(
      centerX, centerY, radius * 0.72,
      centerX, centerY, radius
    )
    vignette.addColorStop(0, 'rgba(0,0,0,0)')
    vignette.addColorStop(1, 'rgba(0,0,0,0.38)')
    ctx.fillStyle = vignette
    ctx.fill()
    ctx.restore()

    // 3. Crisp Spoke Dividers
    tasks.forEach((_, index) => {
      const spokeAngle = currentAngle + index * sliceAngle
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(
        centerX + Math.cos(spokeAngle) * radius,
        centerY + Math.sin(spokeAngle) * radius
      )
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 2
      ctx.shadowColor = 'rgba(0,0,0,0.6)'
      ctx.shadowBlur = 4
      ctx.stroke()
      ctx.restore()
    })

    // 4. Outer Titanium Rim with Neon Border
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2)
    const rimGrad = ctx.createLinearGradient(0, 0, size, size)
    rimGrad.addColorStop(0, '#06b6d4')
    rimGrad.addColorStop(0.33, '#8b5cf6')
    rimGrad.addColorStop(0.66, '#ec4899')
    rimGrad.addColorStop(1, '#06b6d4')
    ctx.strokeStyle = rimGrad
    ctx.lineWidth = 5
    ctx.shadowColor = 'rgba(139,92,246,0.6)'
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.restore()

    // 5. 3D Metallic Rivet Studs (Pegs) around the rim!
    const numPegs = Math.max(sliceCount, 12)
    for (let i = 0; i < numPegs; i++) {
      const pegAngle = currentAngle + (i * Math.PI * 2) / numPegs
      const pegX = centerX + Math.cos(pegAngle) * (radius - 2)
      const pegY = centerY + Math.sin(pegAngle) * (radius - 2)

      ctx.save()
      ctx.beginPath()
      ctx.arc(pegX, pegY, 4, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.fill()

      const pegGrad = ctx.createLinearGradient(pegX - 2.5, pegY - 2.5, pegX + 2.5, pegY + 2.5)
      pegGrad.addColorStop(0, '#FFFFFF')
      pegGrad.addColorStop(0.3, '#E2E8F0')
      pegGrad.addColorStop(0.8, '#94A3B8')
      pegGrad.addColorStop(1, '#334155')
      ctx.beginPath()
      ctx.arc(pegX, pegY, 3, 0, Math.PI * 2)
      ctx.fillStyle = pegGrad
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'
      ctx.lineWidth = 0.8
      ctx.stroke()
      ctx.restore()
    }

    // 6. Center Hub
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, 34, 0, Math.PI * 2)
    ctx.fillStyle = '#070913'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 4
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2)
    ctx.fillStyle = '#0b0f20'
    ctx.fill()
    ctx.strokeStyle = '#8b5cf6'
    ctx.lineWidth = 2.5
    ctx.shadowColor = 'rgba(139,92,246,0.9)'
    ctx.shadowBlur = 14
    ctx.stroke()

    // Inner glowing jewel
    ctx.beginPath()
    ctx.arc(centerX, centerY, 13, 0, Math.PI * 2)
    const hubGrad = ctx.createLinearGradient(centerX - 13, centerY - 13, centerX + 13, centerY + 13)
    hubGrad.addColorStop(0, '#06b6d4')
    hubGrad.addColorStop(1, '#ec4899')
    ctx.fillStyle = hubGrad
    ctx.fill()
    ctx.restore()
  }, [tasks])

  function adjustColor(col, amt) {
    if (col[0] === '#') col = col.slice(1)
    const num = parseInt(col, 16)
    let r = Math.max(Math.min(255, (num >> 16) + amt), 0)
    let b = Math.max(Math.min(255, ((num >> 8) & 0x00FF) + amt), 0)
    let g = Math.max(Math.min(255, (num & 0x0000FF) + amt), 0)
    return '#' + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0')
  }

  useEffect(() => { drawWheel(rotationAngleRef.current) }, [tasks, drawWheel])
  useEffect(() => {
    const handleResize = () => drawWheel(rotationAngleRef.current)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawWheel])

  const getSelectedSlice = (angle) => {
    if (tasks.length === 0) return null
    const twoPi = Math.PI * 2
    const sliceAngle = twoPi / tasks.length
    const pointerAngle = (Math.PI * 3) / 2
    const normalizedAngle = (pointerAngle - (angle % twoPi) + twoPi) % twoPi
    const selectedIndex = Math.floor(normalizedAngle / sliceAngle) % tasks.length
    return { index: selectedIndex, task: tasks[selectedIndex], color: SEGMENT_COLORS[selectedIndex % SEGMENT_COLORS.length] }
  }

  // ── User-Controlled Spin & Stop Mechanics ──
  const stopWheel = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    playButtonSound(soundEnabled)
    setWheelState('stopping')

    // Initial velocity at the exact instant STOP is clicked
    const v0 = currentVelocityRef.current > 0 ? currentVelocityRef.current : 15.0
    // Total braking time T in seconds
    const T = 2.8 + Math.random() * 0.4
    const decelStartTime = performance.now()
    const decelStartAngle = rotationAngleRef.current

    // Exact physics integration:
    // v(t) = v0 * (1 - t/T)^2
    // theta(t) = theta0 + (v0 * T / 3) * (1 - (1 - t/T)^3)
    // Derivative at t=0 is EXACTLY v0 (ZERO speed jump!)
    // Derivative at t=T is EXACTLY 0 (perfect gentle halt)
    const totalDistance = (v0 * T) / 3
    const decelTargetAngle = decelStartAngle + totalDistance

    const animateDecel = (currentTime) => {
      const elapsedSec = (currentTime - decelStartTime) / 1000
      const progress = Math.min(elapsedSec / T, 1)

      const currentAngle = decelStartAngle + totalDistance * (1 - Math.pow(1 - progress, 3))

      rotationAngleRef.current = currentAngle
      drawWheel(currentAngle)

      const currentSelected = getSelectedSlice(currentAngle)
      if (currentSelected && currentSelected.index !== lastTickSliceRef.current) {
        lastTickSliceRef.current = currentSelected.index
        playTickSound(soundEnabled)
        triggerTickerBump()
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateDecel)
      } else {
        setWheelState('idle')
        const finalSelected = getSelectedSlice(decelTargetAngle)
        if (finalSelected) {
          setWinner(finalSelected)
          playWinnerFanfare(soundEnabled)
          triggerConfetti()
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(animateDecel)
  }, [soundEnabled, drawWheel, tasks])

  const startSpin = useCallback(() => {
    if (tasks.length < 2) return
    playButtonSound(soundEnabled)
    setWinner(null)
    setShowRerollModal(false)
    setWheelState('spinning')

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    const cruiseSpeed = 15.0 // radians per second (~2.4 rev/sec)
    let currentSpeed = 0
    let lastTime = performance.now()
    const startTime = lastTime

    const animateSpin = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1)
      lastTime = currentTime

      if (currentSpeed < cruiseSpeed) {
        currentSpeed = Math.min(cruiseSpeed, currentSpeed + 40 * dt)
      }

      currentVelocityRef.current = currentSpeed

      const newAngle = rotationAngleRef.current + currentSpeed * dt
      rotationAngleRef.current = newAngle
      drawWheel(newAngle)

      const currentSelected = getSelectedSlice(newAngle)
      if (currentSelected && currentSelected.index !== lastTickSliceRef.current) {
        lastTickSliceRef.current = currentSelected.index
        playTickSound(soundEnabled)
        triggerTickerBump()
      }

      // Auto-stop safety after 20 seconds if user doesn't press stop
      if (currentTime - startTime > 20000) {
        stopWheel()
        return
      }

      animationFrameRef.current = requestAnimationFrame(animateSpin)
    }

    animationFrameRef.current = requestAnimationFrame(animateSpin)
  }, [tasks.length, soundEnabled, drawWheel, stopWheel])

  const handleSpinOrStop = () => {
    if (wheelState === 'idle') {
      startSpin()
    } else if (wheelState === 'spinning') {
      stopWheel()
    }
  }

  // Alias for other functions
  const spinWheel = startSpin

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const triggerConfetti = () => {
    try {
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 }, colors: ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'] })
      setTimeout(() => {
        confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } })
        confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } })
      }, 250)
    } catch { /* noop */ }
  }

  // ── Daily Routines Management ──
  const toggleDailyOnWheel = (task) => {
    if (tasks.includes(task)) {
      setTasks((prev) => prev.filter((t) => t !== task))
      playButtonSound(soundEnabled)
      return
    }
    if (tasks.length >= 20) return
    playButtonSound(soundEnabled)
    setTasks((prev) => [...prev, task])
    setAddedFeedback(task)
    setTimeout(() => setAddedFeedback(null), 1200)
  }

  const addAllDailyToWheel = () => {
    playButtonSound(soundEnabled)
    setTasks((prev) => {
      const unadded = dailyTasks.filter((t) => !prev.includes(t))
      return [...prev, ...unadded].slice(0, 20)
    })
  }

  const handleAddDailyTask = (textToAdd) => {
    const trimmed = (typeof textToAdd === 'string' ? textToAdd : newDailyInput).trim()
    if (!trimmed || dailyTasks.length >= 30) return
    if (dailyTasks.includes(trimmed)) {
      setNewDailyInput('')
      return
    }
    const updated = [trimmed, ...dailyTasks]
    setDailyTasks(updated)
    try { localStorage.setItem(LS_DAILY_KEY, JSON.stringify(updated)) } catch { /* noop */ }
    setNewDailyInput('')
    playButtonSound(soundEnabled)
  }

  const handleDeleteDailyTask = (taskToDelete) => {
    const updated = dailyTasks.filter((t) => t !== taskToDelete)
    setDailyTasks(updated)
    try { localStorage.setItem(LS_DAILY_KEY, JSON.stringify(updated)) } catch { /* noop */ }
    playButtonSound(soundEnabled)
  }

  // ── Wheel Pool Direct Add / Delete ──
  const handleAddWheelTask = (e) => {
    e?.preventDefault()
    const trimmed = newWheelInput.trim()
    if (!trimmed || tasks.length >= 20) return
    if (tasks.includes(trimmed)) {
      setNewWheelInput('')
      return
    }
    setTasks((prev) => [...prev, trimmed])
    setNewWheelInput('')
    playButtonSound(soundEnabled)
  }

  const handleDeleteWheelTask = (index) => {
    playButtonSound(soundEnabled)
    setTasks((prev) => prev.filter((_, i) => i !== index))
  }

  // ── Focus / Execution Mode Controls ──
  const startFocusSession = (taskName, defaultDuration = 25 * 60) => {
    playButtonSound(soundEnabled)
    setFocusTask(taskName)
    setPomodoroMode(defaultDuration === 50 * 60 ? 'deep50' : 'focus25')
    setTimerSeconds(defaultDuration)
    setInitialDurationSeconds(defaultDuration)
    setIsTimerRunning(true)
    setWinner(null)
    setShowRerollModal(false)
    setSubtasks([])
    playFocusChime(soundEnabled)
    speakCoachMessage("Focus session started. Good luck! Let's lock in.", voiceMode)
  }

  const handleToggleTimer = () => {
    if (isTimerRunning) {
      flushUncommittedFocusTime(focusTask)
      setIsTimerRunning(false)
      playButtonSound(soundEnabled)
      speakCoachMessage('Timer paused.', voiceMode)
    } else {
      setIsTimerRunning(true)
      playButtonSound(soundEnabled)
      playFocusChime(soundEnabled)
      const isBreak = pomodoroMode === 'break5' || pomodoroMode === 'break15'
      if (isBreak) {
        speakCoachMessage('Break time started. Step away and recharge.', voiceMode)
      } else {
        speakCoachMessage("Focus session started. Good luck! Let's lock in.", voiceMode)
      }
    }
  }

  const handleVoiceChange = (mode) => {
    setVoiceMode(mode)
    try {
      localStorage.setItem('decido_voice_mode', mode)
    } catch {}
    if (mode === 'female') {
      speakCoachMessage('Female voice coach enabled.', 'female')
    } else if (mode === 'male') {
      speakCoachMessage('Male voice coach enabled.', 'male')
    }
  }

  const changeTimerMode = (mode, seconds) => {
    flushUncommittedFocusTime(focusTask)
    setPomodoroMode(mode)
    setTimerSeconds(seconds)
    setInitialDurationSeconds(seconds)
    setIsTimerRunning(false)
    playButtonSound(soundEnabled)
    if (mode === 'break5' || mode === 'break15') {
      speakCoachMessage('Switched to break mode. Take time to relax.', voiceMode)
    } else if (mode === 'deep50') {
      speakCoachMessage('50 minute deep focus mode selected.', voiceMode)
    } else if (mode === 'focus25') {
      speakCoachMessage('25 minute standard focus mode selected.', voiceMode)
    }
  }

  const handleApplyCustomMinutes = (mins) => {
    flushUncommittedFocusTime(focusTask)
    const valid = Math.max(1, Math.min(180, Number(mins) || 20))
    setCustomMinutes(valid)
    setPomodoroMode('custom')
    setTimerSeconds(valid * 60)
    setInitialDurationSeconds(valid * 60)
    setIsTimerRunning(false)
    playButtonSound(soundEnabled)
  }

  useEffect(() => {
    let interval = null
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((sec) => {
          if (sec <= 1) return 0
          return sec - 1
        })
        uncommittedFocusSecondsRef.current += 1
        currentSessionSecondsRef.current += 1

        // Commit every 5 seconds so dashboard focus hours always stay live and accurate
        if (uncommittedFocusSecondsRef.current >= 5) {
          recordRealFocusTime(uncommittedFocusSecondsRef.current, focusTask || 'Focus Session')
          uncommittedFocusSecondsRef.current = 0
        }
      }, 1000)
    } else if (timerSeconds === 0 && isTimerRunning) {
      flushUncommittedFocusTime(focusTask)
      setIsTimerRunning(false)
      playWinnerFanfare(soundEnabled)
      triggerConfetti()

      const isBreak = pomodoroMode === 'break5' || pomodoroMode === 'break15'
      if (isBreak) {
        speakCoachMessage('Break is over! Time to start your next session.', voiceMode)
      } else {
        speakCoachMessage('Great job! Focus session completed. You crushed it.', voiceMode)
      }

      // Record completed focus session for stats & streak!
      recordFocusSession({
        taskTitle: focusTask || 'Focus Session',
        mode: pomodoroMode,
        durationMinutes: Math.max(1, Math.round(currentSessionSecondsRef.current / 60)),
        secondsSpent: currentSessionSecondsRef.current,
        completed: true
      })
      currentSessionSecondsRef.current = 0
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, timerSeconds, soundEnabled, initialDurationSeconds, focusTask, pomodoroMode])

  // Flush remaining uncommitted focus seconds when task changes or component unmounts
  useEffect(() => {
    return () => {
      flushUncommittedFocusTime(focusTask)
    }
  }, [focusTask])

  const handleAddSubtask = (e) => {
    e?.preventDefault()
    const trimmed = newSubtaskInput.trim()
    if (!trimmed) return
    setSubtasks((prev) => [...prev, { id: Date.now(), text: trimmed, completed: false }])
    setNewSubtaskInput('')
    playButtonSound(soundEnabled)
  }

  const toggleSubtask = (id) => {
    setSubtasks((prev) => prev.map((s) => s.id === id ? { ...s, completed: !s.completed } : s))
    playButtonSound(soundEnabled)
  }

  const handleCompleteCurrentTask = () => {
    const taskTitle = focusTask || (winner ? winner.task : null)
    if (!taskTitle) return
    playWinnerFanfare(soundEnabled)
    triggerConfetti()

    flushUncommittedFocusTime(taskTitle)

    const actualSecondsSpent = currentSessionSecondsRef.current
    const minutesSpent = Math.round(actualSecondsSpent / 60)

    if (actualSecondsSpent >= 15) {
      recordFocusSession({
        taskTitle,
        mode: pomodoroMode,
        durationMinutes: Math.max(1, minutesSpent),
        secondsSpent: actualSecondsSpent,
        completed: true
      })
    }

    // Record in central dashboard store
    recordTaskCompletion(taskTitle, minutesSpent)

    setCompletedTasks((prev) => [
      { id: Date.now(), title: taskTitle, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), durationMinutes: minutesSpent },
      ...prev
    ])

    currentSessionSecondsRef.current = 0

    // Remove from current wheel session
    setTasks((prev) => prev.filter((t) => t !== taskTitle))

    // Close focus mode and winner popup
    setFocusTask(null)
    setWinner(null)
    setShowRerollModal(false)
    setIsTimerRunning(false)
  }

  // ── Re-Spin / Reroll Handlers ──
  const handleRerollKeepTask = () => {
    playButtonSound(soundEnabled)
    setWinner(null)
    setShowRerollModal(false)
    setTimeout(() => {
      spinWheel()
    }, 150)
  }

  const handleRerollRemoveTask = () => {
    if (winner) {
      playButtonSound(soundEnabled)
      const taskToRemove = winner.task
      const remaining = tasks.filter((t) => t !== taskToRemove)
      setTasks(remaining)
      setWinner(null)
      setShowRerollModal(false)
      if (remaining.length >= 2) {
        setTimeout(() => {
          spinWheel()
        }, 150)
      }
    }
  }

  const handleBackToWheelManual = () => {
    playButtonSound(soundEnabled)
    setWinner(null)
    setShowRerollModal(false)
  }

  const formatTimer = (secs) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`

  const unaddedDailyCount = dailyTasks.filter((t) => !tasks.includes(t)).length

  // ══════════════════════════════════════════════════════════
  // VIEW A: DEDICATED ACTIVE FOCUS WORKSPACE
  // ══════════════════════════════════════════════════════════
  if (focusTask) {
    const isCompletedTime = timerSeconds === 0
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-4 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="glass-card rounded-3xl border border-cyan-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Glowing Top Ambient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-cyan-500/20 via-purple-600/25 to-pink-500/20 blur-3xl pointer-events-none" />

          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08] relative z-10">
            <button
              onClick={() => {
                if (isTimerRunning && !confirm('Timer is still running! Are you sure you want to go back to the wheel?')) return
                flushUncommittedFocusTime(focusTask)
                if (currentSessionSecondsRef.current >= 30) {
                  recordFocusSession({
                    taskTitle: focusTask || 'Focus Session',
                    mode: pomodoroMode,
                    durationMinutes: Math.max(1, Math.round(currentSessionSecondsRef.current / 60)),
                    secondsSpent: currentSessionSecondsRef.current,
                    completed: false
                  })
                }
                currentSessionSecondsRef.current = 0
                setIsTimerRunning(false)
                setFocusTask(null)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Wheel
            </button>

            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-cyan-300">
                Focus Mode Active
              </span>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute' : 'Unmute'}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Hero: "You are currently doing this" */}
          <div className="text-center max-w-2xl mx-auto mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wider uppercase mb-3">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              You are currently doing this:
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-2">
              {focusTask}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Zero multitasking. Put away distractions and focus exclusively on this single task.
            </p>
          </div>

          {/* Pomodoro Timer Centerpiece */}
          <div className="max-w-md mx-auto rounded-3xl bg-slate-950/60 border border-white/10 p-6 text-center mb-8 relative z-10 shadow-inner">
            {/* Mode selection tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/5 mb-4 text-xs font-semibold">
              <button
                onClick={() => { setShowCustomPicker(false); changeTimerMode('focus25', 25 * 60) }}
                className={`py-1.5 px-1.5 rounded-xl transition cursor-pointer ${pomodoroMode === 'focus25' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
              >
                25m Focus
              </button>
              <button
                onClick={() => { setShowCustomPicker(false); changeTimerMode('deep50', 50 * 60) }}
                className={`py-1.5 px-1.5 rounded-xl transition cursor-pointer ${pomodoroMode === 'deep50' ? 'bg-purple-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'}`}
              >
                50m Deep
              </button>
              <button
                onClick={() => { setShowCustomPicker(false); changeTimerMode('break5', 5 * 60) }}
                className={`py-1.5 px-1.5 rounded-xl transition cursor-pointer ${pomodoroMode === 'break5' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
              >
                5m Break
              </button>
              <button
                onClick={() => { setShowCustomPicker(false); changeTimerMode('break15', 15 * 60) }}
                className={`py-1.5 px-1.5 rounded-xl transition cursor-pointer ${pomodoroMode === 'break15' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
              >
                15m Break
              </button>
              <button
                onClick={() => {
                  setShowCustomPicker(!showCustomPicker)
                  if (pomodoroMode !== 'custom') {
                    handleApplyCustomMinutes(customMinutes)
                  }
                }}
                className={`py-1.5 px-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 col-span-2 sm:col-span-1 ${pomodoroMode === 'custom' ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white bg-white/[0.03]'}`}
              >
                <Sliders className="w-3 h-3" />
                <span>{pomodoroMode === 'custom' ? `${customMinutes}m` : 'Custom'}</span>
              </button>
            </div>

            {/* Custom Duration Configurator Panel */}
            <AnimatePresence>
              {(showCustomPicker || pomodoroMode === 'custom') && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  className="mb-5 p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/30 text-left overflow-hidden shadow-lg shadow-amber-500/5"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider">Set Custom Focus Time</span>
                    </div>
                    <span className="text-xs font-mono font-black px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {customMinutes} mins
                    </span>
                  </div>

                  {/* Preset quick chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {[10, 15, 20, 30, 45, 60, 90, 120].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => handleApplyCustomMinutes(mins)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          customMinutes === mins
                            ? 'bg-amber-400 text-slate-950 font-bold shadow'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>

                  {/* Range Slider + Steppers */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleApplyCustomMinutes(customMinutes - 5)}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer border border-white/5"
                      title="Minus 5 minutes"
                    >
                      -5m
                    </button>

                    <input
                      type="range"
                      min="1"
                      max="120"
                      value={customMinutes}
                      onChange={(e) => handleApplyCustomMinutes(Number(e.target.value))}
                      className="flex-1 accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                    />

                    <button
                      type="button"
                      onClick={() => handleApplyCustomMinutes(customMinutes + 5)}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer border border-white/5"
                      title="Plus 5 minutes"
                    >
                      +5m
                    </button>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>1 to 180 min precision slider</span>
                    <button
                      type="button"
                      onClick={() => setShowCustomPicker(false)}
                      className="text-amber-300 hover:text-amber-200 font-bold text-[11px] underline cursor-pointer"
                    >
                      Collapse
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Giant Countdown Clock */}
            <div className="py-2">
              <span className={`text-6xl sm:text-7xl font-mono font-black tracking-tight ${isCompletedTime ? 'text-emerald-400 animate-pulse' : 'text-white'}`}>
                {formatTimer(timerSeconds)}
              </span>
              {isCompletedTime && (
                <p className="text-xs font-bold text-emerald-400 mt-2">Session Completed! Great job!</p>
              )}

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-3 max-w-[240px] mx-auto">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, ((initialDurationSeconds - timerSeconds) / (initialDurationSeconds || 1)) * 100))}%`
                  }}
                />
              </div>
            </div>

            {/* Timer controls */}
            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={handleToggleTimer}
                className={`px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition cursor-pointer shadow-lg ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25'
                }`}
              >
                {isTimerRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4 fill-current" /> Start Timer</>}
              </button>

              <button
                onClick={() => {
                  flushUncommittedFocusTime(focusTask)
                  const defaultSecs =
                    pomodoroMode === 'deep50' ? 50 * 60 :
                    pomodoroMode === 'break5' ? 5 * 60 :
                    pomodoroMode === 'break15' ? 15 * 60 :
                    pomodoroMode === 'custom' ? customMinutes * 60 :
                    25 * 60
                  setTimerSeconds(defaultSecs)
                  setInitialDurationSeconds(defaultSecs)
                  setIsTimerRunning(false)
                  playButtonSound(soundEnabled)
                  speakCoachMessage('Timer reset.', voiceMode)
                }}
                title="Reset timer"
                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Voice Coach Controls */}
            <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-white/[0.06]">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Mic className="w-3.5 h-3.5 text-cyan-400" />
                <span>Voice Coach:</span>
              </span>
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleVoiceChange('female')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    voiceMode === 'female'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Female voice motivator"
                >
                  <span>Female</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleVoiceChange('male')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    voiceMode === 'male'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Male voice motivator"
                >
                  <span>Male</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleVoiceChange('off')}
                  className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    voiceMode === 'off'
                      ? 'bg-white/15 text-slate-200 font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title="Mute voice coach"
                >
                  <MicOff className="w-3 h-3" />
                  <span>Off</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Sub-Tasks Checklist */}
          <div className="max-w-md mx-auto mb-8 relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Task Breakdown / Sub-steps</span>
              <span className="text-[10px] text-slate-600">{subtasks.filter(s => s.completed).length}/{subtasks.length} done</span>
            </h3>

            <form onSubmit={handleAddSubtask} className="flex gap-2 mb-2.5">
              <input
                type="text"
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                placeholder="Add sub-step (e.g. Outline draft, open IDE)..."
                className="flex-1 glass-input px-3 py-1.5 text-xs text-white placeholder-slate-500 rounded-xl focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newSubtaskInput.trim()}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/15 disabled:opacity-30 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => toggleSubtask(st.id)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition cursor-pointer"
                >
                  {st.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className={`text-xs truncate ${st.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {st.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Completion Button */}
          <div className="text-center pt-2 relative z-10 border-t border-white/[0.06]">
            <button
              onClick={handleCompleteCurrentTask}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/25 hover:brightness-110 active:brightness-95 transition cursor-pointer inline-flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Mark Task as Completed & Return to Wheel
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════
  // VIEW B: MAIN WHEEL STUDIO
  // ══════════════════════════════════════════════════════════
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative">

      {/* ── Studio Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ════ LEFT COLUMN: Daily Routine Bank & Wheel Pool ════ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-5 flex flex-col gap-4"
        >

          {/* ── 1. DAILY ROUTINE BANK (Saved permanent habits) ── */}
          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500/25 to-indigo-500/25 text-purple-400 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Daily Routine Bank
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                      {dailyTasks.length}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-none">Saved recurring tasks · 1-click add to wheel</p>
                </div>
              </div>

              {dailyTasks.length > 0 && unaddedDailyCount > 0 && (
                <button
                  onClick={addAllDailyToWheel}
                  title="Add all saved routines to wheel pool"
                  className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Add All ({unaddedDailyCount})
                </button>
              )}
            </div>

            {/* Simple clear explanation note */}
            <div className="px-3.5 pt-2.5 pb-0.5">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Save your recurring daily tasks here once. Whenever you want to spin, just tap <span className="text-cyan-300 font-medium">+ to Wheel</span> to load them without re-typing.
              </p>
            </div>

            {/* Add Custom Routine Input */}
            <form onSubmit={handleAddDailyTask} className="flex gap-2 px-3 pt-2 pb-2">
              <input
                type="text"
                value={newDailyInput}
                onChange={(e) => setNewDailyInput(e.target.value)}
                placeholder="Type a recurring daily task (e.g. Post on LinkedIn)..."
                className="flex-1 glass-input px-3 py-1.5 text-xs text-white placeholder-slate-500 rounded-xl focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newDailyInput.trim()}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Save
              </button>
            </form>

            {/* Daily tasks list */}
            <div className="max-h-[150px] overflow-y-auto px-3 pb-3 space-y-1">
              {dailyTasks.length === 0 ? (
                <div className="text-center py-4 text-slate-500 text-xs">
                  Routine bank is empty! Click the suggestions above or type your recurring tasks.
                </div>
              ) : (
                dailyTasks.map((task, index) => {
                  const isOnWheel = tasks.includes(task)
                  const justAdded = addedFeedback === task
                  return (
                    <div
                      key={index}
                      className="group flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition"
                    >
                      <span className={`text-xs truncate flex-1 font-medium ${isOnWheel ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {task}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {/* Send / Toggle on wheel */}
                        <button
                          onClick={() => toggleDailyOnWheel(task)}
                          disabled={isSpinning}
                          title={isOnWheel ? 'Click to remove from wheel' : 'Click to send to wheel'}
                          className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                            justAdded
                              ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                              : isOnWheel
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30'
                              : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/20'
                          }`}
                        >
                          {justAdded ? (
                            <><Check className="w-3 h-3" /> Added</>
                          ) : isOnWheel ? (
                            <><Check className="w-3 h-3" /> On Wheel</>
                          ) : (
                            <><Plus className="w-3 h-3" /> to Wheel</>
                          )}
                        </button>

                        {/* Delete daily task */}
                        <button
                          onClick={() => handleDeleteDailyTask(task)}
                          title="Delete from routine bank"
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded-md text-slate-500 transition cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* ── 2. WHEEL TASK POOL ── */}
          <div className="glass-card rounded-2xl border border-white/10 p-3.5 shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${tasks.length > 0 ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Wheel Pool
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${tasks.length > 0 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-500'}`}>
                    {tasks.length} / 20
                  </span>
                </h3>
              </div>

              <div className="flex items-center gap-1">
                {tasks.length > 0 && (
                  <button
                    onClick={() => setTasks([])}
                    disabled={isSpinning}
                    title="Clear all tasks from wheel"
                    className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer mr-1"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setTasks((prev) => [...prev].sort(() => Math.random() - 0.5))}
                  disabled={tasks.length < 2 || isSpinning}
                  title="Shuffle wheel tasks"
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-30 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Direct add input for one-off tasks */}
            <form onSubmit={handleAddWheelTask} className="flex gap-2 mb-2.5">
              <input
                type="text"
                value={newWheelInput}
                onChange={(e) => setNewWheelInput(e.target.value)}
                placeholder="Add a one-off task directly to wheel..."
                disabled={isSpinning}
                className="flex-1 glass-input px-3 py-1.5 text-xs text-white placeholder-slate-500 rounded-xl focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSpinning || !newWheelInput.trim() || tasks.length >= 20}
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition disabled:opacity-40 cursor-pointer hover:from-cyan-400 hover:to-indigo-500"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Pool Tasks List or Empty State */}
            {tasks.length === 0 ? (
              <div className="py-4 px-3 text-center rounded-xl bg-white/[0.02] border border-dashed border-white/10">
                <p className="text-xs font-semibold text-slate-300">Wheel pool is empty</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Click <span className="text-cyan-400 font-medium">+ to Wheel</span> on any routine above, or type a custom task.
                </p>
                {dailyTasks.length > 0 && (
                  <button
                    type="button"
                    onClick={addAllDailyToWheel}
                    className="mt-2.5 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold transition cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    Load All Daily Routines to Wheel
                  </button>
                )}
              </div>
            ) : (
              <div className="max-h-[140px] overflow-y-auto space-y-1 pr-0.5">
                {tasks.map((task, index) => {
                  const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length]
                  return (
                    <div
                      key={`${task}-${index}`}
                      className="group flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition"
                    >
                      <div className="flex items-center gap-2 overflow-hidden flex-1">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color.bg }} />
                        <span className="text-xs text-slate-200 truncate">{task}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteWheelTask(index)}
                        disabled={isSpinning}
                        title="Remove from wheel"
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-slate-500 transition cursor-pointer ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── 3. Completed Tasks Streak ── */}
          {completedTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-3 border border-emerald-500/25 bg-emerald-950/10"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" /> Completed Today ({completedTasks.length})
                </span>
              </div>
              <div className="space-y-1 max-h-[85px] overflow-y-auto">
                {completedTasks.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-200">
                    <div className="flex items-center gap-1.5 truncate">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate line-through opacity-70">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-emerald-500/60 shrink-0 ml-2">{item.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </motion.div>

        {/* ════ RIGHT COLUMN: Wheel Graphic & Spin Controls ════ */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7 flex flex-col items-center gap-3.5 pt-3 sm:pt-6"
        >
          <div className="relative w-full max-w-[390px] aspect-square flex items-center justify-center">
            {/* Top Pointer Ticker */}
            <div
              ref={needleRef}
              className="absolute -top-4 z-30 pointer-events-none transition-transform duration-75 flex flex-col items-center scale-100 will-change-transform"
            >
              {/* Chrome Pivot Housing with LED indicator */}
              <div className="w-5 h-5 rounded-full bg-gradient-to-b from-slate-200 via-slate-400 to-slate-800 border border-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.8)] flex items-center justify-center -mb-1 z-10">
                <div
                  ref={needleLedRef}
                  className="w-2 h-2 rounded-full transition-colors duration-100 bg-cyan-400 shadow-[0_0_8px_#06b6d4]"
                />
              </div>
              {/* Sharp Glowing Needle */}
              <div className="w-0 h-0 border-x-[13px] border-x-transparent border-t-[24px] border-t-pink-500 filter drop-shadow-[0_4px_16px_rgba(236,72,153,0.95)]" />
            </div>

            {/* Ambient Background Glow & Outer Bezel Ring */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-600/25 to-pink-500/20 blur-2xl -z-20 pointer-events-none" />
            <div className="absolute inset-0 rounded-full border-2 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(0,0,0,0.8)] pointer-events-none -z-10" />

            {/* Wheel Canvas */}
            <canvas
              ref={canvasRef}
              className={`w-full h-full select-none touch-none rounded-full ${
                tasks.length < 2 || wheelState === 'stopping' ? 'cursor-default' : 'cursor-pointer'
              }`}
              onClick={() => {
                if (tasks.length >= 2 && wheelState !== 'stopping') {
                  handleSpinOrStop()
                }
              }}
              title={
                wheelState === 'spinning'
                  ? 'Click to STOP!'
                  : tasks.length >= 2
                  ? 'Click to SPIN!'
                  : 'Add 2+ tasks to spin'
              }
            />

            {/* Center Interactive SPIN / STOP Button */}
            <button
              onClick={handleSpinOrStop}
              disabled={wheelState === 'stopping' || tasks.length < 2}
              className={`absolute z-20 w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 flex flex-col items-center justify-center gap-0.5 transition ${
                tasks.length < 2
                  ? 'bg-slate-950/80 border-white/10 opacity-50 cursor-not-allowed'
                  : wheelState === 'spinning'
                  ? 'bg-gradient-to-br from-red-600 via-rose-700 to-amber-600 border-red-300 shadow-[0_0_36px_rgba(239,68,68,0.85)] hover:brightness-110 active:brightness-95 animate-pulse cursor-pointer'
                  : wheelState === 'stopping'
                  ? 'bg-gradient-to-br from-indigo-900 to-purple-950 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-wait opacity-80'
                  : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-cyan-400/80 shadow-[0_0_28px_rgba(6,182,212,0.55)] hover:border-cyan-300 hover:shadow-[0_0_36px_rgba(6,182,212,0.75)] active:brightness-95 cursor-pointer'
              }`}
            >
              {wheelState === 'spinning' ? (
                <>
                  <Square className="w-5 h-5 text-white fill-white animate-bounce" />
                  <span className="text-[11px] font-black text-white tracking-widest">
                    STOP
                  </span>
                </>
              ) : wheelState === 'stopping' ? (
                <>
                  <RotateCcw className="w-4 h-4 text-purple-300 animate-spin" />
                  <span className="text-[9px] font-extrabold text-purple-200 tracking-wider">
                    BRAKING
                  </span>
                </>
              ) : (
                <>
                  <Play className={`w-4 h-4 sm:w-5 sm:h-5 ${tasks.length >= 2 ? 'text-cyan-400 fill-cyan-400' : 'text-slate-500 fill-slate-500'}`} />
                  <span className={`text-[10px] tracking-widest font-black ${tasks.length >= 2 ? 'bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent' : 'text-slate-500'}`}>
                    {tasks.length < 2 ? 'NEED 2' : 'SPIN'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Primary Spin / Stop Button */}
          <button
            onClick={handleSpinOrStop}
            disabled={wheelState === 'stopping' || tasks.length < 2}
            className={`px-8 py-2.5 rounded-2xl text-white font-extrabold text-sm shadow-xl flex items-center gap-2 transition ${
              tasks.length < 2
                ? 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed opacity-60'
                : wheelState === 'spinning'
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-red-500/40 hover:brightness-110 active:brightness-95 cursor-pointer animate-pulse'
                : wheelState === 'stopping'
                ? 'bg-gradient-to-r from-indigo-700 to-purple-800 text-purple-200 shadow-purple-500/20 cursor-wait'
                : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:via-indigo-500 hover:to-pink-400 shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:brightness-110 active:brightness-95 cursor-pointer'
            }`}
          >
            {wheelState === 'spinning' ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                STOP THE WHEEL (Click to Decide!)
              </>
            ) : wheelState === 'stopping' ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin text-purple-300" />
                Slowing down... Landing on task!
              </>
            ) : tasks.length === 0 ? (
              <>
                <Flame className="w-4 h-4 text-slate-500" />
                Wheel is empty — Add tasks from left
              </>
            ) : tasks.length === 1 ? (
              <>
                <Flame className="w-4 h-4 text-slate-500" />
                Add 1 more task to spin
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
                Spin the Wheel!
              </>
            )}
          </button>

          {wheelState === 'spinning' ? (
            <p className="text-xs text-rose-400 font-semibold animate-pulse text-center">
              Wheel is spinning! Click STOP whenever you're ready to decide.
            </p>
          ) : wheelState === 'stopping' ? (
            <p className="text-xs text-purple-300 font-medium text-center">
              Decelerating smoothly... Let fate choose!
            </p>
          ) : tasks.length < 2 && tasks.length > 0 ? (
            <p className="text-xs text-slate-500 text-center">Add at least 2 tasks to spin the wheel.</p>
          ) : null}
        </motion.div>
      </div>

      {/* ════ MODAL 1: WINNER OVERLAY WITH "START TASK" ════ */}
      <AnimatePresence>
        {winner && !showRerollModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(14px)', background: 'rgba(7,9,19,0.82)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setWinner(null) }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="w-full max-w-md glass-card rounded-3xl border-2 overflow-hidden shadow-2xl"
              style={{ borderColor: winner.color.bg + '80' }}
            >
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${winner.color.bg}, ${winner.color.bg}55)` }} />
              <div className="p-6 sm:p-7 relative text-center">
                <button
                  onClick={() => setWinner(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Wheel has decided your task
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
                  {winner.task}
                </h2>
                <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto">
                  Decision made! Lock in now and defeat procrastination.
                </p>

                {/* Primary Action: Start Task */}
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => startFocusSession(winner.task)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:via-indigo-500 hover:to-pink-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:brightness-110 active:brightness-95 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" /> Start Task (Open Focus Workspace)
                  </button>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={() => handleCompleteCurrentTask()}
                      className="py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Already Done
                    </button>

                    {/* Spin Again with Accountability Trigger */}
                    <button
                      onClick={() => setShowRerollModal(true)}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Spin Again?
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ MODAL 2: ACCOUNTABILITY CHECKPOINT ("Why Spin Again?") ════ */}
      <AnimatePresence>
        {winner && showRerollModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(16px)', background: 'rgba(7,9,19,0.85)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowRerollModal(false) }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 20, opacity: 0 }}
              className="w-full max-w-md glass-card rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl p-6 relative text-center"
            >
              <button
                onClick={() => setShowRerollModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <RotateCcw className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-black text-white mb-1">
                Want to Re-Spin?
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                The wheel picked <span className="text-cyan-300 font-bold">"{winner.task}"</span>. What would you like to do?
              </p>

              <div className="space-y-2.5 text-left">
                {/* Option 1: Re-Spin (Keep task) */}
                <button
                  onClick={handleRerollKeepTask}
                  className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/40 transition cursor-pointer group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                        Re-Spin (Keep task on wheel)
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-medium shrink-0">
                        Auto Re-spin
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Keep "{winner.task}" on the wheel and spin again right now for another option.
                    </p>
                  </div>
                </button>

                {/* Option 2: Remove & Spin remaining */}
                <button
                  onClick={handleRerollRemoveTask}
                  className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/40 transition cursor-pointer group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition">
                        Skip & Remove from Wheel
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-medium shrink-0">
                        Remove & Spin
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Can't do this today. Removes it from the wheel and spins the remaining tasks.
                    </p>
                  </div>
                </button>

                {/* Option 3: Back to Wheel Studio Manual */}
                <button
                  onClick={handleBackToWheelManual}
                  className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 transition cursor-pointer group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                        Back to Wheel Studio
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-medium shrink-0">
                        Manual
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Return to the wheel page so you can edit, add, or adjust tasks before spinning.
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
