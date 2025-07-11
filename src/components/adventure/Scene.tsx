import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Scene as SceneType } from './types';

interface SceneProps {
  scene: SceneType;
  children?: ReactNode;
  className?: string;
}

export const Scene = ({ scene, children, className }: SceneProps) => {
  return (
    <div className={cn('min-h-screen flex items-center justify-center p-6', scene.backgroundClass)}>
      <Card className={cn(
        'w-full max-w-3xl bg-gray-900/80 backdrop-blur-sm border-purple-500/30',
        className
      )}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white mb-4">
            {scene.title}
          </CardTitle>
          {scene.description && (
            <p className="text-gray-300 text-lg">
              {scene.description}
            </p>
          )}
        </CardHeader>
        {children && (
          <CardContent className="space-y-6">
            {children}
          </CardContent>
        )}
      </Card>
    </div>
  );
};