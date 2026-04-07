import Groq from "groq-sdk"

let cachedGroq: Groq | null = null

export function getGroqClient() {
  if (!cachedGroq) {
    cachedGroq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }
  return cachedGroq
}

export async function generateInterviewQuestion(
  role: string,
  company: string,
  questionIndex: number,
  previousQuestions: string[] = [],
  previousAnswers: string[] = [],
  techStack?: string,
  experienceLevel: string = "fresher",
  language: string = "English",
) {
  const groq = getGroqClient()

  const levelDescription =
    experienceLevel === "senior"
      ? "a senior-level"
      : experienceLevel === "mid"
        ? "a mid-level"
        : experienceLevel === "junior"
          ? "a junior"
          : "an intern / fresher"

  const context = previousQuestions.length > 0
    ? `You have already asked these questions: ${previousQuestions.join(" | ")}. 
Candidate's previous answers: ${previousAnswers.join(" | ")}. 
DO NOT repeat these topics—move on to a different technical area.`
    : ""

  const bilingualInstruction = language === "English"
    ? `The interview MUST be conducted entirely in English. Ask the question in clear, concise English.`
    : `The interview question must include BOTH of the following so that users who understand ${language} but may not be able to read it still see English:
- First line: the question in clear, simple English.
- Second line: the same question translated into ${language}.
Do not add any extra commentary or labels like "English:" or "${language}:"—only the two versions of the question on separate lines.`

  const prompt = `You are conducting a professional and friendly mock interview for ${levelDescription} ${role} candidates at ${company}.
${techStack ? `The candidate's primary tech stack is: ${techStack}.` : ""}
${context}

Generate exactly ONE interview question for Question ${questionIndex} of the session.

CONSTRAINTS BASED ON LEVEL:
- If Senior: Focus on architecture, scalability, trade-offs, system design, and maintainability related to ${techStack || role}.
- If Mid/Junior: Focus on implementation details, common APIs, practical troubleshooting, and best practices.
- If Fresher: Focus on theoretical fundamentals, core data structures/logic, and basic conceptual understanding.

LANGUAGE RULES:
${bilingualInstruction}

GENERAL RULES:
- Focus heavily on ${techStack || role} and day-to-day practical work.
- Scales in difficulty: Q1-2 are foundational; Q3-5 are more scenario-based or complex.
- DO NOT repeat topics covered in the history.
- Respond with ONLY the question text as specified above, no conversational filler or quotes.`

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 200,
    temperature: 0.8,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  const content = completion.choices?.[0]?.message?.content ?? ""
  return content.toString().trim()
}

export async function generateFeedback(
  question: string,
  answer: string,
  role: string,
  techStack?: string,
  experienceLevel: string = "fresher",
  language: string = "English"
) {
  const groq = getGroqClient()

  const stackLine = techStack && techStack.trim().length > 0 ? `Tech stack: ${techStack}.` : ""

  const prompt = `You are an expert interview coach helping a ${experienceLevel} ${role} candidate.

${stackLine}

QUESTION: ${question}
ANSWER: ${answer}

Provide refined, professional coaching feedback (EXACTLY 2 concise sentences) on:
1. Technical Precision: Identify one specific technical strength or a missed key concept.
2. Tactical Improvement: Give one high-impact, actionable tip for the next response.

The feedback must be in ${language}.
The feedback must be sophisticated yet direct. Avoid generic praise like "Good job."
Example (if English): "Excellent mention of virtual DOM reconciliation. Next, try to articulate how 'key' props optimize this process specifically."`

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  const content = completion.choices?.[0]?.message?.content ?? ""
  return content.toString().trim()
}

export async function evaluateInterview(
  questions: string[],
  answers: string[],
  role: string,
  techStack?: string,
  experienceLevel: string = "fresher",
) {
  const groq = getGroqClient()

  // STRICT COMPLETION RULE: If the candidate leaves in the middle (less than 5 answers), zero points.
  if (!questions || !answers || answers.length < 5) {
    return {
      clarity: 0,
      confidence: 0,
      pace: 0,
      engagement: 0,
    }
  }

  const pairs = questions.slice(0, answers.length).map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || ""}`)

  const stackLine = techStack && techStack.trim().length > 0 ? `Tech stack: ${techStack}.` : ""

  const prompt = `You are an interview evaluator.
Candidate level: ${experienceLevel} ${role}.
${stackLine}

The candidate's answers come from speech recognition, so they may contain glitches,
typos, repetitions, or broken sentences. Ignore these surface issues and focus on
the ideas and key technical concepts.

Here are the interview questions and answers:

${pairs.join("\n\n")}\n\n
Evaluate the candidate on these 4 metrics, each from 0 to 100:
- clarity: how clear and understandable the ideas are overall
- confidence: how confident and assured the candidate seems, even if wording is rough
- pace: how well-paced and structured the answers feel
- engagement: how engaged and relevant the answers are to each question

Scoring guidelines:
- Empty, totally off-topic, or nonsense answers can be below 20.
- If the candidate mentions at least some correct key concepts but is incomplete
  or a bit nervous, keep scores mostly in the 50-80 range.
- Only very strong, detailed, and accurate answers across all questions should
  be above 90.

Respond ONLY with a JSON object like this and nothing else:
{"clarity": 0-100, "confidence": 0-100, "pace": 0-100, "engagement": 0-100}`

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  const content = completion.choices?.[0]?.message?.content ?? ""

  try {
    const parsed = JSON.parse(content.toString())
    const clamp = (v: any) => {
      const n = typeof v === "number" ? v : Number(v)
      if (Number.isNaN(n)) return 60
      return Math.max(0, Math.min(100, Math.round(n)))
    }

    return {
      clarity: clamp(parsed.clarity),
      confidence: clamp(parsed.confidence),
      pace: clamp(parsed.pace),
      engagement: clamp(parsed.engagement),
    }
  } catch {
    return {
      clarity: 60,
      confidence: 60,
      pace: 60,
      engagement: 60,
    }
  }
}

