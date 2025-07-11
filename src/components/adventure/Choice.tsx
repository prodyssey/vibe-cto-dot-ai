import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Choice as ChoiceType } from './types';

interface ChoiceProps {
  choice: ChoiceType;
  onClick: () => void;
  className?: string;
}

export const Choice = ({ choice, onClick, className }: ChoiceProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn(
        'w-full text-left h-auto p-4',
        'border-gray-600 text-white bg-gray-800/50',
        'hover:bg-gray-700/50 hover:border-purple-500/50',
        'transition-all duration-200',
        className
      )}
    >
      <span className="block">{choice.text}</span>
    </Button>
  );
};