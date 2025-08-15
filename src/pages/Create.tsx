import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { Save, Play, Music, Sparkles, Plus } from 'lucide-react'
import { useTuneStore } from '@/stores/tuneStore'
import { musicService } from '@/services/musicService'
import { Tune, MusicStyle } from '@/types'

const createTuneSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string().min(1, 'Content is required').max(500, 'Content too long'),
  style: z.enum(['pop', 'classical', 'jazz', 'folk', 'electronic', 'custom']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
})

type CreateTuneForm = z.infer<typeof createTuneSchema>

const Create = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [generatedMelody, setGeneratedMelody] = useState<any>(null)
  const [newTag, setNewTag] = useState('')
  
  const { addTune } = useTuneStore()
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTuneForm>({
    resolver: zodResolver(createTuneSchema),
    defaultValues: {
      style: 'pop',
      difficulty: 'medium',
      tags: ['learning'],
    },
  })

  const watchedTags = watch('tags')

  const addTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      setValue('tags', [...watchedTags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove))
  }

  const generateMelody = async () => {
    const content = watch('content')
    const style = watch('style')
    
    if (!content.trim()) {
      toast.error('Please enter some content first')
      return
    }

    setIsGenerating(true)
    try {
      const melody = musicService.generateMelody(content, style as MusicStyle)
      setGeneratedMelody(melody)
      toast.success('Melody generated successfully!')
    } catch (error) {
      toast.error('Failed to generate melody')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const playMelody = async () => {
    if (!generatedMelody) return

    if (isPlaying) {
      musicService.stopMelody()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      try {
        await musicService.playMelody(generatedMelody)
        setIsPlaying(false)
      } catch (error) {
        toast.error('Failed to play melody')
        setIsPlaying(false)
      }
    }
  }

  const onSubmit = async (data: CreateTuneForm) => {
    if (!generatedMelody) {
      toast.error('Please generate a melody first')
      return
    }

    try {
      const newTune: Omit<Tune, 'id' | 'createdAt'> = {
        title: data.title,
        content: data.content,
        melody: generatedMelody,
        style: data.style,
        difficulty: data.difficulty,
        tags: data.tags,
        practiceCount: 0,
      }

      addTune(newTune)
      toast.success('Tune created successfully!')
      reset()
      setGeneratedMelody(null)
    } catch (error) {
      toast.error('Failed to create tune')
      console.error(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Tune</h1>
        <p className="text-gray-600">
          Transform your information into a memorable melody
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                {...register('title')}
                className="input-field"
                placeholder="Enter a catchy title for your tune"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content to Memorize
              </label>
              <textarea
                {...register('content')}
                rows={4}
                className="input-field"
                placeholder="Enter the information you want to remember (e.g., vocabulary words, facts, dates)"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Music Style
                </label>
                <select {...register('style')} className="input-field">
                  <option value="pop">Pop</option>
                  <option value="classical">Classical</option>
                  <option value="jazz">Jazz</option>
                  <option value="folk">Folk</option>
                  <option value="electronic">Electronic</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select {...register('difficulty')} className="input-field">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {watchedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-outline px-3"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {errors.tags && (
                <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={generateMelody}
                disabled={isGenerating || !watch('content')}
                className="btn-secondary flex items-center space-x-2 flex-1"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate Melody'}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !generatedMelody}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating...' : 'Create Tune'}</span>
            </button>
          </form>
        </motion.div>

        {/* Melody Preview Section */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Melody Preview</h3>
          
          {generatedMelody ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Generated Melody</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Key:</span>
                    <span className="font-mono">{generatedMelody.key}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scale:</span>
                    <span className="font-mono capitalize">{generatedMelody.scale}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tempo:</span>
                    <span className="font-mono">{generatedMelody.tempo} BPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Notes:</span>
                    <span className="font-mono">{generatedMelody.notes.length}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={playMelody}
                disabled={isPlaying}
                className={`w-full flex items-center justify-center space-x-2 ${
                  isPlaying ? 'btn-outline' : 'btn-primary'
                }`}
              >
                <Play className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                <span>{isPlaying ? 'Playing...' : 'Play Melody'}</span>
              </button>

              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 border border-primary-200">
                <h4 className="font-medium text-gray-900 mb-2">💡 Tips</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Listen to the melody multiple times</li>
                  <li>• Associate each note with words</li>
                  <li>• Practice singing along</li>
                  <li>• Use the practice mode to test recall</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Melody Yet</h4>
              <p className="text-gray-600 mb-4">
                Enter your content and click "Generate Melody" to create a unique tune
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Create
