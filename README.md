# AIZen Tutor

**A gamified AI/ML learning platform.** 62 in-depth lessons, 5 quizzes per lesson, an AI tutor powered by Groq, a visual skill tree, ML project showcase, foundational research papers, interview prep hub, daily challenges, and a document RAG tutor — all in one dark-themed Next.js app. No account required. Free forever.

---

## Live Demo

**[https://ai-zen-tutor.vercel.app](https://ai-zen-tutor.vercel.app)**

Deployed on Vercel. All 11 pages, the AI Tutor (Groq Llama 3.3 70B), and the RAG Tutor are fully live and operational.

---

## Screenshots

| Page | Description |
|---|---|
| `/` | Hero landing, feature grid, curriculum overview, platform explorer |
| `/learn` | Sidebar + lesson view + AI tutor + notes + quiz modal |
| `/dashboard` | XP stats, activity heatmap, skill radar chart, badges |
| `/roadmap` | Visual node-based learning path |
| `/skill-tree` | ML Engineer tree with per-node progress rings |
| `/projects` | 9 end-to-end ML/DL/LLM project cards |
| `/research` | 7 foundational AI papers with expandable summaries |
| `/interview` | 25+ theory, coding, and system design Q&A |
| `/daily` | Rotating daily challenge (ML + coding + interview) |
| `/rag-tutor` | Upload a document, ask questions via RAG |
| `/about` | Creator profile and portfolio |

---

## Features

### Learning System
- **62 lessons** across 8 categories — from linear regression to diffusion models
- Every lesson has full explanations, real Python code examples with one-click copy
- **5 MCQs per lesson** (310+ total) with instant feedback, explanations, and XP rewards
- **AI Tutor** — per-lesson streaming chat powered by Groq Llama 3.3 70B
- **Notes panel** — write per-lesson notes with `Cmd/Ctrl+S` to save
- **Bookmarks** — star any lesson for quick access

### Gamification
- **XP system** — 100 XP per lesson + 25 XP per correct quiz answer
- **7 levels**: Newcomer → Learner → Explorer → Developer → Engineer → Expert → Master
- **8 category badges** — unlock by completing all lessons in a category
- **Daily streak** — maintained by completing at least one lesson per day

### Progress & Analytics
- **Dashboard** — XP bar, level display, stat cards, quiz accuracy
- **Activity heatmap** — 16-week GitHub-style contribution grid
- **Skill radar chart** — 8-axis spider/web chart showing category progress
- **Category progress rings** — SVG circle progress per category
- All progress stored in `localStorage` — no backend, no account

### Pages
| Page | URL |
|---|---|
| Home / Landing | `/` |
| Learn (62 lessons) | `/learn` |
| Progress Dashboard | `/dashboard` |
| Learning Roadmap | `/roadmap` |
| ML Engineer Skill Tree | `/skill-tree` |
| ML Projects Showcase | `/projects` |
| Research Papers | `/research` |
| Interview Hub | `/interview` |
| Daily Challenge | `/daily` |
| RAG Document Tutor | `/rag-tutor` |
| About | `/about` |

### Projects Showcase (`/projects`)
9 portfolio-ready projects with architecture, dataset, key results, skills, GitHub links, and live demo links:

| Project | Category | Difficulty |
|---|---|---|
| House Price Prediction | Machine Learning | Beginner |
| Customer Churn Prediction | Machine Learning | Intermediate |
| Movie Recommendation System | Machine Learning | Intermediate |
| Image Classifier (ResNet-50) | Deep Learning | Intermediate |
| Object Detection (YOLOv8) | Deep Learning | Advanced |
| Sentiment Analysis API | NLP | Intermediate |
| RAG Document Chatbot | LLM | Advanced |
| PDF Q&A with Citations | LLM | Advanced |
| AI Research Assistant | LLM | Expert |

### Research Papers (`/research`)
7 foundational papers with plain-English summaries, key ideas, applications, and ArXiv links:

1. Attention Is All You Need (Vaswani et al., 2017)
2. BERT: Pre-training of Deep Bidirectional Transformers (Devlin et al., 2018)
3. GPT-3: Language Models are Few-Shot Learners (Brown et al., 2020)
4. Retrieval-Augmented Generation (Lewis et al., 2020)
5. ReAct: Synergizing Reasoning and Acting in LLMs (Yao et al., 2022)
6. LoRA: Low-Rank Adaptation of Large Language Models (Hu et al., 2021)
7. Chain-of-Thought Prompting Elicits Reasoning (Wei et al., 2022)

### Interview Hub (`/interview`)
25+ questions filterable by **category** (ML / DL / NLP / LLM / RAG / MLOps / System Design) and **type** (Theory / Coding / System Design). Coding answers include full Python implementations.

### Daily Challenge (`/daily`)
Three new questions every 24 hours (rotated from a bank using the day-of-year index):
- ML Theory question
- Coding challenge with Python solution
- Interview behavioural / technical question

### RAG Tutor (`/rag-tutor`)
Upload any `.txt`, `.md`, `.py`, `.json`, `.ts`, or `.csv` file — or paste text directly. The system:
1. Chunks the document into overlapping segments
2. Scores chunks by keyword overlap with your query
3. Sends the top 5 chunks + query to Groq Llama 3 via the streaming `/api/chat` edge route
4. Streams grounded answers back — no hallucination from external knowledge

### Skill Tree (`/skill-tree`)
Visual ML Engineer tree with collapsible nodes. Each node shows:
- Lesson progress ring (% complete)
- `Start learning →` link that opens `/learn` filtered to that category
- Locks/unlocks visually based on your progress

Tree path: **Python & Math → Machine Learning → Deep Learning → NLP → LLMs → RAG → [CV | MLOps → Agents]**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.9 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3.4 + custom CSS variables |
| Animations | GSAP 3.15 + ScrollTrigger |
| AI / LLM | Groq SDK (`groq-sdk`) — Llama 3.3 70B Versatile |
| Rendering | Static generation for all pages + Edge runtime for `/api/chat` |
| State | React `useState` / `useEffect` — no external state library |
| Persistence | `localStorage` — no database, no backend |
| Runtime | Node.js (Next.js dev server) / Edge runtime (API route) |

---

## Project Structure

```
Ml Tutor/
└── frontend/
    ├── app/
    │   ├── page.tsx              # Home / landing page
    │   ├── layout.tsx            # Root layout (dark theme, fonts)
    │   ├── globals.css           # CSS variables, animations, utilities
    │   ├── learn/
    │   │   └── page.tsx          # Main learning page (sidebar + lesson + panels)
    │   ├── dashboard/
    │   │   └── page.tsx          # Progress dashboard
    │   ├── roadmap/
    │   │   └── page.tsx          # Visual learning roadmap
    │   ├── skill-tree/
    │   │   └── page.tsx          # ML Engineer skill tree
    │   ├── projects/
    │   │   └── page.tsx          # ML projects showcase
    │   ├── research/
    │   │   └── page.tsx          # Foundational papers
    │   ├── interview/
    │   │   └── page.tsx          # Interview prep hub
    │   ├── daily/
    │   │   └── page.tsx          # Daily challenge
    │   ├── rag-tutor/
    │   │   └── page.tsx          # Document Q&A via RAG
    │   ├── about/
    │   │   └── page.tsx          # Creator profile
    │   └── api/
    │       └── chat/
    │           └── route.ts      # Groq streaming edge API
    ├── components/
    │   ├── Nav.tsx               # Shared sticky nav (mobile hamburger)
    │   ├── AiTutor.tsx           # Streaming AI tutor panel
    │   ├── QuizModal.tsx         # Post-lesson quiz modal
    │   ├── NotesPanel.tsx        # Per-lesson notes panel
    │   ├── LessonView.tsx        # Lesson content renderer
    │   ├── LearnSidebar.tsx      # Left sidebar (search, categories, lessons)
    │   └── LessonPage.tsx        # Lesson layout wrapper
    ├── data/
    │   ├── curriculum.ts         # Lesson metadata (all 62 lessons)
    │   ├── types.ts              # Shared TypeScript types
    │   ├── quizzes.ts            # 186 MCQs (3 per lesson, original)
    │   ├── quizzes-extra.ts      # 124 additional MCQs (2 per lesson)
    │   ├── quizzes-all.ts        # Merged export (5 per lesson = 310 total)
    │   └── lessons/              # Full lesson content per category
    │       ├── ml.ts
    │       ├── deep-learning.ts
    │       ├── nlp.ts
    │       ├── llms.ts
    │       ├── rag.ts
    │       ├── cv.ts
    │       ├── mlops.ts
    │       └── interview.ts
    ├── lib/
    │   └── progress.ts           # All localStorage logic (XP, streaks, quizzes, bookmarks, notes)
    ├── .env.local                # GROQ_API_KEY (gitignored)
    ├── package.json
    ├── tailwind.config.ts
    └── tsconfig.json
```

---

## Curriculum

### 8 Categories — 62 Lessons

| Category | Lessons | Key Topics |
|---|---|---|
| Machine Learning | 12 | Gradient Descent, Bias-Variance, SVMs, XGBoost, PCA, K-Means, Evaluation Metrics |
| Deep Learning | 10 | Backprop, CNNs, RNNs/LSTMs, Autoencoders, GANs, Diffusion Models |
| NLP & Transformers | 8 | Tokenization, Word2Vec, BERT, GPT, Fine-tuning, Attention, NER |
| LLMs & Prompting | 8 | Prompt Engineering, RLHF, Tool Use, AI Agents, LangChain, Multi-Agent |
| RAG Systems | 7 | Chunking, Vector DBs, Embedding Models, Hybrid Search, Reranking, Agentic RAG |
| Computer Vision | 6 | Transfer Learning, Object Detection, Segmentation, ViT, Data Augmentation |
| MLOps | 6 | Deployment, Monitoring, Feature Stores, CI/CD, Data Pipelines |
| Interview Prep | 5 | ML / DL / NLP-LLM / System Design / MLOps Interview Questions |

---

## XP & Level System

| Action | XP |
|---|---|
| Complete a lesson | +100 XP |
| Correct quiz answer | +25 XP |
| Retake quiz (already done) | No XP (prevents farming) |

| Level | Name | XP Required |
|---|---|---|
| 1 | 🌱 Newcomer | 0 |
| 2 | 📚 Learner | 100 |
| 3 | 🔭 Explorer | 500 |
| 4 | 💻 Developer | 1,500 |
| 5 | ⚙️ Engineer | 3,500 |
| 6 | 🎯 Expert | 7,000 |
| 7 | 🏆 Master | 13,000 |

Maximum XP possible: 62 × 100 + 310 × 25 = **13,950 XP** (enough to reach Master)

### Badges (unlock by completing all lessons in a category)

| Badge | Category |
|---|---|
| 🤖 ML Scholar | Machine Learning |
| 🧠 Deep Thinker | Deep Learning |
| 💬 Language Master | NLP & Transformers |
| ✨ Prompt Engineer | LLMs & Prompting |
| 🔍 RAG Architect | RAG Systems |
| 👁️ Vision Expert | Computer Vision |
| 🚀 MLOps Pro | MLOps |
| 🎤 Job Ready | Interview Prep |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Groq](https://console.groq.com) API key (for the AI Tutor and RAG Tutor)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd "Ml Tutor/frontend"

# Install dependencies
npm install
```

### Environment Variables

Create `frontend/.env.local`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get a free API key at [console.groq.com](https://console.groq.com). The free tier is sufficient — the AI Tutor uses `llama-3.3-70b-versatile`.

> **Security note:** The API key is only used server-side in the Edge API route (`/api/chat`). It is never sent to the browser and is gitignored.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm run start
```

---

## AI Tutor — How It Works

The AI Tutor is accessible from any lesson page via the lightbulb icon in the top bar.

**Architecture:**
```
User message
    ↓
/api/chat (Next.js Edge Route)
    ↓
Groq SDK → llama-3.3-70b-versatile
    ↓
ReadableStream (streaming)
    ↓
AiTutor.tsx (reads stream, updates UI incrementally)
```

**System prompt** is dynamically constructed with the current lesson title and category, so the model knows exactly what topic is being studied.

**Suggestion buttons** appear on first open — "Explain simpler", "Give a Python example", "What are the real-world uses?", "Explain the math behind it" — for quick one-click prompts.

The RAG Tutor (`/rag-tutor`) uses the same API route but passes a `systemOverride` with the document context, making the model answer only from the uploaded document.

---

## API Reference

### `POST /api/chat`

Edge runtime endpoint for streaming LLM responses.

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "Explain gradient descent" }
  ],
  "lessonTitle": "Gradient Descent",
  "lessonCategory": "Machine Learning",
  "systemOverride": "Optional: replaces the default system prompt (used by RAG Tutor)"
}
```

**Response:** `text/plain` streaming body. Chunks are plain text deltas, concatenated by the client.

**Runtime:** Edge (Vercel Edge Functions compatible)

**Model:** `llama-3.3-70b-versatile` via Groq (free tier, ~100 tokens/sec)

---

## Progress Persistence

All user progress is stored in the browser's `localStorage` — no account, no database, no server.

| Key | Data |
|---|---|
| `aizen_completed_v2` | Array of completed lesson IDs |
| `aizen_streak_v2` | Current streak count |
| `aizen_last_day_v2` | Last active day (for streak calculation) |
| `aizen_quiz_xp` | Total quiz XP earned |
| `aizen_quiz_results` | Map of lessonId → quiz result (score, correct, total) |
| `aizen_bookmarks` | Array of bookmarked lesson IDs |
| `aizen_notes` | Map of lessonId → note text |
| `aizen_activity` | Map of date string → activity count (for heatmap) |

Progress resets if the user clears their browser storage. For persistent cross-device progress, a backend (Supabase, PlanetScale) could be added by replacing the `progress.ts` functions.

---

## Quiz System

**5 MCQs per lesson** (310 total across 62 lessons).

**Flow:**
1. User marks a lesson complete
2. 600ms delay → QuizModal opens automatically
3. Questions shown one at a time with a progress bar
4. Immediate feedback after each answer (green ✓ / red ✗ + explanation)
5. Results screen: score circle, grade (S/A/B/C), total XP earned
6. XP awarded only on first attempt per lesson (retakes show answers but give no XP)

**Grading:**
| Score | Grade |
|---|---|
| 5/5 | S |
| 4/5 | A |
| 3/5 | B |
| ≤2/5 | C |

**Quiz data structure** (`data/quizzes.ts` + `data/quizzes-extra.ts`):
```typescript
interface QuizQuestion {
  q: string
  options: [string, string, string, string]
  answer: number          // index of correct option (0–3)
  explanation: string
}

