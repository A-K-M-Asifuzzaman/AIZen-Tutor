import type { Lesson } from "../types"

export const NLP_LESSONS: Lesson[] = [
  {
    id: "word-embeddings",
    title: "Word Embeddings — Word2Vec, GloVe, FastText",
    category: "NLP & Transformers",
    content: [
      {
        heading: "From Words to Vectors",
        body: "Neural networks cannot process raw text. We need to convert words into dense numerical vectors that capture semantic meaning. Word embeddings map each word to a point in high-dimensional space where similar words are geometrically close.\n\nFamous property: king − man + woman ≈ queen",
      },
      {
        heading: "Word2Vec (Google, 2013)",
        body: "Word2Vec trains a shallow neural network to predict context from a target word or vice versa.\n\nCBOW (Continuous Bag of Words): Predict center word from surrounding context words.\nSkip-gram: Predict surrounding context words from the center word. Works better for rare words.\n\nTraining trick — Negative Sampling: Instead of softmax over all vocabulary (slow), train binary classifier to distinguish true context words from randomly sampled 'noise' words.",
      },
      {
        heading: "GloVe (Stanford, 2014)",
        body: "GloVe (Global Vectors) uses global word co-occurrence statistics. Factorizes the log co-occurrence matrix:\n\nw_i · w̃_j + b_i + b̃_j = log(X_ij)\n\nXij = count of word j appearing in context of word i.\n\nGloVe often outperforms Word2Vec on word analogy tasks.",
      },
      {
        heading: "FastText (Meta, 2016)",
        body: "FastText represents each word as a bag of character n-grams. 'apple' = {ap, pp, pl, le, app, ppl, ple, apple}.\n\nKey advantage: handles OOV (out-of-vocabulary) words by composing subword embeddings. Great for morphologically rich languages and misspellings.",
      },
      {
        heading: "Using Embeddings with Gensim",
        code: `from gensim.models import Word2Vec, FastText, KeyedVectors
import numpy as np

# Train Word2Vec on custom corpus
sentences = [
    ["machine", "learning", "is", "fascinating"],
    ["deep", "learning", "uses", "neural", "networks"],
    ["transformers", "revolutionized", "nlp"],
    ["bert", "and", "gpt", "are", "transformer", "models"],
]

# Skip-gram model
w2v = Word2Vec(
    sentences,
    vector_size=100,   # Embedding dimension
    window=5,          # Context window size
    min_count=1,       # Ignore words with freq < min_count
    sg=1,              # 1=skip-gram, 0=CBOW
    workers=4,
    epochs=100
)

# Most similar words
print(w2v.wv.most_similar("learning", topn=3))

# Word analogy: machine - learning + deep = ?
result = w2v.wv.most_similar(
    positive=["deep", "learning"], negative=["machine"], topn=1
)
print(f"deep - machine + learning ≈ {result}")

# Load pre-trained GloVe
# Download: https://nlp.stanford.edu/data/glove.6B.zip
# glove = KeyedVectors.load_word2vec_format("glove.6B.100d.word2vec.txt")

# Use with PyTorch
import torch
import torch.nn as nn
embeddings_matrix = torch.FloatTensor(w2v.wv.vectors)
embed_layer = nn.Embedding.from_pretrained(embeddings_matrix, freeze=False)`,
        note: "For most modern NLP tasks, use contextual embeddings (BERT, GPT) instead of static embeddings. Static embeddings assign the same vector to 'bank' in 'river bank' and 'bank account'.",
      },
    ],
  },
  {
    id: "tokenization",
    title: "Tokenization — BPE, WordPiece, SentencePiece",
    category: "NLP & Transformers",
    content: [
      {
        heading: "What is Tokenization?",
        body: "Tokenization converts raw text into a sequence of token IDs that the model can process. The tokenizer defines the vocabulary — the set of all tokens the model knows.\n\nChallenges:\n• Word-level: Large vocab (millions of words). OOV problem.\n• Character-level: No OOV, but sequences are very long.\n• Subword: Balance between both — the standard approach.",
      },
      {
        heading: "Byte-Pair Encoding (BPE)",
        body: "Used by GPT, RoBERTa, LLaMA.\n\n1. Start with character-level vocabulary\n2. Iteratively merge the most frequent adjacent pair of tokens\n3. Repeat until vocabulary size is reached (e.g., 50,257 tokens for GPT-2)\n\nResult: Common words are single tokens. Rare words are split into frequent subwords.\n'tokenization' → ['token', 'ization'] or ['t', 'oken', 'ization']",
      },
      {
        heading: "WordPiece",
        body: "Used by BERT. Similar to BPE but merges pairs that maximize language model likelihood rather than raw frequency.\n\n'playing' → ['play', '##ing']\n'##' prefix marks continuation of a word.",
      },
      {
        heading: "SentencePiece",
        body: "Used by T5, LLaMA, multilingual models. Language-independent — treats text as a sequence of Unicode characters with no word-boundary assumptions. Works on any language without preprocessing.",
      },
      {
        heading: "Tokenization in Practice",
        code: `from transformers import AutoTokenizer

# BERT tokenizer (WordPiece)
bert_tok = AutoTokenizer.from_pretrained("bert-base-uncased")
text = "Tokenization is fascinating! GPT uses BPE."
tokens = bert_tok.tokenize(text)
ids    = bert_tok.encode(text)
print("BERT tokens:", tokens)
print("BERT IDs:   ", ids)

# GPT-2 tokenizer (BPE)
gpt_tok = AutoTokenizer.from_pretrained("gpt2")
tokens = gpt_tok.tokenize(text)
print("\nGPT-2 tokens:", tokens)
print("Vocab size:  ", gpt_tok.vocab_size)   # 50,257

# Batch encoding (for training)
batch = bert_tok(
    ["First sentence.", "Second longer sentence here."],
    padding=True,          # Pad shorter sequences
    truncation=True,       # Truncate to max_length
    max_length=32,
    return_tensors="pt"    # PyTorch tensors
)
print("\nInput IDs shape:", batch["input_ids"].shape)
print("Attention mask: ", batch["attention_mask"])

# Decode back
decoded = bert_tok.decode(ids, skip_special_tokens=True)
print("\nDecoded:", decoded)`,
        note: "The tokenizer must match the model exactly. Using a different tokenizer than what the model was trained with produces garbage outputs.",
      },
    ],
  },
  {
    id: "attention-mechanism",
    title: "Attention Mechanism",
    category: "NLP & Transformers",
    content: [
      {
        heading: "Motivation",
        body: "In seq2seq RNN models, the encoder compresses all input into a fixed-length vector — losing information for long sequences. Attention allows the decoder to 'look at' all encoder states and focus on the most relevant parts at each decoding step.",
      },
      {
        heading: "Scaled Dot-Product Attention",
        body: "Three matrices computed from input X:\n• Query (Q) = X·W_Q — what are we looking for?\n• Key (K)   = X·W_K — what does each position contain?\n• Value (V) = X·W_V — what to output from each position?\n\nAttention(Q,K,V) = softmax(Q·Kᵀ / √d_k) · V\n\n1. Q·Kᵀ: similarity between every query and every key → (seq_len × seq_len) scores\n2. /√d_k: scale to prevent softmax saturation in high dimensions\n3. softmax: convert to probability distribution (attention weights)\n4. ·V: weighted sum of values",
      },
      {
        heading: "Multi-Head Attention",
        body: "Run H attention heads in parallel, each with different learned projections:\n\nMultiHead(Q,K,V) = Concat(head_1,...,head_H) · W_O\nhead_i = Attention(Q·W_Qi, K·W_Ki, V·W_Vi)\n\nEach head learns to attend to different relationships (syntax, coreference, semantics, etc.).",
      },
      {
        heading: "Attention from Scratch",
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model=512, n_heads=8, dropout=0.1):
        super().__init__()
        assert d_model % n_heads == 0
        self.d_k     = d_model // n_heads
        self.n_heads = n_heads
        self.W_Q = nn.Linear(d_model, d_model)
        self.W_K = nn.Linear(d_model, d_model)
        self.W_V = nn.Linear(d_model, d_model)
        self.W_O = nn.Linear(d_model, d_model)
        self.dropout = nn.Dropout(dropout)

    def split_heads(self, x, batch_size):
        # (batch, seq, d_model) → (batch, heads, seq, d_k)
        x = x.view(batch_size, -1, self.n_heads, self.d_k)
        return x.transpose(1, 2)

    def forward(self, query, key, value, mask=None):
        B = query.size(0)
        Q = self.split_heads(self.W_Q(query), B)
        K = self.split_heads(self.W_K(key),   B)
        V = self.split_heads(self.W_V(value),  B)

        # Scaled dot-product attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float("-inf"))
        weights = self.dropout(F.softmax(scores, dim=-1))
        context = torch.matmul(weights, V)

        # Concatenate heads
        context = context.transpose(1, 2).contiguous().view(B, -1, self.n_heads * self.d_k)
        return self.W_O(context), weights

# Test
mha = MultiHeadAttention(d_model=512, n_heads=8)
x = torch.randn(2, 10, 512)  # (batch=2, seq=10, d_model=512)
out, weights = mha(x, x, x)
print(f"Output:  {out.shape}")      # (2, 10, 512)
print(f"Weights: {weights.shape}")  # (2, 8, 10, 10)`,
        note: "Flash Attention (2022) rewrites attention to be IO-aware, achieving 2-4× speedup and enabling much longer context windows.",
      },
    ],
  },
  {
    id: "transformers",
    title: "Transformer Architecture",
    category: "NLP & Transformers",
    content: [
      {
        heading: "The Architecture (2017)",
        body: "Introduced in 'Attention Is All You Need' (Vaswani et al., 2017). Replaced RNNs entirely for sequence modeling. Two key properties:\n\n1. Parallelism — processes all tokens simultaneously (no sequential dependency)\n2. Global receptive field — every token attends to every other token in O(1) steps",
      },
      {
        heading: "Encoder Block",
        body: "Each encoder layer:\n1. Multi-Head Self-Attention(x, x, x)\n2. Add & LayerNorm (residual connection)\n3. Feed-Forward Network: FFN(x) = max(0, xW₁+b₁)W₂+b₂\n4. Add & LayerNorm\n\nFFN expands to 4× d_model then contracts. Acts as per-token processing. BERT uses 12 encoder layers.",
      },
      {
        heading: "Decoder Block",
        body: "Each decoder layer has 3 sub-layers:\n1. Masked Multi-Head Self-Attention — can only attend to previous tokens (causal mask)\n2. Cross-Attention — queries from decoder, keys/values from encoder output\n3. Feed-Forward Network\n\nGPT uses decoder-only (no cross-attention). Used for generation.",
      },
      {
        heading: "Positional Encoding",
        body: "Self-attention is permutation-invariant — it doesn't know token order. Positional encodings inject position information:\n\nPE(pos, 2i)   = sin(pos / 10000^{2i/d_model})\nPE(pos, 2i+1) = cos(pos / 10000^{2i/d_model})\n\nModern models use learned positional embeddings (BERT) or RoPE (Rotary Position Embedding, used in LLaMA, GPT-NeoX).",
      },
      {
        heading: "Full Transformer Encoder",
        code: `import torch
import torch.nn as nn
import math

class TransformerEncoder(nn.Module):
    def __init__(self, vocab_size, d_model=512, n_heads=8,
                 n_layers=6, d_ff=2048, max_len=512, dropout=0.1):
        super().__init__()
        self.embedding   = nn.Embedding(vocab_size, d_model)
        self.pos_embed   = nn.Embedding(max_len, d_model)
        self.dropout     = nn.Dropout(dropout)
        self.layers      = nn.ModuleList([
            nn.TransformerEncoderLayer(
                d_model, n_heads, d_ff, dropout,
                activation="gelu", batch_first=True, norm_first=True  # Pre-norm
            ) for _ in range(n_layers)
        ])
        self.norm = nn.LayerNorm(d_model)

    def forward(self, x, padding_mask=None):
        B, T = x.shape
        pos  = torch.arange(T, device=x.device).unsqueeze(0)
        x    = self.dropout(self.embedding(x) + self.pos_embed(pos))
        for layer in self.layers:
            x = layer(x, src_key_padding_mask=padding_mask)
        return self.norm(x)

# BERT-base dimensions
encoder = TransformerEncoder(
    vocab_size=30522, d_model=768, n_heads=12,
    n_layers=12, d_ff=3072
)
x = torch.randint(0, 30522, (2, 128))  # Batch of 2, seq len 128
output = encoder(x)
print(f"Encoder output: {output.shape}")  # (2, 128, 768)
print(f"Parameters: {sum(p.numel() for p in encoder.parameters()):,}")`,
        note: "norm_first=True (Pre-LN) is more stable to train than the original post-LN. Used in GPT-3, PaLM, LLaMA.",
      },
    ],
  },
  {
    id: "bert-gpt",
    title: "BERT vs GPT — Encoder vs Decoder",
    category: "NLP & Transformers",
    content: [
      {
        heading: "BERT (Bidirectional Encoder Representations from Transformers)",
        body: "Google, 2018. Encoder-only Transformer trained on:\n1. Masked Language Modeling (MLM): Randomly mask 15% of tokens, predict the masked tokens. Forces bidirectional context understanding.\n2. Next Sentence Prediction (NSP): Predict if sentence B follows sentence A.\n\nBERT reads the entire sequence at once — each token attends to all others (bidirectional). Output: rich contextual embeddings for every token.",
      },
      {
        heading: "GPT (Generative Pre-trained Transformer)",
        body: "OpenAI, 2018. Decoder-only Transformer trained with Causal Language Modeling:\nPredict next token given all previous tokens: P(x_t | x_1,...,x_{t-1})\n\nCausal mask prevents attending to future tokens. Output: next token probability distribution.",
      },
      {
        heading: "When to Use Which",
        body: "Use BERT (encoder) for:\n• Text classification (sentiment, spam)\n• Named Entity Recognition (NER)\n• Question Answering (extractive)\n• Semantic similarity, embeddings\n• Token-level tasks\n\nUse GPT (decoder) for:\n• Text generation, summarization\n• Code generation\n• Chatbots and conversational AI\n• Few-shot prompting\n• Completion tasks",
      },
      {
        heading: "Fine-tuning BERT for Classification",
        code: `from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification,
    TrainingArguments, Trainer
)
from datasets import Dataset
import torch

# Prepare data
texts  = ["I love ML!", "This is boring.", "Fascinating research!", "Terrible results."]
labels = [1, 0, 1, 0]

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

def tokenize(examples):
    return tokenizer(
        examples["text"], truncation=True, padding="max_length", max_length=128
    )

dataset = Dataset.from_dict({"text": texts, "label": labels})
dataset = dataset.map(tokenize, batched=True)
dataset = dataset.train_test_split(test_size=0.25)

# Load BERT with classification head
model = AutoModelForSequenceClassification.from_pretrained(
    "bert-base-uncased", num_labels=2
)

training_args = TrainingArguments(
    output_dir="./bert-sentiment",
    num_train_epochs=3,
    per_device_train_batch_size=8,
    learning_rate=2e-5,       # Small LR — pretrained weights are fragile
    weight_decay=0.01,
    warmup_steps=50,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
)

trainer = Trainer(model=model, args=training_args,
    train_dataset=dataset["train"], eval_dataset=dataset["test"])
trainer.train()`,
        note: "Fine-tuning LR should be 1e-5 to 5e-5. Higher LR catastrophically forgets pretrained knowledge (catastrophic forgetting).",
      },
    ],
  },
  {
    id: "fine-tuning",
    title: "Fine-tuning & Transfer Learning for NLP",
    category: "NLP & Transformers",
    content: [
      {
        heading: "Fine-tuning Strategy",
        body: "Fine-tuning adapts a pretrained model to a specific task with a small labeled dataset. Three main approaches:\n\n1. Full Fine-tuning — Update all weights. Requires GPU, more data, risk of catastrophic forgetting.\n2. Feature Extraction — Freeze all layers, train only a new task head. Fast, works with tiny datasets.\n3. Parameter-Efficient Fine-Tuning (PEFT) — Modify only a small fraction of parameters (LoRA, Adapters, Prefix Tuning).",
      },
      {
        heading: "LoRA — Low-Rank Adaptation",
        body: "LoRA freezes the original model and injects trainable low-rank matrices:\n\nW' = W₀ + ΔW = W₀ + B·A\n\nWhere A ∈ R^{r×d}, B ∈ R^{d×r}, r << d\n\nTrainable parameters: only A and B (e.g., 0.1% of original params). Full-quality results at tiny fraction of compute. Standard for LLM fine-tuning (Alpaca, Vicuna, RLHF).",
      },
      {
        heading: "QLoRA — Quantized LoRA",
        body: "Combine 4-bit quantization of base model + LoRA adapters. Enables fine-tuning 7B–70B parameter models on a single GPU (16–24GB VRAM). The key breakthrough that democratized LLM fine-tuning.",
      },
      {
        heading: "LoRA Fine-tuning with PEFT",
        code: `from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model, TaskType
from trl import SFTTrainer
from datasets import load_dataset

# Load base model (run with: pip install transformers peft trl bitsandbytes)
model_name = "facebook/opt-125m"  # Small model for demo
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# LoRA configuration
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,                          # Rank — smaller = fewer params
    lora_alpha=32,                 # Scaling factor
    target_modules=["q_proj", "v_proj"],  # Which layers to adapt
    lora_dropout=0.05,
    bias="none",
)

# Apply LoRA
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Output: trainable params: 851,968 || all params: 125,290,496 (0.68%)

# Train with SFT
dataset = load_dataset("tatsu-lab/alpaca", split="train[:500]")

trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=512,
    args=TrainingArguments(output_dir="./lora-model", num_train_epochs=1,
        per_device_train_batch_size=4, learning_rate=2e-4)
)
trainer.train()`,
        note: "For 7B+ models, use QLoRA (4-bit + LoRA). Use r=8 or r=16 to start. Larger r = more capacity but more parameters.",
      },
    ],
  },
  {
    id: "ner-text-classification",
    title: "NER & Text Classification",
    category: "NLP & Transformers",
    content: [
      {
        heading: "Named Entity Recognition (NER)",
        body: "NER is a sequence labeling task that identifies and classifies named entities in text:\n\nPerson (PER), Organization (ORG), Location (LOC), Date (DATE), etc.\n\n'Apple CEO Tim Cook announced iPhone 16 in Cupertino.'\n→ Apple=ORG, Tim Cook=PER, iPhone 16=PRODUCT, Cupertino=LOC\n\nTagging scheme: BIO (Begin, Inside, Outside) or BIOES.",
      },
      {
        heading: "BIO Tagging",
        body: "B-PER = Beginning of a Person entity\nI-PER = Inside (continuation) of a Person entity\nO     = Outside any entity\n\n'Tim'   → B-PER\n'Cook'  → I-PER\n'Apple' → B-ORG\n'is'    → O",
      },
      {
        heading: "NER with HuggingFace Pipeline",
        code: `from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
import torch

# Quick inference with pipeline
ner = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english",
               aggregation_strategy="simple")

text = "Apple CEO Tim Cook announced iPhone 16 in Cupertino, California."
results = ner(text)
for entity in results:
    print(f"{entity['word']:20s} → {entity['entity_group']:8s} (score={entity['score']:.3f})")

# Text Classification pipeline
classifier = pipeline("text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english")
reviews = [
    "This movie was absolutely fantastic!",
    "Terrible acting, complete waste of time.",
    "It was okay, nothing special."
]
results = classifier(reviews)
for text, result in zip(reviews, results):
    print(f"{result['label']:9s} ({result['score']:.2f}): {text[:40]}...")

# Zero-shot classification (no fine-tuning needed!)
zero_shot = pipeline("zero-shot-classification",
    model="facebook/bart-large-mnli")
text = "The Fed raised interest rates by 25 basis points."
labels = ["finance", "sports", "technology", "politics"]
result = zero_shot(text, candidate_labels=labels)
print(dict(zip(result["labels"], [f"{s:.2%}" for s in result["scores"]])))`,
        note: "Zero-shot classification with BART-MNLI is surprisingly powerful — often beats fine-tuned models when labeled data is scarce.",
      },
    ],
  },
]
