import { type NextRequest, NextResponse } from "next/server"
import { generateInterviewQuestion } from "@/lib/groq-client"
import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"

const isDevQuestion = process.env.NODE_ENV !== "production"

export async function POST(req: NextRequest) {
  try {
    if (!isDevQuestion) {
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

    const {
      interviewId,
      role,
      company,
      techStack,
      experienceLevel,
      questionIndex,
      previousQuestions = [],
      previousAnswers = [],
      language = "English",
      resumeText = null,
    } = await req.json()

    // Pass everything directly. Index logic should be consistent between FE and BE.
    const question = await generateInterviewQuestion(
      role,
      company,
      questionIndex, // The Component will decide which index we are on
      previousQuestions,
      previousAnswers,
      techStack,
      experienceLevel,
      language,
      resumeText
    )

    return NextResponse.json({ question })
  } catch (error) {
    console.error("Generate question error:", error)
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 })
  }
}
