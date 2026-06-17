import Nav from "@/components/Nav"
import Link from "next/link"

const SKILLS = [
  { name: "Python",            icon: "🐍", level: 95 },
  { name: "Machine Learning",  icon: "🤖", level: 90 },
  { name: "Deep Learning",     icon: "🧠", level: 85 },
  { name: "NLP & Transformers",icon: "💬", level: 88 },
  { name: "LLMs & RAG",        icon: "🔍", level: 82 },
  { name: "PyTorch",           icon: "🔥", level: 85 },
  { name: "FastAPI",           icon: "⚡", level: 80 },
  { name: "MLOps & Docker",    icon: "🐳", level: 75 },
]

const PROJECTS = [
  { name: "AIZen Tutor",  desc: "Gamified AI/ML learning platform with RAG, quizzes, and AI tutor", tag: "This Platform" },
  { name: "RAG Chatbot",  desc: "PDF Q&A system with hybrid BM25 + dense retrieval and streaming", tag: "LLM" },
  { name: "Sentiment API","desc": "DistilBERT fine-tuned on SST-2 with INT8 quantization, FastAPI", tag: "NLP" },
]

const INTERESTS = [
  "Large Language Models & Alignment",
  "Retrieval-Augmented Generation",
  "NLP & Computational Linguistics",
  "ML Systems & MLOps",
  "AI for Education",
  "Open-Source Contributions",
]

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Nav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* Hero */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
          <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-white"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            AZ
          </div>
          <div className="text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1.5"
                style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Open to Opportunities
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">ML Engineer & NLP Enthusiast</h1>
            <p className="text-zinc-500 text-sm mb-3">BSc Computer Science · AI Research · Building impactful AI products</p>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
              Passionate about NLP, large language models, and retrieval systems. I build AI tools that make complex topics
              accessible — starting with this platform. Currently focused on RAG systems, fine-tuning, and agent frameworks.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-4 justify-center sm:justify-start">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg font-medium transition-colors text-zinc-400 hover:text-white"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg font-medium transition-colors text-zinc-400 hover:text-white"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
              <Link href="/learn"
                className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                ⚡ Try AIZen Tutor
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

          {/* Skills */}
          <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">🛠️ Technical Skills</h2>
            <div className="space-y-3">
              {SKILLS.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <span>{s.icon}</span>{s.name}
                    </span>
                    <span className="text-zinc-600">{s.level}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${s.level}%`, background: "linear-gradient(90deg,#7c3aed,#4f46e5)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Identity cards */}
          <div className="space-y-3">
            {[
              { icon: "🎓", title: "Education", desc: "BSc Computer Science — Currently pursuing advanced ML/AI specialization" },
              { icon: "🔬", title: "Research Interests", list: INTERESTS.slice(0, 4) },
              { icon: "🏆", title: "Competitive Programming", desc: "Active on LeetCode and Codeforces — 300+ problems solved. Focus on dynamic programming, graphs, and optimization." },
            ].map((card) => (
              <div key={card.title} className="rounded-xl p-4"
                style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <span>{card.icon}</span>{card.title}
                </p>
                {card.desc && <p className="text-xs text-zinc-500 leading-relaxed">{card.desc}</p>}
                {card.list && (
                  <ul className="space-y-1">
                    {card.list.map((item) => (
                      <li key={item} className="text-xs text-zinc-500 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full shrink-0 bg-violet-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Featured projects */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">🏗️ Featured Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PROJECTS.map((p) => (
              <div key={p.name} className="rounded-xl p-3.5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-bold text-white">{p.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>{p.tag}</span>
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">💡 Research Interests</h2>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full text-zinc-400"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {i}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
