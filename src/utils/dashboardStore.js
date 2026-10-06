// Utility for persistent productivity stats, focus tracking, and streak calculation
const LS_STATS_KEY = 'spinly_dashboard_stats'
const LS_COMPLETED_KEY = 'spinly_completed_tasks'
const LS_SESSIONS_KEY = 'spinly_focus_sessions'
const LS_DAILY_KEY = 'spinly_daily_tasks'

export function getTodayDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getFormattedTimeString() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getDefaultStats() {
  return {
    totalTasksCompleted: 0,
    totalFocusMinutes: 0,
    totalFocusSeconds: 0,
    totalSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    dailyActivity: {}
  }
}

export function getDashboardStats() {
  if (typeof window === 'undefined') return getDefaultStats()
  try {
    const raw = localStorage.getItem(LS_STATS_KEY)
    if (!raw) {
      const initial = getDefaultStats()
      localStorage.setItem(LS_STATS_KEY, JSON.stringify(initial))
      return initial
    }
    const parsed = JSON.parse(raw)
    return { ...getDefaultStats(), ...parsed }
  } catch {
    return getDefaultStats()
  }
}

export function saveDashboardStats(stats) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LS_STATS_KEY, JSON.stringify(stats))
  } catch {
    // ignore
  }
}

export function getCompletedTasksList() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LS_COMPLETED_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getFocusSessionsList() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LS_SESSIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Calculate streak based on last active date
function updateStreak(stats, todayStr) {
  const lastActive = stats.lastActiveDate
  if (!lastActive) {
    stats.currentStreak = 1
    stats.longestStreak = Math.max(stats.longestStreak || 1, 1)
    stats.lastActiveDate = todayStr
    return stats
  }

  if (lastActive === todayStr) {
    // Already active today, streak stays intact
    return stats
  }

  // Check if lastActive was yesterday
  const today = new Date(todayStr)
  const last = new Date(lastActive)
  const diffTime = today.getTime() - last.getTime()
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24))

  if (diffDays === 1) {
    // Consecutive day!
    stats.currentStreak = (stats.currentStreak || 0) + 1
  } else if (diffDays > 1) {
    // Streak broken, reset to 1
    stats.currentStreak = 1
  }

  stats.longestStreak = Math.max(stats.longestStreak || 1, stats.currentStreak)
  stats.lastActiveDate = todayStr
  return stats
}

// Continuously record real elapsed focus seconds into dashboard stats
export function recordRealFocusTime(secondsElapsed, taskTitle = 'Focus Session') {
  if (typeof window === 'undefined' || !secondsElapsed || secondsElapsed <= 0) return

  const todayStr = getTodayDateString()
  const stats = getDashboardStats()

  // Track raw seconds and derive accurate minutes
  const prevTotalSeconds = (typeof stats.totalFocusSeconds === 'number')
    ? stats.totalFocusSeconds
    : (stats.totalFocusMinutes || 0) * 60

  const newTotalSeconds = prevTotalSeconds + secondsElapsed
  stats.totalFocusSeconds = newTotalSeconds
  stats.totalFocusMinutes = Math.floor(newTotalSeconds / 60)

  // Update daily activity map
  if (!stats.dailyActivity) stats.dailyActivity = {}
  if (!stats.dailyActivity[todayStr]) {
    stats.dailyActivity[todayStr] = { tasksCount: 0, focusMinutes: 0, focusSeconds: 0 }
  }
  const dayRec = stats.dailyActivity[todayStr]
  const prevDaySeconds = (typeof dayRec.focusSeconds === 'number')
    ? dayRec.focusSeconds
    : (dayRec.focusMinutes || 0) * 60

  const newDaySeconds = prevDaySeconds + secondsElapsed
  dayRec.focusSeconds = newDaySeconds
  dayRec.focusMinutes = Math.floor(newDaySeconds / 60)

  updateStreak(stats, todayStr)
  saveDashboardStats(stats)
  return stats
}

// Record a completed task (tracks task completion count; focus time is managed in real-time by timer)
export function recordTaskCompletion(taskTitle, focusMinutesSpent = 0) {
  if (typeof window === 'undefined' || !taskTitle) return

  const todayStr = getTodayDateString()
  const timeStr = getFormattedTimeString()
  const newTaskItem = {
    id: Date.now(),
    title: taskTitle,
    time: timeStr,
    date: todayStr,
    durationMinutes: Math.round(focusMinutesSpent)
  }

  // 1. Update completed tasks array
  const currentTasks = getCompletedTasksList()
  const updatedTasks = [newTaskItem, ...currentTasks]
  try {
    localStorage.setItem(LS_COMPLETED_KEY, JSON.stringify(updatedTasks))
  } catch {}

  // 2. Update dashboard stats
  const stats = getDashboardStats()
  stats.totalTasksCompleted = (stats.totalTasksCompleted || 0) + 1
  updateStreak(stats, todayStr)

  // Daily activity map
  if (!stats.dailyActivity) stats.dailyActivity = {}
  if (!stats.dailyActivity[todayStr]) {
    stats.dailyActivity[todayStr] = { tasksCount: 0, focusMinutes: 0, focusSeconds: 0 }
  }
  stats.dailyActivity[todayStr].tasksCount = (stats.dailyActivity[todayStr].tasksCount || 0) + 1

  saveDashboardStats(stats)
  return newTaskItem
}

