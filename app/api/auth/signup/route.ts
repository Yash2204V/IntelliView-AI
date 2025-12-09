import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectDB()
    const users = db.collection("users")
    const sessions = db.collection("sessions")

    // Check if user exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await users.insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    })

    // Create session token
    const sessionToken = randomBytes(32).toString("hex")
    await sessions.insertOne({
      userId: result.insertedId.toString(),
      token: sessionToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    // Set session cookie
    const response = NextResponse.json({ userId: result.insertedId.toString() }, { status: 201 })

    response.cookies.set("sessionId", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
