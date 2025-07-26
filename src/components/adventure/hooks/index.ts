// Export all hooks from the main hooks file
export { 
  useBrowserNavigation,
  useSessionTimer,
  useGameCompletion,
  useDiscoveredPaths,
  usePreferences,
  useUnlockedContent
} from '../hooks';

// Export mobile-specific hooks
export { useMobile, useReducedMotion } from './useMobile';