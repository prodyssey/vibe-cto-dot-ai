import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useMobile } from './hooks';
import type { Choice as ChoiceType } from './types';

interface ChoiceProps {
  choice: ChoiceType;
  onClick: () => void;
  className?: string;
}

export const Choice = ({ choice, onClick, className }: ChoiceProps) => {
  const { isMobile, isTouch } = useMobile();

  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn(
        'w-full text-left h-auto',
        isMobile ? 'p-4 min-h-[44px]' : 'p-4',
        'border-gray-600 text-white bg-gray-800/50',
        !isTouch && 'hover:bg-gray-700/50 hover:border-purple-500/50',
        isTouch && 'active:bg-gray-700/50 active:border-purple-500/50 active:scale-95',
        'transition-all duration-200',
        className
      )}
      onTouchStart={() => isTouch && undefined}
    >
      <span className="block">{choice.text}</span>
    </Button>
  );
};