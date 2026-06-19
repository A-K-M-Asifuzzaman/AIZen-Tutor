# AIZen Tutor

**A gamified AI/ML learning platform.** 62 in-depth lessons, 5 quizzes per lesson, an AI tutor powered by Groq, Firebase authentication, cross-device progress sync via MongoDB, a visual skill tree, ML project showcase, foundational research papers, interview prep hub, daily challenges, and a document RAG tutor — all in one dark-themed Next.js app.

---

## Live Demo

**[https://ai-zen-tutor.vercel.app](https://ai-zen-tutor.vercel.app)**

Deployed on Vercel. All 11 pages, the AI Tutor (Groq Llama 3.3 70B), Firebase Auth, and the RAG Tutor are fully live and operational.

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
| `/login` | Sign in — email/password or Google |
| `/register` | Create account — email/password or Google |

---

## Features

### Authentication (Firebase)
- **Email/Password** sign up and sign in
- **Google OAuth** — one-click sign in via Firebase
- **No account required** — app works fully as a guest; sign in to unlock cross-device sync
- User avatar and name displayed in the Nav when signed in
- Sign out from the Nav dropdown (desktop) or mobile drawer

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
- Progress stored in `localStorage` (instant, no latency) and synced to MongoDB (cross-device)

### Pages
| Page | URL |
|---|---|
| Home / Landing | `/` |
| Sign In | `/login` |
| Create Account | `/register` |
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
| Authentication | Firebase Authentication (Email/Password + Google OAuth) |
| Database | MongoDB Atlas — progress persistence |
| Auth Token Verification | Firebase Admin SDK (server-side) |
| Rendering | Static generation for all pages + Edge runtime for `/api/chat` |
| State | React `useState` / `useEffect` — no external state library |
| Progress Cache | `localStorage` (primary, instant) + MongoDB (sync, cross-device) |

---

## Project Structure

```
Ml Tutor/
└── frontend/
    ├── app/
    │   ├── page.tsx              # Home / landing page
    │   ├── layout.tsx            # Root layout (AuthProvider + ProgressSync)
    │   ├── globals.css           # CSS variables, animations, utilities
    │   ├── login/
    │   │   └── page.tsx          # Sign in (email/password + Google)
    │   ├── register/
    │   │   └── page.tsx          # Create account (email/password + Google)
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
    │       ├── chat/
    │       │   └── route.ts      # Groq streaming edge API
    │       └── progress/
    │           └── route.ts      # MongoDB progress sync (GET + POST)
    ├── components/
    │   ├── Nav.tsx               # Shared sticky nav with auth state (avatar, sign out)
    │   ├── AuthProvider.tsx      # Firebase auth context + useAuth() hook
    │   ├── ProgressSync.tsx      # Auto-syncs localStorage → MongoDB on interval
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
    │   ├── progress.ts           # XP, streaks, quizzes, bookmarks, notes + MongoDB sync
    │   ├── firebase.ts           # Firebase client SDK (auth)
    │   ├── firebase-admin.ts     # Firebase Admin SDK (server-side token verification)
    │   └── mongodb.ts            # MongoDB connection pooling
    ├── types/                    # TypeScript declaration files
    ├── .env.local                # API keys (gitignored)
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
- A free [Groq](https://console.groq.com) API key
- A [MongoDB Atlas](https://cloud.mongodb.com) free cluster (M0)
- A [Firebase](https://console.firebase.google.com) project with Authentication enabled

### Installation

```bash
git clone <your-repo-url>
cd "Ml Tutor/frontend"
npm install
```

### Environment Variables

Create `frontend/.env.local`:

```env
# AI
GROQ_API_KEY=your_groq_api_key_here

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/AIZen?appName=Cluster0

# Firebase — Client (NEXT_PUBLIC = safe to expose in browser)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase — Admin (server-side only, never exposed to browser)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → create a project
2. **Authentication** → **Sign-in method** → enable **Email/Password** and **Google**
3. **Project Settings** → **General** → **Your apps** → click `</>` → copy the `firebaseConfig` values into the `NEXT_PUBLIC_*` env vars
4. **Project Settings** → **Service accounts** → **Generate new private key** → copy `project_id`, `client_email`, and `private_key` into the `FIREBASE_*` env vars
5. **Authentication** → **Settings** → **Authorized domains** → add your production domain

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

## Authentication — How It Works

Firebase Authentication handles all identity on the client side. The server verifies tokens using the Firebase Admin SDK.

```
User signs in (email/password or Google)
    ↓
Firebase issues a signed JWT (ID token)
    ↓
Client attaches token in Authorization: Bearer <token> header
    ↓
/api/progress verifies token with Firebase Admin SDK
    ↓
Returns progress document keyed to Firebase UID
```

**Guest mode:** If the user is not signed in, progress uses an anonymous UUID stored in `localStorage`. Progress still syncs to MongoDB — under the UUID key instead of a Firebase UID. Signing in on a new device retrieves the Firebase-keyed progress.

**Nav:** When signed in, the Nav shows the user's avatar (photo or initials), name, and a dropdown with sign-out. When not signed in, "Sign In" and "Sign Up Free" buttons appear.

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
  "messages": [{ "role": "user", "content": "Explain gradient descent" }],
  "lessonTitle": "Gradient Descent",
  "lessonCategory": "Machine Learning",
  "systemOverride": "Optional: replaces the default system prompt (used by RAG Tutor)"
}
```

**Response:** `text/plain` streaming body. Chunks are plain text deltas.

**Runtime:** Edge (Vercel Edge Functions compatible)

**Model:** `llama-3.3-70b-versatile` via Groq (free tier, ~100 tokens/sec)

---

### `GET /api/progress?userId=xxx`

Fetch a user's progress document from MongoDB.

- If request includes `Authorization: Bearer <firebase-token>`, the Firebase UID is used (ignores `userId` param)
- Otherwise falls back to the `userId` query param (anonymous UUID)

### `POST /api/progress`

Upsert a user's full progress document.

**Request body:**
```json
{ "userId": "optional-uuid-for-guests", "data": { ...progressFields } }
```

- Authenticated requests: user ID resolved from Firebase token in Authorization header
- Guest requests: user ID from `userId` in body

---

## Progress Persistence

Progress uses a **hybrid localStorage + MongoDB** architecture:

- **localStorage** — primary store, instant reads/writes, no network latency
- **MongoDB** — background sync, cross-device persistence, survives browser clears

### How sync works

```
User action (complete lesson, quiz, bookmark, note)
    ↓
