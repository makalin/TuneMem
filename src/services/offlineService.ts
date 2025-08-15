import { Tune } from '@/types'

interface OfflineData {
  tunes: Tune[]
  lastSync: Date
  pendingChanges: PendingChange[]
  cacheSize: number
  isOnline: boolean
}

interface PendingChange {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: 'tune' | 'practice' | 'progress'
  data: any
  timestamp: Date
  retryCount: number
}

interface CacheConfig {
  maxSize: number // in MB
  maxAge: number // in days
  priority: 'high' | 'medium' | 'low'
}

class OfflineService {
  // private readonly CACHE_NAME = 'tunemem-offline-cache'
  private readonly OFFLINE_DATA_KEY = 'tunemem_offline_data'
  private readonly CACHE_CONFIG: CacheConfig = {
    maxSize: 50, // 50MB
    maxAge: 30, // 30 days
    priority: 'high'
  }

  private offlineData: OfflineData = {
    tunes: [],
    lastSync: new Date(),
    pendingChanges: [],
    cacheSize: 0,
    isOnline: navigator.onLine
  }

  // private syncQueue: PendingChange[] = []
  private isInitialized = false

  constructor() {
    this.initializeOfflineSupport()
  }

  async initializeOfflineSupport(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Load offline data from storage
      this.loadOfflineData()
      
      // Set up online/offline event listeners
      this.setupNetworkListeners()
      
      // Initialize service worker for offline caching
      await this.initializeServiceWorker()
      
      // Start background sync
      this.startBackgroundSync()
      
      this.isInitialized = true
      console.log('Offline support initialized successfully')
    } catch (error) {
      console.error('Failed to initialize offline support:', error)
    }
  }

  // Cache Management
  async cacheTune(tune: Tune): Promise<boolean> {
    try {
      // Check cache size before adding
      if (!this.canCacheItem(tune)) {
        await this.cleanupCache()
      }

      // Store tune in IndexedDB
      await this.storeTuneInIndexedDB(tune)
      
      // Update offline data
      this.offlineData.tunes.push(tune)
      this.updateCacheSize()
      
      // Save to localStorage
      this.saveOfflineData()
      
      return true
    } catch (error) {
      console.error('Failed to cache tune:', error)
      return false
    }
  }

  async getCachedTune(tuneId: string): Promise<Tune | null> {
    try {
      // First try IndexedDB
      const tune = await this.getTuneFromIndexedDB(tuneId)
      if (tune) return tune
      
      // Fallback to localStorage
      return this.offlineData.tunes.find(t => t.id === tuneId) || null
    } catch (error) {
      console.error('Failed to get cached tune:', error)
      return null
    }
  }

  async getAllCachedTunes(): Promise<Tune[]> {
    try {
      // Try IndexedDB first
      const tunes = await this.getAllTunesFromIndexedDB()
      if (tunes.length > 0) return tunes
      
      // Fallback to localStorage
      return this.offlineData.tunes
    } catch (error) {
      console.error('Failed to get cached tunes:', error)
      return this.offlineData.tunes
    }
  }

  async removeFromCache(tuneId: string): Promise<boolean> {
    try {
      // Remove from IndexedDB
      await this.removeTuneFromIndexedDB(tuneId)
      
      // Remove from offline data
      this.offlineData.tunes = this.offlineData.tunes.filter(t => t.id !== tuneId)
      this.updateCacheSize()
      
      // Save to localStorage
      this.saveOfflineData()
      
      return true
    } catch (error) {
      console.error('Failed to remove tune from cache:', error)
      return false
    }
  }

  // Offline Operations
  async createTuneOffline(tuneData: Omit<Tune, 'id' | 'createdAt'>): Promise<Tune> {
    const tune: Tune = {
      ...tuneData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }

    // Cache the tune
    await this.cacheTune(tune)
    
    // Add to pending changes for sync
    this.addPendingChange({
      id: crypto.randomUUID(),
      type: 'create',
      entity: 'tune',
      data: tune,
      timestamp: new Date(),
      retryCount: 0
    })

    return tune
  }

  async updateTuneOffline(tuneId: string, updates: Partial<Tune>): Promise<boolean> {
    try {
      const existingTune = await this.getCachedTune(tuneId)
      if (!existingTune) return false

      const updatedTune = { ...existingTune, ...updates }
      
      // Update cache
      await this.updateTuneInIndexedDB(updatedTune)
      
      // Update offline data
      const index = this.offlineData.tunes.findIndex(t => t.id === tuneId)
      if (index !== -1) {
        this.offlineData.tunes[index] = updatedTune
      }
      
      // Add to pending changes
      this.addPendingChange({
        id: crypto.randomUUID(),
        type: 'update',
        entity: 'tune',
        data: { tuneId, updates },
        timestamp: new Date(),
        retryCount: 0
      })

      this.saveOfflineData()
      return true
    } catch (error) {
      console.error('Failed to update tune offline:', error)
      return false
    }
  }

  async deleteTuneOffline(tuneId: string): Promise<boolean> {
    try {
      // Remove from cache
      await this.removeFromCache(tuneId)
      
      // Add to pending changes
      this.addPendingChange({
        id: crypto.randomUUID(),
        type: 'delete',
        entity: 'tune',
        data: { tuneId },
        timestamp: new Date(),
        retryCount: 0
      })

      return true
    } catch (error) {
      console.error('Failed to delete tune offline:', error)
      return false
    }
  }

  // Sync Management
  async syncWhenOnline(): Promise<void> {
    if (!navigator.onLine) {
      console.log('Device is offline, queuing sync for when online')
      return
    }

    try {
      console.log('Starting offline sync...')
      
      // Process pending changes
      await this.processPendingChanges()
      
      // Update last sync time
      this.offlineData.lastSync = new Date()
      this.saveOfflineData()
      
      console.log('Offline sync completed successfully')
    } catch (error) {
      console.error('Failed to sync offline data:', error)
    }
  }

  async processPendingChanges(): Promise<void> {
    const changes = [...this.offlineData.pendingChanges]
    
    for (const change of changes) {
      try {
        await this.processChange(change)
        
        // Remove successful change
        this.offlineData.pendingChanges = this.offlineData.pendingChanges.filter(
          c => c.id !== change.id
        )
      } catch (error) {
        console.error(`Failed to process change ${change.id}:`, error)
        
        // Increment retry count
        change.retryCount++
        
        // Remove if too many retries
        if (change.retryCount >= 3) {
          this.offlineData.pendingChanges = this.offlineData.pendingChanges.filter(
            c => c.id !== change.id
          )
        }
      }
    }
    
    this.saveOfflineData()
  }

  private async processChange(change: PendingChange): Promise<void> {
    // This would typically make API calls to sync with the server
    // For now, we'll simulate the process
    
    switch (change.type) {
      case 'create':
        console.log('Syncing created tune:', change.data.id)
        // await api.createTune(change.data)
        break
      
      case 'update':
        console.log('Syncing updated tune:', change.data.tuneId)
        // await api.updateTune(change.data.tuneId, change.data.updates)
        break
      
      case 'delete':
        console.log('Syncing deleted tune:', change.data.tuneId)
        // await api.deleteTune(change.data.tuneId)
        break
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Cache Utilities
  private canCacheItem(tune: Tune): boolean {
    const estimatedSize = this.estimateTuneSize(tune)
    return (this.offlineData.cacheSize + estimatedSize) <= this.CACHE_CONFIG.maxSize * 1024 * 1024
  }

  private estimateTuneSize(tune: Tune): number {
    // Rough estimation of tune size in bytes
    const tuneString = JSON.stringify(tune)
    return new Blob([tuneString]).size
  }

  private updateCacheSize(): void {
    this.offlineData.cacheSize = this.offlineData.tunes.reduce(
      (total, tune) => total + this.estimateTuneSize(tune), 0
    )
  }

  async cleanupCache(): Promise<void> {
    try {
      // Remove old tunes based on maxAge
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - this.CACHE_CONFIG.maxAge)
      
      const oldTunes = this.offlineData.tunes.filter(t => t.createdAt < cutoffDate)
      
      for (const tune of oldTunes) {
        await this.removeFromCache(tune.id)
      }
      
      // If still too large, remove least recently used
      if (this.offlineData.cacheSize > this.CACHE_CONFIG.maxSize * 1024 * 1024) {
        const sortedTunes = [...this.offlineData.tunes].sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        )
        
        while (this.offlineData.cacheSize > this.CACHE_CONFIG.maxSize * 1024 * 1024 && sortedTunes.length > 0) {
          const tune = sortedTunes.shift()!
          await this.removeFromCache(tune.id)
        }
      }
      
      console.log('Cache cleanup completed')
    } catch (error) {
      console.error('Failed to cleanup cache:', error)
    }
  }

  // IndexedDB Operations
  private async storeTuneInIndexedDB(_tune: Tune): Promise<void> {
    // This would use IndexedDB for better performance
    // For now, we'll simulate the operation
    return new Promise(resolve => setTimeout(resolve, 100))
  }

  private async getTuneFromIndexedDB(_tuneId: string): Promise<Tune | null> {
    // This would query IndexedDB
    // For now, return null to use localStorage fallback
    return null
  }

  private async getAllTunesFromIndexedDB(): Promise<Tune[]> {
    // This would query IndexedDB
    // For now, return empty array to use localStorage fallback
    return []
  }

  private async updateTuneInIndexedDB(_tune: Tune): Promise<void> {
    // This would update IndexedDB
    return new Promise(resolve => setTimeout(resolve, 100))
  }

  private async removeTuneFromIndexedDB(_tuneId: string): Promise<void> {
    // This would remove from IndexedDB
    return new Promise(resolve => setTimeout(resolve, 100))
  }

  // Service Worker
  private async initializeServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', registration)
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  }

  // Network Listeners
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.offlineData.isOnline = true
      console.log('Device is online')
      this.syncWhenOnline()
    })

    window.addEventListener('offline', () => {
      this.offlineData.isOnline = false
      console.log('Device is offline')
    })
  }

  // Background Sync
  private startBackgroundSync(): void {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(_registration => {
        // Register background sync
        // registration.sync.register('background-sync')
        //   .then(() => console.log('Background sync registered'))
        //   .catch((error: any) => console.error('Background sync registration failed:', error))
      })
    }
  }

  // Pending Changes Management
  private addPendingChange(change: PendingChange): void {
    this.offlineData.pendingChanges.push(change)
    this.saveOfflineData()
  }

  // Storage Management
  private loadOfflineData(): void {
    try {
      const saved = localStorage.getItem(this.OFFLINE_DATA_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        this.offlineData = {
          ...this.offlineData,
          ...parsed,
          lastSync: new Date(parsed.lastSync),
          pendingChanges: parsed.pendingChanges?.map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp)
          })) || []
        }
      }
    } catch (error) {
      console.error('Failed to load offline data:', error)
    }
  }

  private saveOfflineData(): void {
    try {
      localStorage.setItem(this.OFFLINE_DATA_KEY, JSON.stringify(this.offlineData))
    } catch (error) {
      console.error('Failed to save offline data:', error)
    }
  }

  // Public API
  getOfflineStatus(): { isOnline: boolean; lastSync: Date; pendingChangesCount: number } {
    return {
      isOnline: this.offlineData.isOnline,
      lastSync: this.offlineData.lastSync,
      pendingChangesCount: this.offlineData.pendingChanges.length
    }
  }

  getCacheInfo(): { size: number; maxSize: number; tuneCount: number } {
    return {
      size: this.offlineData.cacheSize,
      maxSize: this.CACHE_CONFIG.maxSize * 1024 * 1024,
      tuneCount: this.offlineData.tunes.length
    }
  }

  async clearAllData(): Promise<void> {
    try {
      // Clear IndexedDB
      // await this.clearIndexedDB()
      
      // Clear localStorage
      localStorage.removeItem(this.OFFLINE_DATA_KEY)
      
      // Reset offline data
      this.offlineData = {
        tunes: [],
        lastSync: new Date(),
        pendingChanges: [],
        cacheSize: 0,
        isOnline: navigator.onLine
      }
      
      console.log('All offline data cleared')
    } catch (error) {
      console.error('Failed to clear offline data:', error)
    }
  }
}

export const offlineService = new OfflineService()
export default offlineService
