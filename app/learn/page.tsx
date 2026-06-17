"use client"
import { useState, useEffect, useCallback } from "react"
import { LESSONS, CATEGORIES } from "@/data/curriculum"
import {
  getCompleted, markComplete, getXP, getLevel, getLevelProgress,
  getNextLevel, getStreak, getEarnedBadges, getCategoryProgress, BADGES, XP_PER_LESSON
} from "@/lib/progress"
import LearnSidebar from "@/components/LearnSidebar"
import LessonView from "@/components/LessonView"

export default function LearnPage() {
  const [activeLessonId, setActiveLessonId] = useState(LESSONS[0].id)
  const [completed, setCompleted]           = useState<string[]>([])
  const [streak, setStreak]                 = useState(0)
  const [xpToast, setXpToast]               = useState<{ show: boolean; xp: number }>({ show: false, xp: 0 })
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [isMobile, setIsMobile]             = useState(false)
  const [search, setSearch]                 = useState("")
  const [justLeveledUp, setJustLeveledUp]   = useState(false)

  useEffect(() => {
    setCompleted(getCompleted())
    setStreak(getStreak())
    const check = () => {
      const m = window.innerWidth < 768
      setIsMobile(m)
      setSidebarOpen(!m)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const xp       = getXP(completed)
  const level    = getLevel(xp)
  const progress = getLevelProgress(xp)
  const nextLvl  = getNextLevel(xp)
  const badges   = getEarnedBadges(completed, LESSONS)

  const activeIndex  = LESSONS.findIndex((l) => l.id === activeLessonId)
  const activeLesson = LESSONS[activeIndex]
  const prevLesson   = activeIndex > 0 ? LESSONS[activeIndex - 1] : null
  const nextLesson   = activeIndex < LESSONS.length - 1 ? LESSONS[activeIndex + 1] : null
  const isCompleted  = completed.includes(activeLessonId)

  const handleSelectLesson = useCallback((id: string) => {
    setActiveLessonId(id)
    setSearch("")
    if (isMobile) setSidebarOpen(false)
  }, [isMobile])

  const handleComplete = useCallback(() => {
    const prevXP = getXP(completed)
    const prevLevel = getLevel(prevXP).name
    const { completed: updated, isNew } = markComplete(activeLessonId)
    if (!isNew) return
    setCompleted(updated)
    const newXP = getXP(updated)
    const newLevel = getLevel(newXP).name
    setXpToast({ show: true, xp: XP_PER_LESSON })
    setTimeout(() => setXpToast({ show: false, xp: 0 }), 2800)
    if (newLevel !== prevLevel) {
      setJustLeveledUp(true)
      setTimeout(() => setJustLeveledUp(false), 3500)
    }
  }, [activeLessonId, completed])

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── Sidebar ─── */}
      <aside className={`
        flex-col z-30 border-r transition-all duration-300
        ${isMobile
          ? `fixed inset-y-0 left-0 w-72 ${sidebarOpen ? "flex" : "hidden"}`
          : `${sidebarOpen ? "flex w-72" : "hidden"} shrink-0`
        }`}
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}>

        {/* Sidebar header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3.5 border-b"
          style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white neon-violet"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>AZ</div>
            <span className="font-bold text-sm">
              <span className="text-white">AIZen</span>
              <span className="gradient-text"> Tutor</span>
            </span>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="text-zinc-500 hover:text-white p-1 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* XP Panel */}
        <div className="shrink-0 px-4 py-3.5 border-b relative overflow-hidden"
          style={{ borderColor: "var(--border)", background: "rgba(139,92,246,0.04)" }}>
          {/* Subtle glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% -20%, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
          <div className="relative">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{level.emoji}</span>
                <div>
                  <p className="text-xs font-black text-white leading-none">{level.name}</p>
                  <p className="text-xs text-zinc-600 leading-none mt-0.5">Level {["Newcomer","Learner","Explorer","Developer","Engineer","Expert","Master"].indexOf(level.name) + 1}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  🔥 <span className="text-orange-400 font-black">{streak}</span>
                </span>
                <span className="font-black" style={{ color: "#a78bfa" }}>{xp.toLocaleString()} XP</span>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="h-full rounded-full xp-bar-fill transition-all duration-700"
                style={{ width: `${progress}%` }} />
            </div>
            {nextLvl && (
              <p className="text-xs mt-1.5" style={{ color: "#4a4a6a" }}>
                {nextLvl.min - xp} XP → {nextLvl.emoji} {nextLvl.name}
              </p>
            )}
            {/* Badges row */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2.5">
                {badges.map((id) => {
                  const badge = BADGES.find((b) => b.id === id)
                  return badge ? (
                    <span key={id} title={badge.label}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.28)", color: "#fbbf24" }}>
                      {badge.icon} {badge.label}
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="shrink-0 px-3 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lessons..."
              className="flex-1 bg-transparent text-xs text-white placeholder-zinc-700 focus:outline-none" />
          </div>
        </div>

        {/* Lesson list */}
        <div className="flex-1 overflow-y-auto">
          <LearnSidebar
            activeLessonId={activeLessonId}
            completed={completed}
            onSelect={handleSelectLesson}
            search={search}
          />
        </div>

        {/* Progress footer */}
        <div className="shrink-0 px-4 py-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-zinc-600">Overall Progress</span>
            <span className="font-bold gradient-text">{completed.length}/{LESSONS.length}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="h-full rounded-full xp-bar-fill transition-all duration-700"
              style={{ width: `${Math.round((completed.length / LESSONS.length) * 100)}%` }} />
          </div>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="shrink-0 flex items-center gap-3 px-4 py-3 border-b z-10"
          style={{ background: "rgba(8,8,15,0.95)", borderColor: "var(--border)", backdropFilter: "blur(12px)" }}>

          <button onClick={() => setSidebarOpen((v) => !v)}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex-1 min-w-0 flex items-center gap-1.5 text-xs">
            <span className="text-zinc-600 hidden sm:inline shrink-0">{activeLesson?.category}</span>
            <span className="text-zinc-700 hidden sm:inline">/</span>
            <span className="text-zinc-300 truncate font-medium">{activeLesson?.title}</span>
          </div>

          {/* Level pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs"
            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <span>{level.emoji}</span>
            <span className="text-white font-bold">{level.name}</span>
            <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="h-full xp-bar-fill rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-black" style={{ color: "#a78bfa" }}>{xp.toLocaleString()}</span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1 text-xs">
            <span>🔥</span>
            <span className="text-orange-400 font-black">{streak}</span>
          </div>

          {/* Progress */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-zinc-600 hidden sm:inline">{activeIndex + 1}/{LESSONS.length}</span>
            <div className="w-12 sm:w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full xp-bar-fill rounded-full transition-all duration-500"
                style={{ width: `${((activeIndex + 1) / LESSONS.length) * 100}%` }} />
            </div>
          </div>
        </header>

        {/* Lesson content */}
        <main className="flex-1 overflow-y-auto">
          {activeLesson && (
            <LessonView
              lesson={activeLesson}
              isCompleted={isCompleted}
              onComplete={handleComplete}
              onPrev={prevLesson ? () => setActiveLessonId(prevLesson.id) : undefined}
              onNext={nextLesson ? () => setActiveLessonId(nextLesson.id) : undefined}
            />
          )}
        </main>
      </div>

      {/* ─── XP Toast ─── */}
      {xpToast.show && (
        <div className="fixed bottom-6 right-6 z-50 xp-pop pointer-events-none">
          <div className="flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #22d3ee)",
              boxShadow: "0 0 40px rgba(139,92,246,0.7), 0 0 80px rgba(34,211,238,0.3)",
            }}>
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-white font-black text-sm leading-none">+{xpToast.xp} XP Earned!</p>
              <p className="text-white/60 text-xs mt-0.5">Keep going!</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Level-up banner ─── */}
      {justLeveledUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ background: "rgba(3,3,7,0.75)", backdropFilter: "blur(12px)" }}>
          {/* Glow blob */}
          <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.35), rgba(34,211,238,0.2), transparent 70%)" }} />
          <div className="relative text-center level-up-enter">
            <div className="text-8xl sm:text-9xl mb-4 float">{level.emoji}</div>
            <div className="text-4xl sm:text-5xl font-black gradient-text-animated mb-3">Level Up!</div>
            <div className="text-lg sm:text-xl font-bold text-white">
              You are now a <span style={{ color: "#a78bfa" }}>{level.name}</span>
            </div>
            <div className="mt-3 text-zinc-500 text-sm">Keep learning to unlock more rewards ⚡</div>
          </div>
        </div>
      )}
    </div>
  )
}
