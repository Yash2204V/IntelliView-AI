"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ResultsDashboard from "@/components/results-dashboard"
import LoadingSpinner from "@/components/loading-spinner"
import { Navigation } from "@/components/navigation"

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<any>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/interviews/${params.id}/results`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setResults(data)
        }
      } catch (error) {
        console.error("Failed to load results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [params.id])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-accent/5">
      <Navigation />
      {results && (
        <>
          <ResultsDashboard results={results} />

          <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center gap-4">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button onClick={() => router.push("/onboarding")}>Practice Again</Button>
          </div>
        </>
      )}
    </main>
  )
}
