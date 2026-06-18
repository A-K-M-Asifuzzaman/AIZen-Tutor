"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LESSONS, CATEGORIES } from "@/data/curriculum"
import { getCompleted, getCategoryProgress } from "@/lib/progress"
import Nav from "@/components/Nav"

const NODES = [
  
  {
    id: "python",
    label: "Python & Math",
    icon: "🐍",
    desc: "NumPy, Pandas, Linear Algebra, Statistics, Probability",
    color: "#34d399",
    category: null,
    free: true,
  },
  {
    id: "ml",
    label: "Machine Learning",
    icon: "🤖",
    desc: "Supervised, Unsupervised, Feature Engineering, Model Evaluation",
    color: "#a78bfa",
    category: "Machine Learning",
  },
  {
    id: "dl",
    label: "Deep Learning",
    icon: "🧠",
    desc: "Neural Networks, CNNs, RNNs, LSTMs, GANs, Diffusion",
    color: "#60a5fa",
    category: "Deep Learning",
  },
  {
    id: "nlp",
    label: "NLP & Transformers",
    icon: "💬",
    desc: "Tokenization, Attention, BERT, GPT, Fine-tuning, LoRA",
    color: "#22d3ee",
    category: "NLP & Transformers",
  },
  {
    id: "llm",
    label: "LLMs & Prompting",
    icon: "✨",
    desc: "Prompt Engineering, RLHF, Tool Use, AI Agents, LangChain",
    color: "#34d399",
    category: "LLMs & Prompting",
  },
  {
    id: "rag",
    label: "RAG Systems",
    icon: "🔍",
    desc: "Vector DBs, Embeddings, Reranking, Hybrid Search, Agentic RAG",
    color: "#fbbf24",
    category: "RAG Systems",
  },
  {
    id: "cv",
    label: "Computer Vision",
    icon: "👁️",
    desc: "CNNs, YOLO, ViT, Segmentation, Transfer Learning",
    color: "#f472b6",
    category: "Computer Vision",
  },
  {
    id: "mlops",
    label: "MLOps",
    icon: "🚀",
    desc: "Model Serving, Docker, CI/CD, Monitoring, Feature Stores",
    color: "#fb923c",
    category: "MLOps",
  },
  {
    id: "interview",
    label: "Interview Prep",
    icon: "🎤",
    desc: "ML System Design, FAANG Q&A, Mock Interviews, Case Studies",
    color: "#f87171",
    category: "Interview Prep",
  },
]

// LLM and RAG are parallel, CV branches off DL
const EDGES = [
  ["python", "ml"],
  ["ml", "dl"],
  ["dl", "nlp"],
  ["dl", "cv"],
  ["nlp", "llm"],
  ["llm", "rag"],
  ["rag", "mlops"],
  ["cv", "mlops"],
  ["mlops", "interview"],
]

