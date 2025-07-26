import { cn } from '@/lib/utils';

interface ParticleEffectsProps {
  className?: string;
  type?: 'sparks' | 'stars' | 'energy' | 'data';
  count?: number;
}

export const ParticleEffects = ({ 
  className, 
  type = 'sparks', 
  count = 20 
}: ParticleEffectsProps) => {
  const getParticleComponent = (i: number) => {
    const baseStyle = {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    };

    switch (type) {
      case 'sparks':
        return (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-float"
            style={baseStyle}
          />
        );
      
      case 'stars':
        return (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              ...baseStyle,
              opacity: 0.5 + Math.random() * 0.5,
            }}
          />
        );
      
      case 'energy':
        return (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"
            style={baseStyle}
          />
        );
      
      case 'data':
        return (
          <div
            key={i}
            className="absolute text-xs font-mono text-cyan-300 opacity-30 animate-scroll"
            style={baseStyle}
          >
            {['01', '10', '11', '00'][Math.floor(Math.random() * 4)]}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {[...Array(count)].map((_, i) => getParticleComponent(i))}
    </div>
  );
};

export const WarpLines = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-scroll"
          style={{
            left: '0',
            right: '0',
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export const FloatingIcons = ({ 
  className, 
  icons,
  count = 10 
}: { 
  className?: string;
  icons: React.ReactNode[];
  count?: number;
}) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute text-purple-400 opacity-20 animate-float"
          style={{
            left: `${15 + (i % 3) * 35}%`,
            top: `${20 + Math.floor(i / 3) * 40}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${8 + i}s`,
          }}
        >
          {icons[i % icons.length]}
        </div>
      ))}
    </div>
  );
};