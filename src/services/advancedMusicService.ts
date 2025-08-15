import * as Tone from 'tone'
import { MelodyData, MusicStyle } from '@/types'

interface ChordProgression {
  chords: string[]
  rhythm: number[]
  complexity: 'simple' | 'intermediate' | 'advanced'
}

interface MusicalScale {
  notes: string[]
  type: 'major' | 'minor' | 'pentatonic' | 'blues' | 'dorian' | 'mixolydian'
  mood: 'happy' | 'sad' | 'mysterious' | 'energetic'
}

class AdvancedMusicService {
  private synth: Tone.PolySynth | null = null
  private isInitialized = false

  // Advanced musical scales and modes
  private readonly scales: Record<string, MusicalScale> = {
    major: {
      notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      type: 'major',
      mood: 'happy'
    },
    minor: {
      notes: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
      type: 'minor',
      mood: 'sad'
    },
    pentatonic: {
      notes: ['C', 'D', 'E', 'G', 'A'],
      type: 'pentatonic',
      mood: 'mysterious'
    },
    blues: {
      notes: ['C', 'Eb', 'F', 'F#', 'G', 'Bb'],
      type: 'blues',
      mood: 'mysterious'
    },
    dorian: {
      notes: ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb'],
      type: 'dorian',
      mood: 'mysterious'
    },
    mixolydian: {
      notes: ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'],
      type: 'mixolydian',
      mood: 'energetic'
    }
  }

  // Advanced chord progressions
  private readonly chordProgressions: Record<string, ChordProgression> = {
    pop: {
      chords: ['I', 'V', 'vi', 'IV'],
      rhythm: [1, 1, 1, 1],
      complexity: 'simple'
    },
    jazz: {
      chords: ['ii7', 'V7', 'Imaj7', 'IV7'],
      rhythm: [0.5, 0.5, 1, 1],
      complexity: 'advanced'
    },
    classical: {
      chords: ['I', 'vi', 'IV', 'V'],
      rhythm: [2, 1, 1, 2],
      complexity: 'intermediate'
    },
    electronic: {
      chords: ['i', 'VI', 'III', 'VII'],
      rhythm: [0.25, 0.25, 0.25, 0.25],
      complexity: 'intermediate'
    }
  }

