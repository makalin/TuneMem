import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Plus, Play, BarChart3, Music2, BookOpen, Settings } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Home', description: 'Dashboard' },
  { path: '/create', icon: Plus, label: 'Create', description: 'New Tune' },
  { path: '/practice', icon: Play, label: 'Practice', description: 'Learn & Test' },
  { path: '/progress', icon: BarChart3, label: 'Progress', description: 'Track Results' },
  { path: '/tools', icon: Settings, label: 'Tools', description: 'Advanced Features' },
]

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <nav className="p-4">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Navigation</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Choose your learning path</p>
        </div>

        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <motion.li
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-700">
                    {item.description}
                  </div>
                </div>
              </NavLink>
            </motion.li>
          ))}
        </ul>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-colors">
              <Music2 className="w-5 h-5" />
              <span className="text-sm">Import Tunes</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-colors">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">Tutorial</span>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
