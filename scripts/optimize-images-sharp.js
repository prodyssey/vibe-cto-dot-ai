#!/usr/bin/env node

import { readdir, mkdir, stat, access } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

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

// Safely get file stats, returning null if file doesn't exist
async function getFileStat(filePath) {
  try {
    return await stat(filePath);
  } catch (error) {
    return null; // File doesn't exist or can't be accessed
  }
}

// Check if image needs optimization
async function needsOptimization(sourceFile, outputBase) {
  try {
    const sourceStat = await stat(sourceFile);
    
    // Get stats for optimized files (null if they don't exist)
    const webpStat = await getFileStat(`${outputBase}.webp`);
    const ext = extname(sourceFile).toLowerCase();
    const originalFormatFile = ext === '.png' ? `${outputBase}.png` : 
      ['.jpg', '.jpeg'].includes(ext) ? `${outputBase}.jpg` : null;
    const originalStat = originalFormatFile ? await getFileStat(originalFormatFile) : null;
    
    // If neither optimized file exists, we need optimization
    if (!webpStat && !originalStat) {
      return true;
    }
    
    // Check modification times - if source is newer than optimized files, re-optimize
    if (webpStat && sourceStat.mtime > webpStat.mtime) {
      return true;
    }
    
    if (originalStat && sourceStat.mtime > originalStat.mtime) {
      return true;
    }
    
    return false; // Already optimized and up to date
  } catch (error) {
    // If we can't check, assume we need optimization
    return true;
  }
}

// Optimize images using Sharp
async function optimizeImages() {
  console.log('🖼️  Starting image optimization with Sharp...');
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
  
  console.log(`Found ${imageFiles.length} images to process...`);
  
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;
  
  for (const filePath of imageFiles) {
    const relativePath = filePath.replace(publicDir + '/', '');
    const outputBase = join(optimizedDir, relativePath.replace(extname(relativePath), ''));
    const outputDir = dirname(outputBase);
    
    try {
      // Check if optimization is needed
      const needsOpt = await needsOptimization(filePath, outputBase);
      if (!needsOpt) {
        console.log(`⏭️  Skipping already optimized: ${relativePath}`);
        skippedCount++;
        continue;
      }
      
      // Ensure output directory exists
      await mkdir(outputDir, { recursive: true });
      
      console.log(`🔄 Optimizing: ${relativePath}`);
      
      let hasSuccess = false;
      
      // Generate WebP using Sharp
      try {
        await sharp(filePath)
          .webp({ quality: 80, effort: isCI ? 2 : 6 })
          .toFile(`${outputBase}.webp`);
        hasSuccess = true;
      } catch (webpError) {
        console.warn(`⚠️  WebP generation failed for ${relativePath}: ${webpError.message}`);
      }
      
      // Optimize original format as fallback using Sharp
      try {
        const ext = extname(filePath).toLowerCase();
        if (ext === '.png') {
          await sharp(filePath)
            .png({ quality: 80, compressionLevel: 8 })
            .toFile(`${outputBase}.png`);
          hasSuccess = true;
        } else if (['.jpg', '.jpeg'].includes(ext)) {
          await sharp(filePath)
            .jpeg({ quality: 80, progressive: true })
            .toFile(`${outputBase}.jpg`);
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
  
  console.log(`🎉 Image optimization complete! ✅ ${successCount} optimized, ⏭️ ${skippedCount} skipped, ⚠️ ${errorCount} errors`);
  
  // Don't fail the build if some optimizations fail
  if (successCount === 0 && skippedCount === 0 && imageFiles.length > 0) {
    console.log('⚠️  No images were optimized, but continuing build...');
  }
}

// Run optimization
optimizeImages().catch(console.error);