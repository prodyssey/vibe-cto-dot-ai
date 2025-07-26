import { cn } from '@/lib/utils';

interface UIElementProps {
  className?: string;
  children?: React.ReactNode;
}

export const PixelButton = ({ className, children }: UIElementProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      <svg
        viewBox="0 0 200 60"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="buttonPixels" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="3" height="3" fill="rgba(0, 255, 255, 0.05)" />
          </pattern>
        </defs>
        
        {/* Button shape with pixel corners */}
        <path
          d="M 10 0 L 190 0 L 200 10 L 200 50 L 190 60 L 10 60 L 0 50 L 0 10 Z"
          fill="#1a1a2e"
          stroke="#00ffff"
          strokeWidth="2"
        />
        <path
          d="M 10 0 L 190 0 L 200 10 L 200 50 L 190 60 L 10 60 L 0 50 L 0 10 Z"
          fill="url(#buttonPixels)"
        />
      </svg>
      <div className="relative px-8 py-3 text-center">
        {children}
      </div>
    </div>
  );
};

export const TerminalWindow = ({ className, children }: UIElementProps) => {
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="terminalBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#001a1a" />
            <stop offset="100%" stopColor="#003333" />
          </linearGradient>
          
          <pattern id="scanlines" x="0" y="0" width="100" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(0, 255, 255, 0.1)" strokeWidth="1" />
          </pattern>
        </defs>
        
        {/* Terminal frame */}
        <rect x="0" y="0" width="400" height="300" fill="#1a1a2e" stroke="#00ffff" strokeWidth="2" />
        
        {/* Terminal header */}
        <rect x="0" y="0" width="400" height="30" fill="#2a2a3e" />
        <circle cx="20" cy="15" r="5" fill="#ff5555" />
        <circle cx="40" cy="15" r="5" fill="#ffff55" />
        <circle cx="60" cy="15" r="5" fill="#55ff55" />
        
        {/* Terminal content area */}
        <rect x="2" y="32" width="396" height="266" fill="url(#terminalBg)" />
        <rect x="2" y="32" width="396" height="266" fill="url(#scanlines)" opacity="0.5" />
      </svg>
      <div className="relative pt-10 px-4 pb-4 font-mono text-sm">
        {children}
      </div>
    </div>
  );
};

export const HolographicDisplay = ({ className, children }: UIElementProps) => {
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 300 200"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#ff00ff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0.2" />
          </linearGradient>
          
          <filter id="holoGlow">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        
        {/* Holographic frame */}
        <rect x="10" y="10" width="280" height="180" fill="none" stroke="#00ffff" strokeWidth="2" strokeDasharray="10 5" opacity="0.8" />
        <rect x="5" y="5" width="290" height="190" fill="none" stroke="#ff00ff" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
        
        {/* Holographic effect */}
        <rect x="10" y="10" width="280" height="180" fill="url(#holoGradient)" filter="url(#holoGlow)" />
        
        {/* Grid lines */}
        {[...Array(9)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="10"
            y1={30 + i * 20}
            x2="290"
            y2={30 + i * 20}
            stroke="#00ffff"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
        {[...Array(13)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={30 + i * 20}
            y1="10"
            x2={30 + i * 20}
            y2="190"
            stroke="#00ffff"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
      </svg>
      <div className="relative p-6">
        {children}
      </div>
    </div>
  );
};

export const PixelBorder = ({ className, children }: UIElementProps) => {
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Pixel corner style border */}
        <path
          d="M 5 0 L 95 0 L 100 5 L 100 95 L 95 100 L 5 100 L 0 95 L 0 5 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-cyan-400"
        />
      </svg>
      <div className="relative p-4">
        {children}
      </div>
    </div>
  );
};

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 50 50"
      className={cn("w-8 h-8 animate-spin", className)}
    >
      <defs>
        <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ffff" />
          <stop offset="100%" stopColor="#ff00ff" />
        </linearGradient>
      </defs>
      
      {/* Pixel-style spinner */}
      <rect x="20" y="5" width="10" height="10" fill="url(#spinnerGradient)" opacity="0.8" />
      <rect x="35" y="10" width="10" height="10" fill="url(#spinnerGradient)" opacity="0.7" />
      <rect x="40" y="25" width="10" height="10" fill="url(#spinnerGradient)" opacity="0.6" />
      <rect x="35" y="40" width="10" height="10" fill="url(#spinnerGradient)" opacity="0.5" />
      <rect x="20" y="45" width="10" height="10" fill="url(#spinnerGradient)" opacity="0.4" />
      <rect x="5" y="40" width="10" height="10" fill="url(#spinnerGradient)" opacity="0.3" />
      <rect x="0" y="25" width="10" height="10" fill="url(#spinnerGradient)" opacity="0.2" />
      <rect x="5" y="10" width="10" height="10" fill="url(#spinnerGradient)" opacity="0.1" />
    </svg>
  );
};