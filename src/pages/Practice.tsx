import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, SkipForward, Check, X, RotateCcw, Music } from 'lucide-react'
import { useTuneStore } from '@/stores/tuneStore'
import { musicService } from '@/services/musicService'

const Practice = () => {
  const { tunes, updateTune } = useTuneStore()
  const [currentTuneIndex, setCurrentTuneIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [practiceMode, setPracticeMode] = useState<'melody' | 'content'>('melody')

  const currentTune = tunes[currentTuneIndex]

  useEffect(() => {
    if (tunes.length > 0) {
      setTotalQuestions(tunes.length)
    }
  }, [tunes])

  const playMelody = async () => {
    if (!currentTune) return

    if (isPlaying) {
      musicService.stopMelody()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      try {
        await musicService.playMelody(currentTune.melody)
        setIsPlaying(false)
      } catch (error) {
        console.error('Failed to play melody:', error)
        setIsPlaying(false)
      }
    }
  }

  const nextTune = () => {
    if (currentTuneIndex < tunes.length - 1) {
      setCurrentTuneIndex(currentTuneIndex + 1)
      setShowAnswer(false)
      setUserAnswer('')
    }
  }

  const previousTune = () => {
    if (currentTuneIndex > 0) {
      setCurrentTuneIndex(currentTuneIndex - 1)
      setShowAnswer(false)
      setUserAnswer('')
    }
  }

  const checkAnswer = () => {
    if (!currentTune) return

    const isCorrect = userAnswer.toLowerCase().trim() === currentTune.content.toLowerCase().trim()
    
    if (isCorrect) {
      setScore(score + 1)
      // Update practice count
      updateTune(currentTune.id, {
        practiceCount: currentTune.practiceCount + 1,
        lastPracticed: new Date(),
      })
    }

    setShowAnswer(true)
  }

  const resetPractice = () => {
    setCurrentTuneIndex(0)
    setScore(0)
    setShowAnswer(false)
    setUserAnswer('')
  }

  const getProgressPercentage = () => {
    return totalQuestions > 0 ? ((currentTuneIndex + 1) / totalQuestions) * 100 : 0
  }

  if (tunes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Tunes to Practice</h2>
        <p className="text-gray-600 mb-6">
          Create some tunes first to start practicing and improving your memory.
        </p>
        <button
          onClick={() => window.location.href = '/create'}
          className="btn-primary"
        >
          Create Your First Tune
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Mode</h1>
        <p className="text-gray-600">
          Test your memory by listening to melodies and recalling the associated information
        </p>
      </motion.div>

      {/* Practice Mode Selector */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex space-x-4">
          <button
            onClick={() => setPracticeMode('melody')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              practiceMode === 'melody'
                ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🎵 Melody Recognition
          </button>
          <button
            onClick={() => setPracticeMode('content')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              practiceMode === 'content'
                ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📝 Content Recall
          </button>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
            <p className="text-sm text-gray-600">
              Question {currentTuneIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">Score: {score}</p>
            <p className="text-sm text-gray-600">
              {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
            </p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </motion.div>

      {/* Current Tune */}
      {currentTune && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentTune.title}</h2>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span className="capitalize">{currentTune.style}</span>
              <span>•</span>
              <span>{currentTune.melody.tempo} BPM</span>
              <span>•</span>
              <span className="capitalize">{currentTune.difficulty}</span>
            </div>
          </div>

          {practiceMode === 'melody' ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Listen to the melody and identify the content:
                </h3>
                <p className="text-lg text-gray-700 mb-6 font-medium">
                  "{currentTune.content}"
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={playMelody}
                  disabled={isPlaying}
                  className={`btn-primary flex items-center space-x-2 ${
                    isPlaying ? 'opacity-75' : ''
                  }`}
                >
                  <Play className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                  <span>{isPlaying ? 'Playing...' : 'Play Melody'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Listen to the melody and recall the content:
                </h3>
              </div>

              <div className="flex justify-center mb-4">
                <button
                  onClick={playMelody}
                  disabled={isPlaying}
                  className={`btn-secondary flex items-center space-x-2 ${
                    isPlaying ? 'opacity-75' : ''
                  }`}
                >
                  <Play className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                  <span>{isPlaying ? 'Playing...' : 'Play Melody'}</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer:
                </label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Type what you remember from the melody..."
                  disabled={showAnswer}
                />
              </div>

              {!showAnswer && (
                <div className="flex justify-center">
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim()}
                    className="btn-primary"
                  >
                    Check Answer
                  </button>
                </div>
              )}

              {showAnswer && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    userAnswer.toLowerCase().trim() === currentTune.content.toLowerCase().trim()
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {userAnswer.toLowerCase().trim() === currentTune.content.toLowerCase().trim() ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        userAnswer.toLowerCase().trim() === currentTune.content.toLowerCase().trim()
                          ? 'text-green-800'
                          : 'text-red-800'
                      }`}>
                        {userAnswer.toLowerCase().trim() === currentTune.content.toLowerCase().trim()
                          ? 'Correct!'
                          : 'Incorrect'
                        }
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong>Correct answer:</strong> {currentTune.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Navigation Controls */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <button
          onClick={previousTune}
          disabled={currentTuneIndex === 0}
          className="btn-outline flex items-center space-x-2"
        >
          <SkipForward className="w-4 h-4 rotate-180" />
          <span>Previous</span>
        </button>

        <button
          onClick={resetPractice}
          className="btn-outline flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Practice</span>
        </button>

        <button
          onClick={nextTune}
          disabled={currentTuneIndex === tunes.length - 1}
          className="btn-primary flex items-center space-x-2"
        >
          <span>Next</span>
          <SkipForward className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Practice Tips */}
      <motion.div
        className="card bg-gradient-to-r from-accent-50 to-primary-50 border-accent-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Practice Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>• Listen to each melody multiple times before answering</div>
          <div>• Focus on the rhythm and pitch patterns</div>
          <div>• Associate musical elements with specific words</div>
          <div>• Practice regularly to improve your musical memory</div>
        </div>
      </motion.div>
    </div>
  )
}

export default Practice
