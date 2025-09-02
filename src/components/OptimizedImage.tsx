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
    avif: `/optimized/${pathWithoutExt}.avif`,
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
  const [useNextjsOptimization, setUseNextjsOptimization] = useState(true)
  
  // Check if this is a local image that should use optimized fallbacks
  const isLocalImage = src.startsWith('/images/') || src.startsWith('/lovable-uploads/')
  const shouldUseOptimizedFallbacks = useOptimizedFallbacks && isLocalImage
  
  // If we should use optimized fallbacks and we haven't fallen back to Next.js yet
  if (shouldUseOptimizedFallbacks && useNextjsOptimization) {
    const paths = getOptimizedPaths(src)
    
    return (
      <picture className={className}>
        {/* AVIF - best compression */}
        <source
          srcSet={paths.avif}
          type="image/avif"
          sizes={sizes}
        />
        
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
          className={fill ? className : `${className || ''} w-full h-full object-cover`.trim()}
          priority={priority}
          sizes={sizes}
          quality={quality}
          loading={loading}
          unoptimized={false}
          onError={() => setUseNextjsOptimization(false)}
        />
      </picture>
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
      loading={loading}
      unoptimized={false}
    />
  )
}