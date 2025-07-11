import { cn } from '@/lib/utils';

interface CharacterProps {
  className?: string;
  isWalking?: boolean;
}

export const FounderSprite = ({ className, isWalking = false }: CharacterProps) => {
  return (
    <svg viewBox="0 0 32 48" className={cn("w-8 h-12", className)}>
      <defs>
        <pattern id="shirt" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#1a1a3e" />
          <rect width="2" height="2" fill="#2a2a4e" />
        </pattern>
      </defs>
      
      {/* Head */}
      <rect x="10" y="4" width="12" height="12" fill="#ffdbac" />
      <rect x="8" y="6" width="16" height="8" fill="#8b4513" /> {/* Hair */}
      
      {/* Eyes */}
      <rect x="12" y="9" width="2" height="2" fill="#000" />
      <rect x="18" y="9" width="2" height="2" fill="#000" />
      
      {/* Body */}
      <rect x="8" y="16" width="16" height="20" fill="url(#shirt)" />
      
      {/* Arms */}
      <rect x="4" y="18" width="4" height="16" fill="#ffdbac" />
      <rect x="24" y="18" width="4" height="16" fill="#ffdbac" />
      
      {/* Legs */}
<rect 
        x={isWalking ? "11" : "10"} 
        y="36" 
        width="4" 
        height="12" 
        fill="#1a1a3e"
        className={isWalking ? "animate-pulse" : ""}
      />
      <rect 
        x={isWalking ? "17" : "18"} 
        y="36" 
        width="4" 
        height="12" 
        fill="#1a1a3e"
        className={isWalking ? "animate-pulse" : ""}
      />
      
      {/* Device/laptop */}
      <rect x="6" y="20" width="8" height="6" fill="#333" />
      <rect x="7" y="21" width="6" height="4" fill="#00ff00" opacity="0.5" />
    </svg>
  );
};

export const EngineerSprite = ({ className, isWalking = false }: CharacterProps) => {
  return (
    <svg viewBox="0 0 32 48" className={cn("w-8 h-12", className)}>
      {/* Head */}
      <rect x="10" y="4" width="12" height="12" fill="#ffdbac" />
      <rect x="8" y="4" width="16" height="6" fill="#2d1b69" /> {/* Hair */}
      
      {/* Glasses */}
      <rect x="10" y="8" width="5" height="5" fill="none" stroke="#333" strokeWidth="1" />
      <rect x="17" y="8" width="5" height="5" fill="none" stroke="#333" strokeWidth="1" />
      <line x1="15" y1="10" x2="17" y2="10" stroke="#333" strokeWidth="1" />
      
      {/* Body */}
      <rect x="8" y="16" width="16" height="20" fill="#4a90e2" />
      
      {/* Arms */}
      <rect x="4" y="18" width="4" height="16" fill="#ffdbac" />
      <rect x="24" y="18" width="4" height="16" fill="#ffdbac" />
      
      {/* Legs */}
      <rect 
        x={isWalking ? "11" : "10"} 
        y="36" 
        width="4" 
        height="12" 
        fill="#333"
        className={isWalking ? "animate-pulse" : ""}
      />
      <rect 
        x={isWalking ? "17" : "18"} 
        y="36" 
        width="4" 
        height="12" 
        fill="#333"
        className={isWalking ? "animate-pulse" : ""}
      />
      
      {/* Tools */}
      <rect x="26" y="22" width="2" height="8" fill="#ff6b35" />
    </svg>
  );
};

export const WalkingFounders = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative", className)}>
      {/* Walking animation container */}
      <div className="flex space-x-8 animate-scroll" style={{ animationDuration: '15s' }}>
        <FounderSprite isWalking />
        <EngineerSprite isWalking />
        <FounderSprite isWalking />
      </div>
    </div>
  );
};