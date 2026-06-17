"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { LESSONS, CATEGORIES } from "@/data/curriculum"
import Nav from "@/components/Nav"
import {
  getCompleted, getXP, getLevel, getLevelProgress, getNextLevel,
  getStreak, getEarnedBadges, getCategoryProgress,
  getAllQuizResults, getBookmarks, getAllNotes, getActivity,
  BADGES, LEVELS, XP_PER_LESSON, XP_PER_CORRECT,
} from "@/lib/progress"

const CAT_COLOR: Record<string, string> = {
  "Machine Learning":   "#a78bfa",
  "Deep Learning":      "#60a5fa",
  "NLP & Transformers": "#22d3ee",
  "LLMs & Prompting":   "#34d399",
  "RAG Systems":        "#fbbf24",
  "Computer Vision":    "#f472b6",
  "MLOps":              "#fb923c",
  "Interview Prep":     "#f87171",
}

function RadarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const size   = 220
  const cx     = size / 2
  const cy     = size / 2
  const radius = 80
  const n      = data.length
  const levels = [0.25, 0.5, 0.75, 1.0]

  const angle = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2

  const point = (i: number, r: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  })

  const gridPoly = (frac: number) =>
    data.map((_, i) => {
      const p = point(i, radius * frac)
      return `${p.x},${p.y}`
    }).join(" ")

  const dataPoly = data.map((d, i) => {
    const p = point(i, radius * (d.value / 100))
    return `${p.x},${p.y}`
  }).join(" ")

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[220px] mx-auto">
      {/* Grid levels */}
      {levels.map((frac) => (
        <polygon key={frac} points={gridPoly(frac)} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
      ))}

      {/* Spokes */}
      {data.map((_, i) => {
        const p = point(i, radius)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
      })}

      {/* Data polygon */}
      <polygon points={dataPoly} fill="rgba(124,58,237,0.15)" stroke="#7c3aed" strokeWidth={1.5} />

      {/* Data dots */}
      {data.map((d, i) => {
        const p = point(i, radius * (d.value / 100))
        return (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={d.color} />
        )
      })}

      {/* Labels */}
      {data.map((d, i) => {
        const labelR = radius + 22
        const p = point(i, labelR)
        const anchor = p.x < cx - 5 ? "end" : p.x > cx + 5 ? "start" : "middle"
        return (
          <text key={i} x={p.x} y={p.y} textAnchor={anchor}
            dominantBaseline="middle" fontSize={8} fill={d.value > 0 ? d.color : "#52525b"}>
            {d.label.split(" ")[0]}
          </text>
        )
      })}
    </svg>
  )
}

function Ring({ pct, color, size = 72, stroke = 7 }: { pct: number; color: string; size?: number; stroke?: number }) {
  const r   = (size - stroke) / 2
  const c   = 2 * Math.PI * r
  const off = c - (pct / 100) * c
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
        stroke="rgba(255,255,255,0.06)" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
        stroke={color} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off}
        style={{ transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  )
}

