"use client"
import { useState } from "react"
import type { Lesson } from "@/data/curriculum"

interface Props {
  lesson: Lesson
  onNext?: () => void
  onPrev?: () => void
}

export default function LessonPage({ lesson, onNext, onPrev }: Props) {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
          {lesson.category}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 leading-tight">
          {lesson.title}
        </h1>
        <div className="mt-3 h-1 w-16 bg-violet-600 rounded-full" />
      </div>

      {/* Sections */}
      <div className="space-y-6 sm:space-y-8">
        {lesson.content.map((section, i) => (
          <section key={i}>
            <h2 className="text-base sm:text-lg font-semibold text-violet-300 mb-2 sm:mb-3 flex items-start gap-2">
              <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              {section.heading}
            </h2>

            {section.body && (
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line mb-3">
                {section.body}
              </p>
            )}

            {section.code && <CodeBlock code={section.code} />}

            {section.note && (
              <div className="mt-3 flex gap-2 bg-amber-950/40 border border-amber-700/40 rounded-lg px-3 sm:px-4 py-3">
                <span className="text-amber-400 text-sm shrink-0">💡</span>
                <p className="text-amber-200 text-xs sm:text-sm leading-relaxed">{section.note}</p>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10 sm:mt-12 pt-6 border-t border-zinc-800 gap-3">
        <button
          onClick={onPrev}
          disabled={!onPrev}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-lg hover:bg-zinc-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        <button
          onClick={onNext}
          disabled={!onNext}
          className="flex items-center gap-1.5 text-sm bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </article>
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
    <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 mt-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-xs text-zinc-500 font-mono">Python</span>
        <button
          onClick={copy}
          className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400">Copied</span>
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
        <pre className="p-3 sm:p-4 text-xs sm:text-sm">
          <code className="text-green-300 font-mono leading-relaxed">{code}</code>
        </pre>
      </div>
    </div>
  )
}
