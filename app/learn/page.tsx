"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { gsap } from "gsap"
import Link from "next/link"
import { LESSONS, CATEGORIES } from "@/data/curriculum"
import {
  getCompleted, markComplete, getXP, getLevel, getLevelProgress,
  getNextLevel, getStreak, getEarnedBadges, getCategoryProgress,
  getBookmarks, toggleBookmark, getNote, BADGES, XP_PER_LESSON,
  type QuizResult,
} from "@/lib/progress"
import LearnSidebar from "@/components/LearnSidebar"
import LessonView from "@/components/LessonView"
import QuizModal from "@/components/QuizModal"
import NotesPanel from "@/components/NotesPanel"
import AiTutor from "@/components/AiTutor"

export default function LearnPage() {
  const [activeLessonId, setActiveLessonId] = useState(LESSONS[0].id)
  const [completed, setCompleted]           = useState<string[]>([])
  const [bookmarks, setBookmarks]           = useState<string[]>([])
  const [streak, setStreak]                 = useState(0)
  const [xpToast, setXpToast]               = useState<{ show: boolean; xp: number; label?: string }>({ show: false, xp: 0 })
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [isMobile, setIsMobile]             = useState(false)
  const [search, setSearch]                 = useState("")
  const [justLeveledUp, setJustLeveledUp]   = useState(false)
  const [showQuiz, setShowQuiz]             = useState(false)
  const [showNotes, setShowNotes]           = useState(false)
  const [showAiTutor, setShowAiTutor]       = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCompleted(getCompleted())
    setBookmarks(getBookmarks())
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

  // Close panels when switching lessons
  useEffect(() => {
    setShowNotes(false)
    setShowAiTutor(false)
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
  const isBookmarked = bookmarks.includes(activeLessonId)

  const handleSelectLesson = useCallback((id: string) => {
    setActiveLessonId(id)
    setSearch("")
    if (isMobile) setSidebarOpen(false)
  }, [isMobile])

  const handleComplete = useCallback(() => {
    const prevXP    = getXP(completed)
    const prevLevel = getLevel(prevXP).name
    const { completed: updated, isNew } = markComplete(activeLessonId)
    if (!isNew) return
    setCompleted(updated)
    const newXP    = getXP(updated)
    const newLevel = getLevel(newXP).name
    setXpToast({ show: true, xp: XP_PER_LESSON, label: "Lesson Complete!" })
    setTimeout(() => setXpToast({ show: false, xp: 0 }), 2400)
    if (newLevel !== prevLevel) {
      setJustLeveledUp(true)
      setTimeout(() => setJustLeveledUp(false), 3200)
    }
    // Open quiz after short delay
    setTimeout(() => setShowQuiz(true), 600)
  }, [activeLessonId, completed])

  const handleToggleBookmark = useCallback(() => {
    const nowBookmarked = toggleBookmark(activeLessonId)
    setBookmarks(getBookmarks())
  }, [activeLessonId])

  const handleQuizClose = useCallback((result: QuizResult | null) => {
    setShowQuiz(false)
    if (result && result.bonusXP > 0) {
      setTimeout(() => {
        setXpToast({ show: true, xp: result.bonusXP, label: `Quiz Bonus!` })
        setTimeout(() => setXpToast({ show: false, xp: 0 }), 2400)
      }, 300)
    }
  }, [])

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
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>AZ</div>
            <span className="font-semibold text-white text-sm">AIZen Tutor</span>
          </Link>
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
            bookmarks={bookmarks}
            onSelect={handleSelectLesson}
            search={search}
          />
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 py-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-zinc-600">Progress</span>
            <span className="text-violet-400 font-semibold">{completed.length}/{LESSONS.length}</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="h-full rounded-full bg-violet-600 transition-all duration-700"
              style={{ width: `${Math.round((completed.length / LESSONS.length) * 100)}%` }} />
          </div>
          <Link href="/"
            className="mt-3 flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <Link href="/dashboard"
            className="mt-2 flex items-center gap-1.5 text-xs text-zinc-600 hover:text-violet-400 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Dashboard
          </Link>
        </div>
      </aside>

      {/* ─── Main content area ─── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="shrink-0 flex items-center gap-3 px-4 py-3 border-b z-10"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}>

          <Link href="/"
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
            title="Home">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>

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

          {/* AI Tutor toggle */}
          <button onClick={() => { setShowAiTutor((v) => !v); setShowNotes(false) }}
            title="AI Tutor — ask questions about this lesson"
            className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${showAiTutor ? "text-emerald-400" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
            style={showAiTutor ? { background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)" } : {}}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>

          {/* Notes toggle */}
          <button onClick={() => { setShowNotes((v) => !v); setShowAiTutor(false) }}
            title="Toggle notes"
            className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${showNotes ? "text-violet-400" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
            style={showNotes ? { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)" } : {}}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Quiz button (if lesson completed) */}
          {isCompleted && (
            <button onClick={() => setShowQuiz(true)}
              title="Retake quiz"
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-violet-400 hover:bg-white/5 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </button>
          )}

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-zinc-600 hidden sm:inline">{activeIndex + 1}/{LESSONS.length}</span>
            <div className="w-12 sm:w-20 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full bg-violet-600 rounded-full transition-all duration-500"
                style={{ width: `${((activeIndex + 1) / LESSONS.length) * 100}%` }} />
            </div>
          </div>
        </header>

        {/* Content + Notes panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Lesson content */}
          <main className="flex-1 overflow-y-auto min-w-0">
            <div ref={contentRef}>
              {activeLesson && (
                <LessonView
                  lesson={activeLesson}
                  isCompleted={isCompleted}
                  isBookmarked={isBookmarked}
                  onComplete={handleComplete}
                  onToggleBookmark={handleToggleBookmark}
                  onPrev={prevLesson ? () => setActiveLessonId(prevLesson.id) : undefined}
                  onNext={nextLesson ? () => setActiveLessonId(nextLesson.id) : undefined}
                />
              )}
            </div>
          </main>

          {/* AI Tutor panel (desktop) */}
          {showAiTutor && activeLesson && (
            <aside className="shrink-0 w-72 sm:w-80 hidden sm:flex flex-col overflow-hidden">
              <AiTutor
                lessonTitle={activeLesson.title}
                lessonCategory={activeLesson.category}
                onClose={() => setShowAiTutor(false)}
              />
            </aside>
          )}

          {/* Notes panel (desktop) */}
          {showNotes && !showAiTutor && activeLesson && (
            <aside className="shrink-0 w-64 sm:w-72 hidden sm:flex flex-col overflow-hidden">
              <NotesPanel
                lessonId={activeLessonId}
                lessonTitle={activeLesson.title}
                onClose={() => setShowNotes(false)}
              />
            </aside>
          )}
        </div>
      </div>

      {/* ─── Quiz Modal ─── */}
      {showQuiz && activeLesson && (
        <QuizModal
          lessonId={activeLessonId}
          lessonTitle={activeLesson.title}
          onClose={handleQuizClose}
        />
      )}

      {/* ─── Mobile AI Tutor (bottom sheet) ─── */}
      {showAiTutor && isMobile && activeLesson && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAiTutor(false) }}>
          <div className="h-[70vh] rounded-t-2xl overflow-hidden flex flex-col"
            style={{ background: "var(--surface)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <AiTutor
              lessonTitle={activeLesson.title}
              lessonCategory={activeLesson.category}
              onClose={() => setShowAiTutor(false)}
            />
          </div>
        </div>
      )}

      {/* ─── Mobile Notes (bottom sheet) ─── */}
      {showNotes && isMobile && activeLesson && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowNotes(false) }}>
          <div className="h-96 rounded-t-2xl overflow-hidden flex flex-col"
            style={{ background: "var(--surface)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <NotesPanel
              lessonId={activeLessonId}
              lessonTitle={activeLesson.title}
              onClose={() => setShowNotes(false)}
            />
          </div>
        </div>
      )}

      {/* ─── XP Toast ─── */}
      {xpToast.show && (
        <div className="fixed bottom-6 right-6 z-50 xp-pop pointer-events-none">
          <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-2xl"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 8px 32px rgba(124,58,237,0.35)" }}>
            <span>⚡</span>
            <span className="text-white">+{xpToast.xp} XP{xpToast.label ? ` — ${xpToast.label}` : ""}</span>
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
