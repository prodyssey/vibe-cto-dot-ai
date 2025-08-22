'use client'

import React from 'react'
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
  quality = 75
}: OptimizedImageProps) {
  // Simplified approach: use Next.js built-in optimization as primary,
  // with our build-time optimization as a bonus when available
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
      unoptimized={false} // Enable Next.js optimization
    />
  )
}

// Picture element version for maximum browser support and control
interface OptimizedPictureProps extends OptimizedImageProps {
  loading?: 'lazy' | 'eager'
}

export function OptimizedPicture({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  sizes = '100vw'
}: OptimizedPictureProps) {
  if (!src.startsWith('/images/')) {
    // For non-local images, use regular Image component
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        sizes={sizes}
      />
    )
  }
  
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
      
      {/* Final fallback to original */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className="w-full h-full object-cover"
      />
    </picture>
  )
}