"use client"
import Link from "next/link"
import Nav from "@/components/Nav"

const PROJECTS = [
  {
    id: "house-price",
    icon: "🏠",
    title: "House Price Prediction",
    category: "Machine Learning",
    color: "#a78bfa",
    difficulty: "Beginner",
    desc: "End-to-end regression pipeline on the Ames Housing dataset. Feature engineering, EDA, Ridge/Lasso tuning, and a Streamlit dashboard.",
    architecture: "EDA → Feature Engineering → Train/Test Split → Ridge/Lasso/XGBoost → SHAP Explainability → Streamlit UI",
    dataset: "Ames Housing Dataset (Kaggle) — 79 features, 1,460 training samples",
    skills: ["Pandas","Scikit-Learn","XGBoost","SHAP","Matplotlib","Streamlit"],
    github: "#",
    demo: "#",
    highlights: ["RMSE < 18,000","Top 15% Kaggle leaderboard","SHAP feature importance charts"],
  },
  {
    id: "churn",
    icon: "📉",
    title: "Customer Churn Prediction",
    category: "Machine Learning",
    color: "#a78bfa",
    difficulty: "Intermediate",
    desc: "Telecom churn classifier with SMOTE class balancing, threshold tuning, SHAP explanations, and a business-ready Streamlit report.",
    architecture: "Data Cleaning → SMOTE Oversampling → Logistic/RF/XGBoost → Threshold Optimization → SHAP Dashboard",
    dataset: "IBM Telco Customer Churn (Kaggle) — 7,043 customers, 20 features",
    skills: ["Scikit-Learn","Imbalanced-Learn","SHAP","XGBoost","Streamlit","Pandas"],
    github: "#",
    demo: "#",
    highlights: ["F1-score 0.89 on minority class","Business ROI report included","Threshold tuning demo"],
  },
  {
    id: "recommender",
    icon: "🎯",
    title: "Movie Recommendation System",
    category: "Machine Learning",
    color: "#a78bfa",
    difficulty: "Intermediate",
    desc: "Collaborative filtering (SVD + ALS) combined with content-based TF-IDF features. FastAPI serving with Redis caching.",
    architecture: "User-Item Matrix → SVD/ALS → Content TF-IDF → Hybrid Scorer → FastAPI → Redis Cache",
    dataset: "MovieLens 25M — 25M ratings, 62K movies, 162K users",
    skills: ["Scikit-Surprise","FastAPI","Redis","Pandas","NumPy","Docker"],
    github: "#",
    demo: "#",
    highlights: ["RMSE 0.87 on test set","Sub-50ms API response","Hybrid content + collaborative"],
  },
  {
    id: "image-classifier",
    icon: "🖼️",
    title: "Image Classifier (ResNet-50)",
    category: "Deep Learning",
    color: "#60a5fa",
    difficulty: "Intermediate",
    desc: "Transfer learning with frozen ResNet-50 backbone fine-tuned on CIFAR-10. Mixed-precision training, WandB tracking, ONNX export.",
    architecture: "ResNet-50 (frozen) → Custom Head → Fine-tune → Mixed Precision → ONNX Export → FastAPI",
    dataset: "CIFAR-10 — 60,000 images, 10 classes (32×32 px)",
    skills: ["PyTorch","Torchvision","WandB","ONNX","FastAPI","Albumentations"],
    github: "#",
    demo: "#",
    highlights: ["94.3% test accuracy","ONNX optimized for 10ms inference","WandB experiment tracking"],
  },
  {
    id: "object-detection",
    icon: "📦",
    title: "Object Detection (YOLOv8)",
    category: "Deep Learning",
    color: "#60a5fa",
    difficulty: "Advanced",
    desc: "Fine-tuned YOLOv8 on a custom dataset for real-time object detection in video streams. Deployed with FastAPI + WebSocket streaming.",
    architecture: "YOLOv8 Nano → Custom Dataset → Fine-tune → TensorRT → FastAPI WebSocket → Browser",
    dataset: "COCO subset + custom annotated dataset (Roboflow) — 5,000 images",
    skills: ["Ultralytics","PyTorch","TensorRT","FastAPI","WebSocket","Roboflow"],
    github: "#",
    demo: "#",
    highlights: ["mAP@0.5 = 0.82","Real-time 30FPS inference","WebSocket live stream"],
  },
  {
    id: "sentiment",
    icon: "💬",
    title: "Sentiment Analysis API",
    category: "NLP",
    color: "#22d3ee",
    difficulty: "Intermediate",
    desc: "Fine-tuned DistilBERT on SST-2 with quantization (INT8) for 3× faster inference. Full REST API with batch endpoint.",
    architecture: "DistilBERT → Fine-tune SST-2 → INT8 Quantization → FastAPI → Docker → Render",
    dataset: "Stanford SST-2 — 67,349 movie review sentences, binary sentiment",
    skills: ["Transformers","PyTorch","FastAPI","Docker","HuggingFace","Quantization"],
    github: "#",
    demo: "#",
    highlights: ["92.1% accuracy","3× faster with INT8 quantization","Batch inference endpoint"],
  },
  {
    id: "rag-chatbot",
    icon: "🔍",
    title: "RAG Document Chatbot",
    category: "LLM",
    color: "#fbbf24",
    difficulty: "Advanced",
    desc: "PDF Q&A using LangChain + FAISS + Groq Llama 3. Semantic chunking, hybrid search (BM25 + dense), and streaming responses.",
    architecture: "PDF → Semantic Chunking → FAISS + BM25 → Reranker → Groq Llama 3 → Streaming API → Next.js",
    dataset: "User-uploaded PDFs — research papers, textbooks, documentation",
    skills: ["LangChain","FAISS","Groq","Next.js","FastAPI","Sentence-Transformers"],
    github: "#",
    demo: "#",
    highlights: ["Hybrid BM25 + dense retrieval","Real-time streaming","Reranking with cross-encoder"],
  },
  {
    id: "pdf-qa",
    icon: "📄",
    title: "PDF Q&A with Citations",
    category: "LLM",
    color: "#fbbf24",
    difficulty: "Advanced",
    desc: "Upload any PDF and get cited answers. Page-level citation tracking, chunk-level provenance, and confidence scoring.",
    architecture: "PDF → pdfplumber → Page Chunks → Embeddings → FAISS → LLM + Citation Injection → React UI",
    dataset: "User-provided PDFs (research papers, legal docs, textbooks)",
    skills: ["pdfplumber","FAISS","OpenAI/Groq","React","FastAPI","LangChain"],
    github: "#",
    demo: "#",
    highlights: ["Page-level citations","Confidence scoring","Multi-PDF cross-search"],
  },
  {
    id: "ai-research",
    icon: "🔬",
    title: "AI Research Assistant",
    category: "LLM",
    color: "#fbbf24",
    difficulty: "Expert",
    desc: "Multi-agent system for literature review. Agents search ArXiv, summarize papers, extract key ideas, and generate a structured report.",
    architecture: "Query → ArXiv Search Agent → Paper Summarizer Agent → Synthesis Agent → Report Generator → Markdown Export",
    dataset: "ArXiv API (live) — 2M+ papers across CS/ML/AI",
    skills: ["LangGraph","Groq","ArXiv API","BeautifulSoup","FastAPI","React"],
    github: "#",
    demo: "#",
    highlights: ["Multi-agent LangGraph workflow","Live ArXiv search","Structured PDF report output"],
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  "Machine Learning": "#a78bfa",
  "Deep Learning":    "#60a5fa",
  "NLP":              "#22d3ee",
  "LLM":              "#fbbf24",
}

const DIFF_COLOR: Record<string, string> = {
  Beginner:     "#34d399",
  Intermediate: "#fbbf24",
  Advanced:     "#fb923c",
  Expert:       "#f87171",
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Nav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
            🏗️ Build Portfolio
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">ML Projects Showcase</h1>
          <p className="text-zinc-500 text-sm max-w-xl">
            9 end-to-end projects across ML, DL, NLP, and LLMs. Each includes architecture, dataset, skills, and implementation details.
          </p>
        </div>

        {/* Category filter bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", ...Object.keys(CATEGORY_COLORS)].map((cat) => (
            <span key={cat} className="text-xs px-3 py-1.5 rounded-full cursor-default"
              style={{
                background: cat === "All" ? "rgba(124,58,237,0.15)" : `${CATEGORY_COLORS[cat] ?? "#a78bfa"}15`,
                border: `1px solid ${cat === "All" ? "rgba(124,58,237,0.3)" : `${CATEGORY_COLORS[cat] ?? "#a78bfa"}30`}`,
                color: cat === "All" ? "#a78bfa" : CATEGORY_COLORS[cat] ?? "#a78bfa",
              }}>
              {cat}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PROJECTS.map((p) => (
            <div key={p.id} className="rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5"
              style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)", transitionDuration: "160ms" }}>

              {/* Card header */}
              <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${p.color}12`, border: `1px solid ${p.color}25`, color: p.color }}>
                        {p.category}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${DIFF_COLOR[p.difficulty]}10`, border: `1px solid ${DIFF_COLOR[p.difficulty]}25`, color: DIFF_COLOR[p.difficulty] }}>
                        {p.difficulty}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white leading-snug">{p.title}</h2>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed mt-3">{p.desc}</p>
              </div>

              {/* Details */}
              <div className="px-5 py-4 space-y-3.5 text-xs">

                {/* Architecture */}
                <div>
                  <p className="text-zinc-600 font-medium mb-1.5 flex items-center gap-1.5">
                    <span>⚙️</span> Architecture
                  </p>
                  <p className="text-zinc-400 font-mono text-[11px] leading-relaxed p-2.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    {p.architecture}
                  </p>
                </div>

                {/* Dataset */}
                <div>
                  <p className="text-zinc-600 font-medium mb-1.5 flex items-center gap-1.5">
                    <span>📊</span> Dataset
                  </p>
                  <p className="text-zinc-400">{p.dataset}</p>
                </div>

                {/* Highlights */}
                <div>
                  <p className="text-zinc-600 font-medium mb-1.5 flex items-center gap-1.5">
                    <span>✅</span> Key Results
                  </p>
                  <ul className="space-y-1">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-zinc-400">
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: p.color }} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-zinc-600 font-medium mb-1.5 flex items-center gap-1.5">
                    <span>🛠️</span> Skills Used
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-zinc-400"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-2 pt-1">
                  <a href={p.github} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-zinc-400 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    GitHub
                  </a>
                  <a href={p.demo} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-white transition-opacity hover:opacity-80"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center p-8 rounded-2xl"
          style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.15)" }}>
          <p className="text-white font-bold mb-2">Ready to build your own ML projects?</p>
          <p className="text-zinc-500 text-sm mb-5">Complete the curriculum, earn XP, and apply every concept in a real project.</p>
          <Link href="/learn"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-2.5 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            Start Learning → Earn XP
          </Link>
        </div>
      </main>
    </div>
  )
}
