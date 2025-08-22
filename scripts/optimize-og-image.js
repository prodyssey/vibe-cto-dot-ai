#!/usr/bin/env node

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, statSync } from 'fs';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

async function optimizeOGImage() {
  console.log('🎨 Optimizing OG image...');
  
  try {
    const inputPath = join(publicDir, 'vibe-cto-og.png');
    const outputPath = join(publicDir, 'vibe-cto-og-optimized.png');
    
    // Check if input file exists
    if (!existsSync(inputPath)) {
      throw new Error(`OG image not found: ${inputPath}`);
    }
    
    // Get current file size
    const currentStats = statSync(inputPath);
    const currentSizeMB = (currentStats.size / 1024 / 1024).toFixed(2);
    console.log(`📏 Current file size: ${currentSizeMB}MB`);
    
    // Optimize the image with aggressive compression for web use
    await sharp(inputPath)
      .png({
        quality: 80,           // Good quality while reducing file size
        compressionLevel: 9,   // Maximum compression
        palette: true,         // Use palette compression when beneficial
        effort: 10             // Maximum effort for best compression
      })
      .toFile(outputPath);
    
    // Get optimized file size
    const optimizedStats = statSync(outputPath);
    const optimizedSizeMB = (optimizedStats.size / 1024 / 1024).toFixed(2);
    const reduction = ((1 - optimizedStats.size / currentStats.size) * 100).toFixed(1);
    
    console.log(`✅ Optimization complete!`);
    console.log(`📁 Original: ${inputPath} (${currentSizeMB}MB)`);
    console.log(`📁 Optimized: ${outputPath} (${optimizedSizeMB}MB)`);
    console.log(`📉 Size reduction: ${reduction}%`);
    console.log(`💡 To replace original: mv "${outputPath}" "${inputPath}"`);
    
  } catch (error) {
    console.error('❌ Failed to optimize OG image:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

optimizeOGImage();