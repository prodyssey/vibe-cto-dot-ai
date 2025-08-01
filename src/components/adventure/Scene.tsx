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
      {/* Fixed viewport container to prevent width changes */}
      <div className={cn(
        'w-full flex justify-center',
        isSmallScreen ? 'min-w-[320px] max-w-full px-2' : 'min-w-[600px] max-w-3xl lg:max-w-5xl'
      )}>
        <Card className={cn(
          'w-full bg-gray-900/90 backdrop-blur-md border-purple-500/40 shadow-2xl shadow-black/50',
          className
        )}>
        <CardHeader className="text-center">
          <CardTitle 
            className={cn(
              'font-bold text-white mb-4',
              isSmallScreen ? 'text-2xl' : 'text-3xl lg:text-4xl'
            )}
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}
          >
            {scene.title}
          </CardTitle>
          {scene.description && (
            <p 
              className={cn(
                'text-gray-200 leading-relaxed',
                isSmallScreen ? 'text-lg' : 'text-xl lg:text-2xl'
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
    </div>
  );
};