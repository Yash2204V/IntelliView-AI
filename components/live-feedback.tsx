"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface LiveFeedbackProps {
  answers: string[]
  currentQuestion: string
}

export function LiveFeedback({ answers, currentQuestion }: LiveFeedbackProps) {
  const calculateMetrics = () => {
    if (answers.length === 0) return { clarity: 0, confidence: 0, pace: 0, engagement: 0 }

    // Simple heuristic metrics
    const lastAnswer = answers[answers.length - 1]
    const wordCount = lastAnswer.split(" ").length
    const hasQuestions = lastAnswer.includes("?")
    const hasEmojis = /\p{Emoji}/u.test(lastAnswer)

    return {
      clarity: Math.min(100, Math.max(40, (wordCount / 150) * 100)),
      confidence: Math.min(100, 60 + (wordCount / 200) * 40),
      pace: Math.min(100, 70),
      engagement: hasQuestions ? 85 : 65,
    }
  }

  const metrics = calculateMetrics()

  const feedbackTags = [
    { label: "Clarity", score: metrics.clarity, icon: "📝" },
    { label: "Confidence", score: metrics.confidence, icon: "💪" },
    { label: "Pace", score: metrics.pace, icon: "⚡" },
    { label: "Engagement", score: metrics.engagement, icon: "🎯" },
  ]

  return (
    <Card className="p-6 sticky top-20 space-y-4">
      <h3 className="font-semibold">Live Feedback</h3>

      <div className="space-y-3">
        {feedbackTags.map((tag, idx) => (
          <motion.div
            key={tag.label}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span>{tag.icon}</span>
              <span className="text-sm font-medium">{tag.label}</span>
              <span className="text-xs text-muted-foreground">{Math.round(tag.score)}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${tag.score}%` }}
                transition={{ duration: 0.8, delay: 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-border pt-4">
        <h4 className="font-medium text-sm mb-3">Answer History</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {answers.map((answer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2 bg-muted/50 rounded text-xs text-muted-foreground line-clamp-2"
            >
              Q{idx + 1}: {answer.substring(0, 60)}...
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  )
}
