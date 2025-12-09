"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

const ROLES = [
  { id: "software-engineer", name: "Software Engineer", icon: "💻" },
  { id: "product-manager", name: "Product Manager", icon: "🎯" },
  { id: "data-scientist", name: "Data Scientist", icon: "📊" },
  { id: "ux-designer", name: "UX Designer", icon: "🎨" },
  { id: "business-analyst", name: "Business Analyst", icon: "📈" },
]

const COMPANIES = [
  { id: "google", name: "Google", logo: "🔍" },
  { id: "amazon", name: "Amazon", logo: "📦" },
  { id: "meta", name: "Meta", logo: "f" },
  { id: "apple", name: "Apple", logo: "🍎" },
  { id: "microsoft", name: "Microsoft", logo: "M" },
]

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [techStack, setTechStack] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("fresher")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleStart = async () => {
    if (!selectedRole || !selectedCompany) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/interviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          role: selectedRole,
          company: selectedCompany,
          techStack: techStack || "Not specified",
          experienceLevel: experienceLevel || "fresher",
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to start interview")
        setLoading(false)
        return
      }

      const { interviewId } = await res.json()
      router.push(`/interview/${interviewId}`)
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Let's Get Started</h1>
            <p className="text-muted-foreground">
              {step === 0
                ? "Choose the role you're interviewing for"
                : "Select a company and tell us your tech stack"}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/30 text-sm"
            >
              {error}
            </motion.div>
          )}

          {step === 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {ROLES.map((role) => (
                  <motion.button
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedRole(role.id)
                      setStep(1)
                    }}
                  >
                    <Card
                      className={`p-6 cursor-pointer transition-all ${
                        selectedRole === role.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                      }`}
                    >
                      <div className="text-3xl mb-3">{role.icon}</div>
                      <p className="font-medium">{role.name}</p>
                    </Card>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {COMPANIES.map((company) => (
                  <motion.button
                    key={company.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCompany(company.id)}
                  >
                    <Card
                      className={`p-6 cursor-pointer transition-all ${
                        selectedCompany === company.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                      }`}
                    >
                      <div className="text-3xl mb-3">{company.logo}</div>
                      <p className="font-medium">{company.name}</p>
                    </Card>
                  </motion.button>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-sm font-medium mb-2">Your primary tech stack</p>
                  <Input
                    placeholder="e.g. React, Node.js, MongoDB"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Experience level</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["fresher", "junior", "mid", "senior"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setExperienceLevel(level)}
                        className={`text-sm px-3 py-2 rounded-md border transition-all capitalize ${
                          experienceLevel === level
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        {level === "fresher" ? "Intern / Fresher" : level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(0)
                    setError("")
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button onClick={handleStart} disabled={loading || !selectedCompany} className="flex-1">
                  {loading ? "Starting..." : "Start Interview"}
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
