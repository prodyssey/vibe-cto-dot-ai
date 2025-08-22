#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

async function convertSvgToPng() {
  console.log('🔄 Converting SVG to PNG...');
  
  try {
    const svgPath = join(publicDir, 'vibe-cto-og.svg');
    const pngPath = join(publicDir, 'vibe-cto-og.png');
    
    // Check if SVG file exists
    if (!existsSync(svgPath)) {
      throw new Error(`SVG file not found: ${svgPath}`);
    }
    
    // Check if public directory exists
    if (!existsSync(publicDir)) {
      throw new Error(`Public directory not found: ${publicDir}`);
    }
    
    const svgBuffer = readFileSync(svgPath);
    
    await sharp(svgBuffer)
      .png({
        quality: 90,
        compressionLevel: 6
      })
      .toFile(pngPath);
    
    console.log('✅ SVG converted to PNG successfully!');
    console.log(`📁 Output: ${pngPath}`);
    console.log('📐 Dimensions: 1200x630 pixels');
    console.log('📄 Format: PNG');
    
  } catch (error) {
    console.error('❌ Failed to convert SVG:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

convertSvgToPng();