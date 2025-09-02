# Image Optimization - On-Demand System

This project uses an on-demand image optimization system that only processes images when they need optimization, storing optimized variants in organized subfolders.

## How It Works

### Intelligent Detection
The system automatically detects which images need optimization based on:
- **File size thresholds**: JPEGs/JPGs > 100KB, PNGs > 50KB
- **Existing optimized versions**: Skips if optimized versions are newer than originals
- **Minimum improvement**: Only keeps optimized versions that save at least 5KB

### Organized Storage
Optimized images are stored in `/public/optimized/` with the same folder structure as the source:

```
public/
├── images/
│   └── posts/
│       └── example.jpg (500KB)
└── optimized/
    └── images/
        └── posts/
            ├── example.webp (120KB)
            ├── example.avif (90KB)
            └── example.jpg (300KB)
```

## Usage Commands

### Manual Optimization (Recommended)
```bash
# Run on-demand optimization
npm run optimize-images

# Force optimization (ignores skip flags)
npm run optimize-images:force
```

### Build Commands
```bash
# Build without optimization (default - faster)
npm run build

# Build with optimization (when you need fresh optimized images)
npm run build:with-images

# Legacy: Build explicitly skipping images
npm run build:skip-images
```

## Output Formats

For each optimized image, the system generates:
- **WebP**: Modern format with excellent compression (75% quality)
- **AVIF**: Next-gen format with superior compression (50% quality, local only)
- **Optimized Original**: Compressed version in original format (PNG: 60-80% quality, JPEG: 80% quality)

## Environment Variables

- `SKIP_IMAGE_OPTIMIZATION=true` - Completely disable optimization
- `CI=true` - Detected automatically, uses faster settings for CI/CD

## Benefits

1. **Faster Builds**: No automatic optimization slowing down every build
2. **Smart Detection**: Only processes images that actually need optimization
3. **Clean Organization**: Optimized images don't clutter source folders
4. **Multiple Formats**: Provides WebP, AVIF, and optimized originals
5. **Size Tracking**: Shows exactly how much space each optimization saves

## When to Run

Run `npm run optimize-images` when:
- You add new images to the project
- You modify existing images
- You want to regenerate optimized versions
- Before deploying to production (optional)

The system is smart enough to skip images that don't need optimization, making it fast to run regularly.