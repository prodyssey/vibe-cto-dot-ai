import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { useReducedMotion } from '../hooks';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  lifetime: number;
}

interface ParticleEffectProps {
  trigger?: boolean;
  count?: number;
  duration?: number;
  colors?: string[];
  spread?: number;
  gravity?: number;
  className?: string;
  onComplete?: () => void;
}

export const ParticleEffect = ({
  trigger = false,
  count = 20,
  duration = 1000,
  colors = ['#a78bfa', '#60a5fa', '#34d399'],
  spread = 50,
  gravity = 0.1,
  className,
  onComplete,
}: ParticleEffectProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (trigger && !prefersReducedMotion) {
      // Create initial particles
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const velocity = 2 + Math.random() * spread / 10;
        
        newParticles.push({
          id: i,
          x: 50,
          y: 50,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 2,
          size: 4 + Math.random() * 4,
          opacity: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          lifetime: duration,
        });
      }
      
      setParticles(newParticles);
      startTimeRef.current = performance.now();

      // Start animation
      const animate = (currentTime: number) => {
        if (!startTimeRef.current) {
          return;
        }
        
        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        setParticles(prevParticles =>
          prevParticles.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy + gravity * elapsed / 100,
            opacity: 1 - progress,
            size: particle.size * (1 - progress * 0.5),
          }))
        );

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setParticles([]);
          onComplete?.();
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [trigger, count, duration, colors, spread, gravity, prefersReducedMotion, onComplete]);

  if (prefersReducedMotion || particles.length === 0) {
    return null;
  }

  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  );
};