// Record a focus session (pomodoro block or custom session)
export function recordFocusSession({ taskTitle, mode, durationMinutes, secondsSpent, completed = true }) {
  if (typeof window === 'undefined') return

  const todayStr = getTodayDateString()
  const timeStr = getFormattedTimeString()
  const seconds = secondsSpent || (durationMinutes ? durationMinutes * 60 : 60)
  const minutes = Math.max(1, Math.round(seconds / 60))

  const newSession = {
    id: Date.now(),
    taskTitle: taskTitle || 'Focus Session',
    mode: mode || 'focus25',
    durationMinutes: minutes,
    secondsSpent: seconds,
    completed,
    time: timeStr,
    date: todayStr
  }

  // 1. Save session
  const sessions = getFocusSessionsList()
  try {
    localStorage.setItem(LS_SESSIONS_KEY, JSON.stringify([newSession, ...sessions.slice(0, 49)]))
  } catch {}

  // 2. Update stats (focus time is tracked live; here we increment session count)
  const stats = getDashboardStats()
  stats.totalSessions = (stats.totalSessions || 0) + 1
  updateStreak(stats, todayStr)

  saveDashboardStats(stats)
}

// Get weekly data for bar chart (last 7 days ending today)
export function getWeeklyData() {
  const stats = getDashboardStats()
  const dailyActivity = stats.dailyActivity || {}
  const days = []
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    const dayName = dayNames[d.getDay()]
    const record = dailyActivity[dateStr] || { tasksCount: 0, focusMinutes: 0 }

    days.push({
      dateStr,
      dayName,
      isToday: i === 0,
      tasksCount: record.tasksCount || 0,
      focusMinutes: record.focusMinutes || 0
    })
  }

  return days
}

// Reset stats cleanly
export function resetDashboardStats() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(LS_STATS_KEY)
    localStorage.removeItem(LS_COMPLETED_KEY)
    localStorage.removeItem(LS_SESSIONS_KEY)
  } catch {}
}

// Explicit demo seeder for testing (only when user clicks 'Seed Sample Data')
export function seedDemoData(force = false) {
  if (typeof window === 'undefined') return
  const stats = getDashboardStats()
  if (!force && (stats.totalTasksCompleted > 0 || stats.totalFocusMinutes > 0)) return

  const todayStr = getTodayDateString()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

  const seededTasks = [
    { id: Date.now() - 1000 * 60 * 60 * 3, title: 'Post on LinkedIn', time: '11:15 AM', date: todayStr, durationMinutes: 25 },
    { id: Date.now() - 1000 * 60 * 60 * 6, title: 'Check & reply emails', time: '09:30 AM', date: todayStr, durationMinutes: 20 },
    { id: Date.now() - 1000 * 60 * 60 * 26, title: 'Review PRs', time: '04:45 PM', date: yStr, durationMinutes: 50 },
    { id: Date.now() - 1000 * 60 * 60 * 29, title: '30m Workout', time: '07:15 AM', date: yStr, durationMinutes: 30 }
  ]

  const seededDaily = {}
  seededDaily[todayStr] = { tasksCount: 2, focusMinutes: 45, focusSeconds: 45 * 60 }
  seededDaily[yStr] = { tasksCount: 2, focusMinutes: 80, focusSeconds: 80 * 60 }

  const seededSessions = [
    { id: Date.now() - 1000 * 60 * 60 * 3, taskTitle: 'Post on LinkedIn', mode: 'focus25', durationMinutes: 25, completed: true, time: '11:15 AM', date: todayStr },
    { id: Date.now() - 1000 * 60 * 60 * 6, taskTitle: 'Check & reply emails', mode: 'custom', durationMinutes: 20, completed: true, time: '09:30 AM', date: todayStr },
    { id: Date.now() - 1000 * 60 * 60 * 26, taskTitle: 'Review PRs', mode: 'deep50', durationMinutes: 50, completed: true, time: '04:45 PM', date: yStr },
    { id: Date.now() - 1000 * 60 * 60 * 29, taskTitle: '30m Workout', mode: 'custom', durationMinutes: 30, completed: true, time: '07:15 AM', date: yStr }
  ]

  const newStats = {
    totalTasksCompleted: 4,
    totalFocusMinutes: 125,
    totalFocusSeconds: 125 * 60,
    totalSessions: 4,
    currentStreak: 2,
    longestStreak: 2,
    lastActiveDate: todayStr,
    dailyActivity: seededDaily
  }

  saveDashboardStats(newStats)
  localStorage.setItem(LS_COMPLETED_KEY, JSON.stringify(seededTasks))
  localStorage.setItem(LS_SESSIONS_KEY, JSON.stringify(seededSessions))
}

// Deprecated alias kept for safety; no-op so empty dashboards stay cleanly at 0
export function seedDemoDataIfEmpty() {}
