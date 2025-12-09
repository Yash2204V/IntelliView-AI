"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import InterviewRoom from "@/components/interview-room"
import LoadingSpinner from "@/components/loading-spinner"

export default function InterviewPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [interviewData, setInterviewData] = useState<any>(null)

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        console.log("Fetching interview:", params.id)
        const res = await fetch(`/api/interviews/${params.id}`, {
          credentials: "include",
        })
        console.log("Interview fetch response:", res.status)
        if (res.ok) {
          const data = await res.json()
          console.log("Interview data:", data)
          setInterviewData(data)
        } else {
          const errData = await res.json()
          setError(errData.error || "Failed to load interview")
        }
      } catch (error) {
        console.error("Failed to load interview:", error)
        setError("Failed to load interview: " + (error instanceof Error ? error.message : "Unknown error"))
      } finally {
        setLoading(false)
      }
    }

    fetchInterview()
  }, [params.id])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-destructive">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <AnimatePresence>
      {interviewData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <InterviewRoom interview={interviewData} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
