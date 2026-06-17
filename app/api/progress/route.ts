import { NextRequest, NextResponse } from "next/server"
import { type Document } from "mongodb"
import { adminAuth } from "@/lib/firebase-admin"
import clientPromise from "@/lib/mongodb"

export interface ProgressDoc extends Document {
  _id: string
  completed: string[]
  streak: number
  lastDay: string
  quizXP: number
  quizResults: Record<string, { score: number; correct: number; total: number }>
  bookmarks: string[]
  notes: Record<string, string>
  activity: Record<string, number>
  updatedAt: Date
}

// If request carries a Firebase Bearer token, verify it and return the UID.
// Otherwise fall back to the client-supplied anonymous UUID.
async function resolveUserId(req: NextRequest, bodyUserId?: string): Promise<string | null> {
  const header = req.headers.get("Authorization")
  if (header?.startsWith("Bearer ") && adminAuth) {
    try {
      const decoded = await adminAuth.verifyIdToken(header.slice(7))
      return decoded.uid
    } catch {
      // invalid or expired token — fall through to anonymous UUID
    }
  }
  return bodyUserId ?? req.nextUrl.searchParams.get("userId") ?? null
}

// GET /api/progress?userId=xxx
export async function GET(req: NextRequest) {
  if (!clientPromise) return NextResponse.json(null)

  const userId = await resolveUserId(req)
  if (!userId) return NextResponse.json(null, { status: 400 })

  try {
    const client = await clientPromise
    const doc = await client
      .db("AIZen")
      .collection<ProgressDoc>("progress")
      .findOne({ _id: userId })
    return NextResponse.json(doc ?? null)
  } catch (err) {
    console.error("MongoDB GET error:", err)
    return NextResponse.json(null, { status: 500 })
  }
}

// POST /api/progress
export async function POST(req: NextRequest) {
  if (!clientPromise) return NextResponse.json({ ok: false, reason: "no db" })

  try {
    const body = await req.json() as {
      userId?: string
      data: Omit<ProgressDoc, "_id" | "updatedAt">
    }

    const userId = await resolveUserId(req, body.userId)
    if (!userId || !body.data) {
      return NextResponse.json({ ok: false, reason: "missing fields" }, { status: 400 })
    }

    const client = await clientPromise
    await client
      .db("AIZen")
      .collection<ProgressDoc>("progress")
      .replaceOne(
        { _id: userId },
        { _id: userId, ...body.data, updatedAt: new Date() },
        { upsert: true }
      )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("MongoDB POST error:", err)
    return NextResponse.json({ ok: false, reason: "db error" }, { status: 500 })
  }
}
