import { motion } from 'framer-motion'
import { useTuneStore } from '@/stores/tuneStore'
import { TrendingUp, Target, Award, Music, Clock, Star } from 'lucide-react'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import AIStudyRecommendations from '@/components/AIStudyRecommendations'

const Progress = () => {
  const { tunes } = useTuneStore()

  const calculateStats = () => {
    const totalTunes = tunes.length
    const totalPracticeTime = tunes.reduce((acc, tune) => acc + tune.practiceCount * 5, 0) // 5 min per practice
    const averageScore = totalTunes > 0 ? tunes.reduce((acc, tune) => acc + tune.practiceCount, 0) / totalTunes : 0
    const streakDays = 7 // Mock data for now
    
    const styleCounts = tunes.reduce((acc, tune) => {
      acc[tune.style] = (acc[tune.style] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const favoriteStyle = Object.entries(styleCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
    
    const difficultyCounts = tunes.reduce((acc, tune) => {
      acc[tune.difficulty] = (acc[tune.difficulty] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const recentTunes = tunes
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
    
    return {
      totalTunes,
      totalPracticeTime,
      averageScore: Math.round(averageScore * 10) / 10,
      streakDays,
      favoriteStyle,
      styleCounts,
      difficultyCounts,
      recentTunes,
    }
  }

  const stats = calculateStats()



  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-gray-600">
          Track your learning journey and see how far you've come
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Music className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalTunes}</p>
          <p className="text-sm text-gray-600">Total Tunes</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-secondary-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalPracticeTime}</p>
          <p className="text-sm text-gray-600">Minutes Practiced</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-accent-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.averageScore}</p>
          <p className="text-sm text-gray-600">Avg. Practice Count</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.streakDays}</p>
          <p className="text-sm text-gray-600">Day Streak</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Learning Distribution */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Distribution</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Music Styles</span>
                <span className="text-sm text-gray-500">Total: {stats.totalTunes}</span>
              </div>
              <div className="space-y-2">
                {Object.entries(stats.styleCounts).map(([style, count]) => {
                  const percentage = (count / stats.totalTunes) * 100
                  return (
                    <div key={style} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize">{style}</span>
                        <span className="text-gray-600">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Difficulty Levels</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(stats.difficultyCounts).map(([difficulty, count]) => (
                  <div key={difficulty} className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                      {difficulty}
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          
          {stats.recentTunes.length > 0 ? (
            <div className="space-y-3">
              {stats.recentTunes.map((tune) => (
                <div key={tune.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{tune.title}</h4>
                    <p className="text-xs text-gray-600">
                      {new Date(tune.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tune.difficulty)}`}>
                      {tune.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">
                      {tune.practiceCount} practices
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Music className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No tunes created yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border-2 ${
            stats.totalTunes >= 5 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center space-x-3">
              <Award className={`w-6 h-6 ${
                stats.totalTunes >= 5 ? 'text-green-600' : 'text-gray-400'
              }`} />
              <div>
                <h4 className="font-medium text-gray-900">First Steps</h4>
                <p className="text-sm text-gray-600">Create 5 tunes</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stats.totalTunes >= 5 ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${Math.min((stats.totalTunes / 5) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalTunes}/5 completed
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            stats.totalPracticeTime >= 60 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center space-x-3">
              <Clock className={`w-6 h-6 ${
                stats.totalPracticeTime >= 60 ? 'text-green-600' : 'text-gray-400'
              }`} />
              <div>
                <h4 className="font-medium text-gray-900">Dedicated Learner</h4>
                <p className="text-sm text-gray-600">Practice for 1 hour</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stats.totalPracticeTime >= 60 ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${Math.min((stats.totalPracticeTime / 60) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalPracticeTime}/60 minutes
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            stats.streakDays >= 7 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center space-x-3">
              <Star className={`w-6 h-6 ${
                stats.streakDays >= 7 ? 'text-green-600' : 'text-gray-400'
              }`} />
              <div>
                <h4 className="font-medium text-gray-900">Consistent</h4>
                <p className="text-sm text-gray-600">7-day streak</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stats.streakDays >= 7 ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${Math.min((stats.streakDays / 7) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.streakDays}/7 days
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Insights */}
      <motion.div
        className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Progress Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>• Your favorite music style is <strong className="capitalize">{stats.favoriteStyle}</strong></div>
          <div>• You've practiced for <strong>{stats.totalPracticeTime}</strong> minutes total</div>
          <div>• Average practice count per tune: <strong>{stats.averageScore}</strong></div>
          <div>• Current learning streak: <strong>{stats.streakDays}</strong> days</div>
        </div>
      </motion.div>

      {/* Advanced Analytics Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <AnalyticsDashboard />
      </motion.div>

      {/* AI Study Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <AIStudyRecommendations />
      </motion.div>
    </div>
  )
}

export default Progress
