import { ReactNode, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trackPageView } from '@/lib/analytics';
import { cn } from '@/lib/utils';

import { useMobile } from './hooks';
import type { Scene as SceneType } from './types';

interface SceneProps {
  scene: SceneType;
  children?: ReactNode;
  className?: string;
}

export const Scene = ({ scene, children, className }: SceneProps) => {
  const { isMobile, isSmallScreen } = useMobile();

  useEffect(() => {
    trackPageView(`Adventure: ${scene.title}`, `/adventure/${scene.id}`);
  }, [scene.id, scene.title]);

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center',
      isMobile ? 'p-4' : 'p-6',
      scene.backgroundClass
    )}>
      <Card className={cn(
        'w-full bg-gray-900/90 backdrop-blur-md border-purple-500/40 shadow-2xl shadow-black/50',
        isSmallScreen ? 'max-w-full mx-2' : 'max-w-3xl',
        className
      )}>
        <CardHeader className="text-center">
          <CardTitle 
            className={cn(
              'font-bold text-white mb-4',
              isSmallScreen ? 'text-2xl' : 'text-3xl'
            )}
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}
          >
            {scene.title}
          </CardTitle>
          {scene.description && (
            <p 
              className={cn(
                'text-gray-200 leading-relaxed',
                isSmallScreen ? 'text-lg' : 'text-xl'
              )}
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
            >
              {scene.description}
            </p>
          )}
        </CardHeader>
        {children && (
          <CardContent className={cn(
            'space-y-6',
            isSmallScreen && 'space-y-4'
          )}>
            {children}
          </CardContent>
        )}
      </Card>
    </div>
  );
};