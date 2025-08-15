import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Tune, MusicStyle } from '@/types'

interface TuneStore {
  tunes: Tune[]
  currentTune: Tune | null
  isLoading: boolean
  error: string | null
  
  // Actions
  addTune: (tune: Omit<Tune, 'id' | 'createdAt'>) => void
  updateTune: (id: string, updates: Partial<Tune>) => void
  deleteTune: (id: string) => void
  setCurrentTune: (tune: Tune | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed values
  getTunesByStyle: (style: MusicStyle) => Tune[]
  getTunesByTag: (tag: string) => Tune[]
  getRecentTunes: (limit?: number) => Tune[]
  getTuneById: (id: string) => Tune | undefined
}

export const useTuneStore = create<TuneStore>()(
  persist(
    (set, get) => ({
      tunes: [],
      currentTune: null,
      isLoading: false,
      error: null,
      
      addTune: (tuneData) => {
        const newTune: Tune = {
          ...tuneData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        }
        set((state) => ({
          tunes: [...state.tunes, newTune],
        }))
      },
      
      updateTune: (id, updates) => {
        set((state) => ({
          tunes: state.tunes.map((tune) =>
            tune.id === id ? { ...tune, ...updates } : tune
          ),
        }))
      },
      
      deleteTune: (id) => {
        set((state) => ({
          tunes: state.tunes.filter((tune) => tune.id !== id),
        }))
      },
      
      setCurrentTune: (tune) => {
        set({ currentTune: tune })
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
      
      setError: (error) => {
        set({ error })
      },
      
      getTunesByStyle: (style) => {
        return get().tunes.filter((tune) => tune.style === style)
      },
      
      getTunesByTag: (tag) => {
        return get().tunes.filter((tune) => tune.tags.includes(tag))
      },
      
      getRecentTunes: (limit = 5) => {
        return get().tunes
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, limit)
      },
      
      getTuneById: (id) => {
        return get().tunes.find((tune) => tune.id === id)
      },
    }),
    {
      name: 'tune-storage',
      partialize: (state) => ({ tunes: state.tunes }),
    }
  )
)
