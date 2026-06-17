"use client"
import { useState } from "react"
import Nav from "@/components/Nav"

const PAPERS = [
  {
    id: "attention",
    emoji: "⚡",
    title: "Attention Is All You Need",
    authors: "Vaswani et al. — Google Brain, 2017",
    color: "#a78bfa",
    tag: "Foundation",
    tldr: "Introduced the Transformer architecture — replacing RNNs entirely with self-attention. This single paper spawned BERT, GPT, ViT, and almost every modern AI model.",
    keyIdeas: [
      "Self-attention: each token attends to all others simultaneously",
      "Multi-head attention: run attention in parallel with different projections",
      "Positional encoding: sine/cosine embeddings inject sequence order",
      "Encoder-decoder with cross-attention for translation",
      "O(n²) attention complexity vs O(n) for RNNs, but fully parallelizable",
    ],
    applications: ["BERT, GPT, T5, LLaMA", "Vision Transformers (ViT)", "AlphaFold 2", "Stable Diffusion"],
    whyItMatters: "Before this, NLP was dominated by LSTMs and GRUs which processed tokens sequentially. Transformers process everything in parallel, enabling massive scale-up on GPUs.",
    link: "https://arxiv.org/abs/1706.03762",
  },
  {
    id: "bert",
    emoji: "🔤",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: "Devlin et al. — Google AI Language, 2018",
    color: "#60a5fa",
    tag: "NLP",
    tldr: "BERT showed that pre-training a bidirectional Transformer on massive text, then fine-tuning, beats task-specific architectures across 11 NLP benchmarks.",
    keyIdeas: [
      "Masked Language Modeling (MLM): predict randomly masked tokens",
      "Next Sentence Prediction (NSP): predict if sentence B follows sentence A",
      "Bidirectional context: attends left AND right simultaneously",
      "Fine-tuning: add a small task-specific head, retrain everything",
      "[CLS] token aggregates sequence representation for classification",
    ],
    applications: ["Text classification, NER, QA", "Google Search (since 2019)", "Semantic search", "Foundation for RoBERTa, DistilBERT, ALBERT"],
    whyItMatters: "BERT democratized NLP. You no longer need task-specific architectures — just pre-train once and fine-tune everywhere.",
    link: "https://arxiv.org/abs/1810.04805",
  },
  {
    id: "gpt3",
    emoji: "✨",
    title: "GPT-3: Language Models are Few-Shot Learners",
    authors: "Brown et al. — OpenAI, 2020",
    color: "#34d399",
    tag: "LLM",
    tldr: "Scaling a language model to 175B parameters unlocks emergent few-shot learning — the model solves new tasks from just a few examples in the prompt, no gradient updates.",
    keyIdeas: [
      "175B parameters — 100× larger than GPT-2",
      "In-context learning: task examples in the prompt, no fine-tuning",
      "Emergent abilities at scale: arithmetic, translation, code appear suddenly",
      "Zero-shot, one-shot, few-shot prompting paradigm",
      "Autoregressive: trained to predict next token given all previous tokens",
    ],
    applications: ["ChatGPT (RLHF fine-tune of GPT-3.5)", "Copilot code completion", "Text summarization", "All commercial LLM products"],
    whyItMatters: "GPT-3 proved that scale alone produces emergent capabilities nobody programmed — launching the LLM era.",
    link: "https://arxiv.org/abs/2005.14165",
  },
  {
    id: "rag",
    emoji: "🔍",
    title: "Retrieval-Augmented Generation (RAG)",
    authors: "Lewis et al. — Facebook AI, 2020",
    color: "#fbbf24",
    tag: "RAG",
    tldr: "Combine a retriever (dense passage retrieval) with a generator (BART) so the model can answer questions using non-parametric external memory — reducing hallucinations.",
    keyIdeas: [
      "Two components: DPR retriever + seq2seq generator (BART)",
      "Retriever finds top-k relevant documents from a knowledge base",
      "Generator conditions on retrieved docs + query to produce answer",
      "Non-parametric memory: update knowledge without retraining",
      "Marginalized over retrieved documents during generation",
    ],
    applications: ["Enterprise knowledge chatbots", "PDF Q&A systems", "Code documentation search", "Medical question answering"],
    whyItMatters: "RAG solves LLM hallucination by grounding answers in retrieved facts — essential for production AI applications.",
    link: "https://arxiv.org/abs/2005.11401",
  },
  {
    id: "react",
    emoji: "🤖",
    title: "ReAct: Synergizing Reasoning and Acting in LLMs",
    authors: "Yao et al. — Princeton & Google, 2022",
    color: "#fb923c",
    tag: "Agents",
    tldr: "LLMs alternate between Thought (reasoning) and Action (tool call), forming a chain that lets models solve multi-step tasks — the foundation of modern AI agents.",
    keyIdeas: [
      "Thought: model reasons about what to do next",
      "Action: model calls a tool (search, calculator, API)",
      "Observation: tool result fed back to model",
      "Repeat until task complete",
      "Outperforms chain-of-thought (reasoning only) and act-only baselines",
    ],
    applications: ["LangChain agents", "AutoGPT", "Claude tool use", "OpenAI function calling agents"],
    whyItMatters: "ReAct is the conceptual backbone of every AI agent framework — LangChain, LangGraph, AutoGen, and CrewAI all implement this pattern.",
    link: "https://arxiv.org/abs/2210.03629",
  },
  {
    id: "lora",
    emoji: "⚙️",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: "Hu et al. — Microsoft, 2021",
    color: "#f472b6",
    tag: "Fine-tuning",
    tldr: "Instead of updating all 175B parameters during fine-tuning, LoRA injects trainable low-rank matrices (rank 4–16) — reducing trainable params by 10,000× at minimal quality loss.",
    keyIdeas: [
      "Freeze original weights W, inject ΔW = AB (low-rank decomposition)",
      "Rank r ≪ d: only 2×r×d parameters instead of d²",
      "No inference overhead: merge A×B into W after training",
      "Applied to query/value attention matrices in practice",
      "QLoRA extends this to 4-bit quantized base models",
    ],
    applications: ["Llama fine-tuning on consumer GPUs", "Domain-specific chatbots", "RLHF reward models", "HuggingFace PEFT library"],
    whyItMatters: "LoRA made fine-tuning large models accessible to everyone — a 7B model can be fine-tuned on a single 24GB GPU.",
    link: "https://arxiv.org/abs/2106.09685",
  },
  {
    id: "cot",
    emoji: "🧠",
    title: "Chain-of-Thought Prompting Elicits Reasoning",
    authors: "Wei et al. — Google Brain, 2022",
    color: "#22d3ee",
    tag: "Prompting",
    tldr: "Adding step-by-step reasoning examples to the prompt dramatically improves LLM performance on math and logic — the foundation of all modern reasoning techniques.",
    keyIdeas: [
      "Few-shot CoT: provide examples with intermediate reasoning steps",
      "Zero-shot CoT: just add 'Let's think step by step'",
      "Emergent at ~100B parameters — doesn't help smaller models",
      "Self-consistency: sample multiple chains, take majority vote answer",
      "Tree-of-Thoughts extends CoT to branching search",
    ],
    applications: ["Math reasoning (GSM8K)", "Code generation", "Medical diagnosis", "Legal reasoning"],
    whyItMatters: "CoT unlocked LLM reasoning — models went from failing grade-school math to near-human performance with a single prompt change.",
    link: "https://arxiv.org/abs/2201.11903",
  },
]

