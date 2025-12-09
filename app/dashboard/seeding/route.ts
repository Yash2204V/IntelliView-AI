import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

const QUESTIONS_BY_ROLE: Record<string, Array<{ text: string; difficulty: string }>> = {
  "software-engineer": [
    {
      text: "Tell me about a challenging bug you debugged. What was your debugging approach?",
      difficulty: "easy",
    },
    {
      text: "Describe your experience with system design. What's the most complex system you've architected?",
      difficulty: "easy",
    },
    { text: "How do you handle technical debt in your projects? Give me a specific example.", difficulty: "medium" },
    {
      text: "Tell me about a time you disagreed with a senior engineer on technical decisions. How did you handle it?",
      difficulty: "medium",
    },
    {
      text: "What's your approach to writing maintainable code? How do you ensure code quality?",
      difficulty: "medium",
    },
    {
      text: "Describe a time when your code caused a production outage. How did you resolve it?",
      difficulty: "hard",
    },
    { text: "How do you approach performance optimization? Walk me through your process.", difficulty: "hard" },
    {
      text: "Tell me about a time you had to refactor legacy code. What challenges did you face?",
      difficulty: "hard",
    },
  ],
  "product-manager": [
    { text: "Tell me about a product you built. What was your go-to-market strategy?", difficulty: "easy" },
    {
      text: "How do you prioritize features when you have limited resources? Walk me through your framework.",
      difficulty: "easy",
    },
    {
      text: "Describe a time when user feedback contradicted your initial assumptions. How did you respond?",
      difficulty: "medium",
    },
    { text: "How do you measure product success? What metrics do you track?", difficulty: "medium" },
    {
      text: "Tell me about a failed product decision and what you learned from it.",
      difficulty: "medium",
    },
    { text: "How do you handle competing priorities from different stakeholders?", difficulty: "hard" },
    {
      text: "Describe a product pivot you've led. How did you manage the transition?",
      difficulty: "hard",
    },
    {
      text: "Tell me about your approach to competitive analysis and market positioning.",
      difficulty: "hard",
    },
  ],
  "data-scientist": [
    {
      text: "Walk me through a machine learning project you led from start to finish.",
      difficulty: "easy",
    },
    { text: "How do you handle imbalanced datasets in classification problems?", difficulty: "easy" },
    {
      text: "Tell me about a time you had to explain complex models to non-technical stakeholders.",
      difficulty: "medium",
    },
    {
      text: "What's your approach to feature engineering? How do you select important features?",
      difficulty: "medium",
    },
    {
      text: "Describe a time when your model failed in production. How did you debug it?",
      difficulty: "medium",
    },
    {
      text: "How do you approach model evaluation beyond accuracy metrics?",
      difficulty: "hard",
    },
    {
      text: "Tell me about your experience with deep learning. When would you use it?",
      difficulty: "hard",
    },
    { text: "Describe your approach to A/B testing and statistical significance.", difficulty: "hard" },
  ],
  "ux-designer": [
    {
      text: "Tell me about a design project you're proud of. Walk me through your process.",
      difficulty: "easy",
    },
    { text: "How do you approach user research? What methods do you prefer?", difficulty: "easy" },
    {
      text: "Describe a time when you had to defend your design decisions to stakeholders.",
      difficulty: "medium",
    },
    { text: "How do you handle conflicting feedback from different team members?", difficulty: "medium" },
    { text: "Tell me about your approach to accessibility in design. Why does it matter?", difficulty: "medium" },
    {
      text: "Describe your process for iterating on designs based on user testing.",
      difficulty: "hard",
    },
    { text: "How do you balance aesthetics with usability in your designs?", difficulty: "hard" },
    {
      text: "Tell me about a time you had to design for a constrained environment (mobile, offline, etc).",
      difficulty: "hard",
    },
  ],
  "business-analyst": [
    { text: "Tell me about a business problem you analyzed and solved.", difficulty: "easy" },
    { text: "How do you gather requirements from diverse stakeholders?", difficulty: "easy" },
    { text: "Describe your experience with data analysis and creating dashboards.", difficulty: "medium" },
    { text: "Tell me about a time you had to communicate complex findings to executives.", difficulty: "medium" },
    {
      text: "How do you approach process improvement projects? Walk me through your framework.",
      difficulty: "medium",
    },
    {
      text: "Describe a time when your analysis revealed unexpected insights. How did you handle it?",
      difficulty: "hard",
    },
    { text: "How do you approach ROI analysis for business decisions?", difficulty: "hard" },
    { text: "Tell me about your experience with SQL and data visualization tools.", difficulty: "hard" },
  ],
}

export async function POST(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seeding not allowed in production" }, { status: 403 })
  }

  try {
    const db = await connectDB()
    const questionsCollection = db.collection("questions")

    // Clear existing questions
    await questionsCollection.deleteMany({})

    // Insert all questions
    const docs: Array<{
      id: number
      role: string
      text: string
      difficulty: string
      order: number
      createdAt: Date
    }> = []
    let questionId = 1

    for (const [role, questions] of Object.entries(QUESTIONS_BY_ROLE)) {
      questions.forEach((q, index) => {
        docs.push({
          id: questionId++,
          role,
          text: q.text,
          difficulty: q.difficulty,
          order: index,
          createdAt: new Date(),
        })
      })
    }

    const result = await questionsCollection.insertMany(docs)

    return NextResponse.json(
      {
        success: true,
        message: `Seeded ${result.insertedCount} questions`,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 })
  }
}
