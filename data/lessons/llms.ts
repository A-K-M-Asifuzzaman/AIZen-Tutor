import type { Lesson } from "../types"

export const LLM_LESSONS: Lesson[] = [
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    category: "LLMs & Prompting",
    content: [
      {
        heading: "What is Prompt Engineering?",
        body: "Prompt engineering is the practice of designing inputs to LLMs to reliably elicit desired outputs — without changing any model weights. It is one of the highest-leverage skills in AI engineering: the right prompt can turn a mediocre result into a production-ready one.",
      },
      {
        heading: "Zero-Shot Prompting",
        body: "Ask the model to perform a task with no examples. Works well for tasks the model has seen during training.\n\nPrompt: 'Classify the sentiment: \"This product is amazing!\" Answer with POSITIVE or NEGATIVE.'\n\nBest practice: be explicit about the output format. Don't assume the model will guess.",
      },
      {
        heading: "Few-Shot Prompting",
        body: "Provide 2–5 examples of input → output pairs before the real query. Dramatically improves accuracy on structured or domain-specific tasks.\n\nKey rules:\n• Keep examples consistent in format\n• Cover edge cases in your examples\n• More examples help — but too many waste context\n• Examples should match the distribution of real inputs",
        code: `prompt = """Classify customer support tickets by urgency: CRITICAL, HIGH, LOW.

Ticket: "Site is completely down, losing $10k/minute"
Urgency: CRITICAL

Ticket: "Button color looks off on mobile"
Urgency: LOW

Ticket: "API returning 500 errors for 20% of requests"
Urgency: HIGH

Ticket: "Users can't log in — all accounts locked out"
Urgency: """
# Expected: CRITICAL`,
      },
      {
        heading: "Chain-of-Thought (CoT) Prompting",
        body: "Instruct the model to reason step-by-step before giving a final answer. This dramatically improves performance on math, logic, planning, and multi-step problems.\n\nTwo approaches:\n• Zero-shot CoT: append 'Let's think step by step.'\n• Few-shot CoT: provide worked examples with reasoning shown",
        code: `# Zero-shot CoT
prompt_cot = """A train leaves Station A at 9:00 AM traveling at 60 mph.
Another train leaves Station B (300 miles away) at 10:00 AM traveling at 90 mph toward Station A.
At what time do they meet?

Let's think step by step."""

# Few-shot CoT (more powerful)
prompt_few_cot = """Q: Roger has 5 tennis balls. He buys 2 more cans of 3 balls each. How many does he have?
A: Roger starts with 5 balls. 2 cans × 3 balls = 6 new balls. 5 + 6 = 11 balls. Answer: 11.

Q: A store had 25 apples. They sold 18 and received a shipment of 40. How many now?
A: """`,
      },
      {
        heading: "Structured Output Prompting",
        body: "Force the model to output in a specific format (JSON, XML, Markdown table) for downstream parsing.",
        code: `system_prompt = """You are a data extraction assistant.
Always respond with valid JSON only. No explanation, no markdown fences.
Schema: {"name": string, "email": string, "company": string, "intent": "buy"|"support"|"other"}"""

user_message = """Email: Hi, I'm Sarah Chen from TechCorp. I saw your pricing page
and I'm interested in the Enterprise plan. Can we schedule a demo?
My email is sarah@techcorp.io"""

# Expected output:
# {"name": "Sarah Chen", "email": "sarah@techcorp.io",
#  "company": "TechCorp", "intent": "buy"}`,
        note: "For guaranteed JSON output, use APIs that support structured outputs / JSON mode — they constrain sampling to valid JSON tokens.",
      },
    ],
  },
  {
    id: "rlhf",
    title: "RLHF — Aligning LLMs with Human Feedback",
    category: "LLMs & Prompting",
    content: [
      {
        heading: "Why RLHF?",
        body: "A raw pretrained LLM (GPT-3, LLaMA-2 base) is trained to predict next tokens — not to be helpful, harmless, or honest. It may complete harmful requests, hallucinate confidently, or give rambling non-answers. RLHF transforms a text predictor into an aligned assistant.",
      },
      {
        heading: "Stage 1: Supervised Fine-Tuning (SFT)",
        body: "Human labelers write ideal (prompt, response) pairs across diverse topics:\n• Factual QA, coding, reasoning, creative writing, safety refusals\n\nThe base LLM is fine-tuned on these demonstrations. This gives the model the right behavioral format but relies on labeler quality and coverage.",
      },
      {
        heading: "Stage 2: Reward Model (RM)",
        body: "For each prompt, the SFT model generates K responses (e.g., K=4). Human raters rank the responses from best to worst.\n\nA reward model (another LLM with a scalar head) is trained to predict human preference scores from these comparisons:\n\nLoss = −E[log σ(r(x, y_w) − r(x, y_l))]\n\nWhere y_w = preferred response, y_l = less preferred response.",
      },
      {
        heading: "Stage 3: RL Fine-Tuning (PPO)",
        body: "The SFT model (now the policy π) generates responses. The RM scores them. PPO (Proximal Policy Optimization) updates π to maximize reward:\n\nObjective = E[r(x, y)] − β · KL(π || π_SFT)\n\nThe KL penalty prevents the policy from 'reward hacking' — generating nonsense that scores high but isn't actually good. β controls alignment vs reward tradeoff.",
      },
      {
        heading: "DPO — Direct Preference Optimization",
        body: "DPO (2023) skips the reward model entirely. It directly optimizes the policy on preference pairs:\n\nL_DPO = −E[log σ(β·log(π/π_ref)(y_w|x) − β·log(π/π_ref)(y_l|x))]\n\nSimpler, more stable, same or better results than PPO. Now the dominant approach for open-source model alignment (Zephyr, Tulu, OpenHermes).",
        code: `from trl import DPOTrainer, DPOConfig
from transformers import AutoModelForCausalLM, AutoTokenizer

# DPO requires: model, reference model, preference dataset
model = AutoModelForCausalLM.from_pretrained("facebook/opt-125m")
model_ref = AutoModelForCausalLM.from_pretrained("facebook/opt-125m")  # frozen ref
tokenizer = AutoTokenizer.from_pretrained("facebook/opt-125m")

# Dataset format required by DPO
# {"prompt": "...", "chosen": "good response...", "rejected": "bad response..."}
from datasets import Dataset
pref_data = Dataset.from_dict({
    "prompt":   ["What is 2+2?", "Write a poem about AI"],
    "chosen":   ["2+2 equals 4.", "Silicon minds that learn and grow..."],
    "rejected": ["I don't know.", "AI is bad."],
})

training_args = DPOConfig(
    output_dir="./dpo-model",
    num_train_epochs=1,
    per_device_train_batch_size=2,
    beta=0.1,           # KL penalty strength
    learning_rate=5e-7, # Very small — we're nudging, not retraining
)

trainer = DPOTrainer(model=model, ref_model=model_ref, args=training_args,
    train_dataset=pref_data, tokenizer=tokenizer)
trainer.train()`,
        note: "RLHF/DPO is compute-intensive. For most applications, prompt engineering + few-shot examples gets you 80% of the way there.",
      },
    ],
  },
  {
    id: "temperature-sampling",
    title: "Temperature, Top-k, Top-p Sampling",
    category: "LLMs & Prompting",
    content: [
      {
        heading: "How LLMs Generate Text",
        body: "At each step, the LLM outputs a probability distribution over the entire vocabulary (50k+ tokens). Sampling strategy determines how we pick the next token from that distribution.\n\nGreedy decoding: always pick the highest probability token. Fast but repetitive and often suboptimal.\nBeam search: keep top-k sequences at each step. Better quality but computationally expensive.",
      },
      {
        heading: "Temperature",
        body: "Temperature τ scales the logits before softmax:\n\nP(token_i) = exp(logit_i / τ) / Σ exp(logit_j / τ)\n\nτ = 1.0: standard distribution (default)\nτ < 1.0: sharper distribution — more deterministic, focused, conservative\nτ > 1.0: flatter distribution — more random, creative, diverse\nτ → 0: equivalent to greedy decoding\nτ → ∞: uniform distribution (completely random)\n\nUse low temperature (0.0–0.3) for factual tasks. Higher (0.7–1.0) for creative tasks.",
      },
      {
        heading: "Top-k Sampling",
        body: "Keep only the top-k most probable tokens, redistribute probability mass among them, then sample.\n\nk=1: greedy decoding\nk=50: sample from top 50 tokens only\n\nProblem: k is fixed regardless of how peaked or flat the distribution is.",
      },
      {
        heading: "Top-p (Nucleus) Sampling",
        body: "Keep the smallest set of tokens whose cumulative probability ≥ p, then sample.\n\np=0.9: include tokens until their combined probability reaches 90%\n\nAdaptive: if the distribution is peaked (model is confident), fewer tokens are included. If flat (uncertain), more tokens are included. Superior to top-k in practice.",
      },
      {
        heading: "Sampling in Code",
        code: `import torch
import torch.nn.functional as F

def sample_next_token(logits, temperature=1.0, top_k=0, top_p=0.9):
    """
    logits: (vocab_size,) raw model output
    Returns: sampled token index
    """
    logits = logits / temperature

    # Top-k filtering
    if top_k > 0:
        values, _ = torch.topk(logits, top_k)
        min_val = values[-1]
        logits = logits.masked_fill(logits < min_val, float("-inf"))

    # Top-p (nucleus) filtering
    if top_p < 1.0:
        sorted_logits, sorted_idx = torch.sort(logits, descending=True)
        cumprob = torch.cumsum(F.softmax(sorted_logits, dim=-1), dim=-1)
        # Remove tokens once cumulative prob exceeds p
        sorted_logits[cumprob - F.softmax(sorted_logits, dim=-1) > top_p] = float("-inf")
        logits = logits.scatter(0, sorted_idx, sorted_logits)

    probs = F.softmax(logits, dim=-1)
    return torch.multinomial(probs, num_samples=1).item()

# Example: compare temperature effects
vocab_size = 10
raw_logits = torch.tensor([5.0, 3.0, 1.0, 0.5, 0.1, -1.0, -2.0, -3.0, -4.0, -5.0])

for temp in [0.1, 0.5, 1.0, 2.0]:
    probs = F.softmax(raw_logits / temp, dim=-1)
    print(f"τ={temp}: top3 probs = {probs[:3].tolist()}")`,
        note: "For production: temperature=0.7, top_p=0.9 is a solid starting point. For code generation: temperature=0.2. For creative writing: temperature=1.0.",
      },
    ],
  },
  {
    id: "tool-use",
    title: "Tool Use & Function Calling",
    category: "LLMs & Prompting",
    content: [
      {
        heading: "What is Tool Use?",
        body: "Tool use (function calling) allows LLMs to invoke external functions — web search, calculators, databases, APIs — instead of generating an answer from memory alone. This overcomes the key limitations of LLMs: outdated knowledge, inability to perform exact computation, no access to private data.",
      },
      {
        heading: "How It Works",
        body: "1. You define tools with a name, description, and parameter schema (JSON Schema)\n2. LLM decides which tool to call and with what arguments based on the user's request\n3. Your code executes the tool with the provided arguments\n4. Tool result is returned to the LLM\n5. LLM generates a final response incorporating the result\n\nThis loop can repeat multiple times for complex tasks.",
      },
      {
        heading: "Function Calling Example",
        code: `import anthropic
import json

client = anthropic.Anthropic()

# Define tools
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["city"]
        }
    },
    {
        "name": "calculate",
        "description": "Evaluate a mathematical expression",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {"type": "string", "description": "Math expression to evaluate"}
            },
            "required": ["expression"]
        }
    }
]

def get_weather(city, unit="celsius"):
    return {"city": city, "temp": 22, "condition": "sunny", "unit": unit}

def calculate(expression):
    try:
        return {"result": eval(expression)}
    except Exception as e:
        return {"error": str(e)}

def run_tool(name, inputs):
    if name == "get_weather": return get_weather(**inputs)
    if name == "calculate":   return calculate(**inputs)

# Agentic loop
messages = [{"role": "user", "content": "What's the weather in Tokyo? Also, what's 25 * 48?"}]

while True:
    response = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024, tools=tools, messages=messages
    )
    messages.append({"role": "assistant", "content": response.content})

    if response.stop_reason == "end_turn":
        print(next(b.text for b in response.content if hasattr(b, "text")))
        break

    # Execute all tool calls
    tool_results = []
    for block in response.content:
        if block.type == "tool_use":
            result = run_tool(block.name, block.input)
            print(f"Tool: {block.name}({block.input}) → {result}")
            tool_results.append({"type": "tool_result", "tool_use_id": block.id,
                                  "content": json.dumps(result)})

    messages.append({"role": "user", "content": tool_results})`,
        note: "Never eval() user-provided input in production — use a safe math parser like simpleeval or sympy.",
      },
    ],
  },
  {
    id: "ai-agents",
    title: "AI Agents",
    category: "LLMs & Prompting",
    content: [
      {
        heading: "What is an AI Agent?",
        body: "An AI agent is an LLM that autonomously decides which actions to take (tools to call), observes results, and loops until it completes a goal. Unlike a single LLM call, agents can:\n• Break complex tasks into steps\n• Search the web, read files, write code\n• Correct their own mistakes\n• Use memory across turns",
      },
      {
        heading: "ReAct Pattern (Reason + Act)",
        body: "The most widely used agent pattern:\n\n1. Thought: 'I need to find the population of Tokyo'\n2. Action: search('population of Tokyo 2024')\n3. Observation: 'Tokyo population is approximately 13.96 million'\n4. Thought: 'Now I can answer the question'\n5. Final Answer: 'Tokyo has approximately 13.96 million people'\n\nThis Thought → Action → Observation loop repeats until the task is done.",
      },
      {
        heading: "Agent Architecture",
        body: "Core components:\n• LLM backbone — reasoning and decision making\n• Tools — search, code execution, file I/O, APIs, databases\n• Memory — short-term (conversation history), long-term (vector DB), episodic\n• Planning — task decomposition, reflection, self-correction\n• Orchestrator — manages the loop, handles errors, enforces limits",
      },
      {
        heading: "ReAct Agent from Scratch",
        code: `import anthropic
import json

client = anthropic.Anthropic()

SYSTEM = """You are a research agent. You have access to tools to answer user questions.
Think step by step. Use tools when you need external information.
After getting tool results, reason about them before responding."""

# Simple tool implementations
def web_search(query: str) -> str:
    # In production: use Tavily, Serper, or Brave Search API
    return f"[Search results for '{query}']: Found 3 relevant articles about {query}..."

def read_file(path: str) -> str:
    try:
        with open(path) as f: return f.read()
    except FileNotFoundError:
        return f"File not found: {path}"

def python_repl(code: str) -> str:
    import io, contextlib
    output = io.StringIO()
    try:
        with contextlib.redirect_stdout(output):
            exec(code, {})
        return output.getvalue() or "Code executed successfully (no output)"
    except Exception as e:
        return f"Error: {e}"

TOOLS = [
    {"name": "web_search", "description": "Search the web for current information",
     "input_schema": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}},
    {"name": "python_repl", "description": "Execute Python code and return output",
     "input_schema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}},
]

TOOL_MAP = {"web_search": web_search, "python_repl": python_repl}

def run_agent(user_query: str, max_steps: int = 10):
    messages = [{"role": "user", "content": user_query}]
    for step in range(max_steps):
        response = client.messages.create(
            model="claude-opus-4-8", max_tokens=2048,
            system=SYSTEM, tools=TOOLS, messages=messages
        )
        messages.append({"role": "assistant", "content": response.content})
        if response.stop_reason == "end_turn":
            return next(b.text for b in response.content if hasattr(b, "text"))
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = TOOL_MAP[block.name](**block.input)
                print(f"Step {step+1} | {block.name}: {result[:100]}...")
                tool_results.append({"type": "tool_result", "tool_use_id": block.id,
                                     "content": result})
        messages.append({"role": "user", "content": tool_results})
    return "Max steps reached."

answer = run_agent("What is the square root of 144, and search for recent news about AI agents.")
print(answer)`,
        note: "Always set max_steps to prevent infinite loops. Log every tool call for debugging. Add retry logic for tool failures.",
      },
    ],
  },
  {
    id: "langchain",
    title: "LangChain — LLM Application Framework",
    category: "LLMs & Prompting",
    content: [
      {
        heading: "What is LangChain?",
        body: "LangChain is the most popular framework for building LLM applications. It provides:\n• Abstractions for LLMs, chat models, and embeddings\n• Prompt templates and output parsers\n• Chains — sequences of LLM calls and tools\n• Agents — autonomous decision-making with tools\n• Memory — short and long-term conversation memory\n• Document loaders, text splitters, vector stores for RAG",
      },
      {
        heading: "Core Concepts",
        body: "LLM/ChatModel — Unified interface for any LLM provider (OpenAI, Anthropic, Cohere, HuggingFace).\nPromptTemplate — Parameterized prompt strings.\nOutputParser — Parse LLM output into structured formats.\nChain — Sequence of steps: prompt → LLM → parser → next step.\nLCEL (LangChain Expression Language) — Pipe syntax: chain = prompt | llm | parser",
      },
      {
        heading: "RAG Chain with LangChain",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader

# 1. Load and split documents
loader = TextLoader("ml_textbook.txt")
docs = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)

# 2. Create vector store
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(chunks, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# 3. RAG prompt
prompt = ChatPromptTemplate.from_template("""Answer based on context only.
Context: {context}
Question: {question}
Answer:""")

# 4. Build chain with LCEL
llm = ChatAnthropic(model="claude-opus-4-8")

def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# 5. Invoke
answer = rag_chain.invoke("What is backpropagation?")
print(answer)

# Stream response
for chunk in rag_chain.stream("Explain gradient descent"):
    print(chunk, end="", flush=True)`,
        note: "LangChain adds abstraction overhead. For production, consider LangGraph (stateful agents) or building the pipeline yourself for full control.",
      },
    ],
  },
  {
    id: "multi-agent",
    title: "Multi-Agent Systems",
    category: "LLMs & Prompting",
    content: [
      {
        heading: "Why Multiple Agents?",
        body: "Single agents fail on complex tasks because:\n• Context window fills up\n• One agent can't be expert in everything\n• Parallel work is not possible\n• Hard to enforce specialization\n\nMulti-agent systems divide work across specialized agents that collaborate.",
      },
      {
        heading: "Patterns",
        body: "Orchestrator-Worker: A planner agent breaks down tasks and delegates to specialist workers (researcher, coder, writer, critic).\n\nPeer-to-Peer: Agents communicate directly, each with their own goals.\n\nSupervisor: A supervisor reviews worker outputs, sends back for revision if quality is poor.\n\nParallel: Multiple agents work independently on sub-tasks, results merged by coordinator.",
      },
      {
        heading: "Debate Pattern",
        body: "Two agents argue for different solutions. A judge agent evaluates the debate and picks the winner. Forces exploration of multiple perspectives and surfaces weaknesses in reasoning.",
      },
      {
        heading: "Multi-Agent with LangGraph",
        code: `from langgraph.graph import StateGraph, END
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage
from typing import TypedDict, List

llm = ChatAnthropic(model="claude-opus-4-8")

class AgentState(TypedDict):
    task: str
    research: str
    draft: str
    review: str
    final: str

# Specialized agents as simple functions
def researcher(state: AgentState) -> AgentState:
    response = llm.invoke([
        SystemMessage(content="You are a research specialist. Gather key facts and data."),
        HumanMessage(content=f"Research this topic thoroughly: {state['task']}")
    ])
    return {**state, "research": response.content}

def writer(state: AgentState) -> AgentState:
    response = llm.invoke([
        SystemMessage(content="You are a technical writer. Write clear, structured content."),
        HumanMessage(content=f"Write an explanation for: {state['task']}\n\nResearch: {state['research']}")
    ])
    return {**state, "draft": response.content}

def reviewer(state: AgentState) -> AgentState:
    response = llm.invoke([
        SystemMessage(content="You are a critical reviewer. Identify errors and suggest improvements."),
        HumanMessage(content=f"Review this draft and provide feedback:\n{state['draft']}")
    ])
    return {**state, "review": response.content}

def finalizer(state: AgentState) -> AgentState:
    response = llm.invoke([
        SystemMessage(content="Polish the draft based on reviewer feedback."),
        HumanMessage(content=f"Draft:\n{state['draft']}\n\nFeedback:\n{state['review']}")
    ])
    return {**state, "final": response.content}

# Build the pipeline graph
workflow = StateGraph(AgentState)
workflow.add_node("researcher", researcher)
workflow.add_node("writer", writer)
workflow.add_node("reviewer", reviewer)
workflow.add_node("finalizer", finalizer)

workflow.set_entry_point("researcher")
workflow.add_edge("researcher", "writer")
workflow.add_edge("writer", "reviewer")
workflow.add_edge("reviewer", "finalizer")
workflow.add_edge("finalizer", END)

app = workflow.compile()
result = app.invoke({"task": "Explain how Transformers work", "research": "",
                     "draft": "", "review": "", "final": ""})
print(result["final"])`,
        note: "LangGraph enables stateful, cyclical agent graphs with human-in-the-loop checkpoints — ideal for production agentic systems.",
      },
    ],
  },
  {
    id: "context-windows",
    title: "Context Windows & Long Context",
    category: "LLMs & Prompting",
    content: [
      {
        heading: "What is the Context Window?",
        body: "The context window is the maximum number of tokens an LLM can process in a single forward pass — both input and output combined.\n\nModern context windows:\n• GPT-4o: 128K tokens\n• Claude Opus 4.8: 1M tokens\n• Gemini 1.5 Pro: 2M tokens\n\n1 token ≈ 4 characters ≈ 0.75 words in English.\n100K tokens ≈ a full novel.",
      },
      {
        heading: "Lost in the Middle Problem",
        body: "Research shows LLMs perform best on content at the beginning and end of the context. Information buried in the middle of a long context is more likely to be ignored.\n\nMitigation strategies:\n• Place the most important instructions at the start AND end\n• Use RAG to inject only the most relevant chunks rather than full documents\n• Summarize and compress earlier parts of long conversations",
      },
      {
        heading: "Handling Long Documents",
        body: "Map-Reduce: Process each chunk independently (Map), then combine results (Reduce). Good for summarization.\n\nRefine: Process first chunk, then iteratively refine the result with each subsequent chunk. Better coherence.\n\nHierarchical: Summarize chunks into higher-level summaries, then summarize summaries.",
        code: `from langchain_anthropic import ChatAnthropic
from langchain.chains.summarize import load_summarize_chain
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

llm = ChatAnthropic(model="claude-opus-4-8", max_tokens=4096)

# Simulate a long document
long_text = "Machine learning is a subset of AI... " * 500
docs = [Document(page_content=long_text)]

# Split into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)
split_docs = splitter.split_documents(docs)
print(f"Split into {len(split_docs)} chunks")

# Map-Reduce summarization
chain = load_summarize_chain(llm, chain_type="map_reduce", verbose=False)
summary = chain.invoke(split_docs)
print("Map-Reduce Summary:", summary["output_text"][:300])

# Refine (better for nuanced content)
chain_refine = load_summarize_chain(llm, chain_type="refine")
summary_refine = chain_refine.invoke(split_docs[:5])  # Limit for demo
print("Refine Summary:", summary_refine["output_text"][:300])`,
        note: "For RAG, chunk size of 256–512 tokens with 10-20% overlap works well for most document types. Use semantic chunking for better results.",
      },
    ],
  },
]