export async function evaluatePerQuestionScores(
  questions: string[],
  answers: string[],
  role: string,
  techStack?: string,
  experienceLevel: string = "fresher",
) {
  const groq = getGroqClient()

  // STRICT COMPLETION RULE: If the candidate leaves in the middle (less than 5 answers), zero points.
  if (!questions || !answers || answers.length < 5) {
    return questions.map(() => 0)
  }

  const pairs = questions.slice(0, answers.length).map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || ""}`)

  const stackLine = techStack && techStack.trim().length > 0 ? `Tech stack: ${techStack}.` : ""

  const prompt = `You are evaluating each interview question separately.
Candidate level: ${experienceLevel} ${role}.
${stackLine}

Here are the questions and answers:

${pairs.join("\n\n")}\n\n
For each question-answer pair, assign a single score from 0 to 100
based on how well the candidate answered that particular question.

Scoring guidelines per question:
- 0-20: very weak or off-topic answer
- 20-59: partially correct but missing key ideas
- 60-79: generally good answer with some minor gaps
- 80-100: strong, detailed, and accurate answer

Important: speech recognition may introduce glitches; ignore those and
focus on the technical ideas and key concepts.

Respond ONLY with a JSON object like this and nothing else:
{"scores": [s1, s2, ...]} where each si is between 0 and 100.`

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  const content = completion.choices?.[0]?.message?.content ?? ""

  try {
    const parsed = JSON.parse(content.toString())
    const rawScores: any[] = Array.isArray(parsed.scores) ? parsed.scores : []
    const clamp = (v: any) => {
      const n = typeof v === "number" ? v : Number(v)
      if (Number.isNaN(n)) return 60
      return Math.max(0, Math.min(100, Math.round(n)))
    }

    return rawScores.slice(0, answers.length).map(clamp)
  } catch {
    return [] as number[]
  }
}
