import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { analytics } from './analytics';
import type { GameState, ServicePath, AnalyticsEvent } from './types';

interface GameStore extends GameState {
  // Actions
  setPlayerName: (name: string, isGenerated: boolean) => void;
  setSessionId: (id: string) => void;
  startSession: () => void;
  navigateToScene: (sceneId: string) => void;
  makeChoice: (sceneId: string, choiceId: string, pathWeight?: Record<ServicePath, number>, additionalData?: any) => void;
  calculateFinalPath: () => ServicePath;
  discoverPath: (path: ServicePath) => void;
  unlockContent: (contentId: string) => void;
  updatePreferences: (preferences: Partial<GameState['preferences']>) => void;
  completeGame: (outcome: 'email_signup' | 'explore_service' | 'waitlist') => Promise<void>;
  resetGame: () => void;
  restoreProgress: (progress: Partial<GameState>) => void;
  
  // Analytics
  trackEvent: (event: Omit<AnalyticsEvent, 'timestamp' | 'sessionId'>) => void;
  
  // Utility
  canNavigateBack: () => boolean;
  getSessionDuration: () => number;
  hasVisitedScene: (sceneId: string) => boolean;
  getVisitCount: (sceneId: string) => number;
  getChoiceData: (sceneId: string, choiceId: string) => any;
}

const initialState: GameState = {
  currentSceneId: 'entry',
  playerName: '',
  isGeneratedName: false,
  sessionId: '',
  sessionStartTime: null,
  visitedScenes: {},
  pathScores: {
    ignition: 0,
    launch_control: 0,
    transformation: 0,
  },
  finalPath: null,
  choices: [],
  discoveredPaths: new Set(),
  unlockedContent: [],
  preferences: {
    soundEnabled: true,
    musicVolume: 0.5,
    effectsVolume: 0.7,
  },
  completionStatus: {
    isCompleted: false,
    completedAt: null,
    finalOutcome: null,
  },
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPlayerName: (name, isGenerated) =>
        set({
          playerName: name,
          isGeneratedName: isGenerated,
        }),

      setSessionId: (id) => set({ sessionId: id }),

      startSession: () =>
        set({
          sessionStartTime: new Date().toISOString(),
        }),

      navigateToScene: (sceneId) => {
        const state = get();
        
        // Track analytics
        get().trackEvent({
          eventType: 'scene_view',
          data: { 
            fromScene: state.currentSceneId, 
            toScene: sceneId,
            visitCount: (state.visitedScenes[sceneId] || 0) + 1
          },
        });

        set((state) => ({
          currentSceneId: sceneId,
          visitedScenes: {
            ...state.visitedScenes,
            [sceneId]: (state.visitedScenes[sceneId] || 0) + 1,
          },
        }));
      },

      makeChoice: (sceneId, choiceId, pathWeight, additionalData) => {
        get().trackEvent({
          eventType: 'choice_made',
          data: { sceneId, choiceId, pathWeight, additionalData },
        });

        set((state) => {
          const newChoices = [
            ...state.choices,
            {
              sceneId,
              choiceId,
              timestamp: new Date().toISOString(),
              additionalData,
            },
          ];

          let newPathScores = { ...state.pathScores };
          if (pathWeight) {
            newPathScores = {
              ignition: state.pathScores.ignition + (pathWeight.ignition || 0),
              launch_control: state.pathScores.launch_control + (pathWeight.launch_control || 0),
              transformation: state.pathScores.transformation + (pathWeight.transformation || 0),
            };
          }

          return {
            choices: newChoices,
            pathScores: newPathScores,
          };
        });
      },

      calculateFinalPath: () => {
        const { pathScores } = get();
        const entries = Object.entries(pathScores) as [ServicePath, number][];
        const [finalPath] = entries.reduce((a, b) => (a[1] > b[1] ? a : b));
        
        set({ finalPath });
        get().discoverPath(finalPath);
        
        return finalPath;
      },

      discoverPath: (path) => {
        get().trackEvent({
          eventType: 'path_discovered',
          data: { path },
        });

        set((state) => ({
          discoveredPaths: new Set([...Array.from(state.discoveredPaths), path]),
        }));
      },

      unlockContent: (contentId) =>
        set((state) => ({
          unlockedContent: [...state.unlockedContent, contentId],
        })),

      updatePreferences: (preferences) => {
        get().trackEvent({
          eventType: 'preference_changed',
          data: preferences,
        });

        set((state) => ({
          preferences: {
            ...state.preferences,
            ...preferences,
          },
        }));
      },

      completeGame: async (outcome) => {
        const completedAt = new Date().toISOString();
        
        get().trackEvent({
          eventType: 'game_completed',
          data: { 
            outcome, 
            duration: get().getSessionDuration(),
            finalPath: get().finalPath,
          },
        });

        set({
          completionStatus: {
            isCompleted: true,
            completedAt,
            finalOutcome: outcome,
          },
        });
      },

      resetGame: () => {
        // Keep preferences when resetting
        const { preferences } = get();
        set({
          ...initialState,
          preferences,
          discoveredPaths: new Set(),
        });
      },

      restoreProgress: (progress) => set((state) => ({ 
        ...state, 
        ...progress,
        // Convert arrays back to Sets if needed
        discoveredPaths: progress.discoveredPaths 
          ? new Set(progress.discoveredPaths as any)
          : state.discoveredPaths,
      })),

      trackEvent: (event) => {
        const { sessionId } = get();
        const analyticsEvent: AnalyticsEvent = {
          ...event,
          timestamp: new Date().toISOString(),
          sessionId,
        };
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Analytics Event:', analyticsEvent);
        }
        
        // Send to analytics service
        analytics.trackEvent(analyticsEvent);
      },

      canNavigateBack: () => {
        const { choices, currentSceneId } = get();
        return choices.length > 0 && currentSceneId !== 'entry';
      },

      getSessionDuration: () => {
        const { sessionStartTime } = get();
        if (!sessionStartTime) {return 0;}
        
        const start = new Date(sessionStartTime).getTime();
        const now = new Date().getTime();
        return Math.floor((now - start) / 1000); // Return seconds
      },

      hasVisitedScene: (sceneId) => {
        const { visitedScenes } = get();
        return (visitedScenes[sceneId] || 0) > 0;
      },

      getVisitCount: (sceneId) => {
        const { visitedScenes } = get();
        return visitedScenes[sceneId] || 0;
      },

      getChoiceData: (sceneId, choiceId) => {
        const { choices } = get();
        const choice = choices.find(c => c.sceneId === sceneId && c.choiceId === choiceId);
        return choice?.additionalData;
      },
    }),
    {
      name: 'adventure-game-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        playerName: state.playerName,
        isGeneratedName: state.isGeneratedName,
        currentSceneId: state.currentSceneId,
        sessionStartTime: state.sessionStartTime,
        visitedScenes: state.visitedScenes,
        pathScores: state.pathScores,
        choices: state.choices,
        discoveredPaths: Array.from(state.discoveredPaths),
        unlockedContent: state.unlockedContent,
        preferences: state.preferences,
        completionStatus: state.completionStatus,
      }),
    }
  )
);

// Expose game store to window for testing and development
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (window as any).gameStore = useGameStore;
}