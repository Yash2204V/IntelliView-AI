"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { VoiceInput } from "./voice-input"
import { WaveformVisualizer } from "./waveform-visualizer"
import { LiveFeedback } from "./live-feedback"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface InterviewRoomProps {
  interview: any
}

export default function InterviewRoom({ interview }: InterviewRoomProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [questions, setQuestions] = useState<string[]>([])
  const [feedbackList, setFeedbackList] = useState<string[]>([])
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const synth = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    synth.current = window.speechSynthesis
    fetchFirstQuestion()
  }, [])

  const fetchFirstQuestion = async () => {
    try {
      const res = await fetch("/api/interviews/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          interviewId: interview._id,
          role: interview.role,
          company: interview.company,
          techStack: interview.techStack,
          experienceLevel: interview.experienceLevel,
          questionIndex: 0,
          previousAnswers: [],
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to fetch question")
      }

      const { question } = await res.json()
      setCurrentQuestion(question)
      setQuestions([question])
      setLoading(false)
      speakQuestion(question)
    } catch (err) {
      setError("Failed to load interview. Please try again.")
      setLoading(false)
    }
  }

  const speakQuestion = (question: string) => {
    if (!synth.current) return

    setIsAiSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(question)
    utterance.rate = 0.95
    utterance.pitch = 1

    utterance.onend = () => {
      setIsAiSpeaking(false)
    }

    synth.current.cancel()
    synth.current.speak(utterance)
  }

  const handleSubmitAnswer = async (answer: string) => {
    if (!answer.trim()) return

    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    try {
      // Get feedback
      const feedbackRes = await fetch("/api/interviews/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question: currentQuestion,
          answer,
          role: interview.role,
          techStack: interview.techStack,
          experienceLevel: interview.experienceLevel,
        }),
      })

      if (feedbackRes.ok) {
        const { feedback: feedbackText } = await feedbackRes.json()
        setFeedback(feedbackText)
        setFeedbackList((prev) => [...prev, feedbackText])
      }

      // Wait 2 seconds then get next question
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (questionIndex < 4) {
        const nextRes = await fetch("/api/interviews/question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            interviewId: interview._id,
            role: interview.role,
            company: interview.company,
            techStack: interview.techStack,
            experienceLevel: interview.experienceLevel,
            questionIndex: questionIndex + 1,
            previousAnswers: newAnswers,
          }),
        })

        if (nextRes.ok) {
          const { question } = await nextRes.json()
          setCurrentQuestion(question)
          setQuestionIndex(questionIndex + 1)
          setQuestions((prev) => [...prev, question])
          // Keep previous feedback visible until the next answer is given
          speakQuestion(question)
        } else {
          throw new Error("Failed to get next question")
        }
      } else {
        // Interview complete
        await fetch("/api/interviews/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            interviewId: interview._id,
            answers: newAnswers,
            questions,
            feedback: feedbackList,
          }),
        })

        router.push(`/results/${interview._id}`)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    }
  }

  const handleExitInterview = async () => {
    try {
      await fetch("/api/interviews/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          interviewId: interview._id,
          answers,
          questions,
          feedback: feedbackList,
        }),
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to exit interview:", error)
      router.push("/dashboard")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-semibold">{interview.role}</h1>
            <p className="text-sm text-muted-foreground">{interview.company}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Question</p>
              <p className="font-semibold">{questionIndex + 1} / 5</p>
            </div>

            <motion.div
              animate={{ scaleX: [(questionIndex + 1) / 5, (questionIndex + 1) / 5] }}
              className="w-32 h-1 bg-border rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-accent rounded-full"
                style={{ width: `${((questionIndex + 1) / 5) * 100}%` }}
              />
            </motion.div>

            <Button variant="outline" size="sm" onClick={() => setShowExitConfirm(true)}>
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/30"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ scale: [0.95, 1, 0.95] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="inline-block"
            >
              <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full" />
            </motion.div>
            <p className="mt-4 text-muted-foreground">Loading interview...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Interview Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Avatar - Animated listening state */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Card className="p-8 text-center">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center"
                    animate={{
                      scale: isAiSpeaking ? [1, 1.05, 1] : 1,
                    }}
                    transition={{ duration: 0.6, repeat: isAiSpeaking ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    <span className="text-3xl">🎤</span>
                  </motion.div>
                  <p className="text-sm text-muted-foreground">
                    {isAiSpeaking ? "Listening to your response..." : "Ready to listen"}
                  </p>
                </Card>
              </motion.div>

              {/* Current Question */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                key={currentQuestion}
              >
                <Card className="p-6 bg-gradient-to-br from-card to-accent/5">
                  <p className="text-sm text-muted-foreground mb-3">Current Question</p>
                  <p className="text-xl font-semibold leading-relaxed">{currentQuestion}</p>
                </Card>
              </motion.div>

              {/* Waveform Visualizer */}
              <WaveformVisualizer isActive={true} />

              {/* Voice Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <VoiceInput onTranscript={handleSubmitAnswer} isListening={!isAiSpeaking} disabled={loading} />
              </motion.div>

              {/* Feedback Display */}
              {feedback && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-4 bg-accent/10 border-accent">
                    <p className="text-sm font-medium text-accent mb-2">Coach Feedback</p>
                    <p className="text-sm text-foreground">{feedback}</p>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Right Sidebar - Live Feedback & Progress */}
            <LiveFeedback answers={answers} currentQuestion={currentQuestion} />
          </div>
        )}

        {/* Exit Confirmation Modal */}
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background border border-border rounded-lg p-6 max-w-sm"
            >
              <h3 className="text-lg font-semibold mb-2">Exit Interview?</h3>
              <p className="text-muted-foreground mb-6">Your progress will be saved.</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowExitConfirm(false)} className="flex-1">
                  Continue
                </Button>
                <Button onClick={handleExitInterview} className="flex-1">
                  Exit
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
