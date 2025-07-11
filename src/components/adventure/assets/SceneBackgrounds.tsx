import { cn } from '@/lib/utils';

interface BackgroundProps {
  className?: string;
}

export const ForgeBackground = ({ className }: BackgroundProps) => {
  return (
    <svg viewBox="0 0 800 600" className={cn("w-full h-full", className)} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="forgeHeat" cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#dc2626" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.1" />
        </radialGradient>

        <pattern id="forgeGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="19" height="19" fill="none" stroke="rgba(255, 107, 53, 0.1)" strokeWidth="1" />
        </pattern>

        <filter id="heat">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 1
                                 0 0 0 0 0.2
                                 0 0 0 0 0
                                 0 0 0 1 0" />
        </filter>
      </defs>

      {/* Base */}
      <rect width="800" height="600" fill="#1a0f0a" />
      
      {/* Industrial floor */}
      <rect x="0" y="400" width="800" height="200" fill="#2d1810" />
      <rect x="0" y="400" width="800" height="200" fill="url(#forgeGrid)" />
      
      {/* Forge machinery */}
      <g>
        {/* Left machinery */}
        <rect x="50" y="200" width="150" height="300" fill="#3d2418" />
        <rect x="60" y="220" width="130" height="100" fill="#1a0f0a" />
        <rect x="70" y="230" width="110" height="80" fill="#ff6b35" opacity="0.3" />
        
        {/* Right machinery */}
        <rect x="600" y="200" width="150" height="300" fill="#3d2418" />
        <rect x="610" y="220" width="130" height="100" fill="#1a0f0a" />
        <rect x="620" y="230" width="110" height="80" fill="#ff6b35" opacity="0.3" />
      </g>
      
      {/* Central forge */}
      <ellipse cx="400" cy="450" rx="150" ry="50" fill="url(#forgeHeat)" />
      <rect x="300" y="300" width="200" height="150" fill="#2d1810" />
      <rect x="320" y="320" width="160" height="110" fill="#1a0f0a" />
      <rect x="340" y="340" width="120" height="70" fill="#ff6b35" opacity="0.5" filter="url(#heat)" />
      
      {/* Sparks */}
      {[...Array(30)].map((_, i) => (
        <circle
          key={i}
          cx={350 + Math.random() * 100}
          cy={300 + Math.random() * 150}
          r="1"
          fill="#ffaa00"
          className="animate-float"
          style={{
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
      
      {/* Holographic blueprint */}
      <g transform="translate(400, 150)" opacity="0.7">
        <rect x="-80" y="-60" width="160" height="120" fill="none" stroke="#00ffff" strokeWidth="2" strokeDasharray="5 5" />
        <line x1="-60" y1="-40" x2="60" y2="-40" stroke="#00ffff" strokeWidth="1" opacity="0.5" />
        <line x1="-60" y1="-20" x2="60" y2="-20" stroke="#00ffff" strokeWidth="1" opacity="0.5" />
        <line x1="-60" y1="0" x2="60" y2="0" stroke="#00ffff" strokeWidth="1" opacity="0.5" />
        <line x1="-60" y1="20" x2="60" y2="20" stroke="#00ffff" strokeWidth="1" opacity="0.5" />
        <circle cx="0" cy="0" r="30" fill="none" stroke="#00ffff" strokeWidth="1" strokeDasharray="3 3" />
      </g>
    </svg>
  );
};

export const MissionControlBackground = ({ className }: BackgroundProps) => {
  return (
    <svg viewBox="0 0 800 600" className={cn("w-full h-full", className)} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#001a33" />
          <stop offset="100%" stopColor="#003366" />
        </linearGradient>

        <pattern id="controlGrid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="50" y2="0" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" />
          <line x1="0" y1="0" x2="0" y2="50" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" />
        </pattern>

        <radialGradient id="radarSweep" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Base */}
      <rect width="800" height="600" fill="#0a0f1a" />
      <rect width="800" height="600" fill="url(#controlGrid)" />
      
      {/* Control panels */}
      <g>
        {/* Main screen */}
        <rect x="200" y="50" width="400" height="250" fill="url(#screenGradient)" stroke="#3b82f6" strokeWidth="2" />
        
        {/* Radar display */}
        <circle cx="400" cy="175" r="100" fill="none" stroke="#06b6d4" strokeWidth="2" />
        <circle cx="400" cy="175" r="75" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
        <circle cx="400" cy="175" r="50" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />
        <circle cx="400" cy="175" r="25" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.2" />
        
        {/* Radar sweep */}
        <path d="M 400 175 L 500 175 A 100 100 0 0 1 400 275 Z" fill="url(#radarSweep)" className="animate-spin" style={{ transformOrigin: '400px 175px', animationDuration: '4s' }} />
        
        {/* Side monitors */}
        <rect x="50" y="100" width="120" height="150" fill="url(#screenGradient)" stroke="#3b82f6" strokeWidth="2" />
        <rect x="630" y="100" width="120" height="150" fill="url(#screenGradient)" stroke="#3b82f6" strokeWidth="2" />
      </g>
      
      {/* Control desk */}
      <rect x="0" y="400" width="800" height="200" fill="#1a2332" />
      <rect x="0" y="400" width="800" height="10" fill="#3b82f6" opacity="0.5" />
      
      {/* Button panels */}
      <g>
        {[...Array(5)].map((_, col) => (
          [...Array(3)].map((_, row) => (
            <rect
              key={`${col}-${row}`}
              x={200 + col * 80}
              y={450 + row * 40}
              width="60"
              height="30"
              fill="#001a33"
              stroke="#06b6d4"
              strokeWidth="1"
              className="hover:fill-blue-900"
            />
          ))
        ))}
      </g>
      
      {/* Status lights */}
      {[...Array(20)].map((_, i) => (
        <circle
          key={i}
          cx={100 + (i % 10) * 60}
          cy={350 + Math.floor(i / 10) * 20}
          r="5"
          fill={i % 3 === 0 ? "#10b981" : i % 3 === 1 ? "#f59e0b" : "#06b6d4"}
          className="animate-pulse"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </svg>
  );
};

export const ObservatoryBackground = ({ className }: BackgroundProps) => {
  return (
    <svg viewBox="0 0 800 600" className={cn("w-full h-full", className)} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="nebula1" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
        
        <radialGradient id="nebula2" cx="70%" cy="60%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Deep space */}
      <rect width="800" height="600" fill="#0a0a1f" />
      
      {/* Nebulas */}
      <ellipse cx="240" cy="180" rx="200" ry="150" fill="url(#nebula1)" />
      <ellipse cx="560" cy="360" rx="250" ry="180" fill="url(#nebula2)" />
      
      {/* Stars */}
      {[...Array(100)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 800}
          cy={Math.random() * 600}
          r={Math.random() * 2}
          fill="white"
          opacity={0.5 + Math.random() * 0.5}
          className="animate-twinkle"
          style={{ animationDelay: `${Math.random() * 3}s` }}
        />
      ))}
      
      {/* Observatory structure */}
      <g transform="translate(400, 500)">
        {/* Base */}
        <rect x="-150" y="-50" width="300" height="100" fill="#1a1a3e" />
        
        {/* Dome */}
        <path d="M -150 -50 Q -150 -200, 0 -200 Q 150 -200, 150 -50" fill="#2d2d5e" />
        
        {/* Observatory slit */}
        <rect x="-10" y="-200" width="20" height="150" fill="#0a0a1f" />
        
        {/* Telescope hint */}
        <rect x="-5" y="-150" width="10" height="100" fill="#3d3d6e" />
      </g>
      
      {/* Constellation lines */}
      <g opacity="0.3">
        <line x1="200" y1="100" x2="300" y2="150" stroke="#a855f7" strokeWidth="1" />
        <line x1="300" y1="150" x2="350" y2="120" stroke="#a855f7" strokeWidth="1" />
        <line x1="350" y1="120" x2="400" y2="180" stroke="#a855f7" strokeWidth="1" />
        
        <line x1="500" y1="250" x2="550" y2="200" stroke="#6366f1" strokeWidth="1" />
        <line x1="550" y1="200" x2="600" y2="220" stroke="#6366f1" strokeWidth="1" />
        <line x1="600" y1="220" x2="620" y2="280" stroke="#6366f1" strokeWidth="1" />
      </g>
      
      {/* Shooting stars */}
      <g>
        <line
          x1="100"
          y1="50"
          x2="200"
          y2="100"
          stroke="white"
          strokeWidth="2"
          opacity="0.8"
          className="animate-scroll"
          style={{ animationDuration: '2s' }}
        />
        <line
          x1="600"
          y1="100"
          x2="700"
          y2="150"
          stroke="white"
          strokeWidth="2"
          opacity="0.8"
          className="animate-scroll"
          style={{ animationDuration: '2.5s', animationDelay: '1s' }}
        />
      </g>
    </svg>
  );
};