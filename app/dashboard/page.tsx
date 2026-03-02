"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Plus, History, Star, Flame, Clock, Rocket, ArrowRight, Loader2 } from "lucide-react"

interface Interview {
  _id: string
  role: string
  company: string
  score: number
  startedAt: string
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
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <Navigation />

      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Workspace</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2 justify-center sm:justify-start">
              Welcome back to your interview preparation hub
            </p>
          </div>
          <Link href="/onboarding">
            <Button size="lg" className="rounded-full px-8 h-12 shadow-xl shadow-primary/20 gap-2 group">
              <Plus className="w-5 h-5" />
              Start New Interview
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Interviews", value: interviews.length, icon: History, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Avg Score", value: `${avgScore}%`, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Daily Streak", value: "3 Days", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "Practice Time", value: `${interviews.length * 15}m`, icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm relative overflow-hidden group">
                <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* History List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-md">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Rocket className="w-6 h-6 text-primary" />
                  Recent Practice Sessions
                </h2>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 mb-6 font-medium text-sm text-center">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground animate-pulse">Retreiving your performance history...</p>
                </div>
              ) : interviews.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium mb-6">No interview sessions found yet</p>
                  <Link href="/onboarding">
                    <Button variant="outline" className="rounded-full">Launch Your First Session</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {interviews.map((interview, idx) => (
                    <motion.div
                      key={interview._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                    >
                      <Link href={`/results/${interview._id}`}>
                        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer flex justify-between items-center group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-background/50 rounded-xl flex items-center justify-center font-bold text-primary border border-white/5 group-hover:border-primary/20">
                              {interview.score}
                            </div>
                            <div>
                              <p className="font-bold text-lg leading-tight group-hover:text-primary transition-colors capitalize">
                                {interview.role}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1 uppercase">
                                {interview.company} • {new Date(interview.startedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="h-8 w-8 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Sidebar / Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-linear-to-br from-primary/20 to-blue-600/10 border-primary/20 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-3">AI Coach Pro</h3>
                <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                  You're in the top 15% of candidates this week. Focus on improving your "Confidence Score" in the next session.
                </p>
                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-12">
                  View Analytics
                </Button>
              </div>
              <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </Card>

            <Card className="p-6 bg-white/5 border-white/10">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Quick Tips
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                  Maintain eye contact with your camera during responses.
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                  Use the STAR method for behavioral questions.
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                  Speak clearly and keep a steady pace.
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
