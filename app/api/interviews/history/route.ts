import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"

const isDevHistory = process.env.NODE_ENV !== "production"

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB()
    const interviews = db.collection("interviews")

    let query: any = { status: "completed" }

    if (!isDevHistory) {
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

      query.userId = session.userId
    }

    const userInterviews = await interviews.find(query).sort({ completedAt: -1 }).toArray()

    const withScores = userInterviews.map((interview: any) => {
      if (interview.metrics) {
        const { clarity = 0, confidence = 0, pace = 0, engagement = 0 } = interview.metrics
        const score = Math.round((clarity + confidence + pace + engagement) / 4)
        return { ...interview, score }
      }

      return {
        ...interview,
        score: Math.round(60 + Math.random() * 20),
      }
    })

    return NextResponse.json(withScores)
  } catch (error) {
    console.error("Get history error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
