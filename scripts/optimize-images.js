#!/usr/bin/env node

import { readdir, mkdir, stat } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminAvif from 'imagemin-avif';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

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
  
  await ensureOptimizedDir();
  
  const imageFiles = await getImageFiles(join(publicDir, 'images'));
  
  if (imageFiles.length === 0) {
    console.log('No images found to optimize.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to optimize...`);
  
  for (const filePath of imageFiles) {
    const relativePath = filePath.replace(publicDir + '/', '');
    const outputBase = join(optimizedDir, relativePath.replace(extname(relativePath), ''));
    const outputDir = dirname(outputBase);
    
    // Ensure output directory exists
    await mkdir(outputDir, { recursive: true });
    
    console.log(`Optimizing: ${relativePath}`);
    
    try {
      // Generate AVIF (best compression) - with error handling
      try {
        await imagemin([filePath], {
          destination: dirname(outputBase),
          plugins: [
            imageminAvif({
              quality: 50,
              effort: 6
            })
          ]
        });
      } catch (avifError) {
        console.warn(`⚠️  AVIF generation failed for ${relativePath}: ${avifError.message}`);
      }
      
      // Generate WebP (good compression, wide support)
      try {
        await imagemin([filePath], {
          destination: dirname(outputBase),
          plugins: [
            imageminWebp({
              quality: 75
            })
          ]
        });
      } catch (webpError) {
        console.warn(`⚠️  WebP generation failed for ${relativePath}: ${webpError.message}`);
      }
      
      // Optimize original format as fallback
      const ext = extname(filePath).toLowerCase();
      if (ext === '.png') {
        await imagemin([filePath], {
          destination: dirname(outputBase),
          plugins: [
            imageminPngquant({
              quality: [0.6, 0.8]
            })
          ]
        });
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
      }
      
      console.log(`✅ Optimized: ${relativePath}`);
    } catch (error) {
      console.error(`❌ Failed to optimize ${relativePath}:`, error.message);
    }
  }
  
  console.log('🎉 Image optimization complete!');
}

// Run optimization
optimizeImages().catch(console.error);