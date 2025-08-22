#!/usr/bin/env node

import { readdir, mkdir, stat, access } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminAvif from 'imagemin-avif';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

// Environment detection
const isCI = process.env.CI === 'true' || process.env.NETLIFY === 'true';
const isLocal = !isCI;

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const optimizedDir = join(publicDir, 'optimized');

// Ensure optimized directory exists
async function ensureOptimizedDir() {
  try {
    await mkdir(optimizedDir, { recursive: true });
    await mkdir(join(optimizedDir, 'images'), { recursive: true });
    await mkdir(join(optimizedDir, 'images', 'posts'), { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// Get all image files recursively
async function getImageFiles(dir, files = []) {
  const entries = await readdir(dir);
  
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory() && entry !== 'optimized') {
      await getImageFiles(fullPath, files);
    } else if (stats.isFile()) {
      const ext = extname(entry).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// Optimize images and generate multiple formats
async function optimizeImages() {
  console.log('🖼️  Starting image optimization...');
  console.log(`Environment: ${isCI ? 'CI/CD' : 'Local'}`);
  console.log(`Node version: ${process.version}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Working directory: ${process.cwd()}`);
  console.log(`Public directory: ${publicDir}`);
  console.log(`Optimized directory: ${optimizedDir}`);
  
  // Check if we should skip optimization entirely
  if (process.env.SKIP_IMAGE_OPTIMIZATION === 'true') {
    console.log('⏭️  Skipping image optimization (SKIP_IMAGE_OPTIMIZATION=true)');
    return;
  }
  
  try {
    await ensureOptimizedDir();
    console.log('✅ Created optimized directory structure');
  } catch (error) {
    console.error('❌ Failed to create optimized directory:', error.message);
    console.log('⚠️  Skipping image optimization - directory creation failed');
    return;
  }
  
  let imageFiles;
  try {
    const imagesDir = join(publicDir, 'images');
    await access(imagesDir);
    imageFiles = await getImageFiles(imagesDir);
  } catch (error) {
    console.log('ℹ️  No images directory found - skipping optimization');
    return;
  }
  
  if (imageFiles.length === 0) {
    console.log('No images found to optimize.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to optimize...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const filePath of imageFiles) {
    const relativePath = filePath.replace(publicDir + '/', '');
    const outputBase = join(optimizedDir, relativePath.replace(extname(relativePath), ''));
    const outputDir = dirname(outputBase);
    
    try {
      // Ensure output directory exists
      await mkdir(outputDir, { recursive: true });
      
      console.log(`Optimizing: ${relativePath}`);
      
      let hasSuccess = false;
      
      // Skip AVIF in CI environments if it's problematic
      if (isLocal) {
        try {
          await imagemin([filePath], {
            destination: dirname(outputBase),
            plugins: [
              imageminAvif({
                quality: 50,
                effort: isCI ? 4 : 6 // Lower effort in CI for speed
              })
            ]
          });
          hasSuccess = true;
        } catch (avifError) {
          console.warn(`⚠️  AVIF generation failed for ${relativePath}: ${avifError.message}`);
        }
      }
      
      // Generate WebP (more reliable in CI)
      try {
        await imagemin([filePath], {
          destination: dirname(outputBase),
          plugins: [
            imageminWebp({
              quality: 75,
              method: isCI ? 4 : 6 // Faster method in CI
            })
          ]
        });
        hasSuccess = true;
      } catch (webpError) {
        console.warn(`⚠️  WebP generation failed for ${relativePath}: ${webpError.message}`);
      }
      
      // Optimize original format as fallback
      try {
        const ext = extname(filePath).toLowerCase();
        if (ext === '.png') {
          await imagemin([filePath], {
            destination: dirname(outputBase),
            plugins: [
              imageminPngquant({
                quality: [0.6, 0.8],
                speed: isCI ? 1 : 3 // Faster in CI
              })
            ]
          });
          hasSuccess = true;
        } else if (['.jpg', '.jpeg'].includes(ext)) {
          await imagemin([filePath], {
            destination: dirname(outputBase),
            plugins: [
              imageminMozjpeg({
                quality: 80,
                progressive: true
              })
            ]
          });
          hasSuccess = true;
        }
      } catch (originalError) {
        console.warn(`⚠️  Original format optimization failed for ${relativePath}: ${originalError.message}`);
      }
      
      if (hasSuccess) {
        console.log(`✅ Optimized: ${relativePath}`);
        successCount++;
      } else {
        console.log(`⚠️  No formats generated for: ${relativePath}`);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Failed to optimize ${relativePath}:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`🎉 Image optimization complete! ✅ ${successCount} success, ⚠️ ${errorCount} errors`);
  
  // Don't fail the build if some optimizations fail
  if (successCount === 0 && imageFiles.length > 0) {
    console.log('⚠️  No images were optimized, but continuing build...');
  }
}

// Run optimization
optimizeImages().catch(console.error);