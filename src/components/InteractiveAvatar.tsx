"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";

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

  const handleQuestionBlockClick = () => {
    if (showPixelated) {return;} // Prevent multiple clicks
    
    setIsFlashing(true);
    
    // Hit the block immediately
    setIsBlockHit(true);
    
    // Show powerglove sprite immediately - starts rising
    setShowPowerglove(true);
    
    // Start white flash after powerglove has risen (give it time to complete)
    setTimeout(() => {
      setShowWhiteFlash(true);
    }, 1000);
    
    // End the white flash and hide powerglove
    setTimeout(() => {
      setShowWhiteFlash(false);
      setShowPowerglove(false);
    }, 1300);
    
    // Then reveal pixelated avatar
    setTimeout(() => {
      setShowPixelated(true);
      setIsFlashing(false);
    }, 1400);
    
    // Show refresh icon after everything is complete
    setTimeout(() => {
      setShowRefreshIcon(true);
    }, 1600);
  };

  const handleRefreshClick = () => {
    if (isResetting) {return;} // Prevent multiple clicks
    
    setIsResetting(true);
    setShowRefreshIcon(false);
    
    // Flash animation
    setTimeout(() => {
      setShowWhiteFlash(true);
    }, 100);
    
    // End flash and reset everything
    setTimeout(() => {
      setShowWhiteFlash(false);
      setShowPixelated(false);
      setIsBlockHit(false);
      setIsFlashing(false);
      setShowPowerglove(false);
      setIsResetting(false);
    }, 400);
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
                animation: 'powerglove-rise 1200ms ease-out',
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
            `}</style>
          </div>
        </div>
      </div>
      
      {/* Glow effect behind avatar */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-2xl -z-10 scale-125"></div>
    </div>
  );
};