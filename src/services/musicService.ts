import * as Tone from 'tone'
import { MelodyData, MusicStyle } from '@/types'

class MusicService {
  private synth: Tone.Synth | null = null
  private isInitialized = false

  async initialize() {
    if (this.isInitialized) return

    try {
      await Tone.start()
      this.synth = new Tone.Synth({
        oscillator: {
          type: 'sine'
        },
        envelope: {
          attack: 0.1,
          decay: 0.2,
          sustain: 0.3,
          release: 0.8
        }
      }).toDestination()
      
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize audio context:', error)
      throw error
    }
  }

  generateMelody(text: string, style: MusicStyle): MelodyData {
    const words = text.split(/\s+/).filter(word => word.length > 0)
    const noteCount = Math.min(words.length, 16) // Limit to 16 notes
    
    const notes = this.generateNotes(noteCount, style)
    const rhythm = this.generateRhythm(noteCount, style)
    const tempo = this.getTempoForStyle(style)
    const key = this.getRandomKey()
    const scale = this.getScaleForStyle(style)
    
    return {
      notes,
      rhythm,
      tempo,
      key,
      scale
    }
  }

  private generateNotes(count: number, style: MusicStyle): string[] {
    const scales = {
      pop: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      classical: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      jazz: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      folk: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      electronic: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      custom: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    }
    
    const scale = scales[style]
    const notes: string[] = []
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * scale.length)
      const octave = Math.floor(Math.random() * 2) + 4 // Octaves 4-5
      notes.push(`${scale[randomIndex]}${octave}`)
    }
    
    return notes
  }

  private generateRhythm(count: number, style: MusicStyle): number[] {
    const rhythms = {
      pop: [0.25, 0.5, 1], // Quarter, half, whole notes
      classical: [0.5, 1, 2], // Half, whole, double whole notes
      jazz: [0.25, 0.5, 0.75, 1], // Swing feel
      folk: [0.5, 1, 1.5], // Folk rhythm
      electronic: [0.125, 0.25, 0.5], // Electronic beats
      custom: [0.25, 0.5, 1]
    }
    
    const styleRhythms = rhythms[style]
    const rhythm: number[] = []
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * styleRhythms.length)
      rhythm.push(styleRhythms[randomIndex])
    }
    
    return rhythm
  }

  private getTempoForStyle(style: MusicStyle): number {
    const tempos = {
      pop: 120,
      classical: 80,
      jazz: 100,
      folk: 90,
      electronic: 130,
      custom: 110
    }
    
    return tempos[style]
  }

  private getRandomKey(): string {
    const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab']
    return keys[Math.floor(Math.random() * keys.length)]
  }

  private getScaleForStyle(style: MusicStyle): string {
    const scales = {
      pop: 'major',
      classical: 'major',
      jazz: 'mixolydian',
      folk: 'major',
      electronic: 'minor',
      custom: 'major'
    }
    
    return scales[style]
  }

  async playMelody(melody: MelodyData) {
    if (!this.synth || !this.isInitialized) {
      await this.initialize()
    }

    if (!this.synth) return

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

  async playNote(note: string, duration: number = 0.5) {
    if (!this.synth || !this.isInitialized) {
      await this.initialize()
    }

    if (!this.synth) return

    this.synth.triggerAttackRelease(note, duration)
  }

  setVolume(volume: number) {
    if (this.synth) {
      this.synth.volume.value = Tone.gainToDb(volume)
    }
  }

  setInstrument(type: 'sine' | 'square' | 'sawtooth' | 'triangle') {
    if (this.synth) {
      this.synth.oscillator.type = type
    }
  }
}

export const musicService = new MusicService()
export default musicService
