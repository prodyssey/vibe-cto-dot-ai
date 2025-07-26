import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { useSound } from './sound';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  playSound?: boolean;
}

export const TypewriterText = ({
  text,
  speed = 50,
  className,
  onComplete,
  playSound = true,
}: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const { playTypewriter, soundEnabled } = useSound();

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
        
        // Play typewriter sound occasionally (every 3rd character that's not a space)
        if (playSound && soundEnabled && text[currentIndex] !== ' ' && currentIndex % 3 === 0) {
          playTypewriter();
        }
      }, speed);

      return () => clearTimeout(timer);
    } else {
      // Hide cursor after typing is complete
      setTimeout(() => {
        setShowCursor(false);
        onComplete?.();
      }, 500);
    }
  }, [currentIndex, text, speed, onComplete, playSound, soundEnabled, playTypewriter]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn('font-mono', className)}>
      {displayText}
      {showCursor && (
        <span className="inline-block w-0.5 h-5 bg-current ml-1 animate-pulse" />
      )}
    </div>
  );
};