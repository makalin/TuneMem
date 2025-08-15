import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Music, 
  Brain, 
  Search, 
  BarChart3, 
  Share2, 
  Settings,
  Zap,
  Target,
  BookOpen,
  Smartphone
} from 'lucide-react'
import MusicVisualizer from '@/components/MusicVisualizer'
import AdvancedSearch from '@/components/AdvancedSearch'
import { AnimatePresence } from 'framer-motion'

interface Tool {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'music' | 'ai' | 'productivity' | 'social' | 'learning'
  status: 'available' | 'beta' | 'coming-soon'
  features: string[]
}

const Tools = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const tools: Tool[] = [
    {
      id: 'music-visualizer',
      name: 'Music Visualizer',
      description: 'Real-time audio visualization with waveform and spectrum analysis',
      icon: <Music className="w-6 h-6" />,
      category: 'music',
      status: 'available',
      features: [
        'Real-time frequency analysis',
        'Waveform visualization',
        'Volume controls',
        'Playback controls',
        'Dark theme support'
      ]
    },
    {
      id: 'advanced-search',
      name: 'Advanced Search & Filters',
      description: 'Powerful search with multiple criteria and real-time filtering',
      icon: <Search className="w-6 h-6" />,
      category: 'productivity',
      status: 'available',
      features: [
        'Text search across titles and content',
        'Style and difficulty filters',
        'Tag-based filtering',
        'Practice count ranges',
        'Date range filtering',
        'Multiple sorting options'
      ]
    },
    {
      id: 'ai-recommendations',
      name: 'AI Study Recommendations',
      description: 'Personalized learning suggestions powered by AI analysis',
      icon: <Brain className="w-6 h-6" />,
      category: 'ai',
      status: 'available',
      features: [
        'Spaced repetition suggestions',
        'Difficulty progression planning',
        'Style variety recommendations',
        'Time optimization analysis',
        'Personalized study sessions',
        'AI reasoning explanations'
      ]
    },
    {
      id: 'analytics-dashboard',
      name: 'Advanced Analytics',
      description: 'Comprehensive learning analytics and progress tracking',
      icon: <BarChart3 className="w-6 h-6" />,
      category: 'productivity',
      status: 'available',
      features: [
        'Performance metrics',
        'Learning trends',
        'Style distribution analysis',
        'Difficulty progression tracking',
        'Top performing tunes',
        'Customizable time periods'
      ]
    },
    {
      id: 'social-sharing',
      name: 'Social Sharing & Collaboration',
      description: 'Share tunes and collaborate with other learners',
      icon: <Share2 className="w-6 h-6" />,
      category: 'social',
      status: 'beta',
      features: [
        'Multi-platform sharing',
        'Collaboration invites',
        'Social statistics',
        'QR code generation',
        'Social media previews',
        'Comment system'
      ]
    },
    {
      id: 'learning-platforms',
      name: 'Learning Platform Integration',
      description: 'Connect with external LMS and educational platforms',
      icon: <BookOpen className="w-6 h-6" />,
      category: 'learning',
      status: 'beta',
      features: [
        'Canvas integration',
        'Google Classroom support',
        'Moodle compatibility',
        'Data synchronization',
        'Course management',
        'Assignment tracking'
      ]
    },
    {
      id: 'offline-support',
      name: 'Offline Support',
      description: 'Learn anywhere with offline capabilities and sync',
      icon: <Smartphone className="w-6 h-6" />,
      category: 'productivity',
      status: 'beta',
      features: [
        'Offline tune caching',
        'Background synchronization',
        'Service worker support',
        'Data persistence',
        'Conflict resolution',
        'Progressive Web App'
      ]
    },
    {
      id: 'advanced-music',
      name: 'Advanced Music Algorithms',
      description: 'Sophisticated music generation and composition tools',
      icon: <Zap className="w-6 h-6" />,
      category: 'music',
      status: 'available',
      features: [
        'Multiple musical scales',
        'Chord progressions',
        'Complexity levels',
        'Emotional analysis',
        'Pattern-based generation',
        'Instrument effects'
      ]
    },
    {
      id: 'ai-melody',
      name: 'AI Melody Generation',
      description: 'AI-powered melody suggestions and pattern learning',
      icon: <Target className="w-6 h-6" />,
      category: 'ai',
      status: 'available',
      features: [
        'Machine learning patterns',
        'Text sentiment analysis',
        'Optimal pattern selection',
        'User feedback learning',
        'Pattern recommendations',
        'Continuous improvement'
      ]
    }
  ]

  const categories = [
    { id: 'all', name: 'All Tools', count: tools.length },
    { id: 'music', name: 'Music Tools', count: tools.filter(t => t.category === 'music').length },
    { id: 'ai', name: 'AI Features', count: tools.filter(t => t.category === 'ai').length },
    { id: 'productivity', name: 'Productivity', count: tools.filter(t => t.category === 'productivity').length },
    { id: 'social', name: 'Social & Sharing', count: tools.filter(t => t.category === 'social').length },
    { id: 'learning', name: 'Learning', count: tools.filter(t => t.category === 'learning').length }
  ]

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
      case 'beta': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20'
      case 'coming-soon': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'music': return 'text-blue-600 dark:text-blue-400'
      case 'ai': return 'text-purple-600 dark:text-purple-400'
      case 'productivity': return 'text-green-600 dark:text-green-400'
      case 'social': return 'text-pink-600 dark:text-pink-400'
      case 'learning': return 'text-orange-600 dark:text-orange-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const renderToolDemo = (toolId: string) => {
    switch (toolId) {
      case 'music-visualizer':
        return (
          <MusicVisualizer
            isPlaying={false}
            onPlayPause={() => {}}
            onVolumeChange={() => {}}
            currentTime={0}
            duration={120}
          />
        )
      case 'advanced-search':
        return (
          <AdvancedSearch
            onResultsChange={() => {}}
          />
        )
      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Demo Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Interactive demo for this tool will be available soon
            </p>
          </div>
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Advanced Tools & Features
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore powerful tools to enhance your learning experience
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tools and features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            whileHover={{ y: -2 }}
            onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
          >
            {/* Tool Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${getCategoryColor(tool.category)} bg-opacity-10`}>
                  {tool.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tool.description}
                  </p>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tool.status)}`}>
                {tool.status}
              </span>
            </div>

            {/* Features */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Features:
              </p>
              <div className="flex flex-wrap gap-2">
                {tool.features.slice(0, 3).map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                  >
                    {feature}
                  </span>
                ))}
                {tool.features.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                    +{tool.features.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Expandable Demo */}
            <AnimatePresence>
              {selectedTool === tool.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-gray-200 dark:border-gray-700 pt-4"
                >
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Interactive Demo:
                    </p>
                  </div>
                  {renderToolDemo(tool.id)}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Button */}
            <div className="flex justify-between items-center mt-4">
              <span className={`text-sm font-medium ${getCategoryColor(tool.category)}`}>
                {categories.find(c => c.id === tool.category)?.name}
              </span>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle tool activation
                }}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg transition-colors"
              >
                {tool.status === 'available' ? 'Use Tool' : 
                 tool.status === 'beta' ? 'Try Beta' : 'Coming Soon'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredTools.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No tools found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or category filters
          </p>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          🚀 Tools Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {tools.filter(t => t.status === 'available').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {tools.filter(t => t.status === 'beta').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Beta</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {tools.filter(t => t.status === 'coming-soon').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Coming Soon</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {categories.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Tools
