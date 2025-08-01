import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface FadeInTextProps {
  text: string;
  className?: string;
  onComplete?: () => void;
  delay?: number;
}

export const FadeInText = ({
  text,
  className,
  onComplete,
  delay = 0,
}: FadeInTextProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Add a slight delay before calling onComplete to let animation finish
      setTimeout(() => {
        onComplete?.();
      }, 800);
    }, delay + 100); // Small initial delay for better effect

    return () => clearTimeout(timer);
  }, [delay, onComplete]);

  return (
    <div 
      className={cn(
        'transition-all duration-1000 ease-out transform',
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100 blur-0' 
          : 'opacity-0 translate-y-6 scale-95 blur-sm',
        className
      )}
      style={{
        transitionProperty: 'opacity, transform, filter',
        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
      }}
    >
      {text}
    </div>
  );
};