export type SoundType = 'click' | 'hover' | 'transition' | 'success' | 'error' | 'ambient' | 'music';

export interface Sound {
  id: string;
  type: SoundType;
  url: string;
  volume?: number;
  loop?: boolean;
  preload?: boolean;
}

export class SoundManager {
  private static instance: SoundManager | null = null;
  private audioContext: AudioContext | null = null;
  private sounds = new Map<string, HTMLAudioElement>();
  private masterVolume = 1;
  private musicVolume = 0.5;
  private effectsVolume = 0.7;
  private enabled = true;
  private currentMusic: HTMLAudioElement | null = null;

  private constructor() {
    // Initialize on first user interaction to comply with browser policies
    this.initializeOnInteraction();
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initializeOnInteraction() {
    const initAudio = () => {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        // Resume context if suspended
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
      }
      // Remove listeners after initialization
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
  }

  async loadSound(sound: Sound): Promise<void> {
    try {
      const audio = new Audio(sound.url);
      
      // Set initial volume based on sound type
      const isMusic = sound.id.includes('music') || sound.id.includes('ambient');
      const categoryVolume = isMusic ? this.musicVolume : this.effectsVolume;
      audio.volume = (sound.volume ?? 1) * categoryVolume * this.masterVolume;
      audio.loop = sound.loop ?? false;
      
      // Add error event listener
      audio.addEventListener('error', (e) => {
        console.error(`Failed to load sound: ${sound.id} from ${sound.url}`, e);
      });
      
      // Add loaded event listener (commented out for production)
      // audio.addEventListener('canplaythrough', () => {
      //   console.log(`Sound ready: ${sound.id} (volume: ${audio.volume})`);
      // }, { once: true });
      
      if (sound.preload) {
        await audio.load();
      }

      this.sounds.set(sound.id, audio);
    } catch (error) {
      console.error(`Failed to load sound: ${sound.id}`, error);
    }
  }

  async loadSounds(sounds: Sound[]): Promise<void> {
    await Promise.all(sounds.map(sound => this.loadSound(sound)));
  }

  play(soundId: string, options?: { volume?: number; loop?: boolean }): void {
    if (!this.enabled) {return;}

    const audio = this.sounds.get(soundId);
    if (!audio) {
      console.warn(`Sound not found: ${soundId} - Available sounds:`, Array.from(this.sounds.keys()));
      return;
    }

    try {
      // Determine if this is music or effect based on the sound type
      const isMusic = soundId.includes('music') || soundId.includes('ambient');
      const categoryVolume = isMusic ? this.musicVolume : this.effectsVolume;
      
      // For music/ambient, use the same instance
      if (isMusic) {
        this.stopMusic();
        audio.volume = (options?.volume ?? audio.volume) * categoryVolume * this.masterVolume;
        audio.loop = options?.loop ?? audio.loop;
        this.currentMusic = audio;
        audio.play().catch(error => {
          if (error.name === 'NotAllowedError') {
            // Silently fail - this is expected before user interaction
          } else {
            console.error(`Failed to play music: ${soundId}`, error);
          }
        });
      } else {
        // For sound effects, clone to allow overlapping
        const audioClone = audio.cloneNode() as HTMLAudioElement;
        audioClone.volume = (options?.volume ?? audio.volume) * categoryVolume * this.masterVolume;
        audioClone.loop = false; // Effects should not loop
        
        audioClone.play().catch(error => {
          if (error.name === 'NotAllowedError') {
            // Silently fail - this is expected before user interaction
          } else {
            console.error(`Failed to play sound effect: ${soundId}`, error);
          }
        });

        // Clean up after playing
        audioClone.addEventListener('ended', () => {
          audioClone.remove();
        });
      }
    } catch (error) {
      console.error(`Error playing sound: ${soundId}`, error);
    }
  }

  stop(soundId: string): void {
    const audio = this.sounds.get(soundId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }

  fadeOut(soundId: string, duration = 1000): void {
    const audio = this.sounds.get(soundId) || this.currentMusic;
    if (!audio) {return;}

    const startVolume = audio.volume;
    const fadeInterval = 50; // ms
    const fadeSteps = duration / fadeInterval;
    const volumeStep = startVolume / fadeSteps;

    const fade = setInterval(() => {
      if (audio.volume > volumeStep) {
        audio.volume -= volumeStep;
      } else {
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0;
        clearInterval(fade);
      }
    }, fadeInterval);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentMusic) {
      this.currentMusic.volume = this.musicVolume * this.masterVolume;
    }
  }

  setEffectsVolume(volume: number): void {
    this.effectsVolume = Math.max(0, Math.min(1, volume));
  }

  private updateAllVolumes(): void {
    this.sounds.forEach((audio, soundId) => {
      const isMusic = soundId.includes('music') || soundId.includes('ambient');
      const categoryVolume = isMusic ? this.musicVolume : this.effectsVolume;
      audio.volume = audio.volume * categoryVolume * this.masterVolume;
    });
  }

  dispose(): void {
    this.stopMusic();
    this.sounds.forEach(audio => {
      audio.pause();
      audio.remove();
    });
    this.sounds.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    SoundManager.instance = null;
  }
}

// Sound effect definitions
export const SOUND_EFFECTS: Sound[] = [
  // UI Sounds
  { id: 'button-hover', type: 'hover', url: '/sounds/ui-hover.wav', volume: 0.3, preload: true },
  { id: 'button-click', type: 'click', url: '/sounds/ui-click.wav', volume: 0.5, preload: true },
  { id: 'scene-transition', type: 'transition', url: '/sounds/whoosh.wav', volume: 0.4, preload: true },
  { id: 'portal-select', type: 'click', url: '/sounds/portal-activate.wav', volume: 0.6, preload: true },
  
  // Feedback Sounds
  { id: 'success', type: 'success', url: '/sounds/success-chime.wav', volume: 0.5 },
  { id: 'error', type: 'error', url: '/sounds/error-buzz.wav', volume: 0.4 },
  { id: 'typewriter', type: 'click', url: '/sounds/typewriter-key.wav', volume: 0.1 },
  
  // Ambient Sounds
  { id: 'space-ambient', type: 'ambient', url: '/sounds/space-ambience.wav', volume: 0.3, loop: true },
  // { id: 'computer-hum', type: 'ambient', url: '/sounds/computer-hum.wav', volume: 0.2, loop: true },
  
  // Path-specific Music (commented out until we have music files)
  // { id: 'music-main', type: 'music', url: '/sounds/music-main-theme.wav', volume: 0.4, loop: true },
  // { id: 'music-ignition', type: 'music', url: '/sounds/music-ignition-forge.wav', volume: 0.4, loop: true },
  // { id: 'music-launch', type: 'music', url: '/sounds/music-launch-control.wav', volume: 0.4, loop: true },
  // { id: 'music-interstellar', type: 'music', url: '/sounds/music-interstellar.wav', volume: 0.4, loop: true },
];

// Helper function to get sound manager instance
export const soundManager = SoundManager.getInstance();