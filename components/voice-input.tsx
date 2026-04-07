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
  language?: string
}

const LANGUAGE_CODES: Record<string, string> = {
  English: "en-US",
  Hindi: "hi-IN",
  Spanish: "es-ES",
  French: "fr-FR",
  German: "de-DE",
}

export function VoiceInput({ onTranscript, isListening = false, disabled = false, language = "English" }: VoiceInputProps) {
  const recognitionRef = useRef<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const [mode, setMode] = useState<"voice" | "text">("voice")
  const baseTranscriptRef = useRef("")

  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
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
  }, [])

  const startRecording = useCallback(() => {
    if (typeof window === "undefined") return
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    setError(null)
    baseTranscriptRef.current = transcript.trim()
    setInterimTranscript("")

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = LANGUAGE_CODES[language] || "en-US"

      recognition.onresult = (event: any) => {
        let final = ""
        let interim = ""

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            final += result[0].transcript + " "
          } else {
            interim += result[0].transcript
          }
        }

        if (final) {
          const freshBuffer = final.trim()
          setTranscript(baseTranscriptRef.current ? `${baseTranscriptRef.current} ${freshBuffer}` : freshBuffer)
        }
        setInterimTranscript(interim)
        setError(null)
      }

      recognition.onerror = (event: any) => {
        const errorMsg = event.error
        if (errorMsg === "no-speech") {
          setIsRecording(false)
          return
        }

        if (errorMsg === "not-allowed") {
          setError("Microphone access denied.")
        } else if (errorMsg === "network") {
          setError("Network connection issue detected.")
        } else if (errorMsg !== "aborted") {
          setError(`Recognition error: ${errorMsg}`)
        }
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
        recognitionRef.current = null
      }

      recognitionRef.current = recognition
      recognition.start()
      setIsRecording(true)
    } catch (e) {
      console.error("Failed to start speech engine:", e)
      setIsRecording(false)
      setError("Failed to start microphone interface.")
    }
  }, [transcript])

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } catch (e) { }
    setIsRecording(false)
  }, [])

  const handleSend = useCallback((text?: string) => {
    const finalContent = text || (transcript + " " + interimTranscript).trim()
    if (finalContent) {
      onTranscript(finalContent)
      setTranscript("")
      setInterimTranscript("")
    }
  }, [transcript, interimTranscript, onTranscript])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (transcript.trim()) {
      handleSend(transcript.trim())
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handleClear = () => {
    setTranscript("")
    setInterimTranscript("")
    if (isRecording) stopRecording()
  }

  const canSubmit = (transcript.trim() || interimTranscript.trim()) && !isRecording

  return (
    <div className="space-y-6">
      {/* Transcript / Text Input Area */}
      <AnimatePresence mode="wait">
        {(transcript || interimTranscript || mode === "text") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-xl rounded-3xl relative overflow-hidden group border-2 border-transparent focus-within:border-primary/20 transition-all shadow-2xl">
              <div className="absolute top-0 right-0 p-3 flex gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-destructive animate-pulse' : 'bg-emerald-500/30'}`} />
              </div>

              {mode === "text" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 opacity-50">
                    <Keyboard className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Manual Entry Mode</span>
                  </div>
                  <Textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Refine your thoughts and type your answer here..."
                    className="min-h-[180px] bg-transparent border-none resize-none focus-visible:ring-0 p-1 text-xl font-medium placeholder:italic placeholder:opacity-30 leading-relaxed no-scrollbar"
                    autoFocus
                    disabled={disabled}
                  />
                </div>
              ) : (
                <div className="min-h-[120px] space-y-4">
                  <div className="flex items-center gap-2 opacity-50">
                    <Mic className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Capture Buffer</span>
                  </div>
                  <p className="text-xl font-bold text-foreground/90 leading-relaxed italic selection:bg-primary/30">
                    {transcript || !interimTranscript ? transcript : ""}
                    <span className="text-primary/50 animate-pulse">{interimTranscript}</span>
                    {!transcript && !interimTranscript && isRecording && (
                      <span className="text-muted-foreground/30 italic font-medium">Listening to your response...</span>
                    )}
                    {!transcript && !interimTranscript && !isRecording && (
                      <span className="text-muted-foreground/30 italic font-medium">Click Start Speaking to begin your answer.</span>
                    )}
                  </p>
                </div>
              )}

              {/* Action Overlay for when not recording */}
              {!isRecording && (transcript.trim() || mode === "text") && (
                <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    disabled={disabled}
                    className="h-10 px-4 rounded-xl hover:bg-destructive/10 hover:text-destructive text-[10px] font-black uppercase tracking-widest gap-2 italic"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </Button>

                  <Button
                    onClick={() => handleSend()}
                    disabled={disabled || !transcript.trim()}
                    className="h-12 px-8 rounded-2xl bg-linear-to-r from-primary to-blue-600 text-white font-black uppercase tracking-widest text-[11px] gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all group italic"
                  >
                    Submit Answer
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bar */}
      <div className="flex flex-col items-center gap-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-destructive/10 px-6 py-2.5 rounded-full border border-destructive/20 italic"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.div>
        )}

        {isSupported ? (
          <div className="flex items-center gap-4 w-full px-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setMode(mode === "voice" ? "text" : "voice")
                stopRecording()
              }}
              className={`shrink-0 h-14 w-14 rounded-2xl border-white/10 ${mode === 'text' ? 'bg-primary/20 text-primary border-primary/20' : 'bg-white/5 text-muted-foreground'} transition-all hover:scale-105 active:scale-95`}
              title="Toggle Keyboard Input"
            >
              <Keyboard className="w-6 h-6" />
            </Button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={toggleRecording}
              disabled={disabled || !isListening || mode === "text"}
              className={`flex-1 relative h-16 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-2xl overflow-hidden italic ${isRecording
                ? "bg-destructive/10 border-2 border-destructive text-destructive"
                : "bg-white/5 border-2 border-white/5 text-foreground/80 hover:bg-white/10 hover:border-white/10"
                } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              <AnimatePresence mode="wait">
                {isRecording ? (
                  <motion.div
                    key="stop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [8, 16, 8] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1 bg-destructive rounded-full"
                        />
                      ))}
                    </div>
                    Stop Capturing
                  </motion.div>
                ) : (
                  <motion.div
                    key="start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <Mic className={`w-5 h-5 ${mode === 'voice' ? 'text-primary' : 'opacity-20'}`} />
                    {mode === "text" ? "Use Microphone" : "Push to Speak"}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Visual feedback for voice mode active */}
              {isRecording && (
                <motion.div
                  className="absolute inset-0 bg-destructive/5"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          </div>
        ) : (
          <Card className="w-full p-6 bg-white/5 border-white/10 border-dashed rounded-3xl text-center">
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-4 italic">Neural Voice Engine Unavailable</p>
            <Button onClick={() => setMode("text")} variant="outline" className="w-full rounded-2xl h-12 font-bold uppercase tracking-widest text-xs">
              Continue with Text
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
