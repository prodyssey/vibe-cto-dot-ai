import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGameStore } from './gameStore';
import type { ServicePath } from './types';

/**
 * Hook to handle browser navigation (back/forward buttons)
 */
export const useBrowserNavigation = () => {
  const navigate = useNavigate();
  const { currentSceneId, navigateToScene, canNavigateBack } = useGameStore();

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.sceneId) {
        navigateToScene(event.state.sceneId);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Push initial state
    window.history.replaceState({ sceneId: currentSceneId }, '');

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentSceneId, navigateToScene]);

  const pushScene = useCallback((sceneId: string) => {
    window.history.pushState({ sceneId }, '', window.location.pathname);
    navigateToScene(sceneId);
  }, [navigateToScene]);

  return { pushScene, canNavigateBack: canNavigateBack() };
};

/**
 * Hook to track game session timing
 */
export const useSessionTimer = () => {
  const { sessionStartTime, getSessionDuration } = useGameStore();
  
  useEffect(() => {
    if (!sessionStartTime) {return;}

    const interval = setInterval(() => {
      // Force re-render to update timer display
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  return {
    duration: getSessionDuration(),
    formattedDuration: formatDuration(getSessionDuration()),
  };
};

/**
 * Hook to handle game completion
 */
export const useGameCompletion = () => {
  const navigate = useNavigate();
  const { 
    finalPath, 
    completeGame,
    completionStatus,
  } = useGameStore();

  const handleEmailSignup = useCallback(async () => {
    completeGame('email_signup');
  }, [completeGame]);

  const handleExploreService = useCallback(async () => {
    completeGame('explore_service');
    
    // Navigate to appropriate service page
    if (finalPath === 'ignition') {
      navigate('/ignition');
    } else if (finalPath === 'launch_control') {
      navigate('/launch-control');
    } else if (finalPath === 'transformation') {
      navigate('/transformation');
    }
  }, [completeGame, finalPath, navigate]);

  return {
    isCompleted: completionStatus.isCompleted,
    handleEmailSignup,
    handleExploreService,
  };
};

/**
 * Hook to manage discovered paths
 */
export const useDiscoveredPaths = () => {
  const { discoveredPaths, hasVisitedScene } = useGameStore();
  
  const hasDiscoveredPath = useCallback((path: ServicePath) => {
    return discoveredPaths.has(path);
  }, [discoveredPaths]);

  const getDiscoveredPathsCount = useCallback(() => {
    return discoveredPaths.size;
  }, [discoveredPaths]);

  const hasDiscoveredAllPaths = useCallback(() => {
    return discoveredPaths.size === 3;
  }, [discoveredPaths]);

  return {
    discoveredPaths: Array.from(discoveredPaths),
    hasDiscoveredPath,
    getDiscoveredPathsCount,
    hasDiscoveredAllPaths,
    hasVisitedScene,
  };
};

/**
 * Hook to manage user preferences
 */
export const usePreferences = () => {
  const { preferences, updatePreferences } = useGameStore();

  const toggleSound = useCallback(() => {
    updatePreferences({ soundEnabled: !preferences.soundEnabled });
  }, [preferences.soundEnabled, updatePreferences]);

  const setMusicVolume = useCallback((volume: number) => {
    updatePreferences({ musicVolume: Math.max(0, Math.min(1, volume)) });
  }, [updatePreferences]);

  const setEffectsVolume = useCallback((volume: number) => {
    updatePreferences({ effectsVolume: Math.max(0, Math.min(1, volume)) });
  }, [updatePreferences]);

  return {
    ...preferences,
    toggleSound,
    setMusicVolume,
    setEffectsVolume,
  };
};

/**
 * Hook to check if content is unlocked
 */
export const useUnlockedContent = () => {
  const { unlockedContent, unlockContent } = useGameStore();

  const isContentUnlocked = useCallback((contentId: string) => {
    return unlockedContent.includes(contentId);
  }, [unlockedContent]);

  return {
    unlockedContent,
    isContentUnlocked,
    unlockContent,
  };
};

// Utility functions
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Export mobile hooks from the hooks directory
export { useMobile, useReducedMotion } from './hooks/useMobile';