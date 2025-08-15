import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Music, Tag, Clock, Star, TrendingUp } from 'lucide-react'
import { useTuneStore } from '@/stores/tuneStore'
import { Tune } from '@/types'

interface SearchFilters {
  query: string
  style: string[]
  difficulty: string[]
  tags: string[]
  minPracticeCount: number
  maxPracticeCount: number
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year'
  sortBy: 'title' | 'practiceCount' | 'createdAt' | 'difficulty'
  sortOrder: 'asc' | 'desc'
}

const AdvancedSearch = ({ onResultsChange }: { onResultsChange: (results: Tune[]) => void }) => {
  const { tunes } = useTuneStore()
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    style: [],
    difficulty: [],
    tags: [],
    minPracticeCount: 0,
    maxPracticeCount: 1000,
    dateRange: 'all',
    sortBy: 'title',
    sortOrder: 'asc'
  })
  const [isExpanded, setIsExpanded] = useState(false)
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // Extract available tags from tunes
  useEffect(() => {
    const tags = new Set<string>()
    tunes.forEach(tune => {
      tune.tags.forEach(tag => tags.add(tag))
    })
    setAvailableTags(Array.from(tags).sort())
  }, [tunes])

  // Filter and sort tunes based on current filters
  const filteredTunes = useMemo(() => {
    let results = [...tunes]

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase()
      results = results.filter(tune =>
        tune.title.toLowerCase().includes(query) ||
        tune.content.toLowerCase().includes(query) ||
        tune.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Style filter
    if (filters.style.length > 0) {
      results = results.filter(tune => filters.style.includes(tune.style))
    }

    // Difficulty filter
    if (filters.difficulty.length > 0) {
      results = results.filter(tune => filters.difficulty.includes(tune.difficulty))
    }

    // Tags filter
    if (filters.tags.length > 0) {
      results = results.filter(tune =>
        filters.tags.some(tag => tune.tags.includes(tag))
      )
    }

    // Practice count filter
    results = results.filter(tune =>
      tune.practiceCount >= filters.minPracticeCount &&
      tune.practiceCount <= filters.maxPracticeCount
    )

    // Date range filter
    if (filters.dateRange !== 'all') {
      const cutoff = new Date()
      
      switch (filters.dateRange) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoff.setDate(cutoff.getDate() - 7)
          break
        case 'month':
          cutoff.setMonth(cutoff.getMonth() - 1)
          break
        case 'year':
          cutoff.setFullYear(cutoff.getFullYear() - 1)
          break
      }
      
      results = results.filter(tune => new Date(tune.createdAt) >= cutoff)
    }

    // Sorting
    results.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'practiceCount':
          aValue = a.practiceCount
          bValue = b.practiceCount
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
          aValue = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0
          bValue = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0
          break
        default:
          return 0
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return results
  }, [tunes, filters])

  // Update results when filtered tunes change
  useEffect(() => {
    onResultsChange(filteredTunes)
  }, [filteredTunes, onResultsChange])

  // Handle filter changes
  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Toggle array filters
  const toggleArrayFilter = <K extends keyof SearchFilters>(
    key: K,
    value: string
  ) => {
    const currentValues = filters[key] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    updateFilter(key, newValues as SearchFilters[K])
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      query: '',
      style: [],
      difficulty: [],
      tags: [],
      minPracticeCount: 0,
      maxPracticeCount: 1000,
      dateRange: 'all',
      sortBy: 'title',
      sortOrder: 'asc'
    })
  }

  // Get unique styles and difficulties
  const uniqueStyles = [...new Set(tunes.map(tune => tune.style))]
  const uniqueDifficulties = [...new Set(tunes.map(tune => tune.difficulty))]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Search Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Advanced Search
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>{isExpanded ? 'Hide' : 'Show'} Filters</span>
          </button>
          
          {Object.values(filters).some(value => 
            Array.isArray(value) ? value.length > 0 : value !== '' && value !== 0 && value !== 1000
          ) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search tunes by title, content, or tags..."
          value={filters.query}
          onChange={(e) => updateFilter('query', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        {filters.query && (
          <button
            onClick={() => updateFilter('query', '')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Found {filteredTunes.length} tune{filteredTunes.length !== 1 ? 's' : ''}
        {filters.query && ` matching "${filters.query}"`}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              {/* Style Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Music className="w-4 h-4 mr-2" />
                  Music Style
                </h4>
                <div className="space-y-2">
                  {uniqueStyles.map(style => (
                    <label key={style} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.style.includes(style)}
                        onChange={() => toggleArrayFilter('style', style)}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {style}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Difficulty Level
                </h4>
                <div className="space-y-2">
                  {uniqueDifficulties.map(difficulty => (
                    <label key={difficulty} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.difficulty.includes(difficulty)}
                        onChange={() => toggleArrayFilter('difficulty', difficulty)}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {difficulty}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableTags.map(tag => (
                    <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.tags.includes(tag)}
                        onChange={() => toggleArrayFilter('tags', tag)}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tag}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Practice Count Range */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Practice Count
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Min: {filters.minPracticeCount}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.minPracticeCount}
                      onChange={(e) => updateFilter('minPracticeCount', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Max: {filters.maxPracticeCount}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.maxPracticeCount}
                      onChange={(e) => updateFilter('maxPracticeCount', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Date Range
                </h4>
                <select
                  value={filters.dateRange}
                  onChange={(e) => updateFilter('dateRange', e.target.value as SearchFilters['dateRange'])}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Sort By
                </h4>
                <div className="space-y-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter('sortBy', e.target.value as SearchFilters['sortBy'])}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="title">Title</option>
                    <option value="practiceCount">Practice Count</option>
                    <option value="createdAt">Date Created</option>
                    <option value="difficulty">Difficulty</option>
                  </select>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateFilter('sortOrder', 'asc')}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        filters.sortOrder === 'asc'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      A-Z
                    </button>
                    <button
                      onClick={() => updateFilter('sortOrder', 'desc')}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        filters.sortOrder === 'desc'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Z-A
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdvancedSearch
