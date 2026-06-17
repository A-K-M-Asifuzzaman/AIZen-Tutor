"use client"
import { useState, useEffect, useCallback } from "react"
import { getNote, saveNote } from "@/lib/progress"

interface Props {
  lessonId: string
  lessonTitle: string
  onClose: () => void
}

export default function NotesPanel({ lessonId, lessonTitle, onClose }: Props) {
  const [text, setText]     = useState("")
  const [saved, setSaved]   = useState(false)
  const [dirty, setDirty]   = useState(false)

  useEffect(() => {
    setText(getNote(lessonId))
    setDirty(false)
    setSaved(false)
  }, [lessonId])

  const handleSave = useCallback(() => {
    saveNote(lessonId, text)
    setSaved(true)
    setDirty(false)
    setTimeout(() => setSaved(false), 1800)
  }, [lessonId, text])

  // Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); handleSave() }
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handleSave, onClose])

  return (
    <div className="flex flex-col h-full"
      style={{ background: "var(--surface)", borderLeft: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}>
        <div className="min-w-0">
          <p className="text-xs text-zinc-600 mb-0.5">Notes</p>
          <p className="text-sm font-semibold text-white truncate">{lessonTitle}</p>
        </div>
        <button onClick={onClose}
          className="ml-2 w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
          style={{ background: "rgba(255,255,255,0.05)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Textarea */}
      <div className="flex-1 flex flex-col overflow-hidden p-3">
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setDirty(true); setSaved(false) }}
          placeholder="Write your notes here...&#10;&#10;Tips, key takeaways, questions — anything you want to remember."
          className="flex-1 resize-none text-sm text-zinc-300 placeholder-zinc-700 focus:outline-none leading-relaxed"
          style={{ background: "transparent" }}
        />
      </div>

      {/* Footer */}
      <div className="shrink-0 px-3 pb-3 pt-1">
        <div className="flex items-center gap-2">
          <button onClick={handleSave}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: saved ? "rgba(34,197,94,0.2)" : "linear-gradient(135deg,#7c3aed,#4f46e5)", border: saved ? "1px solid rgba(34,197,94,0.3)" : "none" }}>
            {saved ? "✓ Saved" : "Save Note"}
          </button>
        </div>
        <p className="text-[10px] text-zinc-700 text-center mt-1.5">⌘S to save</p>
      </div>
    </div>
  )
}
