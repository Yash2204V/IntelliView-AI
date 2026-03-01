"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Sparkles, Zap, Brain, Target, Activity, History } from "lucide-react"

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

    return {
      clarity: Math.min(100, Math.max(40, (wordCount / 150) * 100)),
      confidence: Math.min(100, 60 + (wordCount / 200) * 40),
      pace: Math.min(100, 70),
      engagement: hasQuestions ? 85 : 65,
    }
  }

  const metrics = calculateMetrics()

  const feedbackTags = [
    { label: "Clarity", score: metrics.clarity, icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Confidence", score: metrics.confidence, icon: Brain, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Pace", score: metrics.pace, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Vibe", score: metrics.engagement, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ]

  return (
    <Card className="p-6 sticky top-24 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl space-y-8 overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <Sparkles className="w-4 h-4 text-primary opacity-20" />
      </div>

      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2 italic">
          <Activity className="w-3 h-3 text-primary" />
          Live Telemetry
        </h3>

        <div className="space-y-6">
          {feedbackTags.map((tag, idx) => (
            <motion.div
              key={tag.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${tag.bg} rounded-lg flex items-center justify-center`}>
                    <tag.icon className={`w-4 h-4 ${tag.color}`} />
                  </div>
                  <span className="text-sm font-bold tracking-tight">{tag.label}</span>
                </div>
                <span className="text-[10px] font-black font-mono text-muted-foreground">{Math.round(tag.score)}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-blue-500 shadow-[0_0_8px_rgba(var(--primary),0.4)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${tag.score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-white/10">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2 italic">
          <History className="w-3 h-3" />
          Transmission History
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {answers.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic opacity-50 text-center py-4">Waiting for first response...</p>
          ) : (
            answers.map((answer, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-medium leading-relaxed italic text-muted-foreground line-clamp-3 hover:bg-white/10 transition-colors"
              >
                <span className="text-primary font-bold not-italic mr-1">T-{idx + 1}:</span> {answer}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}
