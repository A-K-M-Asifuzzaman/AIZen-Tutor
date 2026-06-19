"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Nav from "@/components/Nav"
import { CATEGORIES, LESSONS } from "@/data/curriculum"
import { getCompleted, getXP, getLevel, getStreak } from "@/lib/progress"

export function categoryToSlug(cat: string) {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

const CATEGORY_META: Record<string, { icon: string; description: string; color: string; difficulty: string }> = {
  "Python":             { icon: "🐍", description: "Master Python from syntax to advanced patterns", color: "#3b82f6", difficulty: "Beginner" },
  "Machine Learning":   { icon: "🤖", description: "Algorithms, models, and ML fundamentals", color: "#34d399", difficulty: "Intermediate" },
  "Deep Learning":      { icon: "🧠", description: "Neural networks, CNNs, RNNs and transformers", color: "#a78bfa", difficulty: "Intermediate" },
  "NLP & Transformers": { icon: "📝", description: "Text processing, BERT and attention mechanisms", color: "#fbbf24", difficulty: "Intermediate" },
  "LLMs & Prompting":   { icon: "💬", description: "Large language models and prompt engineering", color: "#fb923c", difficulty: "Intermediate" },
  "RAG Systems":        { icon: "🔍", description: "Retrieval-augmented generation pipelines", color: "#38bdf8", difficulty: "Advanced" },
  "Computer Vision":    { icon: "👁️", description: "Image recognition, detection and segmentation", color: "#f472b6", difficulty: "Intermediate" },
  "MLOps":              { icon: "⚙️", description: "ML pipelines, deployment and monitoring", color: "#4ade80", difficulty: "Advanced" },
  "Interview Prep":     { icon: "🎯", description: "Common ML/DS interview questions and answers", color: "#f59e0b", difficulty: "Expert" },
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "#34d399",
  Intermediate: "#fbbf24",
  Advanced: "#fb923c",
  Expert: "#f472b6",
}

export default function LearnPage() {
  const [completed, setCompleted] = useState<string[]>([])
  const [streak, setStreak]       = useState(0)

  useEffect(() => {
    setCompleted(getCompleted())
    setStreak(getStreak())
  }, [])

  const xp    = getXP(completed)
  const level = getLevel(xp)

  const totalDone = completed.length
  const totalLessons = LESSONS.length

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Nav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Hero header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Learning Paths</h1>
            <p className="text-zinc-500 text-sm">
              {totalDone === 0
                ? "Pick a topic and start learning. Every lesson earns XP."
                : `You've completed ${totalDone} of ${totalLessons} lessons — keep going!`}
            </p>
          </div>

          {/* Stats pill */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl shrink-0"
            style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-lg">{level.emoji}</span>
            <div>
              <p className="text-xs font-bold text-white">{level.name}</p>
              <p className="text-xs text-zinc-500">{xp.toLocaleString()} XP</p>
            </div>
            <div className="w-px h-8 mx-1" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-sm">🔥</span>
            <div>
              <p className="text-xs font-bold text-orange-400">{streak}</p>
              <p className="text-xs text-zinc-500">streak</p>
            </div>
          </div>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const meta        = CATEGORY_META[cat]
            const catLessons  = LESSONS.filter((l) => l.category === cat)
            const catDone     = catLessons.filter((l) => completed.includes(l.id)).length
            const progress    = catLessons.length > 0 ? (catDone / catLessons.length) * 100 : 0
            const allDone     = catDone === catLessons.length && catLessons.length > 0
            const diffColor   = DIFFICULTY_COLOR[meta?.difficulty ?? "Intermediate"]

            return (
              <Link
                key={cat}
                href={`/learn/${categoryToSlug(cat)}`}
                className="group relative rounded-2xl p-5 flex flex-col transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${allDone ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                {/* Top progress stripe */}
                {progress > 0 && (
                  <div
                    className="absolute top-0 left-0 h-0.5 rounded-t-2xl transition-all duration-700"
                    style={{ width: `${progress}%`, background: meta?.color ?? "#7c3aed" }}
                  />
                )}

                {/* Icon + lesson count */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: `${meta?.color ?? "#7c3aed"}18`,
                      border: `1px solid ${meta?.color ?? "#7c3aed"}35`,
                    }}
                  >
                    {meta?.icon ?? "📚"}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold tabular-nums" style={{ color: meta?.color ?? "#a78bfa" }}>
                      {catDone}/{catLessons.length}
                    </p>
                    <p className="text-xs text-zinc-600">lessons</p>
                  </div>
                </div>

                {/* Name + description */}
                <h2 className="text-sm font-bold text-white mb-1.5 group-hover:text-violet-300 transition-colors leading-snug">
                  {cat}
                </h2>
                <p className="text-xs text-zinc-500 leading-relaxed flex-1 mb-4">
                  {meta?.description}
                </p>

                {/* Difficulty badge + progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: `${diffColor}12`,
                        border: `1px solid ${diffColor}30`,
                        color: diffColor,
                      }}
                    >
                      {meta?.difficulty}
                    </span>
                    {allDone ? (
                      <span className="text-xs text-emerald-400 font-medium">✅ Complete</span>
                    ) : progress > 0 ? (
                      <span className="text-xs text-zinc-500">{Math.round(progress)}%</span>
                    ) : null}
                  </div>

                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${progress}%`, background: meta?.color ?? "#7c3aed" }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Overall progress footer */}
        <div className="mt-10 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p className="text-sm font-semibold text-white mb-0.5">Overall Progress</p>
            <p className="text-xs text-zinc-500">{totalDone} / {totalLessons} lessons completed</p>
          </div>
          <div className="flex items-center gap-3 sm:w-64">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div
                className="h-full rounded-full bg-violet-600 transition-all duration-700"
                style={{ width: `${Math.round((totalDone / totalLessons) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-violet-400 shrink-0">
              {Math.round((totalDone / totalLessons) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
