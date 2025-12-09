"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isListening?: boolean
  disabled?: boolean
}

export function VoiceInput({ onTranscript, isListening = false, disabled = false }: VoiceInputProps) {
  const recognitionRef = useRef<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported")
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = "en-US"

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + " " + transcriptSegment)
        } else {
          interimTranscript += transcriptSegment
        }
      }
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
    }

    recognitionRef.current.onend = () => {
      setIsRecording(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) return

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
      if (transcript) {
        onTranscript(transcript)
        setTranscript("")
      }
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  return (
    <div className="space-y-4">
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-card border border-border rounded-lg"
        >
          <p className="text-sm text-muted-foreground mb-2">Your response:</p>
          <p className="text-foreground">{transcript}</p>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleRecording}
        disabled={disabled}
        className={`w-full relative h-16 rounded-lg font-semibold transition-all ${
          isRecording
            ? "bg-destructive text-destructive-foreground"
            : "bg-accent text-accent-foreground hover:bg-accent/90"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isRecording && (
          <>
            <motion.div
              className="absolute inset-0 bg-destructive rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="relative">Stop Recording</span>
          </>
        )}
        {!isRecording && <span>Start Speaking...</span>}
      </motion.button>
    </div>
  )
}