const TAG_COLOR: Record<string, string> = {
  Foundation: "#a78bfa",
  NLP:        "#60a5fa",
  LLM:        "#34d399",
  RAG:        "#fbbf24",
  Agents:     "#fb923c",
  "Fine-tuning": "#f472b6",
  Prompting:  "#22d3ee",
}

export default function ResearchPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Nav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
            📄 Research Corner
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Foundational AI Papers</h1>
          <p className="text-zinc-500 text-sm max-w-xl">
            7 papers that define modern AI/ML. Each with a plain-English summary, key ideas, applications, and why it matters.
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(TAG_COLOR).map(([tag, color]) => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full"
              style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-4">
          {PAPERS.map((p) => {
            const isOpen = expanded === p.id
            return (
              <div key={p.id} className="rounded-2xl overflow-hidden transition-all"
                style={{ background: "var(--surface)", border: `1px solid ${isOpen ? p.color + "30" : "rgba(255,255,255,0.07)"}` }}>

                {/* Header — always visible */}
                <button className="w-full text-left px-5 sm:px-6 py-4 sm:py-5"
                  onClick={() => setExpanded(isOpen ? null : p.id)}>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl sm:text-3xl shrink-0">{p.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: `${TAG_COLOR[p.tag]}12`, border: `1px solid ${TAG_COLOR[p.tag]}25`, color: TAG_COLOR[p.tag] }}>
                          {p.tag}
                        </span>
                      </div>
                      <h2 className="text-sm sm:text-base font-bold text-white leading-snug mb-1">{p.title}</h2>
                      <p className="text-xs text-zinc-600">{p.authors}</p>
                      {!isOpen && <p className="text-xs text-zinc-500 mt-2 leading-relaxed line-clamp-2">{p.tldr}</p>}
                    </div>
                    <svg className={`w-4 h-4 text-zinc-600 shrink-0 mt-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded body */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 space-y-4 text-sm border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="pt-4">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">TL;DR</p>
                      <p className="text-zinc-300 leading-relaxed">{p.tldr}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Key Ideas</p>
                      <ul className="space-y-1.5">
                        {p.keyIdeas.map((idea) => (
                          <li key={idea} className="flex items-start gap-2.5 text-zinc-400 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: p.color }} />
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Applications Today</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.applications.map((a) => (
                          <span key={a} className="text-xs px-2.5 py-1 rounded-full text-zinc-400"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl"
                      style={{ background: `${p.color}08`, border: `1px solid ${p.color}20` }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: p.color }}>💡 Why It Matters</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">{p.whyItMatters}</p>
                    </div>

                    <a href={p.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#a1a1aa" }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Read on ArXiv
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
