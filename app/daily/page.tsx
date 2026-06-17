"use client"
import { useMemo, useState } from "react"
import Nav from "@/components/Nav"

const ML_QUESTIONS = [
  { q: "What is the difference between L1 and L2 regularization?", a: "L1 (Lasso) adds |w| penalty — produces sparse weights by driving some to exactly zero, useful for feature selection. L2 (Ridge) adds w² penalty — shrinks all weights toward zero but rarely to exactly zero, better when all features contribute. L1 is robust to outliers in feature space; L2 handles correlated features better." },
  { q: "Explain the curse of dimensionality.", a: "As dimensionality increases, the volume of space grows so fast that data becomes sparse. Distance metrics become less meaningful (all points become equidistant). You need exponentially more data to maintain the same density. PCA, autoencoders, and feature selection fight this. Rule of thumb: need 5–10× more data per additional feature." },
  { q: "What is cross-entropy loss and when is it used?", a: "Cross-entropy = -Σ y_i log(ŷ_i). For binary: -[y log(ŷ) + (1-y) log(1-ŷ)]. Used for classification tasks where output is a probability distribution. Measures divergence between true and predicted distributions. Strongly penalizes confident wrong predictions (log of near-zero number → large loss)." },
  { q: "How do you handle imbalanced classes?", a: "1. Resampling: SMOTE (oversample minority), random undersampling majority. 2. Class weights: pass class_weight='balanced' to sklearn. 3. Threshold tuning: adjust decision threshold from 0.5. 4. Evaluation: use F1, AUC-ROC, PR curve — not accuracy. 5. Specialized algorithms: BalancedRandomForest, EasyEnsemble." },
  { q: "What is the difference between generative and discriminative models?", a: "Discriminative: learn P(y|x) directly — the decision boundary. Examples: logistic regression, SVM, BERT. Generative: learn P(x,y) = P(x|y)P(y) — model how data is generated. Examples: Naive Bayes, GMM, VAE, GANs. Generative can generate new samples; discriminative usually has better classification accuracy." },
  { q: "Explain the EM algorithm.", a: "Expectation-Maximization for models with latent variables. E-step: compute expected values of latent variables given current parameters (soft assignments). M-step: maximize log-likelihood to update parameters. Repeat until convergence. Used in: GMM fitting, Hidden Markov Models, K-means is a hard-assignment version. Converges to local optimum, not guaranteed global." },
  { q: "What is the kernel trick in SVMs?", a: "Kernel trick allows SVMs to operate in high-dimensional feature spaces without explicitly computing the transformation. K(x,z) = φ(x)·φ(z) computes dot products in transformed space efficiently. Common kernels: RBF (Gaussian), polynomial, sigmoid. RBF maps to infinite-dimensional space. Allows linear SVM to learn non-linear boundaries." },
]

