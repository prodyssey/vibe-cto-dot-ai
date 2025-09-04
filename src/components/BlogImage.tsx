'use client'

import { OptimizedImage } from './OptimizedImage'

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
  if (videoSrc) {
    return (
      <div className="mb-8 rounded-lg overflow-hidden bg-gray-900/50">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-contain"
          poster={src} // Use still image as poster if available
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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