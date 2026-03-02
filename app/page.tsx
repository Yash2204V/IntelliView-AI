"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useTransform } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Mic, BarChart3, Brain, ArrowRight, Sparkles, Zap, Fingerprint, Activity, Layers, Target, Globe, Code2 } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground font-sans overflow-x-hidden relative">
      {/* Architectural Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Synthetic Grid */}
        <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

        {/* Focal Orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Unique Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-2xl lg:bg-transparent lg:border-none">
        <div className="max-w-[1800px] mx-auto px-6 sm:px-10 h-20 sm:h-28 flex justify-between items-center">
          <div className="flex items-center gap-6 sm:gap-10">
            <Link href="/" className="group flex items-center gap-4 transition-transform hover:scale-[1.02]">
              <Image src="/logo.jpeg" alt="Logo" width={50} height={50} className="rounded-md bg-white" />
              <div className="flex flex-col">
                <span className="text-xl sm:text-3xl font-black uppercase tracking-tighter leading-none text-foreground">IntelliView</span>
                <span className="text-[10px] sm:text-[12px] font-mono font-black text-primary tracking-[0.3em] uppercase mt-1">AI Interview Platform</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <ModeToggle />
            <Link href="/signup">
              <button className="px-5 sm:px-8 py-2.5 sm:py-3 bg-foreground text-background text-[11px] sm:text-[13px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all transform active:scale-95 skew-x-[-12deg] shadow-xl">
                Register
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero: The Stage */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-8 pt-24 sm:pt-32 lg:pt-0 overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-transparent z-10 opacity-60" />
          <div className="absolute inset-0 bg-linear-to-r from-background via-transparent to-transparent z-10 opacity-40" />
          <img
            src="/bg-img.avif"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-[0.4] dark:opacity-[0.2]"
          />
        </div>

        <div className="max-w-[1800px] mx-auto w-full grid lg:grid-cols-12 gap-8 sm:gap-12 items-center relative z-10">
          <div className="lg:col-span-8 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-6 mb-6 sm:mb-10">
                <div className="h-[2px] w-12 sm:w-20 bg-primary shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
                <span className="text-[11px] sm:text-[10px] font-mono font-black tracking-[0.4em] uppercase text-primary/80">Mastering the Mock Interview</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] font-black leading-[0.9] tracking-tighter mb-8 sm:mb-16">
                <span className="block text-foreground relative">
                  MASTER YOUR
                  <div className="absolute -top-4 -left-4 w-6 h-6 border-t-2 border-l-2 border-primary/20" />
                </span>
                <span className="text-primary italic relative inline-block">
                  INTERVIEWS.
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="absolute -bottom-1 left-0 w-full h-1.5 bg-primary/10 origin-left"
                  />
                </span>
              </h1>

              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start sm:items-center">
                <Link href="/login" className="w-full sm:w-auto">
                  <div className="relative group cursor-pointer transition-transform active:scale-95">
                    <div className="absolute -inset-1 bg-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                    <Button size="lg" className="w-full sm:w-auto h-14 sm:h-20 px-8 sm:px-14 text-sm sm:text-lg font-black uppercase tracking-[0.2em] rounded-none skew-x-[-12deg] bg-primary hover:bg-primary/90 text-white border-none shadow-2xl">
                      Start Interview
                      <ArrowRight className="ml-4 w-4 h-4 sm:w-6 sm:h-6 skew-x-[12deg]" />
                    </Button>
                  </div>
                </Link>
                <div className="max-w-xs sm:max-w-sm font-mono text-[9px] sm:text-[12px] leading-relaxed text-muted-foreground uppercase tracking-tight italic border-l border-border pl-4 sm:pl-6 opacity-80">
                  Practice real-world interviews with our advanced AI. From software engineering to product management—get instant feedback and land your dream job.
                </div>
              </div>
            </motion.div>
          </div>

          {/* Metadata Sidebar / Visual side */}
          <div className="lg:col-span-4 relative h-full flex items-center justify-center mt-20 lg:mt-0">
            <div className="absolute inset-0 border border-primary/5 rounded-full scale-[1.2] hidden lg:block" />
            <div className="absolute inset-0 border border-primary/5 rounded-full scale-[1.5] hidden lg:block" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative aspect-square max-w-[300px] sm:max-w-md mx-auto w-full group"
            >
              {/* Central Visual Hub */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="relative w-full h-full flex items-center justify-center">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 border border-primary/[0.08] rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        rotate: i * 90
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        delay: i * 2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}

                  <div className="w-40 h-40 sm:w-56 sm:h-56 bg-primary/5 backdrop-blur-3xl rounded-full border border-primary/20 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.1)] group-hover:border-primary/40 transition-all duration-700">
                    <Activity className="w-16 h-16 sm:w-24 sm:h-24 text-primary animate-pulse" />
                    <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Connected Metadata Tags */}
              <div className="absolute -top-10 -left-10 bg-background/80 backdrop-blur-xl px-5 py-3 border border-border shadow-2xl z-20 group-hover:-translate-y-2 transition-transform duration-500">
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono font-black text-primary tracking-widest uppercase mb-1">LATENCY</span>
                  <span className="text-xl font-black tabular-nums">42<span className="text-[10px] opacity-40 ml-1">MS</span></span>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 bg-background/80 backdrop-blur-xl px-5 py-3 border border-border shadow-2xl z-20 group-hover:translate-y-2 transition-transform duration-500">
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono font-black text-blue-500 tracking-widest uppercase mb-1">PRECISION</span>
                  <span className="text-xl font-black tabular-nums">99.8<span className="text-[10px] opacity-40 ml-1">%</span></span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator Metadata */}
        <div className="absolute bottom-8 sm:bottom-12 left-4 sm:left-8 hidden sm:block">
          <div className="flex items-center gap-4 text-[9px] sm:text-[10px] font-mono opacity-40 uppercase tracking-widest">
            <div className="w-8 sm:w-16 h-[1px] bg-foreground" />
            <span>Sys.v4.0.2 / Optimal</span>
          </div>
        </div>
      </section>

      {/* The Core Logic Section - Archetypal Layout */}
      <section id="logic" className="relative py-20 sm:py-32 lg:py-64 px-4 sm:px-12 bg-muted/10">
        <div className="absolute inset-0 opacity-[0.2] dark:opacity-[0.05] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:15px_15px] sm:bg-[size:20px_20px]" />

        <div className="max-w-[1800px] mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-24 lg:gap-40 items-start">
            <div className="lg:sticky lg:top-48">
              <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="w-8 sm:w-16 h-[2px] bg-primary" />
                <span className="text-primary font-mono text-xs sm:text-sm font-black uppercase tracking-[0.4em] sm:tracking-[0.5em]">01 / Core Experience</span>
              </div>
              <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter mb-6 sm:mb-10 leading-[1] sm:leading-[0.9]">
                INTERVIEW <br />
                <span className="italic text-primary/40 underline decoration-primary/20 underline-offset-[8px] sm:underline-offset-[12px]">SMARTER.</span>
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl opacity-80 font-medium">
                Practice makes perfect. Our platform allows you to engage in lifelike conversations with an AI that understands technical depth and soft skills alike.
              </p>
            </div>

            <div className="grid gap-10 sm:gap-16 lg:gap-20">
              {[
                {
                  id: "01",
                  title: "Voice AI",
                  desc: "Speak naturally as if you're in a real interview. Our AI handles technical jargon and complex explanations with ease.",
                  icon: Mic
                },
                {
                  id: "02",
                  title: "Custom Roles",
                  desc: "Choose from software engineering, product management, data science, and more. The AI adapts to your seniority level.",
                  icon: Target
                },
                {
                  id: "03",
                  title: "Instant Feedback",
                  desc: "No more waiting. Get a detailed breakdown of your performance, including your logic, tone, and areas for improvement.",
                  icon: BarChart3
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col sm:flex-row gap-8 sm:gap-12 group"
                >
                  <div className="shrink-0 mx-auto sm:mx-0">
                    <div className="w-16 h-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 border border-primary/20 bg-background/50 backdrop-blur-md flex items-center justify-center relative group-hover:border-primary transition-all duration-500 shadow-xl overflow-visible">
                      <div className="absolute -top-3 -right-3 w-8 h-8 border-t border-r border-primary/40 scale-0 group-hover:scale-100 transition-transform duration-500" />
                      <span className="absolute -top-2.5 -left-2.5 text-[10px] sm:text-[11px] font-mono font-black text-primary italic opacity-0 group-hover:opacity-100 transition-opacity tracking-widest bg-background px-1.5 sm:px-2">SYS.{item.id}</span>
                      <item.icon className="w-6 h-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10 opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all duration-500" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase mb-3 sm:mb-4 tracking-tighter group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base sm:text-lg lg:text-xl max-w-lg opacity-70 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Spectrum Grid - Unique Layout Cells */}
      <section id="spectrum" className="py-24 px-4 sm:px-8 border-y border-border">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-1 group/grid overflow-hidden">
          <div className="md:col-span-8 h-[350px] sm:h-[400px] md:h-[600px] bg-muted/10 border border-border p-8 sm:p-12 flex flex-col justify-end group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-primary/10 rounded-full blur-[60px] sm:blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
            <Layers className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-6 sm:mb-8" />
            <h4 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4 sm:mb-6">BEYOND <br /> THE BASICS.</h4>
            <p className="text-muted-foreground font-mono text-[9px] sm:text-xs uppercase tracking-widest max-w-sm">From technical fundamentals to behavioral assessments, our platform covers the full interview spectrum.</p>
          </div>
          <div className="md:col-span-4 space-y-1">
            <div className="h-[250px] sm:h-[300px] bg-primary p-8 sm:p-12 flex flex-col justify-between group cursor-pointer hover:brightness-110 transition-all">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white dark:text-black" />
              <div className="text-white dark:text-black">
                <span className="font-mono text-[9px] sm:text-[10px] font-bold block mb-2 opacity-60">FEATURE / SPEED</span>
                <h4 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-none">Instant <br /> Diagnosis.</h4>
              </div>
            </div>
            <div className="h-[250px] sm:h-[299px] bg-muted/10 border border-border p-8 sm:p-12 flex flex-col justify-between group overflow-hidden">
              <Globe className="w-6 h-6 sm:w-8 sm:h-8 opacity-40 group-hover:text-primary group-hover:opacity-100 transition-all" />
              <div>
                <span className="font-mono text-[9px] sm:text-[10px] font-bold block mb-2 opacity-40">PROTOCOL / RANGE</span>
                <h4 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-none">Global <br /> Standards.</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Final Terminal CTA */}
      <footer id="terminal" className="relative pt-24 sm:pt-48 pb-16 sm:pb-24 px-4 sm:px-12 overflow-hidden bg-muted/5 border-t border-border/50">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-primary to-transparent shadow-[0_0_30px_rgba(79,70,229,0.3)]" />

        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row justify-between lg:items-end gap-16 lg:gap-24">
          <div className="max-w-3xl w-full">
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="w-12 sm:w-16 h-[2px] bg-primary" />
              <span className="text-primary font-mono text-xs sm:text-sm font-black uppercase tracking-[0.4em] sm:tracking-[0.5em]">Final Protocol</span>
            </div>

            <h2 className="text-5xl sm:text-7xl lg:text-[11rem] font-black tracking-tighter leading-[0.9] sm:leading-[0.8] mb-12 sm:mb-16">
              READY TO <br />
              <span className="text-primary italic italic underline-offset-4 sm:underline-offset-8 decoration-primary/20 underline">START?</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              <Link href="/signup" className="w-full sm:w-auto">
                <div className="relative group cursor-pointer transition-transform active:scale-95">
                  <div className="absolute -inset-1 bg-primary blur-lg opacity-20 group-hover:opacity-50 transition-opacity" />
                  <button className="w-full sm:w-auto h-16 sm:h-24 px-8 sm:px-20 bg-foreground text-background font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-base sm:text-xl hover:bg-primary hover:text-white transition-all skew-x-[-12deg] shadow-2xl relative z-10">
                    Start Interview
                  </button>
                </div>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-12 sm:gap-16 w-full lg:w-auto">
            <div className="grid grid-cols-2 gap-12 sm:gap-20 font-mono text-[11px] sm:text-[13px] font-black tracking-[0.2em] uppercase opacity-40 italic">
              <div className="space-y-4">
                <p className="hover:text-primary transition-colors cursor-pointer">Privacy</p>
                <p className="hover:text-primary transition-colors cursor-pointer">Terms</p>
                <p className="hover:text-primary transition-colors cursor-pointer">Support</p>
              </div>
            </div>

            <div className="lg:text-right w-full border-t lg:border-t-0 lg:border-l border-border/50 pt-10 lg:pt-0 lg:pl-10">
              <div className="text-[11px] font-mono opacity-70 uppercase mb-4 tracking-widest">Crafted / &copy; {new Date().getFullYear()} INTELLIVIEW.AI</div>
              <div className="flex gap-3 lg:justify-end items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <span className="text-[11px] font-mono text-green-500 font-black uppercase tracking-[0.2em]">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

