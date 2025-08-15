import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Lightbulb, 
  Clock, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Music,
  Star,
  Zap
} from 'lucide-react'
import { useTuneStore } from '@/stores/tuneStore'
import { Tune } from '@/types'

interface StudyRecommendation {
  id: string
  type: 'spaced-repetition' | 'difficulty-progression' | 'style-variety' | 'time-optimization'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  tunes: Tune[]
  estimatedTime: number
  expectedImprovement: number
  reasoning: string
}

interface StudySession {
  id: string
  tunes: Tune[]
  duration: number
  focus: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const AIStudyRecommendations = () => {
  const { tunes } = useTuneStore()
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([])
  const [suggestedSessions, setSuggestedSessions] = useState<StudySession[]>([])
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (tunes.length > 0) {
      generateRecommendations()
    }
  }, [tunes])

  const generateRecommendations = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis time
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newRecommendations: StudyRecommendation[] = []
    
    // 1. Spaced Repetition Recommendation
    const tunesNeedingReview = tunes.filter(tune => tune.practiceCount < 3)
    if (tunesNeedingReview.length > 0) {
      newRecommendations.push({
        id: 'spaced-repetition',
        type: 'spaced-repetition',
        title: 'Spaced Repetition Session',
        description: 'Review tunes that need reinforcement based on forgetting curve',
        priority: 'high',
        tunes: tunesNeedingReview.slice(0, 5),
        estimatedTime: tunesNeedingReview.length * 8,
        expectedImprovement: 25,
        reasoning: 'Tunes with low practice counts show signs of forgetting. Spaced repetition will strengthen memory retention.'
      })
    }

    // 2. Difficulty Progression
    const beginnerTunes = tunes.filter(tune => tune.difficulty === 'easy')
    const intermediateTunes = tunes.filter(tune => tune.difficulty === 'medium')
    
    if (beginnerTunes.length > 0 && intermediateTunes.length > 0) {
      newRecommendations.push({
        id: 'difficulty-progression',
        type: 'difficulty-progression',
        title: 'Progressive Difficulty Challenge',
        description: 'Build confidence with easier tunes before tackling harder ones',
        priority: 'medium',
        tunes: [...beginnerTunes.slice(0, 2), ...intermediateTunes.slice(0, 2)],
        estimatedTime: 45,
        expectedImprovement: 20,
        reasoning: 'Progressive difficulty builds confidence and prevents frustration while maintaining engagement.'
      })
    }

    // 3. Style Variety
    const styleGroups = tunes.reduce((acc, tune) => {
      acc[tune.style] = (acc[tune.style] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const dominantStyle = Object.entries(styleGroups).sort(([,a], [,b]) => b - a)[0]?.[0]
    const varietyTunes = tunes.filter(tune => tune.style !== dominantStyle).slice(0, 4)
    
    if (varietyTunes.length > 0) {
      newRecommendations.push({
        id: 'style-variety',
        type: 'style-variety',
        title: 'Musical Style Exploration',
        description: 'Explore different musical styles to broaden your musical vocabulary',
        priority: 'medium',
        tunes: varietyTunes,
        estimatedTime: 40,
        expectedImprovement: 15,
        reasoning: 'Exposure to different styles enhances musical understanding and prevents style fatigue.'
      })
    }

    // 4. Time Optimization
    const highValueTunes = tunes
      .filter(tune => tune.practiceCount > 5)
      .sort((a, b) => b.practiceCount - a.practiceCount)
      .slice(0, 3)
    
    if (highValueTunes.length > 0) {
      newRecommendations.push({
        id: 'time-optimization',
        type: 'time-optimization',
        title: 'High-Value Practice Session',
        description: 'Focus on tunes that provide maximum learning return on time investment',
        priority: 'high',
        tunes: highValueTunes,
        estimatedTime: 35,
        expectedImprovement: 30,
        reasoning: 'These tunes have proven learning value. Continued practice will yield significant improvements.'
      })
    }

    setRecommendations(newRecommendations)
    generateStudySessions(newRecommendations)
    setIsAnalyzing(false)
  }

  const generateStudySessions = (recs: StudyRecommendation[]) => {
    const sessions: StudySession[] = []
    
    // Morning session (easier, building confidence)
    const morningTunes = recs
      .flatMap(rec => rec.tunes)
      .filter(tune => tune.difficulty === 'easy')
      .slice(0, 3)
    
    if (morningTunes.length > 0) {
      sessions.push({
        id: 'morning-session',
        tunes: morningTunes,
        duration: 25,
        focus: 'Building confidence and warming up',
        difficulty: 'easy'
      })
    }

    // Afternoon session (mixed difficulty, focused learning)
    const afternoonTunes = recs
      .flatMap(rec => rec.tunes)
      .filter(tune => tune.difficulty === 'medium')
      .slice(0, 4)
    
    if (afternoonTunes.length > 0) {
      sessions.push({
        id: 'afternoon-session',
        tunes: afternoonTunes,
        duration: 40,
        focus: 'Deep learning and skill development',
        difficulty: 'medium'
      })
    }

    // Evening session (challenging, consolidation)
    const eveningTunes = recs
      .flatMap(rec => rec.tunes)
      .filter(tune => tune.difficulty === 'hard')
      .slice(0, 2)
    
    if (eveningTunes.length > 0) {
      sessions.push({
        id: 'evening-session',
        tunes: eveningTunes,
        duration: 30,
        focus: 'Challenging practice and skill consolidation',
        difficulty: 'hard'
      })
    }

    setSuggestedSessions(sessions)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'spaced-repetition': return <Clock className="w-5 h-5" />
      case 'difficulty-progression': return <TrendingUp className="w-5 h-5" />
      case 'style-variety': return <Music className="w-5 h-5" />
      case 'time-optimization': return <Target className="w-5 h-5" />
      default: return <Lightbulb className="w-5 h-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 dark:text-green-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'hard': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-primary-500" />
            AI Study Recommendations
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Personalized learning suggestions powered by AI analysis
          </p>
        </div>
        
        <button
          onClick={generateRecommendations}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Refresh Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((recommendation) => (
          <motion.div
            key={recommendation.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
            onClick={() => setSelectedRecommendation(
              selectedRecommendation === recommendation.id ? null : recommendation.id
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  {getTypeIcon(recommendation.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {recommendation.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {recommendation.description}
                  </p>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                {recommendation.priority}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {recommendation.estimatedTime}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">minutes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +{recommendation.expectedImprovement}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">improvement</p>
              </div>
            </div>

            {/* Tunes Preview */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recommended Tunes:
              </p>
              <div className="flex flex-wrap gap-2">
                {recommendation.tunes.slice(0, 3).map((tune, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                  >
                    {tune.title}
                  </span>
                ))}
                {recommendation.tunes.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                    +{recommendation.tunes.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Expandable Details */}
            <AnimatePresence>
              {selectedRecommendation === recommendation.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-gray-200 dark:border-gray-700 pt-4"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <strong>AI Reasoning:</strong> {recommendation.reasoning}
                  </p>
                  
                  <div className="space-y-2">
                    {recommendation.tunes.map((tune, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {tune.title}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(tune.difficulty)} bg-gray-100 dark:bg-gray-700`}>
                            {tune.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{tune.practiceCount} practices</span>
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Suggested Study Sessions */}
      {suggestedSessions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-secondary-500" />
            Suggested Study Sessions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedSessions.map((session) => (
              <motion.div
                key={session.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {session.id.replace('-', ' ')} Session
                  </h4>
                  <span className={`text-sm font-medium ${getDifficultyColor(session.difficulty)}`}>
                    {session.difficulty}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {session.focus}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {session.tunes.length} tunes
                  </span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    {session.duration} min
                  </span>
                </div>
                
                <button className="w-full mt-3 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg transition-colors">
                  Start Session
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No Recommendations State */}
      {recommendations.length === 0 && !isAnalyzing && (
        <div className="text-center py-12">
          <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No recommendations yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add some tunes and practice them to get personalized AI recommendations
          </p>
        </div>
      )}
    </div>
  )
}

export default AIStudyRecommendations
