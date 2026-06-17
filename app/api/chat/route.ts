import { NextRequest } from "next/server"
import Groq from "groq-sdk"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return new Response("GROQ_API_KEY not configured", { status: 503 })
  }
  const groq = new Groq({ apiKey })
  const { messages, lessonTitle, lessonCategory, systemOverride } = await req.json() as {
    messages: { role: "user" | "assistant"; content: string }[]
    lessonTitle?: string
    lessonCategory?: string
    systemOverride?: string
  }

  const systemPrompt = systemOverride ?? `You are an expert AI/ML tutor inside AIZen Tutor, a gamified machine learning learning platform.

The student is currently studying: "${lessonTitle ?? "General AI/ML"}" (Category: ${lessonCategory ?? "General"})

Your role:
- Answer questions about this lesson concisely and clearly
- Provide Python code examples when helpful
- Give real-world analogies to simplify complex concepts
- Keep answers focused — 2-4 sentences for simple questions, more detail only when needed
- Use markdown formatting (code blocks with \`\`\`python, **bold**, bullet points)
- Encourage the student — they're earning XP by learning!

Stay focused on AI/ML topics. If asked off-topic, gently steer back to learning.`

  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    max_tokens: 512,
    temperature: 0.5,
    stream: true,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? ""
        if (text) controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