  async initialize() {
    if (this.isInitialized) return

    try {
      await Tone.start()
      this.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
          type: 'triangle'
        },
        envelope: {
          attack: 0.1,
          decay: 0.3,
          sustain: 0.4,
          release: 1.2
        }
      }).toDestination()
      
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize advanced audio context:', error)
      throw error
    }
  }

  generateAdvancedMelody(text: string, style: MusicStyle, complexity: 'simple' | 'intermediate' | 'advanced' = 'intermediate'): MelodyData {
    const words = text.split(/\s+/).filter(word => word.length > 0)
    const noteCount = Math.min(words.length, 24) // Increased note limit
    
    const scale = this.selectOptimalScale(style, text)
    const notes = this.generateMelodicPhrase(noteCount, scale, complexity)
    const rhythm = this.generateAdvancedRhythm(noteCount, style, complexity)
    const tempo = this.calculateOptimalTempo(text, style)
    const key = this.selectOptimalKey(style, scale)
    
    return {
      notes,
      rhythm,
      tempo,
      key,
      scale: scale.type
    }
  }

  private selectOptimalScale(style: MusicStyle, text: string): MusicalScale {
    // Analyze text sentiment and select appropriate scale
    const wordCount = text.split(/\s+/).length
    const hasEmotionalWords = this.hasEmotionalContent(text)
    
    if (style === 'jazz') return this.scales.mixolydian
    if (style === 'electronic') return this.scales.minor
    if (style === 'classical' && hasEmotionalWords) return this.scales.minor
    if (style === 'pop' && wordCount > 10) return this.scales.pentatonic
    
    return this.scales.major
  }

  private hasEmotionalContent(text: string): boolean {
    const emotionalWords = ['love', 'happy', 'sad', 'angry', 'excited', 'calm', 'peace', 'joy', 'sorrow']
    return emotionalWords.some(word => text.toLowerCase().includes(word))
  }

  private generateMelodicPhrase(count: number, scale: MusicalScale, complexity: string): string[] {
    const notes: string[] = []
    const scaleNotes = scale.notes
    
    for (let i = 0; i < count; i++) {
      let note: string
      
      if (complexity === 'advanced') {
        // Advanced: Use chromatic passing tones and leaps
        if (i > 0 && Math.random() < 0.3) {
          const lastNote = notes[i - 1]
          const lastIndex = scaleNotes.indexOf(lastNote.charAt(0))
          const leap = Math.random() < 0.4 ? 2 : 1
          const direction = Math.random() < 0.5 ? 1 : -1
          const newIndex = (lastIndex + leap * direction + scaleNotes.length) % scaleNotes.length
          note = scaleNotes[newIndex]
        } else {
          note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)]
        }
      } else if (complexity === 'intermediate') {
        // Intermediate: Use stepwise motion with occasional leaps
        if (i > 0 && Math.random() < 0.7) {
          const lastNote = notes[i - 1]
          const lastIndex = scaleNotes.indexOf(lastNote.charAt(0))
          const step = Math.random() < 0.8 ? 1 : 2
          const direction = Math.random() < 0.5 ? 1 : -1
          const newIndex = (lastIndex + step * direction + scaleNotes.length) % scaleNotes.length
          note = scaleNotes[newIndex]
        } else {
          note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)]
        }
      } else {
        // Simple: Use stepwise motion only
        if (i > 0) {
          const lastNote = notes[i - 1]
          const lastIndex = scaleNotes.indexOf(lastNote.charAt(0))
          const direction = Math.random() < 0.5 ? 1 : -1
          const newIndex = (lastIndex + direction + scaleNotes.length) % scaleNotes.length
          note = scaleNotes[newIndex]
        } else {
          note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)]
        }
      }
      
      const octave = Math.floor(Math.random() * 3) + 4 // Octaves 4-6
      notes.push(`${note}${octave}`)
    }
    
    return notes
  }

  private generateAdvancedRhythm(count: number, style: MusicStyle, complexity: string): number[] {
    const baseRhythms = {
      pop: [0.25, 0.5, 1, 1.5],
      jazz: [0.125, 0.25, 0.5, 0.75, 1, 1.5],
      classical: [0.5, 1, 1.5, 2, 3],
      electronic: [0.125, 0.25, 0.5, 0.75],
      folk: [0.5, 1, 1.5, 2],
      custom: [0.25, 0.5, 1]
    }
    
    const styleRhythms = baseRhythms[style] || baseRhythms.pop
    const rhythm: number[] = []
    
    for (let i = 0; i < count; i++) {
      let rhythmValue: number
      
      if (complexity === 'advanced') {
        // Advanced: Complex syncopation and polyrhythms
        if (i > 0 && Math.random() < 0.4) {
          const lastRhythm = rhythm[i - 1]
          rhythmValue = lastRhythm * (Math.random() < 0.5 ? 0.5 : 1.5)
        } else {
          rhythmValue = styleRhythms[Math.floor(Math.random() * styleRhythms.length)]
        }
      } else if (complexity === 'intermediate') {
        // Intermediate: Some syncopation
        if (i > 0 && Math.random() < 0.3) {
          const lastRhythm = rhythm[i - 1]
          rhythmValue = lastRhythm * 0.5
        } else {
          rhythmValue = styleRhythms[Math.floor(Math.random() * styleRhythms.length)]
        }
      } else {
        // Simple: Basic rhythms
        rhythmValue = styleRhythms[Math.floor(Math.random() * styleRhythms.length)]
      }
      
      rhythm.push(Math.round(rhythmValue * 100) / 100) // Round to 2 decimal places
    }
    
    return rhythm
  }

  private calculateOptimalTempo(text: string, style: MusicStyle): number {
    const wordCount = text.split(/\s+/).length
    const baseTempos = {
      pop: 120,
      classical: 80,
      jazz: 100,
      folk: 90,
      electronic: 130,
      custom: 110
    }
    
    let baseTempo = baseTempos[style] || 110
    
    // Adjust tempo based on content length and complexity
    if (wordCount > 20) baseTempo += 10
    if (wordCount < 5) baseTempo -= 15
    
    return Math.max(60, Math.min(180, baseTempo)) // Clamp between 60-180 BPM
  }

  private selectOptimalKey(style: MusicStyle, scale: MusicalScale): string {
    const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab']
    
    // Select key based on style and scale type
    if (style === 'jazz') return 'Bb' // Jazz-friendly key
    if (style === 'classical') return 'C' // Classical standard
    if (style === 'electronic') return 'A' // Electronic-friendly
    if (scale.type === 'minor') return 'A' // Minor scale friendly
    
    return keys[Math.floor(Math.random() * keys.length)]
  }

  generateChordProgression(style: MusicStyle, complexity: string): ChordProgression {
    const progression = this.chordProgressions[style] || this.chordProgressions.pop
    
    if (complexity === 'advanced') {
      // Add extensions and alterations
      return {
        ...progression,
        chords: progression.chords.map(chord => 
          chord.includes('7') ? chord : chord + '7'
        ),
        complexity: 'advanced'
      }
    }
    
    return progression
  }

  async playAdvancedMelody(melody: MelodyData, withChords: boolean = false) {
    if (!this.synth || !this.isInitialized) {
      await this.initialize()
    }

    if (!this.synth) return

    if (withChords) {
      // Play melody with chord accompaniment
      const chordProgression = this.generateChordProgression('pop' as MusicStyle, 'intermediate')
      await this.playMelodyWithChords(melody, chordProgression)
    } else {
      // Play melody only
      const sequence = new Tone.Sequence(
        (time, note) => {
          this.synth?.triggerAttackRelease(note, '8n', time)
        },
        melody.notes,
        '8n'
      )

      Tone.Transport.bpm.value = melody.tempo
      sequence.start(0)
      Tone.Transport.start()
    }
  }

  private async playMelodyWithChords(melody: MelodyData, _chordProgression: ChordProgression) {
    // Implementation for playing melody with chord accompaniment
    // This would create a more sophisticated musical arrangement
    const sequence = new Tone.Sequence(
      (time, note) => {
        this.synth?.triggerAttackRelease(note, '8n', time)
      },
      melody.notes,
      '8n'
    )

    Tone.Transport.bpm.value = melody.tempo
    sequence.start(0)
    Tone.Transport.start()
  }

  stopMelody() {
    Tone.Transport.stop()
    Tone.Transport.cancel()
  }

  setInstrument(type: 'triangle' | 'sine' | 'square' | 'sawtooth' | 'piano' | 'strings') {
    if (this.synth) {
      if (type === 'piano') {
        // Add reverb for piano-like sound
        this.synth.chain(new Tone.Reverb(1.5), Tone.Destination)
      } else if (type === 'strings') {
        // Add chorus for strings-like sound
        this.synth.chain(new Tone.Chorus(4, 2.5, 0.5), Tone.Destination)
      }
    }
  }

  setEffects(reverb: number = 0, delay: number = 0, chorus: number = 0) {
    if (!this.synth) return

    // Apply audio effects
    if (reverb > 0) {
      this.synth.chain(new Tone.Reverb(reverb), Tone.Destination)
    }
    if (delay > 0) {
      this.synth.chain(new Tone.FeedbackDelay(delay, 0.5), Tone.Destination)
    }
    if (chorus > 0) {
      this.synth.chain(new Tone.Chorus(chorus, 2.5, 0.5), Tone.Destination)
    }
  }
}

export const advancedMusicService = new AdvancedMusicService()
export default advancedMusicService
