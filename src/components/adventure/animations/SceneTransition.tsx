import { useEffect, useState, ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { useReducedMotion } from '../hooks';

interface SceneTransitionProps {
  children: ReactNode;
  sceneId: string;
  transitionType?: 'fade' | 'slide' | 'zoom' | 'portal';
  duration?: number;
  className?: string;
}

export const SceneTransition = ({
  children,
  sceneId,
  transitionType = 'fade',
  duration = 500,
  className,
}: SceneTransitionProps) => {
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [currentSceneId, setCurrentSceneId] = useState(sceneId);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (sceneId !== currentSceneId) {
      setIsTransitioning(true);
      
      // Wait for exit animation
      const exitTimer = setTimeout(() => {
        setCurrentSceneId(sceneId);
        
        // Trigger enter animation
        const enterTimer = setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
        
        return () => clearTimeout(enterTimer);
      }, duration);
      
      return () => clearTimeout(exitTimer);
    } else {
      // Initial mount
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [sceneId, currentSceneId, duration]);

  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getTransitionClasses = () => {
    const baseClasses = 'transition-all ease-in-out';
    const durationClass = `duration-${duration}`;

    switch (transitionType) {
      case 'slide':
        return cn(
          baseClasses,
          durationClass,
          isTransitioning ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        );
      
      case 'zoom':
        return cn(
          baseClasses,
          durationClass,
          isTransitioning ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
        );
      
      case 'portal':
        return cn(
          baseClasses,
          durationClass,
          isTransitioning ? 'scale-0 rotate-180 opacity-0' : 'scale-100 rotate-0 opacity-100'
        );
      
      case 'fade':
      default:
        return cn(
          baseClasses,
          durationClass,
          isTransitioning ? 'opacity-0' : 'opacity-100'
        );
    }
  };

  return (
    <div className={cn(getTransitionClasses(), 'relative', className)}>
      {/* Background overlay during transitions */}
      {isTransitioning && transitionType !== 'fade' && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10" />
      )}
      {children}
    </div>
  );
};