"use client";

import { useState, useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";

// Animation timing constants
const ANIMATION_TIMINGS = {
  POWERGLOVE_RISE: 1200,
  FLASH_SEQUENCE_START: 1000,
  FLASH_DURATION: 100,
  FLASH_INTERVAL: 100,
  TRANSFORMATION_DELAY: 1600,
  REFRESH_ICON_DELAY: 2600,
  RESET_FLASH_START: 100,
  RESET_COMPLETE: 700,
} as const;

interface InteractiveAvatarProps {
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
}

export const InteractiveAvatar = ({
  className = "",
  width = 384,
  height = 384,
  sizes = "384px",
}: InteractiveAvatarProps) => {
  const [showPixelated, setShowPixelated] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showWhiteFlash, setShowWhiteFlash] = useState(false);
  const [showPowerglove, setShowPowerglove] = useState(false);
  const [isBlockHit, setIsBlockHit] = useState(false);
  const [showRefreshIcon, setShowRefreshIcon] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  // Ref to track timeout IDs for cleanup
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);
  
  // Helper function to create a timeout and track it for cleanup
  const createTimeout = (callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      callback();
      // Remove completed timeout from tracking
      timeoutsRef.current = timeoutsRef.current.filter(id => id !== timeoutId);
    }, delay);
    timeoutsRef.current.push(timeoutId);
    return timeoutId;
  };
  
  // Helper function for triple flash sequence
  const triggerTripleFlash = (startDelay: number = 0, callback?: () => void) => {
    createTimeout(() => setShowWhiteFlash(true), startDelay);
    createTimeout(() => setShowWhiteFlash(false), startDelay + ANIMATION_TIMINGS.FLASH_DURATION);
    createTimeout(() => setShowWhiteFlash(true), startDelay + ANIMATION_TIMINGS.FLASH_INTERVAL * 2);
    createTimeout(() => setShowWhiteFlash(false), startDelay + ANIMATION_TIMINGS.FLASH_INTERVAL * 2 + ANIMATION_TIMINGS.FLASH_DURATION);
    createTimeout(() => setShowWhiteFlash(true), startDelay + ANIMATION_TIMINGS.FLASH_INTERVAL * 4);
    createTimeout(() => {
      setShowWhiteFlash(false);
      if (callback) callback();
    }, startDelay + ANIMATION_TIMINGS.FLASH_INTERVAL * 4 + ANIMATION_TIMINGS.FLASH_DURATION);
  };

  const handleQuestionBlockClick = () => {
    if (showPixelated) return; // Prevent multiple clicks
    
    setIsFlashing(true);
    
    // Hit the block immediately
    setIsBlockHit(true);
    
    // Show powerglove sprite immediately - starts rising
    setShowPowerglove(true);
    
    // Start triple flash sequence after powerglove has risen
    triggerTripleFlash(ANIMATION_TIMINGS.FLASH_SEQUENCE_START, () => {
      setShowPowerglove(false);
    });
    
    // Then reveal pixelated avatar
    createTimeout(() => {
      setShowPixelated(true);
      setIsFlashing(false);
    }, ANIMATION_TIMINGS.TRANSFORMATION_DELAY);
    
    // Show refresh icon after everything is complete
    createTimeout(() => {
      setShowRefreshIcon(true);
    }, ANIMATION_TIMINGS.REFRESH_ICON_DELAY);
  };

  const handleRefreshClick = () => {
    if (isResetting) return; // Prevent multiple clicks
    
    setIsResetting(true);
    setShowRefreshIcon(false);
    
    // Triple flash animation
    triggerTripleFlash(ANIMATION_TIMINGS.RESET_FLASH_START);
    
    // Reset everything after triple flash
    createTimeout(() => {
      setShowPixelated(false);
      setIsBlockHit(false);
      setIsFlashing(false);
      setShowPowerglove(false);
      setIsResetting(false);
    }, ANIMATION_TIMINGS.RESET_COMPLETE);
  };

  return (
    <div className="relative w-fit">
      {/* Gradient border container */}
      <div className="relative p-1 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-xl hover:scale-105 transition-all duration-300">
        {/* Glass morphism inner container */}
        <div 
          className={`relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-2 transition-all duration-200 overflow-hidden ${
            isFlashing ? 'bg-white/20 border-white/30' : ''
          }`}
        >
          <OptimizedImage
            src={
              showPixelated 
                ? "/images/craig-avatar-pixelated.png"
                : "/images/headshot-2025-transparent-avatar.png"
            }
            alt="VibeCTO Avatar"
            width={width}
            height={height}
            priority
            className={`${className} object-cover object-center aspect-square`}
            sizes={sizes}
          />
          
          {/* White flash overlay */}
          {showWhiteFlash && (
            <div 
              className="absolute inset-0 bg-white rounded-lg animate-pulse"
              style={{
                animation: 'dramatic-flash 300ms ease-out'
              }}
            />
          )}
          
          {/* Powerglove sprite - rises from behind question block */}
          {showPowerglove && (
            <div 
              className="absolute bottom-1 right-2 w-1/6 pointer-events-none overflow-visible"
              style={{
                animation: `powerglove-rise ${ANIMATION_TIMINGS.POWERGLOVE_RISE}ms ease-out`,
                zIndex: 1,
                transformOrigin: 'center bottom'
              }}
            >
              <OptimizedImage
                src="/images/powerglove-sprite.png"
                alt="Powerglove activation"
                width={120}
                height={120}
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          )}

          {/* Question block overlay - always visible, bottom right, overlapping the image */}
          <div 
            className="absolute bottom-1 right-1 w-1/4 cursor-pointer hover:scale-110 transition-transform duration-200 overflow-hidden rounded"
            onClick={showRefreshIcon ? handleRefreshClick : handleQuestionBlockClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                showRefreshIcon ? handleRefreshClick() : handleQuestionBlockClick();
              }
            }}
            style={{
              animation: showPixelated && !showRefreshIcon ? 'none' : 'subtle-bounce 2s ease-in-out infinite',
              zIndex: 2
            }}
          >
            <OptimizedImage
              src={
                isBlockHit 
                  ? "/images/vibe-cto-question-block-hit.png"
                  : "/images/vibe-cto-question-block-v3.png"
              }
              alt="Question block - click to reveal pixelated avatar"
              width={100}
              height={100}
              className="w-full h-auto drop-shadow-lg"
            />
            {/* Refresh icon - centered in the block when shown */}
            {showRefreshIcon && (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw 
                  className="w-1/2 h-1/2 text-white drop-shadow-lg animate-pulse"
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))'
                  }}
                />
              </div>
            )}
            
            {/* Glint effect - only when not pixelated and no refresh icon */}
            {!showPixelated && !showRefreshIcon && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
                style={{
                  animation: 'glint 4s ease-in-out infinite',
                  animationDelay: '1s'
                }}
              />
            )}
            <style jsx>{`
              @keyframes subtle-bounce {
                0%, 20%, 50%, 80%, 100% {
                  transform: translateY(0);
                }
                40% {
                  transform: translateY(-4px);
                }
                60% {
                  transform: translateY(-2px);
                }
              }
              @keyframes glint {
                0%, 90%, 100% {
                  transform: translateX(-100%);
                  opacity: 0;
                }
                50% {
                  transform: translateX(100%);
                  opacity: 1;
                }
              }
              @keyframes dramatic-flash {
                0% {
                  opacity: 0;
                }
                50% {
                  opacity: 0.9;
                }
                100% {
                  opacity: 0;
                }
              }
              @keyframes powerglove-rise {
                0% {
                  transform: translateY(50%);
                  opacity: 0;
                  scale: 0.7;
                }
                20% {
                  transform: translateY(20%);
                  opacity: 0.4;
                  scale: 0.8;
                }
                40% {
                  transform: translateY(-20%);
                  opacity: 0.7;
                  scale: 0.9;
                }
                60% {
                  transform: translateY(-60%);
                  opacity: 0.9;
                  scale: 0.95;
                }
                80% {
                  transform: translateY(-100%);
                  opacity: 1;
                  scale: 1.05;
                }
                100% {
                  transform: translateY(-120%);
                  opacity: 1;
                  scale: 1;
                }
              }
              
              /* Respect user's motion preferences */
              @media (prefers-reduced-motion: reduce) {
                * {
                  animation-duration: 0.01ms !important;
                  animation-iteration-count: 1 !important;
                  transition-duration: 0.01ms !important;
                  scroll-behavior: auto !important;
                }
                
                /* Keep essential visual feedback but make it instant */
                .animate-pulse {
                  animation: none;
                }
              }
            `}</style>
          </div>
        </div>
      </div>
      
      {/* Glow effect behind avatar */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-2xl -z-10 scale-125"></div>
    </div>
  );
};