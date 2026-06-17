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

export const XP_PER_LESSON = 100

const COMPLETED_KEY = "aizen_completed_v2"
const STREAK_KEY    = "aizen_streak_v2"
const LAST_DAY_KEY  = "aizen_last_day_v2"

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
  return { completed: updated, isNew: true }
}

export function getXP(completed: string[]): number {
  return completed.length * XP_PER_LESSON
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
      const categoryLessons = lessons.filter((l) => l.category === badge.category)
      return categoryLessons.length > 0 && categoryLessons.every((l) => completed.includes(l.id))
    })
    .map((b) => b.id)
}

export function getCategoryProgress(category: string, completed: string[], lessons: { id: string; category: string }[]) {
  const cat = lessons.filter((l) => l.category === category)
  const done = cat.filter((l) => completed.includes(l.id))
  return { total: cat.length, done: done.length, pct: cat.length ? Math.round((done.length / cat.length) * 100) : 0 }
}
