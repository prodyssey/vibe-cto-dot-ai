import { useState, useRef } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { ParticleEffect } from '../animations';
import { useSound } from '../sound';

interface AnimatedButtonProps extends ButtonProps {
  particleColors?: string[];
  enableParticles?: boolean;
  enableSound?: boolean;
}

export const AnimatedButton = ({
  onClick,
  children,
  className,
  particleColors = ['#a78bfa', '#60a5fa', '#34d399'],
  enableParticles = true,
  enableSound = true,
  ...props
}: AnimatedButtonProps) => {
  const [showParticles, setShowParticles] = useState(false);
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { playButtonClick, playButtonHover } = useSound();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableSound) {
      playButtonClick();
    }

    if (enableParticles && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setParticlePosition({ x, y });
      setShowParticles(true);
    }

    onClick?.(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableSound) {
      playButtonHover();
    }
    props.onMouseEnter?.(e);
  };

  return (
    <div className="relative inline-block">
      <Button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={cn(
          'relative overflow-visible',
          className
        )}
        {...props}
      >
        {children}
      </Button>
      {enableParticles && (
        <div 
          className="absolute pointer-events-none"
          style={{
            left: `${particlePosition.x}%`,
            top: `${particlePosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <ParticleEffect
            trigger={showParticles}
            count={12}
            duration={800}
            colors={particleColors}
            spread={30}
            onComplete={() => setShowParticles(false)}
          />
        </div>
      )}
    </div>
  );
};