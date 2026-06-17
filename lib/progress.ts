export const LEVELS = [
  { name: "Newcomer",  min: 0,     max: 100,    emoji: "🌱", color: "#71717a" },
  { name: "Learner",   min: 100,   max: 500,    emoji: "📚", color: "#3b82f6" },
  { name: "Explorer",  min: 500,   max: 1500,   emoji: "🔭", color: "#8b5cf6" },
  { name: "Developer", min: 1500,  max: 3500,   emoji: "💻", color: "#a855f7" },
  { name: "Engineer",  min: 3500,  max: 7000,   emoji: "⚙️",  color: "#d946ef" },
  { name: "Expert",    min: 7000,  max: 13000,  emoji: "🎯", color: "#f59e0b" },
  { name: "Master",    min: 13000, max: Infinity, emoji: "🏆", color: "#fbbf24" },
]

export const BADGES = [
  { id: "ml",        category: "Machine Learning",   icon: "🤖", label: "ML Scholar"      },
  { id: "dl",        category: "Deep Learning",       icon: "🧠", label: "Deep Thinker"    },
  { id: "nlp",       category: "NLP & Transformers",  icon: "💬", label: "Language Master" },
  { id: "llm",       category: "LLMs & Prompting",    icon: "✨", label: "Prompt Engineer" },
  { id: "rag",       category: "RAG Systems",         icon: "🔍", label: "RAG Architect"   },
  { id: "cv",        category: "Computer Vision",     icon: "👁️", label: "Vision Expert"   },
  { id: "mlops",     category: "MLOps",               icon: "🚀", label: "MLOps Pro"       },
  { id: "interview", category: "Interview Prep",      icon: "🎤", label: "Job Ready"       },
]

export const XP_PER_LESSON   = 100
export const XP_PER_CORRECT  = 25   // bonus XP per correct quiz answer

// ─── Keys ───────────────────────────────────────────────────────────────────
const COMPLETED_KEY  = "aizen_completed_v2"
const STREAK_KEY     = "aizen_streak_v2"
const LAST_DAY_KEY   = "aizen_last_day_v2"
const QUIZ_XP_KEY    = "aizen_quiz_xp"
const BOOKMARKS_KEY  = "aizen_bookmarks"
const ACTIVITY_KEY   = "aizen_activity"

// ─── Core progress ──────────────────────────────────────────────────────────
export function getCompleted(): string[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? "[]") }
  catch { return [] }
}

export function markComplete(lessonId: string): { completed: string[]; isNew: boolean } {
  const completed = getCompleted()
  if (completed.includes(lessonId)) return { completed, isNew: false }
  const updated = [...completed, lessonId]
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(updated))
  updateStreak()
  logActivity()
  return { completed: updated, isNew: true }
}

export function getXP(completed: string[]): number {
  return completed.length * XP_PER_LESSON + getQuizXP()
}

export function getLevel(xp: number) {
  return [...LEVELS].reverse().find((l) => xp >= l.min) ?? LEVELS[0]
}

export function getLevelProgress(xp: number): number {
  const lvl = getLevel(xp)
  if (lvl.max === Infinity) return 100
  return Math.round(((xp - lvl.min) / (lvl.max - lvl.min)) * 100)
}

export function getNextLevel(xp: number) {
  const idx = LEVELS.findIndex((l) => l.name === getLevel(xp).name)
  return LEVELS[idx + 1] ?? null
}

export function getStreak(): number {
  if (typeof window === "undefined") return 0
  return parseInt(localStorage.getItem(STREAK_KEY) ?? "0")
}

function updateStreak() {
  const today = new Date().toDateString()
  const lastDay = localStorage.getItem(LAST_DAY_KEY)
  if (lastDay === today) return
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
  const streak = getStreak()
  localStorage.setItem(STREAK_KEY,   lastDay === yesterday.toDateString() ? String(streak + 1) : "1")
  localStorage.setItem(LAST_DAY_KEY, today)
}

export function getEarnedBadges(completed: string[], lessons: { id: string; category: string }[]): string[] {
  return BADGES
    .filter((badge) => {
      const cat = lessons.filter((l) => l.category === badge.category)
      return cat.length > 0 && cat.every((l) => completed.includes(l.id))
    })
    .map((b) => b.id)
}

export function getCategoryProgress(category: string, completed: string[], lessons: { id: string; category: string }[]) {
  const cat = lessons.filter((l) => l.category === category)
  const done = cat.filter((l) => completed.includes(l.id))
  return { total: cat.length, done: done.length, pct: cat.length ? Math.round((done.length / cat.length) * 100) : 0 }
}

// ─── Quiz XP ────────────────────────────────────────────────────────────────
export function getQuizXP(): number {
  if (typeof window === "undefined") return 0
  return parseInt(localStorage.getItem(QUIZ_XP_KEY) ?? "0")
}

export function addQuizXP(xp: number): void {
  localStorage.setItem(QUIZ_XP_KEY, String(getQuizXP() + xp))
}

// ─── Quiz results ────────────────────────────────────────────────────────────
export interface QuizResult {
  score: number
  total: number
  bonusXP: number
  completedAt: string
}

export function getQuizResult(lessonId: string): QuizResult | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(`aizen_quiz_${lessonId}`)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveQuizResult(lessonId: string, result: QuizResult): void {
  localStorage.setItem(`aizen_quiz_${lessonId}`, JSON.stringify(result))
  addQuizXP(result.bonusXP)
}

export function getAllQuizResults(): Record<string, QuizResult> {
  if (typeof window === "undefined") return {}
  const results: Record<string, QuizResult> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) ?? ""
    if (key.startsWith("aizen_quiz_")) {
      const lessonId = key.replace("aizen_quiz_", "")
      try {
        const val = localStorage.getItem(key)
        if (val) results[lessonId] = JSON.parse(val)
      } catch { /* skip */ }
    }
  }
  return results
}

// ─── Bookmarks ───────────────────────────────────────────────────────────────
export function getBookmarks(): string[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? "[]") }
  catch { return [] }
}

export function toggleBookmark(lessonId: string): boolean {
  const bookmarks = getBookmarks()
  const idx = bookmarks.indexOf(lessonId)
  if (idx === -1) {
    bookmarks.push(lessonId)
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
    return true   // now bookmarked
  } else {
    bookmarks.splice(idx, 1)
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
    return false  // removed
  }
}

// ─── Notes ───────────────────────────────────────────────────────────────────
export function getNote(lessonId: string): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem(`aizen_note_${lessonId}`) ?? ""
}

export function saveNote(lessonId: string, text: string): void {
  if (!text.trim()) {
    localStorage.removeItem(`aizen_note_${lessonId}`)
  } else {
    localStorage.setItem(`aizen_note_${lessonId}`, text)
  }
}

export function getAllNotes(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const notes: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) ?? ""
    if (key.startsWith("aizen_note_")) {
      const lessonId = key.replace("aizen_note_", "")
      notes[lessonId] = localStorage.getItem(key) ?? ""
    }
  }
  return notes
}

// ─── Activity / Heatmap ───────────────────────────────────────────────────────
export function logActivity(): void {
  if (typeof window === "undefined") return
  const today = new Date().toISOString().split("T")[0]
  const activity: Record<string, number> = getActivity()
  activity[today] = (activity[today] ?? 0) + 1
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity))
}

export function getActivity(): Record<string, number> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY) ?? "{}") }
  catch { return {} }
}
