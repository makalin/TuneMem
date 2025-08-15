import { Tune } from '@/types'

interface ShareOptions {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'email' | 'copy'
  includeAudio?: boolean
  includeScore?: boolean
  customMessage?: string
}

interface CollaborationInvite {
  tuneId: string
  invitedUserId: string
  permissions: 'view' | 'edit' | 'collaborate'
  message?: string
}

interface SocialStats {
  shares: number
  likes: number
  comments: number
  collaborations: number
}

class SocialSharingService {
  private readonly shareUrls = {
    twitter: 'https://twitter.com/intent/tweet',
    facebook: 'https://www.facebook.com/sharer/sharer.php',
    linkedin: 'https://www.linkedin.com/sharing/share-offsite',
    whatsapp: 'https://wa.me',
    email: 'mailto:',
    copy: 'copy'
  }

  async shareTune(tune: Tune, options: ShareOptions): Promise<boolean> {
    try {
      const shareData = this.prepareShareData(tune, options)
      
      switch (options.platform) {
        case 'twitter':
          return this.shareToTwitter(shareData)
        case 'facebook':
          return this.shareToFacebook(shareData)
        case 'linkedin':
          return this.shareToLinkedIn(shareData)
        case 'whatsapp':
          return this.shareToWhatsApp(shareData)
        case 'email':
          return this.shareViaEmail(shareData)
        case 'copy':
          return this.copyToClipboard(shareData)
        default:
          throw new Error(`Unsupported platform: ${options.platform}`)
      }
    } catch (error) {
      console.error('Failed to share tune:', error)
      return false
    }
  }

  private prepareShareData(tune: Tune, options: ShareOptions) {
    const baseUrl = window.location.origin
    const tuneUrl = `${baseUrl}/tune/${tune.id}`
    
    let message = options.customMessage || `Check out this amazing tune I created with TuneMem! 🎵`
    
    if (options.includeScore) {
      message += `\n\nPractice Score: ${tune.practiceCount} sessions`
    }
    
    message += `\n\n"${tune.title}"`
    if (tune.content.length < 100) {
      message += `\n${tune.content}`
    }
    
    message += `\n\n🎼 Style: ${tune.style} | 🎯 Difficulty: ${tune.difficulty}`
    message += `\n\n${tuneUrl}`
    
    return {
      url: tuneUrl,
      title: tune.title,
      description: tune.content,
      message,
      hashtags: ['TuneMem', 'MusicLearning', 'Memory', 'Education']
    }
  }

  private async shareToTwitter(shareData: any): Promise<boolean> {
    const params = new URLSearchParams({
      text: shareData.message,
      url: shareData.url,
      hashtags: shareData.hashtags.join(',')
    })
    
    const shareUrl = `${this.shareUrls.twitter}?${params.toString()}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
    
    // Track share
    this.trackShare('twitter')
    return true
  }

  private async shareToFacebook(shareData: any): Promise<boolean> {
    const params = new URLSearchParams({
      u: shareData.url,
      quote: shareData.message
    })
    
    const shareUrl = `${this.shareUrls.facebook}?${params.toString()}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
    
    this.trackShare('facebook')
    return true
  }

