import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { evaluateInterview, evaluatePerQuestionScores } from "@/lib/groq-client"

const isDevComplete = process.env.NODE_ENV !== "production"

export async function POST(req: NextRequest) {
  try {
    const db = await connectDB()
    const interviews = db.collection("interviews")

    const { interviewId, answers, questions = [], feedback = [] } = await req.json()

    const objectId = new ObjectId(interviewId)

    let interview: any | null = null

    if (!isDevComplete) {
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

      // Verify the interview belongs to this user
      interview = await interviews.findOne({ _id: objectId, userId: session.userId })
      if (!interview) {
        return NextResponse.json({ error: "Interview not found" }, { status: 404 })
      }
    } else {
      interview = await interviews.findOne({ _id: objectId })
    }

    const safeQuestions: string[] = Array.isArray(questions) && questions.length > 0 ? questions : interview?.questions || []
    const safeAnswers: string[] = Array.isArray(answers) ? answers : []

    const [metrics, questionScores] = await Promise.all([
      evaluateInterview(
        safeQuestions,
        safeAnswers,
        interview?.role || "",
        interview?.techStack,
        interview?.experienceLevel || "fresher",
      ),
      evaluatePerQuestionScores(
        safeQuestions,
        safeAnswers,
        interview?.role || "",
        interview?.techStack,
        interview?.experienceLevel || "fresher",
      ),
    ])

    await interviews.updateOne(
      { _id: objectId },
      {
        $set: {
          answers: safeAnswers,
          questions: safeQuestions,
          feedback: Array.isArray(feedback) ? feedback : interview?.feedback || [],
          metrics,
          questionScores,
          status: "completed",
          completedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true, metrics, questionScores })
  } catch (error) {
    console.error("Complete interview error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