export default function RoadmapPage() {
  const [completed, setCompleted] = useState<string[]>([])
  const [mounted, setMounted]     = useState(false)
  const [hovered, setHovered]     = useState<string | null>(null)

  useEffect(() => {
    setCompleted(getCompleted())
    setMounted(true)
  }, [])

  function getNodeProgress(node: typeof NODES[0]) {
    if (!node.category) return node.free ? 100 : 0
    const { pct } = getCategoryProgress(node.category, completed, LESSONS)
    return pct
  }

  function getNodeStatus(node: typeof NODES[0]) {
    const pct = getNodeProgress(node)
    if (pct === 100) return "done"
    if (pct > 0)     return "active"
    return "locked"
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      <Nav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">AI/ML Learning Roadmap</h1>
          <p className="text-sm text-zinc-500">Your complete path from Python to production ML Engineering</p>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mb-10 text-xs text-zinc-500">
          {[
            { color: "#4ade80", label: "Completed" },
            { color: "#a78bfa", label: "In Progress" },
            { color: "rgba(255,255,255,0.1)", label: "Not Started" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
              <span>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Roadmap flow */}
        <div className="flex flex-col items-center gap-0">
          {/* Python */}
          <RoadmapNode node={NODES[0]} pct={100} status="done" hovered={hovered} setHovered={setHovered} />
          <Connector />

          {/* ML */}
          <RoadmapNode node={NODES[1]} pct={getNodeProgress(NODES[1])} status={getNodeStatus(NODES[1])} hovered={hovered} setHovered={setHovered} />
          <Connector />

          {/* DL */}
          <RoadmapNode node={NODES[2]} pct={getNodeProgress(NODES[2])} status={getNodeStatus(NODES[2])} hovered={hovered} setHovered={setHovered} />

          {/* Branch: NLP + CV in parallel */}
          <div className="flex items-start gap-0 w-full max-w-lg">
            <div className="flex-1 flex flex-col items-center">
              <Connector />
              <RoadmapNode node={NODES[3]} pct={getNodeProgress(NODES[3])} status={getNodeStatus(NODES[3])} hovered={hovered} setHovered={setHovered} compact />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <Connector />
              <RoadmapNode node={NODES[6]} pct={getNodeProgress(NODES[6])} status={getNodeStatus(NODES[6])} hovered={hovered} setHovered={setHovered} compact />
            </div>
          </div>

          {/* NLP leads to LLMs */}
          <div className="flex items-start gap-0 w-full max-w-lg">
            <div className="flex-1 flex flex-col items-center">
              <Connector />
              <RoadmapNode node={NODES[4]} pct={getNodeProgress(NODES[4])} status={getNodeStatus(NODES[4])} hovered={hovered} setHovered={setHovered} compact />
              <Connector />
              <RoadmapNode node={NODES[5]} pct={getNodeProgress(NODES[5])} status={getNodeStatus(NODES[5])} hovered={hovered} setHovered={setHovered} compact />
            </div>
            <div className="flex-1 flex flex-col items-center mt-6">
              {/* spacer so the two columns align at MLOps */}
              <div className="flex-1" />
            </div>
          </div>

          <Connector />

          {/* MLOps */}
          <RoadmapNode node={NODES[7]} pct={getNodeProgress(NODES[7])} status={getNodeStatus(NODES[7])} hovered={hovered} setHovered={setHovered} />
          <Connector />

          {/* Interview */}
          <RoadmapNode node={NODES[8]} pct={getNodeProgress(NODES[8])} status={getNodeStatus(NODES[8])} hovered={hovered} setHovered={setHovered} />
        </div>

        {/* Progress summary */}
        {mounted && (
          <div className="mt-12 rounded-xl p-5 sm:p-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h2 className="text-sm font-bold text-white mb-4">Your Progress</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const { done, total, pct } = getCategoryProgress(cat, completed, LESSONS)
                const color = NODES.find((n) => n.category === cat)?.color ?? "#a78bfa"
                return (
                  <Link key={cat} href="/learn"
                    className="rounded-lg p-3 transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <span className="text-zinc-400 font-medium truncate">{cat.split(" ")[0]}</span>
                      <span className="font-bold shrink-0 ml-1" style={{ color }}>{pct}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <p className="text-xs text-zinc-700 mt-1.5">{done}/{total} lessons</p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function Connector() {
  return (
    <div className="flex flex-col items-center gap-0.5 py-1">
      <div className="w-px h-4" style={{ background: "rgba(124,58,237,0.3)" }} />
      <svg width="12" height="7" viewBox="0 0 12 7">
        <path d="M6 7L0 0h12z" fill="rgba(124,58,237,0.4)" />
      </svg>
    </div>
  )
}

function RoadmapNode({
  node, pct, status, hovered, setHovered, compact = false,
}: {
  node: typeof NODES[0]
  pct: number
  status: "done" | "active" | "locked"
  hovered: string | null
  setHovered: (id: string | null) => void
  compact?: boolean
}) {
  const isHovered = hovered === node.id
  const link = node.category ? `/learn` : null

  const borderColor = status === "done"
    ? "rgba(74,222,128,0.35)"
    : status === "active"
      ? `${node.color}55`
      : "rgba(255,255,255,0.07)"

  const bg = status === "done"
    ? "rgba(74,222,128,0.06)"
    : status === "active"
      ? `${node.color}0d`
      : "rgba(255,255,255,0.02)"

  const inner = (
    <div
      onMouseEnter={() => setHovered(node.id)}
      onMouseLeave={() => setHovered(null)}
      className={`rounded-xl transition-all duration-200 cursor-pointer ${compact ? "p-3.5 w-full max-w-[180px]" : "p-4 sm:p-5 w-full max-w-sm"}`}
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        transform: isHovered ? "scale(1.03)" : "scale(1)",
        opacity: status === "locked" ? 0.6 : 1,
      }}>
      <div className="flex items-center gap-2.5 mb-2">
        <span className={compact ? "text-lg" : "text-2xl"}>{node.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-white leading-tight ${compact ? "text-xs" : "text-sm sm:text-base"}`}>
            {node.label}
          </p>
          {status !== "locked" && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: status === "done" ? "#4ade80" : node.color }} />
              </div>
              <span className="text-[10px] font-semibold shrink-0"
                style={{ color: status === "done" ? "#4ade80" : node.color }}>
                {pct}%
              </span>
            </div>
          )}
        </div>
        {status === "done" && (
          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(74,222,128,0.2)", border: "1px solid rgba(74,222,128,0.35)" }}>
            <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      {!compact && (
        <p className="text-xs text-zinc-600 leading-relaxed">{node.desc}</p>
      )}
    </div>
  )

  if (link) {
    return <Link href={link} className={`w-full flex justify-center ${compact ? "" : ""}`}>{inner}</Link>
  }
  return <div className="w-full flex justify-center">{inner}</div>
}
