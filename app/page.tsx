"use client"
import { useEffect } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { LESSONS, CATEGORIES } from "@/data/curriculum"

const PROJECTS = [
  { icon: "🏠", title: "House Price Prediction", desc: "Regression model with feature engineering, EDA, and Ridge/Lasso tuning on the Ames Housing dataset.", tags: ["Scikit-Learn","XGBoost","Pandas","Matplotlib"], color: "#a78bfa" },
  { icon: "💬", title: "Sentiment Analysis API", desc: "Fine-tuned DistilBERT on SST-2 with FastAPI serving — 92% accuracy at <50ms latency.", tags: ["Transformers","FastAPI","PyTorch","HuggingFace"], color: "#22d3ee" },
  { icon: "🔍", title: "RAG Document Chatbot", desc: "PDF Q&A using LangChain + FAISS + Groq API. Chunk, embed, retrieve, and generate answers.", tags: ["LangChain","FAISS","Groq","Next.js"], color: "#fbbf24" },
  { icon: "👁️", title: "Image Classifier (ResNet)", desc: "Transfer learning on ResNet-50 for 10-class classification. 94% test accuracy with data augmentation.", tags: ["PyTorch","Torchvision","OpenCV","WandB"], color: "#f472b6" },
  { icon: "📉", title: "Customer Churn Prediction", desc: "Telecom churn model with class imbalance handling (SMOTE), SHAP explanations, and Streamlit dashboard.", tags: ["Scikit-Learn","SHAP","SMOTE","Streamlit"], color: "#34d399" },
  { icon: "🤖", title: "NER System (spaCy + Transformers)", desc: "Custom NER for extracting skills and technologies from job postings using BIO tagging.", tags: ["spaCy","Transformers","BIO","PyTorch"], color: "#fb923c" },
]

const SKILLS = [
  { name: "Python",         icon: "🐍" },
  { name: "PyTorch",        icon: "🔥" },
  { name: "Scikit-Learn",   icon: "🤖" },
  { name: "LangChain",      icon: "⛓️" },
  { name: "FastAPI",        icon: "⚡" },
  { name: "Transformers",   icon: "🧠" },
  { name: "Docker",         icon: "🐳" },
  { name: "FAISS",          icon: "🔍" },
]

const FEATURES = [
  { icon: "🧠", title: "62 In-Depth Lessons",   desc: "From linear regression to diffusion models — every concept explained with code." },
  { icon: "⚡", title: "XP & Level System",      desc: "Earn 100 XP per lesson + bonus XP from quizzes. Level up from Newcomer to Master." },
  { icon: "🔥", title: "Daily Streaks",          desc: "Build a consistent habit. Streak tracking keeps you accountable every day." },
  { icon: "📝", title: "Quizzes + Notes",        desc: "3 MCQs per lesson with explanations and bonus XP. Add personal notes to any lesson." },
  { icon: "💻", title: "Real Python Code",       desc: "Every concept backed by runnable, production-quality Python with one-click copy." },
  { icon: "📊", title: "Progress Dashboard",     desc: "Activity heatmap, category rings, quiz stats, bookmarks — see your full journey." },
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
      // Pre-set to invisible so there's no flash before the timeline runs
      gsap.set(["#hero-badge","#hero-h1","#hero-sub","#hero-ctas","#hero-stats","#hero-preview"],
        { opacity: 0 })

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.to("#hero-badge",   { opacity: 1, y: 0, duration: 0.45, startAt: { y: 10 } })
        .to("#hero-h1",      { opacity: 1, y: 0, duration: 0.6,  startAt: { y: 28 } }, "-=0.15")
        .to("#hero-sub",     { opacity: 1, y: 0, duration: 0.5,  startAt: { y: 18 } }, "-=0.3")
        .to("#hero-ctas",    { opacity: 1, y: 0, duration: 0.4,  startAt: { y: 14 } }, "-=0.25")
        .to("#hero-stats",   { opacity: 1, y: 0, duration: 0.4,  startAt: { y: 8  } }, "-=0.2")
        .to("#hero-preview", { opacity: 1, x: 0, duration: 0.65, startAt: { x: 36 }, ease: "power2.out" }, "-=0.55")

      // ── Stats counter ──
      document.querySelectorAll<HTMLElement>(".stat-count").forEach((el) => {
        const raw = el.dataset.val ?? "0"
        const hasPlus = raw.endsWith("+")
        const target = parseInt(raw)
        const obj = { n: 0 }
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              n: target, duration: 1.6, ease: "power2.out",
              onUpdate() { el.textContent = Math.round(obj.n) + (hasPlus ? "+" : "") },
            })
          },
        })
      })

      // ── Scroll-reveal helper ──
      // Elements stay fully visible by default (no pre-hidden state).
      // Only animate when they enter the viewport — safe fallback if JS is slow.
      const reveal = (selector: string, trigger: string, stagger = 0.07) => {
        ScrollTrigger.create({
          trigger,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(selector,
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.4, stagger, ease: "power2.out" }
            )
          },
        })
      }

      reveal(".feat-card",    "#features",   0.07)
      reveal(".curr-card",    "#curriculum", 0.055)
      reveal(".how-step",     "#how",        0.12)
      reveal(".project-card", "#projects",   0.06)
      reveal("#about-box",    "#about",      0)
      reveal("#cta-box",      "#cta-box",    0)
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
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/learn"
            className="hidden sm:block text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">
            Curriculum
          </Link>
          <Link href="/roadmap"
            className="hidden sm:block text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">
            Roadmap
          </Link>
          <Link href="/dashboard"
            className="hidden sm:block text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">
            Dashboard
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

      {/* ─── Projects ─── */}
      <section id="projects" className="relative z-10 px-4 sm:px-8 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              ML <span className="gradient-text">Projects Showcase</span>
            </h2>
            <p className="text-zinc-600 text-sm">Real-world projects built using the skills from this curriculum</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PROJECTS.map((p) => (
              <div key={p.title}
                className="project-card glass rounded-xl p-5 hover:border-white/[0.13] hover:-translate-y-0.5 transition-all group"
                style={{ transitionDuration: "160ms" }}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white text-sm leading-snug mb-1">{p.title}</h3>
                    <p className="text-zinc-600 text-xs leading-relaxed">{p.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: `${p.color}10`, border: `1px solid ${p.color}25`, color: p.color }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About ─── */}
      <section id="about" className="relative z-10 px-4 sm:px-8 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <div id="about-box" className="glass rounded-2xl p-6 sm:p-10"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* Avatar */}
              <div className="shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                AZ
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h2 className="text-xl font-black text-white">Asif Zaman</h2>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1.5 mx-auto sm:mx-0"
                    style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Open to Opportunities
                  </span>
                </div>
                <p className="text-zinc-400 text-sm mb-1">ML Engineer · NLP & LLM Enthusiast · BSc CSE</p>
                <p className="text-zinc-600 text-xs mb-4 leading-relaxed max-w-xl">
                  Building AI products that matter. Focused on NLP, LLMs, RAG systems, and making ML accessible
                  through interactive tools like AIZen Tutor.
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start mb-5">
                  {SKILLS.map((s) => (
                    <span key={s.name}
                      className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#a1a1aa" }}>
                      <span className="text-sm">{s.icon}</span>
                      {s.name}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3 justify-center sm:justify-start">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    GitHub
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                  <Link href="/learn"
                    className="flex items-center gap-1.5 text-xs text-white px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                    ⚡ Try AIZen Tutor
                  </Link>
                </div>
              </div>
            </div>
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
