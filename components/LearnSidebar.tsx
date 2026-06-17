"use client"
import { CATEGORIES, LESSONS } from "@/data/curriculum"
import { getCategoryProgress } from "@/lib/progress"

interface Props {
  activeLessonId: string
  completed: string[]
  onSelect: (id: string) => void
  search: string
}

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

export default function LearnSidebar({ activeLessonId, completed, onSelect, search }: Props) {
  const filtered = search.trim()
    ? LESSONS.filter((l) =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.category.toLowerCase().includes(search.toLowerCase())
      )
    : null

  if (filtered) {
    return (
      <nav className="py-2 px-2">
        <p className="text-xs text-zinc-600 px-2 mb-2">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
        {filtered.length === 0
          ? <p className="text-xs text-zinc-700 px-3">No lessons found</p>
          : filtered.map((l) => (
              <LessonItem key={l.id} lesson={l} active={l.id === activeLessonId}
                done={completed.includes(l.id)} onClick={() => onSelect(l.id)}
                color={CAT_COLOR[l.category] ?? "#a78bfa"} />
            ))
        }
      </nav>
    )
  }

  return (
    <nav className="py-2 px-2">
      {CATEGORIES.map((cat) => {
        const lessons = LESSONS.filter((l) => l.category === cat)
        if (!lessons.length) return null
        const { done, total, pct } = getCategoryProgress(cat, completed, LESSONS)
        const color = CAT_COLOR[cat] ?? "#a78bfa"
        return (
          <div key={cat} className="mb-4">
            {/* Category header */}
            <div className="flex items-center gap-2 px-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
              <p className="text-xs font-semibold uppercase tracking-wider flex-1 truncate" style={{ color: color + "bb" }}>
                {cat}
              </p>
              <span className="text-xs font-medium" style={{ color: done === total && total > 0 ? color : "#3f3f46" }}>
                {done}/{total}
              </span>
            </div>
            {/* Category progress bar */}
            <div className="mx-2 mb-2 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}` }} />
            </div>
            {lessons.map((l) => (
              <LessonItem key={l.id} lesson={l} active={l.id === activeLessonId}
                done={completed.includes(l.id)} onClick={() => onSelect(l.id)} color={color} />
            ))}
          </div>
        )
      })}
    </nav>
  )
}

function LessonItem({ lesson, active, done, onClick, color }: {
  lesson: { id: string; title: string }
  active: boolean
  done: boolean
  onClick: () => void
  color: string
}) {
  return (
    <button onClick={onClick}
      className={`w-full text-left text-xs px-3 py-2 rounded-lg mb-0.5 flex items-center gap-2 transition-all group ${
        active ? "text-white font-semibold" : "text-zinc-500 hover:text-zinc-200"
      }`}
      style={active ? {
        background: `linear-gradient(135deg, ${color}18, ${color}08)`,
        border: `1px solid ${color}40`,
        boxShadow: `0 0 12px ${color}20`,
      } : { border: "1px solid transparent" }}>

      {/* Status dot */}
      <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
        done ? "text-white" : ""
      }`}
        style={done
          ? { background: color, boxShadow: `0 0 8px ${color}60` }
          : active
            ? { border: `2px solid ${color}`, boxShadow: `0 0 8px ${color}40` }
            : { border: "1px solid rgba(255,255,255,0.1)" }
        }>
        {done && (
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>

      <span className="flex-1 leading-snug truncate">{lesson.title}</span>

      {/* XP badge on hover */}
      {!done && (
        <span className={`text-xs shrink-0 font-bold transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          style={{ color }}>
          +100
        </span>
      )}
    </button>
  )
}
