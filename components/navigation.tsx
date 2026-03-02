"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { Sparkles, LogOut, Loader2 } from "lucide-react"
import Image from "next/image"

export function Navigation() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      setLoading(false)
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center mt-2">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <Image src="/logo.jpeg" alt="Logo" width={50} height={50} className="rounded-md bg-white" />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            IntelliView AI
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loading} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            <span className="hidden sm:inline">{loading ? "Logging out..." : "Logout"}</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
