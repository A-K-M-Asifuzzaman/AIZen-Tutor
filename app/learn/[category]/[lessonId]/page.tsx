"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Nav from "@/components/Nav"
import { LESSONS } from "@/data/curriculum"
import {
  getCompleted, markComplete, getXP, getLevel, getLevelProgress,
  getNextLevel, getStreak, getBookmarks, toggleBookmark,
  XP_PER_LESSON, type QuizResult,
} from "@/lib/progress"
import QuizModal from "@/components/QuizModal"
import AiTutor from "@/components/AiTutor"
import NotesPanel from "@/components/NotesPanel"
import { categoryToSlug } from "../../page"

// ─── Token-based syntax highlighter ─────────────────────────────────────────
type TokenType = "keyword" | "string" | "comment" | "number" | "decorator" | "builtin" | "plain"
interface Token { text: string; type: TokenType }

const KEYWORDS = new Set([
  "import","from","as","def","class","return","if","else","elif","for","while",
  "in","not","and","or","is","True","False","None","with","try","except","raise",
  "lambda","yield","async","await","pass","break","continue","super","self",
  "print","type","assert",
])
const BUILTINS = new Set([
  "str","int","float","list","dict","set","tuple","len","range","enumerate",
  "zip","map","filter","sorted","reversed","min","max","sum","abs","round",
  "isinstance","type","hasattr","getattr","setattr",
])
const TOKEN_COLORS: Record<TokenType, string> = {
  keyword:   "#c084fc",
  string:    "#86efac",
  comment:   "#4a4a6a",
  number:    "#fbbf24",
  decorator: "#38bdf8",
  builtin:   "#67e8f9",
  plain:     "#e2e8f0",
}

function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < code.length) {
    if (code[i] === "#") {
      const end = code.indexOf("\n", i)
      const text = end === -1 ? code.slice(i) : code.slice(i, end)
      tokens.push({ text, type: "comment" })
      i += text.length
    } else if (code.slice(i, i + 3) === '"""' || code.slice(i, i + 3) === "'''") {
      const q = code.slice(i, i + 3)
      const end = code.indexOf(q, i + 3)
      const text = end === -1 ? code.slice(i) : code.slice(i, end + 3)
      tokens.push({ text, type: "string" })
      i += text.length
    } else if (code[i] === '"' || code[i] === "'") {
      const q = code[i]
      let j = i + 1
      while (j < code.length && code[j] !== q && code[j] !== "\n") {
        if (code[j] === "\\") j++
        j++
      }
      tokens.push({ text: code.slice(i, j + 1), type: "string" })
      i = j + 1
    } else if (code[i] === "@") {
      let j = i + 1
      while (j < code.length && /[\w.]/.test(code[j])) j++
      tokens.push({ text: code.slice(i, j), type: "decorator" })
      i = j
    } else if (/\d/.test(code[i]) || (code[i] === "." && /\d/.test(code[i + 1] ?? ""))) {
      let j = i
      while (j < code.length && /[\d.eE+\-_]/.test(code[j])) j++
      tokens.push({ text: code.slice(i, j), type: "number" })
      i = j
    } else if (/[a-zA-Z_]/.test(code[i])) {
      let j = i
      while (j < code.length && /\w/.test(code[j])) j++
      const word = code.slice(i, j)
      tokens.push({ text: word, type: KEYWORDS.has(word) ? "keyword" : BUILTINS.has(word) ? "builtin" : "plain" })
      i = j
    } else {
      tokens.push({ text: code[i], type: "plain" })
      i++
    }
  }
  return tokens
}

function CodeHighlight({ code }: { code: string }) {
  const tokens = tokenize(code)
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} style={{ color: TOKEN_COLORS[t.type] }}>{t.text}</span>
      ))}
    </>
  )
}

// ─── Code Modal ─────────────────────────────────────────────────────────────
interface CodeModalState { open: boolean; code: string; title: string }

