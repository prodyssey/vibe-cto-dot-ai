import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useMobile } from '../hooks';

interface MobileOptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const MobileOptimizedButton = ({
  children,
  onClick,
  className,
  variant = 'default',
  size = 'md',
  disabled,
}: MobileOptimizedButtonProps) => {
  const { isMobile, isTouch } = useMobile();

  const getSizeClasses = () => {
    if (isMobile) {
      switch (size) {
        case 'sm':
          return 'px-4 py-3 text-sm min-h-[44px]'; // 44px is iOS minimum touch target
        case 'lg':
          return 'px-8 py-4 text-lg min-h-[48px]';
        default:
          return 'px-6 py-3 text-base min-h-[44px]';
      }
    } else {
      switch (size) {
        case 'sm':
          return 'px-3 py-2 text-sm';
        case 'lg':
          return 'px-8 py-3 text-lg';
        default:
          return 'px-4 py-2 text-base';
      }
    }
  };

  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      className={cn(
        'transition-all duration-200',
        getSizeClasses(),
        isTouch && 'active:scale-95',
        !isTouch && 'hover:scale-105',
        isMobile && 'w-full', // Full width on mobile for easier tapping
        className
      )}
    >
      {children}
    </Button>
  );
};