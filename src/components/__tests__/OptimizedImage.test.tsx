import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import { OptimizedImage } from '@/components/OptimizedImage'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: vi.fn(({ src, alt, className, onError, priority, loading, ...props }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      data-testid="next-image"
      onError={onError}
      loading={loading || 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      {...props}
    />
  ))
}))

describe('OptimizedImage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders with basic props', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
        />
      )
      
      // Should render a picture element for optimized images
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    it('renders with fill prop', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          fill
          className="custom-class"
        />
      )
      
      const image = screen.getByRole('img')
      expect(image).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
          className="custom-test-class"
        />
      )
      
      const image = screen.getByRole('img')
      expect(image).toHaveClass('custom-test-class')
    })

    it('applies className correctly for non-fill images', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
          className="custom-class"
        />
      )
      
      const image = screen.getByRole('img')
      // Should include both custom class and default classes
      expect(image).toHaveClass('custom-class', 'w-full', 'h-full', 'object-cover')
    })

    it('handles empty className correctly', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
          className=""
        />
      )
      
      const image = screen.getByRole('img')
      expect(image).toHaveClass('w-full', 'h-full', 'object-cover')
    })
  })

  describe('Path Detection', () => {
    it('detects local images with /images/ path', () => {
      render(
        <OptimizedImage
          src="/images/local-image.png"
          alt="Local image"
          width={400}
          height={300}
        />
      )
      
      // Should render picture element with sources for local images
      const pictureElement = screen.getByRole('img').closest('picture')
      expect(pictureElement).toBeInTheDocument()
    })

    it('handles external images by using Next.js Image directly', () => {
      render(
        <OptimizedImage
          src="https://example.com/external-image.png"
          alt="External image"
          width={400}
          height={300}
          useOptimizedFallbacks={false}
        />
      )
      
      // Should render Next.js Image component directly
      expect(screen.getByTestId('next-image')).toBeInTheDocument()
    })

    it('uses Next.js Image for relative paths without /images/', () => {
      render(
        <OptimizedImage
          src="/some-other-path/image.png"
          alt="Other path image"
          width={400}
          height={300}
        />
      )
      
      // Should use Next.js Image directly since it's not in /images/
      expect(screen.getByTestId('next-image')).toBeInTheDocument()
    })
  })

  describe('Optimized Format Sources', () => {
    it('generates correct optimized paths for images', () => {
      const { container } = render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
        />
      )
      
      // Check for WebP source
      const webpSource = container.querySelector('source[type="image/webp"]')
      expect(webpSource).toHaveAttribute('srcSet', '/optimized/images/test-image.webp')
      
      // Check for original optimized source
      const originalSource = container.querySelector('source[type="image/png"]')
      expect(originalSource).toHaveAttribute('srcSet', '/optimized/images/test-image.png')
    })

    it('handles JPEG images correctly', () => {
      const { container } = render(
        <OptimizedImage
          src="/images/photo.jpg"
          alt="JPEG photo"
          width={400}
          height={300}
        />
      )
      
      const originalSource = container.querySelector('source[type="image/jpeg"]')
      expect(originalSource).toHaveAttribute('srcSet', '/optimized/images/photo.jpg')
    })

    it('handles nested paths correctly', () => {
      const { container } = render(
        <OptimizedImage
          src="/images/posts/blog-image.png"
          alt="Blog image"
          width={400}
          height={300}
        />
      )
      
      const webpSource = container.querySelector('source[type="image/webp"]')
      expect(webpSource).toHaveAttribute('srcSet', '/optimized/images/posts/blog-image.webp')
    })
  })

  describe('Fallback Behavior', () => {
    it('fallbacks to Next.js Image when useOptimizedFallbacks is false', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
          useOptimizedFallbacks={false}
        />
      )
      
      // Should use Next.js Image directly
      expect(screen.getByTestId('next-image')).toBeInTheDocument()
    })

    it('handles onError callback correctly', async () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
        />
      )
      
      const image = screen.getByRole('img')
      
      // Trigger error on the Next.js Image component
      const errorEvent = new Event('error')
      image.dispatchEvent(errorEvent)
      
      // Component should still be present (error handling is internal)
      expect(image).toBeInTheDocument()
    })
  })

  describe('Props Forwarding', () => {
    it('forwards all Next.js Image props correctly', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
          priority
          quality={90}
          loading="eager"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )
      
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt', 'Test image')
      expect(image).toHaveAttribute('loading', 'eager')
    })

    it('applies sizes attribute to picture sources', () => {
      const { container } = render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )
      
      const sources = container.querySelectorAll('source')
      sources.forEach(source => {
        expect(source).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw')
      })
    })
  })

  describe('Performance Optimizations', () => {
    it('sets priority correctly', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
          priority
        />
      )
      
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('fetchpriority', 'high')
    })

    it('defaults to lazy loading', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
        />
      )
      
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('loading', 'lazy')
    })

    it('allows override of loading behavior', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
          loading="eager"
        />
      )
      
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('loading', 'eager')
    })
  })

  describe('Edge Cases', () => {
    it('handles images without extensions', () => {
      const { container } = render(
        <OptimizedImage
          src="/images/test-image"
          alt="Image without extension"
          width={400}
          height={300}
        />
      )
      
      // Should still try to create optimized paths
      const webpSource = container.querySelector('source[type="image/webp"]')
      expect(webpSource).toHaveAttribute('srcSet', '/optimized/images/test-image.webp')
    })

    it('handles undefined className gracefully', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
        />
      )
      
      const image = screen.getByRole('img')
      // Should have default classes but handle undefined className
      expect(image).toHaveClass('w-full', 'h-full', 'object-cover')
    })

    it('handles fill prop with className', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          fill
          className="custom-fill-class"
        />
      )
      
      const image = screen.getByRole('img')
      expect(image).toHaveClass('custom-fill-class')
      // Should not have the default object-cover classes when fill is true
      expect(image).not.toHaveClass('w-full', 'h-full', 'object-cover')
    })
  })

  describe('Accessibility', () => {
    it('provides proper alt text', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Descriptive alt text"
          width={400}
          height={300}
        />
      )
      
      const image = screen.getByAltText('Descriptive alt text')
      expect(image).toBeInTheDocument()
    })

    it('maintains img role', () => {
      render(
        <OptimizedImage
          src="/images/test-image.png"
          alt="Test image"
          width={400}
          height={300}
        />
      )
      
      const image = screen.getByRole('img')
      expect(image).toBeInTheDocument()
    })
  })
})