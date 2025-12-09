"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"

interface Interview {
  _id: string
  role: string
  company: string
  score: number
  createdAt: string
  status: string
}

export default function Dashboard() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await fetch("/api/interviews/history", { credentials: "include" })
        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = "/login"
            return
          }
          throw new Error("Failed to load interviews")
        }
        const data = await res.json()
        setInterviews(data)
      } catch (err) {
        setError("Failed to load interview history")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [])

  const avgScore =
    interviews.length > 0 ? Math.round(interviews.reduce((sum, i) => sum + i.score, 0) / interviews.length) : 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex justify-between items-start"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Your interview practice hub</p>
          </div>
          <Link href="/onboarding">
            <Button size="lg">Start New Interview</Button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: "Total Interviews", value: interviews.length, icon: "📝" },
            { label: "Average Score", value: avgScore, icon: "⭐" },
            { label: "Streak", value: "3 days", icon: "🔥" },
            { label: "Total Time", value: `${interviews.length * 15}m`, icon: "⏱️" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-6">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Interview History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Interview History</h2>

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/30 mb-4 text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ scale: [0.95, 1, 0.95] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  className="inline-block"
                >
                  <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full" />
                </motion.div>
                <p className="mt-4 text-muted-foreground">Loading interviews...</p>
              </div>
            ) : interviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No interviews yet. Start practicing now!</p>
                <Link href="/onboarding">
                  <Button>Start First Interview</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.map((interview, idx) => (
                  <motion.div
                    key={interview._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link href={`/results/${interview._id}`}>
                      <div className="p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {interview.role} at {interview.company}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(interview.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-accent">{interview.score}</p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
