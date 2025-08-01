import { Button } from '@/components/ui/button';
import { trackAdventureChoice } from '@/lib/analytics';
import { cn } from '@/lib/utils';

import { useGameStore } from './gameStore';
import { useMobile } from './hooks';
import { useSound } from './sound';
import type { Choice as ChoiceType } from './types';

interface ChoiceProps {
  choice: ChoiceType;
  onClick: () => void;
  className?: string;
}

export const Choice = ({ choice, onClick, className }: ChoiceProps) => {
  const { isMobile, isTouch } = useMobile();
  const { playButtonClick, playButtonHover } = useSound();
  const { currentSceneId } = useGameStore();

  const handleClick = () => {
    playButtonClick();
    trackAdventureChoice(currentSceneId, choice.text, {
      next_scene: choice.nextScene
    });
    onClick();
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      playButtonHover();
    }
  };

  return (
    <Button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      variant="outline"
      className={cn(
        'w-full text-left h-auto',
        isMobile ? 'p-4 min-h-[44px]' : 'p-4',
        'border-gray-600 text-white bg-gray-900/80 backdrop-blur-sm',
        !isTouch && 'hover:bg-gray-800/90 hover:border-purple-500/70 hover:shadow-lg hover:shadow-purple-500/20',
        isTouch && 'active:bg-gray-800/90 active:border-purple-500/70 active:scale-95',
        'transition-all duration-200',
        className
      )}
      onTouchStart={() => isTouch && undefined}
    >
      <span className="block text-lg font-medium" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{choice.text}</span>
    </Button>
  );
};