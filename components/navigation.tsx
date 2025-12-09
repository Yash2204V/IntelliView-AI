"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

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
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/dashboard"
          className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          IntelliView
        </Link>
        <Button variant="outline" onClick={handleLogout} disabled={loading}>
          {loading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </nav>
  )
}
