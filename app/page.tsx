"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { Mic, BarChart3, Brain, ArrowRight, Sparkles, Shield, Zap } from "lucide-react"

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              IntelliView
            </span>
          </motion.div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <ModeToggle />
            <Link href="/signup">
              <Button size="sm" className="rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 uppercase tracking-wider"
          >
            <Zap className="w-3 h-3" />
            Empowering Your Career Journey
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8"
          >
            Master Your Interviews with{" "}
            <span className="text-gradient">AI Guidance</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Practice real-world conversations with empathetic AI, receive instant feedback, and unlock the confidence to land your dream job.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full group shadow-xl shadow-primary/25">
                Start Free Session
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2">
              View Demo
            </Button>
          </motion.div>
        </div>

        {/* Floating Abstract Element */}
        <motion.div
          style={{ y: y1, opacity }}
          className="mt-20 max-w-4xl mx-auto relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50"
        >
          <div className="aspect-video bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-3xl flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
            <div className="text-center z-10">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-md border border-white/20">
                <Mic className="w-8 h-8 text-white animate-pulse" />
              </div>
              <p className="text-white/60 font-medium">Interactive AI Interface Preview</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Natural Conversations",
              description: "Engage in fluid, voice-to-voice interactions that simulate real-world pressure.",
              icon: Mic,
              color: "text-blue-500",
              bgColor: "bg-blue-500/10",
            },
            {
              title: "Neural Analytics",
              description: "Deep insights into your tone, pacing, and content quality with visual feedback.",
              icon: BarChart3,
              color: "text-purple-500",
              bgColor: "bg-purple-500/10",
            },
            {
              title: "Adaptive AI Engine",
              description: "Questions evolve dynamically based on your performance to push your limits.",
              icon: Brain,
              color: "text-emerald-500",
              bgColor: "bg-emerald-500/10",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="p-8 h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-default group relative overflow-hidden">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust / Stats Section */}
      <section className="bg-black/20 py-16 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-bold text-foreground">50k+</span>
            Mock Interviews
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-bold text-foreground">98%</span>
            Accuracy Rate
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-bold text-foreground">120+</span>
            Job Categories
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-bold text-foreground">15+</span>
            Fortune 100 Companies
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 italic">Ready to transform your career?</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of successful candidates who used IntelliView to land their dream roles.
          </p>
          <Link href="/signup">
            <Button size="lg" className="rounded-full h-14 px-10 text-lg shadow-xl shadow-primary/20">
              Get Started for Free
            </Button>
          </Link>
          <div className="mt-16 flex justify-center gap-8 text-muted-foreground italic">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Secure & Private</span>
            <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Instant Setup</span>
          </div>
        </motion.div>

        <div className="mt-24 pt-8 border-t border-white/5 text-sm text-muted-foreground italic">
          &copy; {new Date().getFullYear()} IntelliView AI. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
