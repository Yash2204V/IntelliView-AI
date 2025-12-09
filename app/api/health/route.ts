export async function GET() {
  const hasGroqKey = !!process.env.GROQ_API_KEY
  const hasMongoUri = !!process.env.MONGODB_URI

  return Response.json({
    status: "ok",
    integrations: {
      groq: hasGroqKey ? "connected" : "missing",
      mongodb: hasMongoUri ? "connected" : "missing",
    },
    message: !hasGroqKey || !hasMongoUri ? "Add missing env vars in Vars sidebar" : "All systems ready",
  })
}
