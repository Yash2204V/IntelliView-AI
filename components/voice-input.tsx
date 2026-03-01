"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, AlertCircle, Send, Loader2, Keyboard, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isListening?: boolean
  disabled?: boolean
}

export function VoiceInput({ onTranscript, isListening = false, disabled = false }: VoiceInputProps) {
  const recognitionRef = useRef<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const [mode, setMode] = useState<"voice" | "text">("voice")

  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      setMode("text")
      return
    }

    try {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        let finalText = ""
        let interimText = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalText += transcriptSegment + " "
          } else {
            interimText += transcriptSegment + " "
          }
        }

        if (finalText) {
          setTranscript((prev) => (prev + " " + finalText).trim())
        }
        setInterimTranscript(interimText.trim())
        setError(null)
      }

      recognitionRef.current.onerror = (event: any) => {
        // Only log meaningful errors, ignore timeouts (no-speech) and aborted sessions
        if (event.error !== "no-speech" && event.error !== "aborted") {
          console.error("Speech recognition error:", event.error)
        }

        // Define user-friendly error messages
        const errorMap: Record<string, string> = {
          "not-allowed": "Please allow microphone access to use voice mode.",
          "no-speech": "No speech detected. Click to try again.",
          "network": "Network error. Checking connection...",
          "aborted": "Listening stopped.",
          "service-not-allowed": "Speech service unavailable."
        }

        // Handle specific errors
        if (event.error === "no-speech") {
          setIsRecording(false)
          // Optional: Don't set a hard error state for no-speech, just stop. 
          // Or set a transient warning. For now, let's just stop cleanly 
          // so the user can click 'Start' again easily.
          return
        }

        if (event.error !== "aborted") {
          setError(errorMap[event.error] || `Error: ${event.error}`)
          setIsRecording(false)
        }
      }

      recognitionRef.current.onend = () => {
        // Only verify state here, don't force false if we intend to be continuous
        // But for this UI, we treat 'onend' as stopped
        if (isRecording) {
          // Unexpected stop (e.g. silence timeout), try to restart if supposed to be recording?
          // For now, let's just sync state to stop
          setIsRecording(false)
        }
      }
    } catch (e) {
      console.error("Speech Recognition initialization failed", e)
      setIsSupported(false)
      setMode("text")
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) { }
      }
    }
  }, []) // Empty dependency array to init once

  const startRecording = useCallback(() => {
    setError(null)
    if (!recognitionRef.current) return

    try {
      recognitionRef.current.start()
      setIsRecording(true)
    } catch (e) {
      console.error("Failed to start recording:", e)
      // Sometimes it throws if already started
      setIsRecording(true)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current) return

    try {
      recognitionRef.current.stop()
    } catch (e) { }

    setIsRecording(false)
  }, [])

  const handleSend = () => {
    const textToSend = (transcript + " " + interimTranscript).trim()
    if (textToSend) {
      onTranscript(textToSend)
      setTranscript("")
      setInterimTranscript("")
      // Ensure recording is stopped after send
      if (isRecording) {
        stopRecording()
      }
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (transcript.trim()) {
      onTranscript(transcript.trim())
      setTranscript("")
    }
  }

  // Update parent state or local state handling
  const toggleRecording = () => {
    if (isRecording) {
      // User manually stopping
      stopRecording()
      // Note: We don't auto-send here to give user a chance to review, 
      // UNLESS the UX requirement is "Stop & Send". 
      // Let's implement Stop & Send behavior for smoother flow, or Stop -> Review -> Send.
      // Based on previous code: it sent immediately. Let's keep that flow but make it robust.
      // Actually, let's do Stop -> Send to be safe, but maybe add a check.
      // To match typical voice assistants: Silence or Stop triggers processing.

      // Let's execute send immediately after a short delay to allow final results to process
      setTimeout(() => {
        const fullText = (transcript + " " + interimTranscript).trim()
        if (fullText) {
          onTranscript(fullText)
          setTranscript("")
          setInterimTranscript("")
        }
      }, 200)

    } else {
      startRecording()
    }
  }

  return (
    <div className="space-y-4">
      {/* Dynamic Transcript Area */}
      <AnimatePresence mode="wait">
        {(transcript || interimTranscript || mode === "text") && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-4 bg-black/20 border-white/5 backdrop-blur-md relative group">
              {mode === "text" ? (
                <form onSubmit={handleManualSubmit} className="flex gap-2">
                  <Textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Type your answer here..."
                    className="min-h-[80px] bg-transparent border-none resize-none focus-visible:ring-0 p-0 text-lg"
                    autoFocus
                    disabled={disabled}
                  />
                  <Button type="submit" size="icon" className="self-end rounded-full h-10 w-10 shrink-0" disabled={!transcript.trim() || disabled}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <div className="min-h-[60px]">
                  <p className="text-lg font-medium text-foreground/90 leading-relaxed">
                    {transcript} <span className="text-muted-foreground animate-pulse">{interimTranscript}</span>
                  </p>
                  {/* Actions for voice mode review */}
                  {!isRecording && transcript && (
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTranscript("")}
                        className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          onTranscript(transcript)
                          setTranscript("")
                        }}
                        className="h-8 px-3 rounded-full text-xs font-bold gap-2"
                      >
                        Send <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bar */}
      <div className="flex flex-col items-center gap-4">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-destructive text-sm font-medium flex items-center gap-2 bg-destructive/10 px-4 py-2 rounded-full"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        {isSupported ? (
          <div className="flex items-center gap-4 w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode(mode === "voice" ? "text" : "voice")}
              className="shrink-0 rounded-full text-muted-foreground hover:text-primary transition-colors"
              title="Toggle Keyboard Input"
            >
              <Keyboard className="w-5 h-5" />
            </Button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleRecording}
              disabled={disabled || !isListening || mode === "text"}
              className={`flex-1 relative h-16 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl overflow-hidden ${isRecording
                ? "bg-destructive text-destructive-foreground shadow-destructive/20"
                : "bg-gradient-to-r from-primary to-blue-600 text-white shadow-primary/25 hover:shadow-primary/40"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <AnimatePresence mode="wait">
                {isRecording ? (
                  <motion.div
                    key="stop"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-3 h-3 bg-white rounded-sm animate-pulse" />
                    Stop Recording
                  </motion.div>
                ) : (
                  <motion.div
                    key="start"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    {mode === "text" ? "Switch to Voice Mode" : "Start Speaking"}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recording Pulse Effect */}
              {isRecording && (
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          </div>
        ) : (
          <Card className="w-full p-4 bg-muted/50 border-muted text-center">
            <p className="text-muted-foreground text-sm mb-3">Voice input is not supported in this browser.</p>
            <Button onClick={() => setMode("text")} variant="outline" className="w-full">
              Use Text Input
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