const CODING_QUESTIONS = [
  { q: "Write a function to compute cosine similarity between two vectors.", a: "Cosine similarity = (A·B) / (|A| × |B|). Ranges from -1 to 1, where 1 means identical direction, 0 means orthogonal, -1 means opposite.", code: `import numpy as np

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

# Test
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(cosine_similarity(a, b))  # 0.9746` },
  { q: "Implement a confusion matrix from scratch.", a: "Confusion matrix: rows are true classes, columns are predicted classes. For binary: TP=true positive, TN=true negative, FP=false positive, FN=false negative.", code: `import numpy as np

def confusion_matrix(y_true, y_pred, n_classes=None):
    if n_classes is None:
        n_classes = max(max(y_true), max(y_pred)) + 1
    cm = np.zeros((n_classes, n_classes), dtype=int)
    for t, p in zip(y_true, y_pred):
        cm[t][p] += 1
    return cm

y_true = [0, 1, 1, 0, 1, 0]
y_pred = [0, 1, 0, 0, 1, 1]
print(confusion_matrix(y_true, y_pred))
# [[2 1]
#  [1 2]]` },
  { q: "Implement mini-batch gradient descent.", a: "Mini-batch GD splits training data into small batches (typically 32–256). For each batch, compute gradient and update weights. Combines benefits of SGD (faster, regularizing) and full GD (more stable).", code: `import numpy as np

def mini_batch_gd(X, y, lr=0.01, epochs=100, batch_size=32):
    n, m = X.shape
    w = np.zeros(m)
    b = 0.0
    losses = []

    for epoch in range(epochs):
        indices = np.random.permutation(n)
        X_shuf, y_shuf = X[indices], y[indices]
        epoch_loss = 0

        for i in range(0, n, batch_size):
            X_b = X_shuf[i:i+batch_size]
            y_b = y_shuf[i:i+batch_size]
            pred = X_b @ w + b
            error = pred - y_b
            w -= lr * X_b.T @ error / len(y_b)
            b -= lr * error.mean()
            epoch_loss += (error ** 2).mean()

        losses.append(epoch_loss)
    return w, b, losses` },
  { q: "Write a function to calculate BLEU score for NLP evaluation.", a: "BLEU (Bilingual Evaluation Understudy) measures n-gram overlap between generated and reference text. BP is brevity penalty for short outputs.", code: `from collections import Counter
import math

def bleu_score(reference: str, hypothesis: str, n: int = 4) -> float:
    ref_tokens = reference.lower().split()
    hyp_tokens = hypothesis.lower().split()

    scores = []
    for k in range(1, n + 1):
        ref_ngrams = Counter(tuple(ref_tokens[i:i+k]) for i in range(len(ref_tokens)-k+1))
        hyp_ngrams = Counter(tuple(hyp_tokens[i:i+k]) for i in range(len(hyp_tokens)-k+1))

        clip = sum(min(count, ref_ngrams[ng]) for ng, count in hyp_ngrams.items())
        total = sum(hyp_ngrams.values())
        scores.append(clip / total if total > 0 else 0)

    bp = min(1.0, len(hyp_tokens) / len(ref_tokens))
    geom_mean = math.exp(sum(math.log(s + 1e-10) for s in scores) / n)
    return bp * geom_mean` },
  { q: "Implement early stopping for neural network training.", a: "Early stopping monitors validation loss; if it doesn't improve for `patience` epochs, stop training and restore best weights.", code: `class EarlyStopping:
    def __init__(self, patience=5, min_delta=1e-4):
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.best_loss = float('inf')
        self.best_weights = None
        self.stop = False

    def __call__(self, val_loss, model):
        if val_loss < self.best_loss - self.min_delta:
            self.best_loss = val_loss
            self.best_weights = {k: v.clone() for k, v in model.state_dict().items()}
            self.counter = 0
        else:
            self.counter += 1
            if self.counter >= self.patience:
                model.load_state_dict(self.best_weights)
                self.stop = True` },
  { q: "Implement attention mechanism from scratch in NumPy.", a: "Scaled dot-product attention: Attention(Q,K,V) = softmax(QK^T/√d_k)V", code: `import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.shape[-1]
    scores = Q @ K.transpose(-2, -1) / np.sqrt(d_k)

    if mask is not None:
        scores = np.where(mask == 0, -1e9, scores)

    # Softmax along last axis
    scores_max = np.max(scores, axis=-1, keepdims=True)
    exp_scores = np.exp(scores - scores_max)
    weights = exp_scores / exp_scores.sum(axis=-1, keepdims=True)

    return weights @ V, weights

# Example
seq_len, d_model = 5, 8
Q = np.random.randn(seq_len, d_model)
K = np.random.randn(seq_len, d_model)
V = np.random.randn(seq_len, d_model)
output, weights = scaled_dot_product_attention(Q, K, V)
print("Output shape:", output.shape)  # (5, 8)` },
]

const INTERVIEW_QUESTIONS = [
  { q: "Tell me about a time you improved a model's performance significantly.", a: "Structure with STAR: Situation (what was the problem/baseline), Task (what you needed to achieve), Action (specific techniques: feature engineering, architecture change, better data), Result (quantified improvement). Example: 'Baseline XGBoost gave 78% F1. I added time-series features, tuned with Optuna, and used SMOTE for class imbalance → 91% F1 with 3× faster inference using pruned trees.'" },
  { q: "How do you explain a complex ML model to a non-technical stakeholder?", a: "Use analogies: 'The model is like a very experienced loan officer who has seen 100,000 applications and learned what patterns lead to default.' Focus on inputs and outputs, not internals. Show SHAP plots visually. Emphasize uncertainty: 'The model is 85% confident.' Frame around business value: 'This reduces manual review time by 60%.' Avoid jargon — replace 'F1 score' with 'correctly caught 90 out of 100 fraud cases.'" },
  { q: "What do you do when your model works in development but fails in production?",
    a: "Step 1: Check data distribution — is production data different from training data? (feature drift). Step 2: Check preprocessing pipeline — is inference preprocessing identical to training? Step 3: Log everything — inputs, outputs, latency, errors. Step 4: Check for data leakage in training that isn't available in production. Step 5: Set up shadow mode — run new model in parallel without serving results. Step 6: A/B test carefully. Root cause is usually: train/serve skew, data drift, or a preprocessing bug." },
  { q: "How would you approach building an ML system from scratch for a new domain?",
    a: "1. Understand the problem: what's the business metric? What does success look like? 2. Collect and understand data: EDA, distributions, missing values, class balance. 3. Start simple: logistic regression / decision tree baseline. 4. Iterate: feature engineering, better models, hyperparameter tuning. 5. Evaluation: pick the right metric (accuracy? recall? AUC?). 6. Error analysis: look at failure cases — what patterns exist? 7. Production: monitoring, drift detection, retraining pipeline." },
  { q: "Explain a project where you used NLP and what challenges you faced.",
    a: "Structure: project goal → dataset → approach (preprocessing, model choice) → challenges → results. Common challenges to mention: imbalanced labels, noisy text (social media), multilingual content, domain-specific jargon (medical/legal), annotation disagreement (low inter-annotator agreement), inference latency requirements, model size constraints for deployment." },
  { q: "What are your strengths and weaknesses as an ML engineer?",
    a: "Strengths: focus on what makes you unique (RAG systems, NLP, production ML, research-to-production translation). Be specific with examples. Weaknesses: pick a genuine area you're improving that isn't critical to the role. E.g., 'I used to over-engineer solutions — I've learned to prototype fast and iterate rather than build the perfect system upfront.' Show self-awareness and growth mindset." },
  { q: "Where do you see LLMs in 5 years?",
    a: "Strong answer: 1. Multimodal by default (vision, audio, video). 2. Smaller, specialized models dominate enterprise (7B fine-tuned > 70B general for specific tasks). 3. Agents become mainstream — LLMs orchestrate tool calls autonomously. 4. Better reasoning with RL-from-verifiers (o1-style). 5. Real-time, always-on personal AI with long-term memory. 6. Regulatory pressure forces explainability, watermarking. Show you've thought about this with concrete examples." },
]

