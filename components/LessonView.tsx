"use client"
import { useState } from "react"
import type { Lesson } from "@/data/curriculum"

interface Props {
  lesson: Lesson
  isCompleted: boolean
  onComplete: () => void
  onPrev?: () => void
  onNext?: () => void
}

const DIFFICULTY: Record<string, { label: string; color: string; bg: string }> = {
  "Machine Learning":   { label: "Beginner",     color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  "Deep Learning":      { label: "Intermediate",  color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  "NLP & Transformers": { label: "Intermediate",  color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  "LLMs & Prompting":   { label: "Intermediate",  color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  "RAG Systems":        { label: "Advanced",      color: "#fb923c", bg: "rgba(251,146,60,0.1)" },
  "Computer Vision":    { label: "Intermediate",  color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  "MLOps":              { label: "Advanced",      color: "#fb923c", bg: "rgba(251,146,60,0.1)" },
  "Interview Prep":     { label: "Expert",        color: "#ec4899", bg: "rgba(236,72,153,0.1)" },
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

const READ_TIME: Record<string, string> = {
  "Machine Learning":   "8 min",
  "Deep Learning":      "12 min",
  "NLP & Transformers": "10 min",
  "LLMs & Prompting":   "10 min",
  "RAG Systems":        "12 min",
  "Computer Vision":    "10 min",
  "MLOps":              "10 min",
  "Interview Prep":     "15 min",
}

export default function LessonView({ lesson, isCompleted, onComplete, onPrev, onNext }: Props) {
  const diff     = DIFFICULTY[lesson.category] ?? { label: "Intermediate", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" }
  const readTime = READ_TIME[lesson.category] ?? "10 min"
  const catColor = CAT_COLOR[lesson.category] ?? "#a78bfa"

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 fade-up">

      {/* Lesson header */}
      <div className="mb-7 sm:mb-9">
        {/* Meta tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: `${catColor}18`, border: `1px solid ${catColor}40`, color: catColor }}>
            {lesson.category}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: diff.bg, border: `1px solid ${diff.color}40`, color: diff.color }}>
            {diff.label}
          </span>
          <span className="text-xs text-zinc-600 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime} read
          </span>
          <span className="ml-auto text-xs font-black flex items-center gap-1"
            style={{ color: catColor, textShadow: `0 0 12px ${catColor}60` }}>
            ⚡ +100 XP
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-5">
          {lesson.title}
        </h1>

        {/* Complete button */}
        {isCompleted ? (
          <div className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399" }}>
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
              style={{ boxShadow: "0 0 10px rgba(52,211,153,0.5)" }}>
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            Completed · +100 XP earned
          </div>
        ) : (
          <button onClick={onComplete}
            className="inline-flex items-center gap-2 text-sm font-black text-white px-6 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg,#059669,#10b981)",
              boxShadow: "0 0 25px rgba(16,185,129,0.4), 0 0 50px rgba(16,185,129,0.15)",
            }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Mark as Complete · +100 XP
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px mb-7 sm:mb-10"
        style={{ background: `linear-gradient(90deg, ${catColor}50, rgba(255,255,255,0.04), transparent)` }} />

      {/* Sections */}
      <div className="space-y-9 sm:space-y-12">
        {lesson.content.map((section, i) => (
          <section key={i} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            {/* Section heading */}
            <div className="flex items-start gap-3 mb-3">
              <div className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black mt-0.5"
                style={{
                  background: `linear-gradient(135deg, ${catColor}25, ${catColor}10)`,
                  border: `1px solid ${catColor}35`,
                  color: catColor,
                  boxShadow: `0 0 8px ${catColor}20`,
                }}>
                {i + 1}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug">{section.heading}</h2>
            </div>

            {section.body && (
              <div className="ml-9">
                <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{section.body}</p>
              </div>
            )}

            {section.code && (
              <div className="ml-0 sm:ml-9 mt-3">
                <CodeBlock code={section.code} catColor={catColor} />
              </div>
            )}

            {section.note && (
              <div className="ml-0 sm:ml-9 mt-3 flex gap-3 rounded-xl p-3 sm:p-4"
                style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}>
                <span className="text-amber-400 shrink-0 text-sm">💡</span>
                <p className="text-amber-200/80 text-xs sm:text-sm leading-relaxed">{section.note}</p>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      {!isCompleted && (
        <div className="mt-12 p-5 sm:p-6 rounded-xl text-center relative overflow-hidden"
          style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.18)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.08) 0%, transparent 70%)" }} />
          <p className="relative text-sm text-zinc-400 mb-3">Finished this lesson? Mark it complete to earn your XP.</p>
          <button onClick={onComplete}
            className="relative inline-flex items-center gap-2 text-sm font-black text-white px-7 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg,#059669,#10b981)", boxShadow: "0 0 20px rgba(16,185,129,0.35)" }}>
            ⚡ Complete &amp; Earn 100 XP
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-10 sm:mt-12 pt-6 gap-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onPrev} disabled={!onPrev}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all hover:-translate-x-0.5 disabled:opacity-25 disabled:cursor-not-allowed"
          style={{ color: "#a1a1aa", border: "1px solid rgba(255,255,255,0.07)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        <button onClick={onNext} disabled={!onNext}
          className="flex items-center gap-2 text-sm font-black text-white px-6 py-2.5 rounded-xl transition-all hover:translate-x-0.5 disabled:opacity-25 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(135deg, ${catColor}cc, ${catColor}88)`,
            boxShadow: `0 0 20px ${catColor}40`,
          }}>
          <span className="hidden sm:inline">Next Lesson</span>
          <span className="sm:hidden">Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function CodeBlock({ code, catColor }: { code: string; catColor: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl overflow-hidden"
      style={{
        background: "#04040a",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: `0 0 0 1px ${catColor}18`,
      }}>
      {/* Neon gradient top line */}
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${catColor}, #22d3ee, #ec4899)` }} />
      {/* Chrome bar */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#28ca41" }} />
        </div>
        <span className="text-xs font-mono font-medium" style={{ color: "#3a3a5a" }}>Python</span>
        <button onClick={copy}
          className="flex items-center gap-1.5 text-xs transition-all px-2 py-1 rounded"
          style={{
            color: copied ? "#34d399" : "#4a4a6a",
            background: copied ? "rgba(52,211,153,0.1)" : "transparent",
          }}>
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
      </div>
      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono leading-relaxed">
          <CodeHighlight code={code} />
        </pre>
      </div>
    </div>
  )
}

function CodeHighlight({ code }: { code: string }) {
  const tokens = tokenize(code)
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} style={{ color: TOKEN_COLORS[t.type] ?? "#e2e8f0" }}>{t.text}</span>
      ))}
    </>
  )
}

type TokenType = "keyword" | "string" | "comment" | "number" | "decorator" | "builtin" | "plain"
interface Token { text: string; type: TokenType }

const KEYWORDS = new Set([
  "import","from","as","def","class","return","if","else","elif","for","while",
  "in","not","and","or","is","True","False","None","with","try","except","raise",
  "lambda","yield","async","await","pass","break","continue","super","self",
  "print","type","assert"
])
const BUILTINS = new Set([
  "str","int","float","list","dict","set","tuple","len","range","enumerate",
  "zip","map","filter","sorted","reversed","min","max","sum","abs","round",
  "isinstance","type","hasattr","getattr","setattr"
])

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword:   "#c084fc",
  string:    "#86efac",
  comment:   "#3a3a5a",
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
    } else if (code.slice(i, i+3) === '"""' || code.slice(i, i+3) === "'''") {
      const q = code.slice(i, i+3)
      const end = code.indexOf(q, i+3)
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
      const text = code.slice(i, j + 1)
      tokens.push({ text, type: "string" })
      i = j + 1
    } else if (code[i] === "@") {
      let j = i + 1
      while (j < code.length && /[\w.]/.test(code[j])) j++
      tokens.push({ text: code.slice(i, j), type: "decorator" })
      i = j
    } else if (/\d/.test(code[i]) || (code[i] === "." && /\d/.test(code[i+1] ?? ""))) {
      let j = i
      while (j < code.length && /[\d.eE+\-_]/.test(code[j])) j++
      tokens.push({ text: code.slice(i, j), type: "number" })
      i = j
    } else if (/[a-zA-Z_]/.test(code[i])) {
      let j = i
      while (j < code.length && /\w/.test(code[j])) j++
      const word = code.slice(i, j)
      const type: TokenType = KEYWORDS.has(word) ? "keyword" : BUILTINS.has(word) ? "builtin" : "plain"
      tokens.push({ text: word, type })
      i = j
    } else {
      tokens.push({ text: code[i], type: "plain" })
      i++
    }
  }
  return tokens
}
