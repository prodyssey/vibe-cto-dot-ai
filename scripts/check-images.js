#!/usr/bin/env node

import { readdir, stat, access } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const optimizedDir = join(publicDir, 'optimized');

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

// Check if optimized versions exist
async function checkOptimizedVersions(originalPath) {
  const relativePath = originalPath.replace(publicDir + '/', '');
  const outputBase = join(optimizedDir, relativePath.replace(extname(relativePath), ''));
  
  const formats = ['.avif', '.webp'];
  const ext = extname(originalPath).toLowerCase();
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    formats.push(ext);
  }
  
  const existingFormats = [];
  for (const format of formats) {
    try {
      await access(outputBase + format);
      existingFormats.push(format);
    } catch {
      // File doesn't exist
    }
  }
  
  return existingFormats;
}

// Check images and warn about unoptimized ones
async function checkImages() {
  console.log('🔍 Checking for unoptimized images...');
  
  let imageFiles;
  try {
    const imagesDir = join(publicDir, 'images');
    await access(imagesDir);
    imageFiles = await getImageFiles(imagesDir);
  } catch (error) {
    console.log('ℹ️  No images directory found - nothing to check');
    return;
  }
  
  if (imageFiles.length === 0) {
    console.log('✅ No images found to check.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to check...`);
  
  const unoptimizedImages = [];
  const partiallyOptimizedImages = [];
  
  for (const filePath of imageFiles) {
    const relativePath = filePath.replace(publicDir + '/', '');
    const optimizedFormats = await checkOptimizedVersions(filePath);
    
    if (optimizedFormats.length === 0) {
      unoptimizedImages.push(relativePath);
    } else if (optimizedFormats.length < 3) {
      partiallyOptimizedImages.push({
        path: relativePath,
        formats: optimizedFormats
      });
    }
  }
  
  if (unoptimizedImages.length === 0 && partiallyOptimizedImages.length === 0) {
    console.log('✅ All images appear to be optimized!');
    return;
  }
  
  if (unoptimizedImages.length > 0) {
    console.log('\n⚠️  Unoptimized images found:');
    unoptimizedImages.forEach(path => {
      console.log(`   📷 ${path}`);
    });
  }
  
  if (partiallyOptimizedImages.length > 0) {
    console.log('\n⚠️  Partially optimized images (missing some formats):');
    partiallyOptimizedImages.forEach(({ path, formats }) => {
      console.log(`   📷 ${path} (has: ${formats.join(', ')})`);
    });
  }
  
  console.log('\n💡 To optimize images, run: npm run optimize-images');
  console.log('   This will generate WebP and AVIF versions for better performance.');
}

// Run check
checkImages().catch(console.error);