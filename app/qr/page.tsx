"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { Sparkles, Gamepad2, Download } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function QRCodePage() {
  const [url, setUrl] = useState("");
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Get the current domain
    const baseUrl = typeof window !== "undefined"
      ? window.location.origin
      : "https://vibecto.ai";

    setUrl(`${baseUrl}/business-card`);
  }, []);

  // Toggle animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAnimation((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) {
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "vibecto-business-card-qr.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
              } opacity-30`}
            />
          </div>
        ))}

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Sparkles className={`w-8 h-8 text-yellow-400 ${showAnimation ? 'animate-spin' : ''}`} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              VibeCTO.ai
            </h1>
            <Gamepad2 className={`w-8 h-8 text-green-400 ${showAnimation ? 'animate-bounce' : ''}`} />
          </div>

          <p className="text-gray-300 text-lg mb-2">
            Scan to Connect
          </p>
          <p className="text-gray-500 text-sm">
            Interactive business card with a surprise 🎮
          </p>
        </div>

        {/* QR Code Container */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl scale-110"></div>

          {/* QR Code Card */}
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-purple-400 rounded-tl-xl"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-purple-400 rounded-tr-xl"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-purple-400 rounded-bl-xl"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-purple-400 rounded-br-xl"></div>

            {/* QR Code */}
            <div className="bg-white rounded-xl p-6 shadow-inner">
              <QRCode
                id="qr-code-svg"
                value={url}
                size={256}
                level="H"
                bgColor="#ffffff"
                fgColor="#1a1a2e"
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                }}
              />
            </div>

            {/* Center logo overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <Logo size="md" className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-8 text-center">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-4">
            <p className="text-gray-200 text-sm mb-2">
              <span className="text-purple-400 font-semibold">Craig Sturgis</span>
            </p>
            <p className="text-gray-400 text-xs">
              Founder & AI-Augmented CTO
            </p>
            <p className="text-gray-500 text-xs mt-2 italic">
              "Get human help to build effectively with AI"
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleDownloadQR}
              className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-purple-500/30 rounded-lg text-white text-sm hover:border-purple-400/60 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Save QR
            </button>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105"
            >
              Preview Card →
            </a>
          </div>

          {/* Footer text */}
          <div className="mt-6">
            <p className="text-xs text-gray-500 font-mono animate-pulse">
              CONTAINS PLAYABLE EASTER EGG
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(10px) translateX(-10px);
          }
          75% {
            transform: translateY(-10px) translateX(20px);
          }
        }

        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}