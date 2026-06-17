"use client"
import Link from "next/link"
import { LESSONS, CATEGORIES } from "@/data/curriculum"

const FEATURES = [
  { icon: "🧠", title: "62 In-Depth Lessons",    desc: "From linear regression to diffusion models — every concept explained with code.", color: "#8b5cf6", glow: "rgba(139,92,246,0.22)" },
  { icon: "⚡", title: "XP & Level System",       desc: "Earn 100 XP per lesson. Level from Newcomer to Master. Real gamified progress.", color: "#22d3ee", glow: "rgba(34,211,238,0.22)" },
  { icon: "🔥", title: "Daily Streaks",           desc: "Build a habit with daily streaks. Consistency is the real skill in ML.",          color: "#f97316", glow: "rgba(249,115,22,0.22)" },
  { icon: "🏆", title: "8 Achievement Badges",   desc: "Complete every lesson in a category to earn an expert badge — 8 to collect.",     color: "#fbbf24", glow: "rgba(251,191,36,0.22)" },
  { icon: "💻", title: "Real Python Code",        desc: "Every concept backed by runnable, production-quality Python with one-click copy.", color: "#34d399", glow: "rgba(52,211,153,0.22)" },
  { icon: "🎤", title: "Interview Prep",          desc: "FAANG-level ML system design walkthroughs and Q&A — ready for the real thing.",   color: "#ec4899", glow: "rgba(236,72,153,0.22)" },
]

const CAT_META: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  "Machine Learning":   { color: "#a78bfa", bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.3)",  glow: "rgba(139,92,246,0.25)" },
  "Deep Learning":      { color: "#60a5fa", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)",  glow: "rgba(59,130,246,0.25)" },
  "NLP & Transformers": { color: "#22d3ee", bg: "rgba(34,211,238,0.1)",  border: "rgba(34,211,238,0.3)",  glow: "rgba(34,211,238,0.25)" },
  "LLMs & Prompting":   { color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.3)",  glow: "rgba(52,211,153,0.25)" },
  "RAG Systems":        { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.3)",  glow: "rgba(251,191,36,0.25)" },
  "Computer Vision":    { color: "#f472b6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.3)", glow: "rgba(244,114,182,0.25)" },
  "MLOps":              { color: "#fb923c", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.3)",  glow: "rgba(251,146,60,0.25)" },
  "Interview Prep":     { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", glow: "rgba(248,113,113,0.25)" },
}

const CURRICULUM = [
  { cat: "Machine Learning",   count: 12, icon: "🤖", topics: "Gradient Descent · XGBoost · SVMs · PCA" },
  { cat: "Deep Learning",      count: 10, icon: "🧠", topics: "Backprop · GANs · Diffusion · Autoencoders" },
  { cat: "NLP & Transformers", count: 8,  icon: "💬", topics: "Attention · BERT · GPT · LoRA · Fine-tuning" },
  { cat: "LLMs & Prompting",   count: 8,  icon: "✨", topics: "Agents · RLHF · Tool Use · LangChain" },
  { cat: "RAG Systems",        count: 7,  icon: "🔍", topics: "Vector DBs · Reranking · Hybrid Search" },
  { cat: "Computer Vision",    count: 6,  icon: "👁️", topics: "YOLO · ViT · Segmentation · Transfer" },
  { cat: "MLOps",              count: 6,  icon: "🚀", topics: "Docker · CI/CD · Drift · Feature Stores" },
  { cat: "Interview Prep",     count: 5,  icon: "🎤", topics: "ML System Design · FAANG Q&A" },
]

const STATS = [
  { value: "62",   label: "Lessons",       color: "#a78bfa" },
  { value: "8",    label: "Categories",    color: "#22d3ee" },
  { value: "700+", label: "Code Examples", color: "#f472b6" },
  { value: "0",    label: "API Keys",      color: "#34d399" },
]

