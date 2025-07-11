import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, ServicePath, Scene } from './types';

interface GameStore extends GameState {
  // Actions
  setPlayerName: (name: string, isGenerated: boolean) => void;
  setSessionId: (id: string) => void;
  navigateToScene: (sceneId: string) => void;
  makeChoice: (sceneId: string, choiceId: string, pathWeight?: Record<ServicePath, number>) => void;
  calculateFinalPath: () => ServicePath;
  resetGame: () => void;
  restoreProgress: (progress: Partial<GameState>) => void;
}

const initialState: GameState = {
  currentSceneId: 'entry',
  playerName: '',
  isGeneratedName: false,
  sessionId: '',
  visitedScenes: {},
  pathScores: {
    ignition: 0,
    launch_control: 0,
    interstellar: 0,
  },
  finalPath: null,
  choices: [],
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

      navigateToScene: (sceneId) =>
        set((state) => ({
          currentSceneId: sceneId,
          visitedScenes: {
            ...state.visitedScenes,
            [sceneId]: (state.visitedScenes[sceneId] || 0) + 1,
          },
        })),

      makeChoice: (sceneId, choiceId, pathWeight) =>
        set((state) => {
          const newChoices = [
            ...state.choices,
            {
              sceneId,
              choiceId,
              timestamp: new Date().toISOString(),
            },
          ];

          let newPathScores = { ...state.pathScores };
          if (pathWeight) {
            newPathScores = {
              ignition: state.pathScores.ignition + (pathWeight.ignition || 0),
              launch_control: state.pathScores.launch_control + (pathWeight.launch_control || 0),
              interstellar: state.pathScores.interstellar + (pathWeight.interstellar || 0),
            };
          }

          return {
            choices: newChoices,
            pathScores: newPathScores,
          };
        }),

      calculateFinalPath: () => {
        const { pathScores } = get();
        const entries = Object.entries(pathScores) as Array<[ServicePath, number]>;
        const [finalPath] = entries.reduce((a, b) => (a[1] > b[1] ? a : b));
        set({ finalPath });
        return finalPath;
      },

      resetGame: () => set(initialState),

      restoreProgress: (progress) => set((state) => ({ ...state, ...progress })),
    }),
    {
      name: 'adventure-game-storage',
      partialize: (state) => ({
        playerName: state.playerName,
        isGeneratedName: state.isGeneratedName,
        currentSceneId: state.currentSceneId,
        visitedScenes: state.visitedScenes,
        pathScores: state.pathScores,
        choices: state.choices,
      }),
    }
  )
);