function Heatmap({ activity }: { activity: Record<string, number> }) {
  const today    = new Date()
  const cells: { date: string; count: number }[] = []

  // Build 16 weeks × 7 days = 112 days
  for (let i = 111; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split("T")[0]
    cells.push({ date: key, count: activity[key] ?? 0 })
  }

  const weeks: typeof cells[] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  const maxCount = Math.max(1, ...cells.map((c) => c.count))

  function cellColor(count: number) {
    if (!count) return "rgba(255,255,255,0.04)"
    const intensity = Math.min(count / maxCount, 1)
    if (intensity < 0.3) return "rgba(124,58,237,0.25)"
    if (intensity < 0.6) return "rgba(124,58,237,0.5)"
    if (intensity < 0.85) return "rgba(124,58,237,0.75)"
    return "#7c3aed"
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex gap-1" style={{ minWidth: "max-content" }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell) => (
              <div key={cell.date} title={`${cell.date}: ${cell.count} activities`}
                className="w-3 h-3 rounded-sm cursor-default"
                style={{ background: cellColor(cell.count) }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [completed, setCompleted]   = useState<string[]>([])
  const [quizResults, setQuizResults] = useState<ReturnType<typeof getAllQuizResults>>({})
  const [bookmarks, setBookmarks]   = useState<string[]>([])
  const [notes, setNotes]           = useState<ReturnType<typeof getAllNotes>>({})
  const [activity, setActivity]     = useState<Record<string, number>>({})
  const [mounted, setMounted]       = useState(false)

  useEffect(() => {
    setCompleted(getCompleted())
    setQuizResults(getAllQuizResults())
    setBookmarks(getBookmarks())
    setNotes(getAllNotes())
    setActivity(getActivity())
    setMounted(true)
  }, [])

  const xp       = getXP(completed)
  const level    = getLevel(xp)
  const progress = getLevelProgress(xp)
  const nextLvl  = getNextLevel(xp)
  const streak   = getStreak()
  const badges   = getEarnedBadges(completed, LESSONS)

  const quizCount    = Object.keys(quizResults).length
  const totalQuizXP  = Object.values(quizResults).reduce((a, r) => a + r.bonusXP, 0)
  const avgScore     = quizCount > 0
    ? Math.round(Object.values(quizResults).reduce((a, r) => a + r.score / r.total, 0) / quizCount * 100)
    : 0
  const noteCount    = Object.keys(notes).length
  const bookmarkCount = bookmarks.length
  const totalPct     = LESSONS.length ? Math.round((completed.length / LESSONS.length) * 100) : 0

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      <Nav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">

        {/* Hero stats */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Your Progress</h1>
          <p className="text-sm text-zinc-500">{completed.length} of {LESSONS.length} lessons completed</p>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total XP", value: xp.toLocaleString(), sub: `${level.emoji} ${level.name}`, color: "#a78bfa" },
            { label: "Streak", value: `${streak}🔥`, sub: "days in a row", color: "#fb923c" },
            { label: "Lessons Done", value: `${completed.length}/${LESSONS.length}`, sub: `${totalPct}% complete`, color: "#34d399" },
            { label: "Quiz Avg", value: quizCount ? `${avgScore}%` : "—", sub: `${quizCount} quizzes taken`, color: "#60a5fa" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-xs text-zinc-600 mb-1">{s.label}</p>
              <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Level progress */}
        <div className="rounded-xl p-5 sm:p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Level Progress</h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                {nextLvl ? `${(nextLvl.min - xp).toLocaleString()} XP to ${nextLvl.emoji} ${nextLvl.name}` : "Max level reached!"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl">{level.emoji}</span>
              <p className="text-xs text-zinc-500 mt-0.5">{level.name}</p>
            </div>
          </div>

          {/* Level track */}
          <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
            {LEVELS.map((l, i) => {
              const active = l.name === level.name
              const done   = xp >= l.min
              return (
                <div key={l.name} className="flex items-center gap-1.5 shrink-0">
                  <div className={`flex flex-col items-center gap-0.5`}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                      style={{
                        background: active ? "#7c3aed" : done ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
                        border: active ? "2px solid #a78bfa" : done ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.08)",
                      }}>
                      {l.emoji}
                    </div>
                    <span className="text-[10px] text-zinc-700">{l.name}</span>
                  </div>
                  {i < LEVELS.length - 1 && (
                    <div className="w-6 h-px shrink-0"
                      style={{ background: xp >= LEVELS[i + 1].min ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.07)" }} />
                  )}
                </div>
              )
            })}
          </div>

          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full xp-bar-fill transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Category rings */}
        <div className="rounded-xl p-5 sm:p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-base font-bold text-white mb-5">Category Breakdown</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => {
              const prog = getCategoryProgress(cat, completed, LESSONS)
              const color = CAT_COLOR[cat] ?? "#a78bfa"
              return (
                <div key={cat} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <Ring pct={prog.pct} color={color} size={72} stroke={7} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{prog.pct}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-white leading-tight">{cat}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{prog.done}/{prog.total}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Skill radar */}
        <div className="rounded-xl p-5 sm:p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-base font-bold text-white mb-5">Skill Radar</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-full sm:w-56 shrink-0">
              <RadarChart data={CATEGORIES.map((cat) => ({
                label: cat,
                value: getCategoryProgress(cat, completed, LESSONS).pct,
                color: CAT_COLOR[cat] ?? "#a78bfa",
              }))} />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2 w-full">
              {CATEGORIES.map((cat) => {
                const { pct } = getCategoryProgress(cat, completed, LESSONS)
                const color = CAT_COLOR[cat] ?? "#a78bfa"
                return (
                  <div key={cat} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-zinc-500 truncate flex-1">{cat.split(" ")[0]}</span>
                    <span className="font-semibold shrink-0" style={{ color }}>{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Activity heatmap */}
        <div className="rounded-xl p-5 sm:p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Activity</h2>
            <p className="text-xs text-zinc-600">Last 16 weeks</p>
          </div>
          <Heatmap activity={activity} />
          <div className="flex items-center gap-1.5 mt-3 text-xs text-zinc-700">
            <span>Less</span>
            {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
              <div key={i} className="w-3 h-3 rounded-sm"
                style={{ background: v === 0 ? "rgba(255,255,255,0.04)" : `rgba(124,58,237,${0.25 + v * 0.75})` }} />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Quiz results + badges */}
        <div className="grid sm:grid-cols-2 gap-4">

          {/* Quiz stats */}
          <div className="rounded-xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h2 className="text-base font-bold text-white mb-4">Quiz Performance</h2>
            {quizCount === 0 ? (
              <p className="text-sm text-zinc-600">Complete lessons to unlock quizzes and earn bonus XP.</p>
            ) : (
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Quizzes taken</span>
                  <span className="text-white font-semibold">{quizCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Average score</span>
                  <span className="text-white font-semibold">{avgScore}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Bonus XP earned</span>
                  <span className="text-violet-400 font-semibold">+{totalQuizXP} XP</span>
                </div>
                <div className="h-px" style={{ background: "var(--border)" }} />
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Object.entries(quizResults).slice(0, 8).map(([id, r]) => {
                    const lesson = LESSONS.find((l) => l.id === id)
                    const pct = Math.round((r.score / r.total) * 100)
                    return (
                      <div key={id} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500 truncate flex-1 mr-2">{lesson?.title ?? id}</span>
                        <span className={`font-semibold shrink-0 ${pct === 100 ? "text-emerald-400" : pct >= 67 ? "text-violet-400" : "text-amber-400"}`}>
                          {r.score}/{r.total}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="rounded-xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h2 className="text-base font-bold text-white mb-4">Badges</h2>
            <div className="grid grid-cols-2 gap-2">
              {BADGES.map((badge) => {
                const earned = badges.includes(badge.id)
                return (
                  <div key={badge.id}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
                    style={{
                      background: earned ? "rgba(251,191,36,0.06)" : "rgba(255,255,255,0.02)",
                      border: earned ? "1px solid rgba(251,191,36,0.2)" : "1px solid rgba(255,255,255,0.05)",
                      opacity: earned ? 1 : 0.45,
                    }}>
                    <span className="text-base">{badge.icon}</span>
                    <div>
                      <p className={`font-semibold leading-none mb-0.5 ${earned ? "text-amber-300" : "text-zinc-500"}`}>
                        {badge.label}
                      </p>
                      <p className="text-zinc-600 leading-none">{badge.category.split(" ")[0]}</p>
                    </div>
                    {earned && <span className="ml-auto text-amber-400 shrink-0">✓</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bookmarks & Notes */}
        <div className="grid sm:grid-cols-2 gap-4">

          {/* Bookmarks */}
          <div className="rounded-xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Bookmarks</h2>
              <span className="text-xs text-zinc-600">{bookmarkCount} saved</span>
            </div>
            {bookmarks.length === 0 ? (
              <p className="text-sm text-zinc-600">Bookmark lessons while reading to save them here.</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {bookmarks.map((id) => {
                  const lesson = LESSONS.find((l) => l.id === id)
                  if (!lesson) return null
                  const color = CAT_COLOR[lesson.category] ?? "#a78bfa"
                  return (
                    <Link key={id} href={`/learn?lesson=${id}`}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs group transition-all hover:bg-white/5">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                      <span className="text-zinc-400 group-hover:text-white truncate transition-colors">{lesson.title}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="rounded-xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Notes</h2>
              <span className="text-xs text-zinc-600">{noteCount} lessons</span>
            </div>
            {noteCount === 0 ? (
              <p className="text-sm text-zinc-600">Add notes to lessons while studying to see them here.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(notes).slice(0, 6).map(([id, text]) => {
                  const lesson = LESSONS.find((l) => l.id === id)
                  if (!lesson) return null
                  return (
                    <div key={id} className="rounded-lg px-3 py-2 text-xs"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <p className="text-zinc-500 mb-1 font-medium truncate">{lesson.title}</p>
                      <p className="text-zinc-600 leading-relaxed line-clamp-2">{text}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* CTA footer */}
        <div className="text-center pt-4 pb-8">
          <Link href="/learn"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            Continue Learning →
          </Link>
        </div>
      </main>
    </div>
  )
}