function CodeModal({ state, onClose }: { state: CodeModalState; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!state.open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [state.open, onClose])

  if (!state.open) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(state.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#050508", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {/* Modal toolbar */}
        <div
          className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#28ca41" }} />
            </div>
            <span className="text-sm font-medium text-zinc-300 truncate max-w-xs">{state.title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-zinc-600">Python</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: copied ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${copied ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.07)"}`,
                color: copied ? "#34d399" : "#71717a",
              }}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable code */}
        <div className="flex-1 overflow-auto p-5">
          <pre className="text-sm font-mono leading-relaxed">
            <CodeHighlight code={state.code} />
          </pre>
        </div>
      </div>
    </div>
  )
}

// ─── Main lesson page ────────────────────────────────────────────────────────
export default function LessonDetailPage() {
  const params   = useParams()
  const catSlug  = params.category as string
  const lessonId = params.lessonId as string

  const [completed, setCompleted]     = useState<string[]>([])
  const [bookmarks, setBookmarks]     = useState<string[]>([])
  const [streak, setStreak]           = useState(0)
  const [justLeveledUp, setJustLeveledUp] = useState(false)
  const [xpToast, setXpToast]         = useState<{ show: boolean; xp: number; label?: string }>({ show: false, xp: 0 })
  const [showQuiz, setShowQuiz]       = useState(false)
  const [showAiTutor, setShowAiTutor] = useState(false)
  const [showNotes, setShowNotes]     = useState(false)
  const [codeModal, setCodeModal]     = useState<CodeModalState>({ open: false, code: "", title: "" })
  const contentRef                    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCompleted(getCompleted())
    setBookmarks(getBookmarks())
    setStreak(getStreak())
  }, [])

  // Find lesson and neighbours
  const lesson      = LESSONS.find((l) => l.id === lessonId)
  const lessonIndex = LESSONS.findIndex((l) => l.id === lessonId)
  const prevLesson  = lessonIndex > 0 ? LESSONS[lessonIndex - 1] : null
  const nextLesson  = lessonIndex < LESSONS.length - 1 ? LESSONS[lessonIndex + 1] : null

  const isCompleted  = completed.includes(lessonId)
  const isBookmarked = bookmarks.includes(lessonId)

  const xp       = getXP(completed)
  const level    = getLevel(xp)
  const progress = getLevelProgress(xp)
  const nextLvl  = getNextLevel(xp)

  const handleComplete = useCallback(() => {
    const prevXP    = getXP(completed)
    const prevLevel = getLevel(prevXP).name
    const { completed: updated, isNew } = markComplete(lessonId)
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
    setTimeout(() => setShowQuiz(true), 600)
  }, [lessonId, completed])

  const handleToggleBookmark = useCallback(() => {
    toggleBookmark(lessonId)
    setBookmarks(getBookmarks())
  }, [lessonId])

  const handleQuizClose = useCallback((result: QuizResult | null) => {
    setShowQuiz(false)
    if (result && result.bonusXP > 0) {
      setTimeout(() => {
        setXpToast({ show: true, xp: result.bonusXP, label: "Quiz Bonus!" })
        setTimeout(() => setXpToast({ show: false, xp: 0 }), 2400)
      }, 300)
    }
  }, [])

  const openCode = useCallback((code: string, title: string) => {
    setCodeModal({ open: true, code, title })
  }, [])

  const closeCode = useCallback(() => {
    setCodeModal({ open: false, code: "", title: "" })
  }, [])

  if (!lesson) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <Nav />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-zinc-400 font-medium mb-6">Lesson not found.</p>
          <Link href="/learn" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">
            ← Back to Learn
          </Link>
        </div>
      </div>
    )
  }

  const prevCatSlug = prevLesson ? categoryToSlug(prevLesson.category) : null
  const nextCatSlug = nextLesson ? categoryToSlug(nextLesson.category) : null

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Nav />

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-8" ref={contentRef}>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
            <Link href="/learn" className="hover:text-zinc-300 transition-colors">Learn</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/learn/${catSlug}`} className="hover:text-zinc-300 transition-colors">
              {lesson.category}
            </Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-zinc-400 truncate max-w-[160px]">{lesson.title}</span>
          </nav>

          {/* Lesson header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}
              >
                {lesson.category}
              </span>
              {lesson.content.filter((s) => s.code).length > 0 && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-mono"
                  style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)", color: "#38bdf8" }}
                >
                  {lesson.content.filter((s) => s.code).length} code example{lesson.content.filter((s) => s.code).length !== 1 ? "s" : ""}
                </span>
              )}
              <div className="ml-auto flex items-center gap-2">
                {/* Bookmark */}
                <button
                  onClick={handleToggleBookmark}
                  title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  style={{
                    background: isBookmarked ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.04)",
                    border: isBookmarked ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(255,255,255,0.08)",
                    color: isBookmarked ? "#fbbf24" : "#52525b",
                  }}
                >
                  <svg className="w-3.5 h-3.5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>

                {/* AI Tutor */}
                <button
                  onClick={() => { setShowAiTutor((v) => !v); setShowNotes(false) }}
                  title="AI Tutor"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={showAiTutor
                    ? { background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)", color: "#34d399" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#52525b" }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </button>

                {/* Notes */}
                <button
                  onClick={() => { setShowNotes((v) => !v); setShowAiTutor(false) }}
                  title="Notes"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={showNotes
                    ? { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#52525b" }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                {/* Retake quiz */}
                {isCompleted && (
                  <button
                    onClick={() => setShowQuiz(true)}
                    title="Retake quiz"
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#52525b" }}
                  >
                    <svg className="w-3.5 h-3.5 hover:text-violet-400 transition-colors" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </button>
                )}

                <span className="text-xs font-semibold text-violet-400">⚡ +100 XP</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-5">{lesson.title}</h1>

            {isCompleted ? (
              <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Completed · +100 XP earned
              </div>
            ) : (
              <button
                onClick={handleComplete}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Mark as Complete · +100 XP
              </button>
            )}
          </div>

          <div className="h-px mb-8" style={{ background: "var(--border)" }} />

          {/* ── Sections Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lesson.content.map((section, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-xl"
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${section.code ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                {/* Number badge + heading */}
                <div className="flex items-start gap-3">
                  <div
                    className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.18)", color: "#a78bfa" }}
                  >
                    {i + 1}
                  </div>
                  <h2 className="text-sm font-bold text-white leading-snug">{section.heading}</h2>
                </div>

                {/* Body text */}
                {section.body && (
                  <p className="text-xs text-zinc-400 leading-relaxed">{section.body}</p>
                )}

                {/* Note */}
                {section.note && (
                  <div
                    className="flex gap-2 rounded-lg p-3"
                    style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}
                  >
                    <span className="text-amber-500 shrink-0">💡</span>
                    <p className="text-amber-200/70 text-xs leading-relaxed">{section.note}</p>
                  </div>
                )}

                {/* View Code button */}
                {section.code && (
                  <div className="mt-auto pt-1">
                    <button
                      onClick={() => openCode(section.code!, section.heading)}
                      className="group flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg w-full justify-center transition-all hover:scale-[1.02] active:scale-95"
                      style={{
                        background: "rgba(56,189,248,0.07)",
                        border: "1px solid rgba(56,189,248,0.18)",
                        color: "#38bdf8",
                      }}
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      View Code Example
                      <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity ml-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom complete CTA */}
          {!isCompleted && (
            <div
              className="mt-12 p-5 rounded-xl text-center"
              style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)" }}
            >
              <p className="text-sm text-zinc-500 mb-3">Finished reading? Mark it complete to earn your XP.</p>
              <button
                onClick={handleComplete}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-2.5 rounded-lg transition-opacity hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}
              >
                ⚡ Complete &amp; Earn 100 XP
              </button>
            </div>
          )}

          {/* Prev / Next navigation */}
          <div
            className="flex justify-between mt-10 pt-6 gap-3"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {prevLesson && prevCatSlug ? (
              <Link
                href={`/learn/${prevCatSlug}/${prevLesson.id}`}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-all hover:-translate-x-0.5"
                style={{ color: "#a1a1aa", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                <span className="hidden sm:inline truncate max-w-[160px]">{prevLesson.title}</span>
                <span className="sm:hidden">Previous</span>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson && nextCatSlug ? (
              <Link
                href={`/learn/${nextCatSlug}/${nextLesson.id}`}
                className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-all hover:translate-x-0.5"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
              >
                <span className="hidden sm:inline truncate max-w-[160px]">{nextLesson.title}</span>
                <span className="sm:hidden">Next</span>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <Link
                href={`/learn/${catSlug}`}
                className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-all"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
              >
                Back to {lesson.category}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </main>

        {/* ── Right panel: AI Tutor or Notes (desktop) ── */}
        {(showAiTutor || showNotes) && (
          <aside
            className="hidden lg:flex flex-col shrink-0 w-80 border-l"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            {showAiTutor && (
              <AiTutor
                lessonTitle={lesson.title}
                lessonCategory={lesson.category}
                onClose={() => setShowAiTutor(false)}
              />
            )}
            {showNotes && !showAiTutor && (
              <NotesPanel
                lessonId={lessonId}
                lessonTitle={lesson.title}
                onClose={() => setShowNotes(false)}
              />
            )}
          </aside>
        )}
      </div>

      {/* ── XP sidebar (fixed bottom-right, desktop) ── */}
      <div
        className="hidden lg:flex fixed bottom-6 left-6 flex-col gap-1 px-4 py-3 rounded-xl shadow-xl text-xs"
        style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <span>{level.emoji}</span>
          <span className="font-semibold text-white">{level.name}</span>
          <span className="text-violet-400 font-semibold ml-1">{xp.toLocaleString()} XP</span>
          <span className="text-zinc-600 mx-1">·</span>
          <span>🔥</span>
          <span className="text-orange-400 font-semibold">{streak}</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="h-full rounded-full xp-bar-fill transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        {nextLvl && (
          <p className="text-zinc-700">{nextLvl.min - xp} XP → {nextLvl.emoji} {nextLvl.name}</p>
        )}
      </div>

      {/* ── Quiz Modal ── */}
      {showQuiz && (
        <QuizModal
          lessonId={lessonId}
          lessonTitle={lesson.title}
          onClose={handleQuizClose}
        />
      )}

      {/* ── Mobile AI Tutor ── */}
      {showAiTutor && (
        <div
          className="fixed inset-0 z-40 flex flex-col justify-end lg:hidden"
          style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAiTutor(false) }}
        >
          <div
            className="h-[70vh] rounded-t-2xl overflow-hidden flex flex-col"
            style={{ background: "var(--surface)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <AiTutor
              lessonTitle={lesson.title}
              lessonCategory={lesson.category}
              onClose={() => setShowAiTutor(false)}
            />
          </div>
        </div>
      )}

      {/* ── Mobile Notes ── */}
      {showNotes && !showAiTutor && (
        <div
          className="fixed inset-0 z-40 flex flex-col justify-end lg:hidden"
          style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowNotes(false) }}
        >
          <div
            className="h-96 rounded-t-2xl overflow-hidden flex flex-col"
            style={{ background: "var(--surface)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <NotesPanel
              lessonId={lessonId}
              lessonTitle={lesson.title}
              onClose={() => setShowNotes(false)}
            />
          </div>
        </div>
      )}

      {/* ── Code Modal ── */}
      <CodeModal state={codeModal} onClose={closeCode} />

      {/* ── XP Toast ── */}
      {xpToast.show && (
        <div className="fixed bottom-6 right-6 z-50 xp-pop pointer-events-none">
          <div
            className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-2xl"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 8px 32px rgba(124,58,237,0.35)" }}
          >
            <span>⚡</span>
            <span className="text-white">+{xpToast.xp} XP{xpToast.label ? ` — ${xpToast.label}` : ""}</span>
          </div>
        </div>
      )}

      {/* ── Level-up banner ── */}
      {justLeveledUp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
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
