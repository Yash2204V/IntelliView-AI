// Development/test setup helper
// This file helps you test without needing integrations immediately

export const isTestMode = process.env.NODE_ENV === "development"

export const getMockInterviewData = () => ({
  id: "mock-interview-001",
  role: "Software Engineer",
  company: "Tech Corp",
  questions: [
    {
      id: "q1",
      text: "Tell me about your background and why you're interested in this role.",
      difficulty: 1,
    },
    {
      id: "q2",
      text: "Describe a challenging project you worked on and how you overcame obstacles.",
      difficulty: 2,
    },
    {
      id: "q3",
      text: "How do you approach learning new technologies?",
      difficulty: 1,
    },
  ],
})
