"use client"
import { CATEGORIES, LESSONS } from "@/data/curriculum"

interface Props {
  activeLessonId: string
  onSelect: (id: string) => void
  search: string
}

export default function Sidebar({ activeLessonId, onSelect, search }: Props) {
  const filtered = search.trim()
    ? LESSONS.filter(
        (l) =>
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          l.category.toLowerCase().includes(search.toLowerCase())
      )
    : null

  if (filtered) {
    return (
      <nav className="py-3 px-2">
        <p className="text-xs text-zinc-500 px-2 mb-2">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </p>
        {filtered.length === 0 ? (
          <p className="text-xs text-zinc-600 px-2">No lessons match your search.</p>
        ) : (
          filtered.map((lesson) => (
            <SidebarItem
              key={lesson.id}
              label={lesson.title}
              active={lesson.id === activeLessonId}
              onClick={() => onSelect(lesson.id)}
            />
          ))
        )}
      </nav>
    )
  }

  return (
    <nav className="py-3 px-2">
      {CATEGORIES.map((cat) => {
        const lessons = LESSONS.filter((l) => l.category === cat)
        if (!lessons.length) return null
        return (
          <div key={cat} className="mb-4">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 mb-1">
              {cat}
            </p>
            {lessons.map((lesson) => (
              <SidebarItem
                key={lesson.id}
                label={lesson.title}
                active={lesson.id === activeLessonId}
                onClick={() => onSelect(lesson.id)}
              />
            ))}
          </div>
        )
      })}
    </nav>
  )
}

function SidebarItem({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-sm px-3 py-2 rounded-lg mb-0.5 transition-colors leading-snug ${
        active
          ? "bg-violet-600 text-white font-medium"
          : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
      }`}
    >
      {label}
    </button>
  )
}
