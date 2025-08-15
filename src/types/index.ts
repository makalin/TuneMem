export interface Tune {
  id: string
  title: string
  content: string
  melody: MelodyData
  style: MusicStyle
  createdAt: Date
  lastPracticed?: Date
  practiceCount: number
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

export interface MelodyData {
  notes: string[]
  rhythm: number[]
  tempo: number
  key: string
  scale: string
}

export type MusicStyle = 'pop' | 'classical' | 'jazz' | 'folk' | 'electronic' | 'custom'

export interface PracticeSession {
  id: string
  tuneId: string
  score: number
  timeSpent: number
  completedAt: Date
  mistakes: string[]
}

export interface UserProgress {
  totalTunes: number
  totalPracticeTime: number
  averageScore: number
  streakDays: number
  lastPracticeDate?: Date
  favoriteStyles: MusicStyle[]
}

export interface QuizQuestion {
  id: string
  tuneId: string
  question: string
  correctAnswer: string
  options: string[]
  type: 'multiple-choice' | 'fill-blank' | 'melody-recognition'
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  soundEnabled: boolean
  notificationsEnabled: boolean
  autoSave: boolean
  language: string
}
