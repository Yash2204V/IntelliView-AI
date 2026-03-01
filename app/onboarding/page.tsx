"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Sparkles, Briefcase, Building2, Code2, GraduationCap, ChevronRight, ArrowLeft, Loader2, Cpu, BarChart3, Palette, LineChart } from "lucide-react"

const ROLES = [
  { id: "software-engineer", name: "Software Engineer", icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "product-manager", name: "Product Manager", icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "data-scientist", name: "Data Scientist", icon: BarChart3, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "ux-designer", name: "UX Designer", icon: Palette, color: "text-pink-500", bg: "bg-pink-500/10" },
  { id: "business-analyst", name: "Business Analyst", icon: LineChart, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "more", name: "Other Role", icon: Briefcase, color: "text-slate-500", bg: "bg-slate-500/10" },
]

const COMPANIES = [
  { id: "google", name: "Google", logo: "G", color: "text-blue-500" },
  { id: "amazon", name: "Amazon", logo: "A", color: "text-orange-500" },
  { id: "meta", name: "Meta", logo: "M", color: "text-blue-600" },
  { id: "apple", name: "Apple", logo: "", color: "text-slate-900 dark:text-white" },
  { id: "microsoft", name: "Microsoft", logo: "ms", color: "text-blue-400" },
  { id: "more", name: "Start-up / Other", logo: "+", color: "text-slate-500" },
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
    <main className="min-h-screen bg-background relative selection:bg-primary/20 overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <Navigation />

      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Prepare Your Path</h1>
          <p className="text-muted-foreground font-medium max-w-lg mx-auto">
            {step === 0
              ? "Select your target role to begin the deep-dive interview calibration"
              : "Tell us where you're aiming to land and your current arsenal of tools"}
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 text-center font-medium shadow-lg"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {ROLES.map((role) => (
                <motion.button
                  key={role.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedRole(role.id)
                    setStep(1)
                  }}
                >
                  <Card className={`p-8 h-full bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer border relative overflow-hidden group text-left ${selectedRole === role.id ? 'ring-2 ring-primary ring-offset-4 ring-offset-background' : ''}`}>
                    <div className={`w-12 h-12 ${role.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <role.icon className={`w-6 h-6 ${role.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{role.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium italic opacity-70">Customized roadmap available</p>
                    <ChevronRight className="absolute bottom-6 right-6 w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                  </Card>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => setSelectedCompany(company.id)}
                    className={`p-6 rounded-2xl border transition-all text-center relative overflow-hidden group ${selectedCompany === company.id
                        ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                  >
                    <div className={`text-2xl font-black mb-2 ${selectedCompany === company.id ? 'text-white' : company.color}`}>
                      {company.logo}
                    </div>
                    <p className="font-bold text-sm tracking-tight">{company.name}</p>
                    {selectedCompany === company.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-md space-y-8">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 block italic flex items-center gap-2">
                    <Building2 className="w-3 h-3" />
                    Primary Stack / Skills
                  </label>
                  <Input
                    placeholder="e.g. React, Node.js, System Design..."
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-lg font-medium px-6 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 block italic flex items-center gap-2">
                    <BarChart3 className="w-3 h-3" />
                    Professional Altitude
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["fresher", "junior", "mid", "senior"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setExperienceLevel(level)}
                        className={`text-sm px-6 py-4 rounded-xl border-2 font-bold transition-all capitalize ${experienceLevel === level
                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                            : "border-white/5 bg-white/5 hover:border-white/10 text-muted-foreground"
                          }`}
                      >
                        {level === "fresher" ? "Intern" : level}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep(0)
                    setError("")
                  }}
                  className="h-14 rounded-2xl flex-1 font-bold gap-2 hover:bg-white/5"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Review Role
                </Button>
                <Button
                  onClick={handleStart}
                  disabled={loading || !selectedCompany}
                  className="h-14 flex-1 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg gap-2 shadow-2xl shadow-primary/20 group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Calibrating...
                    </>
                  ) : (
                    <>
                      Start Simulation
                      <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
