"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { gsap } from "gsap"
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
  const contentRef = useRef<HTMLDivElement>(null)

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

  // Smooth lesson transition
  useEffect(() => {
    if (!contentRef.current) return
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    )
  }, [activeLessonId])

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
    setTimeout(() => setXpToast({ show: false, xp: 0 }), 2500)
    if (newLevel !== prevLevel) {
      setJustLeveledUp(true)
      setTimeout(() => setJustLeveledUp(false), 3200)
    }
  }, [activeLessonId, completed])

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 backdrop-blur-sm"
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

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3.5 border-b"
          style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>AZ</div>
            <span className="font-semibold text-white text-sm">AIZen Tutor</span>
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
        <div className="shrink-0 px-4 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{level.emoji}</span>
              <span className="text-xs font-semibold text-white">{level.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span>🔥 <span className="text-orange-400 font-semibold">{streak}</span></span>
              <span className="text-violet-300 font-semibold">{xp.toLocaleString()} XP</span>
            </div>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full xp-bar-fill transition-all duration-700"
              style={{ width: `${progress}%` }} />
          </div>
          {nextLvl && (
            <p className="text-xs text-zinc-600 mt-1.5">{nextLvl.min - xp} XP → {nextLvl.emoji} {nextLvl.name}</p>
          )}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {badges.map((id) => {
                const badge = BADGES.find((b) => b.id === id)
                return badge ? (
                  <span key={id} title={badge.label}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.22)", color: "#fbbf24" }}>
                    {badge.icon} {badge.label}
                  </span>
                ) : null
              })}
            </div>
          )}
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
            <span className="text-zinc-600">Progress</span>
            <span className="text-violet-400 font-semibold">{completed.length}/{LESSONS.length}</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="h-full rounded-full bg-violet-600 transition-all duration-700"
              style={{ width: `${Math.round((completed.length / LESSONS.length) * 100)}%` }} />
          </div>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="shrink-0 flex items-center gap-3 px-4 py-3 border-b z-10"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}>

          <button onClick={() => setSidebarOpen((v) => !v)}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>

          <div className="flex-1 min-w-0 flex items-center gap-1.5 text-xs">
            <span className="text-zinc-600 hidden sm:inline shrink-0">{activeLesson?.category}</span>
            <span className="text-zinc-700 hidden sm:inline">/</span>
            <span className="text-zinc-300 truncate font-medium">{activeLesson?.title}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 glass rounded-lg px-3 py-1.5 text-xs">
            <span>{level.emoji}</span>
            <span className="text-white font-medium">{level.name}</span>
            <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="h-full xp-bar-fill rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-violet-300 font-semibold">{xp.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span>🔥</span>
            <span className="text-orange-400 font-semibold">{streak}</span>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-zinc-600 hidden sm:inline">{activeIndex + 1}/{LESSONS.length}</span>
            <div className="w-12 sm:w-20 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full bg-violet-600 rounded-full transition-all duration-500"
                style={{ width: `${((activeIndex + 1) / LESSONS.length) * 100}%` }} />
            </div>
          </div>
        </header>

        {/* Lesson content */}
        <main className="flex-1 overflow-y-auto">
          <div ref={contentRef}>
            {activeLesson && (
              <LessonView
                lesson={activeLesson}
                isCompleted={isCompleted}
                onComplete={handleComplete}
                onPrev={prevLesson ? () => setActiveLessonId(prevLesson.id) : undefined}
                onNext={nextLesson ? () => setActiveLessonId(nextLesson.id) : undefined}
              />
            )}
          </div>
        </main>
      </div>

      {/* ─── XP Toast ─── */}
      {xpToast.show && (
        <div className="fixed bottom-6 right-6 z-50 xp-pop pointer-events-none">
          <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-2xl"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 8px 32px rgba(124,58,237,0.35)" }}>
            <span>⚡</span>
            <span className="text-white">+{xpToast.xp} XP Earned!</span>
          </div>
        </div>
      )}

      {/* ─── Level-up ─── */}
      {justLeveledUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ background: "rgba(0,0,0,0.55)" }}>
          <div className="text-center level-up-enter">
            <div className="text-7xl mb-3 float">{level.emoji}</div>
            <div className="text-3xl font-black gradient-text mb-2">Level Up!</div>
            <div className="text-white font-semibold">You are now a {level.name}</div>
          </div>
        </div>
      )}
    </div>
  )
}