  private async shareToLinkedIn(shareData: any): Promise<boolean> {
    const params = new URLSearchParams({
      url: shareData.url,
      title: shareData.title,
      summary: shareData.description
    })
    
    const shareUrl = `${this.shareUrls.linkedin}?${params.toString()}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
    
    this.trackShare('linkedin')
    return true
  }

  private async shareToWhatsApp(shareData: any): Promise<boolean> {
    const message = encodeURIComponent(shareData.message)
    const shareUrl = `${this.shareUrls.whatsapp}?text=${message}`
    
    // Check if on mobile
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.open(shareUrl, '_blank')
    } else {
      // Desktop: open WhatsApp Web
      window.open('https://web.whatsapp.com', '_blank')
    }
    
    this.trackShare('whatsapp')
    return true
  }

  private async shareViaEmail(shareData: any): Promise<boolean> {
    const subject = encodeURIComponent(`Check out my TuneMem creation: ${shareData.title}`)
    const body = encodeURIComponent(shareData.message)
    
    const mailtoUrl = `${this.shareUrls.email}?subject=${subject}&body=${body}`
    window.location.href = mailtoUrl
    
    this.trackShare('email')
    return true
  }

  private async copyToClipboard(shareData: any): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(shareData.message)
      this.trackShare('copy')
      return true
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareData.message
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      this.trackShare('copy')
      return true
    }
  }

  // Collaboration features
  async inviteCollaborator(invite: CollaborationInvite): Promise<boolean> {
    try {
      // This would typically send an API request to invite a user
      const collaborationData = {
        tuneId: invite.tuneId,
        invitedUserId: invite.invitedUserId,
        permissions: invite.permissions,
        message: invite.message,
        timestamp: new Date().toISOString()
      }
      
      // Store collaboration invite locally for demo
      const collaborations = JSON.parse(localStorage.getItem('tunemem_collaborations') || '[]')
      collaborations.push(collaborationData)
      localStorage.setItem('tunemem_collaborations', JSON.stringify(collaborations))
      
      return true
    } catch (error) {
      console.error('Failed to invite collaborator:', error)
      return false
    }
  }

  async getCollaborations(tuneId: string): Promise<CollaborationInvite[]> {
    try {
      const collaborations = JSON.parse(localStorage.getItem('tunemem_collaborations') || '[]')
      return collaborations.filter((c: CollaborationInvite) => c.tuneId === tuneId)
    } catch (error) {
      console.error('Failed to get collaborations:', error)
      return []
    }
  }

  // Social statistics
  async getSocialStats(tuneId: string): Promise<SocialStats> {
    try {
      // This would typically fetch from an API
      const stats = JSON.parse(localStorage.getItem(`tunemem_social_stats_${tuneId}`) || '{}')
      
      return {
        shares: stats.shares || 0,
        likes: stats.likes || 0,
        comments: stats.comments || 0,
        collaborations: stats.collaborations || 0
      }
    } catch (error) {
      console.error('Failed to get social stats:', error)
      return { shares: 0, likes: 0, comments: 0, collaborations: 0 }
    }
  }

  async likeTune(tuneId: string): Promise<boolean> {
    try {
      const stats = await this.getSocialStats(tuneId)
      stats.likes++
      
      localStorage.setItem(`tunemem_social_stats_${tuneId}`, JSON.stringify(stats))
      return true
    } catch (error) {
      console.error('Failed to like tune:', error)
      return false
    }
  }

  async commentOnTune(tuneId: string, comment: string): Promise<boolean> {
    try {
      const stats = await this.getSocialStats(tuneId)
      stats.comments++
      
      // Store comment
      const comments = JSON.parse(localStorage.getItem(`tunemem_comments_${tuneId}`) || '[]')
      comments.push({
        id: crypto.randomUUID(),
        text: comment,
        userId: 'current-user', // This would be the actual user ID
        timestamp: new Date().toISOString()
      })
      
      localStorage.setItem(`tunemem_comments_${tuneId}`, JSON.stringify(comments))
      localStorage.setItem(`tunemem_social_stats_${tuneId}`, JSON.stringify(stats))
      
      return true
    } catch (error) {
      console.error('Failed to comment on tune:', error)
      return false
    }
  }

  async getComments(tuneId: string): Promise<any[]> {
    try {
      return JSON.parse(localStorage.getItem(`tunemem_comments_${tuneId}`) || '[]')
    } catch (error) {
      console.error('Failed to get comments:', error)
      return []
    }
  }

  // Generate shareable content
  generateShareableContent(tune: Tune, platform: string): string {
    const baseUrl = window.location.origin
    const tuneUrl = `${baseUrl}/tune/${tune.id}`
    
    switch (platform) {
      case 'twitter':
        return `🎵 "${tune.title}" - Created with TuneMem!\n\n${tune.content.substring(0, 100)}${tune.content.length > 100 ? '...' : ''}\n\n${tuneUrl} #TuneMem #MusicLearning`
      
      case 'facebook':
        return `Check out this amazing tune I created with TuneMem!\n\n"${tune.title}"\n${tune.content}\n\n🎼 Style: ${tune.style} | 🎯 Difficulty: ${tune.difficulty}\n\n${tuneUrl}`
      
      case 'linkedin':
        return `I've been using TuneMem to enhance my memory through music! Here's a tune I created:\n\n"${tune.title}"\n${tune.content}\n\nThis innovative approach combines music theory with memory techniques. ${tuneUrl}`
      
      default:
        return `Check out this tune I created with TuneMem: "${tune.title}" - ${tuneUrl}`
    }
  }

  // QR Code generation for easy sharing
  generateQRCode(tuneId: string): string {
    const tuneUrl = `${window.location.origin}/tune/${tuneId}`
    // This would typically use a QR code library
    // For now, return a placeholder
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tuneUrl)}`
  }

  // Social media preview metadata
  generateSocialPreview(tune: Tune): any {
    return {
      title: `${tune.title} - TuneMem`,
      description: tune.content.substring(0, 160),
      image: this.generateTunePreviewImage(tune),
      url: `${window.location.origin}/tune/${tune.id}`,
      type: 'music.song',
      audio: this.generateAudioUrl(tune)
    }
  }

  private generateTunePreviewImage(tune: Tune): string {
    // This would generate a visual representation of the tune
    // For now, return a placeholder
    return `${window.location.origin}/api/tune-preview/${tune.id}`
  }

  private generateAudioUrl(tune: Tune): string {
    // This would generate a shareable audio file
    return `${window.location.origin}/api/tune-audio/${tune.id}`
  }

  private trackShare(platform: string): void {
    // Track sharing analytics
    const analytics = JSON.parse(localStorage.getItem('tunemem_analytics') || '{}')
    if (!analytics.shares) analytics.shares = {}
    if (!analytics.shares[platform]) analytics.shares[platform] = 0
    
    analytics.shares[platform]++
    localStorage.setItem('tunemem_analytics', JSON.stringify(analytics))
  }

  // Get sharing analytics
  getSharingAnalytics(): any {
    try {
      return JSON.parse(localStorage.getItem('tunemem_analytics') || '{}')
    } catch (error) {
      console.error('Failed to get sharing analytics:', error)
      return {}
    }
  }
}

export const socialSharingService = new SocialSharingService()
export default socialSharingService
