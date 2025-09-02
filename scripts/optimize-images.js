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

// File size thresholds for optimization (in bytes)
const OPTIMIZATION_THRESHOLDS = {
  '.jpg': 100 * 1024,  // 100KB
  '.jpeg': 100 * 1024, // 100KB
  '.png': 50 * 1024,   // 50KB (PNG tends to be larger)
};

// Minimum size improvement required to keep optimized version (in bytes)
const MIN_SIZE_IMPROVEMENT = 5 * 1024; // 5KB minimum improvement

// Check if an image needs optimization based on file size and existing optimized versions
async function needsOptimization(imagePath) {
  const ext = extname(imagePath).toLowerCase();
  const threshold = OPTIMIZATION_THRESHOLDS[ext];
  
  if (!threshold) {
    return false; // Unknown format, skip
  }
  
  try {
    const stats = await stat(imagePath);
    
    // If file is smaller than threshold, no need to optimize
    if (stats.size < threshold) {
      console.log(`📏 ${basename(imagePath)} (${Math.round(stats.size / 1024)}KB) is below optimization threshold`);
      return false;
    }
    
    // Check if optimized versions already exist and are recent
    const relativePath = imagePath.replace(publicDir + '/', '');
    const baseOutputPath = join(optimizedDir, relativePath.replace(ext, ''));
    
    const webpPath = baseOutputPath + '.webp';
    const avifPath = baseOutputPath + '.avif';
    const optimizedOriginalPath = baseOutputPath + ext;
    
    try {
      const webpStats = await stat(webpPath);
      const originalStats = await stat(imagePath);
      
      // If optimized version is newer than original, skip
      if (webpStats.mtime > originalStats.mtime) {
        console.log(`⚡ ${basename(imagePath)} already has recent optimized versions`);
        return false;
      }
    } catch (error) {
      // Optimized version doesn't exist, needs optimization
    }
    
    console.log(`🎯 ${basename(imagePath)} (${Math.round(stats.size / 1024)}KB) needs optimization`);
    return true;
  } catch (error) {
    console.warn(`⚠️  Cannot check ${basename(imagePath)}: ${error.message}`);
    return false;
  }
}

