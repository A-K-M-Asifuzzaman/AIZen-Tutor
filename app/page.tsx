"use client"
import { useEffect } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { LESSONS, CATEGORIES } from "@/data/curriculum"

const FEATURES = [
  { icon: "🧠", title: "62 In-Depth Lessons",   desc: "From linear regression to diffusion models — every concept explained with code." },
  { icon: "⚡", title: "XP & Level System",      desc: "Earn 100 XP per lesson. Level up from Newcomer to Master. Track real progress." },
  { icon: "🔥", title: "Daily Streaks",          desc: "Build a consistent habit. Streak tracking keeps you accountable every day." },
  { icon: "🏆", title: "8 Achievement Badges",  desc: "Complete every lesson in a category to earn an expert badge. 8 total to unlock." },
  { icon: "💻", title: "Real Python Code",       desc: "Every concept backed by runnable, production-quality Python with one-click copy." },
  { icon: "🎤", title: "Interview Prep",         desc: "FAANG-level ML system design walkthroughs and Q&A — ready for the real thing." },
]

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
  { val: "62",   label: "Lessons" },
  { val: "8",    label: "Categories" },
  { val: "700+", label: "Code Examples" },
  { val: "0",    label: "API Keys" },
]

export default function LandingPage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // ── Hero sequence ──
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.from("#hero-badge",   { opacity: 0, y: 10, duration: 0.45 })
        .from("#hero-h1",      { opacity: 0, y: 28, duration: 0.6 }, "-=0.15")
        .from("#hero-sub",     { opacity: 0, y: 18, duration: 0.5 }, "-=0.3")
        .from("#hero-ctas",    { opacity: 0, y: 14, duration: 0.4 }, "-=0.25")
        .from("#hero-stats",   { opacity: 0, y: 8,  duration: 0.4 }, "-=0.2")
        .from("#hero-preview", { opacity: 0, x: 36, duration: 0.65, ease: "power2.out" }, "-=0.55")

      // ── Stats counter ──
      document.querySelectorAll<HTMLElement>(".stat-count").forEach((el) => {
        const raw = el.dataset.val ?? "0"
        const hasPlus = raw.endsWith("+")
        const target = parseInt(raw)
        const obj = { n: 0 }
        gsap.to(obj, {
          n: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate() { el.textContent = Math.round(obj.n) + (hasPlus ? "+" : "") },
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        })
      })

      // ── Feature cards stagger ──
      gsap.from(".feat-card", {
        opacity: 0, y: 22, duration: 0.45, stagger: 0.07, ease: "power2.out",
        scrollTrigger: { trigger: "#features", start: "top 82%", once: true },
      })

      // ── Curriculum cards stagger ──
      gsap.from(".curr-card", {
        opacity: 0, y: 18, duration: 0.38, stagger: 0.055, ease: "power2.out",
        scrollTrigger: { trigger: "#curriculum", start: "top 82%", once: true },
      })

      // ── How it works steps ──
      gsap.from(".how-step", {
        opacity: 0, y: 22, duration: 0.45, stagger: 0.12, ease: "power2.out",
        scrollTrigger: { trigger: "#how", start: "top 82%", once: true },
      })

      // ── CTA ──
      gsap.from("#cta-box", {
        opacity: 0, y: 24, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: "#cta-box", start: "top 85%", once: true },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Subtle top gradient */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 40% at 50% -5%, rgba(124,58,237,0.07), transparent)" }} />

      {/* Nav */}
      <nav className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-4 border-b backdrop-blur-md"
        style={{ borderColor: "var(--border)", background: "rgba(5,5,10,0.88)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>AZ</div>
          <span className="font-semibold text-white">AIZen Tutor</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/learn"
            className="hidden sm:block text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">
            Curriculum
          </Link>
          <Link href="/learn"
            className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            Start Learning →
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative z-10 px-4 sm:px-8 pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <div id="hero-badge"
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 text-xs font-medium text-zinc-400"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Free · No signup · No API keys
              </div>

              <h1 id="hero-h1"
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-5">
                Master AI & ML.<br />
                <span className="gradient-text">Earn XP. Level Up.</span>
              </h1>

              <p id="hero-sub"
                className="text-base sm:text-lg text-zinc-500 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                62 in-depth lessons, real Python code, a gamified XP system, and
                interview prep. Go from zero to AI engineer — at your own pace.
              </p>

              <div id="hero-ctas"
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10">
                <Link href="/learn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold text-white px-7 py-3 rounded-lg transition-opacity hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                  Start Learning Free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link href="/learn"
                  className="w-full sm:w-auto inline-flex items-center justify-center text-sm text-zinc-400 hover:text-white transition-colors glass px-6 py-3 rounded-lg">
                  View 62 Lessons →
                </Link>
              </div>

              {/* Stats */}
              <div id="hero-stats"
                className="flex flex-wrap items-center justify-center lg:justify-start gap-8 sm:gap-10">
                {STATS.map((s) => (
                  <div key={s.label} className="text-center lg:text-left">
                    <p className="stat-count text-2xl font-black text-white" data-val={s.val}>
                      {s.val}
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: preview card */}
            <div id="hero-preview" className="hidden lg:block w-full max-w-md float">
              <div className="rounded-xl overflow-hidden border"
                style={{ background: "#06060e", borderColor: "rgba(255,255,255,0.08)" }}>
                {/* Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28ca41" }} />
                  <span className="ml-3 text-xs font-mono text-zinc-700">attention.py</span>
                </div>
                {/* Code */}
                <div className="px-5 py-4 font-mono text-xs leading-loose" style={{ background: "#03030a" }}>
                  <p><span style={{ color: "#3a3a5a" }}># Scaled dot-product attention</span></p>
                  <p><span style={{ color: "#c084fc" }}>def</span> <span style={{ color: "#67e8f9" }}>attention</span><span style={{ color: "#e2e8f0" }}>(Q, K, V):</span></p>
                  <p className="ml-4"><span style={{ color: "#e2e8f0" }}>d_k </span><span style={{ color: "#c084fc" }}>=</span><span style={{ color: "#e2e8f0" }}> Q.shape[-</span><span style={{ color: "#fbbf24" }}>1</span><span style={{ color: "#e2e8f0" }}>]</span></p>
                  <p className="ml-4"><span style={{ color: "#e2e8f0" }}>scores </span><span style={{ color: "#c084fc" }}>=</span><span style={{ color: "#e2e8f0" }}> Q @ K.transpose(-</span><span style={{ color: "#fbbf24" }}>2</span><span style={{ color: "#e2e8f0" }}>, -</span><span style={{ color: "#fbbf24" }}>1</span><span style={{ color: "#e2e8f0" }}>)</span></p>
                  <p className="ml-4"><span style={{ color: "#e2e8f0" }}>scores </span><span style={{ color: "#c084fc" }}>/=</span><span style={{ color: "#e2e8f0" }}> d_k ** </span><span style={{ color: "#fbbf24" }}>0.5</span></p>
                  <p className="ml-4"><span style={{ color: "#c084fc" }}>return</span><span style={{ color: "#e2e8f0" }}> softmax(scores) @ V</span></p>
                </div>
                {/* XP */}
                <div className="px-4 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#06060e" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">🔭 Explorer · Level 3</span>
                    <span className="text-xs text-zinc-600">1,200 / 1,500 XP</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full xp-bar-fill" style={{ width: "80%" }} />
                  </div>
                  <div className="flex gap-1.5 mt-2.5">
                    {["🤖 ML Scholar", "🧠 Deep Thinker"].map((b) => (
                      <span key={b} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="h-px" style={{ background: "var(--border)" }} />
      </div>

      {/* ─── Features ─── */}
      <section id="features" className="relative z-10 px-4 sm:px-8 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Built for <span className="gradient-text">serious learners</span>
            </h2>
            <p className="text-zinc-600 text-sm">Everything you need to go from beginner to production ML engineer</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="feat-card glass rounded-xl p-5 hover:border-white/[0.13] hover:-translate-y-0.5 transition-all"
                style={{ transitionDuration: "160ms" }}>
                <p className="text-xl mb-3">{f.icon}</p>
                <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Curriculum ─── */}
      <section id="curriculum" className="relative z-10 px-4 sm:px-8 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Complete <span className="gradient-text">AI/ML Curriculum</span>
            </h2>
            <p className="text-zinc-600 text-sm">62 lessons covering the entire ML ecosystem</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CURRICULUM.map((c) => {
              const color = CAT_COLOR[c.cat] ?? "#a78bfa"
              return (
                <Link href="/learn" key={c.cat}
                  className="curr-card glass rounded-xl p-4 hover:border-white/[0.13] hover:-translate-y-0.5 transition-all block"
                  style={{ transitionDuration: "160ms" }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-lg">{c.icon}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
                      {c.count}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{c.cat}</h3>
                  <p className="text-xs text-zinc-700 leading-relaxed">{c.topics}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how" className="relative z-10 px-4 sm:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-12">
            How it <span className="gradient-text">works</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Pick a lesson",    desc: "Choose any topic from 8 categories. No prerequisites — start anywhere." },
              { n: "02", title: "Learn with code",  desc: "In-depth explanations with runnable Python examples and one-click copy." },
              { n: "03", title: "Earn XP & badges", desc: "Complete lessons to level up from Newcomer to Master, collect 8 badges." },
            ].map((s) => (
              <div key={s.n} className="how-step">
                <div className="w-9 h-9 rounded-xl mb-4 flex items-center justify-center font-bold text-sm"
                  style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.18)", color: "#a78bfa" }}>
                  {s.n}
                </div>
                <h3 className="font-semibold text-white mb-1.5">{s.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative z-10 px-4 sm:px-8 py-16 sm:py-24">
        <div id="cta-box" className="max-w-2xl mx-auto text-center glass rounded-xl p-8 sm:p-12"
          style={{ border: "1px solid rgba(124,58,237,0.18)" }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to level up?</h2>
          <p className="text-zinc-500 text-sm mb-7">Start learning now. No account needed. Free forever.</p>
          <Link href="/learn"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-7 py-3 rounded-lg transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            Start Learning Free ⚡
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t px-4 sm:px-8 py-5 text-center text-xs text-zinc-700"
        style={{ borderColor: "var(--border)" }}>
        AIZen Tutor · {LESSONS.length} lessons across {CATEGORIES.length} categories
      </footer>
    </div>
  )
}
