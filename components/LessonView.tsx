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

const DIFFICULTY: Record<string, { label: string; color: string }> = {
  "Machine Learning":   { label: "Beginner",    color: "#34d399" },
  "Deep Learning":      { label: "Intermediate", color: "#fbbf24" },
  "NLP & Transformers": { label: "Intermediate", color: "#fbbf24" },
  "LLMs & Prompting":   { label: "Intermediate", color: "#fbbf24" },
  "RAG Systems":        { label: "Advanced",     color: "#fb923c" },
  "Computer Vision":    { label: "Intermediate", color: "#fbbf24" },
  "MLOps":              { label: "Advanced",     color: "#fb923c" },
  "Interview Prep":     { label: "Expert",       color: "#f472b6" },
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
  const diff     = DIFFICULTY[lesson.category] ?? { label: "Intermediate", color: "#fbbf24" }
  const readTime = READ_TIME[lesson.category] ?? "10 min"

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">

      {/* Header */}
      <div className="mb-7 sm:mb-9">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
            {lesson.category}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: `${diff.color}12`, border: `1px solid ${diff.color}30`, color: diff.color }}>
            {diff.label}
          </span>
          <span className="text-xs text-zinc-600 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime} read
          </span>
          <span className="ml-auto text-xs font-semibold text-violet-400">⚡ +100 XP</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-5">
          {lesson.title}
        </h1>

        {isCompleted ? (
          <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            Completed · +100 XP earned
          </div>
        ) : (
          <button onClick={onComplete}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Mark as Complete · +100 XP
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px mb-7 sm:mb-10" style={{ background: "var(--border)" }} />

      {/* Sections */}
      <div className="space-y-9 sm:space-y-11">
        {lesson.content.map((section, i) => (
          <div key={i}>
            <div className="flex items-start gap-3 mb-3">
              <div className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.18)", color: "#a78bfa" }}>
                {i + 1}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug">{section.heading}</h2>
            </div>

            {section.body && (
              <p className="ml-9 text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{section.body}</p>
            )}

            {section.code && (
              <div className="ml-0 sm:ml-9 mt-3">
                <CodeBlock code={section.code} />
              </div>
            )}

            {section.note && (
              <div className="ml-0 sm:ml-9 mt-3 flex gap-3 rounded-xl p-3 sm:p-4"
                style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}>
                <span className="text-amber-500 shrink-0 text-sm">💡</span>
                <p className="text-amber-200/70 text-xs sm:text-sm leading-relaxed">{section.note}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      {!isCompleted && (
        <div className="mt-12 p-5 rounded-xl text-center"
          style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)" }}>
          <p className="text-sm text-zinc-500 mb-3">Finished reading? Mark it complete to earn your XP.</p>
          <button onClick={onComplete}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-2.5 rounded-lg transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>
            ⚡ Complete &amp; Earn 100 XP
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-10 pt-6 gap-3"
        style={{ borderTop: "1px solid var(--border)" }}>
        <button onClick={onPrev} disabled={!onPrev}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-all hover:-translate-x-0.5 disabled:opacity-25 disabled:cursor-not-allowed"
          style={{ color: "#a1a1aa", border: "1px solid rgba(255,255,255,0.07)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        <button onClick={onNext} disabled={!onNext}
          className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-all hover:translate-x-0.5 disabled:opacity-25 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
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

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: "#03030a", border: "1px solid rgba(255,255,255,0.07)" }}>
      {/* Chrome */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28ca41" }} />
        </div>
        <span className="text-xs font-mono" style={{ color: "#3a3a5a" }}>Python</span>
        <button onClick={copy}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: copied ? "#34d399" : "#4a4a6a" }}>
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
      tokens.push({ text: code.slice(i, j + 1), type: "string" })
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
      tokens.push({ text: word, type: KEYWORDS.has(word) ? "keyword" : BUILTINS.has(word) ? "builtin" : "plain" })
      i = j
    } else {
      tokens.push({ text: code[i], type: "plain" })
      i++
    }
  }
  return tokens
}
