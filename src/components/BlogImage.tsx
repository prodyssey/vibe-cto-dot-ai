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
    <figure className={`my-8 ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={800}
        height={400}
        className="rounded-lg shadow-lg w-full h-auto"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
      />
      {caption && (
        <figcaption className="text-sm text-gray-500 text-center mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Header image component for blog posts
interface BlogHeaderImageProps {
  src: string
  alt: string
}

export function BlogHeaderImage({ src, alt }: BlogHeaderImageProps) {
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