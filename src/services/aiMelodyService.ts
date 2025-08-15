import { MelodyData, MusicStyle } from '@/types'

interface AIMelodyPattern {
  id: string
  name: string
  description: string
  complexity: number
  emotionalTone: 'happy' | 'sad' | 'energetic' | 'calm' | 'mysterious'
  genre: MusicStyle
  successRate: number
}

interface TextAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  complexity: 'simple' | 'medium' | 'complex'
  emotionalWords: string[]
  topic: string
  wordCount: number
}

class AIMelodyService {
  private melodyPatterns: AIMelodyPattern[] = [
    {
      id: 'pop_hook',
      name: 'Pop Hook Pattern',
      description: 'Catchy, memorable melody with strong hook',
      complexity: 0.3,
      emotionalTone: 'happy',
      genre: 'pop',
      successRate: 0.92
    },
    {
      id: 'classical_theme',
      name: 'Classical Theme Pattern',
      description: 'Elegant, flowing melody with emotional depth',
      complexity: 0.7,
      emotionalTone: 'calm',
      genre: 'classical',
      successRate: 0.88
    },
    {
      id: 'jazz_improvisation',
      name: 'Jazz Improvisation Pattern',
      description: 'Sophisticated melody with syncopation',
      complexity: 0.9,
      emotionalTone: 'mysterious',
      genre: 'jazz',
      successRate: 0.85
    },
    {
      id: 'electronic_beat',
      name: 'Electronic Beat Pattern',
      description: 'Rhythmic, repetitive melody with modern feel',
      complexity: 0.5,
      emotionalTone: 'energetic',
      genre: 'electronic',
      successRate: 0.89
    },
    {
      id: 'folk_story',
      name: 'Folk Story Pattern',
      description: 'Narrative melody with traditional structure',
      complexity: 0.4,
      emotionalTone: 'calm',
      genre: 'folk',
      successRate: 0.87
    }
  ]

  private emotionalKeywords = {
    positive: ['happy', 'joy', 'love', 'excited', 'wonderful', 'amazing', 'beautiful', 'great', 'fantastic'],
    negative: ['sad', 'angry', 'fear', 'hate', 'terrible', 'awful', 'horrible', 'bad', 'worried'],
    energetic: ['fast', 'quick', 'energetic', 'powerful', 'strong', 'dynamic', 'vibrant', 'lively'],
    calm: ['slow', 'gentle', 'peaceful', 'quiet', 'soft', 'smooth', 'tranquil', 'serene'],
    mysterious: ['mysterious', 'dark', 'deep', 'complex', 'intricate', 'sophisticated', 'enigmatic']
  }

  private topicKeywords = {
    science: ['atom', 'molecule', 'cell', 'organism', 'evolution', 'gravity', 'energy', 'force'],
    history: ['ancient', 'medieval', 'renaissance', 'revolution', 'war', 'peace', 'king', 'queen'],
    nature: ['tree', 'flower', 'mountain', 'ocean', 'river', 'forest', 'animal', 'bird'],
    technology: ['computer', 'software', 'algorithm', 'data', 'network', 'digital', 'virtual'],
    emotions: ['love', 'hate', 'fear', 'joy', 'sadness', 'anger', 'surprise', 'disgust']
  }

  generateAIMelody(text: string, style: MusicStyle, userPreferences?: any): MelodyData {
    const analysis = this.analyzeText(text)
    const optimalPattern = this.selectOptimalPattern(analysis, style, userPreferences)
    const melody = this.generateMelodyFromPattern(text, optimalPattern, analysis)
    
    return melody
  }

