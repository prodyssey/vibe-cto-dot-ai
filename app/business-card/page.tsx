"use client";

import { useState } from "react";
import { LinkedinIcon, Mail, UserPlus, Sparkles, Gamepad2, X } from "lucide-react";
import { InteractiveAvatar } from "@/components/InteractiveAvatar";
import { EmailOptIn } from "@/components/EmailOptIn";
import { BreakoutGame } from "@/components/BreakoutGame";

export default function BusinessCardPage() {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  // Generate retro particles for button clicks
  const generateParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
    }));
    setParticles(prev => [...prev, ...newParticles]);

    // Clean up particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 1000);
  };

  // Handle button clicks with retro animations
  const handleButtonClick = (buttonId: string, event: React.MouseEvent) => {
    setActiveButton(buttonId);
    const rect = event.currentTarget.getBoundingClientRect();
    generateParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

    // Reset button state after animation
    setTimeout(() => setActiveButton(null), 600);

    // Handle specific button actions
    switch (buttonId) {
      case 'linkedin':
        window.open('https://www.linkedin.com/in/craigsturgis/', '_blank');
        break;
      case 'vcard':
        downloadVCard();
        break;
      case 'email':
        setShowEmailForm(!showEmailForm);
        break;
      case 'game':
        setShowGame(true);
        setShowEmailForm(false);
        break;
    }
  };

  // Download vCard
  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Craig Sturgis
TITLE:Founder & AI-Augmented CTO
ORG:VibeCTO.ai
URL:https://vibecto.ai
EMAIL:craig@vibecto.ai
TEL:+1-610-7916
NOTE:Get human help to build effectively with AI
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'craig-sturgis.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div className="w-1 h-1 bg-white rounded-full opacity-50" />
          </div>
        ))}
      </div>

      {/* Particle effects container */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-particle-burst"
            style={{
              left: particle.x,
              top: particle.y,
              '--angle': `${Math.random() * 360}deg`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Glass card container */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
          {/* Header with title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Craig Sturgis
            </h1>
            <p className="text-gray-300 text-sm">
              Founder, former exec, augmented product engineer
            </p>
            <p className="text-gray-400 text-xs mt-1">
              <a href="https://vibecto.ai">VibeCTO.ai</a>
            </p>
          </div>

          {/* Interactive Avatar */}
          <div className="flex justify-center mb-8">
            <div className="transform scale-90 sm:scale-100">
              <InteractiveAvatar
                className="w-64 h-64"
                width={256}
                height={256}
                sizes="256px"
              />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-center text-gray-200 mb-8 text-sm italic">
            Get human help to build effectively with AI.
          </p>
          <p className="text-center text-gray-200 mb-8 text-sm italic">
            Tools, processes, and ways to measure impact.
          </p>

          {/* Action buttons with retro game styling */}
          <div className="space-y-3">
            {/* LinkedIn Button */}
            <button
              onClick={(e) => handleButtonClick('linkedin', e)}
              className={`w-full py-4 px-6 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                activeButton === 'linkedin'
                  ? 'bg-blue-600 border-blue-400 animate-pulse'
                  : 'bg-blue-600/20 border-blue-500/50 hover:bg-blue-600/40 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <LinkedinIcon className="w-5 h-5 text-blue-300" />
                <span className="text-white font-semibold">Connect on LinkedIn</span>
                {activeButton === 'linkedin' && (
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                )}
              </div>
            </button>

            {/* vCard Button */}
            <button
              onClick={(e) => handleButtonClick('vcard', e)}
              className={`w-full py-4 px-6 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                activeButton === 'vcard'
                  ? 'bg-green-600 border-green-400 animate-pulse'
                  : 'bg-green-600/20 border-green-500/50 hover:bg-green-600/40 hover:border-green-400'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <UserPlus className="w-5 h-5 text-green-300" />
                <span className="text-white font-semibold">Save Contact</span>
                {activeButton === 'vcard' && (
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                )}
              </div>
            </button>

            {/* Email List Button */}
            <button
              onClick={(e) => handleButtonClick('email', e)}
              className={`w-full py-4 px-6 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                showEmailForm
                  ? 'bg-purple-600/40 border-purple-400'
                  : activeButton === 'email'
                  ? 'bg-purple-600 border-purple-400'
                  : 'bg-purple-600/20 border-purple-500/50 hover:bg-purple-600/40 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <Mail className="w-5 h-5 text-purple-300" />
                <span className="text-white font-semibold">Join Mailing List</span>
                {activeButton === 'email' && (
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                )}
              </div>
            </button>

            {/* Email form (slides down when toggled) */}
            {showEmailForm && (
              <div className="animate-slide-in">
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <EmailOptIn
                    variant="minimal"
                    source="business-card"
                    tags={["business-card"]}
                    buttonText="Subscribe 🚀"
                    mobileButtonText="Join"
                    onSuccess={() => {
                      setTimeout(() => setShowEmailForm(false), 3000);
                    }}
                    className="!p-0"
                  />
                </div>
              </div>
            )}

            {/* Secret Game Button - appears subtly */}
            <button
              onClick={(e) => handleButtonClick('game', e)}
              className={`w-full py-4 px-6 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                activeButton === 'game'
                  ? 'bg-green-600 border-green-400'
                  : 'bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30 hover:border-green-400/60'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <Gamepad2 className="w-5 h-5 text-green-300" />
                <span className="text-white font-semibold">
                  Break Some Blocks 🎮
                </span>
                {activeButton === 'game' && (
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                )}
              </div>
            </button>
          </div>

          {/* Footer with retro game text */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 font-mono">
              SEE YOU NEXT MISSION
            </p>
          </div>
        </div>
      </div>

      {/* Game Modal Overlay */}
      {showGame && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setShowGame(false)}
            className="absolute top-4 right-4 z-[110] p-2 bg-gray-800/80 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close game"
          >
            <X className="w-6 h-6 text-gray-300" />
          </button>

          {/* Game container */}
          <div className="w-full max-w-2xl animate-scale-in">
            <BreakoutGame
              onScoreUpdate={setGameScore}
              // onGameComplete={(finalScore) => {
              //   if (finalScore > 2399) {
              //     // Easter egg for high scorers
              //     setTimeout(() => {
              //       alert("🎮 Elite gamer detected! You've unlocked the secret: Use code VIBEBREAKER2400 for 10% off your first sprint!");
              //     }, 500);
              //   }
              // }}
            />
            {gameScore > 0 && (
              <p className="text-center text-sm text-gray-400 mt-4">
                Current Vibe Level: {gameScore}
              </p>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes particle-burst {
          0% {
            transform: translate(0, 0) rotate(var(--angle)) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(0, -100px) rotate(var(--angle)) translateX(50px) scale(0);
            opacity: 0;
          }
        }

        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }

        .animate-particle-burst {
          animation: particle-burst 1s ease-out forwards;
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}