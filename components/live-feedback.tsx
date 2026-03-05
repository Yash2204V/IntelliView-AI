"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import {
  Sparkles, Zap, Brain, Target, Activity,
  History, MessageSquare, ChevronDown, ChevronUp
} from "lucide-react"

interface LiveFeedbackProps {
  answers: string[]
  questions: string[]
  feedbackList: string[]
}

export function LiveFeedback({ answers, questions, feedbackList }: LiveFeedbackProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const calculateMetrics = () => {
    if (answers.length === 0) return { clarity: 0, confidence: 0, pace: 0, vibe: 0 }

    const lastAnswer = answers[answers.length - 1]
    const wordCount = lastAnswer.split(" ").length
    const hasQuestions = lastAnswer.includes("?")

    return {
      clarity: Math.min(100, Math.max(40, (wordCount / 150) * 100)),
      confidence: Math.min(100, 60 + (wordCount / 200) * 40),
      pace: Math.min(100, 70),
      vibe: hasQuestions ? 85 : 65,
    }
  }

  const metrics = calculateMetrics()

  const labels = [
    { label: "Clarity", score: metrics.clarity, icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Confidence", score: metrics.confidence, icon: Brain, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Pace", score: metrics.pace, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Vibe", score: metrics.vibe, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ]

  return (
    <Card className="p-6 sticky top-24 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl space-y-8 overflow-hidden rounded-3xl">
      <div className="absolute top-0 right-0 p-4">
        <Sparkles className="w-4 h-4 text-primary opacity-20" />
      </div>

      {/* Live Telemetry Section */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2 italic">
          <Activity className="w-3 h-3 text-primary" />
          Live Telemetry
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {labels.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className={`w-3 h-3 ${item.color}`} />
                  <span className="text-[10px] font-bold tracking-tight opacity-70">{item.label}</span>
                </div>
                <span className="text-[10px] font-black font-mono">{Math.round(item.score)}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-linear-to-r from-primary to-blue-500`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Transmission History Section */}
      <div className="pt-6 border-t border-white/10">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2 italic">
          <History className="w-3 h-3" />
          Transmission History
        </h4>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {answers.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic opacity-50 text-center py-8">Awaiting first transmission...</p>
          ) : (
            answers.map((answer, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-3 bg-white/5 border-white/5 rounded-2xl hover:bg-white/[0.08] transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1 italic">Q-{idx + 1}</p>
                      <p className="text-[10px] font-bold leading-relaxed line-clamp-1 opacity-60">"{questions[idx]}"</p>
                    </div>
                    {feedbackList[idx] && (
                      <button
                        onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-primary"
                      >
                        {expandedIndex === idx ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedIndex === idx && feedbackList[idx] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
                          <MessageSquare className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                          <p className="text-[10px] font-bold leading-relaxed text-primary/80">
                            {feedbackList[idx]}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}
