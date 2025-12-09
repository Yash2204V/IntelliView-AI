import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"

const isDev = process.env.NODE_ENV !== "production"

export async function POST(req: NextRequest) {
  try {
    const db = await connectDB()
    const interviews = db.collection("interviews")

    let userId: string | null = null

    if (isDev) {
      // Dev mode: use a fixed user id and skip auth
      userId = "dev-user"
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

      // Check if session is expired
      if (new Date() > session.expiresAt) {
        await sessions.deleteOne({ token: sessionId })
        return NextResponse.json({ error: "Session expired" }, { status: 401 })
      }

      userId = session.userId
    }

    const { role, company, techStack = "Not specified", experienceLevel = "fresher" } = await req.json()

    const result = await interviews.insertOne({
      userId,
      role,
      company,
      techStack,
      experienceLevel,
      status: "in_progress",
      questions: [],
      answers: [],
      feedback: [],
      startedAt: new Date(),
      completedAt: null,
    })

    return NextResponse.json({ interviewId: result.insertedId.toString() }, { status: 201 })
  } catch (error) {
    console.error("Create interview error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
