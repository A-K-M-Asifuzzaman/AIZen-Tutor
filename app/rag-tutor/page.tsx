"use client"
import { useState, useRef, useCallback } from "react"
import Nav from "@/components/Nav"

interface Message { role: "user" | "assistant"; content: string }

function chunkText(text: string, size = 1500, overlap = 200): string[] {
  const chunks: string[] = []
  let i = 0
  while (i < text.length) {
    chunks.push(text.slice(i, i + size))
    i += size - overlap
  }
  return chunks
}

function retrieveChunks(chunks: string[], query: string, k = 5): string[] {
  const qWords = new Set(query.toLowerCase().split(/\W+/).filter(Boolean))
  const scored = chunks.map((c) => {
    const cWords = c.toLowerCase().split(/\W+/)
    const hits = cWords.filter((w) => qWords.has(w)).length
    return { c, score: hits }
  })
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.c)
}

export default function RagTutorPage() {
  const [docText, setDocText]         = useState("")
  const [fileName, setFileName]       = useState("")
  const [chunks, setChunks]           = useState<string[]>([])
  const [messages, setMessages]       = useState<Message[]>([])
  const [input, setInput]             = useState("")
  const [loading, setLoading]         = useState(false)
  const [indexed, setIndexed]         = useState(false)
  const [tab, setTab]                 = useState<"upload" | "paste">("upload")
  const fileRef                       = useRef<HTMLInputElement>(null)
  const bottomRef                     = useRef<HTMLDivElement>(null)

  const handleFile = useCallback((file: File) => {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = (e.target?.result as string) ?? ""
      setDocText(text)
      setIndexed(false)
      setChunks([])
      setMessages([])
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleIndex = () => {
    if (!docText.trim()) return
    const c = chunkText(docText)
    setChunks(c)
    setIndexed(true)
    setMessages([{
      role: "assistant",
      content: `Document indexed! Created ${c.length} chunks from ${docText.length.toLocaleString()} characters. Ask me anything about your document.`,
    }])
  }

  const handleSend = async () => {
    if (!input.trim() || !indexed || loading) return
    const userMsg = input.trim()
    setInput("")
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    const relevant = retrieveChunks(chunks, userMsg)
    const context  = relevant.join("\n\n---\n\n")

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMsg }],
          lessonTitle: "Document Q&A",
          lessonCategory: "RAG",
          systemOverride: `You are a document Q&A assistant. Answer questions ONLY based on the provided document context. If the answer isn't in the context, say "I couldn't find that in the document."\n\nDocument Context:\n${context}`,
        }),
      })

      if (!res.ok || !res.body) throw new Error("API error")

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ""
      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: "assistant", content: assistantText }
          return updated
        })
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, there was an error. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Nav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}>
            🤖 RAG Tutor
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Document Q&A</h1>
          <p className="text-zinc-500 text-sm max-w-xl">
            Upload a text file or paste your notes, research papers, or study material. Then ask anything — powered by retrieval-augmented generation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left: Document input */}
          <div className="space-y-4">
            <div className="flex rounded-xl overflow-hidden p-0.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {(["upload","paste"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className="flex-1 py-2 text-xs font-medium rounded-lg transition-all"
                  style={tab === t
                    ? { background: "rgba(124,58,237,0.2)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)" }
                    : { color: "#71717a" }}>
                  {t === "upload" ? "📁 Upload File" : "📋 Paste Text"}
                </button>
              ))}
            </div>

            {tab === "upload" ? (
              <div
                className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors"
                style={{ borderColor: "rgba(124,58,237,0.25)", background: "rgba(124,58,237,0.03)" }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" accept=".txt,.md,.csv,.json,.py,.js,.ts"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                <div className="text-4xl mb-3">{fileName ? "📄" : "📁"}</div>
                {fileName
                  ? <p className="text-sm font-medium text-violet-400">{fileName}</p>
                  : <>
                    <p className="text-sm text-zinc-400 font-medium mb-1">Drop your file here</p>
                    <p className="text-xs text-zinc-600">.txt · .md · .csv · .json · .py · .js · .ts</p>
                  </>
                }
              </div>
            ) : (
              <textarea
                className="w-full h-48 text-xs text-zinc-300 placeholder-zinc-600 rounded-xl resize-none p-3.5 outline-none focus:ring-1"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                placeholder="Paste your notes, research paper, or any text here..."
                value={docText}
                onChange={(e) => { setDocText(e.target.value); setIndexed(false) }}
              />
            )}

            {docText && (
              <div className="text-xs text-zinc-600">
                {docText.length.toLocaleString()} characters · ~{Math.ceil(docText.split(/\s+/).length / 200)} min read
              </div>
            )}

            <button
              onClick={handleIndex}
              disabled={!docText.trim()}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-40"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              {indexed ? "✅ Indexed — Re-index" : "⚡ Index Document"}
            </button>

            {indexed && (
              <div className="p-3 rounded-xl text-xs"
                style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}>
                ✅ {chunks.length} chunks indexed · Ready to answer questions
              </div>
            )}

            {/* How it works */}
            <div className="rounded-xl p-4 space-y-2.5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">How it works</p>
              {[
                ["1️⃣", "Your document is chunked into overlapping segments"],
                ["2️⃣", "Your question is matched to the most relevant chunks"],
                ["3️⃣", "Retrieved chunks + question are sent to Groq Llama 3"],
                ["4️⃣", "Answer is grounded in your document — not hallucinated"],
              ].map(([num, text]) => (
                <div key={num} className="flex items-start gap-2 text-xs text-zinc-500">
                  <span className="shrink-0">{num}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Chat */}
          <div className="flex flex-col rounded-2xl overflow-hidden"
            style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)", minHeight: "480px" }}>
            <div className="px-4 py-3 border-b flex items-center gap-2"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: indexed ? "#34d399" : "#52525b" }} />
              <span className="text-xs text-zinc-500 font-medium">
                {indexed ? "Document loaded — ask anything" : "Index a document to start"}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "380px" }}>
              {messages.length === 0 && (
                <div className="text-center py-12 text-zinc-600 text-sm">
                  <div className="text-4xl mb-3">📄</div>
                  <p>Upload a document and ask questions like:</p>
                  <div className="mt-3 space-y-1.5">
                    {["What is the main topic?","Summarize the key points","Explain the methodology","What conclusions were drawn?"].map((s) => (
                      <button key={s} onClick={() => setInput(s)}
                        className="block mx-auto text-xs px-3 py-1.5 rounded-full transition-colors text-zinc-500 hover:text-zinc-300"
                        style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "text-white"
                      : "text-zinc-300"
                    }`}
                    style={m.role === "user"
                      ? { background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }
                      : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {m.content || (loading && i === messages.length - 1
                      ? <span className="text-zinc-500">Thinking...</span>
                      : "")}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="px-3 pb-3 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  disabled={!indexed}
                  placeholder={indexed ? "Ask about your document..." : "Index a document first"}
                  className="flex-1 text-xs text-zinc-300 placeholder-zinc-600 rounded-lg px-3 py-2 outline-none disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!indexed || !input.trim() || loading}
                  className="px-3 py-2 rounded-lg text-white text-xs font-medium disabled:opacity-40 transition-opacity hover:opacity-80"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                  {loading ? "..." : "→"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