const STEPS = [
  { n: "01", title: "Pick a lesson",      desc: "Choose any topic from 8 categories. No prerequisites — start anywhere.", color: "#a78bfa" },
  { n: "02", title: "Learn with code",    desc: "In-depth explanations + runnable Python examples side by side.",          color: "#22d3ee" },
  { n: "03", title: "Earn XP & badges",   desc: "Complete lessons to level up from Newcomer to Master, collect 8 badges.", color: "#ec4899" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Dot grid overlay */}
      <div className="fixed inset-0 dot-grid pointer-events-none" />

      {/* Animated aurora orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="aurora1 absolute top-[-20%] left-[5%] w-[650px] h-[650px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)" }} />
        <div className="aurora2 absolute top-[25%] right-[-12%] w-[550px] h-[550px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)" }} />
        <div className="aurora3 absolute bottom-[-18%] left-[20%] w-[700px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)" }} />
        <div className="aurora4 absolute top-[55%] left-[-8%] w-[450px] h-[450px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.09), transparent 70%)" }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 border-b backdrop-blur-md"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(3,3,7,0.7)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white neon-violet"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>AZ</div>
          <span className="font-bold text-white text-lg tracking-tight">
            AIZen <span className="gradient-text">Tutor</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/learn"
            className="hidden sm:block text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">
            Curriculum
          </Link>
          <Link href="/learn"
            className="text-sm font-bold text-white px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
            Start Learning →
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative z-10 px-4 sm:px-8 pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left: text */}
            <div className="flex-1 text-center lg:text-left fade-up">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-medium"
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.45)", color: "#a78bfa" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Free · No signup · No API keys
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.06] mb-6">
                Master AI & ML.<br />
                <span className="gradient-text-animated">Earn XP. Level Up.</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                The most comprehensive AI/ML learning platform — 62 in-depth lessons,
                real Python code, gamified XP system, and interview prep. Go from zero
                to AI engineer.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <Link href="/learn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-bold text-white px-8 py-3.5 rounded-xl transition-all hover:scale-105 active:scale-95 pulse-ring"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                  Start Learning Free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link href="/learn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm text-zinc-300 hover:text-white glass px-6 py-3.5 rounded-xl transition-all hover:border-violet-500/40">
                  View Curriculum →
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10">
                {STATS.map((s) => (
                  <div key={s.label} className="text-center lg:text-left">
                    <p className="text-2xl sm:text-3xl font-black" style={{ color: s.color, textShadow: `0 0 24px ${s.color}70` }}>
                      {s.value}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: floating app preview */}
            <div className="hidden lg:block flex-1 max-w-lg w-full float fade-up" style={{ animationDelay: "0.15s" }}>
              <div className="relative">
                {/* Glow blob */}
                <div className="absolute inset-[-20px] blur-3xl rounded-3xl opacity-25"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #22d3ee)" }} />
                {/* Card */}
                <div className="relative glass-bright rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(139,92,246,0.35)" }}>
                  {/* Gradient top accent */}
                  <div className="h-0.5" style={{ background: "linear-gradient(90deg, #7c3aed, #22d3ee, #ec4899)" }} />
                  {/* Code chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b"
                    style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.06)" }}>
                    <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: "#28ca41" }} />
                    <span className="ml-3 text-xs font-mono" style={{ color: "#4a4a6a" }}>attention.py</span>
                  </div>
                  {/* Code */}
                  <div className="px-5 py-4 font-mono text-xs leading-relaxed overflow-x-auto"
                    style={{ background: "#04040a" }}>
                    <div><span style={{ color: "#4a5568" }}># Scaled Dot-Product Attention</span></div>
                    <div><span style={{ color: "#c084fc" }}>import</span> <span style={{ color: "#e2e8f0" }}>torch</span></div>
                    <div><span style={{ color: "#c084fc" }}>import</span> <span style={{ color: "#e2e8f0" }}>torch.nn </span><span style={{ color: "#c084fc" }}>as</span><span style={{ color: "#e2e8f0" }}> nn</span></div>
                    <div className="mt-2.5"><span style={{ color: "#c084fc" }}>def</span> <span style={{ color: "#67e8f9" }}>attention</span><span style={{ color: "#e2e8f0" }}>(Q, K, V):</span></div>
                    <div className="ml-4"><span style={{ color: "#e2e8f0" }}>d_k </span><span style={{ color: "#c084fc" }}>=</span><span style={{ color: "#e2e8f0" }}> Q.shape[-</span><span style={{ color: "#fbbf24" }}>1</span><span style={{ color: "#e2e8f0" }}>]</span></div>
                    <div className="ml-4"><span style={{ color: "#e2e8f0" }}>scores </span><span style={{ color: "#c084fc" }}>=</span><span style={{ color: "#e2e8f0" }}> Q @ K.transpose(-</span><span style={{ color: "#fbbf24" }}>2</span><span style={{ color: "#e2e8f0" }}>, -</span><span style={{ color: "#fbbf24" }}>1</span><span style={{ color: "#e2e8f0" }}>)</span></div>
                    <div className="ml-4"><span style={{ color: "#e2e8f0" }}>scores </span><span style={{ color: "#c084fc" }}>/=</span><span style={{ color: "#e2e8f0" }}> d_k ** </span><span style={{ color: "#fbbf24" }}>0.5</span></div>
                    <div className="ml-4"><span style={{ color: "#c084fc" }}>return</span><span style={{ color: "#e2e8f0" }}> nn.Softmax(dim=-</span><span style={{ color: "#fbbf24" }}>1</span><span style={{ color: "#e2e8f0" }}>) (scores) @ V</span></div>
                  </div>
                  {/* XP panel */}
                  <div className="px-4 py-3.5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.4)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>🔭</span>
                        <span className="text-xs font-bold text-white">Explorer · Level 3</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: "#a78bfa" }}>1,200 / 1,500 XP</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full xp-bar-fill" style={{ width: "80%" }} />
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {["🤖 ML Scholar", "🧠 Deep Thinker", "💬 NLP Expert"].map((b) => (
                        <span key={b} className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24" }}>
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="relative z-10 px-4 sm:px-8 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
              Built for <span className="gradient-text">serious learners</span>
            </h2>
            <p className="text-zinc-500">Everything you need to go from beginner to production ML engineer</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Curriculum ─── */}
      <section className="relative z-10 px-4 sm:px-8 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
              Complete <span className="gradient-text">AI/ML Curriculum</span>
            </h2>
            <p className="text-zinc-500">62 lessons covering the entire ML ecosystem</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {CURRICULUM.map((c, i) => {
              const m = CAT_META[c.cat] ?? CAT_META["Machine Learning"]
              return <CurriculumCard key={c.cat} item={c} meta={m} delay={i * 60} />
            })}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="relative z-10 px-4 sm:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-14">
            How it <span className="gradient-text">works</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden sm:block absolute top-[22px] left-[calc(16.66%+12px)] right-[calc(16.66%+12px)] h-px"
              style={{ background: "linear-gradient(90deg, #7c3aed, #22d3ee, #ec4899)" }} />
            {STEPS.map((s) => (
              <div key={s.n} className="text-center fade-up">
                <div className="w-11 h-11 rounded-2xl mx-auto mb-4 flex items-center justify-center font-black text-sm relative z-10"
                  style={{
                    background: `${s.color}15`,
                    border: `1px solid ${s.color}45`,
                    color: s.color,
                    boxShadow: `0 0 20px ${s.color}30`,
                  }}>
                  {s.n}
                </div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative z-10 px-4 sm:px-8 py-16 sm:py-28">
        <div className="max-w-2xl mx-auto text-center glass rounded-2xl p-8 sm:p-14 relative overflow-hidden"
          style={{ border: "1px solid rgba(139,92,246,0.35)" }}>
          {/* Inner radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 65%)" }} />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to level up?</h2>
            <p className="text-zinc-400 mb-8 text-base">Start learning now. No account needed. Free forever.</p>
            <Link href="/learn"
              className="inline-flex items-center gap-2 text-base font-bold text-white px-10 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 pulse-ring"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              Start Learning Free ⚡
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t px-4 sm:px-8 py-6 text-center text-xs text-zinc-700"
        style={{ borderColor: "var(--border)" }}>
        <p>AIZen Tutor · Built for the AI generation · {LESSONS.length} lessons across {CATEGORIES.length} categories</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc, color, glow, delay }: {
  icon: string; title: string; desc: string; color: string; glow: string; delay: number
}) {
  return (
    <div
      className="glass rounded-xl p-5 sm:p-6 transition-all duration-300 cursor-default fade-up"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = `0 0 30px ${glow}, 0 0 60px ${glow.replace("0.22", "0.1")}`
        el.style.borderColor = color + "50"
        el.style.transform = "translateY(-5px)"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = ""
        el.style.borderColor = ""
        el.style.transform = ""
      }}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
        style={{ background: glow, border: `1px solid ${color}30` }}>
        {icon}
      </div>
      <h3 className="font-bold text-white mb-2 text-sm sm:text-base">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function CurriculumCard({ item, meta, delay }: {
  item: { cat: string; count: number; icon: string; topics: string }
  meta: { color: string; bg: string; border: string; glow: string }
  delay: number
}) {
  return (
    <Link href="/learn"
      className="glass rounded-xl p-4 sm:p-5 block transition-all duration-300 fade-up"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = `0 0 25px ${meta.glow}`
        el.style.borderColor = meta.border
        el.style.transform = "translateY(-4px)"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = ""
        el.style.borderColor = ""
        el.style.transform = ""
      }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{item.icon}</span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
          {item.count} lessons
        </span>
      </div>
      <h3 className="font-bold text-white text-sm mb-1.5">{item.cat}</h3>
      <p className="text-xs leading-relaxed text-zinc-600">{item.topics}</p>
    </Link>
  )
}
