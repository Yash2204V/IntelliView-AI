"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowLeft, Loader2, Mail, Lock, User, ShieldCheck } from "lucide-react"

interface FormErrors {
  name?: string
  email?: string
  password?: string
}

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "", name: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError("")

    if (!validateForm()) return

    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        setApiError(data.error || "Failed to sign up")
        setLoading(false)
        return
      }

      router.push("/onboarding")
    } catch (err) {
      setApiError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background relative flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <nav className="absolute top-8 left-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </nav>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md my-12"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 italic">Begin Your Journey</h1>
          <p className="text-muted-foreground font-medium">Create your IntelliView account</p>
        </div>

        <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-blue-500/50 to-primary/50" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 transition-all disabled:opacity-50 placeholder:text-muted-foreground/30 ${errors.name ? "border-destructive/50 focus:ring-destructive/20" : "border-white/10 focus:ring-primary/50"
                  }`}
                disabled={loading}
              />
              {errors.name && <p className="text-xs text-destructive/80 font-medium ml-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 transition-all disabled:opacity-50 placeholder:text-muted-foreground/30 ${errors.email ? "border-destructive/50 focus:ring-destructive/20" : "border-white/10 focus:ring-primary/50"
                  }`}
                disabled={loading}
              />
              {errors.email && <p className="text-xs text-destructive/80 font-medium ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Create Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 transition-all disabled:opacity-50 placeholder:text-muted-foreground/30 ${errors.password ? "border-destructive/50 focus:ring-destructive/20" : "border-white/10 focus:ring-primary/50"
                  }`}
                disabled={loading}
              />
              {errors.password && <p className="text-xs text-destructive/80 font-medium ml-1">{errors.password}</p>}
            </div>

            {apiError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-destructive/10 text-destructive rounded-xl text-sm border border-destructive/20 text-center font-medium"
              >
                {apiError}
              </motion.div>
            )}

            <Button type="submit" className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all text-base font-semibold mt-4" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                "Join Now"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-semibold">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            Secure Enterprise-grade Encryption
          </div>
        </Card>
      </motion.div>
    </main>
  )
}
