import { cn } from '@/lib/utils';

interface PortalProps {
  className?: string;
  isActive?: boolean;
  reducedMotion?: boolean;
}

export const IgnitionPortal = ({ className, isActive = false, reducedMotion = false }: PortalProps) => {
  return (
    <svg viewBox="0 0 200 200" className={cn("w-full h-full", className)}>
      <defs>
        <radialGradient id="ignitionGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#f7931e" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0.2" />
        </radialGradient>
        
        <filter id="ignitionGlow">
          <feGaussianBlur stdDeviation="4" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <pattern id="ignitionPixels" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill="rgba(255, 107, 53, 0.1)" />
        </pattern>
      </defs>

      {/* Outer ring */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="#ff6b35"
        strokeWidth="4"
        opacity="0.5"
        className={isActive ? "animate-pulse" : ""}
      />
      
      {/* Energy field */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="url(#ignitionGradient)"
        filter="url(#ignitionGlow)"
        className={isActive ? "animate-pulse" : ""}
      />
      
      {/* Pixel overlay */}
      <circle cx="100" cy="100" r="80" fill="url(#ignitionPixels)" />
      
      {/* Inner rings */}
      {[60, 40, 20].map((r, i) => (
        <circle
          key={r}
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="#ff6b35"
          strokeWidth="2"
          opacity={0.3 + i * 0.2}
          strokeDasharray="10 5"
          className={isActive ? "animate-spin" : ""}
          style={{
            animationDuration: `${10 - i * 2}s`,
            animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
          }}
        />
      ))}
      
      {/* Center core */}
      <circle cx="100" cy="100" r="15" fill="#ff6b35" opacity="0.8" />
      <circle cx="100" cy="100" r="10" fill="#fff" opacity="0.9" />
      
      {/* Energy particles */}
      {isActive && [...Array(8)].map((_, i) => {
        const angle = (i * 45) * Math.PI / 180;
        const x = 100 + 50 * Math.cos(angle);
        const y = 100 + 50 * Math.sin(angle);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill="#ff6b35"
            className="animate-ping"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        );
      })}
    </svg>
  );
};

export const LaunchControlPortal = ({ className, isActive = false }: PortalProps) => {
  return (
    <svg viewBox="0 0 200 200" className={cn("w-full h-full", className)}>
      <defs>
        <radialGradient id="launchGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
        </radialGradient>
        
        <filter id="launchGlow">
          <feGaussianBlur stdDeviation="4" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <pattern id="launchGrid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Hexagonal frame */}
      <polygon
        points="100,20 170,60 170,140 100,180 30,140 30,60"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="4"
        opacity="0.5"
        className={isActive ? "animate-pulse" : ""}
      />
      
      {/* Energy field */}
      <polygon
        points="100,30 160,65 160,135 100,170 40,135 40,65"
        fill="url(#launchGradient)"
        filter="url(#launchGlow)"
        className={isActive ? "animate-pulse" : ""}
      />
      
      {/* Grid overlay */}
      <polygon
        points="100,30 160,65 160,135 100,170 40,135 40,65"
        fill="url(#launchGrid)"
      />
      
      {/* Tech rings */}
      <circle
        cx="100"
        cy="100"
        r="50"
        fill="none"
        stroke="#06b6d4"
        strokeWidth="2"
        strokeDasharray="5 3"
        className={isActive ? "animate-spin" : ""}
        style={{ animationDuration: '8s' }}
      />
      <circle
        cx="100"
        cy="100"
        r="35"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeDasharray="8 2"
        className={isActive ? "animate-spin" : ""}
        style={{ animationDuration: '6s', animationDirection: 'reverse' }}
      />
      
      {/* Center core */}
      <circle cx="100" cy="100" r="20" fill="#3b82f6" opacity="0.8" />
      <circle cx="100" cy="100" r="15" fill="#06b6d4" opacity="0.9" />
      <circle cx="100" cy="100" r="10" fill="#fff" opacity="0.9" />
      
      {/* Data streams */}
      {isActive && [...Array(6)].map((_, i) => {
        const angle = (i * 60) * Math.PI / 180;
        return (
          <line
            key={i}
            x1="100"
            y1="100"
            x2={100 + 70 * Math.cos(angle)}
            y2={100 + 70 * Math.sin(angle)}
            stroke="#06b6d4"
            strokeWidth="2"
            opacity="0.6"
            strokeDasharray="5 5"
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        );
      })}
    </svg>
  );
};

export const InterstellarPortal = ({ className, isActive = false }: PortalProps) => {
  return (
    <svg viewBox="0 0 200 200" className={cn("w-full h-full", className)}>
      <defs>
        <radialGradient id="stellarGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
          <stop offset="30%" stopColor="#6366f1" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
        </radialGradient>
        
        <filter id="stellarGlow">
          <feGaussianBlur stdDeviation="5" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <pattern id="stars" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1" fill="white" opacity="0.8" />
          <circle cx="25" cy="15" r="1" fill="white" opacity="0.6" />
          <circle cx="40" cy="30" r="1" fill="white" opacity="0.9" />
          <circle cx="15" cy="40" r="1" fill="white" opacity="0.7" />
          <circle cx="35" cy="45" r="1" fill="white" opacity="0.5" />
        </pattern>
      </defs>

      {/* Outer nebula */}
      <ellipse
        cx="100"
        cy="100"
        rx="90"
        ry="85"
        fill="url(#stellarGradient)"
        filter="url(#stellarGlow)"
        className={isActive ? "animate-pulse" : ""}
      />
      
      {/* Star field */}
      <ellipse cx="100" cy="100" rx="85" ry="80" fill="url(#stars)" opacity="0.6" />
      
      {/* Spiral arms */}
      {[0, 120, 240].map((rotation) => (
        <path
          key={rotation}
          d="M 100 100 Q 130 80, 150 100 T 180 120"
          fill="none"
          stroke="#a855f7"
          strokeWidth="3"
          opacity="0.4"
          transform={`rotate(${rotation} 100 100)`}
          className={isActive ? "animate-spin" : ""}
          style={{ 
            animationDuration: '20s',
            transformOrigin: '100px 100px',
          }}
        />
      ))}
      
      {/* Energy rings */}
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="2"
        opacity="0.5"
        strokeDasharray="15 5"
        className={isActive ? "animate-spin" : ""}
        style={{ animationDuration: '15s' }}
      />
      <circle
        cx="100"
        cy="100"
        r="40"
        fill="none"
        stroke="#6366f1"
        strokeWidth="2"
        opacity="0.5"
        strokeDasharray="10 10"
        className={isActive ? "animate-spin" : ""}
        style={{ animationDuration: '10s', animationDirection: 'reverse' }}
      />
      
      {/* Quantum core */}
      <circle cx="100" cy="100" r="25" fill="#8b5cf6" opacity="0.6" />
      <circle cx="100" cy="100" r="20" fill="#a855f7" opacity="0.8" />
      <circle cx="100" cy="100" r="15" fill="#6366f1" opacity="0.9" />
      <circle cx="100" cy="100" r="10" fill="#fff" opacity="0.9" />
      
      {/* Constellation points */}
      {isActive && [...Array(8)].map((_, i) => {
        const angle = (i * 45) * Math.PI / 180;
        const r = 40 + Math.random() * 30;
        const x = 100 + r * Math.cos(angle);
        const y = 100 + r * Math.sin(angle);
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r="2"
              fill="#a855f7"
              className="animate-twinkle"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
            {i > 0 && (
              <line
                x1={100 + (r - 10) * Math.cos((i - 1) * 45 * Math.PI / 180)}
                y1={100 + (r - 10) * Math.sin((i - 1) * 45 * Math.PI / 180)}
                x2={x}
                y2={y}
                stroke="#6366f1"
                strokeWidth="1"
                opacity="0.3"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};