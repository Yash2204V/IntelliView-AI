import { type NextRequest, NextResponse } from "next/server"
import { generateFeedback } from "@/lib/groq-client"
import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"

const isDevFeedback = process.env.NODE_ENV !== "production"

export async function POST(req: NextRequest) {
  try {
    if (!isDevFeedback) {
      const cookieStore = await cookies()
      const sessionId = cookieStore.get("sessionId")?.value

      if (!sessionId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const db = await connectDB()
      const sessions = db.collection("sessions")

      // Verify session token
      const session = await sessions.findOne({ token: sessionId })
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const { question, answer, role, techStack, experienceLevel } = await req.json()

    const feedback = await generateFeedback(question, answer, role, techStack, experienceLevel)

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Generate feedback error:", error)
    return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 })
  }
}
