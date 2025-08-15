import { motion } from 'framer-motion'
import { Play, Music, Clock, Tag } from 'lucide-react'
import { Tune } from '@/types'
import { musicService } from '@/services/musicService'
import { useState } from 'react'

interface TuneCardProps {
  tune: Tune
}

const TuneCard = ({ tune }: TuneCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = async () => {
    if (isPlaying) {
      musicService.stopMelody()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      try {
        await musicService.playMelody(tune.melody)
        setIsPlaying(false)
      } catch (error) {
        console.error('Failed to play melody:', error)
        setIsPlaying(false)
      }
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  return (
    <motion.div
      className="card hover:shadow-md transition-all duration-200 cursor-pointer group"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {tune.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {tune.content}
          </p>
        </div>
        <button
          onClick={handlePlay}
          className={`ml-3 p-2 rounded-lg transition-colors ${
            isPlaying
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
          }`}
        >
          <Play className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-2">
          <Music className="w-3 h-3" />
          <span className="capitalize">{tune.style}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-3 h-3" />
          <span>{tune.melody.tempo} BPM</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {tune.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
          {tune.tags.length > 2 && (
            <span className="text-xs text-gray-500">
              +{tune.tags.length - 2} more
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(tune.createdAt)}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Practice Count</span>
          <span className="font-medium text-gray-700">{tune.practiceCount}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-gray-500">Difficulty</span>
          <span className={`font-medium px-2 py-1 rounded-full text-xs ${
            tune.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            tune.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {tune.difficulty}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default TuneCard
