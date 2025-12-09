import { MongoClient } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectDB() {
  if (cachedDb) {
    return cachedDb
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI || "")
    await client.connect()
    const db = client.db("intelliview")

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("sessions").createIndex({ userId: 1 })
    await db.collection("interviews").createIndex({ userId: 1, createdAt: -1 })

    cachedClient = client
    cachedDb = db
    return db
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

export async function getUser(userId: string) {
  const db = await connectDB()
  const { ObjectId } = require("mongodb")
  return db.collection("users").findOne({ _id: new ObjectId(userId) })
}
