export type ServicePath = 'ignition' | 'launch_control' | 'interstellar';

export interface Scene {
  id: string;
  type: 'intro' | 'choice' | 'result' | 'detail';
  title: string;
  description: string;
  backgroundClass?: string;
  choices?: Choice[];
  nextScene?: string;
}

export interface Choice {
  id: string;
  text: string;
  icon?: string;
  nextScene: string;
  pathWeight?: {
    ignition: number;
    launch_control: number;
    interstellar: number;
  };
}

export interface GameState {
  currentSceneId: string;
  playerName: string;
  isGeneratedName: boolean;
  sessionId: string;
  sessionStartTime: string | null;
  visitedScenes: Record<string, number>;
  pathScores: {
    ignition: number;
    launch_control: number;
    interstellar: number;
  };
  finalPath: ServicePath | null;
  choices: Array<{
    sceneId: string;
    choiceId: string;
    timestamp: string;
  }>;
  discoveredPaths: Set<ServicePath>;
  unlockedContent: string[];
  preferences: {
    soundEnabled: boolean;
    musicVolume: number;
    effectsVolume: number;
  };
  completionStatus: {
    isCompleted: boolean;
    completedAt: string | null;
    finalOutcome: 'email_signup' | 'explore_service' | null;
  };
}

export interface SceneTransition {
  from: string;
  to: string;
  type: 'fade' | 'slide' | 'zoom';
  duration?: number;
}

export interface GameProgress {
  sessionId: string;
  playerName: string;
  currentSceneId: string;
  visitedScenes: Record<string, number>;
  choices: GameState['choices'];
  finalPath?: ServicePath;
  completedAt?: string;
  discoveredPaths?: string[];
  unlockedContent?: string[];
  preferences?: GameState['preferences'];
}

export interface AnalyticsEvent {
  eventType: 'scene_view' | 'choice_made' | 'path_discovered' | 'game_completed' | 'preference_changed';
  timestamp: string;
  sessionId: string;
  data: Record<string, any>;
}