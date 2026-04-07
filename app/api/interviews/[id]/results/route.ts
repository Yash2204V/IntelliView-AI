import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"

const isDevResults = process.env.NODE_ENV !== "production"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await connectDB()
    const interviews = db.collection("interviews")

    let interview: any | null = null

    if (isDevResults) {
      interview = await interviews.findOne({ _id: new ObjectId(id) })
    } else {
      const cookieStore = await cookies()
      const sessionId = cookieStore.get("sessionId")?.value

      if (!sessionId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const sessions = db.collection("sessions")

      // Verify session token
      const session = await sessions.findOne({ token: sessionId })
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      interview = await interviews.findOne({ _id: new ObjectId(id), userId: session.userId })
    }

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    const metrics = interview.metrics || {
      clarity: 60,
      confidence: 60,
      pace: 60,
      engagement: 60,
    }

    const questionScores: number[] = Array.isArray(interview.questionScores) ? interview.questionScores : []

    const startedAt = interview.startedAt ? new Date(interview.startedAt) : null
    const completedAt = interview.completedAt ? new Date(interview.completedAt) : null
    const duration = startedAt && completedAt ? completedAt.getTime() - startedAt.getTime() : 0

    const results = {
      ...interview,
      duration,
      metrics,
      questionScores,
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Get results error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
