'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { OptimizedImage } from './OptimizedImage'
import { Button } from './ui/button'

interface BlogImageProps {
  src: string
  alt: string
  className?: string
  caption?: string
}

export function BlogImage({ src, alt, className = '', caption }: BlogImageProps) {
  return (
    <span className={`inline-block my-8 w-full ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={800}
        height={400}
        className="rounded-lg shadow-lg w-full h-auto max-w-2xl max-h-96 object-contain mx-auto bg-white/5 p-4"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
      />
      {caption && (
        <span className="block text-sm text-gray-300 text-center mt-3 px-2 leading-relaxed">
          {caption}
        </span>
      )}
    </span>
  )
}

// Header media component for blog posts (supports both images and videos)
interface BlogHeaderMediaProps {
  src?: string
  videoSrc?: string
  alt: string
}

export function BlogHeaderMedia({ src, videoSrc, alt }: BlogHeaderMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [allowLoop, setAllowLoop] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Enable looping when user manually plays
        setAllowLoop(true);
        videoRef.current.loop = true;
        videoRef.current.play();
        setHasEnded(false);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      // Enable looping when user manually replays
      setAllowLoop(true);
      videoRef.current.loop = true;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setHasEnded(false);
    }
  };

  // Auto-play on first view using Intersection Observer
  useEffect(() => {
    if (!videoSrc || !containerRef.current || !videoRef.current) {return;}

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAutoPlayed && videoRef.current) {
          videoRef.current.play();
          setHasAutoPlayed(true);
        }
      },
      {
        threshold: 0.5, // Play when 50% of video is visible
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [videoSrc, hasAutoPlayed]);

  if (videoSrc) {
    return (
      <div ref={containerRef} className="mb-8 rounded-lg overflow-hidden bg-gray-900/50 relative">
        <video
          ref={videoRef}
          muted={isMuted}
          playsInline
          className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-contain"
          poster={src} // Use still image as poster if available
          onEnded={handleVideoEnded}
          onPlay={handlePlay}
          onPause={handlePause}
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
          <track kind="captions" srcLang="en" label="English captions" />
          Your browser does not support the video tag.
        </video>

        {/* Video Controls Overlay */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {hasEnded && (
            <Button
              onClick={handleReplay}
              size="sm"
              className="bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white border-0 rounded-lg shadow-lg"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
          {!hasEnded && (
            <Button
              onClick={handlePlayPause}
              size="sm"
              className="bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white border-0 rounded-lg shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          )}
          <Button
            onClick={toggleMute}
            size="sm"
            className="bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white border-0 rounded-lg shadow-lg"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (src) {
    return (
      <div className="mb-8 rounded-lg overflow-hidden bg-gray-900/50">
        <OptimizedImage
          src={src}
          alt={alt}
          width={1200}
          height={630}
          priority
          className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-contain"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      </div>
    )
  }

  return null
}

// Backward compatibility
export function BlogHeaderImage({ src, alt }: { src: string; alt: string }) {
  return <BlogHeaderMedia src={src} alt={alt} />
}