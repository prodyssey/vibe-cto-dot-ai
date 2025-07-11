import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from './gameStore';
import { useBrowserNavigation, usePreferences, useSessionTimer } from './hooks';

interface SceneNavigationProps {
  showBack?: boolean;
  showNext?: boolean;
  showReset?: boolean;
  onNext?: () => void;
  nextLabel?: string;
}

export const SceneNavigation = ({
  showBack = false,
  showNext = false,
  showReset = false,
  onNext,
  nextLabel = 'Continue',
}: SceneNavigationProps) => {
  const { resetGame, currentSceneId } = useGameStore();
  const { pushScene, canNavigateBack } = useBrowserNavigation();
  const { soundEnabled, toggleSound } = usePreferences();
  const { formattedDuration } = useSessionTimer();

  const handleBack = () => {
    // Handle special back navigation cases
    if (currentSceneId === 'stationTour') {
      pushScene('destinationSelection');
    } else {
      window.history.back();
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over?')) {
      resetGame();
      pushScene('entry');
    }
  };

  return (
    <div className="space-y-4">
      {/* Timer and Sound Controls */}
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>Session Time: {formattedDuration}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSound}
          className="text-gray-400 hover:text-white"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <div>
          {showBack && canNavigateBack && (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
        </div>

        <div className="flex gap-4">
          {showReset && (
            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-gray-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          )}

          {showNext && onNext && (
            <Button
              onClick={onNext}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {nextLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};