import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useGameStore } from './gameStore';

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
  const { navigateToScene, resetGame } = useGameStore();

  const handleBack = () => {
    // For now, go back to destination selection
    navigateToScene('destinationSelection');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over?')) {
      resetGame();
      navigateToScene('entry');
    }
  };

  return (
    <div className="flex justify-between items-center mt-8">
      <div>
        {showBack && (
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
  );
};