const QUIZZES: Record<string, QuizQuestion[]> = {
  "gradient-descent": [
    {
      q: "What does gradient descent minimize?",
      options: ["Model accuracy", "Number of parameters", "A loss/cost function", "The learning rate"],
      answer: 2,
      explanation: "Gradient descent iteratively updates parameters to minimize the loss function."
    },
    // ... 4 more questions
  ]
}
```

---

## Mobile Responsiveness

Every page is fully responsive with Tailwind CSS breakpoints:

| Component | Mobile | Desktop |
|---|---|---|
| Nav | Hamburger → 2-column grid drawer | Horizontal link bar |
| Learn sidebar | Hidden — opens as overlay | Fixed left panel (w-64) |
| AI Tutor | Bottom sheet (70vh) | Right panel (w-72/w-80) |
| Notes panel | Bottom sheet (h-96) | Right panel (w-64/w-72) |
| Dashboard rings | 2-col grid | 4-col grid |
| Projects grid | 1 col | 2 col |
| Interview filters | Wrap | Inline row |
| RAG Tutor | Stacked (input then chat) | Side-by-side grid |

---

## Deployment

### Live Deployment

The platform is fully live at **[https://ai-zen-tutor.vercel.app](https://ai-zen-tutor.vercel.app)** — deployed on Vercel with all features operational:

| Feature | Status |
|---|---|
| All 11 pages | ✅ Live |
| AI Tutor (Groq Llama 3.3 70B) | ✅ Live |
| RAG Document Tutor | ✅ Live |
| Quizzes, XP, Streaks, Badges | ✅ Live |
| Daily Challenge | ✅ Live |

### Deploy Your Own

```bash
# From the frontend directory
npx vercel --prod
```

Or connect your GitHub repository to Vercel via the dashboard.

**Required environment variable:**

In Vercel dashboard → **Settings** → **Environment Variables** → add:

| Name | Value | Environments |
|---|---|---|
| `GROQ_API_KEY` | your Groq API key | Production, Preview, Development |

Get a free key at [console.groq.com](https://console.groq.com). After adding the key, go to **Deployments** → redeploy for it to take effect.

The `/api/chat` route uses `export const runtime = "edge"` — it automatically deploys as a Vercel Edge Function with global low latency.

**All other pages are statically generated** — no server required for the UI, only for the AI chat endpoint.

### Other Platforms

Any platform that supports Next.js App Router works (Netlify, Railway, Render, self-hosted):

```bash
npm run build
npm run start   # runs on port 3000
```

Set `GROQ_API_KEY` as an environment variable on your platform.

---

## Development Notes

### Adding a New Lesson

1. Add the lesson metadata to `data/curriculum.ts`:
```typescript
{
  id: "my-new-lesson",
  title: "My New Lesson",
  category: "Machine Learning",
  difficulty: "Intermediate",
  duration: "20 min",
  xp: 100,
  description: "...",
  tags: ["tag1", "tag2"],
}
```

2. Add the lesson content to the appropriate `data/lessons/*.ts` file:
```typescript
"my-new-lesson": {
  content: `...markdown-like content...`,
  code: `...python code...`,
}
```

3. Add 5 quiz questions to `data/quizzes.ts` (3) and `data/quizzes-extra.ts` (2) using the lesson ID as the key.

### Adding a New Page

Create `app/your-page/page.tsx`. Import `Nav` from `@/components/Nav` for the shared navigation:

```typescript
import Nav from "@/components/Nav"

export default function YourPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* content */}
      </main>
    </div>
  )
}
```

### Groq API — Important Implementation Note

The Groq client **must be instantiated inside the request handler**, not at module level:

```typescript
// ✅ Correct — inside handler
export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  // ...
}

