'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  // Advanced options for fallback behavior
  useOptimizedFallbacks?: boolean
  loading?: 'lazy' | 'eager'
}

// Helper to get optimized image paths
function getOptimizedPaths(src: string) {
  // Remove leading slash and extension
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src
  const pathWithoutExt = cleanSrc.replace(/\.[^/.]+$/, '')
  
  return {
    webp: `/optimized/${pathWithoutExt}.webp`,
    fallback: `/optimized/${cleanSrc}`
  }
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 75,
  useOptimizedFallbacks = true,
  loading = 'lazy'
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false)
  
  // Check if this is a local image that should use optimized fallbacks
  const isLocalImage = src.startsWith('/images/')
  const shouldUseOptimizedFallbacks = useOptimizedFallbacks && isLocalImage && !hasError
  
  // If we should use optimized fallbacks and haven't had an error
  if (shouldUseOptimizedFallbacks) {
    const paths = getOptimizedPaths(src)
    
    return (
      <div className={className}>
        <picture className="w-full h-full">        
          {/* WebP - good compression, wide support */}
          <source
            srcSet={paths.webp}
            type="image/webp"
            sizes={sizes}
          />
          
          {/* Optimized original format - fallback */}
          <source
            srcSet={paths.fallback}
            type={src.endsWith('.png') ? 'image/png' : 'image/jpeg'}
            sizes={sizes}
          />
          
          {/* Final fallback to Next.js Image with original src */}
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            className={fill ? 'object-cover w-full h-full' : 'w-full h-full object-cover'}
            priority={priority}
            sizes={sizes}
            quality={quality}
            loading={priority ? 'eager' : loading}
            unoptimized={false}
            onError={() => setHasError(true)}
          />
        </picture>
      </div>
    )
  }
  
  // Default to Next.js Image component for all other cases or after fallback
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
      sizes={sizes}
      quality={quality}
      loading={priority ? 'eager' : loading}
      unoptimized={false}
    />
  )
}