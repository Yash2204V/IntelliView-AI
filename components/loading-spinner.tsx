"use client"

import { motion } from "framer-motion"

export default function LoadingSpinner() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-border border-t-accent rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <p className="text-lg font-medium mb-2">Starting Interview</p>
        <p className="text-sm text-muted-foreground">Preparing your personalized session...</p>
      </motion.div>
    </main>
  )
}