  private analyzeText(text: string): TextAnalysis {
    const words = text.toLowerCase().split(/\s+/)
    const wordCount = words.length
    
    // Sentiment analysis
    let positiveScore = 0
    let negativeScore = 0
    let energeticScore = 0
    let calmScore = 0
    let mysteriousScore = 0
    
    words.forEach(word => {
      if (this.emotionalKeywords.positive.includes(word)) positiveScore++
      if (this.emotionalKeywords.negative.includes(word)) negativeScore++
      if (this.emotionalKeywords.energetic.includes(word)) energeticScore++
      if (this.emotionalKeywords.calm.includes(word)) calmScore++
      if (this.emotionalKeywords.mysterious.includes(word)) mysteriousScore++
    })
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
    if (positiveScore > negativeScore) sentiment = 'positive'
    else if (negativeScore > positiveScore) sentiment = 'negative'
    
    // Complexity analysis
    let complexity: 'simple' | 'medium' | 'complex' = 'simple'
    if (wordCount > 15) complexity = 'complex'
    else if (wordCount > 8) complexity = 'medium'
    
    // Topic detection
    let topic = 'general'
    for (const [topicName, keywords] of Object.entries(this.topicKeywords)) {
      if (keywords.some(keyword => words.includes(keyword))) {
        topic = topicName
        break
      }
    }
    
    return {
      sentiment,
      complexity,
      emotionalWords: words.filter(word => 
        Object.values(this.emotionalKeywords).flat().includes(word)
      ),
      topic,
      wordCount
    }
  }

  private selectOptimalPattern(analysis: TextAnalysis, style: MusicStyle, userPreferences?: any): AIMelodyPattern {
    let bestPattern = this.melodyPatterns[0]
    let bestScore = 0
    
    this.melodyPatterns.forEach(pattern => {
      let score = 0
      
      // Style match
      if (pattern.genre === style) score += 0.4
      
      // Emotional tone match
      if (this.matchesEmotionalTone(pattern.emotionalTone, analysis.sentiment)) {
        score += 0.3
      }
      
      // Complexity match
      if (this.matchesComplexity(pattern.complexity, analysis.complexity)) {
        score += 0.2
      }
      
      // Success rate
      score += pattern.successRate * 0.1
      
      // User preferences (if available)
      if (userPreferences?.preferredPatterns?.includes(pattern.id)) {
        score += 0.2
      }
      
      if (score > bestScore) {
        bestScore = score
        bestPattern = pattern
      }
    })
    
    return bestPattern
  }

  private matchesEmotionalTone(patternTone: string, textSentiment: string): boolean {
    const toneMappings = {
      happy: ['positive'],
      sad: ['negative'],
      energetic: ['positive', 'energetic'],
      calm: ['neutral', 'calm'],
      mysterious: ['mysterious', 'complex']
    }
    
    return toneMappings[patternTone as keyof typeof toneMappings]?.includes(textSentiment) || false
  }

  private matchesComplexity(patternComplexity: number, textComplexity: string): boolean {
    const complexityMappings = {
      simple: [0, 0.3],
      medium: [0.3, 0.7],
      complex: [0.7, 1]
    }
    
    const [min, max] = complexityMappings[textComplexity as keyof typeof complexityMappings] || [0, 1]
    return patternComplexity >= min && patternComplexity <= max
  }

  private generateMelodyFromPattern(text: string, pattern: AIMelodyPattern, analysis: TextAnalysis): MelodyData {
    const words = text.split(/\s+/)
    const noteCount = Math.min(words.length, 32) // Increased for AI patterns
    
    // Generate notes based on pattern characteristics
    const notes = this.generatePatternNotes(noteCount, pattern, analysis)
    const rhythm = this.generatePatternRhythm(noteCount, pattern, analysis)
    const tempo = this.calculatePatternTempo(pattern, analysis)
    const key = this.selectPatternKey(pattern, analysis)
    const scale = this.selectPatternScale(pattern, analysis)
    
    return {
      notes,
      rhythm,
      tempo,
      key,
      scale
    }
  }

