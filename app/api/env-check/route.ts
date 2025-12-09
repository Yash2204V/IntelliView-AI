export async function GET() {
  const envVars = {
    GROQ_API_KEY: process.env.GROQ_API_KEY ? "✓ Set" : "✗ Missing",
    MONGODB_URI: process.env.MONGODB_URI ? "✓ Set" : "✗ Missing",
    NODE_ENV: process.env.NODE_ENV || "Not set",
  }

  return Response.json(envVars)
}
