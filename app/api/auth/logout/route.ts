import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("sessionId")?.value

    if (sessionId) {
      const db = await connectDB()
      const sessions = db.collection("sessions")
      await sessions.deleteOne({ token: sessionId })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete("sessionId")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    const response = NextResponse.json({ success: true })
    response.cookies.delete("sessionId")
    return response
  }
}