import { useEffect, useCallback } from 'react';

import { useGameStore } from '../gameStore';

import { soundManager, SOUND_EFFECTS } from './SoundManager';

export const useSound = () => {
  const { preferences, updatePreferences } = useGameStore();

  // Initialize sounds on mount
  useEffect(() => {
    // Load all sounds
    soundManager.loadSounds(SOUND_EFFECTS);
    
    // Apply initial preferences
    soundManager.setEnabled(preferences.soundEnabled);
    soundManager.setMusicVolume(preferences.musicVolume);
    soundManager.setEffectsVolume(preferences.effectsVolume);

    return () => {
      // Cleanup on unmount
      soundManager.stopMusic();
    };
  }, []);

  // Update sound manager when preferences change
  useEffect(() => {
    soundManager.setEnabled(preferences.soundEnabled);
    soundManager.setMusicVolume(preferences.musicVolume);
    soundManager.setEffectsVolume(preferences.effectsVolume);
  }, [preferences]);

  const playSound = useCallback((soundId: string, options?: { volume?: number; loop?: boolean }) => {
    soundManager.play(soundId, options);
  }, []);

  const stopSound = useCallback((soundId: string) => {
    soundManager.stop(soundId);
  }, []);

  const playButtonHover = useCallback(() => {
    playSound('button-hover', { volume: 0.3 });
  }, [playSound]);

  const playButtonClick = useCallback(() => {
    playSound('button-click', { volume: 0.5 });
  }, [playSound]);

  const playSceneTransition = useCallback(() => {
    playSound('scene-transition', { volume: 0.4 });
  }, [playSound]);

  const playPortalSelect = useCallback(() => {
    playSound('portal-select', { volume: 0.6 });
  }, [playSound]);

  const playTypewriter = useCallback(() => {
    playSound('typewriter', { volume: 0.15 });
  }, [playSound]);

  const playSuccess = useCallback(() => {
    playSound('success', { volume: 0.5 });
  }, [playSound]);

  const playError = useCallback(() => {
    playSound('error', { volume: 0.4 });
  }, [playSound]);

  const playMusic = useCallback((musicId: string) => {
    soundManager.play(musicId, { loop: true });
  }, []);

  const stopMusic = useCallback(() => {
    soundManager.stopMusic();
  }, []);

  const fadeOutMusic = useCallback((duration = 1000) => {
    soundManager.fadeOut('', duration);
  }, []);

  const toggleSound = useCallback(() => {
    const newEnabled = !preferences.soundEnabled;
    updatePreferences({ soundEnabled: newEnabled });
  }, [preferences.soundEnabled, updatePreferences]);

  return {
    // State
    soundEnabled: preferences.soundEnabled,
    musicVolume: preferences.musicVolume,
    effectsVolume: preferences.effectsVolume,
    
    // Actions
    playSound,
    stopSound,
    playButtonHover,
    playButtonClick,
    playSceneTransition,
    playPortalSelect,
    playTypewriter,
    playSuccess,
    playError,
    playMusic,
    stopMusic,
    fadeOutMusic,
    toggleSound,
    
    // Volume controls
    setMusicVolume: (volume: number) => updatePreferences({ musicVolume: volume }),
    setEffectsVolume: (volume: number) => updatePreferences({ effectsVolume: volume }),
  };
};