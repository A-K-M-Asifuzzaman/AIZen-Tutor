# AIZen Tutor

A gamified AI/ML learning platform — 62 in-depth lessons, XP & leveling, quizzes, progress tracking, bookmarks, and notes. Built with Next.js 16, GSAP, and TypeScript. Fully static — no backend, no API keys, no signup required.

---

## Features

| Feature | Details |
|---|---|
| **62 Lessons** | 8 categories: ML, DL, NLP, LLMs, RAG, CV, MLOps, Interview Prep |
| **XP & Levels** | 100 XP per lesson + 25 XP per correct quiz answer. 7 levels: Newcomer → Master |
| **Quiz System** | 3 MCQs per lesson with explanations and bonus XP. Auto-opens after completing a lesson |
| **Daily Streak** | Tracks consecutive study days |
| **8 Badges** | Unlocked by completing every lesson in a category |
| **Progress Dashboard** | Category rings, activity heatmap, quiz stats, badge gallery |
| **Bookmarks** | Save any lesson; view all bookmarks in the dashboard |
| **Notes** | Per-lesson notes panel (⌘S to save); all notes visible in the dashboard |
| **GSAP Animations** | Scroll-reveal on the landing page, smooth lesson transitions |
| **Python Syntax Highlight** | Built-in tokenizer with one-click copy on every code block |
| **100% Local** | All data in `localStorage` — works offline, no account required |

---

## Tech Stack

- **Framework** — Next.js 16 (App Router, static export)
- **Language** — TypeScript (strict)
- **Styling** — Tailwind CSS v3
- **Animations** — GSAP 3 + ScrollTrigger
- **Data** — `localStorage` (no database required)
- **Deployment** — Static site (Vercel, Netlify, GitHub Pages)

---

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout, fonts, globals
│   ├── page.tsx            # Landing page (GSAP animated)
│   ├── learn/page.tsx      # Main learning interface
│   └── dashboard/page.tsx  # Progress dashboard
├── components/
│   ├── LearnSidebar.tsx    # Lesson list with category progress bars
│   ├── LessonView.tsx      # Lesson reader with code blocks
│   ├── QuizModal.tsx       # Post-lesson MCQ quiz
│   └── NotesPanel.tsx      # Per-lesson notes (slide-in panel)
├── data/
│   ├── curriculum.ts       # 62 lessons with full content
│   └── quizzes.ts          # 186 MCQ questions (3 per lesson)
├── lib/
│   └── progress.ts         # XP, levels, streaks, bookmarks, notes, activity
└── app/globals.css         # CSS variables, animations, XP bar
```

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
# → http://localhost:3000

# Production build
npm run build
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with animated hero, curriculum overview, feature cards |
| `/learn` | Main learning UI — sidebar, lesson reader, quiz, notes |
| `/dashboard` | Progress dashboard — XP, streaks, heatmap, category rings, badges |

---

## Learning Flow

```
1. Open /learn
2. Pick a lesson from the sidebar
3. Read the lesson content + Python code examples
4. Click "Mark as Complete" → earn 100 XP + lesson recorded
5. Quiz modal opens automatically → answer 3 MCQs → earn up to 75 bonus XP
6. Bookmark lessons with the ★ icon to revisit them later
7. Open the notes panel (pencil icon in topbar) to take personal notes
8. View full progress at /dashboard
```

---

## Lesson Categories

| Category | Lessons | Topics |
|---|---|---|
| Machine Learning | 12 | Gradient Descent, XGBoost, SVMs, PCA, Feature Engineering |
| Deep Learning | 10 | Backprop, CNNs, LSTMs, GANs, Diffusion Models |
| NLP & Transformers | 8 | Attention, BERT, GPT, LoRA, Fine-tuning |
| LLMs & Prompting | 8 | Agents, RLHF, Tool Use, LangChain, Multi-Agent |
| RAG Systems | 7 | Chunking, Vector DBs, Reranking, Hybrid Search |
| Computer Vision | 6 | YOLO, ViT, Segmentation, Transfer Learning |
| MLOps | 6 | Docker, CI/CD, Drift Detection, Feature Stores |
| Interview Prep | 5 | ML System Design, FAANG Q&A, DL/NLP interviews |

---

## XP & Leveling

| Level | XP Required | Emoji |
|---|---|---|
| Newcomer | 0 | 🌱 |
| Learner | 100 | 📚 |
| Explorer | 500 | 🔭 |
| Developer | 1,500 | 💻 |
| Engineer | 3,500 | ⚙️ |
| Expert | 7,000 | 🎯 |
| Master | 13,000 | 🏆 |

Complete all 62 lessons + all quizzes = **7,850 XP** (Expert level).

---

## Deployment

The app is a fully static Next.js build — deploy anywhere:

```bash
npm run build
# Output: .next/ (deploy with `next start`) or configure static export in next.config.js
```

**Vercel** (recommended): connect the `frontend/` directory as the root.

---

## License

MIT — free for personal and commercial use.
