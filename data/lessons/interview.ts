import type { Lesson } from "../types"

export const INTERVIEW_LESSONS: Lesson[] = [
  {
    id: "ml-interview-questions",
    title: "ML Interview Questions",
    category: "Interview Prep",
    content: [
      {
        heading: "Q: What is the bias-variance tradeoff?",
        body: "Model error = Bias² + Variance + Irreducible Noise.\n\nBias: error from wrong assumptions → underfitting. Model too simple.\nVariance: error from sensitivity to training data → overfitting. Model too complex.\n\nFix high bias: more complex model, more features, reduce regularization.\nFix high variance: more data, regularization (L1/L2/dropout), simpler model, cross-validation.",
      },
      {
        heading: "Q: Explain gradient descent and its variants.",
        body: "Gradient descent minimizes loss by updating weights in the negative gradient direction: w ← w - α∇L.\n\nBatch GD: uses full dataset. Accurate but slow.\nSGD: one sample per update. Fast but noisy.\nMini-batch: batch of 32-512 samples. Best of both — used in practice.\n\nAdam = momentum + adaptive learning rates. Best default optimizer for deep learning.",
      },
      {
        heading: "Q: How do you handle class imbalance?",
        body: "Data level:\n• Oversample minority (SMOTE — Synthetic Minority Oversampling Technique)\n• Undersample majority (random or Tomek links)\n• Generate synthetic data\n\nAlgorithm level:\n• Class weights in loss function (class_weight='balanced' in sklearn)\n• Focal Loss — down-weights easy examples\n• Threshold tuning (instead of default 0.5)\n\nEvaluation: never use accuracy. Use F1, AUC-ROC, or PR-AUC.",
        code: `from sklearn.utils.class_weight import compute_class_weight
from imblearn.over_sampling import SMOTE
import numpy as np

# Method 1: Class weights
y = np.array([0]*900 + [1]*100)  # 9:1 imbalance
weights = compute_class_weight("balanced", classes=np.unique(y), y=y)
class_weight_dict = {0: weights[0], 1: weights[1]}
print(f"Class weights: {class_weight_dict}")  # {0: 0.556, 1: 5.0}

# Method 2: SMOTE oversampling
X = np.random.randn(1000, 10)
smote = SMOTE(sampling_strategy=0.5, random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)
print(f"Before: {np.bincount(y)}")
print(f"After SMOTE: {np.bincount(y_resampled)}")`,
      },
      {
        heading: "Q: What is regularization and why do we need it?",
        body: "Regularization adds a penalty to the loss function to prevent overfitting by discouraging large weights.\n\nL1 (Lasso): penalty = λ·Σ|wᵢ|. Drives some weights to exactly zero → feature selection. Sparse models.\n\nL2 (Ridge): penalty = λ·Σwᵢ². Shrinks all weights toward zero, keeps all features. Smoother models.\n\nElastic Net: L1 + L2 combined. Best of both.\n\nDropout: randomly zeroes neurons. Neural network specific. Forces redundant representations.",
      },
      {
        heading: "Q: Explain cross-validation. Why is it important?",
        body: "A single train/test split is unreliable — result depends on the luck of the split. K-Fold CV:\n1. Split data into K equal folds\n2. Train on K-1 folds, evaluate on the remaining fold\n3. Repeat K times (each fold is the val set once)\n4. Average K scores\n\nResult: much lower variance estimate of true model performance. K=5 or K=10 is standard. Always use StratifiedKFold for classification.",
      },
      {
        heading: "Q: What is the difference between precision and recall?",
        body: "Precision = TP / (TP + FP) — Of everything I labeled positive, what fraction is actually positive? Measures false alarm rate.\n\nRecall = TP / (TP + FN) — Of all actual positives, what fraction did I catch? Measures how much I miss.\n\nPrecision-Recall tradeoff: increasing one decreases the other. Choose based on the cost of each error:\n• Medical screening → maximize recall (don't miss cancer)\n• Spam detection → maximize precision (don't block real emails)\n• Both matter → use F1 = harmonic mean",
      },
    ],
  },
  {
    id: "dl-interview-questions",
    title: "Deep Learning Interview Questions",
    category: "Interview Prep",
    content: [
      {
        heading: "Q: Explain backpropagation.",
        body: "Backpropagation computes gradients of the loss with respect to all weights using the chain rule. Two passes:\n\nForward: compute activations layer by layer, cache intermediate values.\nBackward: starting from the loss, propagate ∂L/∂w backward using ∂L/∂wᵢ = ∂L/∂aⱼ · ∂aⱼ/∂zⱼ · ∂zⱼ/∂wᵢ.\n\nFinally: w ← w - α·∂L/∂w. PyTorch autograd does this automatically via loss.backward().",
      },
      {
        heading: "Q: What is the vanishing gradient problem?",
        body: "In deep networks, gradients are multiplied by the derivative of activation functions at each layer during backpropagation. Sigmoid derivative ≤ 0.25, so after 10 layers: 0.25¹⁰ ≈ 0.000001 — gradients vanish.\n\nSolutions:\n• ReLU activation — derivative is 1 for positive values (no shrinkage)\n• Residual connections (ResNets) — gradients bypass layers via skip connections\n• Batch normalization — re-normalizes activations\n• Gradient clipping — caps gradient norm\n• LSTM gates — control gradient flow in RNNs",
      },
      {
        heading: "Q: What is Batch Normalization and why does it help?",
        body: "BatchNorm normalizes layer inputs across the batch to have zero mean and unit variance, then applies learned scale (γ) and shift (β):\nx̂ = (x - μ_B) / √(σ²_B + ε); y = γ·x̂ + β\n\nBenefits:\n• Reduces internal covariate shift → stable training\n• Allows much higher learning rates\n• Acts as mild regularizer (adds noise via batch statistics)\n• Reduces sensitivity to weight initialization\n\nImportant: model.eval() uses running statistics from training, not batch statistics.",
      },
      {
        heading: "Q: CNN vs RNN — when to use which?",
        body: "CNNs: best for data with spatial or local structure (images, audio spectrograms). Translation invariant — same pattern detected anywhere. Parallelizable.\n\nRNNs/LSTMs: best for sequential data with temporal dependencies (time series, text, audio). Handles variable-length sequences. Sequential computation (slower).\n\nToday: Transformers have largely replaced LSTMs for NLP. For images: Vision Transformers (ViT) compete with CNNs. But CNNs still win on small datasets and edge devices.",
      },
      {
        heading: "Q: Explain the attention mechanism in Transformers.",
        body: "Attention computes a weighted sum of values (V) based on similarity between queries (Q) and keys (K):\n\nAttention(Q,K,V) = softmax(QKᵀ / √d_k) · V\n\nQ·Kᵀ: similarity between every pair of positions → (seq_len × seq_len) scores\n√d_k: scaling to prevent softmax saturation\nsoftmax: normalize to probabilities (attention weights)\n·V: weighted combination of value vectors\n\nMulti-head: run H parallel attentions with different projections, concatenate results. Each head learns different relationships (syntax, semantics, coreference).",
      },
      {
        heading: "Q: How do you prevent overfitting in neural networks?",
        body: "1. More data or data augmentation\n2. Dropout — randomly zero neurons (p=0.1-0.5)\n3. L1/L2 regularization (weight_decay in PyTorch)\n4. Batch Normalization — mild regularization effect\n5. Early stopping — stop when validation loss stops improving\n6. Reduce model capacity (fewer layers/neurons)\n7. Transfer learning — pretrained features are already generalizable\n8. Label smoothing — soft targets instead of hard 0/1",
      },
    ],
  },
  {
    id: "nlp-llm-interview",
    title: "NLP & LLM Interview Questions",
    category: "Interview Prep",
    content: [
      {
        heading: "Q: BERT vs GPT — key differences?",
        body: "BERT (encoder-only): bidirectional, reads full sequence at once. Pretrained with Masked Language Modeling. Best for: classification, NER, QA, embeddings.\n\nGPT (decoder-only): left-to-right, causal attention mask. Pretrained with next-token prediction. Best for: text generation, summarization, chat.\n\nBERT knows context from both directions → richer representations for understanding.\nGPT generates autoregressively → natural for open-ended generation.",
      },
      {
        heading: "Q: What is RLHF and how does it work?",
        body: "RLHF (Reinforcement Learning from Human Feedback) aligns LLMs with human preferences in 3 steps:\n\n1. SFT (Supervised Fine-Tuning): fine-tune base LLM on human-written demonstrations.\n2. Reward Model: humans rank K model outputs; train a reward model to predict preferences.\n3. PPO: optimize SFT model to maximize reward model score + KL penalty to stay close to SFT baseline.\n\nDPO (Direct Preference Optimization) skips the reward model — directly optimizes on preference pairs. Simpler, stable, now preferred over PPO.",
      },
      {
        heading: "Q: What are the key failure modes of LLMs?",
        body: "Hallucination: generating confident but false information. Mitigated by RAG, grounding, chain-of-thought.\n\nKnowledge cutoff: can't access events after training data cutoff. Mitigated by RAG, tool use (web search).\n\nContext window limits: can't process arbitrarily long documents. Mitigated by chunking, summarization, hierarchical retrieval.\n\nPrompt injection: malicious inputs override system prompt instructions. Mitigated by input validation, sandboxing.\n\nSycophancy: model agrees with user even when wrong. Mitigated by adversarial RLHF, debate techniques.",
      },
      {
        heading: "Q: Explain RAG and when to use it vs fine-tuning.",
        body: "RAG (Retrieval-Augmented Generation): retrieve relevant docs from a vector DB, inject into prompt.\n+ No training cost, instantly updatable, verifiable (can cite sources)\n− Adds retrieval latency, limited by context window, requires good retrieval\n\nFine-tuning: bake knowledge into model weights.\n+ No retrieval overhead, can change model style/behavior\n− Expensive, hard to update, still hallucinates\n\nUse RAG when: knowledge changes frequently, answers need citations, private/enterprise data.\nUse fine-tuning when: changing response format/tone, specific domain vocabulary, latency-critical.",
      },
      {
        heading: "Q: What is LoRA and why is it important?",
        body: "LoRA (Low-Rank Adaptation) fine-tunes LLMs by injecting trainable low-rank matrices into existing layers:\n\nW' = W₀ + ΔW = W₀ + B·A\n\nWhere A ∈ R^{r×d}, B ∈ R^{d×r}, r << d (rank, e.g., 8 or 16)\n\nOnly A and B are trained — typically 0.1-1% of original parameters. Achieves results comparable to full fine-tuning at a tiny fraction of the compute cost.\n\nQLoRA extends this with 4-bit quantization of the frozen base model — enables fine-tuning 7B-70B models on a single consumer GPU.",
      },
    ],
  },
  {
    id: "system-design-ml",
    title: "ML System Design",
    category: "Interview Prep",
    content: [
      {
        heading: "How to Approach ML System Design",
        body: "Framework for any ML system design question:\n\n1. Clarify requirements (online/batch? latency? scale? accuracy vs speed?)\n2. Define the ML problem (formulation, labels, metrics)\n3. Data collection & pipeline\n4. Feature engineering\n5. Model selection & training\n6. Evaluation & offline testing\n7. Serving infrastructure\n8. Online A/B testing\n9. Monitoring & retraining",
      },
      {
        heading: "Design: Recommendation System",
        body: "Problem: recommend items to users (Netflix, YouTube, Amazon).\n\nFormulation: rank items by predicted engagement (click, watch, purchase).\n\nData: user-item interaction matrix, item features (genre, price), user features (age, history).\n\nTwo-stage architecture:\n1. Candidate Generation (recall): fast retrieval of ~1000 relevant items from millions. Matrix factorization, two-tower neural network.\n2. Ranking (precision): score and rank 1000 candidates with a richer model. Wide & Deep, gradient boosting.\n\nKey features: user history, item popularity, collaborative filtering signals, recency.\n\nMetrics: Precision@K, NDCG, click-through rate, watch time (business metric).",
      },
      {
        heading: "Design: Real-Time Fraud Detection",
        body: "Problem: classify each transaction as fraudulent in <50ms.\n\nChallenges: extreme class imbalance (0.1% fraud), concept drift (fraud patterns change), adversarial (fraudsters adapt).\n\nArchitecture:\n• Feature store: pre-computed user behavior features (avg spend, velocity, location history)\n• Real-time features: time since last transaction, transaction amount deviation\n• Two-model ensemble: fast heuristic rules + gradient boosted model\n• Human review queue: borderline cases flagged for analyst review\n\nMetrics: precision/recall (tune threshold), $ saved, false positive rate (customer experience).",
      },
      {
        heading: "Design: Semantic Search Engine",
        body: "Problem: return relevant documents for natural language queries.\n\nArchitecture:\n\nOffline (indexing):\n1. Crawl & clean documents\n2. Chunk (512 tokens, 10% overlap)\n3. Embed with bi-encoder (e.g., BGE-large)\n4. Index in vector DB (Qdrant/Pinecone) + BM25 for hybrid search\n\nOnline (query time):\n1. Query expansion (synonyms, HyDE)\n2. Hybrid retrieve (dense + BM25, RRF fusion) → top 50\n3. Cross-encoder rerank → top 5\n4. Optional: LLM generates answer citing retrieved docs (RAG)\n\nMetrics: NDCG@10, MRR, latency P50/P99.",
        code: `# High-level pseudocode for semantic search
class SemanticSearchEngine:
    def __init__(self):
        self.bi_encoder    = load_model("BAAI/bge-large-en-v1.5")
        self.cross_encoder = load_model("cross-encoder/ms-marco-MiniLM-L-6-v2")
        self.vector_db     = QdrantClient(url="http://qdrant:6333")
        self.bm25_index    = BM25Index()

    def index(self, documents):
        # Chunk, embed, index
        for doc in documents:
            chunks     = chunk(doc, size=512, overlap=50)
            embeddings = self.bi_encoder.encode(chunks, normalize=True)
            self.vector_db.upsert(embeddings, metadata=chunks)
            self.bm25_index.add(chunks)

    def search(self, query: str, top_k: int = 5):
        # Stage 1: Hybrid retrieval (50 candidates)
        q_emb          = self.bi_encoder.encode(query, normalize=True)
        dense_results  = self.vector_db.search(q_emb, limit=50)
        sparse_results = self.bm25_index.search(query, limit=50)
        candidates     = rrf_fusion(dense_results, sparse_results)[:50]

        # Stage 2: Cross-encoder reranking
        scores    = self.cross_encoder.predict([(query, c.text) for c in candidates])
        reranked  = sorted(zip(scores, candidates), reverse=True)[:top_k]
        return [doc for _, doc in reranked]`,
      },
    ],
  },
  {
    id: "mlops-interview",
    title: "MLOps Interview Questions",
    category: "Interview Prep",
    content: [
      {
        heading: "Q: What is training-serving skew and how do you prevent it?",
        body: "Training-serving skew is when the data distribution or feature computation during serving differs from training. It's the most common and dangerous production ML bug.\n\nCauses:\n• Feature computed differently in training pipeline vs serving code\n• Serving uses stale cached values while training used fresh data\n• Preprocessing order differs (e.g., fill nulls before/after normalization)\n\nPrevention:\n• Feature store — single source of truth for feature computation\n• Identical preprocessing pipeline in training and serving (shared Python module)\n• Shadow mode testing — run new model alongside old, compare outputs\n• Distribution monitoring on serving features vs training features",
      },
      {
        heading: "Q: How do you monitor ML models in production?",
        body: "Four layers of monitoring:\n\n1. Infrastructure: CPU/memory/GPU utilization, API latency, error rates. Standard DevOps.\n\n2. Data quality: null rates, schema changes, out-of-range values, cardinality shifts.\n\n3. Data drift: compare input feature distributions (KS test, PSI) between training baseline and current production data.\n\n4. Model performance: prediction drift (output distribution), accuracy/F1/AUC when ground truth labels arrive (may be delayed).\n\nAlert thresholds: set alerts at 2σ deviation. Trigger retraining when drift PSI > 0.2 or accuracy drops > 5%.",
      },
      {
        heading: "Q: Explain A/B testing for ML models.",
        body: "A/B testing for ML models splits traffic between the old model (control) and new model (treatment).\n\nKey principles:\n• Statistical significance — run until p-value < 0.05 (at least 1-2 weeks)\n• Minimum detectable effect — define minimum meaningful improvement before starting\n• No peeking — don't stop early when you see a good result (inflates false positives)\n• Segment analysis — check model doesn't degrade for subgroups even if aggregate improves\n\nCommon pitfalls: novelty effect (users behave differently with a new experience), network effects (users interact with each other), cannibalization.",
      },
      {
        heading: "Q: What is a feature store and why use one?",
        body: "A feature store is a centralized data platform for storing and serving ML features.\n\nProblem it solves: without a feature store, each team recomputes the same features differently, leading to inconsistency between training and serving (skew) and duplicated engineering effort.\n\nComponents:\n• Offline store: historical feature values for training dataset generation (data warehouse)\n• Online store: low-latency serving for real-time inference (Redis/DynamoDB, <10ms)\n• Materialization job: computes features and syncs offline → online\n• Feature registry: metadata, ownership, lineage\n\nWhen to use: when you have 5+ models sharing features, or when training-serving skew is a problem.",
      },
      {
        heading: "Q: How do you decide when to retrain a model?",
        body: "Scheduled retraining: retrain on a fixed schedule (weekly, monthly). Simple but wasteful if data is stable.\n\nPerformance-based: retrain when model accuracy drops below a threshold (requires labels — may be delayed).\n\nDrift-based: retrain when data drift exceeds a threshold (PSI > 0.2, KS p-value < 0.05). Can act before performance degrades.\n\nEvent-based: retrain after a known distribution shift event (product launch, seasonal change, external shock).\n\nBest practice: combine drift monitoring (fast signal) with performance monitoring (ground truth) and schedule periodic safety retrains regardless.",
      },
    ],
  },
]
