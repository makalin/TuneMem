import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plus, Play, TrendingUp, Music, Clock, Star } from 'lucide-react'
import { useTuneStore } from '@/stores/tuneStore'
import TuneCard from '@/components/TuneCard'

const Home = () => {
  const navigate = useNavigate()
  const { tunes, getRecentTunes } = useTuneStore()
  const recentTunes = getRecentTunes(6)

  const stats = [
    {
      label: 'Total Tunes',
      value: tunes.length,
      icon: Music,
      color: 'bg-primary-500',
    },
    {
      label: 'Practice Sessions',
      value: tunes.reduce((acc, tune) => acc + tune.practiceCount, 0),
      icon: Play,
      color: 'bg-secondary-500',
    },
    {
      label: 'Learning Streak',
      value: '7 days',
      icon: TrendingUp,
      color: 'bg-accent-500',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-gradient">TuneMem</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform any information into catchy tunes and remember better with the power of music.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => navigate('/create')}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Tune</span>
          </button>
          <button
            onClick={() => navigate('/practice')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Start Practicing</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Tunes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Tunes</h2>
          <button
            onClick={() => navigate('/create')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All
          </button>
        </div>

        {recentTunes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTunes.map((tune, index) => (
              <motion.div
                key={tune.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <TuneCard tune={tune} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tunes yet</h3>
            <p className="text-gray-600 mb-4">Create your first tune to get started!</p>
            <button
              onClick={() => navigate('/create')}
              className="btn-primary"
            >
              Create Your First Tune
            </button>
          </div>
        )}
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
            <span>Practice for 15-20 minutes daily for best results</span>
          </div>
          <div className="flex items-start space-x-2">
            <Star className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" />
            <span>Mix different musical styles to keep learning fun</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home
