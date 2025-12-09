"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

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
        className="mb-12 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.3 }}
      >
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-4xl font-bold mb-2">Interview Complete!</h1>
        <p className="text-lg text-muted-foreground">Here's your detailed performance analysis</p>
      </motion.div>

      {/* Performance Score */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-8 col-span-1 md:col-span-1 bg-gradient-to-br from-accent to-accent/50 text-accent-foreground">
          <p className="text-sm font-medium mb-4 opacity-80">Overall Score</p>
          <motion.div
            className="text-5xl font-bold mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.5, duration: 0.6 }}
          >
            {performanceScore}
            <span className="text-2xl">/100</span>
          </motion.div>
          <div className="text-sm opacity-80">
            {performanceScore >= 80
              ? "Excellent performance!"
              : performanceScore >= 60
                ? "Good job, keep improving!"
                : "Keep practicing!"}
          </div>
        </Card>

        {/* Key Metrics Cards */}
        {[
          { label: "Duration", value: `${Math.round(results.duration / (60 * 1000))}m`, icon: "⏱️" },
          { label: "Questions", value: results.questions.length, icon: "❓" },
          { label: "Feedback Items", value: results.feedback.length, icon: "💡" },
        ].map((metric, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="p-6">
              <div className="text-2xl mb-2">{metric.icon}</div>
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Metrics Bar Chart */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Performance Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Progression Line Chart */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Question Performance Progression</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="question" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-accent)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Feedback Section */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <h3 className="font-semibold mb-6">Question-by-Question Analysis</h3>

          <div className="space-y-4">
            {results.questions.map((question: string, idx: number) => (
              <motion.button
                key={idx}
                onClick={() => setSelectedAnswer(idx)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedAnswer === idx ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                whileHover={{ translateX: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Question {idx + 1}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{question}</p>
                  </div>
                  <div className="ml-4 text-sm font-semibold text-accent">
                    Score: {perQuestionScores[idx] ?? performanceScore}%
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Selected Answer Details */}
          {results.answers[selectedAnswer] && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-6 border-t border-border"
            >
              <h4 className="font-medium mb-3">Your Response</h4>
              <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg mb-4">{results.answers[selectedAnswer]}</p>

              {results.feedback[selectedAnswer] && (
                <>
                  <h4 className="font-medium mb-3 text-accent">Coach Feedback</h4>
                  <p className="text-foreground bg-accent/10 p-4 rounded-lg">{results.feedback[selectedAnswer]}</p>
                </>
              )}
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Improvement Suggestions */}
      <motion.div variants={itemVariants} className="mt-8">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <h3 className="font-semibold mb-4">Personalized Improvement Plan</h3>

          <div className="space-y-3">
            {[
              "Practice structured responses using the STAR method",
              "Work on maintaining steady pace throughout answers",
              "Prepare specific examples for technical questions",
              "Practice speaking clearly and avoiding filler words",
            ].map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex gap-3"
              >
                <div className="text-accent mt-1">✓</div>
                <p className="text-foreground">{tip}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
