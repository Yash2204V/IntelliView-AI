"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Sparkles, TrendingUp, Award, Clock, MessageSquare, ChevronRight, CheckCircle2 } from "lucide-react"

interface ResultsDashboardProps {
  results: any
}

export default function ResultsDashboard({ results }: ResultsDashboardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState(0)

  // Calculate performance score
  const performanceScore = Math.round(
    (results.metrics.clarity + results.metrics.confidence + results.metrics.pace + results.metrics.engagement) / 4,
  )

  // Prepare data for charts
  const metricsData = [
    { name: "Clarity", value: results.metrics.clarity },
    { name: "Confidence", value: results.metrics.confidence },
    { name: "Pace", value: results.metrics.pace },
    { name: "Engagement", value: results.metrics.engagement },
  ]

  const perQuestionScores: number[] = Array.isArray(results.questionScores) ? results.questionScores : []

  const progressionData = results.questions.map((q: any, idx: number) => ({
    question: `Q${idx + 1}`,
    score: perQuestionScores[idx] ?? performanceScore,
  }))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Celebration Banner */}
      <motion.div
        variants={itemVariants}
        className="mb-16 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.3 }}
      >
        <div className="w-20 h-20 bg-gradient-to-tr from-primary to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Interview Analysis</h1>
        <p className="text-xl text-muted-foreground font-medium">Detailed breakdown of your performance metrics</p>
      </motion.div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="md:col-span-1 bg-primary text-primary-foreground p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div>
            <Award className="w-8 h-8 mb-4 opacity-80" />
            <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Overall Rank</p>
            <div className="text-6xl font-black tracking-tighter mb-2">
              {performanceScore}
              <span className="text-2xl font-normal opacity-60 ml-1">/100</span>
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mt-4 italic">
            {performanceScore >= 80
              ? "Exceptional performance! Ready for target roles."
              : performanceScore >= 60
                ? "Balanced performance. Refine specific weak areas."
                : "Foundation stage. Focus on core communication."}
          </p>
        </Card>

        {/* Dynamic Metric Grid */}
        <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "Duration", value: `${Math.round(results.duration / (60 * 1000))}m`, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Questions", value: results.questions.length, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Improvement Points", value: results.feedback.length, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          ].map((metric, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="p-8 h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default border group text-center flex flex-col items-center justify-center">
                <div className={`w-12 h-12 ${metric.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{metric.label}</p>
                <p className="text-3xl font-black">{metric.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Analytics Visuals */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <motion.div variants={itemVariants}>
          <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-md">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-primary" />
              Core Competencies
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metricsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="url(#colorPrimary)" radius={[10, 10, 0, 0]} barSize={40} />
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={1} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-md">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Performance Curve
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="question" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-primary)"
                  strokeWidth={4}
                  dot={{ r: 6, fill: "var(--color-primary)", strokeWidth: 4, stroke: "#000" }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Answer Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md h-full">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Session Timeline
            </h3>
            <div className="space-y-3">
              {results.questions.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${selectedAnswer === idx ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 border-transparent hover:border-white/10"
                    }`}
                >
                  <span className="font-bold text-sm">Question {idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedAnswer === idx ? 'text-white' : 'text-primary'}`}>
                      {perQuestionScores[idx] ?? performanceScore}%
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedAnswer === idx ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-md h-full relative overflow-hidden min-h-[400px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />

            {results.questions[selectedAnswer] && (
              <motion.div
                key={selectedAnswer}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    Prompt
                  </h4>
                  <p className="text-xl font-bold italic leading-relaxed text-foreground/90">
                    "{results.questions[selectedAnswer]}"
                  </p>
                </div>

                <div className="p-6 bg-black/20 rounded-2xl border border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Your Answer</h4>
                  <p className="text-muted-foreground leading-relaxed italic">{results.answers[selectedAnswer]}</p>
                </div>

                {results.feedback[selectedAnswer] && (
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      AI Insights
                    </h4>
                    <p className="text-foreground leading-relaxed font-medium">{results.feedback[selectedAnswer]}</p>
                  </div>
                )}
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Improvement Strategy */}
      <motion.div variants={itemVariants} className="mt-12">
        <Card className="p-10 bg-gradient-to-br from-indigo-950/40 via-background to-blue-950/40 border-primary/10">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-black tracking-tight mb-2 italic">Tailored Roadmap</h3>
            <p className="text-muted-foreground font-medium">Strategic steps to reach your target proficiency</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Master structured storytelling with the STAR method for behavioral hurdles",
              "Audit your verbal pace to eliminate filler words and hesitation",
              "Engineer specific success stories for technical deep-dives",
              "Calibrate your non-verbal cues for maximum credibility boost",
            ].map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-colors"
              >
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                <p className="text-foreground font-medium leading-relaxed">{tip}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
