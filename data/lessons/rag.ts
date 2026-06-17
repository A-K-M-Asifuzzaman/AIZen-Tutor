import type { Lesson } from "../types"

export const RAG_LESSONS: Lesson[] = [
  {
    id: "rag-intro",
    title: "RAG — Retrieval-Augmented Generation",
    category: "RAG Systems",
    content: [
      {
        heading: "What is RAG?",
        body: "RAG (Retrieval-Augmented Generation) combines a retrieval system with an LLM generator. When a user asks a question, the system first retrieves relevant documents from a knowledge base, then injects them into the LLM prompt as context before generating a response.\n\nThis solves three critical LLM problems:\n• Knowledge cutoff — LLMs have stale training data; RAG provides fresh documents\n• Hallucinations — LLMs invent facts; RAG grounds answers in real retrieved text\n• Private knowledge — LLMs can't know your proprietary data; RAG injects it dynamically",
      },
      {
        heading: "RAG vs Fine-tuning",
        body: "Fine-tuning bakes knowledge into weights — expensive, hard to update, still hallucinates.\n\nRAG keeps knowledge external — cheap, instantly updatable, verifiable with citations.\n\nWhen to fine-tune instead:\n• Changing the model's style or tone (not knowledge)\n• Very specific domain vocabulary or format\n• When you need sub-100ms latency with no retrieval step",
      },
      {
        heading: "Two Phases of RAG",
        body: "Offline Indexing (done once, updated as docs change):\n1. Load documents (PDFs, web pages, databases, APIs)\n2. Chunk into segments (256–1024 tokens)\n3. Embed each chunk with an embedding model\n4. Store vectors in a vector database\n\nOnline Querying (happens at request time):\n1. Embed the user query\n2. Search vector DB for top-k similar chunks\n3. Inject retrieved chunks into LLM prompt\n4. LLM generates a grounded answer",
      },
      {
        heading: "Complete RAG Pipeline",
        code: `from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import anthropic

# ─── OFFLINE: Index documents ────────────────────────────────────
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

documents = [
    "Backpropagation uses the chain rule to compute gradients through all network layers.",
    "Transformers use self-attention to model relationships between all token pairs simultaneously.",
    "RAG combines retrieval from a knowledge base with LLM generation for grounded responses.",
    "RLHF aligns language models with human preferences using a reward model and PPO.",
    "LoRA fine-tunes LLMs by injecting trainable low-rank matrices into existing weight layers.",
    "Diffusion models generate images by learning to reverse a gradual noising process.",
    "FAISS enables billion-scale nearest-neighbor search with sub-millisecond query times.",
    "Batch normalization normalizes layer activations to stabilize and accelerate deep learning.",
]

embeddings = embed_model.encode(documents, normalize_embeddings=True)
dim = embeddings.shape[1]

# Inner product on normalized vectors = cosine similarity
index = faiss.IndexFlatIP(dim)
index.add(np.array(embeddings, dtype=np.float32))

# ─── ONLINE: Query + Generate ────────────────────────────────────
client = anthropic.Anthropic()

def rag_answer(query: str, k: int = 3) -> str:
    # Retrieve
    q_emb = embed_model.encode([query], normalize_embeddings=True)
    scores, indices = index.search(np.array(q_emb, dtype=np.float32), k)
    retrieved = [documents[i] for i in indices[0]]

    # Augment
    context = "\n".join(f"[{i+1}] {doc}" for i, doc in enumerate(retrieved))
    prompt  = f"Context:\n{context}\n\nQuestion: {query}\nAnswer:"

    # Generate
    response = client.messages.create(
        model="claude-opus-4-8", max_tokens=512,
        system="Answer only based on the provided context. Cite [1], [2], etc.",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text

print(rag_answer("How do transformers process sequences?"))`,
        note: "normalize_embeddings=True + IndexFlatIP is equivalent to cosine similarity search — more stable than L2 distance for text embeddings.",
      },
    ],
  },
  {
    id: "chunking-strategies",
    title: "Chunking Strategies",
    category: "RAG Systems",
    content: [
      {
        heading: "Why Chunking Matters",
        body: "Chunking is the most impactful decision in RAG quality. Chunks that are too small lose context; chunks that are too large dilute relevance and waste context window space.\n\nRule of thumb: chunks should be semantically self-contained — a reader should understand the chunk without needing surrounding context.",
      },
      {
        heading: "Fixed-Size Chunking",
        body: "Split every N characters or tokens, with optional overlap.\n\nPros: Simple, predictable, fast.\nCons: Splits sentences and paragraphs mid-thought.\n\nChunk size guidelines:\n• 128–256 tokens: High precision retrieval, less context per chunk\n• 512–1024 tokens: Better context, slightly less precise retrieval\n• Use 10–20% overlap between chunks to avoid losing information at boundaries",
      },
      {
        heading: "Recursive Character Splitting",
        body: "Tries to split on natural boundaries in priority order: paragraphs → sentences → words → characters. The most practical approach for general documents.",
      },
      {
        heading: "Semantic Chunking",
        body: "Embeds sentences and groups them by semantic similarity. Creates chunks where each chunk covers one topic. Higher quality but slower and more complex.",
      },
      {
        heading: "Chunking Methods Compared",
        code: `from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    CharacterTextSplitter,
    SentenceTransformersTokenTextSplitter,
    MarkdownHeaderTextSplitter,
)
from langchain_experimental.text_splitter import SemanticChunker
from langchain_community.embeddings import HuggingFaceEmbeddings

text = """
Machine learning is a branch of artificial intelligence. It enables systems to learn from data.

There are three main types: supervised learning uses labeled data. Unsupervised learning
finds patterns without labels. Reinforcement learning trains agents via rewards and penalties.

Deep learning uses neural networks with many layers. Transformers revolutionized NLP in 2017.
"""

# 1. Recursive (recommended default)
recursive = RecursiveCharacterTextSplitter(
    chunk_size=200, chunk_overlap=30,
    separators=["\n\n", "\n", ". ", " ", ""]
)
chunks_r = recursive.split_text(text)
print(f"Recursive: {len(chunks_r)} chunks")
for c in chunks_r: print(f"  [{len(c)} chars] {c[:60]}...")

# 2. Token-based (use when model has token limits)
token_splitter = SentenceTransformersTokenTextSplitter(
    model_name="all-MiniLM-L6-v2", chunk_size=64, chunk_overlap=8
)
chunks_t = token_splitter.split_text(text)
print(f"\nToken-based: {len(chunks_t)} chunks")

# 3. Markdown header splitting (for structured docs)
md_text = "# ML Overview\n\n## Supervised\nUses labels.\n\n## Unsupervised\nNo labels."
headers = [("#", "h1"), ("##", "h2")]
md_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers)
md_chunks = md_splitter.split_text(md_text)
for c in md_chunks:
    print(f"\nHeader metadata: {c.metadata} | Content: {c.page_content}")

# 4. Semantic chunking (best quality, slowest)
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
semantic = SemanticChunker(embeddings, breakpoint_threshold_type="percentile")
# chunks_s = semantic.split_text(text)  # Uncomment to use`,
        note: "For PDFs: use unstructured.io to extract text preserving structure, then apply RecursiveCharacterTextSplitter. For code: use language-aware splitting (split on functions/classes).",
      },
    ],
  },
  {
    id: "vector-databases",
    title: "Vector Databases",
    category: "RAG Systems",
    content: [
      {
        heading: "What is a Vector Database?",
        body: "A vector database stores high-dimensional embedding vectors and provides fast nearest-neighbor search. When you embed a query, the vector DB finds the stored vectors most similar to it — returning semantically related documents.",
      },
      {
        heading: "Similarity Metrics",
        body: "Cosine Similarity: measures angle between vectors. Range [-1, 1]. Best for text (magnitude doesn't matter, direction does). Equivalent to dot product on L2-normalized vectors.\n\nDot Product: fast, used when vectors are already normalized.\n\nEuclidean (L2) Distance: measures absolute distance. Good for image embeddings.",
      },
      {
        heading: "ANN — Approximate Nearest Neighbor",
        body: "Exact nearest-neighbor search over millions of vectors is too slow (O(n·d)). ANN algorithms trade a tiny bit of accuracy for massive speed gains:\n\nHNSW (Hierarchical Navigable Small World): builds a multi-layer graph. Used in Weaviate, Qdrant, pgvector.\nIVF (Inverted File Index): clusters vectors, searches only relevant clusters. Used in FAISS.\nLSH (Locality Sensitive Hashing): hash-based bucketing. Fast but lower recall.",
      },
      {
        heading: "Vector DB Comparison",
        body: "FAISS — Meta. In-memory. Best for: local development, prototyping, embedded use.\nPinecone — Managed SaaS. Best for: production, serverless, no-ops.\nWeaviate — Open-source. Best for: hybrid search (vector + BM25), GraphQL API.\nQdrant — Open-source, Rust. Best for: filtering, self-hosted production, speed.\nChroma — Open-source. Best for: fast local dev, LangChain/LlamaIndex integration.\npgvector — Postgres extension. Best for: existing Postgres stack, ACID compliance.",
      },
      {
        heading: "Production Vector DB with Qdrant",
        code: `from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
)
from sentence_transformers import SentenceTransformer
import uuid

embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Connect (local in-memory for dev, URL for production)
client = QdrantClient(":memory:")

# Create collection
client.create_collection(
    collection_name="ml_docs",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE)
)

# Index documents with metadata
docs = [
    {"text": "Transformers use self-attention mechanism", "topic": "nlp", "difficulty": "intermediate"},
    {"text": "CNNs are great for image classification", "topic": "cv", "difficulty": "beginner"},
    {"text": "LoRA fine-tunes only low-rank matrices", "topic": "llm", "difficulty": "advanced"},
    {"text": "FAISS enables fast vector search", "topic": "rag", "difficulty": "intermediate"},
]

embeddings = embed_model.encode([d["text"] for d in docs])
points = [
    PointStruct(id=str(uuid.uuid4()), vector=emb.tolist(), payload=doc)
    for emb, doc in zip(embeddings, docs)
]
client.upsert(collection_name="ml_docs", points=points)

# Search with metadata filter
query = "how to search vectors efficiently"
q_emb = embed_model.encode([query])[0]

# Filter: only return intermediate or advanced content
results = client.search(
    collection_name="ml_docs",
    query_vector=q_emb.tolist(),
    query_filter=Filter(must=[
        FieldCondition(key="difficulty", match=MatchValue(value="intermediate"))
    ]),
    limit=2
)

for r in results:
    print(f"Score: {r.score:.3f} | {r.payload['text']}")`,
        note: "Qdrant's filtering happens BEFORE vector search (pre-filtering), not after — much more efficient than post-filtering.",
      },
    ],
  },
  {
    id: "embedding-models",
    title: "Embedding Models",
    category: "RAG Systems",
    content: [
      {
        heading: "What are Embeddings?",
        body: "Embeddings are dense vector representations of text where semantic similarity is captured by geometric proximity. Similar meaning → similar vectors → small cosine distance.\n\nThe embedding model is the most critical component of RAG after chunking — bad embeddings means bad retrieval regardless of your vector DB.",
      },
      {
        heading: "Popular Embedding Models",
        body: "all-MiniLM-L6-v2 — 384 dimensions, 22M params. Fast, free, good quality. Best for: local/offline RAG.\n\nall-mpnet-base-v2 — 768 dimensions, 110M params. Better quality than MiniLM, slower.\n\ntext-embedding-3-small (OpenAI) — 1536 dims. Excellent quality, paid API.\n\nbge-large-en-v1.5 (BAAI) — 1024 dims. State-of-the-art for English, free.\n\nbge-m3 (BAAI) — Multilingual, multi-granularity. Best open-source embedding model.\n\nVoyage-3 (Anthropic) — Best-in-class for RAG with Claude, designed to complement Anthropic models.",
      },
      {
        heading: "Embedding Evaluation (MTEB)",
        body: "MTEB (Massive Text Embedding Benchmark) is the standard leaderboard for embedding models. Covers retrieval, classification, clustering, semantic similarity across 56 tasks.\n\nCheck the latest leaderboard at huggingface.co/spaces/mteb/leaderboard before choosing an embedding model.",
      },
      {
        heading: "Embedding Models in Practice",
        code: `from sentence_transformers import SentenceTransformer, util
import numpy as np

# Load model (downloads automatically on first run)
model = SentenceTransformer("BAAI/bge-large-en-v1.5")

# For BGE models: add instruction prefix to queries (not documents!)
query_prefix = "Represent this sentence for searching relevant passages: "

documents = [
    "The Transformer architecture was introduced in the paper 'Attention Is All You Need'.",
    "CNNs use convolutional layers to detect spatial features in images.",
    "Gradient descent minimizes the loss function by following the negative gradient.",
]

# Encode: no prefix for documents
doc_embeddings = model.encode(documents, normalize_embeddings=True)

# Encode query WITH prefix
query = "What paper introduced the Transformer?"
query_embedding = model.encode(query_prefix + query, normalize_embeddings=True)

# Cosine similarity (dot product on normalized vectors)
scores = np.dot(doc_embeddings, query_embedding)
ranked = sorted(zip(scores, documents), reverse=True)

print("Query:", query)
print("\nRanked results:")
for score, doc in ranked:
    print(f"  {score:.4f}: {doc[:60]}...")

# Batch encoding with progress bar
large_corpus = documents * 1000
batch_embeddings = model.encode(
    large_corpus,
    batch_size=64,
    show_progress_bar=True,
    normalize_embeddings=True
)
print(f"\nEncoded {len(large_corpus)} docs → shape {batch_embeddings.shape}")`,
        note: "Query embeddings and document embeddings are often computed differently (asymmetric retrieval). Always check the model's recommended usage.",
      },
    ],
  },
  {
    id: "reranking",
    title: "Reranking — Improving Retrieval Quality",
    category: "RAG Systems",
    content: [
      {
        heading: "The Two-Stage Retrieval Problem",
        body: "Bi-encoder retrieval (embedding similarity) is fast but approximate — it encodes query and document independently, losing cross-attention between them.\n\nResult: the top-k retrieved chunks often include irrelevant passages.\n\nSolution: two-stage pipeline:\n1. Retrieve top-50 candidates fast with bi-encoder (ANN)\n2. Rerank top-50 with a cross-encoder to get true top-3",
      },
      {
        heading: "Cross-Encoder Reranking",
        body: "A cross-encoder takes (query, document) as a SINGLE input and outputs a relevance score. Unlike bi-encoders, it applies full attention between query and document tokens — much more accurate.\n\nTrade-off: Cross-encoders are 100× slower than bi-encoders — only use them on a small candidate set (top-20 to top-50).",
      },
      {
        heading: "Reranking Pipeline",
        code: `from sentence_transformers import SentenceTransformer, CrossEncoder
import numpy as np
import faiss

# Stage 1: Bi-encoder for fast retrieval
bi_encoder = SentenceTransformer("BAAI/bge-large-en-v1.5")

# Stage 2: Cross-encoder for precise reranking
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

# Build corpus index
corpus = [
    "Transformers use multi-head self-attention to process sequences in parallel.",
    "CNNs apply learned filters across images to detect spatial hierarchies.",
    "Gradient descent iteratively updates weights by moving against the gradient.",
    "BERT uses masked language modeling for bidirectional pretraining.",
    "FAISS provides efficient similarity search over billion-scale vector databases.",
    "Dropout randomly zeros neurons to prevent co-adaptation and overfitting.",
    "Attention is computed as softmax(QK^T / sqrt(d_k)) * V.",
    "LoRA injects trainable low-rank matrices to fine-tune LLMs efficiently.",
]

# Encode corpus
corpus_embeddings = bi_encoder.encode(corpus, normalize_embeddings=True)
index = faiss.IndexFlatIP(corpus_embeddings.shape[1])
index.add(corpus_embeddings.astype(np.float32))

def two_stage_retrieve(query: str, top_k_biencoder=10, top_k_final=3):
    # Stage 1: fast bi-encoder retrieval
    q_emb = bi_encoder.encode([query], normalize_embeddings=True)
    scores, indices = index.search(q_emb.astype(np.float32), top_k_biencoder)
    candidates = [(corpus[i], float(s)) for i, s in zip(indices[0], scores[0])]

    # Stage 2: cross-encoder reranking
    pairs = [[query, doc] for doc, _ in candidates]
    cross_scores = cross_encoder.predict(pairs)

    # Re-sort by cross-encoder score
    reranked = sorted(
        zip(cross_scores, [doc for doc, _ in candidates]),
        reverse=True
    )[:top_k_final]

    return reranked

results = two_stage_retrieve("how does attention mechanism work?")
print("Final ranked results:")
for score, doc in results:
    print(f"  {score:.3f}: {doc[:70]}...")`,
        note: "Cohere Rerank API and Voyage Rerank provide hosted cross-encoder reranking — no GPU needed, easy to integrate.",
      },
    ],
  },
  {
    id: "hybrid-search",
    title: "Hybrid Search — Dense + Sparse",
    category: "RAG Systems",
    content: [
      {
        heading: "Dense vs Sparse Retrieval",
        body: "Dense (vector) retrieval — Semantic similarity via embeddings. Finds conceptually related docs even without keyword match. Example: 'car' matches 'automobile'.\n\nSparse (keyword) retrieval — BM25/TF-IDF exact keyword matching. Great for rare terms, product names, codes, identifiers. Example: 'GPT-4o' won't get confused with 'GPT-4'.\n\nHybrid — Combines both. Gets the best of semantic understanding AND keyword precision. Standard in production RAG.",
      },
      {
        heading: "BM25 — Best Matching 25",
        body: "BM25 is the gold standard keyword retrieval algorithm, improving on TF-IDF:\n\nScore(q,d) = Σ IDF(qᵢ) · (tf(qᵢ,d) · (k₁+1)) / (tf(qᵢ,d) + k₁·(1 - b + b·|d|/avgdl))\n\nk₁=1.5 (term frequency saturation), b=0.75 (document length normalization)\n\nBM25 is still competitive with dense retrieval on many benchmarks — especially for exact phrase matching.",
      },
      {
        heading: "Reciprocal Rank Fusion (RRF)",
        body: "RRF merges ranked lists from multiple retrieval systems without needing score normalization:\n\nRRF_score(d) = Σ 1 / (k + rank(d))\n\nk=60 is standard (smoothing constant). Simple but very effective for combining dense and sparse results.",
      },
      {
        heading: "Hybrid Search Implementation",
        code: `from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss

corpus = [
    "Transformers use self-attention to model sequence dependencies.",
    "GPT-4o is OpenAI's flagship multimodal model released in 2024.",
    "FAISS is a library for efficient similarity search over dense vectors.",
    "BM25 is a probabilistic keyword retrieval function based on TF-IDF.",
    "Claude Opus 4.8 is Anthropic's most capable language model.",
    "Vector databases store embeddings for fast nearest-neighbor retrieval.",
]

# ─── Dense retrieval setup ────────────────────────────────────
model = SentenceTransformer("all-MiniLM-L6-v2")
dense_emb = model.encode(corpus, normalize_embeddings=True).astype(np.float32)
index = faiss.IndexFlatIP(dense_emb.shape[1])
index.add(dense_emb)

# ─── Sparse retrieval setup (BM25) ───────────────────────────
tokenized = [doc.lower().split() for doc in corpus]
bm25 = BM25Okapi(tokenized)

def hybrid_search(query: str, top_k: int = 3, alpha: float = 0.5) -> list:
    """alpha=0.5 means equal weight to dense and sparse"""
    n = len(corpus)

    # Dense scores (cosine similarity)
    q_emb = model.encode([query], normalize_embeddings=True).astype(np.float32)
    dense_scores, dense_idx = index.search(q_emb, n)
    dense_rank = np.zeros(n)
    for rank, idx in enumerate(dense_idx[0]):
        dense_rank[idx] = rank + 1

    # Sparse scores (BM25)
    bm25_scores = bm25.get_scores(query.lower().split())
    bm25_rank = np.argsort(np.argsort(-bm25_scores)) + 1

    # Reciprocal Rank Fusion
    k = 60
    rrf_scores = alpha * (1 / (k + dense_rank)) + (1 - alpha) * (1 / (k + bm25_rank))
    top_indices = np.argsort(-rrf_scores)[:top_k]
    return [(corpus[i], rrf_scores[i]) for i in top_indices]

results = hybrid_search("Claude Opus model by Anthropic")
for doc, score in results:
    print(f"{score:.5f}: {doc}")`,
        note: "For production, use Weaviate or Elasticsearch which support hybrid search natively with BM25 + vector fusion built-in.",
      },
    ],
  },
  {
    id: "agentic-rag",
    title: "Agentic RAG",
    category: "RAG Systems",
    content: [
      {
        heading: "Beyond Naive RAG",
        body: "Naive RAG (retrieve once → generate) fails on:\n• Multi-hop questions requiring chaining multiple retrievals\n• Ambiguous queries needing clarification\n• Questions needing aggregation across many chunks\n• When the first retrieval returns irrelevant results\n\nAgentic RAG gives the LLM control over the retrieval process.",
      },
      {
        heading: "Query Transformation",
        body: "Before retrieving, transform the query to improve retrieval quality:\n\n• Query Rewriting — Rephrase for better embedding match\n• HyDE (Hypothetical Document Embeddings) — Generate a hypothetical answer, embed it, use it to retrieve real docs\n• Step-Back Prompting — Ask a broader question to retrieve general context first\n• Sub-question Decomposition — Break complex queries into simpler sub-questions",
      },
      {
        heading: "Self-RAG",
        body: "The LLM decides at each step:\n1. Do I need to retrieve? (Retrieve token)\n2. Is the retrieved doc relevant? (ISREL token)\n3. Is my response supported by the doc? (ISSUP token)\n4. Is my response useful overall? (ISUSE token)\n\nSelf-RAG outperforms standard RAG by making retrieval adaptive rather than always-on.",
      },
      {
        heading: "Agentic RAG Pipeline",
        code: `import anthropic
import json
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

client = anthropic.Anthropic()
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Knowledge base
docs = [
    "Transformers use self-attention to process all tokens in parallel.",
    "BERT is pretrained with masked language modeling on bidirectional context.",
    "GPT uses causal (left-to-right) language modeling for autoregressive generation.",
    "LoRA injects trainable low-rank matrices to fine-tune LLMs with 0.1% of parameters.",
    "RAG retrieves relevant documents and injects them into LLM context at query time.",
    "DPO directly optimizes LLM on preference pairs without a separate reward model.",
]
embs = embed_model.encode(docs, normalize_embeddings=True).astype(np.float32)
index = faiss.IndexFlatIP(embs.shape[1])
index.add(embs)

def retrieve(query: str, k: int = 2) -> list[str]:
    q_emb = embed_model.encode([query], normalize_embeddings=True).astype(np.float32)
    _, idxs = index.search(q_emb, k)
    return [docs[i] for i in idxs[0]]

def rewrite_query(original: str) -> str:
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=100,
        messages=[{"role": "user", "content":
            f"Rewrite this query for better document retrieval (one sentence only): {original}"}]
    )
    return resp.content[0].text.strip()

tools = [{
    "name": "search_knowledge_base",
    "description": "Search the ML knowledge base for relevant information",
    "input_schema": {"type": "object",
        "properties": {"query": {"type": "string", "description": "Search query"}},
        "required": ["query"]}
}]

def agentic_rag(user_question: str) -> str:
    rewritten = rewrite_query(user_question)
    print(f"Rewritten query: {rewritten}")
    messages = [{"role": "user", "content": user_question}]
    system = "You are an ML expert. Use the search tool to find relevant information before answering."

    while True:
        resp = client.messages.create(
            model="claude-opus-4-8", max_tokens=1024,
            system=system, tools=tools, messages=messages
        )
        messages.append({"role": "assistant", "content": resp.content})
        if resp.stop_reason == "end_turn":
            return next(b.text for b in resp.content if hasattr(b, "text"))
        for block in resp.content:
            if block.type == "tool_use":
                results = retrieve(block.input["query"])
                print(f"Retrieved: {results}")
                messages.append({"role": "user", "content": [
                    {"type": "tool_result", "tool_use_id": block.id,
                     "content": "\n".join(results)}]})

print(agentic_rag("How is BERT different from GPT in terms of training?"))`,
        note: "Agentic RAG shines when questions are complex or multi-hop. For simple factual questions, naive RAG is faster and cheaper.",
      },
    ],
  },
]