// ❌ Wrong — module level causes build failure
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
export async function POST(req: NextRequest) { ... }
```

This is because the Edge runtime evaluates environment variables lazily; accessing them at module load time during the build causes a `GROQ_API_KEY is missing or empty` error.

---

## Customization

### Changing the AI Model

In `app/api/chat/route.ts`, change the model string:

```typescript
const stream = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",  // change this
  // ...
})
```

Other free Groq models: `llama-3.1-8b-instant` (faster), `mixtral-8x7b-32768` (longer context).

### Changing XP Values

In `lib/progress.ts`:

```typescript
export const XP_PER_LESSON  = 100  // XP for completing a lesson
export const XP_PER_CORRECT = 25   // XP per correct quiz answer
```

### Adding New Quiz Questions

Edit `data/quizzes-extra.ts` and add/modify entries using the lesson ID as the key. The merged output (`data/quizzes-all.ts`) is what the `QuizModal` uses.

### Theming

CSS variables are defined in `app/globals.css`:

```css
:root {
  --bg:      #05050a;
  --surface: #0c0c14;
  --border:  rgba(255,255,255,0.07);
}
```

Change these to retheme the entire platform.

---

## License

MIT — free to use, modify, and distribute.

---

*Built with Next.js, Tailwind CSS, GSAP, and Groq.*
