'use client'

import { useState } from 'react'
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
  const [imageSrc, setImageSrc] = useState(() => {
    // For build-time optimized images, try to use optimized versions
    if (src.startsWith('/images/')) {
      const paths = getOptimizedPaths(src)
      return paths.avif // Start with best format
    }
    return src
  })
  
  const [hasError, setHasError] = useState(false)
  
  const handleError = () => {
    if (!hasError && src.startsWith('/images/')) {
      const paths = getOptimizedPaths(src)
      
      if (imageSrc === paths.avif) {
        // Try WebP next
        setImageSrc(paths.webp)
      } else if (imageSrc === paths.webp) {
        // Try optimized original format
        setImageSrc(paths.fallback)
      } else if (imageSrc === paths.fallback) {
        // Fall back to original
        setImageSrc(src)
        setHasError(true)
      }
    } else {
      setHasError(true)
    }
  }
  
  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
      sizes={sizes}
      quality={quality}
      onError={handleError}
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