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
  { id: "py",        category: "Python",   icon: "🤖", label: "Python Scholar"      },
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

// ─── MongoDB sync ────────────────────────────────────────────────────────────

const USER_ID_KEY = "aizen_user_id"

export function getUserId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem(USER_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(USER_ID_KEY, id)
  }
  return id
}

// Get Firebase ID token if user is signed in (dynamic import avoids SSR issues)
async function getFirebaseToken(): Promise<string | null> {
  if (typeof window === "undefined") return null
  try {
    const { auth } = await import("./firebase")
    return auth?.currentUser ? auth.currentUser.getIdToken() : null
  } catch {
    return null
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  const token = await getFirebaseToken()
  if (token) headers["Authorization"] = `Bearer ${token}`
  return headers
}

export function getAllProgress() {
  return {
    completed:   getCompleted(),
    streak:      getStreak(),
    lastDay:     localStorage.getItem(LAST_DAY_KEY) ?? "",
    quizXP:      getQuizXP(),
    quizResults: getAllQuizResults(),
    bookmarks:   getBookmarks(),
    notes:       getAllNotes(),
    activity:    getActivity(),
  }
}

export async function syncToMongoDB(): Promise<void> {
  if (typeof window === "undefined") return
  try {
    const headers = await authHeaders()
    // For anonymous users include the local UUID in the body
    const token = headers["Authorization"]
    const body = token
      ? { data: getAllProgress() }
      : { userId: getUserId(), data: getAllProgress() }
    await fetch("/api/progress", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
  } catch {
    // silently fail — localStorage is still the source of truth
  }
}

export async function loadFromMongoDB(): Promise<void> {
  if (typeof window === "undefined") return
  try {
    const headers = await authHeaders()
    const token = headers["Authorization"]
    const url = token
      ? "/api/progress"
      : `/api/progress?userId=${getUserId()}`
    const res = await fetch(url, { headers })
    if (!res.ok) return
    const doc = await res.json()
    if (!doc) return

    // Merge: take the union for arrays, merge objects, keep the higher numeric value
    const localCompleted = getCompleted()
    const merged = [...new Set([...localCompleted, ...(doc.completed ?? [])])]
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(merged))

    const localStreak = getStreak()
    if ((doc.streak ?? 0) > localStreak) {
      localStorage.setItem(STREAK_KEY, String(doc.streak))
      localStorage.setItem(LAST_DAY_KEY, doc.lastDay ?? "")
    }

    const localQuizXP = getQuizXP()
    if ((doc.quizXP ?? 0) > localQuizXP) {
      localStorage.setItem(QUIZ_XP_KEY, String(doc.quizXP))
    }

    // Merge quiz results — keep results that don't exist locally
    if (doc.quizResults) {
      for (const [lessonId, result] of Object.entries(doc.quizResults)) {
        if (!getQuizResult(lessonId)) {
          localStorage.setItem(`aizen_quiz_${lessonId}`, JSON.stringify(result))
        }
      }
    }

    // Merge bookmarks
    if (doc.bookmarks?.length) {
      const localBookmarks = getBookmarks()
      const mergedBookmarks = [...new Set([...localBookmarks, ...doc.bookmarks])]
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(mergedBookmarks))
    }

    // Merge notes — don't overwrite local edits
    if (doc.notes) {
      for (const [lessonId, note] of Object.entries(doc.notes)) {
        if (!getNote(lessonId) && note) {
          localStorage.setItem(`aizen_note_${lessonId}`, note as string)
        }
      }
    }

    // Merge activity — sum up counts per day
    if (doc.activity) {
      const localActivity = getActivity()
      for (const [date, count] of Object.entries(doc.activity)) {
        localActivity[date] = Math.max(localActivity[date] ?? 0, count as number)
      }
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(localActivity))
    }
  } catch {
    // silently fail — localStorage is still the source of truth
  }
}
