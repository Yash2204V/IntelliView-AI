"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface WaveformVisualizerProps {
  isActive: boolean
}

export function WaveformVisualizer({ isActive }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isActive) return

    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioContextRef.current = audioContext

        const analyser = audioContext.createAnalyser()
        analyserRef.current = analyser
        analyser.fftSize = 256

        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)

        drawWaveform()
      } catch (error) {
        console.error("Failed to setup audio:", error)
      }
    }

    const drawWaveform = () => {
      const canvas = canvasRef.current
      if (!canvas || !analyserRef.current) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const draw = () => {
        animationRef.current = requestAnimationFrame(draw)

        analyserRef.current?.getByteFrequencyData(dataArray)

        ctx.fillStyle = "rgb(15, 23, 42)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const barWidth = (canvas.width / bufferLength) * 2.5
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height

          ctx.fillStyle = `hsl(120, 70%, ${50 + (dataArray[i] / 255) * 20}%)`
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

          x += barWidth + 1
        }
      }

      draw()
    }

    setupAudio()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isActive])

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={400}
        height={100}
        className="w-full bg-gradient-to-br from-primary/10 to-accent/10"
      />
    </motion.div>
  )
}
