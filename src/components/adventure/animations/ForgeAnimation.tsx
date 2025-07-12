import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface ForgeAnimationProps {
  className?: string;
  isActive?: boolean;
}

export const ForgeAnimation = ({ className, isActive = true }: ForgeAnimationProps) => {
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSparks(prev => {
        const newSparks = [...prev];
        
        // Add new spark
        if (newSparks.length < 15) {
          newSparks.push({
            id: Date.now() + Math.random(),
            x: 45 + Math.random() * 10,
            y: 70 + Math.random() * 5,
          });
        }
        
        // Remove old sparks
        return newSparks.filter((spark, index) => index > newSparks.length - 15);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={cn('relative w-full h-64', className)}>
      {/* Forge Base */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-24 bg-gradient-to-t from-gray-800 to-gray-700 rounded-t-lg">
        {/* Forge Opening */}
        <div className="absolute top-2 left-2 right-2 h-8 bg-gradient-to-b from-orange-600 to-red-600 rounded animate-pulse" />
      </div>
      
      {/* Anvil */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 translate-x-16 w-16 h-8 bg-gray-900 rounded-sm" />
      
      {/* Hammer */}
      <div 
        className={cn(
          "absolute bottom-14 left-1/2 transform -translate-x-1/2 translate-x-16",
          isActive && "animate-bounce"
        )}
        style={{ animationDuration: '1.5s' }}
      >
        <div className="w-3 h-12 bg-gray-700 rounded-sm">
          <div className="w-6 h-6 bg-gray-800 rounded -ml-1.5" />
        </div>
      </div>
      
      {/* Sparks */}
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="absolute w-1 h-1 bg-orange-400 rounded-full animate-ping"
          style={{
            left: `${spark.x}%`,
            bottom: `${spark.y}%`,
            animationDuration: '1s',
          }}
        />
      ))}
      
      {/* Heat Glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-32 opacity-30">
        <div className="w-full h-full bg-gradient-to-t from-orange-500 to-transparent blur-2xl animate-pulse" />
      </div>
    </div>
  );
};