  private generatePatternNotes(count: number, pattern: AIMelodyPattern, _analysis: TextAnalysis): string[] {
    const notes: string[] = []
    const baseScale = this.getScaleForPattern(pattern)
    
    for (let i = 0; i < count; i++) {
      let note: string
      
      if (pattern.id === 'pop_hook') {
        // Pop hook: Strong, memorable notes with repetition
        if (i < 4) {
          // First 4 notes form the hook
          note = baseScale[i % baseScale.length]
        } else if (i % 4 === 0) {
          // Repeat hook every 4 notes
          note = baseScale[i % 4]
        } else {
          // Fill with complementary notes
          note = baseScale[Math.floor(Math.random() * baseScale.length)]
        }
      } else if (pattern.id === 'classical_theme') {
        // Classical: Flowing, stepwise motion
        if (i > 0) {
          const lastNote = notes[i - 1]
          const lastIndex = baseScale.indexOf(lastNote.charAt(0))
          const step = Math.random() < 0.8 ? 1 : 2
          const direction = Math.random() < 0.5 ? 1 : -1
          const newIndex = (lastIndex + step * direction + baseScale.length) % baseScale.length
          note = baseScale[newIndex]
        } else {
          note = baseScale[0] // Start with tonic
        }
      } else if (pattern.id === 'jazz_improvisation') {
        // Jazz: Chromatic approach and extended harmonies
        if (i > 0 && Math.random() < 0.4) {
          // Chromatic approach
          const lastNote = notes[i - 1]
          const lastIndex = baseScale.indexOf(lastNote.charAt(0))
          const chromaticStep = Math.random() < 0.5 ? 0.5 : -0.5
          const newIndex = Math.max(0, Math.min(baseScale.length - 1, lastIndex + chromaticStep))
          note = baseScale[Math.floor(newIndex)]
        } else {
          note = baseScale[Math.floor(Math.random() * baseScale.length)]
        }
      } else {
        // Default pattern
        note = baseScale[Math.floor(Math.random() * baseScale.length)]
      }
      
      const octave = this.selectOctaveForPattern(pattern, i)
      notes.push(`${note}${octave}`)
    }
    
    return notes
  }

  private generatePatternRhythm(count: number, pattern: AIMelodyPattern, _analysis: TextAnalysis): number[] {
    const rhythm: number[] = []
    
    if (pattern.id === 'pop_hook') {
      // Pop: Strong, consistent rhythm
      for (let i = 0; i < count; i++) {
        if (i < 4) {
          rhythm.push(0.5) // Hook rhythm
        } else if (i % 4 === 0) {
          rhythm.push(1) // Accent on hook repeat
        } else {
          rhythm.push(0.25) // Quick fills
        }
      }
    } else if (pattern.id === 'classical_theme') {
      // Classical: Varied, flowing rhythm
      for (let i = 0; i < count; i++) {
        if (i % 4 === 0) {
          rhythm.push(2) // Long notes on phrase starts
        } else {
          rhythm.push(Math.random() < 0.7 ? 0.5 : 1)
        }
      }
    } else if (pattern.id === 'jazz_improvisation') {
      // Jazz: Syncopated, complex rhythm
      for (let i = 0; i < count; i++) {
        if (i % 2 === 0) {
          rhythm.push(0.5)
        } else {
          rhythm.push(Math.random() < 0.6 ? 0.25 : 0.75)
        }
      }
    } else {
      // Default: Balanced rhythm
      for (let i = 0; i < count; i++) {
        rhythm.push(Math.random() < 0.7 ? 0.5 : 1)
      }
    }
    
    return rhythm
  }

  private calculatePatternTempo(pattern: AIMelodyPattern, analysis: TextAnalysis): number {
    let baseTempo = 120
    
    // Adjust based on pattern
    switch (pattern.id) {
      case 'pop_hook':
        baseTempo = 128
        break
      case 'classical_theme':
        baseTempo = 80
        break
      case 'jazz_improvisation':
        baseTempo = 100
        break
      case 'electronic_beat':
        baseTempo = 130
        break
      case 'folk_story':
        baseTempo = 90
        break
    }
    
    // Adjust based on text analysis
    if (analysis.sentiment === 'positive') baseTempo += 10
    if (analysis.sentiment === 'negative') baseTempo -= 15
    if (analysis.complexity === 'complex') baseTempo -= 20
    if (analysis.complexity === 'simple') baseTempo += 15
    
    return Math.max(60, Math.min(180, baseTempo))
  }

