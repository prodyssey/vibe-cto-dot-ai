"use client";

import { useState } from "react";
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

  const handleQuestionBlockClick = () => {
    setIsFlashing(true);
    setTimeout(() => {
      setShowPixelated(true);
      setIsFlashing(false);
    }, 200);
  };

  return (
    <div className="relative w-fit">
      {/* Gradient border container */}
      <div className="relative p-1 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-xl hover:scale-105 transition-all duration-300">
        {/* Glass morphism inner container */}
        <div 
          className={`relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-2 transition-all duration-200 ${
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
            className={`${className} ${
              showPixelated 
                ? 'object-cover object-center' 
                : 'object-cover object-center'
            }`}
            sizes={sizes}
          />
          
          {/* Question block overlay - always visible, bottom right, overlapping the image */}
          <div 
            className="absolute bottom-1 right-1 w-1/4 cursor-pointer hover:scale-110 transition-transform duration-200 overflow-hidden rounded"
            onClick={handleQuestionBlockClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleQuestionBlockClick();
              }
            }}
            style={{
              animation: showPixelated ? 'none' : 'subtle-bounce 2s ease-in-out infinite'
            }}
          >
            <OptimizedImage
              src="/images/vibe-cto-question-block-v3.png"
              alt="Question block - click to reveal pixelated avatar"
              width={100}
              height={100}
              className="w-full h-auto drop-shadow-lg"
            />
            {/* Glint effect - only when not pixelated */}
            {!showPixelated && (
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
            `}</style>
          </div>
        </div>
      </div>
      
      {/* Glow effect behind avatar */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-2xl -z-10 scale-125"></div>
    </div>
  );
};