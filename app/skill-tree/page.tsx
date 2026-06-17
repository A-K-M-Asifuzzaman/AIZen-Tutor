"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Nav from "@/components/Nav"
import { getCompleted } from "@/lib/progress"

const TREE = [
  {
    id: "root",
    label: "ML Engineer",
    icon: "🏆",
    color: "#7c3aed",
    desc: "Master all skills to unlock",
    children: [
      {
        id: "python",
        label: "Python & Math",
        icon: "🐍",
        color: "#a78bfa",
        desc: "NumPy, Pandas, Statistics, Probability, Linear Algebra",
        category: "Python Basics",
        lessons: ["python-intro","python-data-structures","python-oop","numpy-basics","pandas-basics"],
        children: [
          {
            id: "ml",
            label: "Machine Learning",
            icon: "🤖",
            color: "#60a5fa",
            desc: "Supervised, Unsupervised, Evaluation, Feature Engineering",
            category: "Machine Learning",
            lessons: ["linear-regression","decision-trees","random-forests","svm","clustering"],
            children: [
              {
                id: "dl",
                label: "Deep Learning",
                icon: "🧠",
                color: "#34d399",
                desc: "Neural Nets, CNNs, RNNs, Transformers, PyTorch",
                category: "Deep Learning",
                lessons: ["neural-networks","cnn","rnn-lstm","transformers-arch"],
                children: [
                  {
                    id: "nlp",
                    label: "NLP",
                    icon: "💬",
                    color: "#22d3ee",
                    desc: "Text Processing, BERT, Fine-tuning, Sentiment Analysis",
                    category: "NLP",
                    lessons: ["text-preprocessing","word-embeddings","bert-intro","bert-fine-tuning"],
                    children: [
                      {
                        id: "llm",
                        label: "LLMs",
                        icon: "✨",
                        color: "#fbbf24",
                        desc: "GPT, Prompt Engineering, RLHF, LoRA, Function Calling",
                        category: "LLMs",
                        lessons: ["gpt-architecture","prompt-engineering","rlhf","lora","function-calling"],
                        children: [
                          {
                            id: "rag",
                            label: "RAG Systems",
                            icon: "🔍",
                            color: "#fb923c",
                            desc: "Vector DBs, FAISS, Hybrid Search, Reranking, Citations",
                            category: "RAG",
                            lessons: ["rag-intro","vector-databases","faiss","hybrid-search","rag-evaluation"],
                            children: [
                              {
                                id: "cv",
                                label: "Computer Vision",
                                icon: "👁️",
                                color: "#f472b6",
                                desc: "Image Classification, Object Detection, Segmentation",
                                category: "Computer Vision",
                                lessons: ["cv-intro","object-detection","image-segmentation"],
                                children: [],
                              },
                              {
                                id: "mlops",
                                label: "MLOps",
                                icon: "⚙️",
                                color: "#a78bfa",
                                desc: "Docker, CI/CD, MLflow, Model Monitoring, Drift Detection",
                                category: "MLOps",
                                lessons: ["mlops-intro","docker-ml","mlflow","model-monitoring","cicd-ml"],
                                children: [
                                  {
                                    id: "agents",
                                    label: "AI Agents",
                                    icon: "🤖",
                                    color: "#fb923c",
                                    desc: "ReAct, LangGraph, Tool Calling, Multi-Agent Systems",
                                    category: "Agents",
                                    lessons: ["agent-intro","react-pattern","langgraph","multi-agent"],
                                    children: [],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

interface NodeData {
  id: string
  label: string
  icon: string
  color: string
  desc: string
  category?: string
  lessons?: string[]
  children: NodeData[]
}

function flattenTree(node: NodeData, result: NodeData[] = []): NodeData[] {
  result.push(node)
  node.children.forEach((c) => flattenTree(c, result))
  return result
}

function SkillNode({ node, completed, depth = 0 }: { node: NodeData; completed: Set<string>; depth?: number }) {
  const [expanded, setExpanded] = useState(true)
  const lessonCount = node.lessons?.length ?? 0
  const doneCount   = node.lessons?.filter((l) => completed.has(l)).length ?? 0
  const pct         = lessonCount > 0 ? Math.round((doneCount / lessonCount) * 100) : 0
  const isDone      = lessonCount > 0 && doneCount === lessonCount
  const isRoot      = node.id === "root"

  return (
    <div className="relative">
      {/* Connector line from parent */}
      {depth > 0 && (
        <div className="absolute left-4 -top-4 w-px h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
      )}

      <div className="flex items-start gap-2">
        {/* Vertical child connector */}
        {node.children.length > 0 && expanded && (
          <div className="absolute left-4 top-10 bottom-0 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        )}

        <div className="flex-1">
          {/* Node card */}
          <div className={`relative rounded-xl p-3 sm:p-4 mb-2 transition-all ${isRoot ? "bg-gradient-to-r" : ""}`}
            style={{
              background: isRoot
                ? `linear-gradient(135deg,${node.color}20,${node.color}10)`
                : "var(--surface)",
              border: `1px solid ${isDone ? node.color + "40" : isRoot ? node.color + "30" : "rgba(255,255,255,0.07)"}`,
              marginLeft: depth === 0 ? 0 : `${Math.min(depth * 20, 40)}px`,
            }}>

            <div className="flex items-center gap-3">
              <div className="text-xl sm:text-2xl shrink-0">{node.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm font-bold text-white">{node.label}</span>
                  {isDone && <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: `${node.color}20`, color: node.color }}>COMPLETE</span>}
                  {lessonCount > 0 && !isDone && (
                    <span className="text-[10px] text-zinc-600">{doneCount}/{lessonCount} lessons</span>
                  )}
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed mt-0.5 hidden sm:block">{node.desc}</p>
              </div>

              {/* Progress ring for leaf nodes */}
              {lessonCount > 0 && (
                <div className="relative w-10 h-10 shrink-0">
                  <svg className="w-10 h-10 -rotate-90">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                    <circle cx="20" cy="20" r="16" fill="none"
                      stroke={node.color} strokeWidth="3"
                      strokeDasharray={`${2 * Math.PI * 16}`}
                      strokeDashoffset={`${2 * Math.PI * 16 * (1 - pct / 100)}`}
                      strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold" style={{ color: node.color }}>
                    {pct}%
                  </span>
                </div>
              )}

              {/* Progress bar for root */}
              {node.children.length > 0 && (
                <button onClick={() => setExpanded((v) => !v)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  <svg className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>

            {lessonCount > 0 && (
              <div className="mt-2.5 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: node.color }} />
              </div>
            )}

            {node.category && (
              <Link href={`/learn?category=${encodeURIComponent(node.category)}`}
                className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium transition-opacity hover:opacity-80"
                style={{ color: node.color }}>
                Start learning →
              </Link>
            )}
          </div>

          {/* Children */}
          {expanded && node.children.length > 0 && (
            <div className="relative pl-4 space-y-0">
              {node.children.map((child) => (
                <SkillNode key={child.id} node={child} completed={completed} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SkillTreePage() {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  useEffect(() => {
    const c = getCompleted()
    setCompleted(new Set(c))
  }, [])

  const allNodes     = flattenTree(TREE[0])
  const totalLessons = allNodes.filter((n) => (n.lessons?.length ?? 0) > 0).reduce((s, n) => s + (n.lessons?.length ?? 0), 0)
  const doneLessons  = allNodes.filter((n) => (n.lessons?.length ?? 0) > 0).reduce((s, n) => s + (n.lessons?.filter((l) => completed.has(l)).length ?? 0), 0)
  const overallPct   = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Nav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
            🌳 Skill Tree
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">ML Engineer Skill Tree</h1>
          <p className="text-zinc-500 text-sm max-w-xl">
            Every skill you need to become an ML Engineer. Complete lessons to unlock and progress through each node.
          </p>
        </div>

        {/* Overall progress */}
        <div className="rounded-2xl p-5 mb-8"
          style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-white">Overall Progress</p>
            <span className="text-2xl font-black" style={{ color: "#7c3aed" }}>{overallPct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${overallPct}%`, background: "linear-gradient(90deg,#7c3aed,#4f46e5)" }} />
          </div>
          <p className="text-xs text-zinc-600">{doneLessons} of {totalLessons} tracked lessons complete</p>
        </div>

        {/* Tree */}
        <div className="space-y-0">
          {TREE.map((node) => (
            <SkillNode key={node.id} node={node} completed={completed} depth={0} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/learn"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            Continue Learning — Earn XP →
          </Link>
        </div>
      </main>
    </div>
  )
}
