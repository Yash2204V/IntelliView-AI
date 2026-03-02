"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VoiceInput } from "./voice-input"
import { WaveformVisualizer } from "./waveform-visualizer"
import { LiveFeedback } from "./live-feedback"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Sparkles, Mic, X, ChevronRight, Loader2, Info } from "lucide-react"

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
    <main className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Background Decorative Blur */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-tr from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight uppercase tracking-tight">{interview.role}</h1>
              <p className="text-xs text-muted-foreground font-medium italic opacity-70">Live Session • {interview.company}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-black">Progress</p>
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm">{questionIndex + 1} / 5</span>
                <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((questionIndex + 1) / 5) * 100}%` }}
                    className="h-full bg-linear-to-r from-primary to-blue-500 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                  />
                </div>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={() => setShowExitConfirm(true)} className="rounded-full hover:bg-destructive/10 hover:text-destructive group transition-colors">
              <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-12">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 text-center font-medium shadow-lg"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
            <p className="text-muted-foreground font-medium animate-pulse">Initializing Neural Coach Interface...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Interview Panel */}
            <div className="lg:col-span-2 space-y-8">
              {/* AI Coach Display */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Card className="p-10 text-center bg-white/5 border-white/10 backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                    <div className={`w-2 h-2 rounded-full ${isAiSpeaking ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'} shadow-[0_0_10px_currentColor]`} />
                  </div>

                  <motion.div
                    className="w-24 h-24 rounded-3xl bg-linear-to-tr from-primary to-blue-600 mx-auto mb-8 flex items-center justify-center relative shadow-2xl shadow-primary/30"
                    animate={isAiSpeaking ? {
                      scale: [1, 1.05, 1],
                      rotate: [0, 1, -1, 0],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Mic className="w-10 h-10 text-white" />
                    {isAiSpeaking && (
                      <motion.div
                        className="absolute -inset-2.5 border-2 border-primary/30 rounded-[2.5rem]"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  <div className="max-w-xl mx-auto">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 italic">Neural Coach Prompt</h3>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={currentQuestion}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight bg-linear-to-br from-foreground to-foreground/80 bg-clip-text text-transparent italic"
                      >
                        "{currentQuestion}"
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>

              {/* Interaction Visuals */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 px-2">
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                  <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground italic">Input Interface</span>
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <WaveformVisualizer isActive={!isAiSpeaking} />

                <VoiceInput onTranscript={handleSubmitAnswer} isListening={!isAiSpeaking} disabled={loading} />
              </motion.div>

              {/* Dynamic Feedback Popup */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative"
                  >
                    <Card className="p-6 bg-primary/5 border-primary/20 backdrop-blur-xl shadow-xl shadow-primary/5">
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <Info className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-primary mb-1 italic">Real-time Coaching</p>
                          <p className="text-sm font-medium leading-relaxed">{feedback}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar Analytics */}
            <div className="space-y-6">
              <LiveFeedback answers={answers} currentQuestion={currentQuestion} />

              <Card className="p-6 bg-white/5 border-white/10 hidden lg:block">
                <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-primary" />
                  Quick Reminders
                </h4>
                <div className="space-y-3">
                  {[
                    "Slow down your speaking rate if needed",
                    "Be specific with your technical stack examples",
                    "It's okay to take a 2-second pause to think"
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-3 text-xs text-muted-foreground font-medium leading-relaxed italic">
                      <div className="w-1 h-1 bg-primary rounded-full mt-1.5 shrink-0" />
                      {tip}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Exit Modal - Enhanced Blur */}
        <AnimatePresence>
          {showExitConfirm && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/40 backdrop-blur-2xl"
                onClick={() => setShowExitConfirm(false)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-sm relative"
              >
                <Card className="p-8 border-white/10 shadow-3xl bg-background/80 backdrop-blur-md">
                  <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center mb-6">
                    <X className="w-6 h-6 text-destructive" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 italic">Pause Session?</h3>
                  <p className="text-muted-foreground mb-8 font-medium">Your current progress across {questionIndex + 1} questions will be archived in your history.</p>
                  <div className="flex flex-col gap-3">
                    <Button onClick={handleExitInterview} className="w-full h-12 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold shadow-xl shadow-destructive/20">
                      Save & Exit Now
                    </Button>
                    <Button variant="ghost" onClick={() => setShowExitConfirm(false)} className="w-full h-12 rounded-xl font-bold">
                      Continue Practice
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
