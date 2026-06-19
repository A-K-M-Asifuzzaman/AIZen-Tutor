"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Nav from "@/components/Nav"
import { CATEGORIES, LESSONS } from "@/data/curriculum"
import { getCompleted } from "@/lib/progress"
import { categoryToSlug } from "../page"

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  "Python":             { icon: "🐍", color: "#3b82f6" },
  "Machine Learning":   { icon: "🤖", color: "#34d399" },
  "Deep Learning":      { icon: "🧠", color: "#a78bfa" },
  "NLP & Transformers": { icon: "📝", color: "#fbbf24" },
  "LLMs & Prompting":   { icon: "💬", color: "#fb923c" },
  "RAG Systems":        { icon: "🔍", color: "#38bdf8" },
  "Computer Vision":    { icon: "👁️", color: "#f472b6" },
  "MLOps":              { icon: "⚙️", color: "#4ade80" },
  "Interview Prep":     { icon: "🎯", color: "#f59e0b" },
}

export default function CategoryPage() {
  const params                      = useParams()
  const slug                        = params.category as string
  const [completed, setCompleted]   = useState<string[]>([])

  useEffect(() => { setCompleted(getCompleted()) }, [])

  const category = CATEGORIES.find((c) => categoryToSlug(c) === slug)
  const lessons  = category ? LESSONS.filter((l) => l.category === category) : []
  const meta     = category ? CATEGORY_META[category] : null

  const catDone    = lessons.filter((l) => completed.includes(l.id)).length
  const allDone    = catDone === lessons.length && lessons.length > 0

  if (!category) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <Nav />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-zinc-400 font-medium mb-1">Category not found</p>
          <p className="text-zinc-600 text-sm mb-6">"{slug}" doesn't match any learning path.</p>
          <Link href="/learn" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">
            ← Back to Learning Paths
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Nav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/learn" className="hover:text-zinc-300 transition-colors">Learn</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-zinc-300">{category}</span>
        </nav>

        {/* Category header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{
                background: `${meta?.color ?? "#7c3aed"}18`,
                border: `1px solid ${meta?.color ?? "#7c3aed"}35`,
              }}
            >
              {meta?.icon ?? "📚"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{category}</h1>
              <p className="text-zinc-500 text-sm mt-0.5">
                {catDone}/{lessons.length} lessons completed
                {allDone && " · 🏆 All done!"}
              </p>
            </div>
          </div>

          {/* Progress pill */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${lessons.length > 0 ? (catDone / lessons.length) * 100 : 0}%`,
                  background: meta?.color ?? "#7c3aed",
                }}
              />
            </div>
            <span className="text-xs font-semibold tabular-nums" style={{ color: meta?.color ?? "#a78bfa" }}>
              {lessons.length > 0 ? Math.round((catDone / lessons.length) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Lessons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson, idx) => {
            const isDone    = completed.includes(lesson.id)
            const codeCount = lesson.content.filter((s) => s.code).length

            return (
              <Link
                key={lesson.id}
                href={`/learn/${slug}/${lesson.id}`}
                className="group rounded-2xl p-5 flex flex-col transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${isDone ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                {/* Top row: index badge + tags */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: isDone ? "rgba(52,211,153,0.12)" : `${meta?.color ?? "#7c3aed"}15`,
                      border: `1px solid ${isDone ? "rgba(52,211,153,0.3)" : `${meta?.color ?? "#7c3aed"}30`}`,
                      color: isDone ? "#34d399" : (meta?.color ?? "#a78bfa"),
                    }}
                  >
                    {isDone ? "✓" : idx + 1}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {codeCount > 0 && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-mono"
                        style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)", color: "#38bdf8" }}
                      >
                        {codeCount} code
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white mb-1.5 leading-snug group-hover:text-violet-300 transition-colors flex-1">
                  {lesson.title}
                </h3>

                {/* Section count */}
                <p className="text-xs text-zinc-600 mb-3">{lesson.content.length} sections</p>

                {/* Bottom row */}
                <div className="flex items-center justify-between">
                  {isDone ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      Completed
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-600">+100 XP</span>
                  )}
                  <svg
                    className="w-4 h-4 text-zinc-700 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all"
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Back link */}
        <div className="mt-10 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Link href="/learn" className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-300 transition-colors w-fit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            All Learning Paths
          </Link>
        </div>
      </div>
    </div>
  )
}
