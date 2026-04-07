"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, AlertCircle, Send, Keyboard, RotateCcw } from "lucide-react"
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

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      setMode("text")
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {}
      }
    }

  }, [])

  const startRecording = useCallback(async () => {

    if (isRecording) return

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    setError(null)
    setInterimTranscript("")

    try {

      await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true
        }
      })

      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onresult = (event: any) => {

        let final = ""
        let interim = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {

          const result = event.results[i]

          if (result.isFinal) {
            final += result[0].transcript
          } else {
            interim += result[0].transcript
          }

        }

        if (final) {
          setTranscript(prev => (prev + " " + final).trim())
        }

        setInterimTranscript(interim)

      }

      recognition.onerror = (event: any) => {

        if (event.error === "not-allowed") {
          setError("Microphone access denied.")
        } else if (event.error === "network") {
          setError("Network issue detected.")
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

      console.error(e)
      setError("Microphone failed to start.")
      setIsRecording(false)

    }

  }, [isRecording])

  const stopRecording = useCallback(() => {

    if (!recognitionRef.current) return

    try {
      recognitionRef.current.stop()
    } catch {}

    setTranscript(prev => `${prev} ${interimTranscript}`.trim())
    setInterimTranscript("")
    setIsRecording(false)

  }, [interimTranscript])

  const toggleRecording = () => {

    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }

  }

  const handleSend = () => {

    const finalContent = `${transcript} ${interimTranscript}`.trim()

    if (!finalContent) return

    onTranscript(finalContent)

    setTranscript("")
    setInterimTranscript("")

  }

  const handleClear = () => {

    setTranscript("")
    setInterimTranscript("")

    if (isRecording) stopRecording()

  }

  const canSubmit =
    (transcript.trim() || interimTranscript.trim()) &&
    !isRecording

  return (

    <div className="space-y-6">

      <AnimatePresence>

        {(transcript || interimTranscript || mode === "text") && (

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <Card className="p-6">

              {mode === "text" ? (

                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Type your answer..."
                />

              ) : (

                <p className="text-lg">

                  {transcript}

                  <span className="text-primary/50">
                    {interimTranscript}
                  </span>

                  {!transcript && !interimTranscript && (
                    <span className="text-muted-foreground/30 italic">
                      {isRecording
                        ? "Listening..."
                        : "Click Start Speaking"}
                    </span>
                  )}

                </p>

              )}

              {!isRecording && (transcript || interimTranscript) && (

                <div className="flex justify-between pt-6">

                  <Button
                    variant="ghost"
                    onClick={handleClear}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>

                  <Button
                    onClick={handleSend}
                    disabled={!canSubmit}
                  >
                    Submit Answer
                    <Send className="w-4 h-4 ml-2" />
                  </Button>

                </div>

              )}

            </Card>

          </motion.div>

        )}

      </AnimatePresence>

      <div className="flex gap-4">

        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setMode(mode === "voice" ? "text" : "voice")
            stopRecording()
          }}
        >
          <Keyboard className="w-5 h-5" />
        </Button>

        <Button
          onClick={toggleRecording}
          disabled={disabled || !isListening || mode === "text"}
          className="flex-1"
        >
          {isRecording ? "Stop Capturing" : "Push to Speak"}
          <Mic className="w-4 h-4 ml-2" />
        </Button>

      </div>

      {error && (
        <div className="text-destructive text-sm flex gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

    </div>

  )
}