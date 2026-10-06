'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Flame, Clock, CheckCircle2, Zap, RotateCcw,
  Sparkles, Calendar, ArrowRight, Play, Check, Trash2,
  TrendingUp, Award, BarChart3, Filter, Search, RefreshCw,
  Sliders, Target, Hourglass, Shield, Star, ChevronRight,
  Waves, Compass, Landmark, Crown, Timer, Rocket, Gem, Sprout, Swords
} from 'lucide-react'
import {
  getDashboardStats,
  getCompletedTasksList,
  getFocusSessionsList,
  getWeeklyData,
  resetDashboardStats,
  seedDemoData,
  seedDemoDataIfEmpty,
  getTodayDateString
} from '@/utils/dashboardStore'

const LS_DAILY_KEY = 'spinly_daily_tasks'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [tasks, setTasks] = useState([])
  const [sessions, setSessions] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [dailyRoutines, setDailyRoutines] = useState([])
  const [activeFilter, setActiveFilter] = useState('all') // 'all', 'today'
  const [historyTab, setHistoryTab] = useState('tasks') // 'tasks', 'sessions'
  const [milestoneFilter, setMilestoneFilter] = useState('all') // 'all', 'hours', 'sessions', 'tasks', 'streaks'
  const [searchQuery, setSearchQuery] = useState('')
  const [isSeeding, setIsSeeding] = useState(false)

  const loadData = () => {
    // Only load genuine tracked stats (do NOT auto-seed fake demo hours)
    const currentStats = getDashboardStats()
    const completedTasks = getCompletedTasksList()
    const focusSessions = getFocusSessionsList()
    const week = getWeeklyData()

    setStats(currentStats)
    setTasks(completedTasks)
    setSessions(focusSessions)
    setWeeklyData(week)

    try {
      const savedDaily = localStorage.getItem(LS_DAILY_KEY)
      if (savedDaily) {
        setDailyRoutines(JSON.parse(savedDaily))
      }
    } catch {}
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset your statistics and task history?')) {
      resetDashboardStats()
      loadData()
    }
  }

  const handleSeedSample = () => {
    setIsSeeding(true)
    resetDashboardStats()
    seedDemoData(true)
    setTimeout(() => {
      loadData()
      setIsSeeding(false)
    }, 200)
  }

  const todayStr = getTodayDateString()
  const todayCompletedTasks = tasks.filter((t) => t.date === todayStr)
  const todayFocusMinutes = stats?.dailyActivity?.[todayStr]?.focusMinutes || 0

  // Format hours and minutes (with seconds fallback when < 1 min)
  const formatHoursMins = (totalMinutes, totalSeconds = 0) => {
    const mins = totalMinutes || 0
    if (mins === 0) {
      if (totalSeconds > 0) return `${totalSeconds}s`
      return '0h 0m'
    }
    const hrs = Math.floor(mins / 60)
    const remMins = mins % 60
    if (hrs === 0) return `${remMins}m`
    return remMins > 0 ? `${hrs}h ${remMins}m` : `${hrs}h`
  }

  // Calculate highest focus day in week for bar chart scale
  const maxWeeklyMinutes = Math.max(...(weeklyData.map(d => d.focusMinutes) || [60]), 60)

  // Milestones Data
  const totalTasks = stats?.totalTasksCompleted || tasks.length || 0
  const totalMins = stats?.totalFocusMinutes || 0
  const totalHours = (totalMins / 60).toFixed(1)
  const streak = stats?.currentStreak || 1
  const totalSessionsCount = stats?.totalSessions || sessions.length || 0
  const customSessionsCount = sessions.filter(s => s.mode === 'custom').length
  const deep50Count = sessions.filter(s => s.mode === 'deep50' || s.durationMinutes >= 50).length
  const todayTasksCount = todayCompletedTasks.length

  // Focus tier calculation
  const getFocusTier = (mins) => {
    const hrs = mins / 60
    if (hrs >= 25) return { name: 'Diamond Focus Legend', color: 'from-cyan-400 to-indigo-500', nextTarget: 50, nextHrs: 50 }
    if (hrs >= 10) return { name: 'Gold Deep Worker', color: 'from-amber-400 to-rose-500', nextTarget: 25 * 60, nextHrs: 25 }
    if (hrs >= 5) return { name: 'Silver Flow Practitioner', color: 'from-purple-400 to-indigo-500', nextTarget: 10 * 60, nextHrs: 10 }
    if (hrs >= 1) return { name: 'Bronze Focus Initiate', color: 'from-emerald-400 to-cyan-500', nextTarget: 5 * 60, nextHrs: 5 }
    return { name: 'Novice Explorer', color: 'from-slate-400 to-slate-200', nextTarget: 60, nextHrs: 1 }
  }
  const currentTier = getFocusTier(totalMins)

  // Daily target (default 120 mins = 2 hrs)
  const dailyTargetMinutes = 120
  const todayProgressPercent = Math.min(100, Math.round((todayFocusMinutes / dailyTargetMinutes) * 100))

  // Extended Badges with Pomodoro Hours Completed & Milestones
  const allBadges = [
    // ── 1. Pomodoro Hours Completed ──
    {
      id: 'focus-60',
      category: 'hours',
      name: '1-Hour Deep Diver',
      desc: 'Completed your first 1 full hour (60m) of focused work',
      current: totalMins,
      target: 60,
      unit: 'm',
      unlocked: totalMins >= 60,
      icon: Zap,
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-400/40 text-purple-300'
    },
    {
      id: 'focus-180',
      category: 'hours',
      name: '3-Hour Flow Builder',
      desc: 'Accumulated 3 hours (180m) of pure focus on tasks',
      current: totalMins,
      target: 180,
      unit: 'm',
      unlocked: totalMins >= 180,
      icon: Waves,
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-400/40 text-cyan-300'
    },
    {
      id: 'focus-300',
      category: 'hours',
      name: '5-Hour Focus Master',
      desc: 'Logged 5 cumulative hours (300m) of Pomodoro deep work',
      current: totalMins,
      target: 300,
      unit: 'm',
      unlocked: totalMins >= 300,
      icon: Compass,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-400/40 text-emerald-300'
    },
    {
      id: 'focus-600',
      category: 'hours',
      name: '10-Hour Deep Work Titan',
      desc: 'Crushed a massive 10 hours (600m) of distraction-free focus',
      current: totalMins,
      target: 600,
      unit: 'm',
      unlocked: totalMins >= 600,
      icon: Landmark,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-400/40 text-amber-300'
    },
    {
      id: 'focus-1500',
      category: 'hours',
      name: '25-Hour Productivity God',
      desc: 'An elite 25 hours (1,500m) of intense focus output logged',
      current: totalMins,
      target: 1500,
      unit: 'm',
      unlocked: totalMins >= 1500,
      icon: Crown,
      color: 'from-rose-500/20 to-pink-500/20 border-rose-400/40 text-rose-300'
    },

    // ── 2. Pomodoro Sessions ──
    {
      id: 'session-1',
      category: 'sessions',
      name: 'Pomodoro Pioneer',
      desc: 'Finished your first single Pomodoro concentration block',
      current: totalSessionsCount,
      target: 1,
      unit: ' sessions',
      unlocked: totalSessionsCount >= 1,
      icon: Timer,
      color: 'from-red-500/20 to-rose-500/20 border-red-400/40 text-red-300'
    },
    {
      id: 'session-5',
      category: 'sessions',
      name: '5-Block Sprinter',
      desc: 'Completed 5 full Pomodoro focus sessions',
      current: totalSessionsCount,
      target: 5,
      unit: ' sessions',
      unlocked: totalSessionsCount >= 5,
      icon: Rocket,
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-400/40 text-blue-300'
    },
    {
      id: 'session-20',
      category: 'sessions',
      name: '20-Block Powerhouse',
      desc: 'Crushed 20 focus sessions with zero multitasking',
      current: totalSessionsCount,
      target: 20,
      unit: ' sessions',
      unlocked: totalSessionsCount >= 20,
      icon: Gem,
      color: 'from-cyan-500/20 to-teal-500/20 border-cyan-400/40 text-cyan-300'
    },
    {
      id: 'session-deep50',
      category: 'sessions',
      name: '50m Deep Specialist',
      desc: 'Completed an intensive 50-minute deep concentration session',
      current: deep50Count,
      target: 1,
      unit: ' sessions',
      unlocked: deep50Count >= 1,
      icon: Shield,
      color: 'from-purple-500/20 to-fuchsia-500/20 border-purple-400/40 text-purple-300'
    },
    {
      id: 'session-custom',
      category: 'sessions',
      name: 'Custom Time Architect',
      desc: 'Used custom duration slider to complete personalized focus',
      current: customSessionsCount,
      target: 1,
      unit: ' sessions',
      unlocked: customSessionsCount >= 1,
      icon: Sliders,
      color: 'from-amber-400/20 to-pink-500/20 border-amber-400/40 text-amber-300'
    },

    // ── 3. Tasks Completed ──
    {
      id: 'task-1',
      category: 'tasks',
      name: 'First Blood',
      desc: 'Completed your first decided task from the wheel',
      current: totalTasks,
      target: 1,
      unit: ' tasks',
      unlocked: totalTasks >= 1,
      icon: Target,
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-400/40 text-cyan-300'
    },
    {
      id: 'task-5',
      category: 'tasks',
      name: 'Momentum Builder',
      desc: 'Finished 5 decisions picked by the wheel',
      current: totalTasks,
      target: 5,
      unit: ' tasks',
      unlocked: totalTasks >= 5,
      icon: Zap,
      color: 'from-teal-500/20 to-emerald-500/20 border-teal-400/40 text-teal-300'
    },
    {
      id: 'task-10',
      category: 'tasks',
      name: 'Task Crusher',
      desc: 'Reached 10 or more total completed tasks',
      current: totalTasks,
      target: 10,
      unit: ' tasks',
      unlocked: totalTasks >= 10,
      icon: Trophy,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-400/40 text-emerald-300'
    },
    {
      id: 'task-25',
      category: 'tasks',
      name: 'Quarter Centurion',
      desc: 'Overcame resistance to accomplish 25 tasks',
      current: totalTasks,
      target: 25,
      unit: ' tasks',
      unlocked: totalTasks >= 25,
      icon: Award,
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-400/40 text-amber-300'
    },
    {
      id: 'task-daily-clean',
      category: 'tasks',
      name: 'Daily Clean Sweep',
      desc: 'Crushed 4 or more tasks in a single productive day',
      current: todayTasksCount,
      target: 4,
      unit: ' today',
      unlocked: todayTasksCount >= 4,
      icon: Sparkles,
      color: 'from-pink-500/20 to-rose-500/20 border-pink-400/40 text-pink-300'
    },

    // ── 4. Streaks & Habits ──
    {
      id: 'streak-2',
      category: 'streaks',
      name: 'Momentum Spark',
      desc: 'Kept the momentum alive 2 days in a row',
      current: streak,
      target: 2,
      unit: ' days',
      unlocked: streak >= 2,
      icon: Sprout,
      color: 'from-emerald-500/20 to-green-500/20 border-emerald-400/40 text-emerald-300'
    },
    {
      id: 'streak-3',
      category: 'streaks',
      name: 'Consistent Fire',
      desc: 'Maintained an active 3+ day streak',
      current: streak,
      target: 3,
      unit: ' days',
      unlocked: streak >= 3,
      icon: Flame,
      color: 'from-amber-500/20 to-rose-500/20 border-amber-400/40 text-amber-300'
    },
    {
      id: 'streak-7',
      category: 'streaks',
      name: 'Unstoppable Week',
      desc: 'A full 7-day consistency streak completed',
      current: streak,
      target: 7,
      unit: ' days',
      unlocked: streak >= 7,
      icon: Shield,
      color: 'from-indigo-500/20 to-purple-500/20 border-indigo-400/40 text-indigo-300'
    },
    {
      id: 'streak-14',
      category: 'streaks',
      name: 'Iron Discipline',
      desc: '14 consecutive days of unstoppable focus',
      current: streak,
      target: 14,
      unit: ' days',
      unlocked: streak >= 14,
      icon: Swords,
      color: 'from-yellow-500/20 to-amber-500/20 border-yellow-400/40 text-yellow-300'
    }
  ]

  // Filter badges by category
  const filteredBadges = allBadges.filter((b) => {
    if (milestoneFilter === 'all') return true
    return b.category === milestoneFilter
  })

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = activeFilter === 'today' ? task.date === todayStr : true
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    const matchesFilter = activeFilter === 'today' ? s.date === todayStr : true
    const matchesSearch = (s.taskTitle || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-20 relative overflow-hidden px-4 sm:px-6">
      {/* Background ambient light */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-cyan-600/10 via-purple-600/15 to-pink-500/10 blur-[130px] pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto space-y-8">
        
        {/* ════ HEADER HERO ════ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Personal Productivity Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Activity & Streak Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Track your Pomodoro hours, completed decisions, focus consistency, and milestone achievements.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleSeedSample}
              disabled={isSeeding}
              title="Populate demo statistics"
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>Reset & Demo</span>
            </button>

            <Link
              href="/spin"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition cursor-pointer hover:brightness-110 active:brightness-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Spin The Wheel</span>
            </Link>
          </div>
        </div>

        {/* ════ KEY METRICS GRID ════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Tasks Completed */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl p-5 border border-emerald-500/25 relative overflow-hidden shadow-xl group hover:border-emerald-500/40 transition"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tasks Completed</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {totalTasks}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-semibold">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[11px]">
                +{todayCompletedTasks.length} today
              </span>
              <span className="text-slate-400 text-[11px]">decisions crushed</span>
            </div>
          </motion.div>

          {/* 2. Pomodoro Focus Hours Logged */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="glass-card rounded-2xl p-5 border border-cyan-500/25 relative overflow-hidden shadow-xl group hover:border-cyan-500/40 transition"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pomodoro Hours</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {formatHoursMins(totalMins, stats?.totalFocusSeconds || 0)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-cyan-300 font-semibold">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[11px]">
                {formatHoursMins(todayFocusMinutes, stats?.dailyActivity?.[todayStr]?.focusSeconds || 0)} today
              </span>
              <span className="text-slate-400 text-[11px]">
                ({totalMins > 0 ? `${totalMins} total mins` : (stats?.totalFocusSeconds ? `${stats.totalFocusSeconds}s total` : '0 total mins')})
              </span>
            </div>
          </motion.div>

          {/* 3. Streak Days */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="glass-card rounded-2xl p-5 border border-amber-500/25 relative overflow-hidden shadow-xl group hover:border-amber-500/40 transition"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Day Streak</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Flame className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight flex items-center gap-1">
              <span>{streak}</span>
              <span className="text-lg font-bold text-slate-400">Days</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-300 font-semibold">
              <span className="text-slate-400 text-[11px]">Best:</span>
              <span className="text-white text-[11px] font-bold">{stats?.longestStreak || streak} days</span>
              <span className="text-emerald-400 text-[11px]">· Active today</span>
            </div>
          </motion.div>

          {/* 4. Focus Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="glass-card rounded-2xl p-5 border border-purple-500/25 relative overflow-hidden shadow-xl group hover:border-purple-500/40 transition"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Focus Blocks</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {totalSessionsCount}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-300 font-semibold">
              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-[11px]">
                {customSessionsCount > 0 ? `${customSessionsCount} Custom` : 'Pomodoros'}
              </span>
              <span className="text-slate-400 text-[11px]">zero multitasking</span>
            </div>
          </motion.div>

        </div>

        {/* ════ DEDICATED POMODORO HOURS JOURNEY & DAILY TARGET ════ */}
        <div className="glass-card rounded-2xl p-5 border border-cyan-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-l from-cyan-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Left: Focus Tier status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Productivity Focus Rank</div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span className={`bg-gradient-to-r ${currentTier.color} bg-clip-text text-transparent`}>
                      {currentTier.name}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-cyan-300">
                      {totalHours} hrs completed
                    </span>
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Target: Reach <strong className="text-white">{currentTier.nextHrs} hours</strong> to ascend to the next focus mastery rank.
              </p>
            </div>

            {/* Right: Daily Target Progress Meter */}
            <div className="flex-1 max-w-md bg-white/[0.03] p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  Today's Daily Target: 2.0 Hours (120m)
                </span>
                <span className="font-mono font-bold text-cyan-300">
                  {todayFocusMinutes}m / 120m ({todayProgressPercent}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${todayProgressPercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 rounded-full"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>{todayProgressPercent >= 100 ? 'Daily goal crushed!' : `${Math.max(0, dailyTargetMinutes - todayFocusMinutes)}m remaining today`}</span>
                <Link href="/spin" className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5">
                  Start Session <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ════ MIDDLE ROW: WEEKLY CHART + ROUTINES MOMENTUM ════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Weekly Activity Bar Chart (7 cols) */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-5 border border-white/10 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">7-Day Focus Momentum</h3>
                    <p className="text-[11px] text-slate-500">Minutes focused each day this week</p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  {formatHoursMins(weeklyData.reduce((acc, d) => acc + d.focusMinutes, 0))} total
                </span>
              </div>

              {/* Bar visualization */}
              <div className="pt-6 pb-2">
                <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-40 px-2 border-b border-white/10">
                  {weeklyData.map((day) => {
                    const heightPercent = Math.max(8, Math.round((day.focusMinutes / maxWeeklyMinutes) * 100))
                    return (
                      <div key={day.dateStr} className="flex flex-col items-center gap-2 h-full justify-end group relative">
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 px-2 py-0.5 rounded bg-slate-900 border border-white/20 text-[10px] text-cyan-300 font-mono font-bold transition pointer-events-none whitespace-nowrap z-20">
                          {day.focusMinutes}m · {day.tasksCount} tasks
                        </div>

                        {/* Bar */}
                        <div className="w-full max-w-[36px] bg-white/[0.04] rounded-t-lg overflow-hidden flex items-end p-0.5 h-full">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className={`w-full rounded-t-md transition-all ${
                              day.isToday
                                ? 'bg-gradient-to-t from-cyan-500 via-indigo-500 to-pink-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                : day.focusMinutes > 0
                                ? 'bg-gradient-to-t from-cyan-600/60 to-indigo-500/70 group-hover:from-cyan-500 group-hover:to-indigo-400'
                                : 'bg-white/5'
                            }`}
                          />
                        </div>

                        {/* Day label */}
                        <span className={`text-[11px] font-bold ${day.isToday ? 'text-cyan-400 font-black' : 'text-slate-400'}`}>
                          {day.dayName}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-white/[0.04] mt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Active Today
              </span>
              <span>Consistency unlocks high productivity</span>
            </div>
          </div>

          {/* Routine Bank Quick Status & Progress (5 cols) */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-5 border border-white/10 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Daily Routine Bank</h3>
                    <p className="text-[11px] text-slate-500">{dailyRoutines.length} saved permanent habits</p>
                  </div>
                </div>

                <Link
                  href="/spin"
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                >
                  Manage <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Routine Habit Items */}
              <div className="space-y-1.5 max-h-[175px] overflow-y-auto pr-1">
                {dailyRoutines.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No habits saved yet! Go to the Wheel to add daily routines.
                  </div>
                ) : (
                  dailyRoutines.map((routine, idx) => {
                    const isDoneToday = todayCompletedTasks.some((t) => t.title.toLowerCase() === routine.toLowerCase())
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl border transition ${
                          isDoneToday
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                            : 'bg-white/[0.02] border-white/5 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isDoneToday ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                          )}
                          <span className={`text-xs truncate ${isDoneToday ? 'line-through opacity-80' : 'font-medium'}`}>
                            {routine}
                          </span>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isDoneToday ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-500'
                        }`}>
                          {isDoneToday ? 'Done Today' : 'Pending'}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {todayCompletedTasks.length} habits done today
              </span>
              <Link
                href="/spin"
                className="px-3 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition flex items-center gap-1"
              >
                Spin Habit <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>

        {/* ════ EXPANDED MILESTONES & PRODUCTIVITY BADGES ════ */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Productivity Badges & Milestones</span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {allBadges.filter(b => b.unlocked).length} / {allBadges.length} Unlocked
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Unlock trophies by completing Pomodoro hours, focus blocks, tasks, and streaks</p>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/5 text-xs font-semibold">
              <button
                onClick={() => setMilestoneFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${milestoneFilter === 'all' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
              >
                All ({allBadges.length})
              </button>
              <button
                onClick={() => setMilestoneFilter('hours')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${milestoneFilter === 'hours' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <Clock className="w-3.5 h-3.5" /> Focus Hours
              </button>
              <button
                onClick={() => setMilestoneFilter('sessions')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${milestoneFilter === 'sessions' ? 'bg-purple-500 text-white font-bold shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <Timer className="w-3.5 h-3.5" /> Sessions
              </button>
              <button
                onClick={() => setMilestoneFilter('tasks')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${milestoneFilter === 'tasks' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Tasks
              </button>
              <button
                onClick={() => setMilestoneFilter('streaks')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${milestoneFilter === 'streaks' ? 'bg-rose-500 text-white font-bold shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <Flame className="w-3.5 h-3.5" /> Streaks
              </button>
            </div>
          </div>

          {/* Badges Grid with Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredBadges.map((b) => {
              const currentVal = Math.min(b.target, b.current)
              const percent = Math.min(100, Math.round((b.current / b.target) * 100))
              const IconComp = b.icon
              return (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition relative overflow-hidden ${
                    b.unlocked
                      ? `bg-gradient-to-br ${b.color} shadow-lg shadow-black/40`
                      : 'bg-white/[0.02] border-white/5 opacity-50 hover:opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                          <IconComp className="w-3.5 h-3.5 text-cyan-300" />
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{b.name}</h4>
                      </div>
                      
                      {b.unlocked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shrink-0">
                          <Check className="w-2.5 h-2.5" /> Done
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {percent}%
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{b.desc}</p>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="mt-1 pt-2 border-t border-white/[0.04]">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                      <span>{b.current}{b.unit} / {b.target}{b.unit}</span>
                      <span>{b.unlocked ? 'Unlocked' : `${Math.max(0, b.target - b.current)}${b.unit} left`}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          b.unlocked ? 'bg-emerald-400' : 'bg-cyan-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ════ DUAL TAB HISTORY LOG: TASKS & POMODORO SESSIONS ════ */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.06]">
            
            {/* Tab switch: Tasks vs Focus Sessions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHistoryTab('tasks')}
                className={`text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  historyTab === 'tasks'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white bg-white/5'
                }`}
              >
                <span>Completed Tasks</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${historyTab === 'tasks' ? 'bg-slate-950 text-cyan-300' : 'bg-white/10 text-slate-400'}`}>
                  {filteredTasks.length}
                </span>
              </button>

              <button
                onClick={() => setHistoryTab('sessions')}
                className={`text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  historyTab === 'sessions'
                    ? 'bg-purple-600 text-white shadow-md font-black'
                    : 'text-slate-400 hover:text-white bg-white/5'
                }`}
              >
                <span>Pomodoro Focus Blocks</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${historyTab === 'sessions' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'}`}>
                  {filteredSessions.length}
                </span>
              </button>
            </div>

            {/* Filter controls + search */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search logs..."
                  className="pl-8 pr-3 py-1.5 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none w-36 sm:w-44"
                />
              </div>

              <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/5 text-xs font-semibold">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter('today')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeFilter === 'today' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Today
                </button>
              </div>
            </div>
          </div>

          {/* TAB 1: TASKS LIST */}
          {historyTab === 'tasks' && (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-10 rounded-xl bg-white/[0.02] border border-dashed border-white/5">
                  <p className="text-xs font-semibold text-slate-300">No completed tasks found</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Spin the wheel and mark tasks complete to populate your activity log!
                  </p>
                  <Link
                    href="/spin"
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 hover:bg-cyan-500/30 transition"
                  >
                    <Play className="w-3 h-3 fill-current" /> Go to Wheel
                  </Link>
                </div>
              ) : (
                filteredTasks.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                        <p className="text-[10px] text-slate-500">{item.date || todayStr} at {item.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.durationMinutes > 0 ? (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.durationMinutes}m focus
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 rounded-md bg-white/5">
                          Quick Done
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: POMODORO SESSIONS LIST */}
          {historyTab === 'sessions' && (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-10 rounded-xl bg-white/[0.02] border border-dashed border-white/5">
                  <p className="text-xs font-semibold text-slate-300">No Pomodoro focus sessions recorded yet</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Start a focus session from the wheel to log your concentration blocks here!
                  </p>
                  <Link
                    href="/spin"
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 hover:bg-purple-500/30 transition"
                  >
                    <Play className="w-3 h-3 fill-current" /> Start Focus Session
                  </Link>
                </div>
              ) : (
                filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">{session.taskTitle || 'Focus Session'}</h4>
                        <p className="text-[10px] text-slate-500">
                          {session.date || todayStr} at {session.time} · Mode: <span className="text-purple-300 font-medium capitalize">{session.mode || 'pomodoro'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/25 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {session.durationMinutes}m logged
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
