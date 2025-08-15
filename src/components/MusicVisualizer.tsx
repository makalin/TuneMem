import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface MusicVisualizerProps {
  audioUrl?: string
  isPlaying: boolean
  onPlayPause: () => void
  onVolumeChange: (volume: number) => void
  currentTime: number
  duration: number
}

const MusicVisualizer = ({
  audioUrl,
  isPlaying,
  onPlayPause,
  onVolumeChange,
  currentTime,
  duration
}: MusicVisualizerProps) => {
  const { isDark } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)

  // Initialize audio context and analyzer
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Visualization loop
  const drawVisualization = () => {
    if (!canvasRef.current || !analyserRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const barWidth = (canvas.width / bufferLength) * 2.5
    let barHeight
    let x = 0

    // Draw frequency bars
    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255) * canvas.height

      // Create gradient
      const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height)
      gradient.addColorStop(0, isDark ? '#3b82f6' : '#1d4ed8')
      gradient.addColorStop(1, isDark ? '#8b5cf6' : '#7c3aed')

      ctx.fillStyle = gradient
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

      x += barWidth + 1
    }

    // Draw waveform
    if (isPlaying) {
      analyser.getByteTimeDomainData(dataArray)
      ctx.beginPath()
      ctx.strokeStyle = isDark ? '#10b981' : '#059669'
      ctx.lineWidth = 2

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const x = (i / bufferLength) * canvas.width
        const y = (v * canvas.height) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }

    animationFrameRef.current = requestAnimationFrame(drawVisualization)
  }

  // Start/stop visualization
  useEffect(() => {
    if (isPlaying) {
      drawVisualization()
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying])

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    onVolumeChange(newVolume)
    setIsMuted(false)
  }

  // Handle mute toggle
  const handleMuteToggle = () => {
    if (isMuted) {
      handleVolumeChange(volume)
    } else {
      onVolumeChange(0)
      setIsMuted(true)
    }
  }

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Music Visualizer
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={onPlayPause}
            className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Canvas for visualization */}
      <div className="relative mb-4">
        <canvas
          ref={canvasRef}
          className="w-full h-32 bg-gray-100 dark:bg-gray-900 rounded-lg"
        />
        
        {/* Progress overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
          <motion.div
            className="h-full bg-primary-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentTime / duration) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Time display */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Volume controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleMuteToggle}
          className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </span>
      </div>

      {/* Audio info */}
      {audioUrl && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Audio Source: {audioUrl}
          </p>
        </div>
      )}
    </div>
  )
}

export default MusicVisualizer
