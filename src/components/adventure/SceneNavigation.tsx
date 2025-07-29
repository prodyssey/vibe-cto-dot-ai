import { ArrowLeft, ArrowRight, RotateCcw, Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

import { useGameStore } from './gameStore';
import { useBrowserNavigation, usePreferences, useSessionTimer, useMobile } from './hooks';
import { useSound } from './sound';

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
  const { isMobile, isSmallScreen, isTouch } = useMobile();
  const { playButtonClick, playButtonHover, playSceneTransition } = useSound();

  const handleBack = () => {
    playButtonClick();
    playSceneTransition();
    trackEvent('adventure_navigation', 'navigation', 'back_button');
    // Handle special back navigation cases
    if (currentSceneId === 'stationTour') {
      pushScene('destinationSelection');
    } else {
      window.history.back();
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over?')) {
      playButtonClick();
      trackEvent('adventure_navigation', 'navigation', 'reset_game');
      resetGame();
      pushScene('entry');
    }
  };

  const handleNext = () => {
    playButtonClick();
    playSceneTransition();
    trackEvent('adventure_navigation', 'navigation', `continue_${nextLabel.toLowerCase()}`);
    onNext?.();
  };

  return (
    <div className={cn("space-y-4", isMobile && "space-y-3")}>
      {/* Timer and Sound Controls */}
      <div className={cn(
        "flex justify-between items-center text-sm text-gray-400",
        isSmallScreen && "text-xs"
      )}>
        <span>Session Time: {formattedDuration}</span>
        <Button
          variant="ghost"
          size={isMobile ? "sm" : "sm"}
          onClick={toggleSound}
          className={cn(
            "text-gray-400 hover:text-white",
            isMobile && "min-h-[44px] min-w-[44px]",
            isTouch && "active:scale-95 transition-transform"
          )}
          onTouchStart={() => isTouch && undefined}
        >
          {soundEnabled ? (
            <Volume2 className={cn("w-4 h-4", isMobile && "w-5 h-5")} />
          ) : (
            <VolumeX className={cn("w-4 h-4", isMobile && "w-5 h-5")} />
          )}
        </Button>
      </div>

      {/* Navigation Controls */}
      <div className={cn(
        isSmallScreen 
          ? "flex flex-col space-y-3" 
          : "flex justify-between items-center"
      )}>
        {/* Back Button */}
        {showBack && canNavigateBack && (
          <div className={cn(isSmallScreen && "order-2")}>
            <Button
              variant="ghost"
              onClick={handleBack}
              onMouseEnter={() => !isMobile && playButtonHover()}
              className={cn(
                "text-gray-400 hover:text-white",
                isMobile && "min-h-[44px] w-full",
                isTouch && "active:scale-95 transition-transform"
              )}
              onTouchStart={() => isTouch && undefined}
            >
              <ArrowLeft className={cn("w-4 h-4 mr-2", isMobile && "w-5 h-5")} />
              Back
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className={cn(
          isSmallScreen 
            ? "flex flex-col space-y-2 order-1" 
            : "flex gap-4"
        )}>
          {showReset && (
            <Button
              variant="ghost"
              onClick={handleReset}
              onMouseEnter={() => !isMobile && playButtonHover()}
              className={cn(
                "text-gray-400 hover:text-white",
                isMobile && "min-h-[44px] w-full",
                isTouch && "active:scale-95 transition-transform"
              )}
              onTouchStart={() => isTouch && undefined}
            >
              <RotateCcw className={cn("w-4 h-4 mr-2", isMobile && "w-5 h-5")} />
              Start Over
            </Button>
          )}

          {showNext && onNext && (
            <Button
              onClick={handleNext}
              onMouseEnter={() => !isMobile && playButtonHover()}
              className={cn(
                "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
                isMobile && "min-h-[44px] w-full font-medium",
                isTouch && "active:scale-95 transition-transform"
              )}
              onTouchStart={() => isTouch && undefined}
            >
              {nextLabel}
              <ArrowRight className={cn("w-4 h-4 ml-2", isMobile && "w-5 h-5")} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};