function getDayIndex(arr: unknown[]) {
  const day = Math.floor(Date.now() / 86_400_000)
  return day % arr.length
}

export default function DailyPage() {
  const [showML, setShowML]         = useState(false)
  const [showCode, setShowCode]     = useState(false)
  const [showInterview, setShowInterview] = useState(false)

  const mlQ        = useMemo(() => ML_QUESTIONS[getDayIndex(ML_QUESTIONS)], [])
  const codeQ      = useMemo(() => CODING_QUESTIONS[getDayIndex(CODING_QUESTIONS)], [])
  const interviewQ = useMemo(() => INTERVIEW_QUESTIONS[getDayIndex(INTERVIEW_QUESTIONS)], [])

  const today = new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" })

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Nav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}>
            🔥 Daily Challenge
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Today's Challenge</h1>
          <p className="text-zinc-500 text-sm">{today} — Questions rotate every 24 hours. Come back tomorrow for new ones.</p>
        </div>

        <div className="space-y-4">
          {/* ML Theory */}
          <ChallengeCard
            icon="🧠" label="ML Theory" color="#a78bfa"
            question={mlQ.q} answer={mlQ.a}
            show={showML} onToggle={() => setShowML((v) => !v)}
          />

          {/* Coding */}
          <ChallengeCard
            icon="💻" label="Coding Challenge" color="#34d399"
            question={codeQ.q} answer={codeQ.a} code={codeQ.code}
            show={showCode} onToggle={() => setShowCode((v) => !v)}
          />

          {/* Interview */}
          <ChallengeCard
            icon="🎤" label="Interview Question" color="#fb923c"
            question={interviewQ.q} answer={interviewQ.a}
            show={showInterview} onToggle={() => setShowInterview((v) => !v)}
          />
        </div>

        {/* Streak reminder */}
        <div className="mt-8 p-4 rounded-xl flex items-center gap-3"
          style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)" }}>
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-sm font-semibold text-white">Keep your streak alive</p>
            <p className="text-xs text-zinc-500">Visit the <a href="/learn" className="text-violet-400 hover:underline">Learn</a> page and complete at least one lesson to maintain your streak.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

function ChallengeCard({
  icon, label, color, question, answer, code, show, onToggle,
}: {
  icon: string; label: string; color: string;
  question: string; answer: string; code?: string;
  show: boolean; onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "var(--surface)", border: `1px solid ${show ? color + "30" : "rgba(255,255,255,0.07)"}` }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}>
                {label}
              </span>
              <p className="text-sm sm:text-base font-bold text-white mt-1.5 leading-snug">{question}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 flex items-center justify-between">
        <button onClick={onToggle}
          className="text-xs font-medium flex items-center gap-1.5 transition-opacity hover:opacity-80"
          style={{ color }}>
          {show ? "Hide Answer ▲" : "Reveal Answer ▼"}
        </button>
        <span className="text-xs text-zinc-600">Think first, then reveal</span>
      </div>

      {show && (
        <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-sm text-zinc-400 leading-relaxed pt-3">{answer}</p>
          {code && (
            <pre className="text-xs text-zinc-300 p-3.5 rounded-xl overflow-x-auto leading-relaxed"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <code>{code}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
