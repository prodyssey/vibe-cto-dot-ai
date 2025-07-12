import React, { forwardRef } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';

import { useSound } from '../sound';

export interface SoundButtonProps extends ButtonProps {
  soundOnClick?: string;
  soundOnHover?: string;
  disableDefaultSounds?: boolean;
}

export const SoundButton = forwardRef<HTMLButtonElement, SoundButtonProps>(
  ({ 
    onClick, 
    onMouseEnter,
    soundOnClick,
    soundOnHover,
    disableDefaultSounds = false,
    children,
    ...props 
  }, ref) => {
    const { playButtonClick, playButtonHover, playSound } = useSound();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disableDefaultSounds || soundOnClick) {
        if (soundOnClick) {
          playSound(soundOnClick);
        } else {
          playButtonClick();
        }
      }
      onClick?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disableDefaultSounds || soundOnHover) {
        if (soundOnHover) {
          playSound(soundOnHover);
        } else {
          playButtonHover();
        }
      }
      onMouseEnter?.(e);
    };

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

SoundButton.displayName = 'SoundButton';