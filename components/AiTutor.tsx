"use client"
import { useState, useRef, useEffect, useCallback } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Props {
  lessonTitle: string
  lessonCategory: string
  onClose: () => void
}

export default function AiTutor({ lessonTitle, lessonCategory, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm your AI tutor for **${lessonTitle}**. Ask me anything about this lesson — concepts, code, or real-world examples.`,
    },
  ])
  const [input, setInput]         = useState("")
  const [loading, setLoading]     = useState(false)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: "user", content: text.trim() }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput("")
    setLoading(true)

    const assistantMsg: Message = { role: "assistant", content: "" }
    setMessages((prev) => [...prev, assistantMsg])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          lessonTitle,
          lessonCategory,
        }),
      })

      if (!res.ok) throw new Error("API error")

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let full = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: "assistant", content: full }
          return updated
        })
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, I couldn't connect to the AI tutor. Please check that GROQ_API_KEY is set and try again.",
        }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }, [messages, loading, lessonTitle, lessonCategory])

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  const suggestions = [
    "Explain this in simple terms",
    "Give me a Python example",
    "What's the real-world use case?",
    "What are common mistakes?",
  ]

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--surface)", borderLeft: "1px solid var(--border)" }}>

      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>✨</div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white leading-none">AI Tutor</p>
            <p className="text-[10px] text-zinc-600 truncate mt-0.5">{lessonTitle}</p>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}>
            Groq
          </span>
        </div>
        <button onClick={onClose}
          className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
          style={{ background: "rgba(255,255,255,0.05)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
                msg.role === "user" ? "text-white" : "text-zinc-300"
              }`}
              style={msg.role === "user"
                ? { background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }
                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }
              }>
              <MarkdownMessage content={msg.content} />
              {msg.role === "assistant" && msg.content === "" && loading && (
                <span className="inline-flex gap-1 items-center">
                  <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions (only on first turn) */}
      {messages.length === 1 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)}
              className="text-[10px] px-2.5 py-1 rounded-full text-zinc-400 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 px-3 pb-3 pt-1">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about this lesson..."
            disabled={loading}
            className="flex-1 bg-transparent text-xs text-white placeholder-zinc-700 focus:outline-none disabled:opacity-50"
          />
          <button onClick={() => send(input)} disabled={!input.trim() || loading}
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-opacity disabled:opacity-30"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-zinc-700 text-center mt-1.5">Enter to send · Powered by Groq + Llama 3.3 70B</p>
      </div>
    </div>
  )
}

function MarkdownMessage({ content }: { content: string }) {
  if (!content) return null

  // Simple markdown: code blocks, inline code, bold
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g)

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const code = part.slice(3, -3).replace(/^[a-z]+\n/, "")
          return (
            <pre key={i} className="mt-2 mb-1 rounded-lg p-2.5 text-[10px] font-mono overflow-x-auto leading-relaxed"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.07)", color: "#c4b5fd" }}>
              {code.trim()}
            </pre>
          )
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="px-1 py-0.5 rounded text-[10px] font-mono"
              style={{ background: "rgba(124,58,237,0.2)", color: "#c4b5fd" }}>
              {part.slice(1, -1)}
            </code>
          )
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
        }
        // Split on newlines and render
        return part.split("\n").map((line, j) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < part.split("\n").length - 1 && <br />}
          </span>
        ))
      })}
    </>
  )
}