  private selectPatternKey(pattern: AIMelodyPattern, analysis: TextAnalysis): string {
    const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab']
    
    // Select key based on pattern and analysis
    if (pattern.id === 'jazz_improvisation') return 'Bb'
    if (pattern.id === 'classical_theme') return 'C'
    if (pattern.id === 'electronic_beat') return 'A'
    if (analysis.sentiment === 'negative') return 'A'
    if (analysis.sentiment === 'positive') return 'C'
    
    return keys[Math.floor(Math.random() * keys.length)]
  }

  private selectPatternScale(pattern: AIMelodyPattern, analysis: TextAnalysis): string {
    if (pattern.id === 'jazz_improvisation') return 'mixolydian'
    if (pattern.id === 'electronic_beat') return 'minor'
    if (analysis.sentiment === 'negative') return 'minor'
    if (pattern.id === 'classical_theme' && analysis.complexity === 'complex') return 'dorian'
    
    return 'major'
  }

  private getScaleForPattern(pattern: AIMelodyPattern): string[] {
    const scaleMappings = {
      'pop_hook': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      'classical_theme': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      'jazz_improvisation': ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'],
      'electronic_beat': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      'folk_story': ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    }
    
    return scaleMappings[pattern.id as keyof typeof scaleMappings] || ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  }

  private selectOctaveForPattern(pattern: AIMelodyPattern, _noteIndex: number): number {
    if (pattern.id === 'pop_hook') {
      // Pop: Higher octaves for catchiness
      return Math.floor(Math.random() * 2) + 5 // Octaves 5-6
    } else if (pattern.id === 'classical_theme') {
      // Classical: Middle octaves for warmth
      return Math.floor(Math.random() * 2) + 4 // Octaves 4-5
    } else if (pattern.id === 'jazz_improvisation') {
      // Jazz: Varied octaves for interest
      return Math.floor(Math.random() * 3) + 4 // Octaves 4-6
    }
    
    return Math.floor(Math.random() * 2) + 4 // Default: Octaves 4-5
  }

  // Machine learning-inspired pattern learning
  learnFromUserFeedback(patternId: string, success: boolean, userRating: number) {
    const pattern = this.melodyPatterns.find(p => p.id === patternId)
    if (pattern) {
      // Update success rate based on user feedback
      const newSuccessRate = (pattern.successRate + (success ? 0.1 : -0.05)) / 2
      pattern.successRate = Math.max(0.1, Math.min(1.0, newSuccessRate))
      
      // Store user preferences for future use
      this.storeUserPreference(patternId, success, userRating)
    }
  }

  private storeUserPreference(patternId: string, success: boolean, rating: number) {
    // This would typically store to a database or local storage
    const preferences = JSON.parse(localStorage.getItem('tunemem_user_preferences') || '{}')
    if (!preferences.patterns) preferences.patterns = {}
    
    if (!preferences.patterns[patternId]) {
      preferences.patterns[patternId] = { uses: 0, successes: 0, totalRating: 0 }
    }
    
    preferences.patterns[patternId].uses++
    if (success) preferences.patterns[patternId].successes++
    preferences.patterns[patternId].totalRating += rating
    
    localStorage.setItem('tunemem_user_preferences', JSON.stringify(preferences))
  }

  getRecommendedPatterns(userId?: string): AIMelodyPattern[] {
    // Return patterns sorted by success rate and user preference
    return [...this.melodyPatterns].sort((a, b) => {
      const aScore = a.successRate
      const bScore = b.successRate
      
      // Consider user preferences if available
      if (userId) {
        const preferences = JSON.parse(localStorage.getItem('tunemem_user_preferences') || '{}')
        const aPref = preferences.patterns?.[a.id]?.successes / preferences.patterns?.[a.id]?.uses || 0
        const bPref = preferences.patterns?.[b.id]?.successes / preferences.patterns?.[b.id]?.uses || 0
        
        return (bScore + bPref) - (aScore + aPref)
      }
      
      return bScore - aScore
    })
  }
}

export const aiMelodyService = new AIMelodyService()
export default aiMelodyService