localStorage update (immediate)
    ↓ async, non-blocking
ProgressSync: syncs every 60s + on tab close
    ↓
POST /api/progress (with Firebase token if signed in)
    ↓
MongoDB AIZen.progress collection
```

On first page load, `ProgressSync` fetches from MongoDB and merges into localStorage — so returning users recover their full history automatically.

### localStorage keys

| Key | Data |
|---|---|
| `aizen_user_id` | Anonymous UUID (used when not signed in) |
| `aizen_completed_v2` | Array of completed lesson IDs |
| `aizen_streak_v2` | Current streak count |
| `aizen_last_day_v2` | Last active day (for streak calculation) |
| `aizen_quiz_xp` | Total quiz XP earned |
| `aizen_quiz_<lessonId>` | Quiz result per lesson (score, correct, total) |
| `aizen_bookmarks` | Array of bookmarked lesson IDs |
| `aizen_note_<lessonId>` | Note text per lesson |
| `aizen_activity` | Map of `"YYYY-MM-DD"` → activity count (heatmap) |

### MongoDB schema

One document per user in the `AIZen.progress` collection:

```typescript
{
  _id:         string,        // Firebase UID (signed in) or anonymous UUID (guest)
  completed:   string[],
  streak:      number,
  lastDay:     string,
  quizXP:      number,
  quizResults: Record<string, { score: number, correct: number, total: number }>,
  bookmarks:   string[],
  notes:       Record<string, string>,
  activity:    Record<string, number>,  // "2026-06-17" → count
  updatedAt:   Date,
}
```

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

---

## Mobile Responsiveness

Every page is fully responsive with Tailwind CSS breakpoints:

| Component | Mobile | Desktop |
|---|---|---|
| Nav | Hamburger → 2-column grid drawer + auth row | Horizontal link bar + avatar dropdown |
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

The platform is fully live at **[https://ai-zen-tutor.vercel.app](https://ai-zen-tutor.vercel.app)**:

| Feature | Status |
|---|---|
| All 13 pages (incl. login + register) | ✅ Live |
| Firebase Auth (email/password + Google) | ✅ Live |
| AI Tutor (Groq Llama 3.3 70B) | ✅ Live |
| RAG Document Tutor | ✅ Live |
| MongoDB progress sync | ✅ Live |
| Quizzes, XP, Streaks, Badges | ✅ Live |
| Daily Challenge | ✅ Live |

### Deploy Your Own

```bash
npx vercel --prod
```

**Environment variables to add in Vercel → Settings → Environment Variables:**

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key for AI Tutor |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase client config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase client config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase client config |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase client config |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase client config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase client config |
| `FIREBASE_PROJECT_ID` | Firebase Admin (server-side) |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin service account email |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin private key (paste with quotes) |

> After adding env vars, go to **Deployments** → **Redeploy** for them to take effect.

The `/api/chat` route uses `export const runtime = "edge"` — deployed as a Vercel Edge Function with global low latency. All other pages are statically generated.

---

## Development Notes

### Adding a New Lesson

1. Add metadata to `data/curriculum.ts`
2. Add content to the appropriate `data/lessons/*.ts` file
3. Add 5 quiz questions to `data/quizzes.ts` (3) and `data/quizzes-extra.ts` (2)

### Adding a New Page

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

### Groq API — Important Note

The Groq client must be instantiated **inside the request handler**, not at module level — Edge runtime evaluates env vars lazily:

```typescript
// ✅ Correct
export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
}

// ❌ Wrong — causes build failure on Edge runtime
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
```

### Firebase Private Key in Vercel

When adding `FIREBASE_PRIVATE_KEY` to Vercel, paste the full key **including** the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines, wrapped in double quotes. Vercel preserves newlines in multiline env vars correctly.

---

## Customization

### Changing the AI Model

In `app/api/chat/route.ts`:
```typescript
model: "llama-3.3-70b-versatile"  // change to any Groq model
```
Other free Groq models: `llama-3.1-8b-instant` (faster), `mixtral-8x7b-32768` (longer context).

### Changing XP Values

In `lib/progress.ts`:
```typescript
export const XP_PER_LESSON  = 100
export const XP_PER_CORRECT = 25
```

### Theming

CSS variables in `app/globals.css`:
```css
:root {
  --bg:      #05050a;
  --surface: #0c0c14;
  --border:  rgba(255,255,255,0.07);
}
```

---

## License

MIT — free to use, modify, and distribute.

---

*Built with Next.js, Firebase, MongoDB, Tailwind CSS, GSAP, and Groq.*
     