// Ensure optimized directory structure matches source structure
async function ensureOptimizedDirStructure(sourcePath) {
  const relativePath = sourcePath.replace(publicDir + '/', '');
  const optimizedPath = join(optimizedDir, dirname(relativePath));
  
  try {
    await mkdir(optimizedPath, { recursive: true });
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

// Get image files from public root (not subdirectories)
async function getRootImageFiles(publicDir) {
  const files = [];
  try {
    const entries = await readdir(publicDir);
    
    for (const entry of entries) {
      const fullPath = join(publicDir, entry);
      const stats = await stat(fullPath);
      
      if (stats.isFile()) {
        const ext = extname(entry).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  Cannot read public root: ${error.message}`);
  }
  
  return files;
}

// Optimize images and generate multiple formats (on-demand)
async function optimizeImages() {
  console.log('🖼️  Starting on-demand image optimization...');
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
  
  // Create base optimized directory
  try {
    await mkdir(optimizedDir, { recursive: true });
    console.log('✅ Created base optimized directory structure');
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.error('❌ Failed to create optimized directory:', error.message);
      console.log('⚠️  Skipping image optimization - directory creation failed');
      return;
    }
  }
  
  let imageFiles = [];
  
  // Scan all directories for images, not just /images
  try {
    const allDirs = ['images', 'lovable-uploads']; // Add any other image directories
    
    for (const dir of allDirs) {
      const dirPath = join(publicDir, dir);
      try {
        await access(dirPath);
        const dirImages = await getImageFiles(dirPath);
        imageFiles.push(...dirImages);
        console.log(`📁 Found ${dirImages.length} images in /${dir}`);
      } catch (error) {
        console.log(`ℹ️  Directory /${dir} not found or inaccessible - skipping`);
      }
    }
    
    // Also check for images directly in public root
    const rootImages = await getRootImageFiles(publicDir);
    imageFiles.push(...rootImages);
    if (rootImages.length > 0) {
      console.log(`📁 Found ${rootImages.length} images in public root`);
    }
  } catch (error) {
    console.log('ℹ️  No images found - skipping optimization');
    return;
  }
  
  if (imageFiles.length === 0) {
    console.log('No images found to scan for optimization.');
    return;
  }
  
  console.log(`📊 Found ${imageFiles.length} total images, checking which need optimization...`);
  
  // Filter images that actually need optimization
  const imagesToOptimize = [];
  for (const imagePath of imageFiles) {
    if (await needsOptimization(imagePath)) {
      imagesToOptimize.push(imagePath);
    }
  }
  
  if (imagesToOptimize.length === 0) {
    console.log('🎉 No images need optimization! All images are either small enough or already optimized.');
    return;
  }
  
  console.log(`🎯 ${imagesToOptimize.length} images need optimization...`);
  
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;
  
  for (const filePath of imagesToOptimize) {
    const relativePath = filePath.replace(publicDir + '/', '');
    const ext = extname(relativePath);
    const baseOutputPath = join(optimizedDir, relativePath.replace(ext, ''));
    
    try {
      // Ensure output directory structure matches source
      await ensureOptimizedDirStructure(filePath);
      
      console.log(`🔄 Optimizing: ${relativePath}`);
      
      let hasSuccess = false;
      const originalStats = await stat(filePath);
      const originalSize = originalStats.size;
      
      // Generate AVIF (skip in CI if problematic)
      if (isLocal) {
        try {
          const avifFiles = await imagemin([filePath], {
            destination: dirname(baseOutputPath),
            plugins: [
              imageminAvif({
                quality: 50,
                effort: isCI ? 4 : 6
              })
            ]
          });
          
          if (avifFiles.length > 0) {
            const avifPath = baseOutputPath + '.avif';
            const avifStats = await stat(avifPath);
            const savedBytes = originalSize - avifStats.size;
            
            if (savedBytes > MIN_SIZE_IMPROVEMENT) {
              console.log(`  ✅ AVIF: ${Math.round(savedBytes / 1024)}KB saved`);
              hasSuccess = true;
            } else {
              console.log(`  ⚠️  AVIF: Not enough improvement (${Math.round(savedBytes / 1024)}KB), keeping anyway`);
              hasSuccess = true;
            }
          }
        } catch (avifError) {
          console.warn(`  ⚠️  AVIF generation failed: ${avifError.message}`);
        }
      }
      
      // Generate WebP (more reliable in CI)
      try {
        const webpFiles = await imagemin([filePath], {
          destination: dirname(baseOutputPath),
          plugins: [
            imageminWebp({
              quality: 75,
              method: isCI ? 4 : 6
            })
          ]
        });
        
        if (webpFiles.length > 0) {
          const webpPath = baseOutputPath + '.webp';
          const webpStats = await stat(webpPath);
          const savedBytes = originalSize - webpStats.size;
          
          if (savedBytes > MIN_SIZE_IMPROVEMENT) {
            console.log(`  ✅ WebP: ${Math.round(savedBytes / 1024)}KB saved`);
            hasSuccess = true;
          } else {
            console.log(`  ⚠️  WebP: Not enough improvement (${Math.round(savedBytes / 1024)}KB), keeping anyway`);
            hasSuccess = true;
          }
        }
      } catch (webpError) {
        console.warn(`  ⚠️  WebP generation failed: ${webpError.message}`);
      }
      
      // Optimize original format as fallback
      try {
        if (ext === '.png') {
          const pngFiles = await imagemin([filePath], {
            destination: dirname(baseOutputPath),
            plugins: [
              imageminPngquant({
                quality: [0.6, 0.8],
                speed: isCI ? 1 : 3
              })
            ]
          });
          
          if (pngFiles.length > 0) {
            const optimizedPath = baseOutputPath + ext;
            const optimizedStats = await stat(optimizedPath);
            const savedBytes = originalSize - optimizedStats.size;
            
            if (savedBytes > MIN_SIZE_IMPROVEMENT) {
              console.log(`  ✅ PNG: ${Math.round(savedBytes / 1024)}KB saved`);
              hasSuccess = true;
            } else {
              console.log(`  ⚠️  PNG: Not enough improvement (${Math.round(savedBytes / 1024)}KB), keeping anyway`);
              hasSuccess = true;
            }
          }
        } else if (['.jpg', '.jpeg'].includes(ext)) {
          const jpegFiles = await imagemin([filePath], {
            destination: dirname(baseOutputPath),
            plugins: [
              imageminMozjpeg({
                quality: 80,
                progressive: true
              })
            ]
          });
          
          if (jpegFiles.length > 0) {
            const optimizedPath = baseOutputPath + ext;
            const optimizedStats = await stat(optimizedPath);
            const savedBytes = originalSize - optimizedStats.size;
            
            if (savedBytes > MIN_SIZE_IMPROVEMENT) {
              console.log(`  ✅ JPEG: ${Math.round(savedBytes / 1024)}KB saved`);
              hasSuccess = true;
            } else {
              console.log(`  ⚠️  JPEG: Not enough improvement (${Math.round(savedBytes / 1024)}KB), keeping anyway`);
              hasSuccess = true;
            }
          }
        }
      } catch (originalError) {
        console.warn(`  ⚠️  Original format optimization failed: ${originalError.message}`);
      }
      
      if (hasSuccess) {
        console.log(`  ✅ Successfully optimized: ${relativePath}`);
        successCount++;
      } else {
        console.log(`  ⚠️  No formats generated for: ${relativePath}`);
        errorCount++;
      }
    } catch (error) {
      console.error(`  ❌ Failed to optimize ${relativePath}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n🎉 On-demand image optimization complete!');
  console.log(`📊 Summary:`);
  console.log(`  • Total images scanned: ${imageFiles.length}`);
  console.log(`  • Images needing optimization: ${imagesToOptimize.length}`);
  console.log(`  • Successfully optimized: ${successCount}`);
  console.log(`  • Errors: ${errorCount}`);
  console.log(`  • Optimized images stored in: /public/optimized/`);
  
  if (successCount > 0) {
    console.log(`\n💡 Tip: Optimized images are organized in subfolders matching your source structure`);
    console.log(`   Original: /public/images/posts/example.jpg`);  
    console.log(`   Optimized: /public/optimized/images/posts/example.webp`);
  }
  
  // Don't fail the build if some optimizations fail
  if (successCount === 0 && imagesToOptimize.length > 0) {
    console.log('⚠️  No images were successfully optimized, but continuing build...');
  }
}

// Run optimization
optimizeImages().catch(console.error);