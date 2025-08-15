import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  Target, 
  Award, 
  Music
} from 'lucide-react'
import { useTuneStore } from '@/stores/tuneStore'

interface AnalyticsData {
  totalTunes: number
  totalPracticeTime: number
  averageScore: number
  learningStreak: number
  tunesByStyle: Record<string, number>
  tunesByDifficulty: Record<string, number>
  practiceTrend: Array<{ date: string; minutes: number }>
  topTunes: Array<{ title: string; practiceCount: number; score: number }>
}

const AnalyticsDashboard = () => {
  const { tunes } = useTuneStore()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalTunes: 0,
    totalPracticeTime: 0,
    averageScore: 0,
    learningStreak: 0,
    tunesByStyle: {},
    tunesByDifficulty: {},
    practiceTrend: [],
    topTunes: []
  })
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    calculateAnalytics()
  }, [tunes, selectedPeriod])

  const calculateAnalytics = () => {
    if (!tunes.length) return

    // Calculate basic metrics
    const totalTunes = tunes.length
    const totalPracticeTime = tunes.reduce((sum, tune) => sum + (tune.practiceCount * 5), 0) // 5 min per practice
    const averageScore = tunes.reduce((sum, tune) => sum + (tune.practiceCount * 85), 0) / totalTunes // Mock scores

    // Group by style and difficulty
    const tunesByStyle = tunes.reduce((acc, tune) => {
      acc[tune.style] = (acc[tune.style] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const tunesByDifficulty = tunes.reduce((acc, tune) => {
      acc[tune.difficulty] = (acc[tune.difficulty] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Generate practice trend data
    const practiceTrend = generatePracticeTrend(selectedPeriod)

    // Get top performing tunes
    const topTunes = tunes
      .sort((a, b) => b.practiceCount - a.practiceCount)
      .slice(0, 5)
      .map(tune => ({
        title: tune.title,
        practiceCount: tune.practiceCount,
        score: 85 + Math.random() * 15 // Mock score
      }))

    setAnalyticsData({
      totalTunes,
      totalPracticeTime,
      averageScore: Math.round(averageScore),
      learningStreak: Math.floor(Math.random() * 30) + 1, // Mock streak
      tunesByStyle,
      tunesByDifficulty,
      practiceTrend,
      topTunes
    })
  }

  const generatePracticeTrend = (period: 'week' | 'month' | 'year') => {
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365
    const trend = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      trend.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        minutes: Math.floor(Math.random() * 60) + 10 // Mock practice time
      })
    }
    
    return trend
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400'
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning progress and performance
          </p>
        </div>
        
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tunes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.totalTunes}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Music className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Practice Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(analyticsData.totalPracticeTime / 60)}h
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.averageScore}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Learning Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.learningStreak} days
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Practice Trend Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Practice Trend
          </h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {analyticsData.practiceTrend.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-sm relative">
                  <motion.div
                    className="bg-primary-500 rounded-t-sm"
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.minutes / 60) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {day.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Charts */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Distribution
          </h3>
          
          {/* Style Distribution */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              By Music Style
            </h4>
            <div className="space-y-2">
              {Object.entries(analyticsData.tunesByStyle).map(([style, count]) => (
                <div key={style} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {style}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${(count / analyticsData.totalTunes) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              By Difficulty
            </h4>
            <div className="space-y-2">
              {Object.entries(analyticsData.tunesByDifficulty).map(([difficulty, count]) => (
                <div key={difficulty} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {difficulty}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-secondary-500 h-2 rounded-full"
                        style={{ width: `${(count / analyticsData.totalTunes) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Tunes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Top Performing Tunes
        </h3>
        <div className="space-y-3">
          {analyticsData.topTunes.map((tune, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {tune.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tune.practiceCount} practices
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${getProgressColor(tune.score)}`}>
                  {Math.round(tune.score)}%
                </p>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full ${getProgressBarColor(tune.score)}`}
                    style={{ width: `${tune.score}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
