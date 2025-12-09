import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"

const isDevInterview = process.env.NODE_ENV !== "production"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await connectDB()
    const interviews = db.collection("interviews")

    if (isDevInterview) {
      const interview = await interviews.findOne({ _id: new ObjectId(id) })
      if (!interview) {
        return NextResponse.json({ error: "Interview not found" }, { status: 404 })
      }
      return NextResponse.json(interview)
    }

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

    const interview = await interviews.findOne({ _id: new ObjectId(id), userId: session.userId })

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    return NextResponse.json(interview)
  } catch (error) {
    console.error("Get interview error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
