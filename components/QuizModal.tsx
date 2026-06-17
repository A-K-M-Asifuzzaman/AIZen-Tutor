"use client"
import { useState, useEffect, useRef } from "react"
import { QUIZZES } from "@/data/quizzes"
import { saveQuizResult, getQuizResult, XP_PER_CORRECT, type QuizResult } from "@/lib/progress"

interface Props {
  lessonId: string
  lessonTitle: string
  onClose: (result: QuizResult | null) => void
}

export default function QuizModal({ lessonId, lessonTitle, onClose }: Props) {
  const questions = QUIZZES[lessonId] ?? []
  const [idx, setIdx]         = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore]     = useState(0)
  const [done, setDone]       = useState(false)
  const [existing]            = useState(() => getQuizResult(lessonId))
  const overlayRef            = useRef<HTMLDivElement>(null)

  // Skip quiz if already taken
  const question = questions[idx]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(null) }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  if (!questions.length) {
    onClose(null)
    return null
  }

  function handleSelect(i: number) {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    if (i === question.answer) setScore((s) => s + 1)
  }

  function handleNext() {
    if (idx + 1 >= questions.length) {
      const bonusXP = score * XP_PER_CORRECT + (selected === question.answer ? XP_PER_CORRECT : 0)
      const finalScore = score + (selected === question.answer ? 1 : 0)
      const result: QuizResult = {
        score: finalScore,
        total: questions.length,
        bonusXP,
        completedAt: new Date().toISOString(),
      }
      saveQuizResult(lessonId, result)
      setDone(true)
    } else {
      setIdx((i) => i + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const finalScore = done ? score : 0
  const bonusXP    = done ? finalScore * XP_PER_CORRECT : 0

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(null) }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Quiz · {lessonTitle}</p>
            {!done && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Question {idx + 1} / {questions.length}</span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div key={i} className="h-1 w-6 rounded-full transition-colors"
                      style={{ background: i < idx ? "#7c3aed" : i === idx ? "#a78bfa" : "rgba(255,255,255,0.1)" }} />
                  ))}
                </div>
              </div>
            )}
            {done && <span className="text-sm font-semibold text-white">Quiz Complete!</span>}
          </div>
          <button onClick={() => onClose(null)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {!done ? (
          <div className="p-6">
            <p className="text-base sm:text-lg font-semibold text-white leading-snug mb-6">
              {question.q}
            </p>

            <div className="space-y-2.5">
              {question.options.map((opt, i) => {
                let bg = "rgba(255,255,255,0.03)"
                let border = "rgba(255,255,255,0.08)"
                let textColor = "#a1a1aa"
                if (answered) {
                  if (i === question.answer) {
                    bg = "rgba(34,197,94,0.08)"; border = "rgba(34,197,94,0.35)"; textColor = "#4ade80"
                  } else if (i === selected && selected !== question.answer) {
                    bg = "rgba(239,68,68,0.08)"; border = "rgba(239,68,68,0.35)"; textColor = "#f87171"
                  }
                } else if (selected === i) {
                  bg = "rgba(124,58,237,0.1)"; border = "rgba(124,58,237,0.4)"; textColor = "#c4b5fd"
                }

                return (
                  <button key={i} onClick={() => handleSelect(i)}
                    className="w-full text-left rounded-xl px-4 py-3 text-sm transition-all"
                    style={{ background: bg, border: `1px solid ${border}`, color: textColor }}>
                    <span className="font-mono text-xs mr-2 opacity-50">{["A","B","C","D"][i]}.</span>
                    {opt}
                    {answered && i === question.answer && (
                      <span className="float-right text-emerald-400">✓</span>
                    )}
                    {answered && i === selected && selected !== question.answer && (
                      <span className="float-right text-red-400">✗</span>
                    )}
                  </button>
                )
              })}
            </div>

            {answered && (
              <div className="mt-4 p-3 rounded-xl text-sm"
                style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)" }}>
                <p className="text-violet-300 leading-relaxed">{question.explanation}</p>
              </div>
            )}

            {answered && (
              <button onClick={handleNext}
                className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                {idx + 1 >= questions.length ? "See Results" : "Next Question →"}
              </button>
            )}
          </div>
        ) : (
          <ResultScreen
            score={finalScore}
            total={questions.length}
            bonusXP={bonusXP}
            onClose={() => {
              onClose({
                score: finalScore,
                total: questions.length,
                bonusXP,
                completedAt: new Date().toISOString(),
              })
            }}
            alreadyTaken={existing}
          />
        )}
      </div>
    </div>
  )
}

function ResultScreen({
  score, total, bonusXP, onClose, alreadyTaken,
}: {
  score: number; total: number; bonusXP: number; onClose: () => void; alreadyTaken: QuizResult | null
}) {
  const pct = Math.round((score / total) * 100)
  const grade = pct === 100 ? "Perfect!" : pct >= 67 ? "Great job!" : pct >= 34 ? "Good effort!" : "Keep going!"
  const color = pct === 100 ? "#4ade80" : pct >= 67 ? "#a78bfa" : pct >= 34 ? "#fbbf24" : "#f87171"

  return (
    <div className="p-6 text-center">
      <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-black"
        style={{ background: `${color}18`, border: `2px solid ${color}40`, color }}>
        {score}/{total}
      </div>
      <p className="text-xl font-bold text-white mb-1">{grade}</p>
      <p className="text-sm text-zinc-500 mb-5">You answered {score} of {total} correctly</p>

      {bonusXP > 0 && !alreadyTaken ? (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
          style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}>
          ⚡ +{bonusXP} Bonus XP earned
        </div>
      ) : alreadyTaken ? (
        <p className="text-xs text-zinc-600 mb-6">Quiz XP already awarded from previous attempt</p>
      ) : null}

      <button onClick={onClose}
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
        Done
      </button>
    </div>
  )
}
